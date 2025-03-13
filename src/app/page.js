'use client';
import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Button, Typography, CircularProgress, Alert, TextField, Autocomplete, Chip, Card, CardContent, Avatar } from '@mui/material';
import { Language, Speed, Security, CloudUpload, Group, CheckCircle, Timeline, Code, Business, Create, Facebook, Twitter, LinkedIn, GitHub } from '@mui/icons-material';
import { languages, popularLanguages, getLanguageName } from './utils/languages';
import { createBrowserClient } from '@supabase/ssr';
import styles from './page.module.css';
import Image from 'next/image';

const images = [
  '/SS_1.jpg',
  '/SS_2.jpg',
  //'/public/SS_3.jpg',
  // Add more images as needed
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
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

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
    const interval = setInterval(() => {
      setFadeOut(true); // Start fade out
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setFadeOut(false); // End fade out
      }, 500); // Match this duration with the CSS transition duration
    }, 4000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/xliff+xml': ['.xlf', '.xliff']
    },
    maxFiles: 1
  });

  const handleTranslate = async () => {
    if (!file || targetLanguages.length === 0) {
      setError('Please select a file and at least one target language');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const formData = new FormData();
      formData.append('file', file);
      formData.append('targetLanguages', JSON.stringify(targetLanguages));

      const headers = new Headers();
      if (session?.access_token) {
        headers.append('Authorization', `Bearer ${session.access_token}`);
      }

      const response = await fetch('/api/translate', {
        method: 'POST',
        headers,
        body: formData
      });

      if (!response.ok) {
        throw new Error('Translation failed. Please try again.');
      }

      const data = await response.json();
      // Handle file download logic here...

      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Translation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (event, newValue) => {
    const maxLanguages = user ? 3 : 1;
    if (newValue.length > maxLanguages) {
      setError(`You can select up to ${maxLanguages} language${maxLanguages > 1 ? 's' : ''}.`);
      return;
    }
    setTargetLanguages(newValue.map(lang => lang.code));
    setError(null);
  };

  // Pricing tiers data
  const pricingTiers = [
    {
      title: 'Free Plan',
      price: '$0',
      features: [
        'Basic translation features',
        'Limited file formats',
        'Community support',
        '1 project',
        'Basic API access'
      ]
    },
    {
      title: 'Pro Plan',
      price: '$49',
      features: [
        'Full access to all features',
        'All file formats supported',
        'Priority support',
        'Unlimited projects',
        'Advanced API access',
        'Translation memory'
      ]
    },
    {
      title: 'Enterprise Plan',
      price: 'Custom',
      features: [
        'Custom solutions',
        'Dedicated support',
        'SLA guarantee',
        'Custom integrations',
        'Advanced security features',
        'Team management'
      ]
    }
  ];

  // Testimonials data
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
            variant="h1" 
            className={styles.heroTitle}
            sx={{ fontWeight: 500 }}
          >
            Your Ultimate Tool for Seamless Translation and Localization
          </Typography>
          <Typography 
            variant="h2" 
            className={styles.heroSubtitle}
            sx={{ fontWeight: 300 }}
          >
            Translate and localize your content effortlessly with support for XLIFF, JSON, strings.xml, and more. 
            Perfect for developers, translators, and businesses.
          </Typography>
          <div className={styles.ctaButtons}>
            <Button 
              variant="contained" 
              className={styles.primaryButton}
              sx={{
                textTransform: 'none',
                fontSize: '1rem',
                minWidth: '160px'
              }}
            >
              Get Started for Free
            </Button>
            <Button 
              variant="outlined" 
              className={styles.secondaryButton}
              sx={{
                textTransform: 'none',
                fontSize: '1rem',
                minWidth: '160px'
              }}
            >
              Explore Features
            </Button>
            
          </div>
          <div className={styles.imageContainer}>
            <Image 
              src={images[currentImageIndex]} // Use the current image index
              alt="Hero Image"
              layout="responsive"
              width={700}
              height={400}
              className={`${styles.heroImage} ${fadeOut ? styles.fadeOut : ''}`} // Apply fade-out class
            />
          </div>
        </div>
      </section>

      {/* Key Advantages Section */}
      <section className={styles.advantagesSection}>
        <Typography 
          variant="h2" 
          className={styles.sectionTitle}
          sx={{ fontWeight: 700 }}
        >
          Why Choose LocalizeStrings.com?
        </Typography>
        <div className={styles.advantagesGrid}>
          {[
            { icon: <Language sx={{ fontSize: 32 }} />, title: 'Multi-Format Support', description: 'Translate and localize XLIFF, JSON, strings.xml, PO, YAML, and more.' },
            { icon: <Group sx={{ fontSize: 32 }} />, title: 'Real-Time Collaboration', description: 'Work with your team in real-time on translation projects.' },
            { icon: <Timeline sx={{ fontSize: 32 }} />, title: 'Translation Memory', description: 'Save time with reusable translations and consistent terminology.' },
            { icon: <CheckCircle sx={{ fontSize: 32 }} />, title: 'Quality Assurance', description: 'Automated QA checks to ensure accurate and consistent translations.' },
            { icon: <Code sx={{ fontSize: 32 }} />, title: 'Easy Integration', description: 'Seamlessly integrate with your existing workflows and tools.' }
          ].map((advantage, index) => (
            <Card key={index} className={styles.advantageCard} elevation={0}>
              <CardContent>
                <Box sx={{ color: '#7c3aed', mb: 2 }}>{advantage.icon}</Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>{advantage.title}</Typography>
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
          variant="h2" 
          className={styles.sectionTitle}
          sx={{ fontWeight: 700 }}
        >
          Who Can Benefit from LocalizeStrings.com?
        </Typography>
        <div className={styles.useCasesGrid}>
          {[
            { icon: <Code sx={{ fontSize: 32 }} />, title: 'Developers', description: 'Localize your apps and software with support for XLIFF, JSON, and strings.xml.' },
            { icon: <Language sx={{ fontSize: 32 }} />, title: 'Translators', description: 'Simplify your workflow with real-time collaboration and translation memory.' },
            { icon: <Business sx={{ fontSize: 32 }} />, title: 'Businesses', description: 'Expand your global reach with accurate and consistent translations.' },
            { icon: <Create sx={{ fontSize: 32 }} />, title: 'Content Creators', description: 'Localize your content for a global audience with ease.' }
          ].map((useCase, index) => (
            <Card key={index} className={styles.advantageCard} elevation={0}>
              <CardContent>
                <Box sx={{ color: '#7c3aed', mb: 2 }}>{useCase.icon}</Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>{useCase.title}</Typography>
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
          variant="h2" 
          className={styles.sectionTitle}
          sx={{ fontWeight: 700 }}
        >
          How LocalizeStrings.com Works
        </Typography>
        <div className={styles.stepsGrid}>
          {[
            { step: 1, title: 'Upload Your File', description: 'Upload your XLIFF, JSON, or strings.xml file.' },
            { step: 2, title: 'Select Languages', description: 'Choose the source and target languages.' },
            { step: 3, title: 'Translate', description: 'Use our powerful translation tools to localize your content.' },
            { step: 4, title: 'Download', description: 'Download the translated file and integrate it into your project.' }
          ].map((step, index) => (
            <Card key={index} className={styles.advantageCard} elevation={0}>
              <CardContent>
                <Typography variant="h1" sx={{ color: '#7c3aed', opacity: 0.15, mb: 2, fontSize: '4rem', fontWeight: 800 }}>
                  {step.step}
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>{step.title}</Typography>
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
        <Typography variant="h2" className={styles.sectionTitle}>
          What Our Users Are Saying
        </Typography>
        <div className={styles.testimonialGrid}>
          {testimonials.map((testimonial, index) => (
            <Card key={index} className={styles.testimonialCard}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar src={testimonial.avatar} sx={{ mr: 2 }} />
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

      {/* Pricing Section */}
      <section className={styles.pricingSection}>
        <Typography variant="h2" className={styles.sectionTitle}>
          Flexible Pricing for Every Need
        </Typography>
        <div className={styles.pricingGrid}>
          {pricingTiers.map((tier, index) => (
            <Card key={index} className={styles.pricingCard}>
              <CardContent>
                <Typography variant="h5" gutterBottom>{tier.title}</Typography>
                <Typography variant="h3" sx={{ color: '#7c3aed', my: 2 }}>
                  {tier.price}
                </Typography>
                <Box sx={{ my: 3 }}>
                  {tier.features.map((feature, i) => (
                    <Typography key={i} variant="body2" sx={{ mb: 1 }}>
                      ✓ {feature}
                    </Typography>
                  ))}
                </Box>
                <Button 
                  variant="contained" 
                  fullWidth 
                  sx={{ 
                    background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
                    '&:hover': { opacity: 0.9 }
                  }}
                >
                  Choose {tier.title}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className={styles.ctaSection}>
        <Typography variant="h2" sx={{ color: 'white', mb: 2 }}>
          Ready to Simplify Your Localization Workflow?
        </Typography>
        <Typography variant="h6" sx={{ color: 'white', mb: 4 }}>
          Join thousands of developers, translators, and businesses who trust LocalizeStrings.com for their translation needs.
        </Typography>
        <Button 
          variant="contained" 
          size="large"
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
              Your ultimate translation and localization platform
            </Typography>
          </div>
          <div>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>Links</Typography>
            <ul className={styles.footerLinks}>
              <li><a href="#">Features</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>Legal</Typography>
            <ul className={styles.footerLinks}>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
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
