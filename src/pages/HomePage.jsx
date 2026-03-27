// Page d'accueil d'ALT FORMATIONS
// - Structure les sections principales (Hero, stats, services, vidéo, témoignages)
// - Gère le carousel dynamique avec framer-motion

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import des composants
import HeroSlide from '../components/HeroSlide';
import StatsSection from '../components/StatsSection';
import ServicesGrid from '../components/CardGrid';
import VideoSection from '../components/VideoSection';
import TrustSection from '../components/TrustSection';

// Import des données
import { slides, stats, services, partenaires, temoignages } from '../data/home';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play du carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // 6 secondes pour laisser le temps de lire
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white antialiased">
      
      {/* SECTION 1 : HERO CAROUSEL DYNAMIQUE */}
      <section className="relative h-[600px] md:h-[550px] bg-navy overflow-hidden flex items-center">
        
        {/* Images de fond animées (Transition fluide entre les images) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${currentSlide}`}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.4, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-0"
          >
            <img 
              src={slides[currentSlide].image} 
              className="w-full h-full object-cover" 
              alt="Décor campus" 
            />
          </motion.div>
        </AnimatePresence>

        {/* Overlay dégradé pour la lisibilité du texte */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-navy via-navy/80 to-transparent" />

        {/* Contenu de la Slide */}
        <div className="container mx-auto relative z-20 px-6 md:px-[60px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <HeroSlide slide={slides[currentSlide]} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Barre de Navigation (Dots modernes) */}
        <div className="absolute bottom-10 left-6 md:left-[60px] z-30 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                index === currentSlide ? 'w-10 bg-orange' : 'w-4 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Aller à la slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* SECTION 2 : STATS */}
      <StatsSection stats={stats} />

      {/* SECTION 3 : NOS SERVICES */}
      <section className="py-[80px] px-6 md:px-[60px] max-w-[1200px] mx-auto">
        <h2 className="font-heading text-2xl md:text-[32px] font-extrabold text-navy text-center mb-[50px] uppercase tracking-wider">
          Nos services
        </h2>
        <ServicesGrid services={services} />
      </section>

      {/* SECTION 4 : VIDÉO */}
      <VideoSection title="Découvrez ALT FORMATIONS en vidéo" />

      {/* SECTION 5 : CONFIANCE & TÉMOIGNAGES */}
      <TrustSection partenaires={partenaires} temoignages={temoignages} />

      <section className="py-[70px] px-6 max-w-[1100px] mx-auto">
        <h2 className="font-heading text-2xl md:text-[32px] font-extrabold text-dark text-center mb-16 uppercase tracking-wider">
          Témoignages
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {temoignages.map((t, idx) => (
            <article key={idx} className="bg-white p-8 border-l-4 border-l-orange shadow-sm rounded-r-xl flex flex-col justify-between hover:shadow-md transition-shadow">
              <blockquote className="text-[15px] italic text-[#555] leading-relaxed mb-8 font-body">
                "{t.quote}"
              </blockquote>
              <div>
                <p className="font-heading font-bold text-navy text-[16px]">{t.author}</p>
                <p className="text-orange text-[12px] font-bold uppercase tracking-widest font-body mt-1">{t.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SECTION 6 : CTA FINAL */}
      <section className="py-24 px-6 bg-slate-50 text-center border-t border-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-[28px] md:text-[36px] font-extrabold text-navy mb-6 uppercase tracking-tight">
            Prêt à transformer votre carrière ?
          </h2>
          <p className="text-muted text-[16px] mb-10 leading-relaxed font-body max-w-2xl mx-auto">
            Rejoignez une communauté de talents et bénéficiez d'un accompagnement sur mesure pour réussir votre insertion professionnelle.
          </p>
          <a 
            href="/contact" 
            className="btn-orange inline-block py-4 px-12 text-sm shadow-xl hover:-translate-y-1 transition-all uppercase font-bold tracking-widest"
          >
            Demander un rendez-vous gratuit
          </a>
        </div>
      </section>

    </div>
  );
}