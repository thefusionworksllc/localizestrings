'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Settings() {
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const user = supabase.auth.user();

    if (!user) {
      setError('You must be logged in to reset your password.');
      return;
    }

    const { error } = await supabase.auth.update({
      password: newPassword,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Password reset successfully!');
      setNewPassword('');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5, p: 3, border: '1px solid #ccc', borderRadius: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Settings</Typography>
      <form onSubmit={handlePasswordReset}>
        <TextField
          label="New Password"
          type="password"
          fullWidth
          variant="outlined"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{ mb: 2 }}
          required
        />
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Reset Password
        </Button>
      </form>
    </Box>
  );
} 