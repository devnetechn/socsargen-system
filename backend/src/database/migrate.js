/**
 * Database Migration Script
 * Runs automatically on server startup to ensure all tables exist.
 * Safe to run multiple times (uses IF NOT EXISTS / ON CONFLICT).
 */
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const migrate = async () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.log('[Migration] No DATABASE_URL set, skipping migration.');
    return;
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('[Migration] Running database migration...');
    const sqlFile = path.join(__dirname, 'render_full_setup.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    await pool.query(sql);
    console.log('[Migration] Database migration completed successfully!');
  } catch (error) {
    console.error('[Migration] Error:', error.message);
    // Don't crash the server if migration fails (tables might already exist)
  } finally {
    await pool.end();
  }
};

module.exports = migrate;
