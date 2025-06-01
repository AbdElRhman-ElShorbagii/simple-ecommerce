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
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ProductCard from '../components/ProductCard';
import OrderSummary from '../components/OrderSummary';
import FilterFloatingButton from '../components/FilterFloatingButton';
import TuneIcon from '@mui/icons-material/Tune';

const ProductList = () => {
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

  // Memoize the fetchProducts function to prevent unnecessary re-creations
  const fetchProducts = useCallback(async (page = 1, searchQuery = '', filterParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
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
        // Transform API data to match your component's expected format
        const transformedProducts = apiData.data.map(product => ({
          id: product.id,
          name: product.name,
          price: parseFloat(product.price_raw),
          stock: product.stock_quantity,
          image: product.image_url || `product${product.id}.png`, // fallback image
          tag: product.category,
          quantity: 0, // Initialize cart quantity as 0
          isActive: product.is_active,
          inStock: product.in_stock
        }));

        setProducts(transformedProducts);
        setTotalPages(apiData.meta.total_pages);
        setCurrentPage(apiData.meta.current_page);

        // Extract unique categories for filter component
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
  }, []); // Empty dependency array since this function doesn't depend on any state

  // Initial load - only run once on component mount
  useEffect(() => {
    fetchProducts(1, '', filters);
  }, [fetchProducts]); // Only depend on the memoized fetchProducts function

  // Handle search with debouncing - separate useEffect for search
  useEffect(() => {
    if (search === '') {
      // If search is empty, fetch immediately
      fetchProducts(1, search, filters);
      return;
    }

    const timeoutId = setTimeout(() => {
      fetchProducts(1, search, filters);
      setCurrentPage(1); // Reset to first page when searching
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [search, fetchProducts]); // Remove filters from dependencies to prevent loop

  // Handle filter changes - separate useEffect for filters
  useEffect(() => {
    fetchProducts(1, search, filters);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters.minPrice, filters.maxPrice, filters.categories, fetchProducts]); // Only depend on specific filter properties

  // Handle pagination
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    fetchProducts(page, search, filters);
  };

  // Handle filter changes from FilterFloatingButton
  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  // Update cart when products change - this is fine as is
  useEffect(() => {
    const cartItems = products.filter(p => p.quantity > 0);
    setCart(cartItems);
  }, [products]);

  // Update product quantity (for cart functionality)
  const updateProductQuantity = useCallback((productId, newQuantity) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, quantity: Math.max(0, newQuantity) }
          : product
      )
    );
  }, []);

  // Apply local filtering for immediate feedback (remove if API handles all filtering)
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
                xs: 'none',   // show on extra-small
                sm: 'none',   // show on small
                md: 'flex',   // hide on medium and up
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
                xs: 'flex',   // hidden on xs
                sm: 'flex',   // hidden on sm
                md: 'none',   // visible on md and up
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
        <OrderSummary cart={cart} />
      </Grid>
    </Grid>
    </>
  );
};

export default ProductList;
