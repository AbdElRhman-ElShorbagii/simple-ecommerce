import React from 'react';
import { Box, Typography } from '@mui/material';

const PromoBar = () => (
  <Box
    sx={{
      backgroundColor: 'black',
      color: 'white',
      py: 1,
      textAlign: 'center',
      fontSize: 14
    }}
  >
    <Typography variant="body2">
      Sign up and get 20% off to your first order. <strong>Sign Up Now</strong>
    </Typography>
  </Box>
);

export default PromoBar;
