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
  Avatar,
  Divider
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
  PlayArrow,
  ArrowForward
} from '@mui/icons-material';
import { languages, popularLanguages, getLanguageName } from './utils/languages';
import supabase from './supabaseClient'; // Importing the Supabase client
import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import './i18n'; // Import the i18n configuration
import PageMetadata from './components/PageMetadata';
import { useTheme } from './contexts/ThemeContext';

const images = [
  '/ss_online_1.jpg',
  '/ss_file_2.jpg',
];
    
export default function Home() {
  const { t } = useTranslation('common');
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
  const { mode } = useTheme();

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
      role: t('developers'),
      quote: ' The multi-format support is a game-changer!',
      avatar: '/avatars/john.jpg'
    },
    {
      name: 'Maria S.',
      role: t('translators'),
      quote: 'Highly recommend it!',
      avatar: '/avatars/maria.jpg'
    },
    {
      name: 'Alex T.',
      role: t('businesses'),
      quote: 'Great XLIFF Translation Tool!',
      avatar: '/avatars/alex.jpg'
    }
  ];

  return (
    <>
      <PageMetadata 
        title="Professional XLIFF & JSON Translation Tool"
        description="Streamline your localization workflow with our powerful XLIFF and JSON translation tools. Support for 100+ languages, real-time collaboration, and secure file handling."
        keywords="XLIFF translator, JSON translator, localization tool, translation software, multilingual support, file translation"
        canonicalPath="/"
      />
      <div className={styles.container} data-theme={mode}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <Typography
              variant="h3"
              className={styles.heroTitle}
              sx={{ fontWeight: 700 }}
            >
              {t('heroTitle')}
            </Typography>
            <Typography
              variant="h5"
              className={styles.heroSubtitle}
              sx={{ fontWeight: 400 ,mb: 2}}
            >
              {t('heroSubtitle')}
              <br />
              {t('heroSubtitle2')}
            </Typography>
            <div className={styles.ctaButtons}>
              <Button 
                variant="contained" 
                className={styles.primaryButton}
                href="/xliff-online-translator"
                sx={{
                  textTransform: 'none',
                  fontSize: '1.2rem',
                  minWidth: '140px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {t('getStarted')}
                <ArrowForward sx={{ ml: 1 , fontSize: '1.75rem'}} />
              </Button>
              <Button 
                variant="outlined" 
                className={styles.secondaryButton}
                href="/features"
                sx={{
                  textTransform: 'none',
                  fontSize: '1.2rem',
                  minWidth: '140px'
                }}
              >
                {t('exploreFeatures')}
              </Button>
            </div>
{/* Commented out the slideshow for now
            <div className={styles.imageContainer}>
              <Image 
                src={images[currentImageIndex]}
                alt="Hero Image"
               // layout="responsive"
              //  priority = {true}
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
*/}
          </div>
        </section>

        {/* Key Advantages Section */}
        <section className={styles.advantagesSection}>
          <Typography
            variant="h4"
            className={styles.sectionTitle}
            sx={{ fontWeight: 700 }}
          >
            {t('whyChooseUs')}
          </Typography>
          <div className={styles.advantagesGrid}>
            {[
              {
                icon: <Language sx={{ fontSize: 35, color: '#7c3aed' }} />,
                title: t('multiLanguageSupport'),
                description: t('multiLanguageSupportDesc')
              },
              {
                icon: <Speed sx={{ fontSize: 35, color: '#7c3aed' }} />,
                title: t('lightningFast'),
                description: t('lightningFastDesc')
              },
              {
                icon: <Timeline sx={{ fontSize: 35, color: '#7c3aed' }} />,
                title: t('translationMemory'),
                description: t('translationMemoryDesc')
              },
              {
                icon: <CheckCircle sx={{ fontSize: 35, color: '#7c3aed' }} />,
                title: t('qualityAssurance'),
                description: t('qualityAssuranceDesc')
              },
            ].map((advantage, index) => (
              <Card key={index} className={styles.advantageCard} elevation={0} data-theme={mode}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                  <Box className={styles.iconWrapper}>
                    {advantage.icon}
                  </Box>
                  <Typography variant="h6" className={styles.cardTitle}>
                    {advantage.title}
                  </Typography>
                  <Typography variant="body2" className={styles.cardDescription}>
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
            {t('whoCanUse')}
          </Typography>
          <div className={styles.useCasesGrid}>
            {[
              {
                icon: <Code sx={{ fontSize: 35, color: '#6366f1' }} />,
                title: t('developers'),
                description: t('developersDesc')
              },
              {
                icon: <Language sx={{ fontSize: 35, color: '#6366f1' }} />,
                title: t('translators'),
                description: t('translatorsDesc')
              },
              {
                icon: <Business sx={{ fontSize: 35, color: '#6366f1' }} />,
                title: t('businesses'),
                description: t('businessesDesc')
              },
            ].map((useCase, index) => (
              <Card key={index} className={styles.useCaseCard} elevation={0} data-theme={mode}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                  <Box className={styles.iconWrapper}>
                    {useCase.icon}
                  </Box>
                  <Typography variant="h6" className={styles.cardTitle}>
                    {useCase.title}
                  </Typography>
                  <Typography variant="body2" className={styles.cardDescription}>
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
            {t('howItWorks')}
          </Typography>
          <div className={styles.stepsGrid}>
            {[
              {
                step: 1,
                title: t('uploadYourFile'),
                description: t('uploadYourFileDesc')
              },
              {
                step: 2,
                title: t('selectLanguage'),
                description: t('selectLanguageDesc')
              },
              {
                step: 3,
                title: t('translate'),
                description: t('translateDesc')
              },
              {
                step: 4,
                title: t('download'),
                description: t('downloadDesc')
              }
            ].map((step, index) => (
              <Card key={index} className={styles.stepCard} elevation={0} data-theme={mode}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                  <Typography className={styles.stepNumber}>
                    {step.step}
                  </Typography>
                  <Typography variant="h6" className={styles.cardTitle}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" className={styles.cardDescription}>
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
            {t('testimonials')}
          </Typography>
          <div className={styles.testimonialGrid}>
            {testimonials.map((testimonial, index) => (
              <Card key={index} className={styles.testimonialCard} elevation={0} data-theme={mode}>
                <CardContent>
                  <Box className={styles.avatarWrapper}>
                    <Avatar className={styles.avatar} sx={{ mr: 2 }}>
                      {testimonial.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" className={styles.cardTitle}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body1" className={styles.quote}>
                    "{testimonial.quote}"
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Support Us Section */}
        <section className={styles.supportUsSection}>
          <Typography variant="h4" className={styles.sectionTitle}>
            {t('supportUs')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {t('supportUsDesc')}
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
              {t('signup')}
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
                {t('supportUs')}
              </Button>
            </Link>
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className={styles.ctaSection}>
          <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
            {t('ctaTitle')}
          </Typography>
          <Typography variant="body1" sx={{ color: 'white', mb: 4 }}>
            {t('ctaDesc')}
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
            {t('getStartedFree')}
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
                Your ultimate translation and localization platform
              </Typography>
            </div>
            <div>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>{t('services')}</Typography>
              <ul className={styles.footerLinks}>
                <li><Link href="/xliff-online-translator">{t('xliffOnlineTranslator.title')}</Link></li>
                <li><Link href="/xliff-file-translator">{t('xliffFileTranslator.title')}</Link></li>
                <li><Link href="/xliff-validator">{t('xliffValidator.title')}</Link></li>
              </ul>
            </div>
            <div>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>{t('links')}</Typography>
              <ul className={styles.footerLinks}>
                <li><Link href="/features">{t('features')}</Link></li>
                <li><Link href="/support">{t('support')}</Link></li>
                <li><Link href="/testimonials">{t('testimonials')}</Link></li>
                <li><Link href="/about">{t('aboutUs')}</Link></li>
                <li><Link href="/contact">{t('contactUs')}</Link></li>
              </ul>
            </div>
            <div>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>{t('legal')}</Typography>
              <ul className={styles.footerLinks}>
                <li><Link href="/privacy-policy">{t('privacyPolicy')}</Link></li>
                <li><Link href="/terms-of-service">{t('termsOfService')}</Link></li>
              </ul>
            </div>

          </div>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Facebook sx={{ color: '#9ca3af', cursor: 'pointer' }} />
            <Twitter sx={{ color: '#9ca3af', cursor: 'pointer' }} />
            <LinkedIn sx={{ color: '#9ca3af', cursor: 'pointer' }} />
            <GitHub sx={{ color: '#9ca3af', cursor: 'pointer' }} />
          </Box>
          <Divider className={styles.footerDivider} />
            
            <Typography variant="body2" className={styles.copyright}> 
            {'©'}{new Date().getFullYear() + ' '}{t('copyright')} 
            </Typography>
        </footer>
      </div>
    </>
  );
}