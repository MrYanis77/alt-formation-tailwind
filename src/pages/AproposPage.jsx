import React from 'react';
import Navbar from '../components/Navbar';
import Breadcrumb from '../components/Breadcrumb';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import TexteSection from '../components/TexteSection'; // Import du composant flexible
import { hero, notreHistoire, nosValeurs, certificationsAgrements } from '../data/apropos';

export default function AproposPage() {
  return (
    <div className="bg-white min-h-screen font-body antialiased">
      
      <Breadcrumb
        items={[{ label: 'Accueil', to: '/' }, { label: 'À propos' }]}
      />
      
      <Hero
        title={hero.titre}
        subtitle={hero.sousTitre}
      />

      <main id="main-content">
        
        {/* ======== BLOC 1 : NOTRE HISTOIRE (TexteSection) ======== */}
        {/* Ce composant gère l'image de manière conditionnelle et applique la barre orange */}
        <TexteSection data={notreHistoire} imageRight={true} />

        <div className="max-w-[1100px] mx-auto px-6 flex flex-col gap-16 pb-24">
          
          {/* ======== BLOC 2 : NOS VALEURS ======== */}
          <section className="bg-[#fcfcfc] border border-orange/30 rounded-3xl p-10 md:p-16 shadow-sm">
            <h2 className="font-heading text-[32px] font-black text-navy mb-12 text-center uppercase tracking-tight">
              {nosValeurs.titre}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {nosValeurs.items.map((valeur, idx) => (
                <div key={idx} className="flex flex-col items-center text-center group">
                  <div className="w-12 h-1 bg-orange mb-6 rounded-full transition-all group-hover:w-20" />
                  <h4 className="font-heading text-[20px] font-bold text-navy mb-4 uppercase">
                    {valeur.nom}
                  </h4>
                  <p className="text-[15px] text-muted leading-relaxed">
                    {valeur.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ======== BLOC 3 : CERTIFICATIONS & AGREMENTS ======== */}
          <section className="bg-white border border-gray-100 rounded-3xl p-10 md:p-16 shadow-sm">
            <div className="flex items-center mb-10">
              <div className="w-[6px] h-8 bg-orange rounded-full mr-4"></div>
              <h2 className="font-heading text-[28px] font-black text-navy uppercase tracking-tight">
                {certificationsAgrements.titre}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {certificationsAgrements.items.map((cert, idx) => (
                <div key={idx} className="flex items-start gap-5 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <span className="text-orange font-bold text-2xl leading-none">•</span>
                  <div>
                    <h4 className="font-heading text-[17px] font-bold text-navy mb-2 uppercase">
                      {cert.nom}
                    </h4>
                    <p className="text-[14px] text-muted leading-relaxed">
                      {cert.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* ======== SECTION CTA FINAL ======== */}
      <section className="bg-gray-50 py-24 px-6 text-center border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-[36px] font-black text-navy mb-6 uppercase tracking-tight">
            Rejoignez l'aventure
          </h2>
          <p className="text-muted text-lg mb-10 leading-relaxed">
            Vous êtes formateur expert ou passionné par la pédagogie ? Nous recrutons régulièrement de nouveaux talents pour renforcer notre équipe.
          </p>
          <a 
            href="/nous-rejoindre" 
            className="btn-orange inline-block px-12 py-5 shadow-lg hover:-translate-y-1"
          >
            Voir nos offres d'emploi
          </a>
        </div>
      </section>

    
    </div>
  );
}