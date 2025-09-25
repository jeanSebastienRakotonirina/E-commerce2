import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCart } from '../redux/slices/cartSlice';
import { List, ListItem, Typography, Button } from '@mui/material';

const Cart = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  return (
    <>
      <List>
        {items.map((item) => (
          <ListItem key={item.productId._id}>
            <Typography>{item.productId.name} x {item.quantity}</Typography>
          </ListItem>
        ))}
      </List>
      <Button variant="contained">Proceed to Checkout</Button>
    </>
  );
};

export default Cart;