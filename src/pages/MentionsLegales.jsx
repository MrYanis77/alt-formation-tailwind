import React from 'react';;
import Breadcrumb from '../components/Breadcrumb';
import { hero, editeur, prestataires, articlesMentions } from '../data/mentionsLegales';

export default function MentionsLegales() {
  return (
    <div className="bg-white min-h-screen font-body text-muted antialiased">
      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Mentions Légales' }]} />

      <main className="py-20 px-6 max-w-[900px] mx-auto">
        
        {/* BLOC ÉDITEUR - PRÉSENTATION OFFICIELLE */}
        <div className="mb-24 p-10 border-2 border-orange/20 rounded-[40px] bg-orange/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange/10 rounded-full -mr-16 -mt-16"></div>
          
          <h2 className="font-heading font-extrabold text-2xl text-navy mb-8 uppercase tracking-tight">
            Éditeur du site web
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-[15px]">
            <div className="space-y-5">
              <div>
                <span className="text-orange font-bold text-[10px] uppercase tracking-widest block mb-1">Raison Sociale</span>
                <p className="font-bold text-dark text-lg uppercase leading-tight">{editeur.nom}</p>
                <p className="text-sm opacity-80">{editeur.statut}</p>
              </div>
              <div>
                <span className="text-orange font-bold text-[10px] uppercase tracking-widest block mb-1">Siège Social</span>
                <p className="text-dark leading-relaxed">{editeur.adresse}</p>
              </div>
              <div>
                <span className="text-orange font-bold text-[10px] uppercase tracking-widest block mb-1">Directeur de la publication</span>
                <p className="text-dark font-bold italic">{editeur.directeurPublication}</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="p-4 bg-white/50 rounded-2xl border border-orange/10">
                <p className="text-xs leading-relaxed">
                  <span className="font-bold text-navy">Siret :</span> {editeur.siret}<br/>
                  <span className="font-bold text-navy">Naf :</span> {editeur.naf}<br/>
                  <span className="font-bold text-navy">TVA :</span> {editeur.tva}<br/>
                  <span className="font-bold text-navy">RCS :</span> {editeur.rcs}
                </p>
              </div>
              <div>
                <span className="text-orange font-bold text-[10px] uppercase tracking-widest block mb-1">Contact</span>
                <p className="text-dark font-medium">{editeur.telephone}</p>
                <a href={`mailto:${editeur.email}`} className="text-orange font-bold hover:underline transition-all">
                  {editeur.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ARTICLES JURIDIQUES (DESIGN IDENTIQUE AU RÈGLEMENT INTÉRIEUR) */}
        <div className="space-y-16">
          {articlesMentions.map((article) => (
            <section key={article.num} className="relative group">
              {/* Ligne décorative latérale */}
              <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gray-100 group-hover:bg-orange transition-colors rounded-full hidden md:block"></div>
              
              <div className="mb-4">
                <span className="text-orange font-bold text-sm tracking-[0.2em] uppercase">
                  Information {article.num}
                </span>
                <h2 className="font-heading font-extrabold text-2xl text-navy mt-1 uppercase tracking-tight">
                  {article.titre}
                </h2>
              </div>

              <div className="text-[16px] leading-[1.8] text-dark">
                <p className="whitespace-pre-line">{article.contenu}</p>
              </div>
            </section>
          ))}
        </div>

        {/* ZONE PRESTATAIRES (STYLE CARTES TECHNIQUES) */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-8">
          {prestataires.map((p, idx) => (
            <div key={idx} className="p-8 bg-navy text-white rounded-[32px] shadow-xl relative group">
              <h4 className="font-heading font-bold text-orange mb-4 uppercase text-[10px] tracking-[0.2em]">
                {p.role}
              </h4>
              <p className="font-bold text-lg mb-2">{p.nom}</p>
              {p.direction && <p className="text-sm mb-4 italic opacity-80">Direction : {p.direction}</p>}
              <div className="text-[13px] opacity-70 space-y-1">
                <p>{p.adresse}</p>
                <p>{p.telephone}</p>
                {p.email && <p className="text-orange opacity-100 font-medium">{p.email}</p>}
                {p.rcs && <p className="text-[10px] mt-2 italic">RCS : {p.rcs}</p>}
                {p.siret && <p className="text-[10px] mt-2 italic">Siret : {p.siret}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* COORDONNÉES ADMINISTRATIVES FINALES */}
        <div className="mt-20 pt-8 border-t border-gray-100 text-[11px] text-center opacity-50 uppercase tracking-[0.2em] leading-loose">
          {editeur.nom} — {editeur.adresse} — Siret : {editeur.siret}<br/>
          Document mis à jour en 2026 — Le site est soumis à la loi française.
        </div>

      </main>

    </div>
  );
}