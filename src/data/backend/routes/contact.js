import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// GET /api/contact/mine - liste les messages de l'utilisateur connecté
// (l'envoi du formulaire de contact est désormais géré par public/api/send-mail.php)
router.get('/mine', async (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, error: 'Non authentifié' });
  try {
    const rows = await query(
      `SELECT id, sujet, message, status, created_at
       FROM contacts
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, contacts: rows });
  } catch (err) {
    console.error('list mine error:', err);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

export default router;
