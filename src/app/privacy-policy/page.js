'use client';
import { Typography, Box, Container, Paper, Divider } from '@mui/material';
import { Shield, Security, Person, Storage, Visibility } from '@mui/icons-material';
import styles from './page.module.css';

export default function PrivacyPolicy() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.05)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            transform: 'translateY(-4px)'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Shield sx={{ fontSize: 36, color: '#7c3aed', mr: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
            Privacy Policy
          </Typography>
        </Box>
        
        <Typography variant="body1" sx={{ mb: 3, color: '#6b7280' }}>
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4, color: '#4b5563' }}>
          Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Person sx={{ color: '#7c3aed', mr: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
              Information We Collect
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 2, color: '#4b5563' }}>
            We may collect information about you in a variety of ways, including:
          </Typography>
          <Box sx={{ 
            pl: 2, 
            borderLeft: '3px solid rgba(124, 58, 237, 0.5)',
            ml: 2,
            mb: 3
          }}>
            <Typography variant="body2" sx={{ mb: 2, color: '#4b5563' }}>
              <strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and telephone number, that you voluntarily give to us when you register with the site or when you choose to participate in various activities related to the site.
            </Typography>
            <Typography variant="body2" sx={{ color: '#4b5563' }}>
              <strong>Derivative Data:</strong> Information our servers automatically collect when you access the site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the site.
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ my: 4, opacity: 0.6 }} />
        
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Visibility sx={{ color: '#7c3aed', mr: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
              Use of Your Information
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 2, color: '#4b5563' }}>
            Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the site to:
          </Typography>
          <Box sx={{ 
            pl: 2, 
            borderLeft: '3px solid rgba(124, 58, 237, 0.5)',
            ml: 2,
            mb: 3
          }}>
            <Typography variant="body2" sx={{ mb: 1, color: '#4b5563' }}>• Create and manage your account.</Typography>
            <Typography variant="body2" sx={{ mb: 1, color: '#4b5563' }}>• Send you a confirmation email when you register.</Typography>
            <Typography variant="body2" sx={{ color: '#4b5563' }}>• Respond to customer service requests and support needs.</Typography>
          </Box>
        </Box>
        
        <Divider sx={{ my: 4, opacity: 0.6 }} />
        
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Storage sx={{ color: '#7c3aed', mr: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
              Disclosure of Your Information
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 2, color: '#4b5563' }}>
            We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
          </Typography>
          <Box sx={{ 
            pl: 2, 
            borderLeft: '3px solid rgba(124, 58, 237, 0.5)',
            ml: 2,
            mb: 3
          }}>
            <Typography variant="body2" sx={{ color: '#4b5563' }}>
              <strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ my: 4, opacity: 0.6 }} />
        
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Security sx={{ color: '#7c3aed', mr: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
              Security of Your Information
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 2, color: '#4b5563' }}>
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure, and we cannot guarantee its absolute security.
          </Typography>
        </Box>
        
        <Divider sx={{ my: 4, opacity: 0.6 }} />
        
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1a1a1a' }}>
            Contact Us
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: '#4b5563' }}>
            If you have questions or comments about this Privacy Policy, please contact us at:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#7c3aed' }}>
            thefusionworksllc@gmail.com
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
