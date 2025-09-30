import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const res = await api.get('/products');
  return res.data;
});

export const addProduct = createAsyncThunk('products/addProduct', async (formData) => {
  const res = await api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
});

const productSlice = createSlice({
  name: 'products',
  initialState: { products: [], loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => { state.products = action.payload; })
      .addCase(addProduct.fulfilled, (state, action) => { state.products.push(action.payload); });
  },
});

export default productSlice.reducer;