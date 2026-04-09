import React, { useState } from 'react';

export default function FormUser({ type = 'connexion' }) {
  const [showPass, setShowPass] = useState(false);
  const isInscription = type === 'inscription';

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
      {/* Champs Inscription (Prénom / Nom) */}
      {isInscription && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 text-left">
            <label className="text-sm font-bold text-[#002D4C]">Prénom *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
              <input type="text" placeholder="Jean" className="w-full border border-gray-200 pl-11 py-3 rounded-xl focus:border-[#F39233] outline-none text-sm transition-all" />
            </div>
          </div>
          <div className="space-y-1.5 text-left">
            <label className="text-sm font-bold text-[#002D4C]">Nom *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
              <input type="text" placeholder="Dupont" className="w-full border border-gray-200 pl-11 py-3 rounded-xl focus:border-[#F39233] outline-none text-sm transition-all" />
            </div>
          </div>
        </div>
      )}

      {/* Email */}
      <div className="space-y-1.5 text-left">
        <label className="text-sm font-bold text-[#002D4C]">Adresse email {isInscription && '*'}</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">✉️</span>
          <input type="email" placeholder="nom@exemple.com" className="w-full border border-gray-200 pl-11 py-3 rounded-xl focus:border-[#F39233] outline-none text-sm transition-all" />
        </div>
      </div>

      {/* Téléphone (Inscription uniquement) */}
      {isInscription && (
        <div className="space-y-1.5 text-left">
          <label className="text-sm font-bold text-[#002D4C]">Téléphone *</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">📞</span>
            <input type="tel" placeholder="06 12 34 56 78" className="w-full border border-gray-200 pl-11 py-3 rounded-xl focus:border-[#F39233] outline-none text-sm transition-all" />
          </div>
        </div>
      )}

      {/* Mot de passe */}
      <div className="space-y-1.5 text-left">
        <label className="text-sm font-bold text-[#002D4C]">Mot de passe {isInscription && '*'}</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
          <input type={showPass ? "text" : "password"} placeholder="••••••••" className="w-full border border-gray-200 pl-11 pr-11 py-3 rounded-xl focus:border-[#F39233] outline-none text-sm transition-all" />
          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">👁️</button>
        </div>
        {isInscription && <p className="text-[10px] text-gray-400">Minimum 8 caractères avec majuscules, minuscules et chiffres</p>}
      </div>

      {/* Confirmation (Inscription uniquement) */}
      {isInscription && (
        <div className="space-y-1.5 text-left">
          <label className="text-sm font-bold text-[#002D4C]">Confirmer le mot de passe *</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
            <input type={showPass ? "text" : "password"} placeholder="••••••••" className="w-full border border-gray-200 pl-11 pr-11 py-3 rounded-xl focus:border-[#F39233] outline-none text-sm transition-all" />
          </div>
        </div>
      )}

      {/* Options Connexion */}
      {!isInscription && (
        <div className="flex justify-between items-center text-xs py-1">
          <label className="flex items-center gap-2 text-[#002D4C] cursor-pointer font-medium">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#F39233]" />
            Se souvenir de moi
          </label>
          <button type="button" className="text-[#F39233] font-bold hover:underline">Mot de passe oublié ?</button>
        </div>
      )}

      {/* Mentions légales */}
      {isInscription && (
        <p className="text-center text-[11px] text-gray-600 px-2 leading-relaxed">
          J'accepte les <span className="text-[#F39233] font-bold cursor-pointer">conditions générales d'utilisation</span> et la <span className="text-[#F39233] font-bold cursor-pointer">politique de confidentialité</span>
        </p>
      )}

      {/* Bouton Principal */}
      <button type="submit" className="w-full bg-[#F39233] hover:bg-[#e67e22] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-100 transition-all text-sm mt-2">
        {isInscription ? "Créer mon compte" : "Se connecter"}
      </button>

      <div className="relative flex items-center justify-center py-1">
        <div className="w-full border-t border-gray-100"></div>
        <span className="absolute bg-white px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">OU</span>
      </div>

      {/* Social Login */}
      <div className="space-y-3">
        <button type="button" className="w-full border border-gray-200 flex items-center justify-center gap-3 py-3 rounded-xl font-bold text-[#002D4C] hover:bg-gray-50 text-xs transition-colors">
          <img src="https://www.google.com/favicon.ico" alt="" className="w-3.5 h-3.5" /> 
          {isInscription ? "S'inscrire avec Google" : "Continuer avec Google"}
        </button>
        <button type="button" className="w-full bg-[#002D4C] text-white flex items-center justify-center gap-3 py-3 rounded-xl font-bold hover:bg-[#001D31] text-xs transition-colors">
          <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="" className="w-3.5 h-3.5 invert" /> 
          {isInscription ? "S'inscrire avec LinkedIn" : "Continuer avec LinkedIn"}
        </button>
      </div>
    </form>
  );
}