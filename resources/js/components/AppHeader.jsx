import React from 'react';
import { AppBar, Toolbar, Button, IconButton, Box, Container } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link } from 'react-router-dom';

const AppBarComponent = () => (
  <AppBar position="static" color="default" elevation={1}>
    <Container>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center" gap={1}>
            <img src="/logo.png" alt="Izam" height="50" />
            <Button variant="text" component={Link} to="/">Products</Button>
            <Button variant="contained">Sell Your Product</Button>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
            <IconButton color="inherit" component={Link} to="/cart">
            <ShoppingCartIcon />
            </IconButton>
            <Button variant="contained" component={Link} to="/login">Login</Button>
        </Box>
        </Toolbar>
    </Container>
  </AppBar>
);

export default AppBarComponent;
