import { config } from '../config';
import Analytics from '../analytics/tracker';

// Load Razorpay checkout.js once
let razorpayScriptPromise = null;
const loadRazorpayScript = () => {
  if (window.Razorpay) return Promise.resolve();
  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = config.RAZORPAY_CHECKOUT_URL;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay checkout'));
    document.body.appendChild(script);
  });
  return razorpayScriptPromise;
};

/**
 * Full Razorpay checkout flow:
 * 1. Ask backend to create a Razorpay order
 * 2. Open Razorpay checkout modal
 * 3. On success, verify signature on the backend
 * 4. Redirect to /payment-success with the order id
 */
export const handleCheckout = async (e, setLoadingState = null, customerDetails = null) => {
  if (e) e.preventDefault();
  if (setLoadingState) setLoadingState(true);

  try {
    const finalCustomerDetails = customerDetails || {
      customer_name: 'Guest',
      customer_email: 'guest@example.com',
      customer_phone: '+919999999999',
    };

    // 1. Create order on backend
    // (checkout_start is fired once by the BUY NOW button's data-analytics-event;
    //  form_submit by the PAY button — no duplicate events here)
    const response = await fetch(config.CREATE_ORDER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_details: finalCustomerDetails,
        visitor_id: localStorage.getItem('analytics_vid') || '',
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.ok || !data.order_id) {
      throw new Error(data.error || 'Failed to initiate payment');
    }

    Analytics.trackEvent('order_created', { order_id: data.order_id });

    // 2. Load Razorpay and open modal
    await loadRazorpayScript();

    const options = {
      key: data.key_id || config.RAZORPAY_KEY_ID,
      order_id: data.order_id,
      amount: data.amount,
      currency: data.currency || 'INR',
      name: config.COMPANY_NAME,
      description: config.PRODUCT_NAME,
      prefill: {
        name: finalCustomerDetails.customer_name,
        email: finalCustomerDetails.customer_email,
        contact: finalCustomerDetails.customer_phone,
      },
      theme: { color: '#FF5A0A' },
      modal: {
        ondismiss: () => {
          Analytics.trackEvent('checkout_dismissed', { order_id: data.order_id });
          if (setLoadingState) setLoadingState(false);
        },
      },
      handler: async (response) => {
        // response: { razorpay_payment_id, razorpay_order_id, razorpay_signature }
        try {
          const verifyRes = await fetch(config.VERIFY_PAYMENT_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();

          if (verifyRes.ok && verifyData.ok) {
            // payment_success is tracked exactly once on /payment-success (not here,
            // otherwise the same payment would be counted twice)
            window.location.href = `/payment-success?order_id=${response.razorpay_order_id}`;
          } else {
            Analytics.trackEvent('payment_verify_failed', { order_id: response.razorpay_order_id });
            window.location.href = `/payment-success?order_id=${response.razorpay_order_id}`;
          }
        } catch (err) {
          console.error('Verification error:', err);
          window.location.href = `/payment-success?order_id=${response.razorpay_order_id}`;
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

    // Keep loading state true while modal is open; dismissed handler resets it
    return data;
  } catch (error) {
    console.error('Checkout Error:', error);
    Analytics.trackEvent('checkout_error', { message: error.message });
    alert(error.message || 'Payment initiation failed. Please try again later.');
    if (setLoadingState) setLoadingState(false);
    return null;
  }
};
