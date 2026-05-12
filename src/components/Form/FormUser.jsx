import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function FormUser({ type = 'connexion' }) {
  const isInscription = type === 'inscription';
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    password: '',
    passwordConfirm: '',
    cgu: false,
  });

  const update = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    if (!form.email || !form.password) return 'Email et mot de passe requis';
    if (isInscription) {
      if (!form.prenom.trim() || !form.nom.trim()) return 'Prénom et nom requis';
      if (form.password.length < 8) return 'Le mot de passe doit faire au moins 8 caractères';
      if (form.password !== form.passwordConfirm) return 'Les mots de passe ne correspondent pas';
      if (!form.cgu) return "Vous devez accepter les conditions d'utilisation";
    }
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      let user;
      if (isInscription) {
        user = await register({
          prenom: form.prenom.trim(),
          nom: form.nom.trim(),
          email: form.email.trim(),
          telephone: form.telephone.trim() || null,
          password: form.password,
        });
      } else {
        user = await login(form.email.trim(), form.password);
      }

      const redirectFrom = location.state?.from;
      if (user.role === 'admin') navigate(redirectFrom || '/admin');
      else navigate(redirectFrom || '/mon-espace');
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-4 py-3 rounded-lg" role="alert">
          {error}
        </div>
      )}

      {isInscription && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 text-left">
            <label className="text-sm font-bold text-primary">Prénom *</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Jean"
                value={form.prenom}
                onChange={update('prenom')}
                required
                className="w-full border border-gray-200 pl-11 py-3 rounded-xl focus:border-accent outline-none text-sm transition-all"
              />
            </div>
          </div>
          <div className="space-y-1.5 text-left">
            <label className="text-sm font-bold text-primary">Nom *</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Dupont"
                value={form.nom}
                onChange={update('nom')}
                required
                className="w-full border border-gray-200 pl-11 py-3 rounded-xl focus:border-accent outline-none text-sm transition-all"
              />
            </div>
          </div>
        </div>
      )}

      <div className="space-y-1.5 text-left">
        <label className="text-sm font-bold text-primary">Adresse email {isInscription && '*'}</label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            placeholder="nom@exemple.com"
            value={form.email}
            onChange={update('email')}
            required
            className="w-full border border-gray-200 pl-11 py-3 rounded-xl focus:border-accent outline-none text-sm transition-all"
          />
        </div>
      </div>

      {isInscription && (
        <div className="space-y-1.5 text-left">
          <label className="text-sm font-bold text-primary">Téléphone</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              placeholder="06 12 34 56 78"
              value={form.telephone}
              onChange={update('telephone')}
              className="w-full border border-gray-200 pl-11 py-3 rounded-xl focus:border-accent outline-none text-sm transition-all"
            />
          </div>
        </div>
      )}

      <div className="space-y-1.5 text-left">
        <label className="text-sm font-bold text-primary">Mot de passe {isInscription && '*'}</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type={showPass ? 'text' : 'password'}
            placeholder="••••••••"
            value={form.password}
            onChange={update('password')}
            required
            className="w-full border border-gray-200 pl-11 pr-11 py-3 rounded-xl focus:border-accent outline-none text-sm transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label={showPass ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {isInscription && <p className="text-micro text-gray-400">Minimum 8 caractères.</p>}
      </div>

      {isInscription && (
        <div className="space-y-1.5 text-left">
          <label className="text-sm font-bold text-primary">Confirmer le mot de passe *</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.passwordConfirm}
              onChange={update('passwordConfirm')}
              required
              className="w-full border border-gray-200 pl-11 pr-11 py-3 rounded-xl focus:border-accent outline-none text-sm transition-all"
            />
          </div>
        </div>
      )}

      {!isInscription && (
        <div className="flex justify-between items-center text-xs py-1">
          <label className="flex items-center gap-2 text-primary cursor-pointer font-medium">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-accent" />
            Se souvenir de moi
          </label>
          <span className="text-gray-400 italic">Récupération à venir</span>
        </div>
      )}

      {isInscription && (
        <label className="flex items-start gap-2 text-tiny text-gray-600 px-2 leading-relaxed cursor-pointer">
          <input
            type="checkbox"
            checked={form.cgu}
            onChange={update('cgu')}
            className="mt-1 w-4 h-4 rounded border-gray-300 text-accent shrink-0"
          />
          <span>
            J'accepte les <span className="text-accent font-bold">conditions générales d'utilisation</span> et la <span className="text-accent font-bold">politique de confidentialité</span>
          </span>
        </label>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-accent hover:bg-accent-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-lg shadow-accent-100 transition-all text-sm mt-2"
      >
        {submitting
          ? (isInscription ? 'Création du compte...' : 'Connexion...')
          : (isInscription ? 'Créer mon compte' : 'Se connecter')}
      </button>
    </form>
  );
}
