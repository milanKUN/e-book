import crypto from 'crypto';

// A simple utility to sign a JWT-like token for secure, stateless download access.
// We use HMAC SHA-256 for symmetric signing without needing a database.
function generateDownloadToken(orderId) {
  const secret = process.env.EBOOK_DOWNLOAD_SECRET;
  if (!secret) {
    console.error('EBOOK_DOWNLOAD_SECRET is missing! Downloads will be unsecured or fail.');
  }
  
  // Expiration: 1 hour (3600 seconds) from now
  const exp = Math.floor(Date.now() / 1000) + 3600;
  
  // Create base64url encoded payload
  const payloadStr = JSON.stringify({ orderId, exp });
  const payload = Buffer.from(payloadStr).toString('base64url');
  
  // Create signature
  const signature = crypto
    .createHmac('sha256', secret || 'fallback_do_not_use_in_prod')
    .update(payload)
    .digest('base64url');
    
  return `${payload}.${signature}`;
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { order_id } = JSON.parse(event.body || '{}');

    if (!order_id) {
      return { statusCode: 400, body: JSON.stringify({ error: 'order_id is required' }) };
    }

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const env = process.env.CASHFREE_ENVIRONMENT || 'sandbox';

    if (!appId || !secretKey) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Server configuration error.' }) };
    }

    const baseUrl = env === 'production' 
      ? 'https://api.cashfree.com/pg' 
      : 'https://sandbox.cashfree.com/pg';

    // Secure Server-to-Server Verification
    // Call Cashfree API directly to get the true status of the order.
    // NEVER trust frontend state alone.
    const response = await fetch(`${baseUrl}/orders/${order_id}/payments`, {
      method: 'GET',
      headers: {
        'x-client-id': appId,
        'x-client-secret': secretKey,
        'x-api-version': '2023-08-01',
        'Accept': 'application/json'
      }
    });

    const payments = await response.json();

    if (!response.ok) {
      console.error('Cashfree Verification Error:', payments);
      // It might be a 404 if the order hasn't registered payments yet
      if (response.status === 404) {
         return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'PENDING', message: 'No payments found for this order yet.' })
         };
      }
      return { statusCode: response.status, body: JSON.stringify({ error: 'Failed to verify payment status with gateway.' }) };
    }

    // Cashfree returns an array of payment attempts for the order.
    // We look for any payment marked as 'SUCCESS'
    const successfulPayment = payments.find(p => p.payment_status === 'SUCCESS');

    if (successfulPayment) {
      // Payment is verified as SUCCESS.
      // Generate a short-lived download token so the user can securely fetch the PDF.
      const downloadToken = generateDownloadToken(order_id);
      
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'SUCCESS',
          message: 'Payment verified successfully.',
          download_token: downloadToken
        })
      };
    } else {
      // Check if any payment is pending
      const pendingPayment = payments.find(p => p.payment_status === 'PENDING');
      
      if (pendingPayment) {
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'PENDING', message: 'Payment is still processing.' })
        };
      } else {
        // All attempts failed or were cancelled
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'FAILED', message: 'Payment failed or was cancelled.' })
        };
      }
    }

  } catch (error) {
    console.error('Internal Error verifying payment:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) };
  }
};
