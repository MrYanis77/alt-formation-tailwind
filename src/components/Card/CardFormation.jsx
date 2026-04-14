import React from 'react';
import { Link } from 'react-router-dom';

export default function CardFormation({
  title,
  image,
  points = [
    "Certification professionnelle reconnue",
    "Formateurs experts du secteur",
    "Plateforme e-learning accessible 24/7"
  ],
  variant = "white",
  href = "#" // Nouvelle prop pour le lien
}) {
  const isNavy = variant === "navy";

  return (
    <div className={`
      group flex flex-col rounded-default overflow-hidden border transition-all duration-300 h-full hover:-translate-y-2
      ${isNavy
        ? "bg-navy text-white border-navy shadow-lg hover:shadow-2xl hover:shadow-navy/50"
        : "bg-white text-dark border-border shadow-sm hover:shadow-xl hover:border-orange/30"}
    `}>

      {/* Image de la formation */}
      <div className="h-48 w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          // Utilisation de group-hover pour que l'image zoome quand on survole la carte
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Contenu de la carte */}
      <div className="p-6 flex flex-col flex-grow relative">

        {/* Titre avec changement de couleur subtil au survol pour la version blanche */}
        <h3 className={`text-lg font-bold mb-5 min-h-[3rem] leading-tight transition-colors duration-300 ${!isNavy ? 'group-hover:text-orange' : ''}`}>
          {title}
        </h3>

        {/* Liste à puces orange */}
        <ul className="space-y-3 mb-8 flex-grow">
          {points.map((point, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <span className="text-orange mt-1.5 text-[10px] flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1">•</span>
              <span className={isNavy ? "text-white/90" : "text-muted"}>
                {point}
              </span>
            </li>
          ))}
        </ul>

        {/* Bouton transformé en lien interne React */}
        <Link
          to={href}
          className="btn-orange self-start text-sm py-2.5 px-6 no-underline inline-block transition-transform duration-300 hover:scale-105"
        >
          En savoir plus
        </Link>
      </div>
    </div>
  );
}