#!/usr/bin/env node

/**
 * Generate PWA icons from SVG
 * This is a simple script to create placeholder icons for development
 * In production, you would use proper image processing tools
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, 'public', 'icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create a simple SVG template for each size
const createIcon = (size) => {
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background Circle -->
  <circle cx="256" cy="256" r="256" fill="#16a34a"/>
  
  <!-- Inner Circle -->
  <circle cx="256" cy="256" r="200" fill="#15803d" opacity="0.3"/>
  
  <!-- Quran Book Icon -->
  <g transform="translate(156, 156)">
    <!-- Book Pages -->
    <rect x="20" y="20" width="160" height="180" rx="8" fill="#ffffff" opacity="0.95"/>
    <rect x="15" y="15" width="160" height="180" rx="8" fill="#f3f4f6" opacity="0.8"/>
    <rect x="10" y="10" width="160" height="180" rx="8" fill="#e5e7eb"/>
    
    <!-- Book Spine -->
    <rect x="0" y="10" width="25" height="180" rx="8" fill="#065f46"/>
    
    <!-- Arabic Text Lines -->
    <g fill="#374151" opacity="0.8">
      <rect x="35" y="40" width="120" height="3" rx="1.5"/>
      <rect x="35" y="55" width="100" height="3" rx="1.5"/>
      <rect x="35" y="70" width="110" height="3" rx="1.5"/>
      <rect x="35" y="85" width="95" height="3" rx="1.5"/>
      
      <rect x="35" y="110" width="115" height="3" rx="1.5"/>
      <rect x="35" y="125" width="105" height="3" rx="1.5"/>
      <rect x="35" y="140" width="90" height="3" rx="1.5"/>
      
      <rect x="35" y="165" width="100" height="3" rx="1.5"/>
    </g>
    
    <!-- Decorative Islamic Pattern -->
    <g fill="#16a34a" opacity="0.6">
      <circle cx="150" cy="45" r="8"/>
      <circle cx="140" cy="35" r="4"/>
      <circle cx="160" cy="35" r="4"/>
      <circle cx="150" cy="25" r="6"/>
    </g>
  </g>
  
  <!-- Bottom Text (scaled based on size) -->
  <text x="256" y="420" font-family="Arial, sans-serif" font-size="${Math.max(16, size / 18)}" font-weight="bold" fill="white" text-anchor="middle">
    QURAN
  </text>
  <text x="256" y="450" font-family="Arial, sans-serif" font-size="${Math.max(12, size / 28)}" fill="white" text-anchor="middle" opacity="0.9">
    Word by Word
  </text>
</svg>`;

  return svg;
};

// Generate icons
sizes.forEach(size => {
  const svg = createIcon(size);
  const filename = path.join(iconsDir, `icon-${size}x${size}.png`);
  
  // For development, we'll create SVG files instead of PNG
  // In production, you would convert these to PNG using a proper image library
  const svgFilename = path.join(iconsDir, `icon-${size}x${size}.svg`);
  fs.writeFileSync(svgFilename, svg);
  
  console.log(`Generated icon: ${svgFilename}`);
});

// Also create the main icon files
const mainIcon = createIcon(512);
fs.writeFileSync(path.join(__dirname, 'public', 'apple-touch-icon.png'), '<!-- Apple touch icon placeholder -->');
fs.writeFileSync(path.join(__dirname, 'public', 'safari-pinned-tab.svg'), mainIcon);

console.log('\n✅ PWA icons generated successfully!');
console.log('\n📝 Note: For production, convert SVG icons to PNG format using proper image processing tools.');
console.log('   You can use tools like sharp, imagemagick, or online converters.');

// Create a simple PNG placeholder using data URI
const createPngPlaceholder = (size) => {
  // This is a simple base64 encoded PNG placeholder
  // In a real project, you'd use proper image processing
  return `data:image/svg+xml;base64,${Buffer.from(createIcon(size)).toString('base64')}`;
};

// Create a manifest for the generated icons
const iconManifest = {
  generated: new Date().toISOString(),
  sizes: sizes,
  note: "Icons generated from SVG template. Convert to PNG for production."
};

fs.writeFileSync(
  path.join(iconsDir, 'manifest.json'), 
  JSON.stringify(iconManifest, null, 2)
);

console.log('\n📋 Icon manifest created at public/icons/manifest.json');