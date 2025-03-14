'use client';

import { useState, useEffect } from 'react';
import supabase from '../supabaseClient';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Alert,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material';

export default function Settings() {
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setNewEmail(user.email || '');
      
      // Fetch user profile from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setDisplayName(profile.display_name || '');
        setPreferredLanguage(profile.preferred_language || 'en');
        setEmailNotifications(profile.email_notifications !== false);
      }
    }
    setLoading(false);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Password updated successfully!');
      setNewPassword('');
    }
  };

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const { error } = await supabase.auth.updateUser({
      email: newEmail
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Email update confirmation has been sent to your new email address.');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('You must be logged in to update your profile.');
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        display_name: displayName,
        preferred_language: preferredLanguage,
        email_notifications: emailNotifications,
        updated_at: new Date().toISOString()
      });

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Profile updated successfully!');
    }
  };

  const handleAccountDeletion = async () => {
    const { error } = await supabase.auth.admin.deleteUser(
      (await supabase.auth.getUser()).data.user.id
    );

    if (error) {
      setError(error.message);
    } else {
      await supabase.auth.signOut();
      router.push('/');
    }
    setDeleteDialogOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5, p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#6d28d9' }}>Account Settings</Typography>

      {/* Password Reset Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Change Password</Typography>
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
          <Button type="submit" variant="contained" color="primary">
            Update Password
          </Button>
        </form>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Email Update Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Update Email</Typography>
        <form onSubmit={handleEmailUpdate}>
          <TextField
            label="New Email"
            type="email"
            fullWidth
            variant="outlined"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            sx={{ mb: 2 }}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Update Email
          </Button>
        </form>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Profile Settings Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Profile Settings</Typography>
        <form onSubmit={handleProfileUpdate}>
          <TextField
            label="Display Name"
            fullWidth
            variant="outlined"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Preferred Language</InputLabel>
            <Select
              value={preferredLanguage}
              label="Preferred Language"
              onChange={(e) => setPreferredLanguage(e.target.value)}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Spanish</MenuItem>
              <MenuItem value="fr">French</MenuItem>
              <MenuItem value="de">German</MenuItem>
              <MenuItem value="zh">Chinese</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
              />
            }
            label="Receive Email Notifications"
            sx={{ mb: 2 }}
          />

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Save Profile Settings
          </Button>
        </form>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Divider sx={{ my: 4 }} />

      {/* Account Deletion Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Danger Zone</Typography>
        <Button
          variant="contained"
          color="error"
          onClick={() => setDeleteDialogOpen(true)}
        >
          Delete Account
        </Button>
      </Box>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Account Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your account? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAccountDeletion} color="error">
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 
