import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Pagination,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ProductCard from '../components/ProductCard';
import OrderSummary from '../components/OrderSummary';
import TuneIcon from '@mui/icons-material/Tune';

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

    <Grid container spacing={2}>
        <Grid item size={{ xs: 12, md: 8 }}>
            <Box p={2} border={1} borderRadius={2} borderColor="grey.300" sx={{ backgroundColor: '#fff' }}>
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
                        mb: 2 }}
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
                </Typography>
                <Grid container spacing={2} mb={4}>
                    {filteredProducts.map(product => (
                    <Grid item size={{ xs: 12, md: 4 }} key={product.id}>
                        <ProductCard product={product} />
                    </Grid>
                    ))}
                </Grid>
                <Box display="flex" justifyContent="center" mt="auto">
                    <Pagination count={1} />
                </Box>
            </Box>
        </Grid>
        <Grid item size={{ xs: 12, md: 4 }}>
            <OrderSummary cart={cart} />
        </Grid>
    </Grid>
  );
};

export default ProductList;
