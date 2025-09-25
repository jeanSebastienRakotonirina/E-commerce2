import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const createOrder = createAsyncThunk('orders/create', async () => {
  const res = await api.post('/orders');
  return res.data;
});

export const createCheckoutSession = createAsyncThunk('orders/checkout', async (orderId) => {
  const res = await api.post('/payment/create-checkout-session', { orderId });
  return res.data;
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: { list: [], sessionId: null, loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.fulfilled, (state, action) => { state.list.push(action.payload); })
      .addCase(createCheckoutSession.fulfilled, (state, action) => { state.sessionId = action.payload.id; });
  },
});

export default orderSlice.reducer;