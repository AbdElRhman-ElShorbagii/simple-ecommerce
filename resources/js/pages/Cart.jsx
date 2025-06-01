import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
  Button,
  Grid,
  Box,
} from '@mui/material';
import CartProductCard from '../components/CartProductCard';
import CartOrderSummary from '../components/CartOrderSummary';

const Cart = () => {
    const products = [
        { id: 1, name: 'Gradient Graphic T-shirt', price: 145, stock: 25, image: 'shirt1.png', tag: 'T-shirts', quantity: 1 },
        { id: 2, name: 'Polo with Tipping Details', price: 180, stock: 18, image: 'shirt2.png', tag: 'Polo', quantity: 0 },
      ];

    const cart = products.filter(p => p.quantity > 0);

  return (
    <Grid container spacing={2}>
        <Grid item size={{ xs: 12, md: 8 }}>
            <Grid container spacing={2} mb={4}>
                {products.map(product => (
                <Grid item size={{ xs: 12, md: 12 }} key={product.id}>
                    <CartProductCard product={product} />
                </Grid>
                ))}
            </Grid>
        </Grid>
        <Grid item size={{ xs: 12, md: 4 }}>
            <CartOrderSummary cart={cart} />
        </Grid>
    </Grid>

      /* <Box mt={4}>
        <Typography variant="h4">Your cart</Typography>

        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} md={8}>
            {products.map((product) => (
              <Card key={product.id} variant="outlined" style={{ marginBottom: '16px' }}>
                <Grid container>
                  <Grid item xs={4}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={product.imageUrl} // Use the image URL from the product
                      alt={product.name}
                    />
                  </Grid>
                  <Grid item xs={8}>
                    <CardContent>
                      <Typography variant="h6">{product.name}</Typography>
                      <Typography color="textSecondary">Stock: {product.stock}</Typography>
                      <Box display="flex" alignItems="center" mt={2}>
                        <Button variant="outlined">-</Button>
                        <Typography variant="h6" style={{ margin: '0 16px' }}>
                          1
                        </Typography>
                        <Button variant="outlined">+</Button>
                      </Box>
                      <Typography variant="h6" style={{ marginTop: '16px' }}>
                        ${product.price}
                      </Typography>
                    </CardContent>
                  </Grid>
                </Grid>
              </Card>
            ))}
          </Grid>

          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">Order Summary</Typography>
                <Typography color="textSecondary">Date: 5 May 2025</Typography>
                <Typography>Subtotal: ${subtotal}</Typography>
                <Typography>Shipping: ${shipping}</Typography>
                <Typography variant="h5" style={{ marginTop: '16px' }}>
                  Total: ${total}
                </Typography>
                <Button variant="contained" color="primary" fullWidth style={{ marginTop: '16px' }}>
                  Place the order
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box> */
  );
};

export default Cart;
