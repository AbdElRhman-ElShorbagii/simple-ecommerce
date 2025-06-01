import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Pagination,
  Button,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ProductCard from '../components/ProductCard';
import OrderSummary from '../components/OrderSummary';
import FilterFloatingButton from '../components/FilterFloatingButton';
import TuneIcon from '@mui/icons-material/Tune';
import { useNavigate } from 'react-router-dom'; // Add this import

const ProductList = () => {
  const navigate = useNavigate(); // Add navigation hook

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cart, setCart] = useState([]);
  const [filters, setFilters] = useState({
    price: [0, 300],
    categories: [],
    minPrice: 0,
    maxPrice: 300
  });
  const [availableCategories, setAvailableCategories] = useState([]);

  // Authentication state - moved to top
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

  // Memoize the fetchProducts function to prevent unnecessary re-creations
  const fetchProducts = useCallback(async (page = 1, searchQuery = '', filterParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(filterParams.minPrice !== undefined && filterParams.minPrice > 0 && { min_price: filterParams.minPrice }),
        ...(filterParams.maxPrice !== undefined && filterParams.maxPrice < 300 && { max_price: filterParams.maxPrice }),
        ...(filterParams.categories && filterParams.categories.length > 0 && {
          categories: filterParams.categories.join(',')
        })
      });

      const response = await fetch(`http://localhost:8000/api/products?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiData = await response.json();

      if (apiData.success) {
        const transformedProducts = apiData.data.map(product => ({
          id: product.id,
          name: product.name,
          price: parseFloat(product.price_raw),
          stock: product.stock_quantity,
          image: product.image_url || `product${product.id}.png`,
          tag: product.category,
          quantity: 0,
          isActive: product.is_active,
          inStock: product.in_stock
        }));

        setProducts(transformedProducts);
        setTotalPages(apiData.meta.total_pages);
        setCurrentPage(apiData.meta.current_page);

        const categories = [...new Set(transformedProducts.map(p => p.tag))];
        setAvailableCategories(categories);
      } else {
        throw new Error(apiData.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Updated order submission function - saves order and redirects
  const submitOrder = useCallback(async () => {
    try {
      setIsSubmittingOrder(true);
      setOrderError(null);

      const token = localStorage.getItem('auth_token');

      if (!token || !isAuthenticated || !user) {
        throw new Error('Please log in to place an order');
      }

      // Create order payload with status as 'draft' or 'pending'
      const orderPayload = {
        products: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
          name: item.name
        })),
        total_amount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        user_id: user.id,
        status: 'cart'
      };

      const response = await fetch('http://localhost:8000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Clear cart after successful order creation
        setProducts(prevProducts =>
          prevProducts.map(product => ({ ...product, quantity: 0 }))
        );
        setCart([]);

        // Store order ID and redirect to cart page
        const orderId = result.data.id || result.order_id;

        // Navigate to cart page with order ID
        navigate(`/cart?order_id=${orderId}`);

        return result;
      } else {
        throw new Error(result.message || 'Failed to create order');
      }

    } catch (err) {
      setOrderError(err.message);
      console.error('Error creating order:', err);

      if (err.message.includes('log in') || err.message.includes('unauthorized')) {
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }

      throw err;
    } finally {
      setIsSubmittingOrder(false);
    }
  }, [cart, isAuthenticated, user, navigate]);

  // Initial load
  useEffect(() => {
    fetchProducts(1, '', filters);
  }, [fetchProducts]);

  // Handle search with debouncing
  useEffect(() => {
    if (search === '') {
      fetchProducts(1, search, filters);
      return;
    }

    const timeoutId = setTimeout(() => {
      fetchProducts(1, search, filters);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search, fetchProducts]);

  // Handle filter changes
  useEffect(() => {
    fetchProducts(1, search, filters);
    setCurrentPage(1);
  }, [filters.minPrice, filters.maxPrice, filters.categories, fetchProducts]);

  // Handle pagination
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    fetchProducts(page, search, filters);
  };

  // Handle filter changes from FilterFloatingButton
  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  // Update cart when products change
  useEffect(() => {
    const cartItems = products.filter(p => p.quantity > 0);
    setCart(cartItems);
  }, [products]);

  // Update product quantity
  const updateProductQuantity = useCallback((productId, newQuantity) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, quantity: Math.max(0, newQuantity) }
          : product
      )
    );
  }, []);

  // Handle removing item from cart
  const handleRemoveFromCart = useCallback((productId) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, quantity: 0 }
          : product
      )
    );
  }, []);

  // Handle proceed to checkout - now creates order and redirects
  const handleProceedToCheckout = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setOrderError('Please log in to place an order');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }

    if (cart.length === 0) {
      setOrderError('Your cart is empty');
      return;
    }

    if (!user.email || !(user.name || user.full_name)) {
      setOrderError('Please complete your profile information to place an order');
      return;
    }

    try {
      await submitOrder(); // This will create order and redirect
    } catch (error) {
      // Error is already handled in submitOrder function
    }
  }, [cart, isAuthenticated, user, submitOrder, navigate]);

  // Close error snackbar
  const handleCloseErrorSnackbar = () => {
    setOrderError(null);
  };

  const filteredProducts = products;

  if (loading && products.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <FilterFloatingButton
        onFiltersChange={handleFiltersChange}
        initialFilters={filters}
        categories={availableCategories}
      />

      <Grid container spacing={2}>
        <Grid item size={{ xs: 12, md: 8 }}>
          <Box p={2} border={1} borderRadius={2} borderColor="grey.300" sx={{ backgroundColor: '#fff' }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
                <Button
                  onClick={() => fetchProducts(currentPage, search, filters)}
                  sx={{ ml: 2 }}
                  size="small"
                >
                  Retry
                </Button>
              </Alert>
            )}

            <TextField
              variant="outlined"
              size="small"
              fullWidth
              value={search}
              placeholder="Search by product name"
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                display: {
                  xs: 'none',
                  sm: 'none',
                  md: 'flex',
                },
                mb: 2
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              variant="outlined"
              size="small"
              fullWidth
              value={search}
              placeholder="Search by product name"
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                display: {
                  xs: 'flex',
                  sm: 'flex',
                  md: 'none',
                },
                mb: 2
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button variant="contained" size="small">
                      <TuneIcon />
                    </Button>
                  </InputAdornment>
                )
              }}
            />

            <Typography variant="h5" mb={1}>Casual</Typography>
            <Typography variant="subtitle2" mb={3}>
              Showing {filteredProducts.length} of {products.length} Products
              {loading && <CircularProgress size={16} sx={{ ml: 1 }} />}
              {(filters.categories.length > 0 || filters.minPrice > 0 || filters.maxPrice < 300) && (
                <Typography variant="caption" color="primary.main" display="block">
                  Filters applied
                </Typography>
              )}
            </Typography>

            <Grid container spacing={2} mb={4}>
              {filteredProducts.map(product => (
                <Grid item size={{ xs: 12, md: 4 }} key={product.id}>
                  <ProductCard
                    product={product}
                    onQuantityChange={(newQuantity) => updateProductQuantity(product.id, newQuantity)}
                  />
                </Grid>
              ))}
            </Grid>

            {filteredProducts.length === 0 && !loading && (
              <Box textAlign="center" py={4}>
                <Typography variant="body1" color="text.secondary">
                  No products found matching your search.
                </Typography>
              </Box>
            )}

            <Box display="flex" justifyContent="center" mt="auto">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                disabled={loading}
              />
            </Box>
          </Box>
        </Grid>
        <Grid item size={{ xs: 12, md: 4 }}>
          <OrderSummary
            cart={cart}
            onProceedToCheckout={handleProceedToCheckout}
            onRemoveFromCart={handleRemoveFromCart}
            isSubmittingOrder={isSubmittingOrder}
            isAuthenticated={isAuthenticated}
            user={user}
          />
        </Grid>
      </Grid>

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

export default ProductList;
