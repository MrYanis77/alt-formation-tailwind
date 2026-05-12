import React from 'react';

/**
 * Composant de base pour les articles légaux (Mentions Légales, CGV, Règlement...)
 * Gère une ligne latérale réactive, un pré-titre, un titre, un bloc de texte multiline et une liste à puces.
 */
export default function LegalArticle({ num, titre, contenu, list }) {
  return (
    <section className="relative group">
      {/* Ligne latérale décorative réactive au survol */}
      <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gray-100 group-hover:bg-accent transition-colors rounded-full hidden md:block"></div>
      
      <div className="mb-4">
        {/* Pré-titre optionnel (ex: Article 1, Chapitre 02) */}
        {num && (
          <span className="text-accent font-bold text-sm tracking-[0.2em] uppercase">
            {num}
          </span>
        )}
        {/* Titre Principal */}
        <h2 className="font-heading font-extrabold text-2xl text-primary mt-1 uppercase tracking-tight">
          {titre}
        </h2>
      </div>

      {/* Contenu textuel et Liste à puces */}
      <div className="text-base leading-[1.8] text-content-dark space-y-6">
        {contenu && <p className="whitespace-pre-line">{contenu}</p>}
        
        {list && list.length > 0 && (
          <ul className="space-y-4 pt-2">
            {list.map((item, idx) => (
              <li key={idx} className="flex gap-4 items-start pl-4">
                <span className="text-accent mt-2 flex-shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
