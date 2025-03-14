'use client';

import { useState } from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FileCopy, CheckCircle, Refresh } from '@mui/icons-material';

export default function XliffValidator() {
  const [xliffContent, setXliffContent] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateXliff = () => {
    if (!xliffContent.trim()) {
      setError('Please enter XLIFF content.');
      setValidationResult(null);
      return;
    }

    // Basic structure validation
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xliffContent, 'application/xml');

    const xliffTag = xmlDoc.getElementsByTagName('xliff')[0];
    const fileTag = xmlDoc.getElementsByTagName('file')[0];
    const bodyTag = xmlDoc.getElementsByTagName('body')[0];
    const headerTag = xmlDoc.getElementsByTagName('header')[0];

    if (!xliffTag || !fileTag) {
      setValidationResult('XLIFF content is invalid: Missing <xliff> or <file> tag.');
      setError('');
      return;
    }
    if (!bodyTag || !headerTag) {
      setValidationResult('XLIFF content is invalid: Missing <body> or <header> tag.');
      setError('');
      return;
    }

    // Check required attributes
    const sourceLanguage = fileTag.getAttribute('source-language');
    const targetLanguage = fileTag.getAttribute('target-language');

    if (!sourceLanguage || !targetLanguage) {
      setValidationResult('XLIFF content is invalid: <file> tag must have source-language and target-language attributes.');
      setError('');
      return;
    }

    // If all checks pass
    setValidationResult('XLIFF content is valid!');
    setError('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(xliffContent)
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
    setXliffContent('');
    setValidationResult(null);
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
          XLIFF Validator
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
                Source XLIFF
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
                Reset
              </Button>
            </Box>
            <TextField
              multiline
              fullWidth
              rows={20}
              variant="outlined"
              placeholder="Paste your XLIFF content here..."
              value={xliffContent}
              onChange={(e) => setXliffContent(e.target.value)}
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
              onClick={validateXliff}
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
              Validate XLIFF
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
                Validation Result
              </Typography>
              
              {xliffContent && (
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
                  Copy
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
              {validationResult && (
                <Box sx={{ height: 'calc(100% - 16px)', margin: 1 }}>
                  <SyntaxHighlighter 
                    language="xml" 
                    style={solarizedlight}
                    customStyle={{
                      margin: 0,
                      height: '100%',
                      fontSize: '14px',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    {xliffContent}
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