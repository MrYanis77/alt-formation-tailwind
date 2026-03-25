import React from 'react';
import { notreHistoire } from '../data/apropos';

const TexteSection = () => {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-[1100px] mx-auto px-6">
        <h2 className="font-heading text-[28px] md:text-[32px] font-bold text-navy mb-10">
          {notreHistoire.titre}
        </h2>
        <div className="flex flex-col gap-6">
          {notreHistoire.contenu.map((paragraphe, index) => (
            <p 
              key={index} 
              className="text-[15px] md:text-[16px] text-[#444] leading-relaxed max-w-4xl"
            >
              {paragraphe}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TexteSection;