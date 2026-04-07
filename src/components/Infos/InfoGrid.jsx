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

export default function InfoGrid({ titre, description, icon: Icon, variant = "orange" }) {
  // Détermination de la couleur de fond de l'icône via les classes personnalisées
  const iconBg = variant === "orange" ? "bg-orange" : "bg-navy";

  return (
    <div className="bg-white border border-border rounded-[24px] p-10 flex flex-col items-center text-center w-full shadow-sm hover:shadow-md transition-all h-full">
      
      {/* Conteneur de l'icône circulaire */}
      {Icon && (
        <div className={`${iconBg} w-20 h-20 rounded-full flex items-center justify-center mb-8 shadow-sm text-white`}>
          <Icon size={32} strokeWidth={2} />
        </div>
      )}

      {/* Titre stylisé en majuscules */}
      <h3 className="text-orange font-heading font-extrabold text-2xl mb-5 leading-tight uppercase">
        {titre}
      </h3>

      {/* Texte de description avec interlignage fluide */}
      <p className="text-muted font-body text-[16px] leading-relaxed">
        {description}
      </p>
    </div>
  );
}