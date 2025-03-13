'use client';
import { Typography, Box } from '@mui/material';
import styles from './page.module.css';

export default function TermsOfService() {
  return (
    <div className={styles.container}>
      <section className={styles.termsSection}>
        <Typography variant="h4" className={styles.sectionTitle}>
          Terms of Service
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Last updated: [Insert Date]
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          These Terms of Service govern your use of our website located at [Your Website URL] and our services. By accessing or using our services, you agree to be bound by these Terms.
        </Typography>
        <Typography variant="h6" sx={{ mt: 3 }}>
          Acceptance of Terms
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          By using our services, you affirm that you are at least 13 years of age and are fully able and competent to enter into the terms, conditions, obligations, affirmations, representations, and warranties set forth in these Terms.
        </Typography>
        <Typography variant="h6" sx={{ mt: 3 }}>
          Changes to Terms
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on our website. You are advised to review these Terms periodically for any changes.
        </Typography>
        <Typography variant="h6" sx={{ mt: 3 }}>
          User Responsibilities
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to use our services:
        </Typography>
        <ul>
          <li>
            <Typography variant="body2">In any way that violates any applicable federal, state, local, or international law or regulation.</Typography>
          </li>
          <li>
            <Typography variant="body2">To exploit, harm, or attempt to exploit or harm minors in any way by exposing them to inappropriate content or otherwise.</Typography>
          </li>
        </ul>
        <Typography variant="h6" sx={{ mt: 3 }}>
          Limitation of Liability
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          In no event shall [Your Company Name] be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of, or inability to access or use, our services; (ii) any conduct or content of any third party on our services; (iii) any content obtained from our services; and (iv) unauthorized access, use, or alteration of your transmissions or content.
        </Typography>
        <Typography variant="h6" sx={{ mt: 3 }}>
          Contact Us
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          If you have questions or comments about these Terms, please contact us at:
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          [Your Contact Information]
        </Typography>
      </section>
    </div>
  );
}
