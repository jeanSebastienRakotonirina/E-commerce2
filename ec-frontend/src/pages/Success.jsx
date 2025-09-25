import React from 'react';
import { Typography, Box } from '@mui/material';

const Success = () => {
  return (
    <Box>
      <Typography variant="h4">Paiement Réussi !</Typography>
      <Typography>Votre commande a été confirmée.</Typography>
    </Box>
  );
};

export default Success;