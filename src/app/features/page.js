'use client';
import { useState } from 'react';
import { Typography, Box, Card, CardContent, Button } from '@mui/material';
import { Language, Group, CheckCircle, Timeline, Code } from '@mui/icons-material';
import styles from './page.module.css';

const featuresList = [
  {
    title: 'Multi-Format Support',
    description: 'Translate and localize various file formats including XLIFF, JSON, and more.',
    icon: <Language sx={{ fontSize: 40, color: '#7c3aed' }} />
  },
  {
    title: 'Real-Time Collaboration',
    description: 'Work with your team in real-time on translation projects.',
    icon: <Group sx={{ fontSize: 40, color: '#7c3aed' }} />
  },
  {
    title: 'Translation Memory',
    description: 'Save time with reusable translations and consistent terminology.',
    icon: <CheckCircle sx={{ fontSize: 40, color: '#7c3aed' }} />
  },
  {
    title: 'Quality Assurance',
    description: 'Automated QA checks to ensure accurate and consistent translations.',
    icon: <Timeline sx={{ fontSize: 40, color: '#7c3aed' }} />
  },
  {
    title: 'Easy Integration',
    description: 'Seamlessly integrate with your existing workflows and tools.',
    icon: <Code sx={{ fontSize: 40, color: '#7c3aed' }} />
  }
];

export default function Features() {
  return (
    <div className={styles.container}>
      <section className={styles.featuresSection}>
        <Typography variant="h4" className={styles.sectionTitle}>
          Features of LocalizeStrings.com
        </Typography>
        <div className={styles.featuresGrid}>
          {featuresList.map((feature, index) => (
            <Card key={index} className={styles.featureCard}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {feature.icon}
                  <Typography variant="h6" gutterBottom sx={{ marginLeft: 1, fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className={styles.ctaSection}>
        <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
          Ready to Simplify Your Localization Workflow?
        </Typography>
        <Button
          variant="contained"
          size="large"
          href="/xliff-online-translator"
          sx={{
            background: 'white',
            color: '#7c3aed',
            '&:hover': { background: '#f3f4f6' }
          }}
        >
          Get Started for Free
        </Button>
      </section>
    </div>
  );
}
