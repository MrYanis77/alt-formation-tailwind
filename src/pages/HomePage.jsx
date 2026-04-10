/**
 * Page d'accueil - ALT FORMATIONS
 * Ce fichier centralise les sections principales de la landing page :
 * - Hero Carousel : Diaporama dynamique avec Framer Motion (slides importées).
 * - StatsSection : Affichage des chiffres clés.
 * - ServicesGrid : Grille des prestations proposées.
 * - VideoSection : Section de présentation vidéo.
 * - TrustSection : (Intégrée) Bandeau de logos partenaires avec défilement infini en CSS.
 * - Témoignages : Grille de retours clients avec un design à bordure colorée.
 * - CTA Final : Appel à l'action pour la prise de contact.
 * Dépendances : framer-motion, tailwindcss
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import des sous-composants
import HeroSlide from '../components/Hero/HeroSlide';
import StatsSection from '../components/Stats/StatsSection';
import ServicesGrid from '../components/Card/CardGrid';
import VideoSection from '../components/VideoSection';

// Import des données statiques
import { slides, stats, services, partenaires, temoignages } from '../data/home';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Préparation des logos pour l'effet "marquée" (boucle infinie)
  const doublePartenaires = [...partenaires, ...partenaires];

  // Gestion du cycle automatique du Hero (toutes les 6 secondes)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white antialiased">

      {/* SECTION 1 : HERO CAROUSEL */}
      <section className="relative h-[600px] md:h-[550px] bg-navy overflow-hidden flex items-center group">
        {/* Animation de fond */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${currentSlide}`}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.65, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-0"
          >
            {/* VÉRIFICATION : Si une vidéo existe, on l'affiche, sinon on affiche l'image */}
            {slides[currentSlide].video ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src={slides[currentSlide].video} type="video/mp4" />
                {/* Fallback image si la vidéo ne charge pas */}
                <img
                  src={slides[currentSlide].image}
                  className="w-full h-full object-cover"
                  alt="Background ALT Formations fallback"
                />
              </video>
            ) : (
              <img
                src={slides[currentSlide].image}
                className="w-full h-full object-cover"
                alt="Background ALT Formations"
              />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 z-10 bg-gradient-to-r from-navy via-navy/60 to-transparent" />

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

        {/* Flèches de navigation (Visibles au hover) */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
          className="absolute left-2 md:left-6 inset-y-0 my-auto h-12 w-12 flex items-center justify-center bg-black/20 hover:bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all z-30"
          aria-label="Slide précédent"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="absolute right-2 md:right-6 inset-y-0 my-auto h-12 w-12 flex items-center justify-center bg-black/20 hover:bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all z-30"
          aria-label="Slide suivant"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>

        {/* Navigation Dots */}
        <div className="absolute bottom-10 left-6 md:left-[60px] z-30 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-500 ${index === currentSlide ? 'w-10 bg-orange' : 'w-4 bg-white/30 hover:bg-white/60'
                }`}
              aria-label={`Slide ${index + 1}`}
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

      {/* SECTION 5 : TRUST SECTION (LOGOS) */}
      <section className="py-[70px] bg-white border-t border-border overflow-hidden">
        <div className="max-w-[1100px] mx-auto px-6 mb-12">
          <h2 className="font-heading text-2xl md:text-[32px] font-extrabold text-[#1E2F47] text-center uppercase tracking-wider">
            Nos Partenaires
          </h2>
        </div>

        <div className="relative flex overflow-hidden group">
          <div className="flex py-4 animate-scroll whitespace-nowrap">
            {doublePartenaires.map((partenaire, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[150px] md:w-[200px] mx-8 md:mx-12 flex items-center justify-center transition-opacity duration-300 opacity-80 hover:opacity-100"
              >
                <img
                  src={partenaire.logo}
                  alt={partenaire.nom}
                  className="h-12 md:h-16 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Style CSS inline pour l'animation de défilement infini */}
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll {
            display: flex;
            width: max-content;
            animation: scroll 40s linear infinite;
          }
          .animate-scroll:hover {
            animation-play-state: paused;
          }
        `}} />
      </section>

      {/* SECTION 6 : TÉMOIGNAGES */}
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

      {/* SECTION 7 : CALL TO ACTION */}
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