import React from 'react';
import Hero from '../components/Hero/Hero';
import Breadcrumb from '../components/Breadcrumb';
import TexteSection from '../components/Textes/TexteSection';

import dataCoaching from '../data/json/coaching.json';

// Icône check pour les listes
const CheckIcon = () => (
    <svg className="w-5 h-5 text-orange shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
);

export default function Coaching() {
    const currentData = dataCoaching.coaching;

    if (!currentData) return <div className="text-center py-20 font-heading text-navy">Chargement des données...</div>;

    const texteSectionData = {
        titre: currentData.titre,
        contenu: [
            currentData.tagline,
            currentData.description
        ],
        image: currentData.imageCoaching || currentData.image
    };

    return (
        <div className="bg-white min-h-screen antialiased">

            {/* 1. HERO */}
            <Hero
                title={currentData.titre}
                subtitle={currentData.hero?.sousTitre}
                video={currentData.hero?.video}
            />

            {/* 2. BREADCRUMB */}
            <Breadcrumb items={[
                { label: 'Accueil', to: '/' },
                { label: 'Gestion de carrière' },
                { label: currentData.titre }
            ]} />

            {/* 3. SECTION TEXTE & IMAGE */}
            <TexteSection data={texteSectionData} imageRight={true} />

            {/* 4. TYPES DE COACHING (Design personnalisé Tailwind) */}
            {(currentData.coachingIndividuel || currentData.coachingEquipe) && (
                <section className="py-24 bg-gray-50 border-t border-gray-100">
                    <div className="max-w-[1200px] mx-auto px-6">

                        <div className="text-center mb-16">
                            <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-navy uppercase tracking-wide">
                                Nos formules d'accompagnement
                            </h2>
                            <div className="w-20 h-1.5 bg-orange mx-auto mt-6 rounded-full"></div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                            {/* Carte : Coaching Individuel */}
                            {currentData.coachingIndividuel && (
                                <div className="bg-white rounded-[24px] p-8 md:p-12 shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                                    <div className="absolute top-0 left-0 w-full h-2 bg-orange"></div>
                                    <h3 className="font-heading text-2xl font-bold text-navy mb-4">
                                        {currentData.coachingIndividuel.titre}
                                    </h3>
                                    <p className="text-muted font-body leading-relaxed mb-8">
                                        {currentData.coachingIndividuel.intro}
                                    </p>
                                    <ul className="space-y-4">
                                        {(currentData.coachingIndividuel.benefices || []).map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-navy font-medium font-body text-[15px]">
                                                <CheckIcon />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Carte : Coaching d'Équipe */}
                            {currentData.coachingEquipe && (
                                <div className="bg-navy rounded-[24px] p-8 md:p-12 shadow-xl shadow-navy/20 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                                    {/* Forme décorative en fond */}
                                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>

                                    <h3 className="font-heading text-2xl font-bold text-white mb-4 relative z-10">
                                        {currentData.coachingEquipe.titre}
                                    </h3>
                                    <p className="text-white/80 font-body leading-relaxed mb-8 relative z-10">
                                        {currentData.coachingEquipe.description}
                                    </p>
                                    <ul className="space-y-4 relative z-10">
                                        {(currentData.coachingEquipe.axes || []).map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-white font-medium font-body text-[15px]">
                                                {/* Icône spécifique blanche/orange */}
                                                <svg className="w-5 h-5 text-orange shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                        </div>
                    </div>
                </section>
            )}

            {/* 5. POURQUOI CHOISIR (Design personnalisé Tailwind avec numérotation élégante) */}
            {currentData.pourquoiChoisir?.avantages && currentData.pourquoiChoisir.avantages.length > 0 && (
                <section className="py-24 bg-white">
                    <div className="max-w-[1200px] mx-auto px-6">

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                            <div className="max-w-2xl">
                                <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-navy uppercase tracking-wide mb-6">
                                    {currentData.pourquoiChoisir.titre}
                                </h2>
                                {currentData.pourquoiChoisir.intro && (
                                    <p className="text-[17px] text-muted leading-relaxed font-body">
                                        {currentData.pourquoiChoisir.intro}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {currentData.pourquoiChoisir.avantages.map((avantage, idx) => (
                                <div
                                    key={idx}
                                    className="group p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-orange transition-colors duration-300 flex flex-col h-full"
                                >
                                    {/* Chiffre stylisé */}
                                    <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <span className="font-heading text-xl font-bold text-orange">
                                            0{idx + 1}
                                        </span>
                                    </div>
                                    <h4 className="font-heading text-[18px] font-bold text-navy mb-3 group-hover:text-white transition-colors duration-300">
                                        {avantage.titre}
                                    </h4>
                                    <p className="text-[14px] text-muted font-body leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                                        {avantage.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                    </div>
                </section>
            )}

            {/* 6. CTA FINAL (Design personnalisé Tailwind) */}
            {currentData.cta && currentData.cta.length > 0 && (
                <section className="relative py-24 px-6 bg-navy text-center overflow-hidden">
                    {/* Décoration d'arrière-plan */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="max-w-[800px] mx-auto relative z-10">
                        <h2 className="font-heading text-3xl md:text-5xl font-extrabold text-white mb-10 uppercase leading-tight tracking-tight">
                            Prêt(e) à développer votre potentiel ?
                        </h2>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <a
                                href={currentData.cta[0]?.url}
                                className="w-full sm:w-auto inline-block bg-orange hover:bg-white text-white hover:text-orange px-10 py-4 rounded-lg font-heading font-bold shadow-lg shadow-orange/20 transition-all duration-300 hover:-translate-y-1 uppercase tracking-wider"
                            >
                                {currentData.cta[0]?.label}
                            </a>

                            {currentData.cta[1] && (
                                <a
                                    href={currentData.cta[1]?.url}
                                    className="w-full sm:w-auto inline-block bg-transparent border-2 border-white/70 text-white hover:bg-white hover:text-navy px-10 py-4 rounded-lg font-heading font-bold transition-all duration-300 hover:-translate-y-1 uppercase tracking-wider"
                                >
                                    {currentData.cta[1]?.label}
                                </a>
                            )}
                        </div>
                    </div>
                </section>
            )}

        </div>
    );
}