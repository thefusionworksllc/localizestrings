'use client';

import React from 'react';
import Head from 'next/head';

export default function SchemaMarkup() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'LocalizeStrings',
    url: 'https://localizestrings.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://localizestrings.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LocalizeStrings',
    url: 'https://localizestrings.com',
    logo: 'https://localizestrings.com/logo.png',
    sameAs: [
      'https://twitter.com/localizestrings',
      'https://www.facebook.com/localizestrings',
      'https://www.linkedin.com/company/localizestrings'
    ]
  };

  const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'LocalizeStrings',
    applicationCategory: 'WebApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '125'
    }
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
    </Head>
  );
} 