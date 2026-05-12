import express from 'express';
import { Resend } from 'resend';
import { query } from '../db.js';
import { clean, escapeHtml, looksLikeInjection } from '../utils.js';

const router = express.Router();
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const RESEND_FROM = process.env.RESEND_FROM || 'onboarding@resend.dev';
const ADMIN_RECIPIENT = process.env.EMAIL_DESTINATAIRE || 'contact@altformations.fr';

router.post('/', async (req, res) => {
  try {
    const { nom, prenom, email, telephone, sujet, message, honeypot } = req.body || {};

    // Honeypot anti-bot : on renvoie 200 silencieux pour ne pas guider les bots
    if (honeypot && String(honeypot).length > 0) {
      return res.status(200).json({ success: true, contactId: null });
    }

    if (!nom || !prenom || !email || !sujet || !message) {
      return res.status(400).json({ success: false, error: 'Tous les champs obligatoires sont requis' });
    }

    const fields = { nom, prenom, email, telephone, sujet, message };
    for (const [key, val] of Object.entries(fields)) {
      if (val && looksLikeInjection(val)) {
        return res.status(400).json({ success: false, error: `Contenu invalide dans le champ ${key}` });
      }
    }

    const userId = req.user?.id || null;

    const result = await query(
      `INSERT INTO contacts (user_id, nom, prenom, email, telephone, sujet, message, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        userId,
        clean(nom, 50),
        clean(prenom, 50),
        clean(email, 100),
        telephone ? clean(telephone, 20) : null,
        clean(sujet, 200),
        clean(message, 1500),
      ]
    );

    const contactId = result.insertId;

    if (resend) {
      try {
        await resend.emails.send({
          from: RESEND_FROM,
          to: ADMIN_RECIPIENT,
          subject: `Nouveau message du site: ${clean(sujet, 100)}`,
          html: `
            <div style="font-family: sans-serif; color: #1a202c; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
              <h2 style="color: #fca311; text-transform: uppercase;">Nouveau Contact #${contactId}</h2>
              <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Nom :</strong></td><td>${escapeHtml(clean(prenom, 50))} ${escapeHtml(clean(nom, 50))}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Email :</strong></td><td>${escapeHtml(clean(email, 100))}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Téléphone :</strong></td><td>${telephone ? escapeHtml(clean(telephone, 20)) : 'Non renseigné'}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Sujet :</strong></td><td>${escapeHtml(clean(sujet, 200))}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Utilisateur connecté :</strong></td><td>${userId ? '#' + userId : 'Non'}</td></tr>
              </table>
              <div style="margin-top: 25px;">
                <strong>Message :</strong>
                <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; white-space: pre-wrap;">${escapeHtml(clean(message, 1500))}</div>
              </div>
              <p style="margin-top: 20px; font-size: 12px; color: #718096;">Connectez-vous au tableau de bord admin pour répondre via le chat.</p>
            </div>
          `,
        });
      } catch (mailErr) {
        console.error('Resend send error (non-blocking):', mailErr);
      }
    }

    res.status(200).json({ success: true, contactId });
  } catch (err) {
    console.error('contact submit error:', err);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

// GET /api/contact/mine - liste les messages de l'utilisateur connecté
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
