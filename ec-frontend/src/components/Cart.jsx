import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCart } from '../redux/slices/cartSlice';
import { createOrder, createCheckoutSession } from '../redux/slices/orderSlice';
import { List, ListItem, Typography, Button } from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Cart = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const { sessionId } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const handleCheckout = async () => {
    const { payload: order } = await dispatch(createOrder());
    const { payload: session } = await dispatch(createCheckoutSession(order._id));
    const stripe = await stripePromise;
    await stripe.redirectToCheckout({ sessionId: session.id });
  };

  return (
    <>
      <List>
        {items.map((item) => (
          <ListItem key={item.productId._id}>
            <Typography>{item.productId.name} x {item.quantity}</Typography>
          </ListItem>
        ))}
      </List>
      <Button onClick={handleCheckout} variant="contained">Proceed to Checkout</Button>
    </>
  );
};

export default Cart;