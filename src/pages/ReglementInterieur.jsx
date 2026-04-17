import React from 'react';
import Breadcrumb from '../components/Breadcrumb';
import LegalArticle from '../components/Textes/LegalArticle';
import legalsData from '../data/json/legals.json';

const { articles } = legalsData.reglementInterieur;

export default function ReglementInterieur() {
  return (
    <div className="bg-white min-h-screen font-body text-content-muted antialiased">
      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Règlement Intérieur' }]} />

      <main className="py-20 px-6 max-w-container-2xl mx-auto">
        
        {/* LISTE DES ARTICLES INTÉGRAUX */}
        <div className="space-y-16">
          {articles.map((article) => (
            <LegalArticle 
              key={article.num}
              num={`Article ${article.num}`}
              titre={article.titre}
              contenu={article.contenu}
              list={article.list}
            />
          ))}
        </div>

        {/* ZONE DE SIGNATURE */}
        <div className="mt-32 p-12 border-2 border-dashed border-gray-200 rounded-section bg-gray-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-sm">
            <div>
              <p className="font-bold text-primary uppercase mb-8">Fait à Bailly Romainvilliers</p>
              <p className="mb-2 underline underline-offset-4">La Direction</p>
              <p className="font-bold italic text-content-dark uppercase">ALT-RH Consulting</p>
            </div>
            <div className="md:text-right">
              <p className="mb-8">Nom, prénom et signature du stagiaire :</p>
              <div className="h-24 border border-gray-200 bg-white rounded-xl shadow-inner"></div>
            </div>
          </div>
        </div>

        {/* COORDONNÉES ADMINISTRATIVES */}
        <div className="mt-16 pt-8 border-t border-gray-100 text-tiny text-center opacity-60 uppercase tracking-widest leading-loose">
          ALT–RH CONSULTING — 03 Rue du Cochet – 77700 Bailly Romainvilliers — Siret : 811 698 919 00016<br/>
          Naf : 70.22Z — TVA : FR39811698919 — RCS 811 698 919 R.C.S. Meaux — Capital : 20 000.00 €
        </div>

      </main>

    </div>
  );
}