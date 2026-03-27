import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import Hero from '../components/Hero';
import { sectionsConf, hero } from '../data/politiqueConfidentialite';

export default function PolitiqueConfidentialite() {
  return (
    <div className="bg-white min-h-screen font-body text-muted antialiased">
      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Confidentialité' }]} />

      <main className="py-20 px-6 max-w-[900px] mx-auto text-left">
        
        <div className="space-y-16">
          {sectionsConf.map((section, index) => (
            <section key={index} className="relative group">
              {/* Ligne latérale orange au survol */}
              <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gray-100 group-hover:bg-orange transition-colors rounded-full hidden md:block"></div>
              
              <div className="mb-4">
                <span className="text-orange font-bold text-sm tracking-[0.2em] uppercase">
                  Chapitre 0{index + 1}
                </span>
                <h2 className="font-heading font-extrabold text-2xl text-navy mt-1 uppercase tracking-tight">
                  {section.titre}
                </h2>
              </div>

              <div className="text-[16px] leading-[1.8] text-dark space-y-6">
                <p>{section.contenu}</p>
                
                {section.list && (
                  <ul className="space-y-4 pt-2">
                    {section.list.map((item, idx) => (
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

        <div className="mt-24 pt-8 border-t border-gray-100 text-[11px] text-center opacity-60 uppercase tracking-widest leading-loose">
          ALT–RH CONSULTING — SAS AU CAPITAL DE 200 000 € — RCS MEAUX 811 698 919
        </div>
      </main>
    </div>
  );
}