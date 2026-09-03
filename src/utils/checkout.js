import { config } from '../config';

export const handleCheckout = async (e, setLoadingState = null, customerDetails = null) => {
  if (e) e.preventDefault();
  
  if (setLoadingState) setLoadingState(true);

  try {
    // Ensure we have customer details
    const finalCustomerDetails = customerDetails || {
      customer_name: "Guest",
      customer_email: "guest@example.com",
      customer_phone: "+919999999999"
    };

    const response = await fetch(config.CREATE_ORDER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer_details: finalCustomerDetails })
    });

    const data = await response.json();

    if (!response.ok || !data.payment_session_id) {
      throw new Error(data.error || 'Failed to initiate payment');
    }

    // Dynamically initialize Cashfree SDK using the ACTUAL environment the backend used.
    // This strictly prevents sandbox/production mismatches.
    const cashfree = window.Cashfree({ 
      mode: data.environment || "sandbox" 
    });

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
