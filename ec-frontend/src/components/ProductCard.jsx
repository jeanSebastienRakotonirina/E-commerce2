import React from 'react';
import { Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAdd = () => {
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
  };

  return (
    <Card>
      {product.imageUrl && <CardMedia component="img" height="140" image={product.imageUrl} alt={product.name} />}
      <CardContent>
        <Typography variant="h5">{product.name}</Typography>
        <Typography>{product.description}</Typography>
        <Typography>${product.price}</Typography>
        <Button onClick={handleAdd} variant="contained">Add to Cart</Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;