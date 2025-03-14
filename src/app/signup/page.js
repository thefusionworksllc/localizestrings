'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Alert,
  CircularProgress
} from '@mui/material';
import supabase from '../supabaseClient';
import { useRouter } from 'next/navigation';
import { useColorMode } from '../contexts/ThemeContext';
import sharedStyles from '../styles/shared.module.css';
import styles from './page.module.css';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { isDarkMode } = useColorMode();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data?.user) {
        router.push('/');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    router.push('/login');
  };

  if (!mounted) {
    return null;
  }

  return (
    <Box className={`${styles.root} ${isDarkMode ? styles.darkTheme : ''}`}>
      <Box className={styles.container}>
        <Typography variant="h4" className={styles.title}>
          Sign Up
        </Typography>
        
        <Box component="form" onSubmit={handleSignup} className={styles.form}>
          <div className={sharedStyles.formField}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(124, 58, 237, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(124, 58, 237, 0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#7C3AED',
                  },
                },
              }}
            />
          </div>

          <div className={sharedStyles.formField}>
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(124, 58, 237, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(124, 58, 237, 0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#7C3AED',
                  },
                },
              }}
            />
          </div>

          <div className={sharedStyles.formField}>
            <TextField
              required
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(124, 58, 237, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(124, 58, 237, 0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#7C3AED',
                  },
                },
              }}
            />
          </div>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          
          <Button
            type="submit"
            fullWidth
            className={styles.button}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Sign Up'
            )}
          </Button>

          <Box className={styles.links}>
            <Button
              onClick={navigateToLogin}
              className={styles.link}
            >
              Already have an account? Sign In
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
