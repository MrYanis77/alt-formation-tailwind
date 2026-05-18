import React from 'react';
import { Link } from 'react-router-dom';

export default function CardFormation({
  title,
  image,
<<<<<<< HEAD
  variant = "white",
  href = "#",
  hideButton = false,
  typeBadge,
  /** Variante plus compacte (ex. grilles catalogue) */
  compact = false,
  /** Ligne de puces sous le titre (optionnel ; ex. services sur la homepage) */
  items,
  /** Lien externe (ex. Google Maps) — affiche un bouton dédié */
  mapsHref,
  mapsButtonLabel = 'Google Maps',
=======
  points = [
    "Certification professionnelle reconnue",
    "Formateurs experts du secteur",
    "Plateforme e-learning accessible 24/7"
  ],
  variant = "white",
  href = "#", // Nouvelle prop pour le lien
  hideButton = false

>>>>>>> 0a48c2f2e8ddbb4846f055db09011af7079eaa03
}) {
  const isNavy = variant === "navy";

  return (
    <div className={`
<<<<<<< HEAD
      group flex flex-col rounded-sm overflow-hidden border transition-all duration-300 h-full
      ${compact ? 'hover:-translate-y-1' : 'hover:-translate-y-2'}
=======
      group flex flex-col rounded-sm overflow-hidden border transition-all duration-300 h-full hover:-translate-y-2
>>>>>>> 0a48c2f2e8ddbb4846f055db09011af7079eaa03
      ${isNavy
        ? "bg-primary text-white border-primary shadow-lg hover:shadow-2xl hover:shadow-primary/50"
        : "bg-white text-content-dark border-border shadow-sm hover:shadow-xl hover:border-accent/30"}
    `}>

      {/* Image de la formation */}
<<<<<<< HEAD
      <div className={`relative w-full overflow-hidden ${compact ? 'h-36' : 'h-48'}`}>
        {typeBadge ? (
          <span
            className={`absolute left-3 z-[1] max-w-[calc(100%-1.5rem)] rounded-md bg-primary/95 font-extrabold uppercase tracking-wide text-white shadow-md ${compact ? 'top-2 px-2 py-0.5 text-[9px]' : 'top-3 px-2.5 py-1 text-[10px]'}`}
            title={typeBadge}
          >
            {typeBadge}
          </span>
        ) : null}
=======
      <div className="h-48 w-full overflow-hidden">
>>>>>>> 0a48c2f2e8ddbb4846f055db09011af7079eaa03
        <img
          src={image}
          alt={title}
          loading="lazy"
          decoding="async"
          // Utilisation de group-hover pour que l'image zoome quand on survole la carte
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
        />
      </div>

<<<<<<< HEAD
      <div className={`flex flex-col flex-grow relative ${compact ? 'p-4' : 'p-6'}`}>
        <h3
          className={`font-bold leading-tight transition-colors duration-300 ${compact ? 'text-base' : 'text-lg'} ${!isNavy ? 'group-hover:text-accent' : ''}`}
        >
          {title}
        </h3>

        {items && items.length > 0 ? (
          <ul
            className={`list-disc font-body leading-relaxed ${compact ? 'mt-3 space-y-1 pl-4 text-xs' : 'mt-4 space-y-1.5 pl-5 text-sm'} ${isNavy ? 'text-white/90 marker:text-accent' : 'text-content-muted marker:text-accent'}`}
          >
            {items.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        ) : null}

        {(!hideButton || mapsHref) && (
          <div className={`mt-auto flex flex-col ${compact ? 'gap-2 pt-4' : 'gap-3 pt-6'}`}>
            {!hideButton && (
              <Link
                to={href}
                className={`btn-orange self-start no-underline inline-block transition-transform duration-300 hover:scale-105 ${compact ? 'text-xs py-2 px-4' : 'text-sm py-2.5 px-6'}`}
              >
                En savoir plus
              </Link>
            )}
            {mapsHref ? (
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn-orange self-start no-underline inline-block transition-transform duration-300 hover:scale-105 ${compact ? 'text-xs py-2 px-4' : 'text-sm py-2.5 px-6'}`}
              >
                {mapsButtonLabel}
              </a>
            ) : null}
          </div>
=======
      {/* Contenu de la carte */}
      <div className="p-6 flex flex-col flex-grow relative">

        {/* Titre avec changement de couleur subtil au survol pour la version blanche */}
        <h3 className={`text-lg font-bold mb-5 min-h-[3rem] leading-tight transition-colors duration-300 ${!isNavy ? 'group-hover:text-accent' : ''}`}>
          {title}
        </h3>

        {/* Liste à puces orange */}
        <ul className="space-y-3 mb-8 flex-grow">
          {points.map((point, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <span className="text-accent mt-1.5 text-micro flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1">•</span>
              <span className={isNavy ? "text-white/90" : "text-content-muted"}>
                {point}
              </span>
            </li>
          ))}
        </ul>

        {/* Bouton transformé en lien interne React */}
        {!hideButton && (
          <Link
            to={href}
            className="btn-orange self-start text-sm py-2.5 px-6 no-underline inline-block transition-transform duration-300 hover:scale-105"
          >
            En savoir plus
          </Link>
>>>>>>> 0a48c2f2e8ddbb4846f055db09011af7079eaa03
        )}
      </div>
    </div>
  );
}