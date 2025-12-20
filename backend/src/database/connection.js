import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Create pool but don't connect immediately - lazy connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'zeni',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 1000, // Fast timeout
  // Don't fail on connection errors
  allowExitOnIdle: true
});

// Suppress connection errors - routes will handle fallback
pool.on('error', (err) => {
  // Silently handle - routes will use in-memory storage
  if (!pool._errorSuppressed) {
    pool._errorSuppressed = true;
  }
});

// Test connection asynchronously (don't block)
setTimeout(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Connected to PostgreSQL database');
  } catch (err) {
    console.warn('⚠️  Database not available. Using in-memory storage for testing.');
  }
}, 100);

export default pool;

