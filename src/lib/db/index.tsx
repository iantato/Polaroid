import { Pool } from '@neondatabase/serverless';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      connectionTimeoutMillis: 5000,
    });
  }

  return pool
}

export async function testConnection() {
  try {
    const pool = getPool();
    const result = await pool.query('SELECT * from polaroids');
    console.log('Database connection successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}