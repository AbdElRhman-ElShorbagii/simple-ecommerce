import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import AppHeader from './AppHeader';
import PromoBar from './PromoBar';

const MainLayout = ({ children }) => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <PromoBar />
            <AppHeader />

            <Container sx={{ mt: 4 }}>
                {children}
            </Container>
        </Box>
    );
};

export default MainLayout;
