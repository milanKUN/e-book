import { config } from '../config';

let cashfree;
// Initialize Cashfree SDK
if (window.Cashfree) {
  cashfree = window.Cashfree({
    mode: config.CASHFREE_ENV || "sandbox"
  });
}

export const handleCheckout = async (e, setLoadingState = null) => {
  if (e) e.preventDefault();
  
  if (setLoadingState) setLoadingState(true);

  try {
    // Collect basic info if needed, or just send a guest request
    const customer_details = {
      customer_name: "Guest",
      customer_email: "guest@example.com",
      customer_phone: "+919999999999"
    };

    const response = await fetch(config.CREATE_ORDER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer_details })
    });

    const data = await response.json();

    if (!response.ok || !data.payment_session_id) {
      throw new Error(data.error || 'Failed to initiate payment');
    }

    if (!cashfree) {
      cashfree = window.Cashfree({ mode: config.CASHFREE_ENV || "sandbox" });
    }

    // Launch Cashfree Checkout
    cashfree.checkout({
      paymentSessionId: data.payment_session_id,
      redirectTarget: "_self" // Redirects the current page to the success URL
    });

  } catch (error) {
    console.error('Checkout Error:', error);
    alert('Payment initiation failed. Please try again later.');
  } finally {
    if (setLoadingState) setLoadingState(false);
  }
};
