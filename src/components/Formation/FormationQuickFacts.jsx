import React from 'react';
import { Link } from 'react-router-dom';

const PREVIEW_COUNT = 4;

/**
 * Récap formation : stats + extraits modalités / prérequis.
 * Mobile : grille 2 cols pour les stats ; desktop : carte sticky dans la colonne latérale.
 */
export default function FormationQuickFacts({
  stats,
  infosPratiques,
  contactHref = '/contact',
}) {
  const modalPoints = infosPratiques?.modalites?.points ?? [];
  const prereqPoints = infosPratiques?.prerequis?.points ?? [];
  const modalPreview = modalPoints.slice(0, PREVIEW_COUNT);
  const prereqPreview = prereqPoints.slice(0, PREVIEW_COUNT);
  const needsMoreLink =
    modalPoints.length > PREVIEW_COUNT || prereqPoints.length > PREVIEW_COUNT;

  const hasInfosBlock =
    infosPratiques &&
    (modalPoints.length > 0 ||
      prereqPoints.length > 0 ||
      infosPratiques.modalites?.titre ||
      infosPratiques.prerequis?.titre);

  return (
    <div className="rounded-xl border border-border bg-surface-soft p-4 sm:p-5 shadow-sm">
      {stats && stats.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 pb-4 mb-4 border-b border-border">
          {stats.map((stat, idx) => (
            <div key={idx} className="min-w-0">
              <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-content-muted mb-1 truncate">
                {stat.label}
              </div>
              <div className="font-heading font-bold text-primary text-sm sm:text-base leading-snug break-words">
                {stat.value ?? stat.valeur}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {hasInfosBlock ? (
        <div className="space-y-4 text-sm">
          {modalPoints.length > 0 ? (
            <div>
              <h3 className="font-heading font-extrabold text-primary text-xs uppercase tracking-wider mb-2">
                {infosPratiques.modalites?.titre || 'Modalités'}
              </h3>
              <ul className="space-y-1.5 text-content-muted font-body leading-snug list-none pl-0">
                {modalPreview.map((p, i) => (
                  <li key={i} className="pl-3 border-l-2 border-accent/40">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {prereqPoints.length > 0 ? (
            <div>
              <h3 className="font-heading font-extrabold text-primary text-xs uppercase tracking-wider mb-2">
                {infosPratiques.prerequis?.titre || 'Prérequis'}
              </h3>
              <ul className="space-y-1.5 text-content-muted font-body leading-snug list-none pl-0">
                {prereqPreview.map((p, i) => (
                  <li key={i} className="pl-3 border-l-2 border-primary/25">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {needsMoreLink ? (
            <a
              href="#formation-infos-pratiques"
              className="inline-block text-accent font-bold text-xs uppercase tracking-wider hover:underline"
            >
              Voir tout
            </a>
          ) : null}
        </div>
      ) : null}

      <div className="mt-4 pt-4 border-t border-border">
        <Link
          to={contactHref}
          className="btn-orange w-full text-center block px-4 py-2.5 text-sm font-bold no-underline rounded-lg"
        >
          Nous contacter
        </Link>
      </div>
    </div>
  );
}
