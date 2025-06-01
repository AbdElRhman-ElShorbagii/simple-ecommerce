import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Divider
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';

const CartOrderSummary = ({ cart }) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 15;
  const tax = subtotal / 14;
  const total = subtotal + shipping + tax;

  return (
<Box p={2} border={1} borderRadius={2} borderColor="grey.300" sx={{ backgroundColor: '#fff' }}>
      <Typography variant="h6" mb={2}>Order Summary</Typography>
      <Typography>Subtotal: ${subtotal.toFixed(2)}</Typography>
      <Typography>Shipping: ${shipping.toFixed(2)}</Typography>
      <Typography>Tax: ${tax.toFixed(2)}</Typography>
      <Typography variant="h6" mt={1}>Total: ${total.toFixed(2)}</Typography>
      <Button fullWidth variant="contained" sx={{ mt: 2 }}>Proceed to Checkout</Button>
    </Box>
  );
};

export default CartOrderSummary;
