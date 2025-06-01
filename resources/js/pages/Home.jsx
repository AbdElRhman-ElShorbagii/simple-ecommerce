import React from 'react';
import FilterFloatingButton from '../components/FilterFloatingButton';
import ProductList from '../components/ProductList';
import { Breadcrumbs, Typography } from '@mui/material';

const Home = () => {
    return (
        <div>
            <Breadcrumbs aria-label="breadcrumb">
                <Typography underline="hover" color="inherit" href="/">
                    Home
                </Typography>
                <Typography sx={{ color: 'text.primary' }}>Casual</Typography>
            </Breadcrumbs>
            <ProductList />
        </div>
    );
};

export default Home;
