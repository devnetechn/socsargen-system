require('dotenv').config();
const pool = require('./src/config/database');
const https = require('https');
const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'uploads');

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) return reject(new Error(`HTTP ${response.statusCode}`));
      const file = fs.createWriteStream(destPath);
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', reject);
  });
}

async function run() {
  const client = await pool.connect();
  try {
    const filename = `news-${Date.now()}-${Math.floor(Math.random() * 1000000)}.jpg`;
    const destPath = path.join(uploadsDir, filename);
    const url = 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=1200&h=800&fit=crop';

    console.log('Downloading pediatric wing image...');
    await downloadFile(url, destPath);

    await client.query(
      "UPDATE news SET image_url = $1 WHERE slug = 'new-pediatric-wing-now-open'",
      [`/uploads/${filename}`]
    );
    console.log('Done! Updated new-pediatric-wing-now-open with image.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
