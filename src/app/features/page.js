'use client';

import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import { Language, Speed, Security, Code, Translate, Storage, CloudUpload, CloudDownload } from '@mui/icons-material';
import sharedStyles from '../styles/shared.module.css';
import styles from './page.module.css';
import { useTheme } from '../contexts/ThemeContext';

export default function Features() {
  const { mode } = useTheme();
  
  const features = [
    {
      icon: <Translate sx={{ fontSize: 40, color: '#7c3aed' }} />,
      title: 'XLIFF Translation',
      description: 'Translate XLIFF files with high accuracy while preserving all metadata and translation memory.'
    },
    {
      icon: <Code sx={{ fontSize: 40, color: '#7c3aed' }} />,
      title: 'JSON Translation',
      description: 'Easily translate JSON files for your web applications, maintaining nested structures and arrays.'
    },
    {
      icon: <Language sx={{ fontSize: 40, color: '#7c3aed' }} />,
      title: '100+ Languages',
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
      icon: <Storage sx={{ fontSize: 40, color: '#7c3aed' }} />,
      title: 'Format Preservation',
      description: 'We maintain all formatting, placeholders, and special characters in your translation files.'
    },
    {
      icon: <CloudUpload sx={{ fontSize: 40, color: '#7c3aed' }} />,
      title: 'Batch Processing',
      description: 'Upload multiple files at once and translate them in a single operation to save time.'
    },
    {
      icon: <CloudDownload sx={{ fontSize: 40, color: '#7c3aed' }} />,
      title: 'Easy Export',
      description: 'Download your translated files in the original format, ready to use in your application.'
    }
  ];

  return (
    <div className={`${styles.container} ${sharedStyles.pageContainer}`} data-theme={mode}>
      <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto', px: 3 }}>
        <div className={styles.featuresSection}>
          <h1 className={`${sharedStyles.title} ${styles.sectionTitle}`}>Our Features</h1>
          <p className={`${sharedStyles.subtitle} ${styles.sectionSubtitle}`}>
            Discover the powerful features that make LocalizeStrings.com the preferred choice for developers and content managers.
          </p>
          
          <Grid container spacing={4} className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card className={styles.featureCard} elevation={0} data-theme={mode}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                    <Box className={styles.iconWrapper}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" className={styles.cardTitle}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" className={styles.cardDescription}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      </Box>
    </div>
  );
}
