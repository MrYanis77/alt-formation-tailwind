import React from 'react';

/**
 * Composant pour afficher une section de financement
 * @param {string} title - Titre de la section
 * @param {string} description - Texte introductif
 * @param {Array} columns - Les colonnes de données (label, items, text)
 * @param {boolean} highlight - Si vrai, ajoute une bordure orange (style CPF)
 * @param {Object} cta - Optionnel { label, href } pour un bouton d'action
 */
export default function CardDesc({ title, description, columns = [], highlight = false, cta = null, image = null }) {
  return (
    <section className={`bg-surface border ${highlight ? 'border-accent shadow-md' : 'border-border shadow-sm'} rounded-card overflow-hidden transition-shadow hover:shadow-lg`}>

      {/* Conteneur Flex : Colonne sur mobile, Ligne sur Desktop, centré verticalement */}
      <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12">

        {/* IMAGE : Au milieu à gauche */}
        {image && (
          <div className="flex-shrink-0 w-32 h-32 md:w-48 md:h-48 rounded-[24px] overflow-hidden border border-border shadow-sm bg-surface">
            <img src={image} alt={title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* CONTENU TEXTUEL : À droite de l'image */}
        <div className="flex-1 w-full">
          <h2 className="font-heading text-h2 font-bold text-primary mb-4 text-center md:text-left">
            {title}
          </h2>

          {description && (
            <p className="text-medium text-content-muted leading-relaxed mb-8 text-center md:text-left">
              {description}
            </p>
          )}

          <div className={`grid grid-cols-1 ${columns.length === 4 ? 'lg:grid-cols-4' :
              columns.length === 3 ? 'lg:grid-cols-3' :
                'lg:grid-cols-2'
            } gap-8`}>
            {columns.map((col, idx) => (
              <div key={idx} className="flex flex-col h-full">
                <h3 className="font-heading text-medium font-bold text-primary mb-4 uppercase tracking-tight">
                  {col.label || col.titre}
                </h3>

                {/* Cas 1 : Affichage d'une liste d'items */}
                {col.items && col.items.length > 0 && (
                  <ul className="flex flex-col gap-3 mb-6">
                    {col.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-medium text-content-muted">
                        <span className="text-accent font-bold text-xl leading-none mt-[-2px]">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Cas 2 : Affichage d'un texte simple */}
                {(col.text || col.desc) && (
                  <p className="text-medium text-content-muted leading-relaxed mb-6">
                    {col.text || col.desc}
                  </p>
                )}

                {/* Affichage du bouton CTA */}
                {idx === 1 && cta && (
                  <div className="mt-auto pt-4 text-center md:text-left">
                    <a
                      href={cta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-orange inline-block"
                    >
                      {cta.label}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}