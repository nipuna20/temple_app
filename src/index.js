import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AuthProvider from './contexts/AuthContext';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#a36f3f' },
    secondary: { main: '#e6b12c' },
    background: { default: '#f5f0e6' },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

const root = createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
);