import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const getProducts = createAsyncThunk('products/get', async (filters) => {
  const params = new URLSearchParams(filters);
  const res = await api.get(`/products?${params.toString()}`);
  return res.data;
});

export const createProduct = createAsyncThunk('products/create', async (data) => {
  const res = await api.post('/products', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
});

const productSlice = createSlice({
  name: 'products',
  initialState: { list: [], loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.fulfilled, (state, action) => { state.list = action.payload; })
      .addCase(createProduct.fulfilled, (state, action) => { state.list.push(action.payload); });
  },
});

export default productSlice.reducer;