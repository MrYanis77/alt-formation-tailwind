import React from 'react';
import Breadcrumb from '../components/Breadcrumb';
import Hero from '../components/Hero/Hero';
import TexteSection from '../components/Textes/TexteSection'; // Import du composant flexible
import { hero, notreHistoire, nosValeurs, certificationsAgrements } from '../data/apropos';
import CallToAction from '../components/CallToAction';

export default function AproposPage() {
  return (
    <div className="bg-white min-h-screen font-body antialiased">
      <Hero
        title={hero.titre}
        subtitle={hero.sousTitre}
        image="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1200"
      />
      <Breadcrumb
        items={[{ label: 'Accueil', to: '/' }, { label: 'À propos' }]}
      />

      <main id="main-content">

        {/* ======== BLOC 1 : NOTRE HISTOIRE (TexteSection) ======== */}
        {/* Ce composant gère l'image de manière conditionnelle et applique la barre orange */}
        <TexteSection data={notreHistoire} imageRight={true} />

        <div className="max-w-[1100px] mx-auto px-6 flex flex-col gap-16 pb-24">

          {/* ======== BLOC 2 : NOS VALEURS ======== */}
          <section className="bg-surface-alt border border-accent/30 rounded-3xl p-10 md:p-16 shadow-sm">
            <h2 className="font-heading text-h1 font-black text-primary mb-12 text-center uppercase tracking-tight">
              {nosValeurs.titre}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {nosValeurs.items.map((valeur, idx) => (
                <div key={idx} className="flex flex-col items-center text-center group">
                  <div className="w-12 h-1 bg-accent mb-6 rounded-full transition-all group-hover:w-20" />
                  <h4 className="font-heading text-[20px] font-bold text-primary mb-4 uppercase">
                    {valeur.nom}
                  </h4>
                  <p className="text-medium text-content-muted leading-relaxed">
                    {valeur.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ======== BLOC 3 : CERTIFICATIONS & AGREMENTS ======== */}
          <section className="bg-white border border-gray-100 rounded-3xl p-10 md:p-16 shadow-sm">
            <div className="flex items-center mb-10">
              <div className="w-[6px] h-8 bg-accent rounded-full mr-4"></div>
              <h2 className="font-heading text-h2 font-black text-primary uppercase tracking-tight">
                {certificationsAgrements.titre}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {certificationsAgrements.items.map((cert, idx) => (
                <div key={idx} className="flex items-start gap-5 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <span className="text-accent font-bold text-2xl leading-none">•</span>
                  <div>
                    <h4 className="font-heading text-[17px] font-bold text-primary mb-2 uppercase">
                      {cert.nom}
                    </h4>
                    <p className="text-sm text-content-muted leading-relaxed">
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
      <CallToAction
        variante="claire"
        titre="Rejoignez l'aventure"
        sousTitre="Vous êtes formateur expert ou passionné par la pédagogie ? Nous recrutons régulièrement de nouveaux talents pour renforcer notre équipe."
        texteBouton="Voir nos offres d'emploi"
        lienBouton="/nous-rejoindre"
      />


    </div>
  );
}