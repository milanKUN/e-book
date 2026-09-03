import crypto from 'crypto';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { customer_details } = JSON.parse(event.body || '{}');

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const env = process.env.CASHFREE_ENVIRONMENT || 'sandbox';
    
    if (!appId || !secretKey) {
      console.error('Missing Cashfree credentials. Configure CASHFREE_APP_ID and CASHFREE_SECRET_KEY in Netlify.');
      return { statusCode: 500, body: JSON.stringify({ error: 'Payment gateway configuration error.' }) };
    }

    const baseUrl = env === 'production' 
      ? 'https://api.cashfree.com/pg' 
      : 'https://sandbox.cashfree.com/pg';

    const orderId = `order_${crypto.randomBytes(8).toString('hex')}`;
    const amount = 99; // Server-side validated exact price. Do NOT trust client input for price.

    // Get the site URL for return and webhook routing
    const siteUrl = process.env.SITE_URL || 'https://gurunetra.com';
    
    // Following Cashfree API Version 2023-08-01 requirements
    const requestBody = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: `cust_${crypto.randomBytes(6).toString('hex')}`,
        customer_name: customer_details?.customer_name || "Customer",
        customer_email: customer_details?.customer_email || "no-reply@gurunetra.com",
        customer_phone: customer_details?.customer_phone || "+919999999999"
      },
      order_meta: {
        // Direct users to our success page after payment
        return_url: `${siteUrl}/payment-success?order_id={order_id}`,
        // Webhook URL for async notification
        notify_url: `${siteUrl}/.netlify/functions/cashfree-webhook`
      }
    };

    const response = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'x-client-id': appId,
        'x-client-secret': secretKey,
        'x-api-version': '2023-08-01',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Cashfree Create Order API Error:', data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to initiate payment session with the gateway.' })
      };
    }

    // Return the safe parameters needed to launch Cashfree JS checkout
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payment_session_id: data.payment_session_id,
        order_id: data.order_id
      })
    };

  } catch (error) {
    console.error('Internal Error generating Cashfree order:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) };
  }
};
