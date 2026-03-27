import React from 'react';

export default function InfoCard({ titre, description, icon: Icon, variant = "orange" }) {
  // Utilisation des variables de ton index.css
  const iconBg = variant === "orange" ? "bg-orange" : "bg-navy";

  return (
    <div className="bg-white border border-border rounded-[24px] p-10 flex flex-col items-center text-center w-full shadow-sm hover:shadow-md transition-all h-full">
      
      {/* Cercle de l'icône avec ton orange du thème */}
      {Icon && (
        <div className={`${iconBg} w-20 h-20 rounded-full flex items-center justify-center mb-8 shadow-sm text-white`}>
          <Icon size={32} strokeWidth={2} />
        </div>
      )}

      {/* Titre avec la couleur --color-orange de ton CSS */}
      <h3 className="text-orange font-heading font-extrabold text-2xl mb-5 leading-tight uppercase">
        {titre}
      </h3>

      {/* Description utilisant ta couleur --color-muted ou text-gray-600 */}
      <p className="text-muted font-body text-[16px] leading-relaxed">
        {description}
      </p>
    </div>
  );
}