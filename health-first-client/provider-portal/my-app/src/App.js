import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ProviderLogin from './components/ProviderLogin';
import ProviderRegistration from './components/ProviderRegistration';
import ProviderDashboard from './components/ProviderDashboard';
import './App.css';

// Create a custom theme for the healthcare application
const theme = createTheme({
  palette: {
    primary: {
      main: '#233853',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f3f3f3',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSwitchToLogin = () => setShowLogin(true);
  const handleSwitchToRegister = () => setShowLogin(false);
  
  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowLogin(true);
  };

  if (isLoggedIn) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ProviderDashboard onLogout={handleLogout} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {showLogin ? (
        <ProviderLogin 
          onSwitchToRegister={handleSwitchToRegister}
          onLogin={handleLogin}
        />
      ) : (
        <ProviderRegistration 
          onSwitchToLogin={handleSwitchToLogin}
          onLogin={handleLogin}
        />
      )}
    </ThemeProvider>
  );
}

export default App;
