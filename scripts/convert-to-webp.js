const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, '../public/images/FI5A7311.jpg');
const outputPath = path.join(__dirname, '../public/images/FI5A7311.webp');

async function convertToWebP() {
  try {
    const stats = await fs.promises.stat(inputPath);
    console.log(`Original file size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

    await sharp(inputPath)
      .webp({ quality: 85, effort: 6 })
      .toFile(outputPath);

    const outputStats = await fs.promises.stat(outputPath);
    console.log(`WebP file size: ${(outputStats.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Size reduction: ${((1 - outputStats.size / stats.size) * 100).toFixed(1)}%`);
    console.log(`✅ Converted to: ${outputPath}`);
  } catch (error) {
    console.error('Error converting image:', error);
    process.exit(1);
  }
}

convertToWebP();

