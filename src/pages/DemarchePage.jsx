import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import LegalArticle from '../components/Textes/LegalArticle';
import { getDemarchePage } from '../data/demarches';

export default function DemarchePage() {
  const { pathname } = useLocation();
  const page = getDemarchePage(pathname);

  if (!page) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="bg-white min-h-screen font-body text-content-muted antialiased">
      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: page.breadcrumb }]} />

      <main className="py-16 md:py-20 px-6 max-w-container-2xl mx-auto">
        <header className="mb-14 pb-10 border-b border-border">
          <span className="text-accent font-bold text-xs uppercase tracking-[0.2em]">Alt RH Formations</span>
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-primary uppercase tracking-tight mt-3 mb-6">
            {page.titre}
          </h1>
          <p className="text-base md:text-lg leading-relaxed text-content-muted max-w-3xl">{page.intro}</p>
        </header>

        <div className="space-y-16">
          {page.articles.map((article) => (
            <LegalArticle
              key={article.num}
              num={`Section ${article.num}`}
              titre={article.titre}
              contenu={article.contenu}
              list={article.list}
            />
          ))}
        </div>

        <div className="mt-20 pt-8 border-t border-gray-100 text-tiny text-center opacity-60 uppercase tracking-widest leading-loose">
          Alt RH Formations — 03 Rue du Cochet – 77700 Bailly-Romainvilliers — Siret : 811 698 919 00016
        </div>
      </main>
    </div>
  );
}
