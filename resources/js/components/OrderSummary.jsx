// OrderSummary.js - Example of how to update your component

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const OrderSummary = ({ cart, onProceedToCheckout, isSubmittingOrder, onRemoveFromCart, isAuthenticated, user }) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleRemoveItem = (productId) => {
    if (onRemoveFromCart) {
      onRemoveFromCart(productId);
    }
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + tax + shipping;

  const handleProceedClick = () => {
    if (cart.length === 0) return;

    if (!isAuthenticated) {
      // You can redirect to login page or show login modal
      alert('Please log in to place an order');
      // window.location.href = '/login'; // or use your routing method
      return;
    }

    setConfirmDialogOpen(true);
  };

  const handleConfirmOrder = async () => {
    try {
      await onProceedToCheckout();
      setConfirmDialogOpen(false);
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  const handleCloseDialog = () => {
    if (!isSubmittingOrder) {
      setConfirmDialogOpen(false);
    }
  };

  return (
    <>
      <Box p={2} border={1} borderRadius={2} borderColor="grey.300" sx={{ backgroundColor: '#fff' }}>
        <Typography variant="h6" mb={2}>Order Summary</Typography>

        {cart.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Your cart is empty
          </Typography>
        ) : (
          <>
            <List dense>
              {cart.map((item) => (
                <ListItem
                  key={item.id}
                  sx={{
                    px: 0,
                    alignItems: 'flex-start',
                    minHeight: 80
                  }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="remove"
                      onClick={() => handleRemoveItem(item.id)}
                      size="small"
                      sx={{
                        color: 'error.main',
                        '&:hover': {
                          backgroundColor: 'error.light',
                          color: 'error.contrastText'
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      src={item.image ? `${item.image}` : undefined}
                      alt={item.name}
                      variant="rounded"
                      sx={{
                        width: 56,
                        height: 56,
                        mr: 1,
                        backgroundColor: 'grey.100'
                      }}
                    >
                      {!item.image && item.name?.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box>
                        <Typography variant="body2" fontWeight="medium" noWrap>
                          {item.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" fontWeight="bold" color="primary.main">
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    }
                    sx={{ pr: 1 }}
                  />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2">Subtotal:</Typography>
              <Typography variant="body2">${subtotal.toFixed(2)}</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2">Tax:</Typography>
              <Typography variant="body2">${tax.toFixed(2)}</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="body2">Shipping:</Typography>
              <Typography variant="body2">
                {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
              </Typography>
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
              onClick={handleProceedClick}
              disabled={cart.length === 0 || isSubmittingOrder}
              sx={{
                opacity: !isAuthenticated ? 0.6 : 1
              }}
            >
              {isSubmittingOrder ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Processing...
                </>
              ) : !isAuthenticated ? (
                'Login to Checkout'
              ) : (
                'Proceed to Checkout'
              )}
            </Button>
          </>
        )}
      </Box>

      {/* Order Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Your Order</DialogTitle>
        <DialogContent>
          {user && (
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                Delivery Information
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Name:</strong> {user.name || user.full_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Email:</strong> {user.email}
              </Typography>
              {user.phone && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Phone:</strong> {user.phone || user.phone_number}
                </Typography>
              )}
              {(user.address || user.shipping_address) && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <strong>Address:</strong> {user.address || user.shipping_address?.address}
                  {(user.city || user.shipping_address?.city) && `, ${user.city || user.shipping_address?.city}`}
                  {(user.zip_code || user.postal_code || user.shipping_address?.zip_code) &&
                    ` ${user.zip_code || user.postal_code || user.shipping_address?.zip_code}`}
                </Typography>
              )}
            </Box>
          )}

          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>
          <List dense>
            {cart.map((item) => (
              <ListItem key={item.id} sx={{ px: 0 }}>
                <ListItemText
                  primary={item.name}
                  secondary={`Qty: ${item.quantity} × ${item.price.toFixed(2)}`}
                />
                <Typography variant="body2" fontWeight="bold">
                  ${(item.price * item.quantity).toFixed(2)}
                </Typography>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6" color="primary.main">
              ${total.toFixed(2)}
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Payment Method: Cash on Delivery
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={isSubmittingOrder}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmOrder}
            variant="contained"
            disabled={isSubmittingOrder}
          >
            {isSubmittingOrder ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Placing Order...
              </>
            ) : (
              `Confirm Order - ${total.toFixed(2)}`
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrderSummary;
