import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Checkout = ({ sessionId }) => {
  return (
    <Elements stripe={stripePromise}>
      {/* Custom checkout form if needed */}
    </Elements>
  );
};

export default Checkout;