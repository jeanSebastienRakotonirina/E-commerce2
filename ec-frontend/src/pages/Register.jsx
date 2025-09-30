import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../redux/slices/authSlice';
import { TextField, Button, Box, Typography } from '@mui/material';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(register({ email, password }));
  };

  return (
    <Box>
      <Typography variant="h4">Register</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth margin="normal" />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="normal" />
        <Button type="submit" variant="contained">Register</Button>
      </form>
    </Box>
  );
};

export default Register;