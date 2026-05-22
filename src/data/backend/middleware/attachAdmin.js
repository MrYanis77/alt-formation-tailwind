import { query, isDatabaseDisabled } from '../db.js';
import { ADMIN_SESSION_COOKIE } from '../constants.js';

const DEMO_ADMIN_USER = {
  id: 1,
  username: 'demo',
  email: 'demo@local.test',
  role: 'superadmin',
  is_active: 1,
  last_login: null,
  created_at: new Date().toISOString(),
};

/**
 * Back-office admin from admin_sessions + admin_users.
 */
export async function attachAdminUser(req, _res, next) {
  try {
    const token = req.cookies?.[ADMIN_SESSION_COOKIE] || null;
    req.adminUser = null;
    req.adminSessionToken = token;

    if (!token) return next();

    if (isDatabaseDisabled) {
      req.adminUser = { ...DEMO_ADMIN_USER };
      return next();
    }

    const rows = await query(
      `SELECT u.id, u.username, u.email, u.role, u.is_active, u.last_login, u.created_at, s.expires_at
       FROM admin_sessions s
       JOIN admin_users u ON u.id = s.admin_id
       WHERE s.token = ? LIMIT 1`,
      [token]
    );

    if (rows.length === 0) return next();

    const row = rows[0];
    if (!row.is_active) {
      await query('DELETE FROM admin_sessions WHERE token = ?', [token]);
      return next();
    }

    if (new Date(row.expires_at) < new Date()) {
      await query('DELETE FROM admin_sessions WHERE token = ?', [token]);
      return next();
    }

    req.adminUser = {
      id: row.id,
      username: row.username,
      email: row.email,
      role: row.role,
      is_active: row.is_active,
      last_login: row.last_login,
      created_at: row.created_at,
    };
    next();
  } catch (err) {
    console.error('attachAdminUser error:', err);
    next();
  }
}
