import express from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db.js';
import { requireAdmin, requireAdminElevated, requireSuperAdmin } from '../middleware/auth.js';
import { parseId } from '../utils.js';
import { auditLog } from '../audit.js';
import adminBlogRoutes from './adminBlogRoutes.js';
import adminNewsletterRoutes from './adminNewsletterRoutes.js';
import adminChatbotRoutes from './adminChatbotRoutes.js';

const router = express.Router();

router.use(requireAdmin);

router.use('/blog', adminBlogRoutes);
router.use('/newsletter', adminNewsletterRoutes);
router.use('/chatbot', adminChatbotRoutes);

async function safeCount(sql, fallback = 0) {
  try {
    const rows = await query(sql);
    return rows[0]?.c ?? fallback;
  } catch {
    return fallback;
  }
}

router.get('/stats', async (_req, res) => {
  try {
    const [
      visits7d,
      visits30d,
      newUsers7d,
      totalUsers,
      pendingContacts,
      totalContacts,
      pendingFaq,
      totalFaq,
      visitsDaily,
      newsletterConfirmed,
      blogPublished,
      blogDraft,
      chatbotOpen,
      campaignsSent,
    ] = await Promise.all([
      query("SELECT COUNT(*) AS c FROM page_visits WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)"),
      query("SELECT COUNT(*) AS c FROM page_visits WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)"),
      query("SELECT COUNT(*) AS c FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)"),
      query('SELECT COUNT(*) AS c FROM users'),
      query("SELECT COUNT(*) AS c FROM contacts WHERE status = 'pending'"),
      query('SELECT COUNT(*) AS c FROM contacts'),
      query("SELECT COUNT(*) AS c FROM faq_requests WHERE status = 'pending'"),
      query('SELECT COUNT(*) AS c FROM faq_requests'),
      query(`SELECT DATE(created_at) AS day, COUNT(*) AS c
             FROM page_visits
             WHERE created_at >= DATE_SUB(NOW(), INTERVAL 14 DAY)
             GROUP BY day
             ORDER BY day ASC`),
      safeCount('SELECT COUNT(*) AS c FROM newsletter_subscribers WHERE is_confirmed = 1'),
      safeCount("SELECT COUNT(*) AS c FROM blog_posts WHERE status = 'published'"),
      safeCount("SELECT COUNT(*) AS c FROM blog_posts WHERE status = 'draft'"),
      safeCount("SELECT COUNT(*) AS c FROM chatbot_conversations WHERE status = 'open'"),
      safeCount("SELECT COUNT(*) AS c FROM newsletter_campaigns WHERE status = 'sent'"),
    ]);

    res.json({
      success: true,
      stats: {
        visits7d: visits7d[0].c,
        visits30d: visits30d[0].c,
        newUsers7d: newUsers7d[0].c,
        totalUsers: totalUsers[0].c,
        pendingContacts: pendingContacts[0].c,
        totalContacts: totalContacts[0].c,
        pendingFaq: pendingFaq[0].c,
        totalFaq: totalFaq[0].c,
        visitsDaily: visitsDaily.map((r) => ({ day: r.day, count: r.c })),
        newsletterConfirmed,
        blogPublished,
        blogDraft,
        chatbotOpen,
        campaignsSent,
      },
    });
  } catch (err) {
    console.error('admin stats error:', err);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

router.get('/contacts', async (req, res) => {
  try {
    const status = req.query.status;
    let sql = `SELECT c.id, c.nom, c.prenom, c.email, c.telephone, c.sujet, c.message,
                      c.status, c.created_at, c.user_id,
                      u.prenom AS user_prenom, u.nom AS user_nom
               FROM contacts c
               LEFT JOIN users u ON u.id = c.user_id`;
    const params = [];
    if (status && ['pending', 'read', 'replied'].includes(status)) {
      sql += ' WHERE c.status = ?';
      params.push(status);
    }
    sql += ' ORDER BY c.created_at DESC LIMIT 200';

    const rows = await query(sql, params);
    res.json({ success: true, contacts: rows });
  } catch (err) {
    console.error('admin list contacts error:', err);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

router.patch('/contacts/:id/status', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, error: 'ID invalide' });

    const { status } = req.body || {};
    if (!['pending', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Status invalide' });
    }

    const prev = await query('SELECT id, status FROM contacts WHERE id = ?', [id]);
    await query('UPDATE contacts SET status = ? WHERE id = ?', [status, id]);

    auditLog({
      adminId: req.adminUser.id,
      action: 'contact_status_update',
      tableName: 'contacts',
      recordId: id,
      oldValue: prev[0] || null,
      newValue: { status },
      ipAddress: req.ip,
    });

    res.json({ success: true });
  } catch (err) {
    console.error('admin update contact status error:', err);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

router.get('/users', requireAdminElevated, async (_req, res) => {
  try {
    const rows = await query(
      `SELECT u.id, u.prenom, u.nom, u.email, u.telephone, u.role, u.created_at,
              (SELECT COUNT(*) FROM contacts WHERE user_id = u.id) AS contacts_count,
              (SELECT COUNT(*) FROM faq_requests WHERE user_id = u.id) AS faq_count
       FROM users u
       ORDER BY u.created_at DESC
       LIMIT 500`
    );
    res.json({ success: true, users: rows });
  } catch (err) {
    console.error('admin list users error:', err);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

router.patch('/users/:id/role', requireAdminElevated, async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, error: 'ID invalide' });

    const { role } = req.body || {};
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Rôle invalide' });
    }

    if (req.user && id === req.user.id) {
      return res.status(400).json({ success: false, error: 'Vous ne pouvez pas modifier votre propre rôle' });
    }

    const prevRows = await query('SELECT id, role FROM users WHERE id = ?', [id]);
    if (prevRows.length === 0) {
      return res.status(404).json({ success: false, error: 'Utilisateur introuvable' });
    }

    if (role === 'user' && prevRows[0].role === 'admin') {
      const adminCount = await query("SELECT COUNT(*) AS c FROM users WHERE role = 'admin'");
      if (adminCount[0].c <= 1) {
        return res.status(400).json({
          success: false,
          error: 'Impossible : il doit rester au moins un administrateur site (users.role)',
        });
      }
    }

    await query('UPDATE users SET role = ? WHERE id = ?', [role, id]);

    if (role === 'user') {
      await query('DELETE FROM sessions WHERE user_id = ?', [id]);
    }

    auditLog({
      adminId: req.adminUser.id,
      action: 'site_user_role_update',
      tableName: 'users',
      recordId: id,
      oldValue: prevRows[0],
      newValue: { role },
      ipAddress: req.ip,
    });

    res.json({ success: true });
  } catch (err) {
    console.error('admin update role error:', err);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

router.get('/admin-users', requireSuperAdmin, async (_req, res) => {
  try {
    const rows = await query(
      `SELECT id, username, email, role, is_active, last_login, created_at
       FROM admin_users
       ORDER BY id ASC`
    );
    res.json({ success: true, admins: rows });
  } catch (err) {
    console.error('admin list admin_users error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

router.patch('/admin-users/:id', requireSuperAdmin, async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, error: 'ID invalide' });

    const { role, is_active, password } = req.body || {};

    const prev = await query(
      'SELECT id, username, email, role, is_active FROM admin_users WHERE id = ?',
      [id]
    );
    if (prev.length === 0) return res.status(404).json({ success: false, error: 'Introuvable' });

    if (id === req.adminUser.id) {
      if (is_active === false || is_active === 0) {
        return res.status(400).json({ success: false, error: 'Vous ne pouvez pas désactiver votre propre compte' });
      }
      if (role && role !== prev[0].role) {
        return res.status(400).json({ success: false, error: 'Vous ne pouvez pas modifier votre propre rôle' });
      }
    }

    let nextRole = prev[0].role;
    if (role != null) {
      if (!['superadmin', 'admin', 'editor'].includes(role)) {
        return res.status(400).json({ success: false, error: 'Rôle invalide' });
      }
      nextRole = role;
    }

    let nextActive = prev[0].is_active;
    if (is_active !== undefined) {
      nextActive = is_active === false || is_active === 0 ? 0 : 1;
    }

    if (prev[0].role === 'superadmin' && nextRole !== 'superadmin') {
      const cnt = await query(
        `SELECT COUNT(*) AS c FROM admin_users WHERE role = 'superadmin' AND is_active = 1`
      );
      if (cnt[0].c <= 1) {
        return res.status(400).json({
          success: false,
          error: 'Il doit rester au moins un superadmin actif',
        });
      }
    }

    if (password != null && String(password).length > 0) {
      if (String(password).length < 8) {
        return res.status(400).json({ success: false, error: 'Mot de passe trop court (8 caractères min)' });
      }
      const hash = await bcrypt.hash(String(password), 10);
      await query(
        `UPDATE admin_users SET password_hash = ?, role = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [hash, nextRole, nextActive, id]
      );
    } else {
      await query(
        `UPDATE admin_users SET role = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [nextRole, nextActive, id]
      );
    }

    if (nextActive === 0) {
      await query('DELETE FROM admin_sessions WHERE admin_id = ?', [id]);
    }

    auditLog({
      adminId: req.adminUser.id,
      action: 'admin_user_update',
      tableName: 'admin_users',
      recordId: id,
      oldValue: prev[0],
      newValue: { role: nextRole, is_active: nextActive, password_changed: !!password },
      ipAddress: req.ip,
    });

    res.json({ success: true });
  } catch (err) {
    console.error('admin patch admin_users error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

router.post('/admin-users', requireSuperAdmin, async (req, res) => {
  try {
    const { username, email, password, role } = req.body || {};
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, error: 'Username, email et mot de passe requis' });
    }
    if (String(password).length < 8) {
      return res.status(400).json({ success: false, error: 'Mot de passe trop court' });
    }
    const r = ['superadmin', 'admin', 'editor'].includes(role) ? role : 'editor';
    const hash = await bcrypt.hash(String(password), 10);
    const ins = await query(
      `INSERT INTO admin_users (username, email, password_hash, role, is_active)
       VALUES (?, ?, ?, ?, 1)`,
      [
        String(username).trim().slice(0, 60),
        String(email).trim().toLowerCase().slice(0, 180),
        hash,
        r,
      ]
    );

    auditLog({
      adminId: req.adminUser.id,
      action: 'admin_user_create',
      tableName: 'admin_users',
      recordId: ins.insertId,
      newValue: { username, email, role: r },
      ipAddress: req.ip,
    });

    res.status(201).json({ success: true, id: ins.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, error: 'Username ou email déjà utilisé' });
    }
    console.error('admin create admin_users error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
