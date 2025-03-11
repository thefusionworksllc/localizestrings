'use client';
import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Button, Typography, CircularProgress, Alert, TextField, Autocomplete, Chip } from '@mui/material';
import { Language, Speed, Security, CloudUpload, Translate } from '@mui/icons-material';
import { languages, popularLanguages, getLanguageName } from '../utils/languages';
import { createBrowserClient } from '@supabase/ssr';

export default function XliffFileTranslator() {
  const [file, setFile] = useState(null);
  const [targetLanguages, setTargetLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(null);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

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

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
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
      // Get current session and token
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session:', { 
        hasSession: !!session,
        hasUser: !!session?.user,
        email: session?.user?.email
      });

      if (!session?.access_token) {
        console.error('No access token found');
      }

      // Convert language codes to full language objects
      const languageObjects = targetLanguages.map(code => {
        const lang = languages.find(l => l.code === code);
        if (!lang) throw new Error(`Invalid language code: ${code}`);
        return { code: lang.code, name: lang.name };
      });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('targetLanguages', JSON.stringify(languageObjects));

      // Make the request with auth header
      const headers = new Headers();
      if (session?.access_token) {
        headers.append('Authorization', `Bearer ${session.access_token}`);
      }
      console.log('Request headers:', {
        hasAuth: headers.has('Authorization'),
        authHeader: headers.get('Authorization')?.substring(0, 20) + '...'
      });

      const response = await fetch('/api/translate', {
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
        const blob = new Blob([content], { type: 'application/xml' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        // Prefix the target language name with the original file name
        const targetLanguageName = targetLanguages.map(code => {
          const lang = languages.find(l => l.code === code);
          return lang ? lang.name : '';
        }).join('_'); // Join multiple languages with an underscore

        // Use the original file name and prefix it with the target language name
        const originalFileName = file.name.split('.').slice(0, -1).join('.'); // Remove file extension
        a.download = `${originalFileName}_${targetLanguageName}_translated_content.xliff`; // Updated file name

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

  const handleLanguageChange = (event, newValue) => {
    const maxLanguages = user ? 3 : 1;
    console.log('Language selection:', { 
      newValue, 
      currentCount: newValue.length,
      maxLanguages,
      isLoggedIn: !!user 
    });
    
    // Don't allow more selections than the maximum
    if (newValue.length > maxLanguages) {
      setError(`You can select up to ${maxLanguages} language${maxLanguages > 1 ? 's' : ''}${!user ? '. Please sign in to select up to 3 languages.' : '.'}`);
      return;
    }

    // Map full language objects to just codes for state
    const languageCodes = newValue.map(lang => lang.code);
    setTargetLanguages(languageCodes);
    setError(null);
  };

  const loadSampleFile = async () => {
    try {
      const response = await fetch('/sample.xliff');
      const blob = await response.blob();
      const sampleFile = new File([blob], 'sample.xliff', { type: 'application/xliff+xml' });
      setFile(sampleFile);
      setError(null);
    } catch (err) {
      setError('Error loading sample file');
    }
  };

  // Ensure targetLanguages stays within limits even if user logs out
  useEffect(() => {
    const maxLanguages = user ? 3 : 1;
    if (targetLanguages.length > maxLanguages) {
      setTargetLanguages(prev => prev.slice(0, maxLanguages));
      setError(`Number of languages reduced to ${maxLanguages} due to ${user ? 'your current plan' : 'being logged out'}.`);
    }
  }, [user]);

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        padding: { xs: 2, md: 4 },
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
            background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center'
          }}
        >
          XLIFF File Translator
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
              <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>Lightning Fast</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.4 }}>
              Get instant translations in multiple languages simultaneously.
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
              <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>Multiple Languages</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.4 }}>
              Support for over 100 languages with high accuracy translation.
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
              <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>Secure & Reliable</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.4 }}>
              Your files are processed securely with enterprise-grade encryption.
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
            maxWidth: 1000,
            margin: '0 auto'
          }}
        >
          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed #7c3aed',
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
                <Typography>Drop the XLIFF file here...</Typography>
              ) : (
                <>
                  <Typography>
                    Drag & drop an XLIFF file here, or click to select
                  </Typography>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent dropzone from triggering
                      loadSampleFile();
                    }}
                    variant="text"
                    sx={{
                      mt: 1,
                      color: '#7c3aed',
                      '&:hover': {
                        background: 'rgba(124, 58, 237, 0.1)'
                      }
                    }}
                  >
                    Try Sample File
                  </Button>
                </>
              )}
              {file && (
                <Typography sx={{ mt: 2, color: '#6b7280' }}>
                  Selected file: {file.name}
                </Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ marginBottom: 3 }}>
            <Autocomplete
              multiple
              id="language-select"
              options={languages}
              value={targetLanguages.map(code => languages.find(lang => lang.code === code)).filter(Boolean)}
              onChange={handleLanguageChange}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.code === value.code}
              disabled={loading}
              limitTags={user ? 3 : 1}
              disableCloseOnSelect={false}
              componentsProps={{
                paper: {
                  sx: {
                    pointerEvents: targetLanguages.length >= (user ? 3 : 1) ? 'none' : 'auto'
                  }
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label={`Select Target Languages (${user ? '3 max' : '1 max'})`}
                  placeholder={targetLanguages.length >= (user ? 3 : 1) ? '' : 'Choose a language'}
                  error={Boolean(error)}
                  helperText={error || `${targetLanguages.length}/${user ? 3 : 1} language${targetLanguages.length === 1 ? '' : 's'} selected`}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const { key, ...chipProps } = getTagProps({ index });
                  return (
                    <Chip
                      key={key}
                      {...chipProps}
                      label={option.name}
                      sx={{
                        background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
                        color: 'white'
                      }}
                    />
                  );
                })
              }
            />

            <Box
              sx={{
                mt: 3,
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)',
                borderRadius: 2,
                padding: 3,
                border: '1px solid rgba(124, 58, 237, 0.1)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#4b5563' }}>
                Popular Languages:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                {popularLanguages.map(code => (
                  <Chip
                    key={code}
                    label={getLanguageName(code)}
                    onClick={() => {
                      if (!targetLanguages.includes(code)) {
                        setTargetLanguages([...targetLanguages, code]);
                      }
                    }}
                    sx={{
                      background: targetLanguages.includes(code)
                        ? 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)'
                        : 'white',
                      color: targetLanguages.includes(code) ? 'white' : '#4b5563',
                      '&:hover': {
                        background: targetLanguages.includes(code)
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
                mt: 2,
                background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
                fontWeight: 'bold',
                '&:hover': {
                  background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
                  opacity: 0.9
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : <><Translate sx={{ mr: 1 }} /> Translate Now</>}
            </Button>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Translation completed successfully! Files have been downloaded.
              </Alert>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
