'use client';
import { useState } from 'react';
import { Box, Button, Typography, CircularProgress, Alert, TextField, Autocomplete, Chip } from '@mui/material';
import { Translate, FileCopy, Download, Refresh, CloudUpload, SimCardDownloadOutlined } from '@mui/icons-material';
import { languages, popularLanguages, getLanguageName } from '../utils/languages';   
import supabase from '../supabaseClient';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { saveAs } from 'file-saver';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '@mui/material';
import '../i18n'; // Import the i18n configuration

export default function JsonOnlineTranslator() {
  const { t } = useTranslation('common');
  const isMobile = useMediaQuery('(max-width:600px)'); // Check if the screen size is mobile
  // State variables for managing JSON content, translation status, and user information
  const [sourceJson, setSourceJson] = useState(''); // Source JSON content
  const [translatedJson, setTranslatedJson] = useState(''); // Translated JSON content
  const [targetLanguage, setTargetLanguage] = useState(null); // Selected target language
  const [loading, setLoading] = useState(false); // Loading state for translation
  const [error, setError] = useState(null); // Error message state
  const [success, setSuccess] = useState(false); // Success state for translation
  const [user, setUser] = useState(null); // User information

  // Function to handle translation of the JSON content
  const handleTranslate = async () => {
    // Validate input fields
    if (!sourceJson || !targetLanguage) {
      setError('Please enter JSON content and select a target language');
      return;
    }

    // Validate JSON format
    try {
      JSON.parse(sourceJson);
    } catch (e) {
      setError('Invalid JSON format. Please check your input.');
      return;
    }

    setLoading(true); // Set loading state
    setError(null); // Clear previous errors
    setSuccess(false); // Reset success state

    try {
      // Get the current user session
      const { data: { session } } = await supabase.auth.getSession();

      // Set up headers for the API request
      const headers = new Headers({
        'Content-Type': 'application/json'
      });
      
      // Append authorization token if available
      if (session?.access_token) {
        headers.append('Authorization', `Bearer ${session.access_token}`);
      }

      // Make API call to translate the text
      const response = await fetch('/api/translate-json', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          content: sourceJson,
          targetLanguage: {
            code: targetLanguage.code,
            name: targetLanguage.name
          }
        })
      });

      const data = await response.json();

      // Check for errors in the response
      if (!response.ok) {
        throw new Error(data.error || 'Translation failed. Please try again.');
      }

      // Set the translated JSON content
      setTranslatedJson(JSON.stringify(data.translatedContent, null, 2));
      setSuccess(true); // Set success state
    } catch (err) {
      console.error('Translation error:', err);
      setError(err.message || 'Translation failed. Please try again.'); // Set error message
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Function to copy translated content to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(translatedJson)
      .then(() => {
        setSuccess(true); // Set success state
        setError(null); // Clear previous errors
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        setError('Failed to copy content.'); // Set error message
      });
  };

  // Function to download the translated content as a file
  const handleDownload = () => {
    const blob = new Blob([translatedJson], { type: 'application/json' });
    saveAs(blob, 'translated_content.json'); // Use file-saver to download the file
  };

  // Function to reset the input fields and states
  const handleReset = () => {
    setSourceJson(''); // Clear source JSON
    setTranslatedJson(''); // Clear translated JSON
    setTargetLanguage(null); // Reset target language
    setError(null); // Clear error message
    setSuccess(false); // Reset success state
  };

  // Function to load a sample JSON file
  const loadSampleFile = () => {
    const sampleJson = JSON.stringify({
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
    }, null, 2);
    
    setSourceJson(sampleJson);
    setError(null); // Clear previous errors
  };

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
          maxWidth: '100%',
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
            textAlign: 'center',
            fontWeight: 'bold'
          }}
        >
          {t('jsonOnlineTranslator.title')}
        </Typography>

        {/* Main Editor Container */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 2,
            marginBottom: 3,
            height: '600px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            padding: 2
          }}
        >
          {/* Left Panel */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              minWidth: 0
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px 4px 0 0',
                borderBottom: '1px solid #e2e8f0'
              }}
            >
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600,
                  color: '#4a5568'
                }}
              >
                {t('jsonOnlineTranslator.sourceJson')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  onClick={loadSampleFile}
                  startIcon={<SimCardDownloadOutlined />}
                  sx={{
                    backgroundColor: '#6366f1',
                    color: 'white',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#4f46e5',
                    }
                  }}
                >
                  {isMobile ? 'Sample' : t('jsonOnlineTranslator.loadSampleData')}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  startIcon={<Refresh />}
                  sx={{
                    textTransform: 'none',
                    borderColor: '#e2e8f0',
                    color: '#4a5568',
                    '&:hover': {
                      borderColor: '#cbd5e0',
                      backgroundColor: '#f8f9fa'
                    }
                  }}
                >
                  {t('jsonOnlineTranslator.reset')}
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                backgroundColor: '#ffffff',
                overflow: 'hidden',
                minWidth: 0
              }}
            >
              <TextField
                id="source-json-input"
                multiline
                fullWidth
                value={sourceJson}
                onChange={(e) => setSourceJson(e.target.value)}
                placeholder={t('jsonOnlineTranslator.pasteJsonContentHere')}
                sx={{
                  height: '100%',
                  padding: '8px',
                  '.MuiOutlinedInput-root': {
                    height: '100%',
                    padding: 0,
                    '& textarea': {
                      height: '100% !important',
                      fontFamily: 'Consolas, Monaco, monospace',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      padding: '12px',
                      color: '#2d3748',
                      backgroundColor: '#ffffff',
                      overflow: 'auto'
                    },
                    '& fieldset': {
                      border: 'none'
                    }
                  }
                }}
              />
            </Box>
          </Box>

          {/* Right Panel */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              minWidth: 0
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px 4px 0 0',
                borderBottom: '1px solid #e2e8f0'
              }}
            >
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600,
                  color: '#4a5568'
                }}
              >
                {t('jsonOnlineTranslator.translatedJson')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleCopy}
                  startIcon={<FileCopy />}
                  sx={{
                    backgroundColor: '#6366f1',
                    color: 'white',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#4f46e5'
                    }
                  }}
                >
                  {t('jsonOnlineTranslator.copy')}
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleDownload}
                  startIcon={<Download />}
                  sx={{
                    backgroundColor: '#6366f1',
                    color: 'white',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#4f46e5'
                    }
                  }}
                >
                  {t('jsonOnlineTranslator.download')}
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                backgroundColor: '#ffffff',
                overflow: 'hidden',
                minWidth: 0
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  overflow: 'auto',
                  '& pre': {
                    margin: 0,
                    minHeight: '100%'
                  }
                }}
              >
                <SyntaxHighlighter 
                  language="json" 
                  style={solarizedlight} 
                  showLineNumbers
                  customStyle={{
                    margin: 0,
                    height: '100%',
                    fontSize: '14px',
                    backgroundColor: '#ffffff'
                  }}
                >
                  {translatedJson || t('jsonOnlineTranslator.translatedContentWillAppearHere')}
                </SyntaxHighlighter>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Controls Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 3,
            padding: '8px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Popular Languages Section */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)',
              borderRadius: 2,
              padding: 2,
              border: '1px solid rgba(124, 58, 237, 0.1)',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            <Typography variant="h6" sx={{ mb: 0, fontWeight: 'bold', color: '#4b5563', mr: 2 }}>
              {t('jsonOnlineTranslator.popularLanguages')}
            </Typography>
            {popularLanguages.map(code => (
              <Chip
                key={code}
                label={getLanguageName(code)}
                onClick={() => {
                  if (!targetLanguage || targetLanguage.code !== code) {
                    setTargetLanguage(languages.find(lang => lang.code === code));
                  }
                }}
                sx={{
                  background: targetLanguage && targetLanguage.code === code
                    ? 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)'
                    : 'white',
                  color: targetLanguage && targetLanguage.code === code ? 'white' : '#4b5563',
                  '&:hover': {
                    background: targetLanguage && targetLanguage.code === code
                      ? 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)'
                      : 'rgba(124, 58, 237, 0.1)'
                  }
                }}
              />
            ))}
          </Box>

          {/* Select Target Language Section */}
          <Autocomplete
            options={languages}
            getOptionLabel={(option) => option.name}
            value={targetLanguage}
            onChange={(event, newValue) => {
              setTargetLanguage(newValue);
              setError(null);
            }}
            sx={{ 
              width: { xs: '100%', sm: 300 },
              '& .MuiOutlinedInput-root': {
                borderColor: '#e2e8f0',
                '&:hover': {
                  borderColor: '#cbd5e0'
                }
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('jsonOnlineTranslator.selectTargetLanguage')}
                sx={{
                  backgroundColor: 'white',
                  borderRadius: 1,
                }}
              />
            )}
          />

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              onClick={handleTranslate}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Translate />}
              sx={{ 
                background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
                padding: '12px 28px',
                fontSize: '1.1rem',
                color: 'white', 
                fontWeight: 'bold',
                '&:hover': {
                  background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
                  opacity: 0.9
                }
              }}
            >
              {loading ? t('jsonOnlineTranslator.translating') : t('jsonOnlineTranslator.translateNow')}
            </Button>

            <Button
              variant="outlined"
              onClick={handleReset}
              startIcon={<Refresh />}
              sx={{
                textTransform: 'none',
                borderColor: '#e2e8f0',
                color: '#4a5568',
                '&:hover': {
                  borderColor: '#cbd5e0',
                  backgroundColor: '#f8f9fa'
                }
              }}
            >
              {t('jsonOnlineTranslator.reset')}
            </Button>
          </Box>
        </Box>

        {/* Messages */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              marginBottom: 2,
              borderRadius: '8px'
            }}
          >
            {error}
          </Alert>
        )}
        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              marginBottom: 2,
              borderRadius: '8px'
            }}
          >
            {t('jsonOnlineTranslator.translationCompletedSuccessfully')}
          </Alert>
        )}
      </Box>
    </Box>
  );
} 