'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create the context
export const ThemeContext = createContext({
  mode: 'light',
  toggleMode: () => {},
  isDarkMode: false
});

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Theme provider component
export function ThemeProvider({ children }) {
  // Initialize with system preference, defaulting to 'light' if not available
  const [mode, setMode] = useState('light');
  
  useEffect(() => {
    // Check for saved preference in localStorage
    const savedMode = localStorage.getItem('themeMode');
    
    if (savedMode) {
      setMode(savedMode);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // If no saved preference, use system preference
      setMode('dark');
    }
    
    // Listen for changes in system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('themeMode')) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  // Toggle between light and dark mode
  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };
  
  // Create MUI theme based on current mode
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#7c3aed', // Purple
        dark: '#6d28d9',
        light: '#8b5cf6',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#6366f1', // Indigo
        dark: '#4f46e5',
        light: '#818cf8',
        contrastText: '#ffffff',
      },
      background: {
        default: mode === 'light' ? '#ffffff' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
      text: {
        primary: mode === 'light' ? '#1a1a1a' : '#f3f4f6',
        secondary: mode === 'light' ? '#6b7280' : '#9ca3af',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: 'background-color 0.3s ease, color 0.3s ease',
          },
        },
      },
    },
  });
  
  return (
    <ThemeContext.Provider value={{ mode, toggleMode, isDarkMode: mode === 'dark' }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
