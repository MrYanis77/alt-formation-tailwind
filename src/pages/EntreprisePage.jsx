import React from 'react';
import Hero from '../components/Hero/Hero';
import Breadcrumb from '../components/Breadcrumb';
import CardDesc from '../components/Card/CardDesc';
import CardGrid from '../components/Card/CardGrid'; 
import StatsSection from '../components/Stats/StatsSection';
import CallToAction from '../components/CallToAction';

// Import des données
import {
  hero,
  formationSurMesure,
  servicesComplementaires,
  recrutementAlternance,
  stats
} from '../data/entreprise';

export default function EntreprisePage() {
  return (
    <div className="bg-white min-h-screen antialiased">
      <Hero
        title={hero.titre}
        subtitle={hero.sousTitre}
        video={hero.video}
      />
      <Breadcrumb
        items={[{ label: 'Accueil', to: '/' }, { label: 'Entreprise' }]}
      />

      <main className="py-[60px] px-6 max-w-container-3xl mx-auto flex flex-col gap-12" id="main-content">

        {/* ======== 1. FORMATION SUR-MESURE ======== */}
        <CardDesc
          title={formationSurMesure.titre}
          description={formationSurMesure.description}
          columns={formationSurMesure.columns}
          isHighlight={true}
        />

        {/* ======== 2. SERVICES COMPLÉMENTAIRES (Utilisation de CardGrid) ======== */}
        <CardGrid
          services={servicesComplementaires}
          cols={2}
          variant="default"
        />


        {/* ======== 3. RECRUTEMENT EN ALTERNANCE ======== */}
        <CardDesc
          title={recrutementAlternance.titre}
          description={recrutementAlternance.description}
          columns={recrutementAlternance.steps}
        />

      </main>

      {/* ======== SECTION STATISTIQUES ======== */}
      <StatsSection stats={stats} title="Pourquoi choisir ALT FORMATIONS ?" variant="navy" />

      {/* ======== SECTION CTA FINAL ======== */}
      <CallToAction
        variante="claire"
        titre="Besoin d'un accompagnement spécifique ?"
        sousTitre="Nos experts vous proposent un audit gratuit pour identifier vos besoins en formation et recrutement."
        texteBouton="Demander un devis"
        lienBouton="/contact"
      />
    </div>
  );
}