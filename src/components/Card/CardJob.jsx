/*
 * Composant CardJob — offre d'emploi interne (Nous rejoindre)
 */

import { Link } from 'react-router-dom';

export default function CardJob({ titre, type, lieu, date, applyTo }) {
  return (
    <div className="bg-white rounded-sm shadow-sm border border-border border-l-4 border-l-orange p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md w-full">
      <div className="flex-1">
        <h3 className="text-primary font-heading font-extrabold text-lg md:text-xl mb-1">
          {titre}
        </h3>
        <p className="text-accent font-bold text-xs uppercase tracking-wider mb-2">
          Type de contrat : {type}
        </p>

        <div className="flex flex-wrap gap-x-8 gap-y-2">
          <div className="flex flex-col">
            <span className="text-content-dark font-bold text-sm">📍 Lieu :</span>
            <span className="text-content-muted text-sm">{lieu}</span>
          </div>
          {date ? (
            <div className="flex flex-col">
              <span className="text-content-dark font-bold text-sm">📅 Publié le :</span>
              <span className="text-content-muted text-sm leading-tight">{date}</span>
            </div>
          ) : null}
        </div>
      </div>

      <Link
        to={applyTo}
        className="btn-orange px-6 py-2 text-sm self-start md:self-center shadow-md hover:shadow-accent/20 active:scale-95 transition-all no-underline inline-block text-center"
      >
        Postuler
      </Link>
    </div>
  );
}
