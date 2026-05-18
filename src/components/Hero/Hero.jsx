import React from 'react';

/**
<<<<<<< HEAD
 * Hero.jsx — Bannière hero avec vidéo en fond (sans overlay)
 * @param {boolean} compact — Réduit hauteur et padding à partir de md (ex. pages formation détail)
 * @param {boolean} alignLeft — Aligne titre et sous-titre à gauche dans un container limité
=======
 * Hero.jsx — Bannière hero avec vidéo uniquement
 * Version éclaircie (Overlay 20%)
>>>>>>> 0a48c2f2e8ddbb4846f055db09011af7079eaa03
 */
export default function Hero({
  title,
  subtitle,
<<<<<<< HEAD
  video,
  compact = false,
  alignLeft = false,
}) {
  const sectionLayout = compact
    ? 'min-h-[280px] py-12 md:min-h-[320px] md:py-14 lg:min-h-[340px]'
    : 'min-h-[400px] py-20';

  const textAlign = alignLeft ? 'text-left' : 'text-center';
  const justify = alignLeft ? '' : 'justify-center';
  const innerWrap = alignLeft
    ? 'relative z-10 max-w-container-xl mx-auto w-full'
    : 'relative z-10 max-w-4xl mx-auto';

  const titleClasses = alignLeft
    ? 'text-white text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 md:mb-5 uppercase tracking-tight'
    : 'text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 uppercase tracking-tight';

  const subtitleClasses = alignLeft
    ? 'text-white text-base md:text-lg font-body max-w-2xl leading-relaxed'
    : 'text-white text-lg md:text-xl font-body max-w-2xl mx-auto leading-relaxed';

  return (
    <section
      className={`relative flex items-center ${justify} bg-primary px-6 ${sectionLayout} ${textAlign} overflow-hidden`}
      aria-label={`Bandeau ${title}`}
    >
=======
  video
}) {
  return (
    <section
      className="relative min-h-[400px] flex items-center justify-center bg-primary px-6 py-20 text-center overflow-hidden"
      aria-label={`Bandeau ${title}`}
    >
      {/* Rendu de la vidéo en arrière-plan */}
>>>>>>> 0a48c2f2e8ddbb4846f055db09011af7079eaa03
      {video && (
        <video
          key={video}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={video} type="video/mp4" />
        </video>
      )}

<<<<<<< HEAD
      <div className={innerWrap}>
        <h1
          className={titleClasses}
=======
      {/* Overlay éclairci (passé de /40 à /20) */}
      <div className="absolute inset-0 bg-primary/20 z-0"></div>

      {/* Contenu textuel */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Ajout d'un léger shadow pour la lisibilité sur fond clair */}
        <h1
          className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 uppercase tracking-tight"
>>>>>>> 0a48c2f2e8ddbb4846f055db09011af7079eaa03
          style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
        >
          {title}
        </h1>

        {subtitle && (
          <p
<<<<<<< HEAD
            className={subtitleClasses}
=======
            className="text-white text-lg md:text-xl font-body max-w-2xl mx-auto leading-relaxed"
>>>>>>> 0a48c2f2e8ddbb4846f055db09011af7079eaa03
            style={{ textShadow: '0 1px 5px rgba(0,0,0,0.3)' }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 0a48c2f2e8ddbb4846f055db09011af7079eaa03
