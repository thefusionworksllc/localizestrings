'use client';

import { Box, Grid, Card, CardContent, Typography, Avatar } from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import sharedStyles from '../styles/shared.module.css';
import styles from './page.module.css';
import { useTheme } from '../contexts/ThemeContext';

export default function Testimonials() {
  const { mode } = useTheme();
  
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Frontend Developer',
      company: 'TechSolutions Inc.',
      avatar: '/avatars/avatar1.jpg',
      quote: 'LocalizeStrings.com has completely transformed our localization workflow. What used to take days now takes minutes. The XLIFF translator is incredibly accurate and preserves all our formatting.'
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager',
      company: 'GlobalApp',
      avatar: '/avatars/avatar2.jpg',
      quote: 'We needed a solution that could handle complex JSON structures for our React app. LocalizeStrings.com not only translated our files perfectly but also maintained all nested objects and arrays.'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Localization Specialist',
      company: 'WorldWide Media',
      avatar: '/avatars/avatar3.jpg',
      quote: 'The accuracy of translations is remarkable. We\'ve reduced our post-editing time by 80% since switching to LocalizeStrings.com. The interface is intuitive and the process is seamless.'
    },
    {
      name: 'David Kim',
      role: 'CTO',
      company: 'StartupX',
      avatar: '/avatars/avatar4.jpg',
      quote: 'As a startup, we needed a cost-effective solution for our localization needs. LocalizeStrings.com provided exactly what we needed without breaking the bank. Highly recommended!'
    },
    {
      name: 'Lisa Wang',
      role: 'Software Engineer',
      company: 'DevTeam',
      avatar: '/avatars/avatar5.jpg',
      quote: 'The batch processing feature is a game-changer. We can now translate multiple files at once, saving us countless hours of work. The quality of translations is consistently excellent.'
    },
    {
      name: 'John Smith',
      role: 'Project Manager',
      company: 'Enterprise Solutions',
      avatar: '/avatars/avatar6.jpg',
      quote: 'We\'ve tried several translation tools, but LocalizeStrings.com stands out for its reliability and ease of use. The support team is also incredibly responsive and helpful.'
    }
  ];

  return (
    <div className={`${styles.container} ${sharedStyles.pageContainer}`} data-theme={mode}>
      <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto', px: 3 }}>
        <div className={styles.testimonialsSection}>
          <h1 className={`${sharedStyles.title} ${styles.sectionTitle}`}>What Our Users Say</h1>
          <p className={`${sharedStyles.subtitle} ${styles.sectionSubtitle}`}>
            Don't just take our word for it. Here's what developers and localization specialists have to say about LocalizeStrings.com.
          </p>
          
          <Grid container spacing={4} className={styles.testimonialGrid}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card className={styles.testimonialCard} elevation={0} data-theme={mode}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
                    <FormatQuoteIcon className={styles.quoteIcon} />
                    <Typography variant="body1" className={styles.testimonialQuote}>
                      "{testimonial.quote}"
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto', pt: 2 }}>
                      <Avatar src={testimonial.avatar} alt={testimonial.name} className={styles.avatar} />
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="subtitle1" className={styles.testimonialName}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" className={styles.testimonialRole}>
                          {testimonial.role}, {testimonial.company}
                        </Typography>
                      </Box>
                    </Box>
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