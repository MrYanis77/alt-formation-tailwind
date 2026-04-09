import React from 'react';
import Breadcrumb from '../components/Breadcrumb';
import Hero from '../components/Hero/Hero';
import { hero, contactData } from '../data/contact';

export default function ContactPage() {
  const { coordonnees, horaires, formulaire } = contactData;

  return (
    <div className="bg-white min-h-screen">

      {/* 2. HERO SECTION */}
      <Hero
        title={hero.titre}
        subtitle={hero.sousTitre}
      />

      {/* 1. BREADCRUMB */}
      <Breadcrumb
        items={[{ label: 'Accueil', to: '/' }, { label: 'Contact' }]}
      />

      {/* 3. MAIN CONTENT (Infos + Formulaire) */}
      <main className="max-w-[1100px] mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row gap-16">

        {/* Colonne Gauche : Infos & Horaires */}
        <div className="w-full md:w-1/3">
          <h2 className="text-navy font-bold text-[24px] mb-8">{coordonnees.titre}</h2>

          <div className="flex flex-col gap-8 mb-12">
            {coordonnees.items.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-orange/10 flex items-center justify-center text-orange shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="font-bold text-navy text-[16px]">{item.type}</p>
                  <p className="text-[#555] text-[15px]">{item.valeur}</p>
                </div>
              </div>
            ))}
          </div>

          <hr className="border-gray-100 mb-8" />

          <h3 className="text-navy font-bold text-[20px] mb-6">{horaires.titre}</h3>
          <ul className="space-y-3">
            {horaires.jours.map((item, index) => (
              <li key={index} className="text-[15px] text-[#555]">
                <span className="font-medium">{item.label} :</span> {item.heures}
              </li>
            ))}
          </ul>
        </div>

        {/* Colonne Droite : Formulaire */}
        <div className="w-full md:w-2/3">
          <h2 className="text-navy font-bold text-[24px] mb-8">{formulaire.titre}</h2>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-navy">{formulaire.champs.nom}</label>
              <input type="text" className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-orange transition-colors" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-navy">{formulaire.champs.prenom}</label>
              <input type="text" className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-orange transition-colors" />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-[14px] font-medium text-navy">{formulaire.champs.email}</label>
              <input type="email" className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-orange transition-colors" />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-[14px] font-medium text-navy">{formulaire.champs.telephone}</label>
              <input type="tel" className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-orange transition-colors" />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-[14px] font-medium text-navy">{formulaire.champs.sujet}</label>
              <input type="text" className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-orange transition-colors" />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-[14px] font-medium text-navy">{formulaire.champs.message}</label>
              <textarea rows="6" className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-orange transition-colors resize-none"></textarea>
            </div>

            <div className="md:col-span-2 mt-4">
              <button type="submit" className="w-full bg-orange hover:bg-orange-dark text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-orange/20">
                {formulaire.boutonLabel}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}