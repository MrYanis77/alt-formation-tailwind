import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { mockQuery } from './mockDb.js';

dotenv.config();

function truthyEnv(v) {
  return ['1', 'true', 'yes', 'on'].includes(String(v ?? '').trim().toLowerCase());
}

/** Si true : aucune connexion MySQL ; `query()` utilise des données factices (voir mockDb.js). */
export const isDatabaseDisabled = truthyEnv(process.env.DISABLE_DATABASE);

let pool = null;
if (!isDatabaseDisabled) {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'alt_formations_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
  });
}

export async function query(sql, params = []) {
  if (isDatabaseDisabled) {
    return mockQuery(sql, params);
  }
  const [rows] = await pool.execute(sql, params);
  return rows;
}

export async function getConnection() {
  if (isDatabaseDisabled) {
    throw new Error('MySQL désactivé (DISABLE_DATABASE=1)');
  }
  return pool.getConnection();
}

export default pool;
