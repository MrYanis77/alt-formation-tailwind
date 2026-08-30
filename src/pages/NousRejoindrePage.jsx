import React, { useState } from 'react';
import Hero from '../components/Hero/Hero';
import InfoGrid from '../components/Infos/InfoGrid';
import CardJob from '../components/Card/CardJob';
import AdvantageCard from '../components/Card/AdvantageCard';
import Breadcrumb from '../components/Breadcrumb';
import CallToAction from '../components/CallToAction';
import { dataNousRejoindre } from '../data/nous-rejoindre';
import { usePublicCareers } from '../features/careers/hooks/usePublicCareers';

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
  const [view, setView] = useState('collaborateur');
  const { offersByDepartment, loading, error, fromDatabase } = usePublicCareers();

  const currentData = dataNousRejoindre[view];
  const offers = offersByDepartment[view] ?? [];

  return (
    <div className="bg-surface min-h-screen antialiased">
      <Hero
        title={currentData.hero.titre}
        subtitle={currentData.hero.sousTitre}
        video={currentData.hero.video}
      />

      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Nous rejoindre' }]} />

      <section className="py-6 bg-surface-soft border-b border-border">
        <div className="max-w-container-3xl mx-auto text-center px-6">
          <div className="flex bg-white p-1 rounded-full shadow-sm w-fit mx-auto border border-border">
            <button
              type="button"
              onClick={() => setView('collaborateur')}
              className={`px-5 md:px-6 py-2 text-sm rounded-full font-bold transition-all duration-300 cursor-pointer ${
                view === 'collaborateur' ? 'bg-accent text-white shadow-md' : 'text-content-muted hover:text-primary'
              }`}
            >
              Collaborateurs
            </button>
            <button
              type="button"
              onClick={() => setView('formateur')}
              className={`px-5 md:px-6 py-2 text-sm rounded-full font-bold transition-all duration-300 cursor-pointer ${
                view === 'formateur' ? 'bg-primary text-white shadow-md' : 'text-content-muted hover:text-primary'
              }`}
            >
              Formateurs
            </button>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 bg-surface">
        <div className="max-w-container-3xl mx-auto text-center">
          <h2 className="text-primary text-xl md:text-2xl font-extrabold mb-4 uppercase tracking-wider">
            {currentData.pourquoiNousRejoindre.titre}
          </h2>
          <p className="text-content-muted text-sm md:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            {currentData.pourquoiNousRejoindre.sousTitre}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {currentData.pourquoiNousRejoindre.valeurs.map((valeur) => {
              const icons = { 1: Heart, 2: TrendingUp, 3: Target };
              const IconComponent = icons[valeur.id] || Target;
              return (
                <InfoGrid
                  key={valeur.id}
                  titre={valeur.titre}
                  description={valeur.description}
                  icon={IconComponent}
                  variant={valeur.id === 2 ? 'navy' : 'orange'}
                  compact
                />
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 px-6 bg-surface-soft border-y border-border">
        <div className="max-w-container-3xl mx-auto text-center">
          <h2 className="text-primary text-xl md:text-2xl font-extrabold text-center mb-8 uppercase tracking-wider">
            Nos avantages
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {currentData.avantages.map((avantage, index) => (
              <AdvantageCard
                key={avantage.id}
                label={avantage.label}
                iconeName={avantage.icone}
                index={index}
                compact
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-6 bg-surface">
        <div className="max-w-container-lg mx-auto">
          <div className="mb-8 text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border pb-4">
            <h2 className="text-xl md:text-2xl font-extrabold text-primary uppercase tracking-wider">
              {currentData.offres.titre}
            </h2>
            <div className="inline-flex items-center gap-2">
              <span className="text-content-muted font-bold text-sm">Postes disponibles :</span>
              <span className="text-accent font-extrabold text-base bg-accent/10 px-3 py-1 rounded-full">
                {offers.length}
              </span>
            </div>
          </div>

          {loading ? (
            <p className="text-content-muted text-sm mb-4">Chargement des offres depuis la base…</p>
          ) : null}

          {error ? (
            <p className="text-amber-700 text-sm mb-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
              Affichage des offres locales (BDD indisponible : {error})
            </p>
          ) : null}

          {fromDatabase ? (
            <p className="text-green-700 text-xs mb-4">Offres synchronisées depuis la base de données.</p>
          ) : null}

          <div className="space-y-3">
            {offers.map((offre) => (
              <CardJob
                key={offre.id ?? offre.slug ?? offre.poste}
                titre={offre.poste}
                type={offre.type}
                lieu={offre.lieu}
                date={offre.date}
                applyTo={offre.slug ? `/nous-rejoindre/offre/${offre.slug}` : '/nous-rejoindre'}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-6 bg-surface-soft border-t border-border">
        <div className="max-w-container-3xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-primary mb-5 leading-tight uppercase tracking-wider">
              {currentData.sectionEquipe.titre}
            </h2>
            <div className="space-y-4 mb-8">
              <p className="text-content-muted text-sm md:text-base leading-relaxed">{currentData.sectionEquipe.paragraphe1}</p>
              <p className="text-content-muted text-sm md:text-base leading-relaxed">{currentData.sectionEquipe.paragraphe2}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              {currentData.sectionEquipe.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-white p-4 rounded-card border border-border shadow-sm text-center transform transition-transform hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="text-2xl md:text-3xl font-extrabold text-accent mb-1">{stat.valeur}</div>
                  <div className="text-primary font-bold text-xs uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-section overflow-hidden h-[260px] xl:h-[320px] shadow-lg border-4 border-white group">
            <img
              src="/assets/images/rejoindre.jpg"
              alt="Team Alt RH Formations"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>
      </section>

      <CallToAction
        variante="sombre"
        titre="Besoin de plus d'informations ?"
        sousTitre="Consultez notre FAQ ou contactez-nous directement pour toute question sur le processus de recrutement."
        texteBouton="Voir la F.A.Q"
        lienBouton="/faq"
      />
    </div>
  );
}
