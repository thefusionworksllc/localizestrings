'use client';
import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Button, Typography, CircularProgress, Alert, TextField, Autocomplete, Chip } from '@mui/material';
import { Language, Speed, Security, CloudUpload, Translate, CloudDownload } from '@mui/icons-material';
import { languages, popularLanguages, getLanguageName } from '../utils/languages';
import { createBrowserClient } from '@supabase/ssr';

export default function XliffFileTranslator() {
  // State variables for managing file upload, translation status, and user information
  const [file, setFile] = useState(null); // Uploaded file
  const [targetLanguage, setTargetLanguage] = useState(null); // Selected target language
  const [loading, setLoading] = useState(false); // Loading state for translation
  const [error, setError] = useState(null); // Error message state
  const [success, setSuccess] = useState(false); // Success state for translation
  const [user, setUser] = useState(null); // User information

  // Create Supabase client for authentication and database access
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
      setUser(session?.user || null); // Update user state
    });

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', { 
        isLoggedIn: !!session,
        email: session?.user?.email 
      });
      setUser(session?.user || null); // Update user state
    });

    return () => subscription.unsubscribe(); // Clean up subscription on unmount
  }, []);

  // Function to handle file drop
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]); // Set the uploaded file
      setError(null); // Clear previous errors
    }
  }, []);

  // Set up dropzone for file upload
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/xliff+xml': ['.xlf', '.xliff'] // Accept only XLIFF files
    },
    maxFiles: 1 // Limit to one file
  });

  // Function to handle translation
  const handleTranslate = async () => {
    if (!file || !targetLanguage) {
      setError('Please select a file and a target language'); // Error if file or language is not selected
      return;
    }

    setLoading(true); // Set loading state
    setError(null); // Clear previous errors
    setSuccess(false); // Reset success state

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

      const formData = new FormData(); // Create form data for file upload
      formData.append('file', file); // Append the file
      formData.append('targetLanguages', JSON.stringify([languageObject])); // Append target language

      // Make the request with auth header
      const headers = new Headers();
      if (session?.access_token) {
        headers.append('Authorization', `Bearer ${session.access_token}`); // Add authorization token if available
      }
      console.log('Request headers:', {
        hasAuth: headers.has('Authorization'),
        authHeader: headers.get('Authorization')?.substring(0, 20) + '...'
      });

      const response = await fetch('/api/translate', {
        method: 'POST',
        headers,
        body: formData // Send form data
      });

      const data = await response.json();
      console.log('Translation response:', { 
        status: response.status, 
        ok: response.ok,
        error: data.error 
      });

      if (!response.ok) {
        throw new Error(data.error || 'Translation failed. Please try again.'); // Handle errors
      }

      // Download each translated file
      data.translations.forEach(({ content, fileName }) => {
        const blob = new Blob([content], { type: 'application/xml' }); // Create a blob for the translated content
        const url = window.URL.createObjectURL(blob); // Create a URL for the blob
        const a = document.createElement('a'); // Create an anchor element
        a.href = url;

        // Use the original file name and prefix it with the target language name
        const originalFileName = file.name.split('.').slice(0, -1).join('.'); // Remove file extension
        a.download = `${originalFileName}_${lang.name.replace(/\s+/g, '')}_translated_content.xliff`; // Updated file name

        document.body.appendChild(a); // Append anchor to the body
        a.click(); // Trigger download
        window.URL.revokeObjectURL(url); // Clean up URL
        document.body.removeChild(a); // Remove anchor from the body
      });

      setSuccess(true); // Set success state
    } catch (err) {
      console.error('Translation error:', err);
      setError(err.message || 'Translation failed. Please try again.'); // Set error message
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Function to handle language selection
  const handleLanguageChange = (event, newValue) => {
    if (newValue) {
      setTargetLanguage(newValue.code); // Set selected language code
      setError(null); // Clear error message
    }
  };

  // Function to load a sample XLIFF file
  const loadSampleFile = async () => {
    try {
      const response = await fetch('/sample.xliff');
      const blob = await response.blob(); // Get blob from response
      const sampleFile = new File([blob], 'sample.xliff', { type: 'application/xliff+xml' }); // Create a file object
      setFile(sampleFile); // Set the sample file
      setError(null); // Clear previous errors
    } catch (err) {
      setError('Error loading sample file'); // Set error message
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
              <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>Lightning Fast</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.4 }}>
              Get instant translations in multiple languages with high accuracy.
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
              Your files are processed securely and never stored on our servers.
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
            {...getRootProps()} // Dropzone properties
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
            <input {...getInputProps()} /> // Input for file selection
            <Box sx={{ textAlign: 'center' }}>
              <CloudDownload sx={{ fontSize: 48, color: '#7c3aed', mb: 2 }} />
              {isDragActive ? (
                <Typography>Drop the XLIFF file here...</Typography> // Message when file is dragged over
              ) : (
                <>
                  <Typography>
                    Drag & drop an XLIFF file here, or click to select
                  </Typography>
                  {!file && ( 
                    <Button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent dropzone from triggering
                        loadSampleFile(); // Load sample file
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
                      Try a Sample File
                    </Button>)
                  }
                </>
              )}
              {file && (
                <Typography sx={{ mt: 2,  color: '#7c3aed' ,fontWeight: 'bold' , fontSize: '1.5rem'}}>
                  Selected file: {file.name} // Display selected file name
                </Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ marginBottom: 2 }}>
            <Autocomplete
              multiple={false}
              id="language-select"
              options={languages}
              value={targetLanguage ? languages.find(lang => lang.code === targetLanguage) : null} // Set selected language
              onChange={handleLanguageChange} // Handle language change
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.code === value.code}
              disabled={loading} // Disable when loading
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label={`Select Target Language`}
                  placeholder='Choose a language'
                  error={Boolean(error)} // Show error if exists
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
                Popular Languages:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                {popularLanguages.map(code => (
                  <Chip
                    key={code}
                    label={getLanguageName(code)}
                    onClick={() => {
                      if (!targetLanguage || targetLanguage !== code) {
                        setTargetLanguage(code); // Set target language on click
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
              onClick={handleTranslate} // Trigger translation
              disabled={loading} // Disable button while loading
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
              {loading ? <CircularProgress size={24} color="inherit" /> : <><Translate sx={{ mr: 1 }} /> Translate Now</>}
            </Button>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error} // Display error message
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Translation completed successfully! Files have been downloaded. // Display success message
              </Alert>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
