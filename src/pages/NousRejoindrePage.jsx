import React, { useState } from 'react';
import Hero from '../components/Hero';
import StepItem from '../components/StepItem';
import InfoCard from '../components/InfoCard';

// Importation des données
import * as CollabData from '../data/collaborateur';
import * as FormData from '../data/formateur';

export default function NousRejoindre() {
  const [view, setView] = useState('collaborateur');

  // Sélection dynamique des données
  const currentData = view === 'collaborateur' ? CollabData : FormData;
  const currentOffres = view === 'collaborateur' ? CollabData.offresOuvertes : FormData.offresOuvertesFormateurs;

  // Configuration du breadcrumb pour le Hero
  const breadcrumb = [
    { label: 'Accueil', to: '/' },
    { label: 'Recrutements' }
  ];

  return (
    <div className="bg-white min-h-screen">
      
      {/* 1. HERO avec Breadcrumb intégré */}
      <Hero 
        title={currentData.heroRecrutement?.titre || currentData.heroFormateur?.titre} 
        subtitle="Découvrez nos opportunités et rejoignez une équipe d'experts passionnés."
        breadcrumbItems={breadcrumb}
      />

      {/* 2. SECTION SELECTEUR (Le Toggle entre les deux fichiers) */}
      <section className="py-12 bg-gray-50 border-b border-border">
        <div className="max-w-[1200px] mx-auto text-center px-6">
          <div className="flex bg-white p-1.5 rounded-full shadow-sm w-fit mx-auto border border-gray-200">
            <button
              onClick={() => setView('collaborateur')}
              className={`px-10 py-3 rounded-full font-bold transition-all duration-300 ${
                view === 'collaborateur' ? 'bg-orange text-white shadow-md' : 'text-gray-500 hover:text-navy'
              }`}
            >
              Collaborateur
            </button>
            <button
              onClick={() => setView('formateur')}
              className={`px-10 py-3 rounded-full font-bold transition-all duration-300 ${
                view === 'formateur' ? 'bg-navy text-white shadow-md' : 'text-gray-500 hover:text-navy'
              }`}
            >
              Formateur
            </button>
          </div>
        </div>
      </section>

      {/* 3. SECTION POURQUOI NOUS REJOINDRE */}
      <section className="py-20 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-4xl font-bold text-navy mb-6">
            {currentData.pourquoiNousRejoindre.titre}
          </h2>
          <p className="text-muted max-w-[800px] mx-auto mb-16 text-lg">
            {currentData.pourquoiNousRejoindre.sousTitre}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {currentData.pourquoiNousRejoindre.valeurs.map((valeur) => (
              <StepItem
                key={valeur.id}
                title={valeur.titre}
                description={valeur.description}
                variant="white"
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. SECTION OFFRES OUVERTES */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-[1000px] mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-navy mb-2">{currentOffres.titre}</h2>
              <p className="text-orange font-semibold">{currentOffres.compteur}</p>
            </div>
            <button className="btn-orange hidden md:block">Candidature spontanée</button>
          </div>

          <div className="space-y-6">
            {currentOffres.list.map((offre) => (
              <div key={offre.id} className="bg-white p-8 rounded-default border border-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-navy">{offre.poste}</h3>
                    <span className="bg-orange/10 text-orange px-3 py-1 rounded text-xs font-bold uppercase">
                      {offre.type}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-muted">
                    <span>📍 {offre.lieu}</span>
                    <span>📅 {offre.date}</span>
                  </div>
                </div>
                <button className="text-navy font-bold hover:text-orange transition-colors">
                  Voir l'offre →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SECTION STATS (InfoCard) */}
      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
           <div>
              <h2 className="text-3xl font-bold text-navy mb-6">{currentData.sectionEquipe.titre}</h2>
              <p className="text-muted mb-4">{currentData.sectionEquipe.paragraphe1}</p>
              <p className="text-muted mb-8">{currentData.sectionEquipe.paragraphe2}</p>
              <div className="flex gap-6">
                {currentData.sectionEquipe.stats.map((stat, i) => (
                  <InfoCard key={i} title={stat.valeur} subtitle={stat.label} variant={i === 0 ? "orange" : "navy"} />
                ))}
              </div>
           </div>
           <div className="rounded-default overflow-hidden h-[400px]">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80" alt="Team" className="w-full h-full object-cover" />
           </div>
        </div>
      </section>

    </div>
  );
}