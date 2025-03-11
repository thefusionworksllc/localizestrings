'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Alert,
  CircularProgress,
  Link
} from '@mui/material';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useColorMode } from '../contexts/ThemeContext';
import sharedStyles from '../styles/shared.module.css';
import styles from './page.module.css';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { isDarkMode } = useColorMode();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
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

  const navigateToSignup = () => {
    router.push('/signup');
  };

  const navigateToForgotPassword = () => {
    router.push('/forgot-password');
  };

  if (!mounted) {
    return null;
  }

  return (
    <Box className={`${sharedStyles.pageContainer} ${styles.root} ${isDarkMode ? styles.darkTheme : ''}`}>
      <Box className={`${sharedStyles.contentCard} ${styles.loginContainer}`}>
        <Typography variant="h4" className={`${sharedStyles.title} ${styles.title}`}>
          Sign In
        </Typography>
        
        <Box component="form" onSubmit={handleLogin} className={styles.form}>
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
              autoComplete="current-password"
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
              'Sign In'
            )}
          </Button>

          <Box className={styles.links}>
            <Button
              onClick={navigateToSignup}
              className={styles.link}
            >
              Don't have an account? Sign Up
            </Button>
            <Button
              onClick={navigateToForgotPassword}
              className={styles.link}
            >
              Forgot password?
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
