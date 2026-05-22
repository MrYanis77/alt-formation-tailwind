/**
 * Crée ou met à jour un compte dans admin_users (back-office).
 * Usage : npm run seed:admin   ou   node src/data/backend/seed-admin.js
 *
 * Variables d'environnement (.env) :
 *   ADMIN_USERNAME (défaut: superadmin)
 *   ADMIN_EMAIL    (défaut: admin@altformations.fr)
 *   ADMIN_PASSWORD (défaut: Admin1234!)
 *
 * Si DISABLE_DATABASE=1 : aucune connexion MySQL (voir SETUP.md).
 */
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { query, isDatabaseDisabled } from './db.js';

dotenv.config();

async function main() {
  if (isDatabaseDisabled) {
    console.log('[seed-admin] DISABLE_DATABASE actif — aucune connexion MySQL.');
    process.exit(0);
  }

  const username = (process.env.ADMIN_USERNAME || 'superadmin').trim().slice(0, 60);
  const email = (process.env.ADMIN_EMAIL || 'admin@altformations.fr').trim().toLowerCase().slice(0, 180);
  const password = process.env.ADMIN_PASSWORD || 'Admin1234!';

  if (password.length < 8) {
    console.error('[ERREUR] ADMIN_PASSWORD doit faire au moins 8 caracteres.');
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 10);

  const byEmail = await query('SELECT id, username FROM admin_users WHERE email = ? LIMIT 1', [email]);
  const byUsername = await query('SELECT id, email FROM admin_users WHERE username = ? LIMIT 1', [username]);

  let adminId;

  if (byEmail.length > 0) {
    adminId = byEmail[0].id;
    await query(
      `UPDATE admin_users SET username = ?, password_hash = ?, role = 'superadmin', is_active = 1 WHERE id = ?`,
      [username, hash, adminId]
    );
    console.log(`[OK] Admin mis à jour : ${username} <${email}>`);
  } else if (byUsername.length > 0) {
    adminId = byUsername[0].id;
    await query(
      `UPDATE admin_users SET email = ?, password_hash = ?, role = 'superadmin', is_active = 1 WHERE id = ?`,
      [email, hash, adminId]
    );
    console.log(`[OK] Admin mis à jour : ${username} <${email}>`);
  } else {
    const ins = await query(
      `INSERT INTO admin_users (username, email, password_hash, role, is_active)
       VALUES (?, ?, ?, 'superadmin', 1)`,
      [username, email, hash]
    );
    adminId = ins.insertId;
    console.log(`[OK] Admin créé : ${username} <${email}>`);
  }

  await query('DELETE FROM admin_sessions WHERE admin_id = ?', [adminId]);

  console.log(`Mot de passe : ${password}`);
  console.log('Changez-le après la première connexion au tableau de bord.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Erreur seed-admin :', err);
  process.exit(1);
});
