'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';

const ThemeContext = createContext({
  isDarkMode: false,
  toggleColorMode: () => {}
});

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#7C3AED',
      dark: '#6D28D9',
      light: '#8B5CF6',
      contrastText: '#fff',
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#4B5563',
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8B5CF6',
      dark: '#7C3AED',
      light: '#A78BFA',
      contrastText: '#fff',
    },
    background: {
      default: '#111827',
      paper: '#1F2937',
    },
    text: {
      primary: '#F9FAFB',
      secondary: '#D1D5DB',
    },
  },
});

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check local storage for theme preference
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        setIsDarkMode(savedTheme === 'dark');
      } else if (typeof window !== 'undefined') {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(prefersDark);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, []);

  const toggleColorMode = () => {
    setIsDarkMode(prev => {
      try {
        const newTheme = !prev;
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
        return newTheme;
      } catch (error) {
        console.error('Error accessing localStorage:', error);
        return prev;
      }
    });
  };

  // Use a default theme until the component is mounted
  const theme = mounted ? (isDarkMode ? darkTheme : lightTheme) : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode: mounted ? isDarkMode : false, toggleColorMode }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useColorMode = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useColorMode must be used within a ThemeProvider');
  }
  return context;
};
