import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import Hero from '../components/Hero';
import { reglementData, hero } from '../data/reglementInterieur';

export default function ReglementInterieur() {
  return (
    <div className="bg-white min-h-screen font-body text-muted antialiased">
      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Règlement Intérieur' }]} />

      <main className="py-20 px-6 max-w-[900px] mx-auto">
        
        {/* LISTE DES ARTICLES INTÉGRAUX */}
        <div className="space-y-16">
          {reglementData.map((article) => (
            <section key={article.num} className="relative group">
              {/* Ligne décorative latérale */}
              <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gray-100 group-hover:bg-orange transition-colors rounded-full hidden md:block"></div>
              
              <div className="mb-4">
                <span className="text-orange font-bold text-sm tracking-[0.2em] uppercase">
                  Article {article.num}
                </span>
                <h2 className="font-heading font-extrabold text-2xl text-navy mt-1 uppercase tracking-tight">
                  {article.titre}
                </h2>
              </div>

              <div className="text-[16px] leading-[1.8] text-dark space-y-6">
                <p>{article.contenu}</p>
                
                {article.list && (
                  <ul className="space-y-4 pt-2">
                    {article.list.map((item, idx) => (
                      <li key={idx} className="flex gap-4 items-start pl-4">
                        <span className="text-orange mt-2 flex-shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>

        {/* ZONE DE SIGNATURE */}
        <div className="mt-32 p-12 border-2 border-dashed border-gray-200 rounded-[32px] bg-gray-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-sm">
            <div>
              <p className="font-bold text-navy uppercase mb-8">Fait à Bailly Romainvilliers</p>
              <p className="mb-2 underline underline-offset-4">La Direction</p>
              <p className="font-bold italic text-dark uppercase">ALT-RH Consulting</p>
            </div>
            <div className="md:text-right">
              <p className="mb-8">Nom, prénom et signature du stagiaire :</p>
              <div className="h-24 border border-gray-200 bg-white rounded-xl shadow-inner"></div>
            </div>
          </div>
        </div>

        {/* COORDONNÉES ADMINISTRATIVES */}
        <div className="mt-16 pt-8 border-t border-gray-100 text-[11px] text-center opacity-60 uppercase tracking-widest leading-loose">
          ALT–RH CONSULTING — 03 Rue du Cochet – 77700 Bailly Romainvilliers — Siret : 811 698 919 00016<br/>
          Naf : 70.22Z — TVA : FR39811698919 — RCS 811 698 919 R.C.S. Meaux — Capital : 20 000.00 €
        </div>

      </main>

    </div>
  );
}