import express from 'express';
import { Resend } from 'resend';

const router = express.Router();
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

router.post('/', async (req, res) => {
  try {
    const { prenom, nom, email, telephone, specificField, message, type, attachment } = req.body;

    if (!resend) {
      return res.status(503).json({ success: false, error: 'Service email non configuré' });
    }

    const emailOptions = {
      from: 'onboarding@resend.dev',
      to: process.env.EMAIL_DESTINATAIRE || 'contact@altformations.fr',
      subject: `[CANDIDATURE] ${String(type || '').toUpperCase()} - ${prenom} ${nom}`,
      html: `
        <div style="font-family: sans-serif; color: #1a202c; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
          <h2 style="color: #fca311; text-transform: uppercase;">Nouvelle Candidature : ${type}</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Candidat :</strong></td><td>${prenom} ${nom}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Email :</strong></td><td><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Téléphone :</strong></td><td>${telephone}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>${type === 'formateur' ? 'Expertise' : 'Contrat'} :</strong></td><td>${specificField}</td></tr>
          </table>
          <div style="margin-top: 25px;">
            <strong>Message / Motivation :</strong>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; white-space: pre-wrap;">${message ? message.replace(/\n/g, '<br/>') : 'Aucun message.'}</div>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #718096;">Le CV est joint à cet email.</p>
        </div>
      `,
    };

    if (attachment && attachment.content && attachment.filename) {
      emailOptions.attachments = [
        { filename: attachment.filename, content: attachment.content },
      ];
    }

    const { data, error } = await resend.emails.send(emailOptions);
    if (error) {
      console.error('Resend candidature error:', error);
      return res.status(400).json({ success: false, error: error.message });
    }
    res.json({ success: true, data });
  } catch (err) {
    console.error('rejoindre error:', err);
    res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
  }
});

export default router;
