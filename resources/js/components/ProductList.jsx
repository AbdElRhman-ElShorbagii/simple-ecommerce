import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ProductCard from '../components/ProductCard';
import OrderSummary from '../components/OrderSummary';

const products = [
  { id: 1, name: 'Gradient Graphic T-shirt', price: 145, stock: 25, image: 'shirt1.png', tag: 'T-shirts', quantity: 1 },
  { id: 2, name: 'Polo with Tipping Details', price: 180, stock: 18, image: 'shirt2.png', tag: 'Polo', quantity: 0 },
  { id: 3, name: 'Black Striped T-shirt', price: 120, stock: 30, image: 'shirt3.png', tag: 'T-shirts', quantity: 2 },
  { id: 4, name: 'Skinny Fit Jeans', price: 240, stock: 15, image: 'jeans1.png', tag: 'Jeans', quantity: 0 },
  { id: 5, name: 'Checkered Shirt', price: 180, stock: 22, image: 'shirt4.png', tag: 'Shirts', quantity: 0 },
  { id: 6, name: 'Sleeve Striped T-shirt', price: 130, stock: 28, image: 'shirt5.png', tag: 'T-shirts', quantity: 0 }
];

const ProductList = () => {
  const [search, setSearch] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const cart = products.filter(p => p.quantity > 0);

  return (
    <Box sx={{ display: 'flex'}}>
      {/* Left side: Products */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2, marginRight: 2 ,background:'#fff', border:1, borderRadius:2, borderColor:"grey.300" }}>
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          value={search}
          placeholder="Search by product name"
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 2 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                    <SearchIcon />
                </InputAdornment>
              ),
            },
          }}

        />
        <Typography variant="h5" mb={2}>Casual</Typography>
        <Typography variant="subtitle2" mb={4}>Showing 1-6 of 6 Products</Typography>
        <Grid container spacing={2}>
          {filteredProducts.map(product => (
            <Grid item xs={12} sm={12} md={12} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Right side: Order Summary */}
      <Box sx={{ borderLeft: '1px solid #eee'}}>
        <OrderSummary cart={cart} />
      </Box>
    </Box>
  );
};

export default ProductList;
