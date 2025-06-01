import React from 'react';
import ReactDOM from 'react-dom/client';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import MainLayout from './components/MainLayout';
import Home from './pages/Home';

const theme = createTheme({
    typography: {
        fontFamily: 'Roboto, sans-serif',
    },
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
    },

});

const App = () => (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <MainLayout>
            <Home />
        </MainLayout>
    </ThemeProvider>
);

const root = document.getElementById('root');
ReactDOM.createRoot(root).render(<App />);
