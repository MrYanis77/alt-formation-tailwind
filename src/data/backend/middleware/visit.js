import crypto from 'crypto';
import { query } from '../db.js';

const IP_SALT = process.env.IP_HASH_SALT || 'alt-formations-default-salt-change-me';

export function hashIp(ip) {
  return crypto
    .createHmac('sha256', IP_SALT)
    .update(String(ip || ''))
    .digest('hex')
    .slice(0, 64);
}

/**
 * Records a page visit. Called explicitly via POST /api/visit
 * (we want to track client-side route changes, not raw HTTP requests).
 */
export async function recordVisit({ page, ip, userAgent }) {
  if (!page) return;
  try {
    await query(
      'INSERT INTO page_visits (page, ip_hash, user_agent) VALUES (?, ?, ?)',
      [
        String(page).slice(0, 255),
        hashIp(ip),
        userAgent ? String(userAgent).slice(0, 500) : null,
      ]
    );
  } catch (err) {
    console.error('recordVisit error:', err);
  }
}
