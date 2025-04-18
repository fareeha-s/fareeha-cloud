import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function optimizeImages() {
  const inputPath = path.join(__dirname, 'public/background.jpg');
  const outputDir = path.join(__dirname, 'public/optimized');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  try {
    // 1. Create WebP version (best quality/size ratio)
    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(path.join(outputDir, 'background.webp'));
    console.log('✅ WebP version created');
    
    // 2. Create optimized JPG version
    await sharp(inputPath)
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(path.join(outputDir, 'background.jpg'));
    console.log('✅ Optimized JPG created');
    
    // 3. Create tiny placeholder for faster initial load
    await sharp(inputPath)
      .resize(20) // Tiny size
      .blur(5)    // Blur it for the nice effect
      .webp({ quality: 20 })
      .toFile(path.join(outputDir, 'background-placeholder.webp'));
    console.log('✅ Placeholder created');
    
    // Get file sizes for comparison
    const originalSize = fs.statSync(inputPath).size;
    const webpSize = fs.statSync(path.join(outputDir, 'background.webp')).size;
    const jpgSize = fs.statSync(path.join(outputDir, 'background.jpg')).size;
    const placeholderSize = fs.statSync(path.join(outputDir, 'background-placeholder.webp')).size;
    
    console.log('\nResults:');
    console.log(`Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`WebP: ${(webpSize / 1024 / 1024).toFixed(2)} MB (${((1 - webpSize / originalSize) * 100).toFixed(2)}% reduction)`);
    console.log(`Optimized JPG: ${(jpgSize / 1024 / 1024).toFixed(2)} MB (${((1 - jpgSize / originalSize) * 100).toFixed(2)}% reduction)`);
    console.log(`Placeholder: ${(placeholderSize / 1024).toFixed(2)} KB`);
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
}

optimizeImages(); 