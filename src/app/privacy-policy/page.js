'use client';
import { Typography, Box } from '@mui/material';
import styles from './page.module.css';

export default function PrivacyPolicy() {
  return (
    <div className={styles.container}>
      <section className={styles.privacySection}>
        <Typography variant="h4" className={styles.sectionTitle}>
          Privacy Policy
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Last updated: [Insert Date]
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, [Your Website URL], and use our services.
        </Typography>
        <Typography variant="h6" sx={{ mt: 3 }}>
          Information We Collect
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          We may collect information about you in a variety of ways, including:
        </Typography>
        <ul>
          <li>
            <Typography variant="body2">Personal Data: Personally identifiable information, such as your name, email address, and telephone number, that you voluntarily give to us when you register with the site or when you choose to participate in various activities related to the site.</Typography>
          </li>
          <li>
            <Typography variant="body2">Derivative Data: Information our servers automatically collect when you access the site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the site.</Typography>
          </li>
        </ul>
        <Typography variant="h6" sx={{ mt: 3 }}>
          Use of Your Information
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the site to:
        </Typography>
        <ul>
          <li>
            <Typography variant="body2">Create and manage your account.</Typography>
          </li>
          <li>
            <Typography variant="body2">Send you a confirmation email when you register.</Typography>
          </li>
          <li>
            <Typography variant="body2">Respond to customer service requests and support needs.</Typography>
          </li>
        </ul>
        <Typography variant="h6" sx={{ mt: 3 }}>
          Disclosure of Your Information
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
        </Typography>
        <ul>
          <li>
            <Typography variant="body2">By Law or to Protect Rights: If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</Typography>
          </li>
        </ul>
        <Typography variant="h6" sx={{ mt: 3 }}>
          Security of Your Information
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure, and we cannot guarantee its absolute security.
        </Typography>
        <Typography variant="h6" sx={{ mt: 3 }}>
          Policy for Children
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          We do not knowingly solicit information from or market to children under the age of 13. If we learn that we have collected personal information from a child under age 13 without verification of parental consent, we will delete that information as quickly as possible.
        </Typography>
        <Typography variant="h6" sx={{ mt: 3 }}>
          Contact Us
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          If you have questions or comments about this Privacy Policy, please contact us at:
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          [Your Contact Information]
        </Typography>
      </section>
    </div>
  );
}
