import React from 'react';
import { AppBar, Toolbar, Button, IconButton, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const AppBarComponent = () => (
  <AppBar position="static" color="default" elevation={1}>
    <Toolbar sx={{ justifyContent: 'space-between' }}>
      <Box display="flex" alignItems="center" gap={1}>
        <img src="/logo.png" alt="Izam" height="30" />
        <Button variant="text">Products</Button>
        <Button variant="contained">Sell Your Product</Button>
      </Box>

      <Box display="flex" alignItems="center" gap={1}>
        <IconButton color="inherit">
          <ShoppingCartIcon />
        </IconButton>
        <Button variant="contained">Login</Button>
      </Box>
    </Toolbar>
  </AppBar>
);

export default AppBarComponent;
