import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const getUsers = createAsyncThunk('admin/getUsers', async () => {
  const res = await api.get('/admin/users');
  return res.data;
});

export const getOrders = createAsyncThunk('admin/getOrders', async () => {
  const res = await api.get('/admin/orders');
  return res.data;
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: { users: [], orders: [], loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.fulfilled, (state, action) => { state.users = action.payload; })
      .addCase(getOrders.fulfilled, (state, action) => { state.orders = action.payload; });
  },
});

export default adminSlice.reducer;