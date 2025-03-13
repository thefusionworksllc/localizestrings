'use client';
import { Typography, Button, Box } from '@mui/material';
import styles from './page.module.css';

export default function Support() {
  return (
    <div className={styles.container}>
      <section className={styles.donateSection}>
        <Typography variant="h4" className={styles.sectionTitle}>
          Support Us with Your Donation
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Your contributions help us improve our services and keep the platform running. Thank you for your support!
        </Typography>
        <Button 
          variant="contained" 
         // href="https://www.paypal.com/donate" // Replace with your actual donation link
          sx={{
            textTransform: 'none',
            fontSize: '1rem',
            minWidth: '140px',
            background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
            color: 'white',
            '&:hover': { background: '#6d28d9' }
          }}
        >
          Donate Now (Coming Soon)
        </Button>
      </section>
    </div>
  );
}
