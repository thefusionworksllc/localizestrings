const fs = require('fs');
const path = require('path');

// Create a simple function that creates placeholder image files
function generatePlaceholderImages() {
  console.log('Creating placeholder OG images...');
  
  // Create directory if it doesn't exist
  const outputDir = path.join(__dirname, '../public');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Create empty placeholder files if they don't exist
  const ogImagePath = path.join(outputDir, 'og-image.jpg');
  const twitterImagePath = path.join(outputDir, 'twitter-image.jpg');
  
  if (!fs.existsSync(ogImagePath)) {
    // Write a simple text message to a file
    fs.writeFileSync(ogImagePath, 'Placeholder OG Image');
    console.log('Created placeholder og-image.jpg');
  }
  
  if (!fs.existsSync(twitterImagePath)) {
    fs.writeFileSync(twitterImagePath, 'Placeholder Twitter Image');
    console.log('Created placeholder twitter-image.jpg');
  }
  
  console.log('Placeholder OG images created successfully!');
}

// Run the function
generatePlaceholderImages(); 