import React from 'react';

export default function HeroFormation({ hero }) {
  if (!hero) return null;

  return (
    <section className="relative min-h-[550px] flex items-center overflow-hidden">
      {/* Background Image avec Overlay sombre */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000" 
          alt="Cyber Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-navy/85 mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 py-20">
        <div className="max-w-4xl">
          {/* Badge & Shield Icon */}
          <div className="flex items-center gap-3 mb-8">
            <div className="text-orange">
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M12 8v4M12 16h.01" strokeWidth="2" />
              </svg>
            </div>
            <span className="bg-orange text-white text-[12px] font-black px-4 py-2 rounded-full uppercase tracking-[0.15em]">
              {hero.badge || "Formation Bac+5"}
            </span>
          </div>

          {/* Titre Principal */}
          <h1 className="text-white text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
            {hero.titre}
          </h1>

          {/* Sous-titre / Description */}
          <p className="text-white/90 text-lg md:text-xl mb-12 max-w-2xl leading-relaxed font-body">
            {hero.description}
          </p>

          {/* Boutons Rectangulaires (Design Exact) */}
          <div className="flex flex-wrap gap-4">
            <button className="bg-orange hover:bg-orange-dark text-white px-10 py-5 rounded-md font-bold text-[14px] uppercase tracking-widest transition-all shadow-lg active:scale-95">
              Candidater maintenant
            </button>
            <button className="bg-white hover:bg-gray-100 text-navy px-10 py-5 rounded-md font-bold text-[14px] uppercase tracking-widest transition-all shadow-lg active:scale-95">
              Télécharger la brochure
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}