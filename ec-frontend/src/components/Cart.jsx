import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId, quantity }) => {
  const res = await api.post('/cart', { productId, quantity });
  return res.data;
});

export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const res = await api.get('/cart');
  return res.data;
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async ({ productId }) => {
  const res = await api.delete('/cart', { data: { productId } });
  return res.data;
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.fulfilled, (state, action) => { state.items = action.payload.items; })
      .addCase(fetchCart.fulfilled, (state, action) => { state.items = action.payload.items; })
      .addCase(removeFromCart.fulfilled, (state, action) => { state.items = action.payload.items; });
  },
});

export default cartSlice.reducer;