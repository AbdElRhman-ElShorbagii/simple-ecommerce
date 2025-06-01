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

const Cart = () => {
  const products = [
    {
      id: 1,
      name: 'Gradient Graphic T-Shirt',
      price: 145,
      stock: 25,
      imageUrl: 'path/to/image1.jpg', // Replace with your image path
    },
    {
      id: 2,
      name: 'Gradient Graphic T-Shirt',
      price: 145,
      stock: 25,
      imageUrl: 'path/to/image2.jpg', // Replace with your image path
    },
  ];

  const subtotal = products.reduce((total, product) => total + product.price, 0);
  const shipping = 15;
  const total = subtotal + shipping;

  return (
    <Container>
      <Box mt={4}>
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
      </Box>
    </Container>
  );
};

export default Cart;
