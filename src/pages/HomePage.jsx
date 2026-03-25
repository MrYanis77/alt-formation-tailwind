import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import des composants de contenu
import HeroSlide from '../components/HeroSlide';
import StatsSection from '../components/StatsSection';
import ServicesGrid from '../components/CardGrid';
import VideoSection from '../components/VideoSection';
import TrustSection from '../components/TrustSection';

// Import des données
import { slides, stats, services, partenaires, temoignages } from '../data/home';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white antialiased">
      {/* SECTION 1 : HERO CAROUSEL */}
      <section className="relative h-[500px] md:h-[450px] bg-navy overflow-hidden flex items-center">
        <div className="absolute inset-0 z-10 bg-linear-to-r from-navy via-navy/80 to-transparent" />
        
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/hero-bg.jpg" 
            className="w-full h-full object-cover opacity-30" 
            alt="Background" 
          />
        </div>

        <div className="container mx-auto relative z-20 px-6 md:px-[60px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <HeroSlide slide={slides[currentSlide]} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentSlide ? 'bg-orange scale-125' : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </section>

      <StatsSection stats={stats} />

      <section className="py-[70px] px-6 md:px-[60px] max-w-[1100px] mx-auto">
        <h2 className="font-heading text-2xl md:text-[32px] font-extrabold text-dark text-center mb-[50px] uppercase">
          Nos services
        </h2>
        <ServicesGrid services={services} />
      </section>

      <VideoSection title="Découvrez ALT FORMATIONS en vidéo" />

      <TrustSection partenaires={partenaires} temoignages={temoignages} />

      {/* CTA FINAL */}
      <section className="py-20 px-6 bg-white text-center border-t border-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-[28px] md:text-[34px] font-extrabold text-dark mb-4">
            Prêt à transformer votre carrière&nbsp;?
          </h2>
          <p className="text-muted text-[15px] mb-10 leading-relaxed font-body">
            Rencontrez nos conseillers et construisons ensemble votre projet professionnel.
          </p>
          <a href="#contact" className="btn-orange inline-block py-4 px-10 text-sm shadow-lg hover:-translate-y-1 transition-all">
            Demander un rendez-vous gratuit
          </a>
        </div>
      </section>
    </div>
  );
}