import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { createProduct } from '../redux/slices/productSlice';

const ProductForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', color: '', size: '', stock: '', image: null,
  });

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    dispatch(createProduct(data));
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField name="name" label="Nom" onChange={handleChange} fullWidth />
      <TextField name="description" label="Description" onChange={handleChange} fullWidth />
      <TextField name="price" label="Prix" type="number" onChange={handleChange} fullWidth />
      <TextField name="color" label="Couleur" onChange={handleChange} fullWidth />
      <TextField name="size" label="Taille" onChange={handleChange} fullWidth />
      <TextField name="stock" label="Stock" type="number" onChange={handleChange} fullWidth />
      <input type="file" name="image" accept=".jpg,.jpeg,.png" onChange={handleChange} />
      <Button type="submit" variant="contained">Ajouter Produit</Button>
    </Box>
  );
};

export default ProductForm;