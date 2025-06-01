import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  Chip
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

const ProductCard = ({ product }) => (
  <Card sx={{ minWidth: 220 }}>
    <CardMedia component="img" height="140" image={product.image} alt={product.name} />
    <CardContent>
      <Typography variant="subtitle1">{product.name}</Typography>
      <Typography variant="subtitle2">${product.price}</Typography>
      <Chip label={product.tag} size="small" sx={{ mt: 1 }} />
      <Typography variant="caption" display="block">Stock: {product.stock}</Typography>
      <Box display="flex" alignItems="center" mt={1}>
        <IconButton size="small"><Remove /></IconButton>
        <Typography>{product.quantity}</Typography>
        <IconButton size="small"><Add /></IconButton>
      </Box>
    </CardContent>
  </Card>
);

export default ProductCard;
