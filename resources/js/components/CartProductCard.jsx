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

const CartProductCard = ({ product }) => (
  <Card sx={{ display: 'flex', alignItems: 'stretch' }}>
    <Box sx={{ width: 120, height: '100%' }}>
      <CardMedia
        component="img"
        image={product.image}
        alt={product.name}
        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </Box>
    <CardContent sx={{ flex: '1 0 auto' }}>
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

export default CartProductCard;
