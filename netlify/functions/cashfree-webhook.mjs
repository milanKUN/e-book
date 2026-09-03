import crypto from 'crypto';

/**
 * Cashfree Webhook Signature Verification
 * Source of truth: Cashfree API Webhook Verification documentation
 */
function verifyWebhookSignature(rawBody, signature, timestamp, secretKey) {
  try {
    // The payload to sign is: timestamp + raw_body
    const payload = `${timestamp}${rawBody}`;
    
    const expectedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(payload)
      .digest('base64');
      
    return signature === expectedSignature;
  } catch (error) {
    console.error('Signature verification calculation error:', error);
    return false;
  }
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    if (!secretKey) {
      console.error('Missing CASHFREE_SECRET_KEY for webhook verification.');
      return { statusCode: 500, body: 'Configuration error' };
    }

    // Cashfree sends these headers for verification
    const signature = event.headers['x-webhook-signature'];
    const timestamp = event.headers['x-webhook-timestamp'];
    const rawBody = event.body;

    if (!signature || !timestamp) {
      console.error('Missing required webhook signature headers.');
      return { statusCode: 400, body: 'Missing signature' };
    }

    // 1. Verify the signature strictly to prevent spoofing
    const isValid = verifyWebhookSignature(rawBody, signature, timestamp, secretKey);
    
    if (!isValid) {
      console.error('CRITICAL: Webhook signature verification failed! Possible spoofing attempt.');
      return { statusCode: 401, body: 'Invalid signature' };
    }

    // 2. Parse the verified payload
    const payload = JSON.parse(rawBody);
    
    const eventType = payload.type;
    const orderData = payload.data?.order;
    const paymentData = payload.data?.payment;
    const customerDetails = payload.data?.customer_details;

    console.log(`[Webhook] Verified event received: ${eventType} for order: ${orderData?.order_id}`);

    // NO DATABASE LIMITATION:
    // Without a database, we cannot reliably store this order status permanently.
    // If we wanted to send a confirmation email securely, we would do it here.
    // Since there is no database to check if we already sent it, idempotency is tricky,
    // but we can log the success reliably.

    if (eventType === 'PAYMENT_SUCCESS_WEBHOOK') {
      // Confirm the internal payment status is SUCCESS
      if (paymentData?.payment_status === 'SUCCESS') {
        console.log(`[Webhook] SUCCESS CONFIRMED: Order ${orderData?.order_id} is paid.`);
        console.log(`Amount: ${paymentData?.payment_amount} ${paymentData?.payment_currency}`);
        console.log(`Customer: ${customerDetails?.customer_email}`);
        
        // TODO (Future): If an email provider (like SendGrid/Resend) is added, trigger email delivery here.
      }
    } else if (eventType === 'PAYMENT_FAILED_WEBHOOK') {
      console.log(`[Webhook] FAILED: Order ${orderData?.order_id} payment failed or was dropped.`);
    } else {
       console.log(`[Webhook] Ignored event type: ${eventType}`);
    }

    // 3. Return 200 OK so Cashfree knows we processed it and doesn't retry infinitely
    return {
      statusCode: 200,
      body: 'Webhook processed successfully'
    };

  } catch (error) {
    console.error('Webhook processing error:', error);
    // Return 500 without leaking details
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};
