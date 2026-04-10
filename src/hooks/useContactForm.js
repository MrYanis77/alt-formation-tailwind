import { useState } from 'react';
import { contactData } from '../data/contact';

const initialState = {
  nom: '', prenom: '', email: '', telephone: '', sujet: '', message: '', honeypot: ''
};

export function useContactForm() {
  const [fields, setFields] = useState(initialState);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [error, setError] = useState('');

  // Note : Avec une API d'envoi silencieux (hors mailto), l'e-mail de destination 
  // est généralement lié et sécurisé par la clé d'accès (Access Key) pour éviter le piratage.
  const emailItem = contactData?.coordonnees?.items?.find(item => item.type === 'Email');
  const destinataireAffichage = emailItem ? emailItem.valeur : 'formations@alt-rh.com';

  const handleChange = (e) => {
    setFields(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const sanitizeInput = (str) => {
    if (!str) return '';
    return str.replace(/[<>"'&]/g, (match) => {
      const escape = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '&': '&amp;' };
      return escape[match];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nom, prenom, email, telephone, sujet, message, honeypot } = fields;

    // 1. Anti-spam (Honeypot)
    if (honeypot !== '') {
      setError('Activité suspecte détectée.');
      setStatus('error');
      return;
    }

    // 2. Validation basique
    if (!nom.trim() || !prenom.trim() || !email.trim() || !message.trim()) {
      setError('Veuillez remplir tous les champs obligatoires.');
      setStatus('error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Adresse e-mail invalide.');
      setStatus('error');
      return;
    }

    setError('');
    setStatus('loading'); // On déclenche l'UI de chargement (le spinner)

    // 3. Sanitization
    const sanitizedData = {
      nom: sanitizeInput(nom),
      prenom: sanitizeInput(prenom),
      email: sanitizeInput(email),
      telephone: sanitizeInput(telephone),
      sujet: sanitizeInput(sujet || 'Contact site web'),
      message: sanitizeInput(message)
    };

    // 4. Envoi automatique et invisible en arrière-plan via API Web3Forms (Excellente alternative)
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          // -> IL FAUT REMPLACER CETTE CLÉ PAR LA VÔTRE (voir la réponse de l'assistant) <-
          access_key: "VOTRE_CLE_WEB3FORMS", 
          
          subject: `Nouveau message depuis le site - ${sanitizedData.sujet}`,
          from_name: `${sanitizedData.prenom} ${sanitizedData.nom}`,
          ...sanitizedData
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus('success');
        setFields(initialState);
      } else {
        throw new Error(result.message || "Erreur serveur lors de l'envoi");
      }
    } catch(err) {
      console.error("Erreur Fetch:", err);
      setStatus('error');
      setError("Désolé, une erreur est survenue lors de l'envoi du message.");
    }
  };

  const resetStatus = () => setStatus('idle');

  return {
    fields,
    status,
    error,
    handleChange,
    handleSubmit,
    resetStatus
  };
}
