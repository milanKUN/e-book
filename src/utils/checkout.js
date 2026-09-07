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

    if (!response.ok || !data.payment_url) {
      throw new Error(data.error || 'Failed to initiate payment');
    }

    // Return data to caller instead of automatically redirecting
    return data;

  } catch (error) {
    console.error('Checkout Error:', error);
    alert(error.message || 'Payment initiation failed. Please try again later.');
    return null;
  } finally {
    if (setLoadingState) setLoadingState(false);
  }
};
