'use client';

import { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Alert, Avatar } from '@mui/material';
import { createBrowserClient } from '@supabase/ssr';
import PersonIcon from '@mui/icons-material/Person';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError('Error fetching testimonials');
      console.error(error);
    } else {
      setTestimonials(data);
    }
  };

  const handleSubmit = async () => {
    if (!name || !message || !role) {
      setError('Please fill in all fields.');
      return;
    }

    const { data, error } = await supabase
      .from('testimonials')
      .insert([{ name, message, role }]);

    if (error) {
      setError('Error submitting testimonial');
      console.error(error);
    } else {
      setSuccess(true);
      setName('');
      setMessage('');
      setRole('');
      fetchTestimonials();
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
    <Box sx={{ padding: 4, background: '#f8f9fa', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Testimonials
      </Typography>
      <Box sx={{ marginBottom: 4 }}>
        <TextField
          label="Your Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Your Role"
          variant="outlined"
          fullWidth
          value={role}
          onChange={(e) => setRole(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Your Testimonial"
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <Button variant="contained" onClick={handleSubmit}>
          Submit Testimonial
        </Button>
        {error && <Alert severity="error" sx={{ marginTop: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ marginTop: 2 }}>Testimonial submitted!</Alert>}
      </Box>

      <Typography variant="h5" gutterBottom>
        All Testimonials
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 2 }}>
        {testimonials.map((testimonial) => (
          <Box key={testimonial.id} sx={{ padding: 2, background: '#fff', borderRadius: 2, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}>
            <Avatar sx={{ bgcolor: '#6d28d9' }}>
              <PersonIcon />
            </Avatar>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {testimonial.name} <span style={{ fontStyle: 'italic', color: '#6b7280' }}>({testimonial.role})</span>
            </Typography>
            <Typography variant="body2" sx={{ marginTop: 1 }}>{testimonial.message}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
} 