import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const PromoBar = () => (
  <Box
    sx={{
      backgroundColor: 'black',
      color: 'white',
      py: 1,
      px: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    }}
  >
    <Typography
      variant="body2"
      sx={{ textAlign: 'center', width: '100%' }}
    >
      Sign up and get 20% off your first order. <strong>Sign Up Now</strong>
    </Typography>

    <IconButton
      edge="end"
      color="inherit"
      sx={{
        position: 'absolute',
        right: 8,
        top: '50%',
        transform: 'translateY(-50%)',
      }}
    >
      <CloseIcon />
    </IconButton>
  </Box>
);

export default PromoBar;
