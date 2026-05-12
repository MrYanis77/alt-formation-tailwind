import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const SESSION_COOKIE = 'session_token';
const SESSION_DAYS = 7;

const isProd = process.env.NODE_ENV === 'production';
const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: 'lax',
  maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000,
  path: '/',
};

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function publicUser(u) {
  return {
    id: u.id,
    prenom: u.prenom,
    nom: u.nom,
    email: u.email,
    telephone: u.telephone || null,
    role: u.role,
    created_at: u.created_at,
  };
}

const MAX_SESSIONS_PER_USER = 5;

async function createSession(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await query(
    'INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)',
    [userId, token, expiresAt]
  );

  // Garde-fou : nettoyage des sessions expirees + cap sur le nombre par utilisateur
  await query('DELETE FROM sessions WHERE user_id = ? AND expires_at < NOW()', [userId]);

  const sessions = await query(
    'SELECT id FROM sessions WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  if (sessions.length > MAX_SESSIONS_PER_USER) {
    const toDelete = sessions.slice(MAX_SESSIONS_PER_USER).map((s) => s.id);
    if (toDelete.length > 0) {
      const placeholders = toDelete.map(() => '?').join(',');
      await query(`DELETE FROM sessions WHERE id IN (${placeholders})`, toDelete);
    }
  }

  return token;
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { prenom, nom, email, telephone, password } = req.body || {};

    if (!prenom || !nom || !email || !password) {
      return res.status(400).json({ success: false, error: 'Tous les champs obligatoires sont requis' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, error: "Format d'email invalide" });
    }
    if (String(password).length < 8) {
      return res.status(400).json({ success: false, error: 'Le mot de passe doit faire au moins 8 caractères' });
    }

    const existing = await query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, error: 'Un compte existe déjà avec cet email' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await query(
      'INSERT INTO users (prenom, nom, email, telephone, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)',
      [
        String(prenom).trim().slice(0, 50),
        String(nom).trim().slice(0, 50),
        String(email).trim().toLowerCase().slice(0, 100),
        telephone ? String(telephone).trim().slice(0, 20) : null,
        passwordHash,
        'user',
      ]
    );

    const userId = result.insertId;
    const userRows = await query('SELECT id, prenom, nom, email, telephone, role, created_at FROM users WHERE id = ?', [userId]);
    const token = await createSession(userId);

    res.cookie(SESSION_COOKIE, token, cookieOptions);
    res.status(201).json({ success: true, user: publicUser(userRows[0]) });
  } catch (err) {
    console.error('register error:', err);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email et mot de passe requis' });
    }

    const rows = await query(
      'SELECT id, prenom, nom, email, telephone, role, created_at, password_hash FROM users WHERE email = ? LIMIT 1',
      [String(email).trim().toLowerCase()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Email ou mot de passe incorrect' });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(String(password), user.password_hash);
    if (!valid) {
      return res.status(401).json({ success: false, error: 'Email ou mot de passe incorrect' });
    }

    const token = await createSession(user.id);
    res.cookie(SESSION_COOKIE, token, cookieOptions);
    res.json({ success: true, user: publicUser(user) });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  try {
    const token = req.cookies?.[SESSION_COOKIE];
    if (token) {
      await query('DELETE FROM sessions WHERE token = ?', [token]);
    }
    res.clearCookie(SESSION_COOKIE, { path: '/' });
    res.json({ success: true });
  } catch (err) {
    console.error('logout error:', err);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  res.json({ success: true, user: req.user });
});

// PATCH /api/auth/me  (update profile fields: prenom, nom, telephone)
router.patch('/me', requireAuth, async (req, res) => {
  try {
    const { prenom, nom, telephone } = req.body || {};
    const updates = [];
    const params = [];

    if (prenom !== undefined) {
      updates.push('prenom = ?');
      params.push(String(prenom).trim().slice(0, 50));
    }
    if (nom !== undefined) {
      updates.push('nom = ?');
      params.push(String(nom).trim().slice(0, 50));
    }
    if (telephone !== undefined) {
      updates.push('telephone = ?');
      params.push(telephone ? String(telephone).trim().slice(0, 20) : null);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, error: 'Aucune donnée à mettre à jour' });
    }

    params.push(req.user.id);
    await query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);

    const rows = await query(
      'SELECT id, prenom, nom, email, telephone, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    res.json({ success: true, user: publicUser(rows[0]) });
  } catch (err) {
    console.error('update profile error:', err);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

export default router;
