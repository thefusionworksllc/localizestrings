'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Alert,
  CircularProgress,
  Container,
  Paper,
  Grid,
  Snackbar,
  IconButton
} from '@mui/material';
import { 
  Email, 
  Send, 
  Person, 
  Message,
  Close as CloseIcon
} from '@mui/icons-material';
import supabase from '../supabaseClient'; // Importing the Supabase client
import { useColorMode } from '../contexts/ThemeContext';
import styles from './page.module.css';

export default function ContactUs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
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
      // Send email to your address
      const response = await fetch('/api/send-contact-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message,
          recipient: 'thefusionworksllc@gmail.com'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSuccess('Thank you for your message. We will get back to you soon!');
      setOpenSnackbar(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      setError('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 3, md: 5 }, 
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.05)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            transform: 'translateY(-4px)'
          }
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Email sx={{ fontSize: 36, color: '#7c3aed', mr: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                  Contact Us
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#4b5563', mb: 3 }}>
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </Typography>
              
              <Box sx={{ 
                p: 3, 
                bgcolor: 'rgba(124, 58, 237, 0.05)', 
                borderRadius: '12px',
                border: '1px solid rgba(124, 58, 237, 0.1)',
                mb: 3
              }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 1, color: '#1a1a1a' }}>
                  Email Us Directly
                </Typography>
                <Typography variant="body2" sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: '#7c3aed',
                  fontWeight: 500
                }}>
                  <Email sx={{ fontSize: 18, mr: 1 }} />
                  thefusionworksllc@gmail.com
                </Typography>
              </Box>
              
              <Typography variant="body2" sx={{ color: '#6b7280', fontStyle: 'italic' }}>
                We value your feedback and aim to respond to all messages within 24 hours.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={7}>
            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#1a1a1a', display: 'flex', alignItems: 'center' }}>
                  <Person sx={{ fontSize: 18, mr: 1, color: '#7c3aed' }} />
                  Your Name
                </Typography>
                <TextField
                  required
                  fullWidth
                  id="name"
                  placeholder="Enter your name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
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
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#1a1a1a', display: 'flex', alignItems: 'center' }}>
                  <Email sx={{ fontSize: 18, mr: 1, color: '#7c3aed' }} />
                  Email Address
                </Typography>
                <TextField
                  required
                  fullWidth
                  id="email"
                  placeholder="Enter your email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
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
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#1a1a1a', display: 'flex', alignItems: 'center' }}>
                  <Message sx={{ fontSize: 18, mr: 1, color: '#7c3aed' }} />
                  Your Message
                </Typography>
                <TextField
                  required
                  fullWidth
                  id="message"
                  placeholder="What would you like to tell us?"
                  name="message"
                  multiline
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
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
              </Box>
              
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3, 
                    borderRadius: '10px',
                    '& .MuiAlert-icon': {
                      color: '#ef4444'
                    }
                  }}
                >
                  {error}
                </Alert>
              )}
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
                  color: 'white',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 4px 6px rgba(124, 58, 237, 0.2)',
                  '&:hover': {
                    boxShadow: '0 6px 8px rgba(124, 58, 237, 0.25)',
                    background: 'linear-gradient(135deg, #6d31d0 0%, #5354d1 100%)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <>
                    Send Message
                    <Send sx={{ ml: 1, fontSize: 18 }} />
                  </>
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={success}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSnackbar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: '#10B981',
            color: 'white',
            fontWeight: 500,
            borderRadius: '8px',
          }
        }}
      />
    </Container>
  );
}
