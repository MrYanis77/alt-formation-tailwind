import React from 'react';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/80 backdrop-blur-sm transition-opacity duration-300">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner élégant avec les couleurs du thème */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-primary/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-accent rounded-full border-t-transparent animate-spin"></div>
        </div>
        
        {/* Texte de chargement optionnel */}
        <span className="text-primary font-heading font-bold text-sm uppercase tracking-widest animate-pulse">
          Chargement...
        </span>
      </div>
    </div>
  );
};

export default PageLoader;
