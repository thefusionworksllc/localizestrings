'use client';
import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  TextField,
  Autocomplete,
  Chip,
  Card,
  CardContent,
  Avatar
} from '@mui/material';
import {
  Language,
  Speed,
  Security,
  CloudUpload,
  Group,
  CheckCircle,
  Timeline,
  Code,
  Business,
  Create,
  Facebook,
  Twitter,
  LinkedIn,
  GitHub,
  Pause,
  PlayArrow
} from '@mui/icons-material';
import { languages, popularLanguages, getLanguageName } from './utils/languages';
import supabase from './supabaseClient'; // Import the singleton instance
import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';

const images = [
  '/ss_online_1.jpg',
  '/ss_file_2.jpg',
];
    
export default function Home() {
  const [file, setFile] = useState(null);
  const [targetLanguages, setTargetLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const totalSlides = images.length;

  // Update user state when session changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Slideshow effect
  useEffect(() => {
    let interval;
    let timeout;

    if (isPlaying) {
      interval = setInterval(() => {
        setFadeOut(true);
        setTimeout(() => {
          setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
          setFadeOut(false);
        }, 500);
      }, 5000);

      // Pause the slideshow after 1 minute
      timeout = setTimeout(() => {
        setIsPlaying(false);
      }, 60000); // 1 minute
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const testimonials = [
    {
      name: 'John D.',
      role: 'Developer',
      quote: 'LocalizeStrings.com has made app localization so much easier. The multi-format support is a game-changer!',
      avatar: '/avatars/john.jpg'
    },
    {
      name: 'Maria S.',
      role: 'Translator',
      quote: 'The real-time collaboration feature has saved me so much time. Highly recommend it!',
      avatar: '/avatars/maria.jpg'
    },
    {
      name: 'Alex T.',
      role: 'Business Owner',
      quote: 'Expanding our business globally has never been easier. The translation memory ensures consistency across all our content.',
      avatar: '/avatars/alex.jpg'
    }
  ];

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <Typography
            variant="h3"
            className={styles.heroTitle}
            sx={{ fontWeight: 600 }}
          >
            Your Ultimate Tool for Seamless Translation and Localization
          </Typography>
          <Typography
            variant="h5"
            className={styles.heroSubtitle}
            sx={{ fontWeight: 400 ,mb: 2}}
          >
            Translate and localize your content effortlessly, powered by Google Translate API.<br />
            Perfect for developers, translators, content creators and businesses.
          </Typography>
          <div className={styles.ctaButtons}>
            <Button 
              variant="contained" 
              className={styles.primaryButton}
              href="/xliff-online-translator"
              sx={{
                textTransform: 'none',
                fontSize: '1rem',
                minWidth: '140px',
                fontWeight: 600
              }}
            >
              Get Started
            </Button>
            <Button 
              variant="outlined" 
              className={styles.secondaryButton}
              href="/features"
              sx={{
                textTransform: 'none',
                fontSize: '1rem',
                minWidth: '140px'
              }}
            >
              Explore Features
            </Button>
          </div>

          <div className={styles.imageContainer}>
            <Image 
              src={images[currentImageIndex]}
              alt="Hero Image"
             // layout="responsive"
              priority = {true}
              width={750}
              height={400}
              className={`${styles.heroImage} ${fadeOut ? styles.fadeOut : ''}`}
            />
            <div className={styles.slideControls}>
              <Button onClick={handlePlayPause} variant="outlined" sx={{ marginRight: 2 }}>
                {isPlaying ? <Pause /> : <PlayArrow />}
              </Button>             
            </div>
          </div>
        </div>
      </section>

      {/* Key Advantages Section */}
      <section className={styles.advantagesSection}>
        <Typography
          variant="h4"
          className={styles.sectionTitle}
          sx={{ fontWeight: 700 }}
        >
          Why Choose LocalizeStrings.com?
        </Typography>
        <div className={styles.advantagesGrid}>
          {[
            {
              icon: <Language sx={{ fontSize: 28 }} />,
              title: 'Multi Language Support',
              description: 'Support for over 100 languages with high accuracy translations'
            },
            
            {
              icon: <Timeline sx={{ fontSize: 28 }} />,
              title: 'Translation Memory',
              description: 'Save time with reusable translations and consistent terminology.'
            },
            {
              icon: <CheckCircle sx={{ fontSize: 28 }} />,
              title: 'Quality Assurance',
              description: 'Automated QA checks to ensure accurate and consistent translations.'
            },
            {
              icon: <Speed sx={{ fontSize: 28 }} />,
              title: 'Lightning Fast',
              description: 'Get instant translations for your files with our optimized processing engine'
            }
          ].map((advantage, index) => (
            <Card key={index} className={styles.advantageCard} elevation={0}>
              <CardContent>
                <Box sx={{ color: '#7c3aed', mb: 2 }}>{advantage.icon}</Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {advantage.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                  {advantage.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Use Cases Section */}
      <section className={styles.useCasesSection}>
        <Typography
          variant="h4"
          className={styles.sectionTitle}
          sx={{ fontWeight: 700 }}
        >
          Who Can Benefit from LocalizeStrings.com?
        </Typography>
        <div className={styles.useCasesGrid}>
          {[
            {
              icon: <Code sx={{ fontSize: 28 }} />,
              title: 'Developers',
              description: 'Localize your apps with support for XLIFF, JSON, and strings.xml.'
            },
            {
              icon: <Language sx={{ fontSize: 28 }} />,
              title: 'Translators',
              description: 'Simplify your workflow with real-time collaboration and translation memory.'
            },
            {
              icon: <Business sx={{ fontSize: 28 }} />,
              title: 'Businesses',
              description: 'Expand your global reach with accurate and consistent translations.'
            },
            {
              icon: <Create sx={{ fontSize: 28 }} />,
              title: 'Content Creators',
              description: 'Localize your content for a global audience with ease.'
            }
          ].map((useCase, index) => (
            <Card key={index} className={styles.advantageCard} elevation={0}>
              <CardContent>
                <Box sx={{ color: '#7c3aed', mb: 2 }}>{useCase.icon}</Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {useCase.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                  {useCase.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorksSection}>
        <Typography
          variant="h4"
          className={styles.sectionTitle}
          sx={{ fontWeight: 700 }}
        >
          How LocalizeStrings.com Works
        </Typography>
        <div className={styles.stepsGrid}>
          {[
            {
              step: 1,
              title: 'Upload Your File',
              description: 'Upload your XLIFF, JSON, or strings.xml file.'
            },
            {
              step: 2,
              title: 'Select Languages',
              description: 'Choose the source and target languages.'
            },
            {
              step: 3,
              title: 'Translate',
              description: 'Use our powerful translation tools to localize your content.'
            },
            {
              step: 4,
              title: 'Download',
              description: 'Download the translated file and integrate it into your project.'
            }
          ].map((step, index) => (
            <Card key={index} className={styles.advantageCard} elevation={0}>
              <CardContent>
                <Typography
                  variant="h1"
                  sx={{
                    color: '#7c3aed',
                    opacity: 0.6,
                    mb: 2,
                    fontSize: '2.5rem',
                    fontWeight: 800
                  }}
                >
                  {step.step}
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {step.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                  {step.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialsSection}>
        <Typography variant="h4" className={styles.sectionTitle} sx={{ fontWeight: 700 }}>
          What Our Users Are Saying
        </Typography>
        <div className={styles.testimonialGrid}>
          {testimonials.map((testimonial, index) => (
            <Card key={index} className={styles.testimonialCard}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar //src={testimonial.avatar} 
                  sx={{ mr: 2 , color: '#7c3aed',opacity: 0.6}} />
                  <Box>
                    <Typography variant="h6">{testimonial.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {testimonial.role}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1">"{testimonial.quote}"</Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Support Us Section */}
      <section className={styles.supportUsSection}>
        <Typography variant="h4" className={styles.sectionTitle}>
          Support Us
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          If you appreciate our services and want to support us, consider signing up !.
        </Typography>
        <div className={styles.ctaButtons}>
          <Button 
            variant="contained" 
            className={styles.primaryButton}
            href="/signup"
            sx={{
              textTransform: 'none',
              fontSize: '1rem',
              minWidth: '140px'
            }}
          >
            Sign Up
          </Button>
          <Link href="/support" passHref>
            <Button 
              variant="outlined" 
              className={styles.secondaryButton}
              sx={{
                textTransform: 'none',
                fontSize: '1rem',
                minWidth: '140px'
              }}
            >
              Support Us
            </Button>
          </Link>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className={styles.ctaSection}>
        <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
          Ready to Simplify Your Localization Workflow?
        </Typography>
        <Typography variant="body1" sx={{ color: 'white', mb: 4 }}>
          Join thousands of developers, translators, and businesses who trust LocalizeStrings.com for their translation needs.
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

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              LocalizeStrings.com
            </Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af' }}>
              Your Ultimate Translation and Localization Platform!!
            </Typography>
          </div>
          <div>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>Links</Typography>
            <ul className={styles.footerLinks}>
              <li><Link href="/features">Features</Link></li>
              <li><Link href="/support">Support</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>Legal</Typography>
            <ul className={styles.footerLinks}>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>Newsletter</Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af', mb: 2 }}>
              Subscribe to our newsletter for updates and tips on localization.
            </Typography>
            <div className={styles.newsletterForm}>
              <TextField
                variant="outlined"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  input: { color: 'white' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#4b5563' },
                    '&:hover fieldset': { borderColor: '#6b7280' },
                    '&.Mui-focused fieldset': { borderColor: '#7c3aed' }
                  }
                }}
              />
              <Button
                variant="contained"
                sx={{
                  background: '#7c3aed',
                  '&:hover': { background: '#6d28d9' }
                }}
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Facebook sx={{ color: '#9ca3af', cursor: 'pointer' }} />
          <Twitter sx={{ color: '#9ca3af', cursor: 'pointer' }} />
          <LinkedIn sx={{ color: '#9ca3af', cursor: 'pointer' }} />
          <GitHub sx={{ color: '#9ca3af', cursor: 'pointer' }} />
        </Box>
      </footer>
    </div>
  );
}