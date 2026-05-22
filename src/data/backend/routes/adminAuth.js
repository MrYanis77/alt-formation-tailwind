import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { query, isDatabaseDisabled } from '../db.js';
import { ADMIN_SESSION_COOKIE } from '../constants.js';
import { attachAdminUser } from '../middleware/attachAdmin.js';

const router = express.Router();
const SESSION_DAYS = 7;

const isProd = process.env.NODE_ENV === 'production';
const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: 'lax',
  maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000,
  path: '/',
};

const MAX_ADMIN_SESSIONS = 10;

function clientIp(req) {
  const xf = req.headers['x-forwarded-for'];
  const raw = typeof xf === 'string' ? xf.split(',')[0].trim() : xf?.[0];
  return raw || req.ip || req.socket?.remoteAddress || '';
}

async function recordLoginAttempt(ip, identifier, success) {
  try {
    await query(
      `INSERT INTO login_attempts (ip_address, username, success)
       VALUES (?, ?, ?)`,
      [String(ip || '').slice(0, 45), identifier ? String(identifier).slice(0, 60) : null, success ? 1 : 0]
    );
  } catch (err) {
    console.error('recordLoginAttempt error:', err);
  }
}

async function isIpBlocked(ip) {
  try {
    const rows = await query(
      `SELECT COUNT(*) AS c FROM login_attempts
       WHERE ip_address = ?
         AND success = 0
         AND attempted_at >= DATE_SUB(NOW(), INTERVAL 15 MINUTE)`,
      [String(ip || '').slice(0, 45)]
    );
    return rows[0]?.c >= 5;
  } catch {
    return false;
  }
}

function publicAdmin(row) {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    role: row.role,
    is_active: row.is_active,
    last_login: row.last_login,
    created_at: row.created_at,
  };
}

async function createAdminSession(adminId, req) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  const ip = clientIp(req);
  const ua = req.headers['user-agent'] ? String(req.headers['user-agent']).slice(0, 512) : null;

  await query(
    `INSERT INTO admin_sessions (admin_id, token, ip_address, user_agent, expires_at)
     VALUES (?, ?, ?, ?, ?)`,
    [adminId, token, ip.slice(0, 45), ua, expiresAt]
  );

  await query('DELETE FROM admin_sessions WHERE admin_id = ? AND expires_at < NOW()', [adminId]);

  const sessions = await query(
    `SELECT id FROM admin_sessions WHERE admin_id = ? ORDER BY created_at DESC`,
    [adminId]
  );
  if (sessions.length > MAX_ADMIN_SESSIONS) {
    const toDelete = sessions.slice(MAX_ADMIN_SESSIONS).map((s) => s.id);
    if (toDelete.length > 0) {
      const ph = toDelete.map(() => '?').join(',');
      await query(`DELETE FROM admin_sessions WHERE id IN (${ph})`, toDelete);
    }
  }

  return token;
}

// POST /api/admin/auth/login
router.post('/login', async (req, res) => {
  try {
    const identifierEarly = req.body?.identifier ?? req.body?.username ?? req.body?.email;
    const passwordEarly = req.body?.password;

    if (isDatabaseDisabled) {
      if (!identifierEarly || !passwordEarly) {
        return res.status(400).json({ success: false, error: 'Identifiant et mot de passe requis' });
      }
      const token = crypto.randomBytes(32).toString('hex');
      res.cookie(ADMIN_SESSION_COOKIE, token, cookieOptions);
      res.json({
        success: true,
        admin: publicAdmin({
          id: 1,
          username: String(identifierEarly).trim().slice(0, 60) || 'demo',
          email: 'demo@local.test',
          role: 'superadmin',
          is_active: 1,
          last_login: new Date(),
          created_at: new Date(),
        }),
      });
      return;
    }

    const ip = clientIp(req);
    const blocked = await isIpBlocked(ip);
    if (blocked) {
      await recordLoginAttempt(ip, req.body?.identifier || req.body?.username || req.body?.email, false);
      return res.status(429).json({ success: false, error: 'Trop de tentatives. Réessayez dans quelques minutes.' });
    }

    const identifier = req.body?.identifier ?? req.body?.username ?? req.body?.email;
    const password = req.body?.password;
    if (!identifier || !password) {
      return res.status(400).json({ success: false, error: 'Identifiant et mot de passe requis' });
    }

    const rows = await query(
      `SELECT id, username, email, password_hash, role, is_active, last_login, created_at
       FROM admin_users
       WHERE username = ? OR email = ?
       LIMIT 1`,
      [String(identifier).trim(), String(identifier).trim().toLowerCase()]
    );

    if (rows.length === 0) {
      await recordLoginAttempt(ip, identifier, false);
      return res.status(401).json({ success: false, error: 'Identifiant ou mot de passe incorrect' });
    }

    const admin = rows[0];
    if (!admin.is_active) {
      await recordLoginAttempt(ip, identifier, false);
      return res.status(403).json({ success: false, error: 'Compte désactivé' });
    }

    const valid = await bcrypt.compare(String(password), admin.password_hash);
    if (!valid) {
      await recordLoginAttempt(ip, identifier, false);
      return res.status(401).json({ success: false, error: 'Identifiant ou mot de passe incorrect' });
    }

    await query('UPDATE admin_users SET last_login = NOW() WHERE id = ?', [admin.id]);

    const token = await createAdminSession(admin.id, req);
    res.cookie(ADMIN_SESSION_COOKIE, token, cookieOptions);

    await recordLoginAttempt(ip, identifier, true);

    delete admin.password_hash;
    res.json({ success: true, admin: publicAdmin(admin) });
  } catch (err) {
    console.error('admin login error:', err);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

// POST /api/admin/auth/logout
router.post('/logout', async (req, res) => {
  try {
    const token = req.cookies?.[ADMIN_SESSION_COOKIE];
    if (token) {
      await query('DELETE FROM admin_sessions WHERE token = ?', [token]);
    }
    res.clearCookie(ADMIN_SESSION_COOKIE, { path: '/' });
    res.json({ success: true });
  } catch (err) {
    console.error('admin logout error:', err);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

// GET /api/admin/auth/me
router.get('/me', attachAdminUser, (req, res) => {
  if (!req.adminUser) {
    return res.status(401).json({ success: false, error: 'Non authentifié' });
  }
  res.json({ success: true, admin: req.adminUser });
});

export default router;
