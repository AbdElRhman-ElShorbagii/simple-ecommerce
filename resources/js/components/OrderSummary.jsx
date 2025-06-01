import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Divider
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';

const OrderSummary = ({ cart }) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 15;
  const tax = subtotal * 0.0325;
  const total = subtotal + shipping + tax;

  return (
<Box p={2} border={1} borderRadius={2} borderColor="grey.300" sx={{ backgroundColor: '#fff' }}>
      <Typography variant="h6" mb={2}>Order Summary</Typography>
      {cart.map((item) => (
        item.quantity > 0 && (
          <Box key={item.id} display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <img src={item.image} alt={item.name} width={40} />
              <Typography variant="body2">{item.name}</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <IconButton size="small"><Remove /></IconButton>
              <Typography>{item.quantity}</Typography>
              <IconButton size="small"><Add /></IconButton>
              <IconButton size="small"><Delete /></IconButton>
            </Box>
            <Typography>${item.price * item.quantity}</Typography>
          </Box>
        )
      ))}
      <Divider sx={{ my: 2 }} />
      <Typography>Subtotal: ${subtotal.toFixed(2)}</Typography>
      <Typography>Shipping: ${shipping.toFixed(2)}</Typography>
      <Typography>Tax: ${tax.toFixed(2)}</Typography>
      <Typography variant="h6" mt={1}>Total: ${total.toFixed(2)}</Typography>
      <Button fullWidth variant="contained" sx={{ mt: 2 }}>Proceed to Checkout</Button>
    </Box>
  );
};

export default OrderSummary;
