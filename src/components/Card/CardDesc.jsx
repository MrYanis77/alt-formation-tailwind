import React from 'react';

/**
 * Composant pour afficher une section de financement
 * @param {string} title - Titre de la section
 * @param {string} description - Texte introductif
 * @param {Array} columns - Les colonnes de données (label, items, text)
 * @param {boolean} highlight - Si vrai, ajoute une bordure orange (style CPF)
 * @param {Object} cta - Optionnel { label, href } pour un bouton d'action
 */
export default function CardDesc ({ title, description, columns = [], highlight = false, cta = null }) {
  return (
    <section className={`bg-white border ${highlight ? 'border-orange' : 'border-gray-100'} rounded-xl p-10 md:p-12 shadow-sm transition-shadow hover:shadow-md`}>
      <h2 className="font-heading text-[28px] font-bold text-navy mb-4">
        {title}
      </h2>
      
      {description && (
        <p className="text-[15px] text-[#444] leading-relaxed mb-10">
          {description}
        </p>
      )}

      <div className={`grid grid-cols-1 ${
        columns.length === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 
        columns.length === 3 ? 'md:grid-cols-3' : 
        'md:grid-cols-2'
      } gap-12`}>
        {columns.map((col, idx) => (
          <div key={idx} className="flex flex-col h-full">
            <h3 className="font-heading text-[18px] font-bold text-navy mb-5 uppercase tracking-tight text-sm">
              {col.label || col.titre}
            </h3>
            
            {/* Cas 1 : Affichage d'une liste d'items */}
            {col.items && col.items.length > 0 && (
              <ul className="flex flex-col gap-3 mb-6">
                {col.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] text-[#555]">
                    <span className="text-orange font-bold text-xl leading-none mt-[-2px]">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {/* Cas 2 : Affichage d'un texte simple */}
            {(col.text || col.desc) && (
              <p className="text-[14px] text-[#555] leading-relaxed mb-6">
                {col.text || col.desc}
              </p>
            )}

            {/* Affichage du bouton CTA si présent dans cette colonne (cas du CPF) */}
            {idx === 1 && cta && (
              <div className="mt-auto">
                <a
                  href={cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-orange hover:bg-orange-dark text-white px-8 py-3.5 rounded-lg font-heading text-[15px] font-bold transition-all no-underline shadow-sm"
                >
                  {cta.label}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

