import { query } from '../db.js';

export { attachAdminUser } from './attachAdmin.js';

/**
 * Resolves the current site user from the session cookie.
 * Attaches req.user (or null) and req.sessionToken.
 */
export async function attachUser(req, _res, next) {
  try {
    const token = req.cookies?.session_token || null;
    req.user = null;
    req.sessionToken = token;

    if (!token) return next();

    const rows = await query(
      `SELECT u.id, u.prenom, u.nom, u.email, u.telephone, u.role, u.created_at, s.expires_at
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token = ? LIMIT 1`,
      [token]
    );

    if (rows.length === 0) return next();

    const row = rows[0];
    if (new Date(row.expires_at) < new Date()) {
      await query('DELETE FROM sessions WHERE token = ?', [token]);
      return next();
    }

    req.user = {
      id: row.id,
      prenom: row.prenom,
      nom: row.nom,
      email: row.email,
      telephone: row.telephone,
      role: row.role,
      created_at: row.created_at,
    };
    next();
  } catch (err) {
    console.error('attachUser error:', err);
    next();
  }
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Non authentifié' });
  }
  next();
}

/** Tout compte admin_sessions valide (superadmin | admin | editor). */
export function requireAdmin(req, res, next) {
  if (!req.adminUser) {
    return res.status(401).json({ success: false, error: 'Non authentifié (admin)' });
  }
  next();
}

/** superadmin uniquement */
export function requireSuperAdmin(req, res, next) {
  if (!req.adminUser) {
    return res.status(401).json({ success: false, error: 'Non authentifié (admin)' });
  }
  if (req.adminUser.role !== 'superadmin') {
    return res.status(403).json({ success: false, error: 'Accès réservé au super-administrateur' });
  }
  next();
}

/** superadmin ou admin (exclut editor pour actions sensibles). */
export function requireAdminElevated(req, res, next) {
  if (!req.adminUser) {
    return res.status(401).json({ success: false, error: 'Non authentifié (admin)' });
  }
  if (!['superadmin', 'admin'].includes(req.adminUser.role)) {
    return res.status(403).json({ success: false, error: 'Droits insuffisants' });
  }
  next();
}

/** Utilisateur site OU session admin back-office (chat / contexte conversation). */
export function requireUserOrAdmin(req, res, next) {
  if (req.adminUser) return next();
  return requireAuth(req, res, next);
}
