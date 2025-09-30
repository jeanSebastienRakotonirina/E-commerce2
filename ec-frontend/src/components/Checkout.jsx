import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Box, Typography } from '@mui/material';

const stripePromise = loadStripe('pk_test_your_stripe_publishable_key');

const CheckoutForm = ({ sessionId }) => {
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (sessionId && stripe) {
      stripe.redirectToCheckout({ sessionId });
    }
  }, [sessionId, stripe]);

  return (
    <Box>
      <Typography variant="h6">Redirecting to Stripe...</Typography>
      <CardElement />
    </Box>
  );
};

const Checkout = ({ sessionId }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm sessionId={sessionId} />
  </Elements>
);

export default Checkout;