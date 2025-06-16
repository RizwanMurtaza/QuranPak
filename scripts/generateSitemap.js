// Script to generate a complete sitemap with all 114 Surahs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = 'https://quranpak.sunnahlife.com';
const lastmod = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format

const generateSitemap = () => {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 
                           http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- All Surahs Page -->
  <url>
    <loc>${baseUrl}/surahs</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

`;

  // Add all 114 Surah pages
  for (let i = 1; i <= 114; i++) {
    sitemap += `  <!-- Surah ${i} -->
  <url>
    <loc>${baseUrl}/surah/${i}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  }

  // Add utility pages
  sitemap += `
  <!-- Search Page -->
  <url>
    <loc>${baseUrl}/search</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Bookmarks Page -->
  <url>
    <loc>${baseUrl}/bookmarks</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <!-- Settings Page -->
  <url>
    <loc>${baseUrl}/settings</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

</urlset>`;

  return sitemap;
};

// Generate and save the sitemap
const sitemapContent = generateSitemap();
const publicDir = path.join(__dirname, '..', 'public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');

fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
console.log('✅ Sitemap generated successfully at:', sitemapPath);
console.log(`📊 Generated ${114 + 5} URLs total (114 Surahs + 5 main pages)`);

export { generateSitemap };