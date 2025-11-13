import React from 'react';

const PayPalScript = () => {
  React.useEffect(() => {
    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
    if (!clientId) {
      console.error('PayPal Client ID is not set in VITE_PAYPAL_CLIENT_ID');
      return;
    }
    if (!window.paypal && !document.getElementById('paypal-sdk')) {
      const script = document.createElement('script');
      script.id = 'paypal-sdk';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
      script.async = true;
      script.onload = () => {
        // PayPal SDK loaded
      };
      document.body.appendChild(script);
    }
  }, []);
  return null;
};

export default PayPalScript;
