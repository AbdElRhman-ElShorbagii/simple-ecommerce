import React from 'react';
import FilterFloatingButton from '../components/FilterFloatingButton';
import ProductList from '../components/ProductList';

const Home = () => {
    return (
        <div>
            <FilterFloatingButton />
            <ProductList />
        </div>
    );
};

export default Home;
