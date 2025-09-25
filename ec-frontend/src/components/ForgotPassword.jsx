import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import api from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/forgot', { email });
      alert('Reset link sent');
    } catch (err) {
      console.error(err);
      alert('Error sending reset link');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        name="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />
      <Button type="submit" variant="contained">Send Reset Link</Button>
    </Box>
  );
};

export default ForgotPassword;