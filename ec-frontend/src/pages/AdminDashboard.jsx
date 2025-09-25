import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, getOrders } from '../redux/slices/adminSlice';
import { Typography, Box, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { users, orders } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getOrders());
  }, [dispatch]);

  return (
    <Box>
      <Typography variant="h4">Tableau de Bord Admin</Typography>
      <Typography variant="h6">Utilisateurs</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Admin</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.isAdmin ? 'Oui' : 'Non'}</TableCell>
              <TableCell>
                <Button>Modifier</Button>
                <Button color="error">Supprimer</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Typography variant="h6">Commandes</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID Commande</TableCell>
            <TableCell>Utilisateur</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Statut</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>{order._id}</TableCell>
              <TableCell>{order.userId.email}</TableCell>
              <TableCell>${order.total}</TableCell>
              <TableCell>{order.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default AdminDashboard;