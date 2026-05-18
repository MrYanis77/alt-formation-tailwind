import React from 'react';

/**
 * Hero.jsx — Bannière hero avec vidéo en fond (sans overlay)
 * @param {boolean} compact — Réduit hauteur et padding à partir de md (ex. pages formation détail)
 * @param {boolean} alignLeft — Aligne titre et sous-titre à gauche dans un container limité
 */
export default function Hero({
  title,
  subtitle,
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

      <div className={innerWrap}>
        <h1
          className={titleClasses}
          style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className={subtitleClasses}
            style={{ textShadow: '0 1px 5px rgba(0,0,0,0.3)' }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
