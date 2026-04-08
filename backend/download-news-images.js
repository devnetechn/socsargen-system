require('dotenv').config();
const pool = require('./src/config/database');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (response) => {
      // Follow redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`HTTP ${response.statusCode} for ${url}`));
      }
      const file = fs.createWriteStream(destPath);
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
      file.on('error', reject);
    }).on('error', reject);
  });
}

async function run() {
  const client = await pool.connect();
  try {
    // Get all news with external image/video URLs
    const result = await client.query(
      "SELECT id, slug, image_url, video_url FROM news WHERE image_url LIKE 'http%' OR video_url LIKE 'http%'"
    );

    console.log(`Found ${result.rows.length} articles with external URLs\n`);

    for (const row of result.rows) {
      // Download image
      if (row.image_url && row.image_url.startsWith('http')) {
        const ext = '.jpg';
        const filename = `news-${Date.now()}-${Math.floor(Math.random() * 1000000)}${ext}`;
        const destPath = path.join(uploadsDir, filename);
        const localUrl = `/uploads/${filename}`;

        try {
          process.stdout.write(`  Downloading image for "${row.slug}"... `);
          await downloadFile(row.image_url, destPath);
          await client.query('UPDATE news SET image_url = $1 WHERE id = $2', [localUrl, row.id]);
          console.log('OK');
        } catch (err) {
          console.log(`FAILED: ${err.message}`);
        }

        // Small delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 300));
      }

      // Download video
      if (row.video_url && row.video_url.startsWith('http')) {
        const ext = '.mp4';
        const filename = `news-${Date.now()}-${Math.floor(Math.random() * 1000000)}${ext}`;
        const destPath = path.join(uploadsDir, filename);
        const localUrl = `/uploads/${filename}`;

        try {
          process.stdout.write(`  Downloading video for "${row.slug}"... `);
          await downloadFile(row.video_url, destPath);
          await client.query('UPDATE news SET video_url = $1 WHERE id = $2', [localUrl, row.id]);
          console.log('OK');
        } catch (err) {
          console.log(`FAILED: ${err.message}`);
        }
      }
    }

    console.log('\nDone! All images/videos are now served locally.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
