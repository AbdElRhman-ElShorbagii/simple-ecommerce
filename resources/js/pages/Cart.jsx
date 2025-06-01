import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Grid,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Snackbar,
  Button,
  Paper,
  Divider
} from '@mui/material';
import CartProductCard from '../components/CartProductCard';
import CartOrderSummary from '../components/CartOrderSummary';

const Cart = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('order_id');
    const navigate = useNavigate();

  // Order and cart state
  const [orderDetails, setOrderDetails] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Order submission states
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState(null);

  // Check authentication status and get user data
  useEffect(() => {
    const checkAuthStatus = async () => {
        // Get auth token from localStorage
        const token = localStorage.getItem('auth_token');
        console.log('Auth Token:', token);
        const userDataString = localStorage.getItem('user');
        console.log('User Data:', userDataString);

        if (!token || !userDataString) {
          setIsAuthenticated(false);
          setUser(null);
          return;
        }

        const userData = JSON.parse(userDataString);
        setUser(userData);
        setIsAuthenticated(true);
    };

    checkAuthStatus();
  }, []);

  // Fetch order details by ID
  const fetchOrderDetails = useCallback(async () => {
    console.log('Fetching order details for order ID:', orderId);
    if (!orderId || !isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:8000/api/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Order not found');
        } else if (response.status === 403) {
          throw new Error('You are not authorized to view this order');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setOrderDetails(result.data);

        // Transform order items to cart format
        const transformedItems = result.data.products.map(item => ({
          id: item.product_id,
          name: item.name || item.product_name,
          price: parseFloat(item.unit_price),
          quantity: item.quantity,
          image: item.img_url || `product${item.product_id}.png`,
          stock: item.stock_quantity || 0,
          tag: item.category || 'Product',
          subtotal: parseFloat(item.subtotal)
        }));

        setCartItems(transformedItems);
      } else {
        throw new Error(result.message || 'Failed to fetch order details');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching order details:', err);

      // Redirect to products page if order not found
      if (err.message.includes('not found') || err.message.includes('not authorized')) {
        setTimeout(() => {
          navigate('/products');
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  }, [orderId, isAuthenticated, navigate]);

  // Fetch order details when component mounts or auth changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrderDetails();
    }
  }, [fetchOrderDetails, isAuthenticated]);

  // Update product quantity in order
  const updateCartItemQuantity = useCallback(async (productId, newQuantity) => {
    try {
      const token = localStorage.getItem('auth_token');

      if (newQuantity <= 0) {
        // Remove item from order
        const response = await fetch(`http://localhost:8000/api/orders/${orderId}/items/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
          // Refetch order details to get updated totals
          fetchOrderDetails();
        }
      } else {
        // Update item quantity
        const response = await fetch(`http://localhost:8000/api/orders/${orderId}/items/${productId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ quantity: newQuantity })
        });

        if (response.ok) {
          setCartItems(prevItems =>
            prevItems.map(item =>
              item.id === productId
                ? { ...item, quantity: newQuantity, subtotal: item.price * newQuantity }
                : item
            )
          );
          // Refetch order details to get updated totals
          fetchOrderDetails();
        }
      }
    } catch (err) {
      console.error('Error updating cart item:', err);
      setOrderError('Failed to update item quantity');
    }
  }, [orderId, fetchOrderDetails]);

  // Remove item from cart
  const handleRemoveFromCart = useCallback((productId) => {
    updateCartItemQuantity(productId, 0);
  }, [updateCartItemQuantity]);

  // Close success snackbar
  const handleCloseSuccessSnackbar = () => {
    setOrderSuccess(false);
  };

  // Close error snackbar
  const handleCloseErrorSnackbar = () => {
    setOrderError(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading order details...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={8}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/products')}
          sx={{ mt: 2 }}
        >
          Continue Shopping
        </Button>
      </Box>
    );
  }

  if (!orderDetails || cartItems.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          No items in this order
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/products')}
          sx={{ mt: 2 }}
        >
          Continue Shopping
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item size={{ xs: 12, md: 8 }}>
          <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
            {/* Order Header */}
            <Box mb={3}>
              <Typography variant="h4" gutterBottom>
                Review Your Order
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Order ID: #{orderDetails.id} | Created: {new Date(orderDetails.created_at).toLocaleDateString()}
              </Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Order Items */}
            <Typography variant="h6" mb={2}>
              Order Items ({cartItems.length} items)
            </Typography>

            <Grid container spacing={2}>
              {cartItems.map(product => (
                <Grid item size={{ xs: 12 }} key={product.id}>
                  <CartProductCard
                    product={product}
                    onQuantityChange={(newQuantity) => updateCartItemQuantity(product.id, newQuantity)}
                    onRemove={() => handleRemoveFromCart(product.id)}
                    showQuantityControls={true} // Allow editing in cart
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        <Grid item size={{ xs: 12, md: 4 }}>
          <CartOrderSummary
            cart={cartItems}
            orderDetails={orderDetails}
            onRemoveFromCart={handleRemoveFromCart}
            isSubmittingOrder={isSubmittingOrder}
            isAuthenticated={isAuthenticated}
            user={user}
            buttonText="Confirm Order" // Custom button text
            showShippingInfo={true} // Show shipping details
          />
        </Grid>
      </Grid>

      {/* Success Snackbar */}
      <Snackbar
        open={orderSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSuccessSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSuccessSnackbar} severity="success" sx={{ width: '100%' }}>
          Order confirmed successfully! Redirecting to confirmation page...
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!orderError}
        autoHideDuration={6000}
        onClose={handleCloseErrorSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseErrorSnackbar} severity="error" sx={{ width: '100%' }}>
          {orderError}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Cart;
