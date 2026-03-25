import React from 'react';
import { nosValeurs } from '../data/apropos';

const TexteGrid = () => {
  return (
    <section className="py-16 bg-[#f9fafb]">
      <div className="max-w-[1100px] mx-auto px-6">
        <h2 className="font-heading text-[28px] md:text-[32px] font-bold text-navy mb-12 text-center">
          {nosValeurs.titre}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {nosValeurs.items.map((valeur, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
            >
              {/* Accent visuel orange */}
              <div className="w-12 h-1 bg-orange mb-6 rounded-full" />
              
              <h3 className="font-heading text-xl font-bold text-navy mb-4">
                {valeur.nom}
              </h3>
              
              <p className="text-[14px] text-[#555] leading-relaxed">
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