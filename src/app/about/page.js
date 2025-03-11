'use client';

import { Typography, Box, Grid, Paper } from '@mui/material';
import { Language, Speed, Security, Code } from '@mui/icons-material';
import sharedStyles from '../styles/shared.module.css';

export default function About() {
  const features = [
    {
      icon: <Language sx={{ fontSize: 40 }} />,
      title: 'Multiple Languages',
      description: 'Support for over 100 languages with high accuracy translations powered by Google Translate API.'
    },
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: 'Lightning Fast',
      description: 'Get instant translations for your XLIFF files with our optimized processing engine.'
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Secure & Reliable',
      description: 'Your files are encrypted and processed securely. We never store your translation content.'
    },
    {
      icon: <Code sx={{ fontSize: 40 }} />,
      title: 'XLIFF Support',
      description: 'Full support for XLIFF file format, maintaining all your translation memory and metadata.'
    }
  ];

  return (
    <div className={sharedStyles.pageContainer}>
      <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto', px: 3 }}>
        <h1 className={sharedStyles.title} style={{ textAlign: 'center' }}>About XLIFF Translator</h1>
        <p className={sharedStyles.subtitle} style={{ maxWidth: '800px', margin: '0 auto 3rem' }}>
          We're dedicated to making XLIFF file translation simple and efficient for developers and content managers worldwide.
          Our platform combines powerful technology with an easy-to-use interface.
        </p>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    color: '#7c3aed'
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1,
                    textAlign: 'center',
                    fontWeight: 600,
                    color: '#4b5563'
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    textAlign: 'center',
                    color: '#6b7280'
                  }}
                >
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            mt: 8,
            p: 4,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            textAlign: 'center'
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, color: '#4b5563', fontWeight: 600 }}>
            Ready to Get Started?
          </Typography>
          <Typography sx={{ color: '#6b7280', maxWidth: '600px', mx: 'auto' }}>
            Join thousands of developers who trust XLIFF Translator for their localization needs.
            Sign up now and experience the easiest way to manage your translations.
          </Typography>
        </Box>
      </Box>
    </div>
  );
}
