'use client';

import React from 'react';
import Head from 'next/head';

export default function PageMetadata({ 
  title, 
  description, 
  keywords, 
  canonicalPath = '',
  ogImage = '/og-image.jpg',
  ogType = 'website'
}) {
  const fullTitle = `${title} | LocalizeStrings`;
  const fullCanonical = `https://localizestrings.com${canonicalPath}`;
  const fullOgImage = `https://localizestrings.com${ogImage}`;
  
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullCanonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullCanonical} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullOgImage} />
    </Head>
  );
} 