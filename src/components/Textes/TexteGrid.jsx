import React from 'react';
import { nosValeurs } from '../../data/apropos';

const TexteGrid = () => {
  return (
    <section className="py-16 bg-surface-soft">
      <div className="max-w-[1100px] mx-auto px-6">
        <h2 className="font-heading text-h2 md:text-h1 font-bold text-primary mb-12 text-center">
          {nosValeurs.titre}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {nosValeurs.items.map((valeur, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
            >
              {/* Accent visuel orange */}
              <div className="w-12 h-1 bg-accent mb-6 rounded-full" />
              
              <h3 className="font-heading text-xl font-bold text-primary mb-4">
                {valeur.nom}
              </h3>
              
              <p className="text-sm text-content-muted leading-relaxed">
                {valeur.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TexteGrid;