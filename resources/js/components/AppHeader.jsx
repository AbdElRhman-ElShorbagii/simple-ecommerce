import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

const AppBarComponent = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const drawerContent = (
    <Box sx={{ width: 250 }} onClick={toggleDrawer(false)}>
      <List>
        <ListItem button component={Link} to="/">
          <ListItemText primary="Products" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Sell Your Product" />
        </ListItem>
        <ListItem button component={Link} to="/cart">
          <ListItemText primary="Cart" />
        </ListItem>
        <ListItem button component={Link} to="/login">
          <ListItemText primary="Login" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo and Menu */}
          <Box display="flex" alignItems="center" gap={1}>
            {isMobile && (
                <IconButton edge="end" color="inherit" onClick={toggleDrawer(true)}>
                    <MenuIcon />
                </IconButton>
            )}
            <img src="/logo.png" alt="Izam" height="50" />

            {!isMobile && (
              <>
                <Button variant="text" component={Link} to="/">Products</Button>
                <Button variant="contained">Sell Your Product</Button>
              </>
            )}
          </Box>

          {/* Right Side */}
            <Box display="flex" alignItems="center" gap={1}>
                    {isMobile && (
                        <IconButton edge="end" color="inherit">
                            <SearchIcon />
                        </IconButton>
                    )}
                    <IconButton color="inherit" component={Link} to="/cart">
                    <ShoppingCartIcon />
                    </IconButton>
                    <Button variant="contained" component={Link} to="/login">Login</Button>
            </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
    </AppBar>
  );
};

export default AppBarComponent;
