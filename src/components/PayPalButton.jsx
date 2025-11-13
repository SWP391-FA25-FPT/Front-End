import React from 'react';
import { createPayPalOrder } from '../apis/paypal';

const PayPalButton = ({ amount, planType, planDuration, onSuccess, onError }) => {
  const handleClick = async () => {
    try {
      const data = await createPayPalOrder(amount, planType, planDuration);
      if (data && data.approvalUrl) {
        // Store plan details in sessionStorage for later retrieval
        sessionStorage.setItem('paypalPlanType', planType);
        sessionStorage.setItem('paypalPlanDuration', planDuration);
        sessionStorage.setItem('paypalOrderId', data.id);
        window.location.href = data.approvalUrl;
      } else {
        if (onError) onError(new Error('Không lấy được link thanh toán PayPal.'));
        else alert('Không lấy được link thanh toán PayPal.');
      }
    } catch (err) {
      if (onError) onError(err);
      else alert('Lỗi khi tạo đơn PayPal.');
    }
  };

  return (
    <button
      style={{
        background: '#ffc439',
        color: '#111',
        border: 'none',
        borderRadius: 4,
        padding: '12px 24px',
        fontWeight: 600,
        fontSize: 16,
        cursor: 'pointer',
        width: '100%',
      }}
      onClick={handleClick}
    >
      Thanh toán với PayPal
    </button>
  );
};

export default PayPalButton;
