import React from 'react';

/*
 * Composant TexteSection
 * Affiche une section de texte avec titre et contenu, optionnellement accompagnée d'une image.
 * Design fidèle à l'image 3e9e23.jpg
 * Props :
 * - data : objet avec titre, contenu (array de paragraphes), image (optionnel)
 * - imageRight : boolean pour positionner l'image à droite (défaut) ou à gauche
 */

export default function  TexteSection ({ data, imageRight = true }) {
  if (!data) return null;

  const { titre, contenu, image } = data;
  const hasImage = Boolean(image);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-container-xl mx-auto px-6">
        <div className={`grid grid-cols-1 ${hasImage ? 'lg:grid-cols-2' : ''} gap-16 items-center`}>
          
          {/* Colonne Texte */}
          <div className={`${hasImage && !imageRight ? 'lg:order-last' : ''}`}>
            {/* Titre : Très gras, Navy, taille imposante */}
            <h2 className="font-heading text-[36px] md:text-[44px] font-black text-primary mb-10 leading-tight tracking-tight">
              {titre}
            </h2>

            {/* Paragraphes : Interlignage aéré, couleur muted */}
            <div className="flex flex-col gap-8">
              {(Array.isArray(contenu) ? contenu : [contenu]).filter(Boolean).map((paragraphe, index) => (
                <p 
                  key={index} 
                  className="text-[17px] md:text-[18px] text-content-muted leading-relaxed font-body"
                >
                  {paragraphe}
                </p>
              ))}
            </div>
          </div>

          {/* Colonne Image : Arrondis et ombre douce */}
          {hasImage && (
            <div className="relative">
              <div className="rounded-card overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
                <img 
                  src={image} 
                  alt={titre} 
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

