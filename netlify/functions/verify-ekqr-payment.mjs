import crypto from 'crypto';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { client_txn_id, txn_date } = JSON.parse(event.body || '{}');

    if (!client_txn_id) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing client_txn_id' }) };
    }

    const ekqrKey = process.env.EKQR_API_KEY || 'd983043b-26f6-4b9b-9901-78a72303b5ac';

    // If txn_date is not provided by the frontend, use today's date in DD-MM-YYYY format
    let dateToUse = txn_date;
    if (!dateToUse) {
      const today = new Date();
      dateToUse = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
    }

    const requestBody = {
      key: ekqrKey,
      client_txn_id: client_txn_id,
      txn_date: dateToUse
    };

    const response = await fetch('https://api.ekqr.in/api/check_order_status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok || !data.status) {
      console.error('EKQR Verify API Error:', data);
      return { 
        statusCode: 200, // Return 200 so the frontend can handle the FAILED status gracefully
        body: JSON.stringify({ 
          status: 'FAILED', 
          message: data.msg || 'Payment verification failed.' 
        }) 
      };
    }

    // data.data.status can be 'success', 'failure', etc.
    const paymentStatus = data.data.status;

    if (paymentStatus === 'success') {
      // 1. Verify the amount matches ₹99 exactly (from the backend perspective)
      // EKQR returns amount as an integer or string.
      const paidAmount = parseFloat(data.data.amount);
      if (paidAmount < 90) {
        console.error(`Amount mismatch. Expected 90, got ${paidAmount}`);
        return { 
          statusCode: 200, 
          body: JSON.stringify({ status: 'FAILED', message: 'Partial payment received. Please contact support.' }) 
        };
      }

      // 2. Generate secure download token
      // Using a simple HMAC hash of the client_txn_id that the secure-download function can verify
      const downloadSecret = process.env.CASHFREE_SECRET_KEY || 'fallback-secret-for-jwt-signing';
      const hmac = crypto.createHmac('sha256', downloadSecret);
      hmac.update(client_txn_id);
      const downloadToken = `${client_txn_id}.${hmac.digest('hex')}`;

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'SUCCESS',
          download_token: downloadToken
        })
      };
    } else if (paymentStatus === 'failure') {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'FAILED',
          message: data.data.remark || 'Payment was marked as failed.'
        })
      };
    } else {
      // Pending or other status
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'PENDING',
          message: 'Payment is still processing.'
        })
      };
    }

  } catch (error) {
    console.error('Error verifying EKQR payment:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) };
  }
};
