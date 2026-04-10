import React from 'react';
import { Link } from 'react-router-dom'; // Import de Link
import FormUser from '../components/Form/FormUser';

export default function InscriptionPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-[#002D4C] tracking-tight uppercase">ALT FORMATIONS</h1>
        <p className="text-gray-500 mt-2 font-medium">Créez votre compte pour accéder à nos formations</p>
      </div>

      <div className="w-full max-w-[550px] bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-50 p-8 md:p-10">
        <FormUser type="inscription" />
      </div>

      <div className="mt-8 text-center space-y-4 text-sm">
        <p className="text-gray-600 font-medium">
          Vous avez déjà un compte ?{' '}
          <Link
            to="/connexion"
            className="text-[#F39233] font-bold no-underline hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}