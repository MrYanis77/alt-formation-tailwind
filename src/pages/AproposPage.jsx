import React from 'react';
import Navbar from '../components/Navbar';
import Breadcrumb from '../components/Breadcrumb';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import { hero, notreHistoire, nosValeurs, certificationsAgrements } from '../data/apropos';

export default function AproposPage() {
  return (
    <div className="bg-white min-h-screen">
      <Breadcrumb
        items={[{ label: 'Accueil', to: '/' }, { label: 'À propos' }]}
      />
      <Hero
        title={hero.titre}
        subtitle={hero.sousTitre}
      />

      <main className="py-[60px] px-6 max-w-[1100px] mx-auto flex flex-col gap-8" id="main-content">
        
        {/* ======== BLOC 1 : NOTRE HISTOIRE ======== */}
        <section className="bg-white border border-gray-100 rounded-xl p-10 md:p-12 shadow-sm">
          <h2 className="font-heading text-[28px] font-bold text-navy mb-8">
            {notreHistoire.titre}
          </h2>
          <div className="flex flex-col gap-6">
            {notreHistoire.contenu.map((paragraph, i) => (
              <p key={i} className="text-[15px] text-[#444] leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* ======== BLOC 2 : NOS VALEURS ======== */}
        <section className="bg-[#fcfcfc] border border-orange rounded-xl p-10 md:p-12 shadow-sm">
          <h2 className="font-heading text-[28px] font-bold text-navy mb-10 text-center">
            {nosValeurs.titre}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {nosValeurs.items.map((valeur, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                {/* Petit accent visuel orange comme sur la maquette */}
                <div className="w-12 h-1 bg-orange mb-6 rounded-full" />
                <h4 className="font-heading text-[18px] font-bold text-navy mb-4">
                  {valeur.nom}
                </h4>
                <p className="text-[14px] text-[#555] leading-relaxed">
                  {valeur.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ======== BLOC 3 : CERTIFICATIONS & AGREMENTS ======== */}
        <section className="bg-white border border-gray-100 rounded-xl p-10 md:p-12 shadow-sm">
          <h2 className="font-heading text-[28px] font-bold text-navy mb-10">
            {certificationsAgrements.titre}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {certificationsAgrements.items.map((cert, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <span className="text-orange font-bold text-2xl leading-none mt-[-2px]">•</span>
                <div>
                  <h4 className="font-heading text-[16px] font-bold text-navy mb-2">
                    {cert.nom}
                  </h4>
                  <p className="text-[14px] text-[#555] leading-relaxed">
                    {cert.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* ======== SECTION CTA FINAL ======== */}
      <section className="bg-[#f9fafb] py-[80px] px-6 text-center">
        <h2 className="font-heading text-[32px] font-bold text-navy mb-4">
          Rejoingnez l'aventure
        </h2>
        <p className="text-[#666] text-[16px] mb-10">
          Vous êtes formateur expert ou passionné par la pédagogie ? Nous recrutons régulièrement de nouveaux talents pour renforcer notre équipe.
        </p>
        <a 
          href="#contact" 
          className="inline-block bg-orange hover:bg-orange-dark text-white px-12 py-4 rounded-lg font-heading text-[16px] font-bold transition-all no-underline shadow-md"
        >
          Voir nos offres d'emploi
        </a>
      </section>

    </div>
  );
}