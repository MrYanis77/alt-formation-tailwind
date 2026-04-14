/**
 * Page d'accueil - ALT FORMATIONS
 * Ce fichier centralise les sections principales de la landing page :
 * - Hero Carousel : Diaporama dynamique avec vidéos en fond.
 * - StatsSection : Affichage des chiffres clés.
 * - Grille de Formations/Services : Affichage via CardFormation avec liens.
 * - VideoSection : Section de présentation vidéo.
 * - TrustSection : Bandeau de logos partenaires cliquables avec défilement infini.
 * - Témoignages : Grille de retours clients.
 * - Certification : Bandeau de réassurance Qualité.
 * - CTA Final : Appel à l'action pour la prise de contact.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import HeroSlide from '../components/Hero/HeroSlide';
import StatsSection from '../components/Stats/StatsSection';
import CardFormation from '../components/Card/CardFormation';
import VideoSection from '../components/VideoSection';
import CertificationSection from '../components/CertificationSection';

// Import des données statiques depuis home.js
import { slides, stats, presentation, services, partenaires, temoignages, certifications } from '../data/home';


export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const doublePartenaires = [...partenaires, ...partenaires];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  return (
    <div className="bg-white antialiased">

      {/* SECTION 1 : HERO CAROUSEL */}
      <section className="relative h-[600px] md:h-[550px] bg-navy overflow-hidden flex items-center group">
        {/* Animation de fond */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${currentSlide}`}
            initial={{ opacity: 0, scale: 1.1 }}
            // CORRECTION 1 : Opacité augmentée à 0.9 au lieu de 0.65 pour y voir plus clair
            animate={{ opacity: 0.9, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-0"
          >
            {/* Affichage de la vidéo en arrière-plan */}
            {slides[currentSlide].video ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src={slides[currentSlide].video} type="video/mp4" />
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

        {/* CORRECTION 2 : Dégradé beaucoup plus clair pour ne pas masquer l'image (navy/80 -> navy/30) */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-navy/80 via-navy/30 to-transparent" />

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

        {/* Flèches de navigation */}
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

      {/* SECTION PRÉSENTATION : Professionnels et engagés */}
      <section className="py-20 px-6 max-w-[1000px] mx-auto text-center">
        <h2 className="font-heading text-2xl md:text-[32px] font-extrabold text-navy uppercase tracking-wider mb-8">
          {presentation.titre}
        </h2>
        <div className="space-y-6 text-muted text-[16px] md:text-lg font-body leading-relaxed">
          <p className="font-bold text-orange text-xl mb-8">
            {presentation.accroche}
          </p>
          <p>
            {presentation.paragraphe1}
          </p>
          <p>
            {presentation.paragraphe2}
          </p>
          <div className="bg-gray-50 p-8 rounded-2xl mx-auto my-8 max-w-[800px] border border-gray-100 shadow-sm text-left">
            <p className="mb-4">
              <strong className="text-navy font-bold">{presentation.mission.label} </strong>
              {presentation.mission.texte}
            </p>
            <p>
              <strong className="text-navy font-bold">{presentation.objectif.label} </strong>
              {presentation.objectif.texte}
            </p>
          </div>
          <p className="font-bold text-navy text-[18px] md:text-xl pt-4">
            {presentation.conclusion}
          </p>
        </div>
      </section>

      {/* SECTION 3 : NOS SERVICES / FORMATIONS */}
      <section className="pb-[80px] pt-10 px-6 md:px-[60px] max-w-[1200px] mx-auto">
        <h2 className="font-heading text-2xl md:text-[32px] font-extrabold text-navy text-center mb-[50px] uppercase tracking-wider">
          Nos Formations & Services
        </h2>

        {/* Grille utilisant le composant CardFormation avec lien intégré */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <CardFormation
              key={index}
              title={service.titre}
              image={service.image || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600"}
              points={service.items}
              variant={service.theme || "white"}
              href={service.href || "#"}
            />
          ))}
        </div>
      </section>

      {/* SECTION 4 : VIDÉO */}
      <VideoSection title="Découvrez ALT FORMATIONS en vidéo" />

      {/* SECTION 5 : TRUST SECTION (LOGOS PARTENAIRES CLIQUABLES) */}
      <section className="py-[70px] bg-white border-t border-border overflow-hidden">
        <div className="max-w-[1100px] mx-auto px-6 mb-12">
          <h2 className="font-heading text-2xl md:text-[32px] font-extrabold text-[#1E2F47] text-center uppercase tracking-wider">
            Nos Partenaires
          </h2>
        </div>

        <div className="relative flex overflow-hidden group">
          <div className="flex py-4 animate-scroll whitespace-nowrap">
            {doublePartenaires.map((partenaire, index) => (
              <a
                key={index}
                href={partenaire.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-[150px] md:w-[200px] mx-8 md:mx-12 flex items-center justify-center transition-opacity duration-300 opacity-80 hover:opacity-100 cursor-pointer"
              >
                <img
                  src={partenaire.logo}
                  alt={partenaire.nom}
                  className="h-12 md:h-16 w-auto object-contain"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Animation de défilement infini */}
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

      {/* SECTION 7 : CERTIFICATION */}
      <CertificationSection data={certifications} />

      {/* SECTION 8 : CALL TO ACTION FINAL */}
      <section className="py-24 px-6 bg-slate-50 text-center border-t border-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-[28px] md:text-[33px] font-extrabold text-navy mb-6 uppercase tracking-tight">
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