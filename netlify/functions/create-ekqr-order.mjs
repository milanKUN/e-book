import crypto from 'crypto';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { customer_details } = JSON.parse(event.body || '{}');

    // Default to the provided key if env is not set yet
    const ekqrKey = process.env.EKQR_API_KEY || 'd983043b-26f6-4b9b-9901-78a72303b5ac';

    const orderId = `txn_${crypto.randomBytes(8).toString('hex')}`;
    const amount = "1"; // Server-side validated exact price.

    // Get the site URL for return
    const siteUrl = process.env.SITE_URL || 'https://gurunetra.com';
    
    // Ensure mobile is exactly 10 digits if passed with country code
    let mobile = customer_details?.customer_phone || "9999999999";
    mobile = mobile.replace(/[^0-9]/g, '');
    if (mobile.length > 10) {
      mobile = mobile.slice(-10);
    }

    const requestBody = {
      key: ekqrKey,
      client_txn_id: orderId,
      amount: amount,
      p_info: "ChatGPT Income Guide",
      customer_name: customer_details?.customer_name || "Customer",
      customer_email: customer_details?.customer_email || "no-reply@gurunetra.com",
      customer_mobile: mobile,
      redirect_url: `${siteUrl}/payment-success?client_txn_id=${orderId}`,
      udf1: "",
      udf2: "",
      udf3: ""
    };

    const response = await fetch('https://api.ekqr.in/api/create_order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok || !data.status) {
      console.error('EKQR Create Order API Error:', data);
      return {
        statusCode: response.status || 500,
        body: JSON.stringify({ error: data.msg || 'Failed to initiate payment session with EKQR.' })
      };
    }

    // Return the payment URL to the frontend
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payment_url: data.data.payment_url,
        order_id: orderId,
        upi_intent: data.data.upi_intent || null
      })
    };

  } catch (error) {
    console.error('Internal Error generating EKQR order:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) };
  }
};
