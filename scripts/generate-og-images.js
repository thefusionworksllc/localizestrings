const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage, registerFont } = require('canvas');

// Register fonts
registerFont(path.join(__dirname, '../public/fonts/Inter-Bold.ttf'), { family: 'Inter', weight: 'bold' });
registerFont(path.join(__dirname, '../public/fonts/Inter-Regular.ttf'), { family: 'Inter', weight: 'normal' });

async function generateOGImage() {
  // Create canvas
  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');

  // Draw gradient background
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#7c3aed');
  gradient.addColorStop(1, '#6366f1');
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  // Load logo
  const logo = await loadImage(path.join(__dirname, '../public/logo.png'));
  const logoWidth = 200;
  const logoHeight = (logo.height / logo.width) * logoWidth;
  context.drawImage(logo, 100, 100, logoWidth, logoHeight);

  // Add title
  context.font = 'bold 60px Inter';
  context.fillStyle = '#ffffff';
  context.fillText('LocalizeStrings', 100, 350);

  // Add tagline
  context.font = '40px Inter';
  context.fillStyle = '#ffffff';
  context.fillText('Professional XLIFF & JSON Translation Tool', 100, 420);

  // Add features
  context.font = '30px Inter';
  context.fillStyle = '#f3f4f6';
  context.fillText('✓ 100+ Languages', 100, 500);
  context.fillText('✓ Real-time Collaboration', 400, 500);
  context.fillText('✓ Secure & Reliable', 750, 500);

  // Save the image
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(path.join(__dirname, '../public/og-image.jpg'), buffer);
  fs.writeFileSync(path.join(__dirname, '../public/twitter-image.jpg'), buffer);

  console.log('OG images generated successfully!');
}

generateOGImage().catch(console.error); 