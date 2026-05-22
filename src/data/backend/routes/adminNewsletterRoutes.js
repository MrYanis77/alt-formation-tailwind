import express from 'express';
import { query } from '../db.js';
import { parseId } from '../utils.js';
import { auditLog } from '../audit.js';

const router = express.Router();

router.get('/subscribers', async (_req, res) => {
  try {
    const rows = await query(
      `SELECT id, email, first_name, last_name, is_confirmed, source,
              subscribed_at, confirmed_at, unsubscribed_at
       FROM newsletter_subscribers
       ORDER BY subscribed_at DESC
       LIMIT 500`
    );
    res.json({ success: true, subscribers: rows });
  } catch (err) {
    console.error('newsletter subscribers error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

router.get('/lists', async (_req, res) => {
  try {
    const rows = await query(
      `SELECT id, name, description, is_active, created_at FROM newsletter_lists ORDER BY id`
    );
    res.json({ success: true, lists: rows });
  } catch (err) {
    console.error('newsletter lists error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

router.get('/campaigns', async (_req, res) => {
  try {
    const rows = await query(
      `SELECT c.id, c.subject, c.status, c.scheduled_at, c.sent_at,
              c.total_sent, c.total_opened, c.total_clicked, c.created_at,
              c.list_id,
              COALESCE(v.unique_opens, 0) AS stat_unique_opens,
              COALESCE(v.unique_clicks, 0) AS stat_unique_clicks,
              COALESCE(v.open_rate_pct, 0) AS stat_open_rate_pct,
              COALESCE(v.click_rate_pct, 0) AS stat_click_rate_pct
       FROM newsletter_campaigns c
       LEFT JOIN v_campaign_stats v ON v.campaign_id = c.id
       ORDER BY c.updated_at DESC
       LIMIT 100`
    );
    res.json({ success: true, campaigns: rows });
  } catch (err) {
    console.error('newsletter campaigns error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

router.patch('/campaigns/:id', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, error: 'ID invalide' });

    const prev = await query('SELECT * FROM newsletter_campaigns WHERE id = ?', [id]);
    if (prev.length === 0) return res.status(404).json({ success: false, error: 'Introuvable' });

    const {
      subject,
      preview_text,
      body_html,
      body_text,
      status,
      list_id,
      scheduled_at,
      from_name,
      from_email,
    } = req.body || {};

    const listId =
      list_id === null || list_id === ''
        ? null
        : parseId(list_id);

    const st =
      status != null && ['draft', 'scheduled', 'sending', 'sent', 'cancelled'].includes(status)
        ? status
        : prev[0].status;

    await query(
      `UPDATE newsletter_campaigns SET
        subject = ?, preview_text = ?, body_html = ?, body_text = ?,
        status = ?, list_id = ?, scheduled_at = ?, from_name = ?, from_email = ?, updated_by = ?
       WHERE id = ?`,
      [
        subject != null ? String(subject).slice(0, 255) : prev[0].subject,
        preview_text !== undefined ? (preview_text ? String(preview_text).slice(0, 255) : null) : prev[0].preview_text,
        body_html !== undefined ? body_html : prev[0].body_html,
        body_text !== undefined ? body_text : prev[0].body_text,
        st,
        listId !== undefined ? listId : prev[0].list_id,
        scheduled_at !== undefined ? scheduled_at : prev[0].scheduled_at,
        from_name != null ? String(from_name).slice(0, 120) : prev[0].from_name,
        from_email != null ? String(from_email).slice(0, 180) : prev[0].from_email,
        req.adminUser.id,
        id,
      ]
    );

    auditLog({
      adminId: req.adminUser.id,
      action: 'newsletter_campaign_update',
      tableName: 'newsletter_campaigns',
      recordId: id,
      oldValue: { status: prev[0].status, subject: prev[0].subject },
      ipAddress: req.ip,
    });

    res.json({ success: true });
  } catch (err) {
    console.error('newsletter campaign patch error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
