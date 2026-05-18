import React from 'react';

/*
 * Composant TexteSection
 * Affiche une section de texte avec titre et contenu, optionnellement accompagnée d'une image.
<<<<<<< HEAD
 * Props :
 * - data : objet avec titre, contenu (array de paragraphes), image (optionnel)
 * - imageRight : boolean pour positionner l'image à droite (défaut) ou à gauche
 * - variant : 'default' | 'compact' — paddings et typo réduits (pages formation détail)
 */

export default function TexteSection({ data, imageRight = true, variant = 'default' }) {
=======
 * Design fidèle à l'image 3e9e23.jpg
 * Props :
 * - data : objet avec titre, contenu (array de paragraphes), image (optionnel)
 * - imageRight : boolean pour positionner l'image à droite (défaut) ou à gauche
 */

export default function  TexteSection ({ data, imageRight = true }) {
>>>>>>> 0a48c2f2e8ddbb4846f055db09011af7079eaa03
  if (!data) return null;

  const { titre, contenu, image } = data;
  const hasImage = Boolean(image);
<<<<<<< HEAD
  const isCompact = variant === 'compact';

  const sectionPad = isCompact ? 'py-0 bg-transparent' : 'py-20 bg-white';
  const containerPad = isCompact ? 'px-0' : 'px-6';
  const gridGap = isCompact ? 'gap-8 lg:gap-10' : 'gap-16';
  const titleClass = isCompact
    ? 'font-heading text-2xl md:text-3xl font-extrabold text-primary mb-6 leading-tight tracking-tight border-b border-border pb-4'
    : 'font-heading text-[36px] md:text-[44px] font-black text-primary mb-10 leading-tight tracking-tight';
  const bodyGap = isCompact ? 'gap-4' : 'gap-8';
  const paragraphClass = isCompact
    ? 'text-[15px] md:text-base text-content-muted leading-relaxed font-body'
    : 'text-[17px] md:text-[18px] text-content-muted leading-relaxed font-body';
  const imageWrap = isCompact
    ? 'rounded-lg overflow-hidden shadow-md border border-border'
    : 'rounded-card overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-[1.02]';

  return (
    <section className={sectionPad}>
      <div className={`max-w-container-xl mx-auto ${containerPad}`}>
        <div className={`grid grid-cols-1 ${hasImage ? 'lg:grid-cols-2' : ''} ${gridGap} items-start`}>
          <div className={`${hasImage && !imageRight ? 'lg:order-last' : ''}`}>
            <h2 className={titleClass}>
              {titre}
            </h2>

            <div className={`flex flex-col ${bodyGap}`}>
              {(Array.isArray(contenu) ? contenu : [contenu])
                .filter(Boolean)
                .map((paragraphe, index) => (
                  <p key={index} className={paragraphClass}>
                    {paragraphe}
                  </p>
                ))}
            </div>
          </div>

          {hasImage && (
            <div className="relative">
              <div className={imageWrap}>
                <img
                  src={image}
                  alt={titre}
                  className="w-full object-cover h-auto aspect-[4/3]"
=======

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
>>>>>>> 0a48c2f2e8ddbb4846f055db09011af7079eaa03
                />
              </div>
            </div>
          )}
<<<<<<< HEAD
=======

>>>>>>> 0a48c2f2e8ddbb4846f055db09011af7079eaa03
        </div>
      </div>
    </section>
  );
<<<<<<< HEAD
}
=======
};

>>>>>>> 0a48c2f2e8ddbb4846f055db09011af7079eaa03
