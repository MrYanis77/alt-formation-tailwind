import React from 'react';
import Hero from '../components/Hero/Hero';
import Breadcrumb from '../components/Breadcrumb';
import CardDesc from '../components/Card/CardDesc';
import CardGrid from '../components/Card/CardGrid'; // Import de ton composant
import StatsSection from '../components/Stats/StatsSection';

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
        image="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1200"
      />
      <Breadcrumb
        items={[{ label: 'Accueil', to: '/' }, { label: 'Entreprise' }]}
      />

      <main className="py-[60px] px-6 max-w-[1100px] mx-auto flex flex-col gap-12" id="main-content">

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
      <section className="py-[80px] px-6 bg-white text-center">
        <div className="max-w-[700px] mx-auto">
          <h2 className="font-heading text-[32px] font-bold text-navy mb-4 uppercase">
            Besoin d'un accompagnement spécifique ?
          </h2>
          <p className="text-muted text-[16px] mb-10 leading-relaxed">
            Nos experts vous proposent un audit gratuit pour identifier vos besoins en formation et recrutement.
          </p>
          <a
            href="/contact"
            className="inline-block bg-orange hover:bg-orange-dark text-white px-12 py-4 rounded-lg font-heading text-[16px] font-bold transition-all shadow-lg no-underline uppercase tracking-wider"
          >
            Demander un devis
          </a>
        </div>
      </section>
    </div>
  );
}