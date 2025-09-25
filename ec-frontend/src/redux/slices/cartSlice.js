import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const getCart = createAsyncThunk('cart/get', async () => {
  const res = await api.get('/cart');
  return res.data;
});

export const addToCart = createAsyncThunk('cart/add', async (data) => {
  const res = await api.post('/cart/add', data);
  return res.data;
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(getCart.fulfilled, (state, action) => { state.items = action.payload.items; })
      .addCase(addToCart.fulfilled, (state, action) => { state.items = action.payload.items; });
  },
});

export default cartSlice.reducer;