import React from 'react';
import Breadcrumb from '../components/Breadcrumb';
import Hero from '../components/Hero/Hero';
import { hero, contactData } from '../data/contact';
import ContactForm from '../components/Form/ContactForm';

export default function ContactPage() {
  const { coordonnees, horaires, formulaire } = contactData;

  return (
    <div className="bg-white min-h-screen">

      {/* 2. HERO SECTION */}
      <Hero
        title={hero.titre}
        subtitle={hero.sousTitre}
        video={hero.video}
      />

      {/* 1. BREADCRUMB */}
      <Breadcrumb
        items={[{ label: 'Accueil', to: '/' }, { label: 'Contact' }]}
      />

      {/* 3. MAIN CONTENT (Infos + Formulaire) */}
      <main className="max-w-container-3xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row gap-16">

        {/* Colonne Gauche : Infos & Horaires */}
        <div className="w-full md:w-1/3">
          <h2 className="text-primary font-bold text-[24px] mb-8">{coordonnees.titre}</h2>
          <div className="flex flex-col gap-8 mb-12">
            {coordonnees.items.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="font-bold text-primary text-base">{item.type}</p>
                  {/* L'ajout de whitespace-pre-line permet de gérer le retour à la ligne proprement */}
                  <p className="text-content-muted text-medium whitespace-pre-line">
                    {item.valeur}
                  </p>
                </div>
              </div>
            ))}
          </div>


          <hr className="border-gray-100 mb-8" />

          <h3 className="text-primary font-bold text-[20px] mb-6">{horaires.titre}</h3>
          <ul className="space-y-3">
            {horaires.jours.map((item, index) => (
              <li key={index} className="text-medium text-content-muted">
                <span className="font-medium">{item.label} :</span> {item.heures}
              </li>
            ))}
          </ul>
        </div>

        {/* Colonne Droite : Formulaire */}
        <div className="w-full md:w-2/3">
          <ContactForm variant="page" title={formulaire.titre} />
        </div>
      </main>
    </div>
  );
}