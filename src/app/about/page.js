'use client';

import { Typography, Box, Grid, Paper, Card, CardContent } from '@mui/material';
import { Language, Speed, Security, Code } from '@mui/icons-material';
import sharedStyles from '../styles/shared.module.css';
import styles from './page.module.css';
import { useTheme } from '../contexts/ThemeContext';

export default function About() {
  const { mode } = useTheme();
  
  const features = [
    {
      icon: <Language sx={{ fontSize: 40, color: '#7c3aed' }} />,
      title: 'Multiple Languages',
      description: 'Support for over 100 languages with high accuracy translations powered by Google Translate API.'
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: '#7c3aed' }} />,
      title: 'Lightning Fast',
      description: 'Get instant translations for your language files with our optimized processing engine.'
    },
    {
      icon: <Security sx={{ fontSize: 40, color: '#7c3aed' }} />,
      title: 'Secure & Reliable',
      description: 'Your files are encrypted and processed securely. We never store your translation content.'
    },
    {
      icon: <Code sx={{ fontSize: 40, color: '#7c3aed' }} />,
      title: 'Language Support',
      description: 'Full support for all languages, maintaining all your translation memory and metadata.'
    }
  ];

  return (
    <div className={sharedStyles.pageContainer}>
      <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto', px: 3 }}>
        <h1 className={sharedStyles.title} style={{ textAlign: 'center' }}>About LocalizeStrings.com</h1>
        <p className={sharedStyles.subtitle} style={{ maxWidth: '800px', margin: '0 auto 3rem' }}>
          We're dedicated to making language translation simple and efficient for developers and content managers worldwide.
          Our platform combines powerful technology with an easy-to-use interface.
        </p>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card className={styles.featureCard} elevation={0} data-theme={mode}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                  <Box className={styles.iconWrapper}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" className={styles.cardTitle} data-theme={mode}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" className={styles.cardDescription} data-theme={mode}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            mt: 8,
            p: 4,
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)',
            borderRadius: '16px',
            textAlign: 'center',
            border: '1px solid rgba(124, 58, 237, 0.1)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 20px 30px rgba(124, 58, 237, 0.15)'
            }
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, color: '#4b5563', fontWeight: 600 }}>
            Ready to Get Started?
          </Typography>
          <Typography sx={{ color: '#6b7280', maxWidth: '600px', mx: 'auto' }}>
            Join our community of developers who trust our language translation tool for their localization needs.
            Sign up now and experience the easiest way to manage your translations.
          </Typography>
        </Box>
      </Box>
    </div>
  );
}
