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

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { isDarkMode } = useColorMode();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) throw error;

      setSuccess('Password reset link has been sent to your email!');
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
          Forgot Password
        </Typography>
        
        <Box component="form" onSubmit={handleResetPassword} className={styles.form}>
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

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
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
              'Send Reset Link'
            )}
          </Button>

          <Box className={styles.links}>
            <Button
              onClick={navigateToLogin}
              className={styles.link}
            >
              Remembered your password? Sign In
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
