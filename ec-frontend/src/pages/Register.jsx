import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import api from '../services/api';

const Register = () => {
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', credentials);
      dispatch(login(credentials));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField name="email" label="Email" onChange={handleChange} fullWidth />
      <TextField name="password" label="Password" type="password" onChange={handleChange} fullWidth />
      <Button type="submit" variant="contained">Register</Button>
    </Box>
  );
};

export default Register;