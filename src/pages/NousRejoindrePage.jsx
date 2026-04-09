import React, { useState } from 'react';
import Hero from '../components/Hero/Hero';
import InfoGrid from '../components/Infos/InfoGrid';
import DetailHeader from '../components/Card/CardJob';
import AdvantageCard from '../components/Card/AdvantageCard';
import Breadcrumb from '../components/Breadcrumb';

// Import unique des données fusionnées
import { dataNousRejoindre } from '../data/nous-rejoindre';

// Icônes SVG
const Heart = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
);
const TrendingUp = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
);
const Target = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
);

export default function NousRejoindre() {
  const [view, setView] = useState('collaborateur'); // 'collaborateur' ou 'formateur'

  // On récupère les données selon la vue active
  const currentData = dataNousRejoindre[view];

  return (
    <div className="bg-white min-h-screen antialiased">
      {/* 1. HERO avec Vidéo dynamique */}
      <Hero
        title={currentData.hero.titre}
        subtitle={currentData.hero.sousTitre}
        video={currentData.hero.video}
      />

      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Nous rejoindre' }]} />

      {/* 2. POURQUOI NOUS REJOINDRE */}
      <section className="py-[70px] px-6 bg-white">
        <div className="max-w-[1100px] mx-auto text-center">
          <h2 className="text-[#1E2F47] text-2xl md:text-[32px] font-extrabold mb-6 uppercase tracking-wider">
            {currentData.pourquoiNousRejoindre.titre}
          </h2>
          <p className="text-muted text-[15px] max-w-[750px] mx-auto mb-16 leading-relaxed">
            {currentData.pourquoiNousRejoindre.sousTitre}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {currentData.pourquoiNousRejoindre.valeurs.map((valeur) => {
              const icons = { 1: Heart, 2: TrendingUp, 3: Target };
              const IconComponent = icons[valeur.id] || Target;
              return (
                <InfoGrid
                  key={valeur.id}
                  titre={valeur.titre}
                  description={valeur.description}
                  icon={IconComponent}
                  variant={valeur.id === 2 ? "navy" : "orange"}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. NOS AVANTAGES */}
      <section className="py-[70px] px-6 bg-gray-50 border-y border-border">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-[#1E2F47] text-2xl md:text-[32px] font-extrabold text-center mb-12 uppercase tracking-wider">
            Nos avantages
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {currentData.avantages.map((avantage, index) => (
              <AdvantageCard
                key={avantage.id}
                label={avantage.label}
                iconeName={avantage.icone}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* TOGGLE CATEGORIES */}
      <section className="py-10 bg-gray-50 border-b border-border">
        <div className="max-w-[1100px] mx-auto text-center px-6">
          <div className="flex bg-white p-1.5 rounded-full shadow-sm w-fit mx-auto border border-gray-200">
            <button
              onClick={() => setView('collaborateur')}
              className={`px-8 md:px-10 py-3 rounded-full font-bold transition-all duration-300 cursor-pointer ${view === 'collaborateur' ? 'bg-orange text-white shadow-md' : 'text-gray-500 hover:text-navy'
                }`}
            >
              Collaborateur
            </button>
            <button
              onClick={() => setView('formateur')}
              className={`px-8 md:px-10 py-3 rounded-full font-bold transition-all duration-300 cursor-pointer ${view === 'formateur' ? 'bg-[#1E2F47] text-white shadow-md' : 'text-gray-500 hover:text-navy'
                }`}
            >
              Formateur
            </button>
          </div>
        </div>
      </section>

      {/* 4. OFFRES OUVERTES */}
      <section className="py-[70px] px-6 bg-white">
        <div className="max-w-[900px] mx-auto">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-2xl md:text-[32px] font-extrabold text-[#1E2F47] mb-2 uppercase">
              {currentData.offres.titre}
            </h2>
            <p className="text-orange font-bold">{currentData.offres.compteur}</p>
          </div>

          <div className="space-y-4">
            {currentData.offres.list.map((offre) => (
              <DetailHeader
                key={offre.id}
                titre={offre.poste}
                code={offre.type}
                duree={offre.lieu}
                rythme={`Publié le ${offre.date}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. SECTION ÉQUIPE */}
      <section className="py-[70px] px-6 bg-gray-50 border-t border-border">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-[32px] font-extrabold text-[#1E2F47] mb-6 leading-tight uppercase">
              {currentData.sectionEquipe.titre}
            </h2>
            <div className="space-y-4 mb-10">
              <p className="text-muted text-[15px] leading-relaxed">{currentData.sectionEquipe.paragraphe1}</p>
              <p className="text-muted text-[15px] leading-relaxed">{currentData.sectionEquipe.paragraphe2}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              {currentData.sectionEquipe.stats.map((stat, idx) => (
                <div key={idx} className="flex-1 bg-white p-6 rounded-2xl border border-border shadow-sm text-center">
                  <div className="text-3xl font-extrabold text-orange mb-1">{stat.valeur}</div>
                  <div className="text-navy font-bold text-sm uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[24px] overflow-hidden h-[400px] shadow-lg border-4 border-white">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80"
              alt="Team ALT FORMATIONS"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 6. CTA FINAL */}
      <section className="py-20 px-6 bg-navy text-center text-white">
        <div className="max-w-[700px] mx-auto">
          <h2 className="text-2xl md:text-[34px] font-extrabold mb-4 uppercase">
            Prêt(e) à nous rejoindre ?
          </h2>
          <p className="text-[15px] opacity-80 mb-10 leading-relaxed">
            Envoyez-nous votre candidature et faites partie de l'aventure ALT FORMATIONS.
          </p>
          <div className="flex justify-center">
            <a
              href="/contact"
              className="inline-block bg-orange hover:bg-orange-dark text-white px-10 py-4 rounded-lg font-bold shadow-xl transition-all hover:-translate-y-1 uppercase text-sm no-underline"
            >
              Postuler maintenant
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}