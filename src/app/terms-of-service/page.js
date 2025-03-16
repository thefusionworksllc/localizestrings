'use client';
import { Typography, Box, Container, Paper, Divider } from '@mui/material';
import { Gavel, Update, Person, Warning, Email } from '@mui/icons-material';
import styles from './page.module.css';

export default function TermsOfService() {
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
          <Gavel sx={{ fontSize: 36, color: '#7c3aed', mr: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
            Terms of Service
          </Typography>
        </Box>
        
        <Typography variant="body1" sx={{ mb: 3, color: '#6b7280' }}>
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4, color: '#4b5563' }}>
          These Terms of Service govern your use of our website and our services. By accessing or using our services, you agree to be bound by these Terms.
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Person sx={{ color: '#7c3aed', mr: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
              Acceptance of Terms
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 2, color: '#4b5563' }}>
            By using our services, you affirm that you are at least 13 years of age and are fully able and competent to enter into the terms, conditions, obligations, affirmations, representations, and warranties set forth in these Terms.
          </Typography>
        </Box>
        
        <Divider sx={{ my: 4, opacity: 0.6 }} />
        
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Update sx={{ color: '#7c3aed', mr: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
              Changes to Terms
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 2, color: '#4b5563' }}>
            We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on our website. You are advised to review these Terms periodically for any changes.
          </Typography>
        </Box>
        
        <Divider sx={{ my: 4, opacity: 0.6 }} />
        
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Person sx={{ color: '#7c3aed', mr: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
              User Responsibilities
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 2, color: '#4b5563' }}>
            You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to use our services:
          </Typography>
          <Box sx={{ 
            pl: 2, 
            borderLeft: '3px solid rgba(124, 58, 237, 0.5)',
            ml: 2,
            mb: 3
          }}>
            <Typography variant="body2" sx={{ mb: 2, color: '#4b5563' }}>
              • In any way that violates any applicable federal, state, local, or international law or regulation.
            </Typography>
            <Typography variant="body2" sx={{ color: '#4b5563' }}>
              • To exploit, harm, or attempt to exploit or harm minors in any way by exposing them to inappropriate content or otherwise.
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ my: 4, opacity: 0.6 }} />
        
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Warning sx={{ color: '#7c3aed', mr: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
              Limitation of Liability
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 2, color: '#4b5563' }}>
            In no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of, or inability to access or use, our services; (ii) any conduct or content of any third party on our services; (iii) any content obtained from our services; and (iv) unauthorized access, use, or alteration of your transmissions or content.
          </Typography>
        </Box>
        
        <Divider sx={{ my: 4, opacity: 0.6 }} />
        
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Email sx={{ color: '#7c3aed', mr: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
              Contact Us
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 2, color: '#4b5563' }}>
            If you have questions or comments about these Terms, please contact us at:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#7c3aed' }}>
            thefusionworksllc@gmail.com
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
