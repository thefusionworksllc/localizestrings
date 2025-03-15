'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Button, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  Typography
} from '@mui/material';
import { Language as LanguageIcon, ArrowDropDown } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' }
];

const LanguageSwitcher = () => {
  const router = useRouter();
  const { i18n, t } = useTranslation('common');
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    // Get the current language from localStorage or use the default
    const savedLanguage = localStorage.getItem('i18nextLng') || 'en';
    setCurrentLanguage(savedLanguage);
    i18n.changeLanguage(savedLanguage);
  }, [i18n]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
    handleClose();
    
    // Refresh the page to apply the language change
    window.location.reload();
  };

  const getCurrentLanguageInfo = () => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0];
  };

  return (
    <>
      <Button
        color="inherit"
        onClick={handleClick}
        startIcon={<LanguageIcon />}
        endIcon={<ArrowDropDown />}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        sx={{
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
          textTransform: 'none',
          ml: 2
        }}
      >
        <Typography variant="body1" sx={{ display: { xs: 'none', sm: 'block' } }}>
          {t('language')}
        </Typography>
        <Typography variant="body1" sx={{ ml: 1, fontSize: '1.2rem' }}>
          {getCurrentLanguageInfo().flag}
        </Typography>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{ mt: '2px' }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            selected={currentLanguage === lang.code}
            sx={{ 
              '&:hover': { 
                background: 'linear-gradient(135deg, rgba(80, 74, 194, 0.9), rgba(147, 51, 234, 0.90))', 
                color: 'white' 
              },
              backgroundColor: currentLanguage === lang.code ? 'rgba(80, 74, 194, 0.2)' : 'transparent'
            }}
          >
            <ListItemIcon sx={{ minWidth: '30px' }}>
              <Typography variant="body1">{lang.flag}</Typography>
            </ListItemIcon>
            <ListItemText primary={lang.name} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSwitcher; 