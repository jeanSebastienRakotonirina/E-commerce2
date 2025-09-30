import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const register = createAsyncThunk('auth/register', async ({ email, password }) => {
  const res = await api.post('/auth/register', { email, password });
  localStorage.setItem('token', res.data.token);
  return res.data;
});

export const login = createAsyncThunk('auth/login', async ({ email, password }) => {
  const res = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', res.data.token);
  return res.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: null, loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => { state.token = action.payload.token; })
      .addCase(login.fulfilled, (state, action) => { state.token = action.payload.token; });
  },
});

export default authSlice.reducer;