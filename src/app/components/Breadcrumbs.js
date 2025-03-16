'use client';

import React from 'react';
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography, Box } from '@mui/material';
import { usePathname } from 'next/navigation';
import { Home } from '@mui/icons-material';
import NextLink from 'next/link';

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  // Skip rendering breadcrumbs on the home page
  if (pathname === '/') {
    return null;
  }
  
  // Generate breadcrumb items based on the current path
  const pathSegments = pathname.split('/').filter(segment => segment);
  const breadcrumbItems = [
    { label: 'Home', path: '/', icon: <Home fontSize="small" /> }
  ];
  
  // Build the breadcrumb items
  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const formattedLabel = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    breadcrumbItems.push({
      label: formattedLabel,
      path: currentPath,
      isLast: index === pathSegments.length - 1
    });
  });
  
  // Add structured data for breadcrumbs
  const breadcrumbsSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.label,
      'item': `https://localizestrings.com${item.path}`
    }))
  };
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <Box sx={{ 
        padding: '1rem 2rem', 
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
      }}>
        <MuiBreadcrumbs aria-label="breadcrumb">
          {breadcrumbItems.map((item, index) => {
            if (item.isLast) {
              return (
                <Typography 
                  key={index} 
                  color="text.primary" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    fontWeight: 600,
                    color: '#7c3aed'
                  }}
                >
                  {item.icon && <Box sx={{ mr: 0.5, display: 'flex' }}>{item.icon}</Box>}
                  {item.label}
                </Typography>
              );
            }
            
            return (
              <Link
                key={index}
                component={NextLink}
                href={item.path}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: '#6b7280',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                    color: '#7c3aed'
                  }
                }}
              >
                {item.icon && <Box sx={{ mr: 0.5, display: 'flex' }}>{item.icon}</Box>}
                {item.label}
              </Link>
            );
          })}
        </MuiBreadcrumbs>
      </Box>
    </>
  );
} 