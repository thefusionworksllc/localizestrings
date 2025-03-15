'use client';

import { useState } from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FileCopy, CheckCircle, Refresh } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import '../i18n'; // Import the i18n configuration

export default function JsonValidator() {
  const { t } = useTranslation('common');
  const [jsonContent, setJsonContent] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formattedJson, setFormattedJson] = useState('');

  const validateJson = () => {
    if (!jsonContent.trim()) {
      setError('Please enter JSON content.');
      setValidationResult(null);
      setFormattedJson('');
      return;
    }

    try {
      // Parse the JSON to validate it
      const parsedJson = JSON.parse(jsonContent);
      
      // Format the JSON with proper indentation
      const formatted = JSON.stringify(parsedJson, null, 2);
      
      setFormattedJson(formatted);
      setValidationResult('JSON content is valid!');
      setError('');
    } catch (e) {
      setValidationResult(`JSON content is invalid: ${e.message}`);
      setFormattedJson('');
      setError('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedJson || jsonContent)
      .then(() => {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        setError('Failed to copy content.');
      });
  };

  const handleReset = () => {
    setJsonContent('');
    setValidationResult(null);
    setFormattedJson('');
    setError('');
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
          {t('jsonValidator.title')}
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
                {t('jsonValidator.sourceJson')}
              </Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={handleReset}
                startIcon={<Refresh />}
                sx={{
                  color: '#4a5568',
                  borderColor: '#e2e8f0',
                  '&:hover': {
                    borderColor: '#cbd5e0',
                    backgroundColor: '#f8f9fa'
                  }
                }}
              >
                {t('jsonValidator.reset')}
              </Button>
            </Box>
            <TextField
              multiline
              fullWidth
              rows={20}
              variant="outlined"
              placeholder={t('jsonValidator.pasteJsonContentHere')}
              value={jsonContent}
              onChange={(e) => setJsonContent(e.target.value)}
              sx={{
                flexGrow: 1,
                overflow: 'auto',
                '& .MuiOutlinedInput-root': {
                  height: '100%',
                  '& textarea': {
                    height: '100% !important',
                    fontFamily: 'Consolas, Monaco, monospace',
                    fontSize: '14px',
                  }
                }
              }}
            />
            <Button
              variant="contained"
              onClick={validateJson}
              startIcon={<CheckCircle />}
              sx={{
                mt: 2,
                background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #6d28d9 0%, #4f46e5 100%)',
                }
              }}
            >
              {t('jsonValidator.validateJson')}
            </Button>
          </Box>

          {/* Right Panel */}
          {validationResult && (
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
                {t('jsonValidator.validationResult')}
              </Typography>
              
              {jsonContent && (
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
                  {t('jsonValidator.copy')}
                </Button>
              )}
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                overflow: 'auto',
                backgroundColor: '#ffffff',
                borderRadius: '0 0 4px 4px',
                position: 'relative'
              }}
            >
              {error && (
                <Alert severity="error" sx={{ margin: 2 }}>
                  {error}
                </Alert>
              )}
              {validationResult && (
                <Alert 
                  severity={validationResult.includes('invalid') ? 'error' : 'success'}
                  sx={{ margin: 2 }}
                >
                  {validationResult}
                </Alert>
              )}
              {formattedJson && (
                <Box sx={{ height: 'calc(100% - 16px)', margin: 1 }}>
                  <SyntaxHighlighter 
                    language="json" 
                    style={solarizedlight}
                    customStyle={{
                      margin: 0,
                      height: '100%',
                      fontSize: '14px',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    {formattedJson}
                  </SyntaxHighlighter>
                </Box>
              )}
            </Box>
          </Box>)}
        </Box>
      </Box>
    </Box>
  );
} 