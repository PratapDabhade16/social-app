import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Feed from './pages/Feed';

const theme = createTheme({
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", "Segoe UI", sans-serif',
    h4: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h6: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    subtitle1: {
      fontWeight: 500,
    },
    body1: {
      fontSize: '0.95rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  palette: {
    primary: {
      main: '#4f46e5', // Indigo
      light: '#6366f1',
      dark: '#4338ca',
    },
    secondary: {
      main: '#06b6d4', // Cyan
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          '& fieldset': {
            borderColor: 'rgba(226, 232, 240, 0.8)',
          },
          '&:hover fieldset': {
            borderColor: '#cbd5e1',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#4f46e5',
          },
        },
      },
    },
  },
});

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login"  element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={
            <PrivateRoute>
              <Feed />
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;