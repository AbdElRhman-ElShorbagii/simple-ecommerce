import React, { useState, useEffect } from 'react';
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
  useMediaQuery,
  Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

const AppBarComponent = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Invalid user data in localStorage');
      }
    }
  }, []);

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
      </List>
    </Box>
  );

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Left side (logo and nav links) */}
          <Box display="flex" alignItems="center" gap={1}>
            {isMobile && (
              <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
            )}
            <img src="/logo.png" alt="Izam" height="50" />
            {!isMobile && (
              <>
                <Button variant="text" component={Link} to="/" sx={{ textTransform: 'none' }}>
                  Products
                </Button>
                <Button variant="contained" sx={{ textTransform: 'none' }}>
                  Sell Your Product
                </Button>
              </>
            )}
          </Box>

          {/* Right side (cart, search, auth) */}
          <Box display="flex" alignItems="center" gap={1}>
            {isMobile && (
              <IconButton edge="end" color="inherit">
                <SearchIcon />
              </IconButton>
            )}
            <IconButton color="inherit" component={Link} to="/cart">
              <ShoppingCartIcon />
            </IconButton>
            {user ? (
              <Typography variant="body2" fontWeight={500}>
                Hi, {user.name}
              </Typography>
            ) : (
              <Button variant="contained" component={Link} to="/login">
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
    </AppBar>
  );
};

export default AppBarComponent;
