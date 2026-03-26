import React from 'react';
import FormUser from '../components/FormUser';

export default function ConnexionPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-[#002D4C] tracking-tight uppercase">ALT FORMATIONS</h1>
        <p className="text-gray-500 mt-2 font-medium text-lg">Bon retour parmi nous !</p>
      </div>

      <div className="w-full max-w-[460px] bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-50 p-8 md:p-10">
        <FormUser type="connexion" />
      </div>

      <p className="mt-8 text-gray-600 text-sm font-medium text-center">
        Pas encore de compte ? <span className="text-[#F39233] font-bold cursor-pointer hover:underline">S'inscrire gratuitement</span>
      </p>
    </div>
  );
}