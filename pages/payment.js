import { useState } from 'react';
import useRazorpay from 'react-razorpay';


const PaymentPage = () => {
  const [Razorpay] = useRazorpay();
  const [orderId, setOrderId] = useState(null);

  const handlePayment = async() => {
    const response = await fetch('/api/create-order', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")

      },
      body: JSON.stringify({
        amount: 100, // Set the amount based on your requirements
        currency: 'INR', // Set the currency based on your requirements
      }),
    });

    if (response.ok) {
      const order = await response.json();
      setOrderId(order.id);

      const options = {
        key: process.env.RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Popular Bags',
        description: 'Payment for Your Order',
        order_id: order.id,
        handler: (response) => {
          console.log(response);
          // Handle the payment success
        },
        prefill: {
          // name: 'User Name',
          email: '',
          contact: '+91xxxxxxxxxx',
        },
        theme: {
          color: '#3399cc',
        },
      };

      // Create a new Razorpay instance
      const rzp = new Razorpay(options);
      rzp.open();
    }
  };

  return (
    <div>
      <button onClick={handlePayment}>Make Payment</button>
    </div>
  );
};

export default PaymentPage;
