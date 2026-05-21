import React from 'react';
import { Link } from 'react-router-dom';
import { getModaliteBadgeLabel } from '../../utils/formationModalites';

export default function CardFormation({
  title,
  image,
  variant = "white",
  href = "#",
  hideButton = false,
  typeBadge,
  /** Pastille Présentiel / Distanciel / Mixte */
  modalityBadge,
  /** Modalités brutes — utilisées si modalityBadge absent */
  modalites,
  /** Variante plus compacte (ex. grilles catalogue) */
  compact = false,
  /** Encore plus compact (ex. page Campus) — à utiliser avec `compact` */
  dense = false,
  /** Ligne de puces sous le titre (optionnel ; ex. services sur la homepage) */
  items,
  /** Lien externe (ex. Google Maps) — affiche un bouton dédié */
  mapsHref,
  mapsButtonLabel = 'Google Maps',
  /** Clic sur la zone image (ex. lightbox campus) */
  onImageClick,
}) {
  const isNavy = variant === "navy";
  /** Pastille modalité uniquement si `modalites` est fourni (tableau) — évite « Mixte » sur Campus, Home, Certification, etc. */
  const resolvedModalityBadge =
    modalityBadge ?? (Array.isArray(modalites) ? getModaliteBadgeLabel(modalites) : null);

  const imgH = dense ? 'h-28 sm:h-32' : compact ? 'h-36' : 'h-48';
  const bodyPad = dense ? 'p-3' : compact ? 'p-4' : 'p-6';
  const titleSize = dense ? 'text-sm' : compact ? 'text-base' : 'text-lg';
  const footerGap = dense ? 'gap-1.5 pt-3' : compact ? 'gap-2 pt-4' : 'gap-3 pt-6';
  const btnClass = dense
    ? 'text-[11px] py-1.5 px-3'
    : compact
      ? 'text-xs py-2 px-4'
      : 'text-sm py-2.5 px-6';

  return (
    <div className={`
      group flex flex-col rounded-sm overflow-hidden border transition-all duration-300 h-full
      ${compact || dense ? 'hover:-translate-y-1' : 'hover:-translate-y-2'}
      ${isNavy
        ? "bg-primary text-white border-primary shadow-lg hover:shadow-2xl hover:shadow-primary/50"
        : "bg-white text-content-dark border-border shadow-sm hover:shadow-xl hover:border-accent/30"}
    `}>

      {/* Image de la formation */}
      <div className={`relative w-full overflow-hidden ${imgH}`}>
        {typeBadge ? (
          <span
            className={`absolute left-3 z-[3] max-w-[calc(100%-1.5rem)] rounded-md bg-primary/95 font-extrabold uppercase tracking-wide text-white shadow-md ${compact ? 'top-2 px-2 py-0.5 text-[9px]' : 'top-3 px-2.5 py-1 text-[10px]'}`}
            title={typeBadge}
          >
            {typeBadge}
          </span>
        ) : null}
        {resolvedModalityBadge ? (
          <span
            className={`absolute right-3 z-[3] max-w-[calc(100%-1.5rem)] rounded-md font-extrabold uppercase tracking-wide text-white shadow-md ${
              resolvedModalityBadge === 'Distanciel'
                ? 'bg-sky-700/95'
                : resolvedModalityBadge === 'Mixte'
                  ? 'bg-accent/95'
                  : 'bg-primary/95'
            } ${compact ? 'top-2 px-2 py-0.5 text-[9px]' : 'top-3 px-2.5 py-1 text-[10px]'}`}
            title={`Modalité : ${resolvedModalityBadge}`}
          >
            {resolvedModalityBadge}
          </span>
        ) : null}
        {onImageClick ? (
          <button
            type="button"
            onClick={onImageClick}
            aria-label={`Agrandir la photo — ${title}`}
            className="relative z-[2] block h-full w-full border-0 bg-transparent p-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
          >
            <img
              src={image}
              alt=""
              loading="lazy"
              decoding="async"
              aria-hidden
              className="pointer-events-none h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </button>
        ) : (
          <img
            src={image}
            alt={title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}
      </div>

      <div className={`flex flex-col flex-grow relative ${bodyPad}`}>
        <h3
          className={`font-bold leading-tight transition-colors duration-300 ${titleSize} ${!isNavy ? 'group-hover:text-accent' : ''}`}
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
          <div className={`mt-auto flex flex-col ${footerGap}`}>
            {!hideButton && (
              <Link
                to={href}
                className={`btn-orange self-start no-underline inline-block transition-transform duration-300 hover:scale-105 ${btnClass}`}
              >
                En savoir plus
              </Link>
            )}
            {mapsHref ? (
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn-orange self-start no-underline inline-block transition-transform duration-300 hover:scale-105 ${btnClass}`}
              >
                {mapsButtonLabel}
              </a>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}