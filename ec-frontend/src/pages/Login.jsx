import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(credentials));
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField name="email" label="Email" onChange={handleChange} fullWidth />
      <TextField name="password" label="Password" type="password" onChange={handleChange} fullWidth />
      <Button type="submit" variant="contained">Login</Button>
    </Box>
  );
};

export default Login;