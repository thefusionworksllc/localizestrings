'use client';
import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Button, Typography, CircularProgress, Alert, TextField, Autocomplete, Chip } from '@mui/material';
import { Language, Speed, Security, CloudUpload, Translate, CloudDownload } from '@mui/icons-material';
import { languages, popularLanguages, getLanguageName } from '../utils/languages';
import supabase from '../supabaseClient';
import { useTranslation } from 'react-i18next';
import '../i18n';

export default function JsonFileTranslator() {
  const { t } = useTranslation('common');
  // State variables for managing file upload, translation status, and user information
  const [file, setFile] = useState(null);
  const [targetLanguage, setTargetLanguage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(null);

  // Update user state when session changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', { 
        event: _event, 
        isLoggedIn: !!session,
        email: session?.user?.email 
      });
      setUser(session?.user || null);
    });

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', { 
        isLoggedIn: !!session,
        email: session?.user?.email 
      });
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Function to handle file drop
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
    }
  }, []);

  // Set up dropzone for file upload
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'] // Accept only JSON files
    },
    maxFiles: 1
  });

  // Function to handle translation
  const handleTranslate = async () => {
    if (!file || !targetLanguage) {
      setError('Please select a file and a target language');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Get current session and token
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session:', { 
        hasSession: !!session,
        hasUser: !!session?.user,
        email: session?.user?.email
      });

      // Convert selected language to full language object
      const lang = languages.find(l => l.code === targetLanguage);
      if (!lang) throw new Error(`Invalid language code: ${targetLanguage}`);
      const languageObject = { code: lang.code, name: lang.name };

      const formData = new FormData();
      formData.append('file', file);
      formData.append('targetLanguages', JSON.stringify([languageObject]));

      // Make the request with auth header
      const headers = new Headers();
      if (session?.access_token) {
        headers.append('Authorization', `Bearer ${session.access_token}`);
      }
      console.log('Request headers:', {
        hasAuth: headers.has('Authorization'),
        authHeader: headers.get('Authorization')?.substring(0, 20) + '...'
      });

      const response = await fetch('/api/translate-json-file', {
        method: 'POST',
        headers,
        body: formData
      });

      const data = await response.json();
      console.log('Translation response:', { 
        status: response.status, 
        ok: response.ok,
        error: data.error 
      });

      if (!response.ok) {
        throw new Error(data.error || 'Translation failed. Please try again.');
      }

      // Download each translated file
      data.translations.forEach(({ content, fileName }) => {
        const blob = new Blob([content], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        // Use the original file name and prefix it with the target language name
        const originalFileName = file.name.split('.').slice(0, -1).join('.');
        a.download = `${originalFileName}_${lang.name.replace(/\s+/g, '')}_translated.json`;

        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      });

      setSuccess(true);
    } catch (err) {
      console.error('Translation error:', err);
      setError(err.message || 'Translation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle language selection
  const handleLanguageChange = (event, newValue) => {
    if (newValue) {
      setTargetLanguage(newValue.code);
      setError(null);
    }
  };

  // Function to load a sample JSON file
  const loadSampleFile = async () => {
    try {
      // Create a sample JSON object
      const sampleJson = {
        "app": {
          "title": "Sample Application",
          "description": "This is a sample JSON file for translation",
          "version": "1.0.0"
        },
        "navigation": {
          "home": "Home",
          "about": "About",
          "contact": "Contact",
          "settings": "Settings"
        },
        "messages": {
          "welcome": "Welcome to our application",
          "goodbye": "Thank you for using our application",
          "error": "An error occurred"
        }
      };
      
      // Convert to string and then to a file object
      const jsonString = JSON.stringify(sampleJson, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const sampleFile = new File([blob], 'sample.json', { type: 'application/json' });
      
      setFile(sampleFile);
      setError(null);
    } catch (err) {
      setError('Error loading sample file');
    }
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        padding: { xs: 2, md: 2 },
        background: '#f8f9fa'
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: '2rem',
            marginBottom: 1,
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center'
          }}
        >
          {t('jsonFileTranslator.title')}
        </Typography>
        
        {/* Features Section */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 2,
            mb: 3,
            mt: 1
          }}
        >
          {/* Feature Cards */}
          <Box
            sx={{
              background: '#fff',
              borderRadius: 2,
              p: 2,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(124, 58, 237, 0.1)',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(124, 58, 237, 0.2)',
                borderColor: 'rgba(124, 58, 237, 0.3)'
              },
              minHeight: '120px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Speed sx={{ fontSize: 28, color: '#7c3aed', mr: 1 }} />
              <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>{t('jsonFileTranslator.featureCards.lightningFast')}</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.4 }}>
              {t('jsonFileTranslator.featureCards.lightningFastDescription')}
            </Typography>
          </Box>

          <Box
            sx={{
              background: '#fff',
              borderRadius: 2,
              p: 2,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(124, 58, 237, 0.1)',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(124, 58, 237, 0.2)',
                borderColor: 'rgba(124, 58, 237, 0.3)'
              },
              minHeight: '120px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Language sx={{ fontSize: 28, color: '#7c3aed', mr: 1 }} />
              <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>{t('jsonFileTranslator.featureCards.multipleLanguages')}</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.4 }}>
              {t('jsonFileTranslator.featureCards.multipleLanguagesDescription')}
            </Typography>
          </Box>

          <Box
            sx={{
              background: '#fff',
              borderRadius: 2,
              p: 2,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(124, 58, 237, 0.1)',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(124, 58, 237, 0.2)',
                borderColor: 'rgba(124, 58, 237, 0.3)'
              },
              minHeight: '120px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Security sx={{ fontSize: 28, color: '#7c3aed', mr: 1 }} />
              <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>{t('jsonFileTranslator.featureCards.secureReliable')}</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.4 }}>
              {t('jsonFileTranslator.featureCards.secureReliableDescription')}
            </Typography>
          </Box>
        </Box>

        {/* Upload and Translation Section */}
        <Box
          sx={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            p: 4,
            maxWidth: 900,
            margin: '0 auto'
          }}
        >
          <Box
            {...getRootProps()}
            sx={{
              border: '4px dashed #7c3aed',
              borderRadius: 2,
              padding: 4,
              marginBottom: 3,
              cursor: 'pointer',             
              transition: '0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                borderColor: '#6366f1'
              }
            }}
          >
            <input {...getInputProps()} /> 
            <Box sx={{ textAlign: 'center' }}>
              <CloudUpload sx={{ fontSize: 48, color: '#7c3aed', mb: 2 }} />
              {isDragActive ? (
                <Typography>{t('jsonFileTranslator.dropzone.dropHere')}</Typography>
              ) : (
                <>
                  <Typography>
                    {t('jsonFileTranslator.dropzone.dragDrop')}
                  </Typography>
                  {!file && ( 
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        loadSampleFile();
                      }}
                      variant="text"
                      sx={{
                        mt: 2,
                        color: '#7c3aed',
                        '&:hover': {
                          background: 'rgba(124, 58, 237, 0.1)'
                        }
                      }}
                    >
                      {t('jsonFileTranslator.dropzone.trySample')}
                    </Button>)
                  }
                </>
              )}
              {file && (
                <Typography sx={{ mt: 2, color: '#7c3aed', fontWeight: 'bold', fontSize: '1.5rem' }}>
                  {t('jsonFileTranslator.dropzone.selectedFile')} {file.name}
                </Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ marginBottom: 2 }}>
            <Autocomplete
              multiple={false}
              id="language-select"
              options={languages}
              value={targetLanguage ? languages.find(lang => lang.code === targetLanguage) : null}
              onChange={handleLanguageChange}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.code === value.code}
              disabled={loading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label={t('jsonFileTranslator.languageSelect.selectTargetLanguage')}
                  placeholder={t('jsonFileTranslator.languageSelect.chooseLanguage')}
                  error={Boolean(error)}
                />
              )}
              renderTags={(value, getTagProps) =>
                value ? (
                  <Chip
                    key={targetLanguage.code}
                    label={targetLanguage.name}
                    sx={{
                      background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
                      color: 'white'
                    }}
                  />
                ) : null
              }
            />

            <Box
              sx={{
                mt: 2,
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)',
                borderRadius: 2,
                padding: 3,
                border: '1px solid rgba(124, 58, 237, 0.1)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: '#4b5563' }}>
                {t('jsonFileTranslator.languageSelect.popularLanguages')}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                {popularLanguages.map(code => (
                  <Chip
                    key={code}
                    label={getLanguageName(code)}
                    onClick={() => {
                      if (!targetLanguage || targetLanguage !== code) {
                        setTargetLanguage(code);
                      }
                    }}
                    sx={{
                      background: targetLanguage === code
                        ? 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)'
                        : 'white',
                      color: targetLanguage === code ? 'white' : '#4b5563',
                      '&:hover': {
                        background: targetLanguage === code
                          ? 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)'
                          : 'rgba(124, 58, 237, 0.1)'
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              onClick={handleTranslate}
              disabled={loading}
              sx={{
                mt: 1,
                background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
                fontWeight: 'bold',
                '&:hover': {
                  background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
                  opacity: 0.9
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : <><Translate sx={{ mr: 1 }} /> {t('jsonFileTranslator.translateNow')}</>}
            </Button>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {t('jsonFileTranslator.translationCompleted')}
              </Alert>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
} 