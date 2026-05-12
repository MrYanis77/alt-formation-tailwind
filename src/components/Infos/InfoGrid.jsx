/**
 * Composant : InfoGrid
 * -------------------
 * Rôle : Affiche une carte d'argumentaire (réassurance) avec une icône, un titre et une description.
 * Utilisé principalement pour présenter les avantages (ex: Rémunération, Expérience, Employabilité).
 * * Props :
 * - titre (string) : Le titre de la carte (affiché en majuscules).
 * - description (string) : Le corps de texte de la carte.
 * - icon (LucideIcon) : Le composant icône à rendre (ex: Wallet, Briefcase).
 * - variant (string) : "orange" (par défaut) ou "navy" pour changer la couleur de fond de l'icône.
 * * Styles : Utilise les variables CSS globales (--color-orange, --color-muted, etc.)
 * via les classes Tailwind configurées.
 */

import React from 'react';

export default function InfoGrid({
  titre,
  description,
  icon: Icon,
  variant = 'orange',
}) {
  const iconBg = variant === 'orange' ? 'bg-accent' : 'bg-primary';

  return (
    <div className="bg-white border border-border rounded-card flex flex-col items-center text-center w-full shadow-sm hover:shadow-md transition-all h-full p-10">
      {Icon && (
        <div
          className={`${iconBg} rounded-full flex items-center justify-center shadow-sm text-white w-20 h-20 mb-8`}
        >
          <Icon size={32} strokeWidth={2} />
        </div>
      )}

      <h3 className="text-accent font-heading font-extrabold leading-tight uppercase text-2xl mb-5">
        {titre}
      </h3>

      <div className="text-content-muted font-body leading-relaxed w-full text-base">
        {description}
      </div>
    </div>
  );
}
