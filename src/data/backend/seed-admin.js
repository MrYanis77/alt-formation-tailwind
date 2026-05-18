/**
 * Cree (ou met a jour) le compte administrateur initial.
 * Usage : node src/data/backend/seed-admin.js
 *
 * Variables d'environnement (toutes optionnelles) :
<<<<<<< HEAD
 *   ADMIN_EMAIL    (defaut: admin@alt-rh.com)
=======
 *   ADMIN_EMAIL    (defaut: admin@altformations.fr)
>>>>>>> 0a48c2f2e8ddbb4846f055db09011af7079eaa03
 *   ADMIN_PASSWORD (defaut: Admin1234!)
 *   ADMIN_PRENOM   (defaut: Admin)
 *   ADMIN_NOM      (defaut: Alt Formations)
 *
 * Refuse d'ecraser un compte non-admin existant : passe FORCE_OVERWRITE=1 pour forcer.
 */
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { query } from './db.js';

dotenv.config();

async function main() {
<<<<<<< HEAD
  const email = (process.env.ADMIN_EMAIL || 'admin@alt-rh.com').toLowerCase();
=======
  const email = (process.env.ADMIN_EMAIL || 'admin@altformations.fr').toLowerCase();
>>>>>>> 0a48c2f2e8ddbb4846f055db09011af7079eaa03
  const password = process.env.ADMIN_PASSWORD || 'Admin1234!';
  const prenom = process.env.ADMIN_PRENOM || 'Admin';
  const nom = process.env.ADMIN_NOM || 'Alt Formations';
  const force = process.env.FORCE_OVERWRITE === '1';

  if (password.length < 8) {
    console.error('[ERREUR] ADMIN_PASSWORD doit faire au moins 8 caracteres.');
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 10);

  const existing = await query('SELECT id, role FROM users WHERE email = ? LIMIT 1', [email]);

  if (existing.length > 0) {
    if (existing[0].role !== 'admin' && !force) {
      console.error(
        `[ERREUR] Un utilisateur non-admin existe deja avec l'email ${email}.\n` +
        '         Refus d\'ecrasement. Utilisez FORCE_OVERWRITE=1 pour forcer.'
      );
      process.exit(1);
    }

    await query(
      'UPDATE users SET password_hash = ?, role = ?, prenom = ?, nom = ? WHERE email = ?',
      [hash, 'admin', prenom, nom, email]
    );
    // On invalide les sessions actives pour forcer la reconnexion avec le nouveau mot de passe
    await query('DELETE FROM sessions WHERE user_id = ?', [existing[0].id]);
    console.log(`[OK] Admin mis a jour : ${email}`);
  } else {
    await query(
      'INSERT INTO users (prenom, nom, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [prenom, nom, email, hash, 'admin']
    );
    console.log(`[OK] Admin cree : ${email}`);
  }

  console.log(`Mot de passe : ${password}`);
  console.log('Pensez a changer ce mot de passe apres la premiere connexion.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Erreur seed-admin :', err);
  process.exit(1);
});
