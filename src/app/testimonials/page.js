'use client';

import { Typography, Box, Card, CardContent, Avatar, Grid } from '@mui/material';
import styles from './page.module.css';

const testimonialsList = [
  {
    name: 'John D.',
    role: 'Developer',
    quote: 'LocalizeStrings.com has made app localization so much easier. The multi-format support is a game-changer!',
    company: 'Tech Innovations Inc.'
  },
  {
    name: 'Maria S.',
    role: 'Translator',
    quote: 'The real-time collaboration feature has saved me so much time. Highly recommend it!',
    company: 'Global Translations'
  },
  {
    name: 'Alex T.',
    role: 'Business Owner',
    quote: 'Expanding our business globally has never been easier. The translation memory ensures consistency across all our content.',
    company: 'WorldWide Commerce'
  },
  {
    name: 'Sarah L.',
    role: 'Product Manager',
    quote: 'We\'ve cut our localization time in half since switching to LocalizeStrings. The interface is intuitive and the translations are accurate.',
    company: 'SoftDev Solutions'
  },
  {
    name: 'Michael R.',
    role: 'CTO',
    quote: 'The API integration was seamless. We now have automated translations as part of our CI/CD pipeline.',
    company: 'Cloud Systems'
  },
  {
    name: 'Emma K.',
    role: 'Content Creator',
    quote: 'As someone who publishes content in multiple languages, this tool has been invaluable. The quality of translations is impressive.',
    company: 'Digital Content Studio'
  }
];

export default function Testimonials() {
  return (
    <div className={styles.container}>
      <section className={styles.testimonialsSection}>
        <Typography variant="h4" className={styles.sectionTitle}>
          What Our Users Are Saying
        </Typography>
        <Typography variant="body1" className={styles.sectionSubtitle}>
          Don't just take our word for it. Here's what professionals from around the world think about LocalizeStrings.com
        </Typography>
        
        <Grid container spacing={3} className={styles.testimonialGrid}>
          {testimonialsList.map((testimonial, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card className={styles.testimonialCard} elevation={0}>
                <CardContent>
                  <Box className={styles.avatarWrapper}>
                    <Avatar className={styles.avatar}>
                      {testimonial.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" className={styles.cardTitle}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}, {testimonial.company}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body1" className={styles.quote}>
                    "{testimonial.quote}"
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </section>
    </div>
  );
} 