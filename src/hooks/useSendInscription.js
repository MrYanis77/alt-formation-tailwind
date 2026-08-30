import { useState } from 'react';

const isValidEmail = (value) => {
  const parts = String(value ?? '').trim().split('@');
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  return Boolean(local && domain && domain.includes('.') && !domain.startsWith('.') && !domain.endsWith('.'));
};

/**
 * Hook pour envoyer une confirmation d'inscription à une formation.
 *
 * Usage :
 *   const { send, status, error, reset } = useSendInscription();
 *
 *   await send({
 *     prenom:    'Jean',
 *     nom:       'Dupont',
 *     email:     'jean.dupont@email.com',
 *     formation: 'Formation Cybersécurité',
 *     date:      '20/06/2026',       // optionnel
 *     lieu:      'Serris (77700)',   // optionnel
 *   });
 *
 * status : 'idle' | 'loading' | 'success' | 'error'
 */
export function useSendInscription() {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const send = async ({ prenom, nom, email, formation, date = '', lieu = '' }) => {
    if (!prenom || !nom || !email || !formation) {
      setError('Champs obligatoires manquants (prenom, nom, email, formation)');
      setStatus('error');
      return false;
    }

    if (!isValidEmail(email)) {
      setError('Adresse email invalide');
      setStatus('error');
      return false;
    }

    setError('');
    setStatus('loading');

    try {
      const res = await fetch('/api/send-inscription.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prenom, nom, email, formation, date, lieu }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Erreur lors de l'envoi");
      }

      setStatus('success');
      return true;
    } catch (err) {
      setError(err.message || 'Erreur réseau');
      setStatus('error');
      return false;
    }
  };

  const reset = () => {
    setStatus('idle');
    setError('');
  };

  return { send, status, error, reset };
}
