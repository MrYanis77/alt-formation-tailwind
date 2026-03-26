import React from 'react';

/**
 * CardModule.jsx — Design fidèle à l'image 3eb566.png
 * Pour la section Programme de formation
 */
const CardModule = ({ module }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
      
      {/* Cercle numéroté : Fond Navy profond, Texte blanc */}
      <div className="flex-shrink-0 w-16 h-16 bg-[#112240] rounded-full flex items-center justify-center">
        <span className="text-white font-black text-2xl">
          {module.id}
        </span>
      </div>

      {/* Contenu textuel */}
      <div className="flex flex-col gap-2">
        {/* Titre du module : Navy, gras */}
        <h3 className="font-heading font-black text-[#112240] text-xl">
          {module.titre}
        </h3>

        {/* Durée avec icône horloge orange */}
        <div className="flex items-center gap-2 text-muted">
          <svg 
            className="w-5 h-5 text-[#F29244]" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[15px] font-medium">
            Durée : {module.duree}
          </span>
        </div>
      </div>

    </div>
  );
};

export default CardModule;