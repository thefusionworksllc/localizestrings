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
import supabase from '../supabaseClient'; // Importing the Supabase client
import { useColorMode } from '../contexts/ThemeContext';
import sharedStyles from '../styles/shared.module.css';
import styles from './page.module.css';

export default function ContactUs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isDarkMode } = useColorMode();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Here you would typically send the contact form data to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setSuccess('Thank you for your message. We will get back to you soon!');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      setError('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <Box className={`${styles.root} ${isDarkMode ? styles.darkTheme : ''}`}>
      <Box className={styles.container}>
        <Typography variant="h4" className={styles.title}>
          Contact Us
        </Typography>

        <Typography variant="body1" className={styles.description}>
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} className={styles.form}>
          <div className={sharedStyles.formField}>
            <TextField
              required
              fullWidth
              id="name"
              label="Your Name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              id="email"
              label="Email Address"
              name="email"
              type="email"
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
              id="message"
              label="Your Message"
              name="message"
              multiline
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
              'Send Message'
            )}
          </Button>
        </Box>

        <Box className={styles.contactInfo}>
          <Typography variant="h6" component="div" className={styles.contactItem}>
            Email: thefusionworksllc@gmail.com
          </Typography>        
        </Box>
      </Box>
    </Box>
  );
}
