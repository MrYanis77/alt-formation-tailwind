import React, { useState } from 'react';

/**
 * CardModule.jsx — Design timeline vertical moderne
 * Section Programme de formation
 */
const CardModule = ({ module, index, isLast, density = 'default' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const compact = density === 'compact';
  const gapClass = compact ? 'gap-4' : 'gap-6';
  const btnSize = compact
    ? 'w-10 h-10 text-base'
    : 'w-12 h-12 text-lg';
  const connectorMin = compact ? 'min-h-[14px]' : 'min-h-[24px]';
  const contentPb = compact ? 'pb-4' : 'pb-8';

  return (
    <div className={`flex ${gapClass} group`}>

      {/* Timeline verticale (fil + pastille) */}
      <div className="flex flex-col items-center">
        {/* Pastille numérotée */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`relative z-10 flex-shrink-0 ${btnSize} rounded-full flex items-center justify-center font-heading font-black cursor-pointer border-2 transition-all duration-300
            ${isOpen
              ? 'bg-accent border-accent text-white shadow-lg shadow-accent/30 scale-110'
              : 'bg-white border-primary/20 text-primary group-hover:border-accent group-hover:text-accent'
            }`}
        >
          {module.id ?? (index + 1)}
        </button>
        {/* Fil connecteur */}
        {!isLast && (
          <div className={`w-0.5 flex-1 ${connectorMin} transition-colors duration-300 ${isOpen ? 'bg-accent/40' : 'bg-primary/10 group-hover:bg-accent/20'}`} />
        )}
      </div>

      {/* Contenu du module */}
      <div className={`flex-1 ${contentPb} transition-all duration-300`}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left cursor-pointer bg-transparent border-none p-0 flex items-center justify-between gap-4"
        >
          <h3 className={`font-heading font-bold text-base md:text-lg leading-snug transition-colors duration-200 ${isOpen ? 'text-accent' : 'text-primary group-hover:text-accent'}`}>
            {module.titre}
          </h3>
          {module.description && (
            <svg
              className={`w-5 h-5 flex-shrink-0 text-content-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          )}
        </button>

        {/* Accordéon description */}
        <div className={`overflow-hidden transition-all duration-400 ease-in-out ${isOpen ? 'max-h-40 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
          {module.description && (
            <p className="text-content-muted text-sm leading-relaxed pl-0 border-l-2 border-accent/30 pl-4">
              {module.description}
            </p>
          )}
          {module.duree && (
            <span className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-accent uppercase tracking-wider">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
              </svg>
              {module.duree}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardModule;