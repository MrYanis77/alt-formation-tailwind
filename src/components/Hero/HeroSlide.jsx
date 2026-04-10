// Composant HeroSlide
// - Affiche le contenu de la slide principale du carousel
// - Gère le rendu du bouton CTA (interne ou externe)

import React from 'react';
import { Link } from 'react-router-dom';

export default function HeroSlide({ slide }) {
  // Détecter si c'est un lien externe (Google Maps, etc.) ou interne (React Router)
  const isExternal = slide.ctaTo?.startsWith('http');

  return (
    <div className="max-w-[700px]">
      {/* CORRECTION : Ombre douce au lieu de noire */}
      <span className="inline-block bg-orange text-white font-heading text-[11px] font-bold px-3 py-1 rounded-full tracking-wider mb-4 uppercase shadow-md">
        {slide.badge}
      </span>

      {/* CORRECTION : Remplacement de style={{ textShadow... }} par className="drop-shadow-md" */}
      <h1 className="font-heading text-3xl md:text-[38px] font-extrabold text-white leading-[1.15] mb-3 whitespace-pre-line uppercase tracking-tight drop-shadow-md">
        {slide.title}
      </h1>

      <p className="font-heading text-[16px] font-bold text-orange mb-3 drop-shadow-sm">
        {slide.subtitle}
      </p>

      <p className="text-white/95 text-[14px] leading-relaxed mb-6 max-w-[500px] font-body drop-shadow-sm font-medium">
        {slide.desc}
      </p>

      {/* CORRECTION : Ajout de classes de survol modernes (hover:bg-white hover:text-orange) sur les boutons */}
      {isExternal ? (
        <a
          href={slide.ctaTo}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-orange inline-block px-7 py-3 text-sm shadow-lg shadow-orange/30 no-underline uppercase font-bold tracking-wide transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-orange hover:shadow-xl"
        >
          {slide.cta}
        </a>
      ) : (
        <Link
          to={slide.ctaTo}
          className="btn-orange inline-block px-7 py-3 text-sm shadow-lg shadow-orange/30 no-underline uppercase font-bold tracking-wide transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-orange hover:shadow-xl"
        >
          {slide.cta}
        </Link>
      )}
    </div>
  );
}