import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        MUI + Roboto + Vite
      </Typography>
    </Container>
  </ThemeProvider>
);

const root = document.getElementById('root');
ReactDOM.createRoot(root).render(<App />);
