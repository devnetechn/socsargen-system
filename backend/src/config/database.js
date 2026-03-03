const { Pool } = require('pg');

// Determine SSL config based on environment and connection type
const getSSLConfig = () => {
  if (process.env.NODE_ENV !== 'production') return false;
  // Supabase and other cloud PostgreSQL providers require SSL
  return { rejectUnauthorized: false };
};

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: getSSLConfig(),
  // Force IPv4 - Render free tier doesn't support IPv6
  connectionTimeoutMillis: 10000,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
  process.exit(-1);
});

module.exports = pool;
