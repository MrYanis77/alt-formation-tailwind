import React from 'react';
import Breadcrumb from '../components/Breadcrumb';
import LegalArticle from '../components/Textes/LegalArticle';
import legalsData from '../data/json/legals.json';

const { articles } = legalsData.politiqueConfidentialite;

export default function PolitiqueConfidentialite() {
  return (
    <div className="bg-white min-h-screen font-body text-content-muted antialiased">
      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Confidentialité' }]} />

      <main className="py-20 px-6 max-w-[900px] mx-auto text-left">
        
        <div className="space-y-16">
          {articles.map((section, index) => (
            <LegalArticle 
              key={index}
              num={`Chapitre 0${index + 1}`}
              titre={section.titre}
              contenu={section.contenu}
              list={section.list}
            />
          ))}
        </div>

        <div className="mt-24 pt-8 border-t border-gray-100 text-tiny text-center opacity-60 uppercase tracking-widest leading-loose">
          ALT–RH CONSULTING — SAS AU CAPITAL DE 200 000 € — RCS MEAUX 811 698 919
        </div>
      </main>
    </div>
  );
}