import React from 'react';
import Hero from '../components/Hero/Hero';
import Breadcrumb from '../components/Breadcrumb';
import CardDesc from '../components/Card/CardDesc';

// Import des données depuis ton fichier JS
import { hero, cpf, opco, poleEmploi, autresSolutions } from '../data/financement';

export default function FinancementsPage() {
  return (
    <div className="bg-white min-h-screen">
      <Breadcrumb
        items={[{ label: 'Accueil', to: '/' }, { label: 'Financements' }]}
      />
      
      <Hero
        title={hero.titre}
        subtitle={hero.sousTitre}
      />

      <main className="py-[60px] px-6 max-w-[1100px] mx-auto flex flex-col gap-8" id="main-content">
        
        {/* SECTION CPF (Highlight orange + Bouton) */}
        <CardDesc 
          title={cpf.titre}
          description={cpf.description}
          highlight={true}
          columns={[
            { label: cpf.howTo.label, items: cpf.howTo.items },
            { label: cpf.amount.label, text: cpf.amount.description }
          ]}
          cta={{ label: cpf.amount.cta, href: cpf.amount.ctaHref }}
        />

        {/* SECTION OPCO (3 colonnes) */}
        <CardDesc 
          title={opco.titre}
          description={opco.description}
          columns={opco.columns} // On passe directement le tableau columns du fichier JS
        />

        {/* SECTION POLE EMPLOI (2 colonnes) */}
        <CardDesc 
          title={poleEmploi.titre}
          description={poleEmploi.description}
          columns={poleEmploi.columns}
        />

        {/* SECTION AUTRES (3 colonnes) */}
        <CardDesc 
          title={autresSolutions.titre}
          columns={autresSolutions.columns}
        />

      </main>

      {/* CTA FINAL */}
      <section className="bg-[#f9fafb] py-[80px] px-6 text-center border-t border-gray-100">
        <h2 className="font-heading text-[32px] font-bold text-navy mb-4 uppercase">
          Besoin d'aide pour votre financement ?
        </h2>
        <p className="text-[#666] text-[16px] mb-10 max-w-2xl mx-auto">
          Nos conseillers vous accompagnent gratuitement dans le montage de votre dossier et le choix du dispositif adapté.
        </p>
        <a 
          href="/contact" 
          className="inline-block bg-orange hover:bg-orange-dark text-white px-12 py-4 rounded-lg font-heading text-[16px] font-bold transition-all no-underline shadow-md uppercase tracking-widest"
        >
          Prendre rendez-vous
        </a>
      </section>
    </div>
  );
}