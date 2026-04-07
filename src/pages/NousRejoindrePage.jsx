import React, { useState } from 'react';
import Hero from '../components/Hero/Hero';
import InfoGrid from '../components/Infos/InfoGrid';
import DetailHeader from '../components/Card/CardJob'; 
import AdvantageCard from '../components/AdvantageCard';
import { Heart, TrendingUp, Target } from "lucide-react";

// Importation des données
import * as CollabData from '../data/collaborateur';
import * as FormData from '../data/formateur';
import Breadcrumb from '../components/Breadcrumb';

export default function NousRejoindre() {
  const [view, setView] = useState('collaborateur');

  const currentData = view === 'collaborateur' ? CollabData : FormData;
  
  const currentOffres = view === 'collaborateur' 
    ? CollabData.offresOuvertes 
    : FormData.offresOuvertesFormateurs;

  const breadcrumb = [
    { label: 'Accueil', to: '/' },
    { label: 'Recrutements' }
  ];

  return (
    <div className="bg-white min-h-screen antialiased">

      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Nous-rejoindre' }]} />
      
      {/* 1. HERO - Taille réduite pour matcher la home */}
      <Hero 
        title={view === 'collaborateur' ? CollabData.heroRecrutement?.titre : FormData.heroFormateur?.titre} 
        subtitle="Découvrez nos opportunités et rejoignez une équipe d'experts passionnés."
        breadcrumbItems={breadcrumb}
      />

      {/* 2. TOGGLE CATEGORIES */}
      <section className="py-10 bg-gray-50 border-b border-border">
        <div className="max-w-[1100px] mx-auto text-center px-6">
          <div className="flex bg-white p-1.5 rounded-full shadow-sm w-fit mx-auto border border-gray-200">
            <button
              onClick={() => setView('collaborateur')}
              className={`px-8 md:px-10 py-3 rounded-full font-bold transition-all duration-300 cursor-pointer ${
                view === 'collaborateur' ? 'bg-orange text-white shadow-md' : 'text-gray-500 hover:text-navy'
              }`}
            >
              Collaborateur
            </button>
            <button
              onClick={() => setView('formateur')}
              className={`px-8 md:px-10 py-3 rounded-full font-bold transition-all duration-300 cursor-pointer ${
                view === 'formateur' ? 'bg-[#1E2F47] text-white shadow-md' : 'text-gray-500 hover:text-navy'
              }`}
            >
              Formateur
            </button>
          </div>
        </div>
      </section>

      {/* 3. POURQUOI NOUS REJOINDRE - Format compact py-[70px] */}
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

      {/* 4. NOS AVANTAGES - Design Grille Colorée */}
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

      {/* 5. OFFRES OUVERTES */}
      <section className="py-[70px] px-6 bg-white">
        <div className="max-w-[900px] mx-auto">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-2xl md:text-[32px] font-extrabold text-[#1E2F47] mb-2 uppercase">{currentOffres.titre}</h2>
            <p className="text-orange font-bold">{currentOffres.compteur}</p>
          </div>

          <div className="space-y-4">
            {currentOffres.list.map((offre) => (
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

      {/* 6. SECTION ÉQUIPE - Format côte à côte */}
      <section className="py-[70px] px-6 bg-gray-50 border-t border-border">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div>
            <h2 className="text-[32px] font-extrabold text-[#1E2F47] mb-6 leading-tight uppercase">
              {currentData.sectionEquipe.titre}
            </h2>
            
            <div className="space-y-4 mb-10">
              <p className="text-muted text-[15px] leading-relaxed">
                {currentData.sectionEquipe.paragraphe1}
              </p>
              <p className="text-muted text-[15px] leading-relaxed">
                {currentData.sectionEquipe.paragraphe2}
              </p>
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

      {/* 7. CTA FINAL - Bleu Marine */}
      <section className="py-20 px-6 bg-navy text-center text-white">
        <div className="max-w-[700px] mx-auto">
          <h2 className="text-2xl md:text-[34px] font-extrabold mb-4 uppercase">
            Prêt(e) à nous rejoindre ?
          </h2>
          <p className="text-[15px] opacity-80 mb-10 leading-relaxed">
            Envoyez-nous votre candidature et faites partie de l'aventure ALT FORMATIONS.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-orange px-10 py-4 text-sm shadow-xl hover:-translate-y-1 transition-all">
              <a href="./contact">Postuler maintenant</a>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}