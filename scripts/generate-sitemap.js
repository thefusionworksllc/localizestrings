const fs = require('fs');
const path = require('path');

// Configuration
const SITE_URL = 'https://localizestrings.com';
const OUTPUT_FILE = path.join(__dirname, '../public/sitemap.xml');

// List of pages to include in the sitemap
const pages = [
  { path: '', priority: 1.0, changefreq: 'weekly' },
  { path: 'about', priority: 0.8, changefreq: 'monthly' },
  { path: 'features', priority: 0.8, changefreq: 'monthly' },
  { path: 'testimonials', priority: 0.7, changefreq: 'monthly' },
  { path: 'xliff-online-translator', priority: 0.9, changefreq: 'monthly' },
  { path: 'xliff-file-translator', priority: 0.9, changefreq: 'monthly' },
  { path: 'xliff-validator', priority: 0.8, changefreq: 'monthly' },
  { path: 'json-online-translator', priority: 0.9, changefreq: 'monthly' },
  { path: 'json-file-translator', priority: 0.9, changefreq: 'monthly' },
  { path: 'json-validator', priority: 0.8, changefreq: 'monthly' },
  { path: 'contact', priority: 0.6, changefreq: 'monthly' },
  { path: 'support', priority: 0.6, changefreq: 'monthly' },
  { path: 'privacy-policy', priority: 0.4, changefreq: 'yearly' },
  { path: 'terms-of-service', priority: 0.4, changefreq: 'yearly' }
];

// Get current date in YYYY-MM-DD format
const getCurrentDate = () => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

// Generate sitemap XML
function generateSitemap() {
  const lastmod = getCurrentDate();
  
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Add each page to the sitemap
  pages.forEach(page => {
    const url = page.path === '' ? SITE_URL : `${SITE_URL}/${page.path}`;
    
    sitemap += '  <url>\n';
    sitemap += `    <loc>${url}</loc>\n`;
    sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
    sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
    sitemap += `    <priority>${page.priority}</priority>\n`;
    sitemap += '  </url>\n';
  });
  
  sitemap += '</urlset>';
  
  // Create directory if it doesn't exist
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write sitemap to file
  fs.writeFileSync(OUTPUT_FILE, sitemap);
  console.log(`Sitemap generated at ${OUTPUT_FILE}`);
}

generateSitemap(); 