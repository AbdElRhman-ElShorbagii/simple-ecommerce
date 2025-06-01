import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  // Cart state
  const [cartData, setCartData] = useState(null);
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

  // API Base URL
  const API_BASE = 'http://localhost:8000/api';

  // Check authentication status and get user data
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('auth_token');
      const userDataString = localStorage.getItem('user');

      if (!token || !userDataString) {
        setIsAuthenticated(false);
        setUser(null);
        navigate('/login'); // Redirect to login if not authenticated
        return;
      }

      const userData = JSON.parse(userDataString);
      setUser(userData);
      setIsAuthenticated(true);
    };

    checkAuthStatus();
  }, [navigate]);

  // Fetch cart items
  const fetchCartItems = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE}/cart`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setCartData(result.data);

        // Transform cart items to component format
        const transformedItems = result.data.items.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: parseFloat(item.product.price),
          quantity: item.quantity,
          image: item.product.img_url || item.product.image || `product${item.product.id}.png`,
          stock: item.product.stock_quantity || 0,
          tag: item.product.category || 'Product',
          subtotal: parseFloat(item.product.price) * item.quantity
        }));

        setCartItems(transformedItems);
      } else {
        throw new Error(result.message || 'Failed to fetch cart');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch cart when component mounts or auth changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchCartItems();
    }
  }, [fetchCartItems, isAuthenticated]);

  // Update cart item quantity
  const updateCartItemQuantity = useCallback(async (productId, newQuantity) => {
    try {
      const token = localStorage.getItem('auth_token');

      if (newQuantity <= 0) {
        // Remove item from cart
        const response = await fetch(`${API_BASE}/cart/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to remove item from cart');
        }

        const result = await response.json();
        if (result.success) {
          // Update local state
          setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
          // Refresh cart data to get updated totals
          fetchCartItems();
        }
      } else {
        // Update item quantity
        const response = await fetch(`${API_BASE}/cart/${productId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ quantity: newQuantity })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update cart item');
        }

        const result = await response.json();
        if (result.success) {
          // Update local state
          setCartItems(prevItems =>
            prevItems.map(item =>
              item.id === productId
                ? { ...item, quantity: newQuantity, subtotal: item.price * newQuantity }
                : item
            )
          );
          // Refresh cart data to get updated totals
          fetchCartItems();
        }
      }
    } catch (err) {
      console.error('Error updating cart item:', err);
      setOrderError(err.message);
    }
  }, [fetchCartItems]);

  // Remove item from cart
  const handleRemoveFromCart = useCallback((productId) => {
    updateCartItemQuantity(productId, 0);
  }, [updateCartItemQuantity]);

  // Add item to cart (for external use)
  const addToCart = useCallback(async (productId, quantity = 1) => {
    try {
      const token = localStorage.getItem('auth_token');

      const response = await fetch(`${API_BASE}/cart`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ product_id: productId, quantity })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add item to cart');
      }

      const result = await response.json();
      if (result.success) {
        // Refresh cart after adding item
        fetchCartItems();
        return result;
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      setOrderError(err.message);
      throw err;
    }
  }, [fetchCartItems]);

  // Checkout - Convert cart to order
  const handleCheckout = useCallback(async (shippingData = {}) => {
    try {
      setIsSubmittingOrder(true);
      setOrderError(null);

      const token = localStorage.getItem('auth_token');

      // Convert cart to order
      const response = await fetch(`${API_BASE}/cart/checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          shipping_address: shippingData.shipping_address || user?.address,
          billing_address: shippingData.billing_address || user?.address,
          payment_method: shippingData.payment_method || 'cash_on_delivery',
          ...shippingData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setOrderSuccess(true);
        // Clear local cart state
        setCartItems([]);
        setCartData(null);

        // Redirect to order confirmation page
        setTimeout(() => {
          navigate(`/orders/${result.data.id}/confirmation`);
        }, 2000);
      } else {
        throw new Error(result.message || 'Failed to process checkout');
      }

    } catch (err) {
      setOrderError(err.message);
      console.error('Error during checkout:', err);
    } finally {
      setIsSubmittingOrder(false);
    }
  }, [user, navigate]);

  // Clear entire cart
  const clearCart = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');

      const response = await fetch(`${API_BASE}/cart`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setCartItems([]);
        setCartData(null);
        fetchCartItems();
      }
    } catch (err) {
      console.error('Error clearing cart:', err);
      setOrderError('Failed to clear cart');
    }
  }, [fetchCartItems]);

  // Close success snackbar
  const handleCloseSuccessSnackbar = () => {
    setOrderSuccess(false);
  };

  // Close error snackbar
  const handleCloseErrorSnackbar = () => {
    setOrderError(null);
  };

  if (!isAuthenticated) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Please log in to view your cart
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/login')}
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading cart...
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

  if (!cartItems || cartItems.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Your cart is empty
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Add some products to your cart to get started!
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
            {/* Cart Header */}
            <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" gutterBottom>
                  Shopping Cart
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
                </Typography>
              </Box>
              {cartItems.length > 0 && (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              )}
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Cart Items */}
            <Typography variant="h6" mb={2}>
              Items ({cartItems.length})
            </Typography>

            <Grid container spacing={2}>
              {cartItems.map(product => (
                <Grid item size={{ xs: 12 }} key={product.id}>
                  <CartProductCard
                    product={product}
                    onQuantityChange={(newQuantity) => updateCartItemQuantity(product.id, newQuantity)}
                    onRemove={() => handleRemoveFromCart(product.id)}
                    showQuantityControls={true}
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        <Grid item size={{ xs: 12, md: 4 }}>
          <CartOrderSummary
            cart={cartItems}
            cartData={cartData}
            onProceedToCheckout={handleCheckout}
            onRemoveFromCart={handleRemoveFromCart}
            isSubmittingOrder={isSubmittingOrder}
            isAuthenticated={isAuthenticated}
            user={user}
            buttonText="Proceed to Checkout"
            showShippingInfo={false} // Hide shipping info in cart, show in checkout
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
          Order placed successfully! Redirecting to confirmation page...
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
