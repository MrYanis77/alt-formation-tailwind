import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import Hero from '../components/Hero';
import { sections, hero } from '../data/politiqueCookies';

export default function PolitiqueCookies() {
  return (
    <div className="bg-white min-h-screen font-body text-muted antialiased">
      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Politique Cookies' }]} />
      

      <main className="py-20 px-6 max-w-[900px] mx-auto text-left">
        
        <div className="space-y-16">
          {sections.map((section) => (
            <section key={section.id} className="relative group">
              {/* Ligne latérale orange au survol */}
              <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gray-100 group-hover:bg-orange transition-colors rounded-full hidden md:block"></div>
              
              <div className="mb-4">
                <span className="text-orange font-bold text-sm tracking-[0.2em] uppercase">
                  Chapitre 0{section.id}
                </span>
                <h2 className="font-heading font-extrabold text-2xl text-navy mt-1 uppercase tracking-tight">
                  {section.titre}
                </h2>
              </div>

              <div className="text-[16px] leading-[1.8] text-dark space-y-6">
                <p className="whitespace-pre-line">{section.contenu}</p>
              </div>
            </section>
          ))}
        </div>

        {/* Note de synchronisation finale */}
        <div className="mt-24 pt-8 border-t border-gray-100 text-[11px] text-center opacity-60 uppercase tracking-widest leading-loose">
          ALT–RH CONSULTING — Mis à jour le 27 Mars 2026
        </div>
      </main>

    </div>
  );
}