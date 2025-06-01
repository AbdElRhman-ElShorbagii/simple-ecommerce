import React from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
  Alert
} from '@mui/material';

const CartOrderSummary = ({
  cart,
  orderDetails,
  onProceedToCheckout,
  onRemoveFromCart,
  isSubmittingOrder = false,
  isAuthenticated = false,
  user,
  buttonText = "Proceed to Checkout",
  showShippingInfo = false
}) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 15;
  const tax = subtotal / 14;
  const total = subtotal + shipping + tax;

  return (
    <Box
      p={2}
      border={1}
      borderRadius={2}
      borderColor="grey.300"
      sx={{ backgroundColor: '#fff' }}
    >
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography variant="h6" mb={2}>
          Order Summary {orderDetails?.id && `( #${orderDetails.id} )`}
        </Typography>
        {orderDetails?.created_at && (
          <Typography variant="body2">
            Created: {new Date(orderDetails.created_at).toLocaleDateString()}
          </Typography>
        )}
      </Box>

      {/* Authentication check */}
      {!isAuthenticated && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Please log in to proceed with your order
        </Alert>
      )}

      {/* User info display */}
      {isAuthenticated && user && (
        <Box mb={2}>
          <Typography variant="body2" color="text.secondary">
            Ordering as: {user.name || user.email}
          </Typography>
        </Box>
      )}

      {/* Shipping info */}
      {showShippingInfo && isAuthenticated && user?.address && (
        <Box mb={2}>
          <Typography variant="body2" fontWeight={500}>
            Shipping Address:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.address.street}<br />
            {user.address.city}, {user.address.state} {user.address.zipCode}
          </Typography>
        </Box>
      )}

      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography variant="body2">Subtotal:</Typography>
        <Typography variant="body2">${subtotal.toFixed(2)}</Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography variant="body2">Shipping:</Typography>
        <Typography variant="body2">${shipping.toFixed(2)}</Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="body2">Tax:</Typography>
        <Typography variant="body2">${tax.toFixed(2)}</Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h6">Total:</Typography>
        <Typography variant="h6">${total.toFixed(2)}</Typography>
      </Box>

      <Button
        variant="contained"
        fullWidth
        size="large"
        disabled={isSubmittingOrder || !isAuthenticated || cart.length === 0}
      >
        {isSubmittingOrder ? 'Processing...' : buttonText}
      </Button>

      {cart.length === 0 && (
        <Typography variant="body2" color="text.secondary" textAlign="center" mt={1}>
          Your cart is empty
        </Typography>
      )}
    </Box>
  );
};

export default CartOrderSummary;
