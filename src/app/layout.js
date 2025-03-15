'use client';

import { useState, useEffect } from 'react';
import supabase from '../../src/app/supabaseClient';
import { useRouter } from 'next/navigation';
import { Inter } from 'next/font/google';
import { ThemeProvider } from './contexts/ThemeContext';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, AppBar, Toolbar, Typography, Button, Avatar, Drawer, List, ListItem, ListItemText, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import './globals.css';
import Link from 'next/link';
import { 
  Home, 
  Info, 
  ContactMail, 
  Edit, 
  Settings as SettingsIcon,
  ExitToApp,
  Login as LoginIcon,
  DashboardOutlined as Dashboard,
  PersonAdd as PersonAddIcon,
  Home as HomeIcon,
  Translate as TranslateIcon,
  CheckCircleOutlineOutlined as CheckCircle,
  Star as StarIcon,
  ArrowDropDown,
  ArrowDropUp
} from '@mui/icons-material';
import Head from 'next/head';
import PublicIcon from '@mui/icons-material/Public';
import LanguageSwitcher from './components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import './i18n'; // Import the i18n configuration

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jsonMenuAnchorEl, setJsonMenuAnchorEl] = useState(null);
  const [xliffMenuAnchorEl, setXliffMenuAnchorEl] = useState(null);
  const { t } = useTranslation('common');

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    setMounted(true);

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  const handleNavigation = (path) => {
    router.push(path);
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleJsonMenuClick = (event) => {
    setJsonMenuAnchorEl(event.currentTarget);
  };

  const handleXliffMenuClick = (event) => {
    setXliffMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setJsonMenuAnchorEl(null);
    setXliffMenuAnchorEl(null);
  };

  const renderContent = () => {
    if (!mounted) {
      return null;
    }

    return (
      <>
        <Head>
          <title>Localize Strings</title>
        </Head>
        <AppBar 
          position="fixed"
          sx={{ 
            background: 'linear-gradient(90deg, #4f46e5, #9333ea)',
            boxShadow: 'none',
            zIndex: 1201,            
          }}
        >
          <Toolbar >
            <IconButton color="inherit" onClick={toggleSidebar} edge="start" sx={{ '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              transform: 'scale(1.20)',
              transition: 'transform 0.3s',
            }}}>
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', ml: '10px' }}>
              <img 
                src="/logo.png" 
                alt="Logo" 
                style={{ 
                  height: '50px',
                  marginRight: '10px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  transition: 'transform 0.3s',
                }} 
                onClick={() => handleNavigation('/')} 
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
              <Typography 
                variant="h6" 
                component="div" 
                hidden={true}
                sx={{ 
                  flexGrow: 1, 
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.9 }
                }}
                onClick={() => handleNavigation('/')}
              >
                Localize Strings
              </Typography>
            </Box>
            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', display: { xs: 'none', md: 'flex' } }}>
              <Button 
                color="inherit" 
                onClick={() => handleNavigation('/')}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                startIcon={<HomeIcon />}
                sx={{ 
                    mr: '10px', 
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    textTransform: 'none'
                }}  
              >
                {t('home')}
              </Button>
              <Button 
                color="inherit" 
                onClick={handleXliffMenuClick}
                startIcon={<ArrowDropDown />}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                sx={{
                    borderRadius: '4px',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    textTransform: 'none'
                }}
              >
                {t('xliffMenu')}
              </Button>
              <Menu
                anchorEl={xliffMenuAnchorEl}
                open={Boolean(xliffMenuAnchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                sx={{ mt: '2px', }}
              >
                  <MenuItem 
                  onClick={() => { handleNavigation('/xliff-online-translator'); handleMenuClose(); }}
                  sx={{ '&:hover': { background: 'linear-gradient(135deg, rgba(80, 74, 194, 0.9), rgba(147, 51, 234, 0.90))', color: 'white' } }}
                >
                  <TranslateIcon sx={{ mr: 1 }} />
                  {t('xliffOnlineTranslator.title')}
                </MenuItem>
                <MenuItem 
                  onClick={() => { handleNavigation('/xliff-file-translator'); handleMenuClose(); }}
                  sx={{ '&:hover': { background: 'linear-gradient(135deg, rgba(80, 74, 194, 0.9), rgba(147, 51, 234, 0.90))', color: 'white' } }}
                >
                  <Dashboard sx={{ mr: 1 }} />
                  {t('xliffFileTranslator.title')}
                </MenuItem>
              
                <MenuItem 
                  onClick={() => { handleNavigation('/xliff-validator'); handleMenuClose(); }}
                  sx={{ '&:hover': { background: 'linear-gradient(135deg, rgba(80, 74, 194, 0.9), rgba(147, 51, 234, 0.90))', color: 'white' } }}
                >
                  <CheckCircle sx={{ mr: 1 }} />
                  {t('xliffValidator.title')}
                </MenuItem>
              </Menu>
              
              {/* JSON Menu */}
              <Button 
                color="inherit" 
                onClick={handleJsonMenuClick}
                startIcon={<ArrowDropDown />}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                sx={{
                    borderRadius: '4px',
                    ml: '10px',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    textTransform: 'none'
                }}
              >
                {t('jsonMenu')}
              </Button>
              <Menu
                anchorEl={jsonMenuAnchorEl}
                open={Boolean(jsonMenuAnchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                sx={{ mt: '2px', }}
              >
                <MenuItem 
                  onClick={() => { handleNavigation('/json-online-translator'); handleMenuClose(); }}
                  sx={{ '&:hover': { background: 'linear-gradient(135deg, rgba(80, 74, 194, 0.9), rgba(147, 51, 234, 0.90))', color: 'white' } }}
                >
                  <TranslateIcon sx={{ mr: 1 }} />
                  {t('jsonOnlineTranslator.title')}
                </MenuItem>
                <MenuItem 
                  onClick={() => { handleNavigation('/json-validator'); handleMenuClose(); }}
                  sx={{ '&:hover': { background: 'linear-gradient(135deg, rgba(80, 74, 194, 0.9), rgba(147, 51, 234, 0.90))', color: 'white' } }}
                >
                  <CheckCircle sx={{ mr: 1 }} />
                  {t('jsonValidator.title')}
                </MenuItem>
              </Menu>
              
              <Button 
                color="inherit" 
                onClick={() => handleNavigation('/about')}
                startIcon={<Info />}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                sx={{ 
                    ml: '10px', 
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    textTransform: 'none'
                }}  
               
              >
                {t('aboutUs')}
              </Button>
              
              <LanguageSwitcher />
                       
              {user ? (
                <>
                  <Avatar sx={{ bgcolor: '#6d28d9' }}>
                    {user.email[0].toUpperCase()}
                  </Avatar>
                  <Typography variant="body1" sx={{ mx: 2, color: 'white' }}>
                    {user.email}
                  </Typography>
                  <Button 
                    onClick={handleLogout}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    sx={{
                      color: 'white',
                      textTransform: 'none',
                      ml: '10px',
                      fontSize: '1rem',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      }
                    }}
                  >
                    <ExitToApp sx={{ mr: 1 }} />
                    {t('logout')}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    color="inherit"
                    onClick={() => handleNavigation('/login')}
                    startIcon={<LoginIcon />}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    sx={{ ml: '10px', textTransform: 'none', '&:hover': { 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      textTransform: 'none'
                      
                    }}}
                  >
                    {t('login')}
                  </Button>
                  <Button
                    color="inherit"
                    onClick={() => handleNavigation('/signup')}
                    startIcon={<PersonAddIcon />}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    sx={{ ml: '10px', textTransform: 'none', '&:hover': { 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      textTransform: 'none'
                    }}}
                  >
                    {t('signup')}
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        <Drawer 
          anchor="left" 
          open={sidebarOpen} 
          onClose={toggleSidebar}
          PaperProps={{
            sx: {
              width: 310,
              background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.90), rgba(147, 51, 234, 0.90))',
              borderRadius: '0 16px 16px 0',
              padding: '24px 16px',
            }
          }}
        >
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              marginBottom: '20px'
            }}
          >
            <Box sx={{ mb: 4, px: 2, display: 'flex', alignItems: 'center',borderBottom: '1px solid rgba(255, 255, 255, 0.3)' }}>
              <PublicIcon sx={{ mr: 1, color: '#ffffff' }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  color: '#ffffff',
                  letterSpacing: '-0.5px'
                  
                }}
              >
                Localize Strings
              </Typography>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  px: 2, 
                  mb: 1, 
                  color: '#ffffff',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                Main Menu
              </Typography>
              <List sx={{ px: 1 }}>
              <ListItem 
                  onClick={() => handleNavigation('/')}
                  sx={{
                    borderRadius: '8px',
                    mb: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  <Home sx={{ mr: 2, color: '#ffffff' }} />
                  <ListItemText 
                    primary={t('home')}
                    primaryTypographyProps={{
                      sx: { fontWeight: 500, color: '#ffffff' }
                    }}
                  />
                </ListItem>
                <ListItem 
                  onClick={() => handleNavigation('/xliff-online-translator')}
                  sx={{
                    borderRadius: '8px',
                    mb: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  <TranslateIcon sx={{ mr: 2, color: '#ffffff' }} />
                  <ListItemText 
                    primary={t('xliffOnlineTranslator.title')}
                    primaryTypographyProps={{
                      sx: { fontWeight: 500, color: '#ffffff' }
                    }}
                  />
                </ListItem>
                <ListItem 
                  onClick={() => handleNavigation('/xliff-file-translator')}
                  sx={{
                    borderRadius: '8px',
                    mb: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  <Dashboard sx={{ mr: 2, color: '#ffffff' }} />
                  <ListItemText 
                    primary={t('xliffFileTranslator.title')}
                    primaryTypographyProps={{
                      sx: { fontWeight: 500, color: '#ffffff' }
                    }}
                  />
                </ListItem>
                <ListItem 
                  onClick={() => handleNavigation('/xliff-validator')}
                  sx={{
                    borderRadius: '8px',
                    mb: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  <CheckCircle sx={{ mr: 2, color: '#ffffff' }} />
                  <ListItemText 
                    primary={t('xliffValidator.title')}
                    primaryTypographyProps={{
                      sx: { fontWeight: 500, color: '#ffffff' }
                    }}
                  />
                </ListItem>
                
                {/* JSON Menu Items in Sidebar */}
                <ListItem 
                  onClick={() => handleNavigation('/json-online-translator')}
                  sx={{
                    borderRadius: '8px',
                    mb: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  <TranslateIcon sx={{ mr: 2, color: '#ffffff' }} />
                  <ListItemText 
                    primary={t('jsonOnlineTranslator.title')}
                    primaryTypographyProps={{
                      sx: { fontWeight: 500, color: '#ffffff' }
                    }}
                  />
                </ListItem>
                <ListItem 
                  onClick={() => handleNavigation('/json-validator')}
                  sx={{
                    borderRadius: '8px',
                    mb: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  <CheckCircle sx={{ mr: 2, color: '#ffffff' }} />
                  <ListItemText 
                    primary={t('jsonValidator.title')}
                    primaryTypographyProps={{
                      sx: { fontWeight: 500, color: '#ffffff' }
                    }}
                  />
                </ListItem>
              </List>

              <Typography 
                variant="subtitle2" 
                sx={{ 
                  px: 2, 
                  mb: 1, 
                  mt: 2,
                  color: '#ffffff',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}
              >
                {t('support')}
              </Typography>
              <List sx={{ px: 1 }}>
                <ListItem 
                  onClick={() => handleNavigation('/about')}
                  sx={{
                    borderRadius: '8px',
                    mb: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  <Info sx={{ mr: 2, color: '#ffffff' }} />
                  <ListItemText 
                    primary={t('aboutUs')}
                    primaryTypographyProps={{
                      sx: { fontWeight: 500, color: '#ffffff' }
                    }}
                  />
                </ListItem>
                <ListItem 
                  onClick={() => handleNavigation('/contact')}
                  sx={{
                    borderRadius: '8px',
                    mb: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  <ContactMail sx={{ mr: 2, color: '#ffffff' }} />
                  <ListItemText 
                    primary={t('contactUs')}
                    primaryTypographyProps={{
                      sx: { fontWeight: 500, color: '#ffffff' }
                    }}
                  />
                </ListItem>
                <ListItem 
                  onClick={() => handleNavigation('/testimonials')}
                  sx={{
                    borderRadius: '8px',
                    mb: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  <StarIcon sx={{ mr: 2, color: '#ffffff' }} />
                  <ListItemText 
                    primary={t('testimonials')}
                    primaryTypographyProps={{
                      sx: { fontWeight: 500, color: '#ffffff' }
                    }}
                  />
                </ListItem>
              </List>
            </Box>

            {/* Language Switcher Section in Sidebar */}
            <Box sx={{ mt: 2, px: 2 }}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  mb: 1, 
                  color: '#ffffff',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}
              >
                {t('language')}
              </Typography>
              <Box sx={{ px: 1 , color: '#ffffff'}}>
                <LanguageSwitcher />
              </Box>
            </Box>

            <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              {user ? (
                <>
                  <ListItem 
                    onClick={() => handleNavigation('/settings')}
                    sx={{
                      borderRadius: '8px',
                      mb: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      }
                    }}
                  >
                    <SettingsIcon sx={{ mr: 2, color: '#ffffff' }} />
                    <ListItemText 
                      primary="Settings"
                      primaryTypographyProps={{
                        sx: { fontWeight: 500, color: '#ffffff' }
                      }}
                    />
                  </ListItem>
                  <ListItem 
                    onClick={handleLogout}
                    sx={{
                      borderRadius: '8px',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      }
                    }}
                  >
                    <ExitToApp sx={{ mr: 2, color: '#ffffff' }} />
                    <ListItemText 
                      primary={t('logout')}
                      primaryTypographyProps={{
                        sx: { fontWeight: 500, color: '#ffffff' }
                      }}
                    />
                  </ListItem>
                </>
              ) : (
                <>
                <ListItem 
                  onClick={() => handleNavigation('/login')}
                  sx={{
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  <LoginIcon sx={{ mr: 2, color: '#ffffff' }} />
                  <ListItemText 
                    primary={t('login')}
                    primaryTypographyProps={{
                      sx: { fontWeight: 500, color: '#ffffff' }
                    }}
                  />
                </ListItem>
                 <ListItem 
                 onClick={() => handleNavigation('/signup')}
                 sx={{
                   borderRadius: '8px',
                   '&:hover': {
                     backgroundColor: 'rgba(255, 255, 255, 0.1)',
                   }
                 }}
               >
                 <PersonAddIcon sx={{ mr: 2, color: '#ffffff' }} />
                 <ListItemText 
                   primary={t('signup')}
                   primaryTypographyProps={{
                     sx: { fontWeight: 500, color: '#ffffff' }
                   }}
                 />
               </ListItem>

               </>
              )}
            </Box>
          </Box>
        </Drawer>

        <Box sx={{ mt: '64px' }}>
          {children}
        </Box>
      </>
    );
  };

  return (
    <html lang="en">
      <head>
        <title>LocalizeStrings</title>
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <CssBaseline />
          {renderContent()}
        </ThemeProvider>
      </body>
    </html>
  );
}
