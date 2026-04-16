import React from 'react';

/**
 * Hero.jsx — Bannière hero avec vidéo uniquement
 * Version éclaircie (Overlay 20%)
 */
export default function Hero({
  title,
  subtitle,
  video
}) {
  return (
    <section
      className="relative min-h-[400px] flex items-center justify-center bg-primary px-6 py-20 text-center overflow-hidden"
      aria-label={`Bandeau ${title}`}
    >
      {/* Rendu de la vidéo en arrière-plan */}
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

      {/* Overlay éclairci (passé de /40 à /20) */}
      <div className="absolute inset-0 bg-primary/20 z-0"></div>

      {/* Contenu textuel */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Ajout d'un léger shadow pour la lisibilité sur fond clair */}
        <h1
          className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 uppercase tracking-tight"
          style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className="text-white text-lg md:text-xl font-body max-w-2xl mx-auto leading-relaxed"
            style={{ textShadow: '0 1px 5px rgba(0,0,0,0.3)' }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}