const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const SITE_URL = 'https://localizestrings.com';
const PUBLIC_DIR = path.join(__dirname, '../public');
const APP_DIR = path.join(__dirname, '../src/app');
const OUTPUT_FILE = path.join(PUBLIC_DIR, 'sitemap.xml');

// Priority and change frequency settings
const PRIORITY_MAP = {
  '': 1.0, // Home page
  'xliff-online-translator': 0.9,
  'xliff-file-translator': 0.9,
  'xliff-validator': 0.8,
  'json-online-translator': 0.9,
  'json-file-translator': 0.9,
  'json-validator': 0.8,
  'about': 0.8,
  'features': 0.8,
  'testimonials': 0.7,
  'contact': 0.6,
  'support': 0.6,
  'privacy-policy': 0.4,
  'terms-of-service': 0.4,
};

const CHANGE_FREQ_MAP = {
  '': 'weekly', // Home page
  'xliff-online-translator': 'monthly',
  'xliff-file-translator': 'monthly',
  'xliff-validator': 'monthly',
  'json-online-translator': 'monthly',
  'json-file-translator': 'monthly',
  'json-validator': 'monthly',
  'about': 'monthly',
  'features': 'monthly',
  'testimonials': 'monthly',
  'contact': 'monthly',
  'support': 'monthly',
  'privacy-policy': 'yearly',
  'terms-of-service': 'yearly',
};

// Get current date in YYYY-MM-DD format
const getCurrentDate = () => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

// Find all page directories
function findPages() {
  // Get all directories with a page.js file
  const pageFiles = glob.sync('**/page.js', { cwd: APP_DIR });
  
  // Extract routes from file paths
  return pageFiles.map(file => {
    const dir = path.dirname(file);
    return dir === '.' ? '' : dir;
  });
}

// Generate sitemap XML
function generateSitemap() {
  const pages = findPages();
  const lastmod = getCurrentDate();
  
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Add each page to the sitemap
  pages.forEach(page => {
    const url = page === '' ? SITE_URL : `${SITE_URL}/${page}`;
    const priority = PRIORITY_MAP[page] || 0.5;
    const changefreq = CHANGE_FREQ_MAP[page] || 'monthly';
    
    sitemap += '  <url>\n';
    sitemap += `    <loc>${url}</loc>\n`;
    sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
    sitemap += `    <changefreq>${changefreq}</changefreq>\n`;
    sitemap += `    <priority>${priority}</priority>\n`;
    sitemap += '  </url>\n';
  });
  
  sitemap += '</urlset>';
  
  // Write sitemap to file
  fs.writeFileSync(OUTPUT_FILE, sitemap);
  console.log(`Sitemap generated at ${OUTPUT_FILE}`);
}

generateSitemap(); 