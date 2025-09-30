import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addProduct } from '../redux/slices/productSlice';
import { TextField, Button, Box } from '@mui/material';

const AddProduct = () => {
  const [formData, setFormData] = useState({ name: '', description: '', price: '', color: '', size: '', stock: '', image: null });
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'image' && formData[key]) {
        data.append('image', formData[key]);
      } else {
        data.append(key, formData[key]);
      }
    });
    dispatch(addProduct(data));
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <TextField label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} fullWidth margin="normal" />
        <TextField label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} fullWidth margin="normal" />
        <TextField label="Price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} fullWidth margin="normal" />
        <TextField label="Color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} fullWidth margin="normal" />
        <TextField label="Size" value={formData.size} onChange={(e) => setFormData({ ...formData, size: e.target.value })} fullWidth margin="normal" />
        <TextField label="Stock" type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} fullWidth margin="normal" />
        <input type="file" onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} />
        <Button type="submit" variant="contained">Add Product</Button>
      </form>
    </Box>
  );
};

export default AddProduct;