import React from 'react';
import Breadcrumb from '../components/Breadcrumb';
import LegalArticle from '../components/Textes/LegalArticle';
import legalsData from '../data/json/legals.json';

const { articles } = legalsData.politiqueCookies;

export default function PolitiqueCookies() {
  return (
    <div className="bg-white min-h-screen font-body text-content-muted antialiased">
      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Politique Cookies' }]} />
      

      <main className="py-20 px-6 max-w-[900px] mx-auto text-left">
        
        <div className="space-y-16">
          {articles.map((section) => (
            <LegalArticle 
              key={section.id}
              num={`Chapitre 0${section.id}`}
              titre={section.titre}
              contenu={section.contenu}
            />
          ))}
        </div>

        {/* Note de synchronisation finale */}
        <div className="mt-24 pt-8 border-t border-gray-100 text-tiny text-center opacity-60 uppercase tracking-widest leading-loose">
          ALT–RH CONSULTING — Mis à jour le 27 Mars 2026
        </div>
      </main>

    </div>
  );
}