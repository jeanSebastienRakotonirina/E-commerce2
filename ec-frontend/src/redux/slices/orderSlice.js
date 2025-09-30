import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const createOrder = createAsyncThunk('orders/createOrder', async (orderData, { dispatch }) => {
  const res = await api.post('/orders', orderData);
  const sessionRes = await api.post('/payment/create-checkout-session', { orderId: res.data._id });
  return sessionRes.data;
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: { sessionId: null, loading: false },
  extraReducers: (builder) => {
    builder.addCase(createOrder.fulfilled, (state, action) => { state.sessionId = action.payload.id; });
  },
});

export default orderSlice.reducer;