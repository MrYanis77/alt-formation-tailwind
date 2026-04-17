import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero/Hero';
import Breadcrumb from '../components/Breadcrumb';
import { heroHub, parcours } from '../data/dataAccompagnement';

// --- ICÔNES SVG ---
const CheckIcon = () => (
    <svg className="w-5 h-5 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
);

const CompassIcon = () => (
    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.494 9.06a4.013 4.013 0 01-2.453 2.452l-5.666 1.889a.5.5 0 01-.632-.632l1.889-5.666a4.013 4.013 0 012.453-2.452l5.666-1.889a.5.5 0 01.632.632l-1.889 5.666z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
    </svg>
);

const RocketIcon = () => (
    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 10.5L21 3m-7.5 7.5v9l-3.5-3.5-2.5 2.5v-5l-4-4h5l2.5-2.5 3.5 3.5zM10.5 13.5l-3 3M15 9l3-3" />
    </svg>
);

export default function CarrierePage() {
    return (
        <div className="bg-surface-soft min-h-screen antialiased">

            {/* --- HERO --- */}
            <Hero
                title={heroHub.titre}
                subtitle={heroHub.sousTitre}
                video={heroHub.video}
            />

            {/* --- BREADCRUMB --- */}
            <Breadcrumb items={[
                { label: 'Accueil', to: '/' },
                { label: 'Nos Accompagnements' }
            ]} />

            {/* --- SECTION CHOIX DU PARCOURS --- */}
            <section className="py-24">
                <div className="max-w-container-xl mx-auto px-6">

                    {/* En-tête de section */}
                    <div className="text-center mb-16">
                        <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-primary tracking-wide">
                            {parcours.titreSection}
                        </h2>
                        <div className="w-20 h-1.5 bg-accent mx-auto mt-6 rounded-full mb-6"></div>
                        <p className="text-[17px] text-content-muted leading-relaxed font-body max-w-2xl mx-auto">
                            {parcours.descriptionSection}
                        </p>
                    </div>

                    {/* Grille des 2 choix */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                        {/* CARTE 1 : GESTION DE CARRIÈRE */}
                        <div className="bg-white rounded-card p-10 md:p-12 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col h-full group hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-20 h-20 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                                <CompassIcon />
                            </div>
                            <h3 className="font-heading text-3xl font-bold text-primary mb-3">
                                {parcours.gestionCarriere.titre}
                            </h3>
                            <p className="text-accent font-bold font-body mb-6">
                                {parcours.gestionCarriere.tagline}
                            </p>
                            <p className="text-content-muted font-body leading-relaxed mb-8">
                                {parcours.gestionCarriere.description}
                            </p>

                            <ul className="space-y-4 mb-10 flex-grow">
                                {parcours.gestionCarriere.benefices.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-content font-medium font-body">
                                        <CheckIcon />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                to={parcours.gestionCarriere.ctaUrl}
                                className="w-full text-center bg-primary hover:bg-primary-light text-white px-6 py-4 rounded-btn font-heading font-bold text-lg transition-colors duration-200"
                            >
                                {parcours.gestionCarriere.ctaLabel}
                            </Link>
                        </div>

                        {/* CARTE 2 : COACHING EMPLOI */}
                        <div className="bg-white rounded-card p-10 md:p-12 shadow-xl shadow-accent/10 border border-accent/20 flex flex-col h-full group hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden">
                            {/* Petit effet visuel en fond de carte */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full z-0"></div>

                            <div className="relative z-10 w-20 h-20 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                                <RocketIcon />
                            </div>
                            <h3 className="relative z-10 font-heading text-3xl font-bold text-primary mb-3">
                                {parcours.coachingEmploi.titre}
                            </h3>
                            <p className="relative z-10 text-accent font-bold font-body mb-6">
                                {parcours.coachingEmploi.tagline}
                            </p>
                            <p className="relative z-10 text-content-muted font-body leading-relaxed mb-8">
                                {parcours.coachingEmploi.description}
                            </p>

                            <ul className="relative z-10 space-y-4 mb-10 flex-grow">
                                {parcours.coachingEmploi.benefices.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-content font-medium font-body">
                                        <CheckIcon />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                to={parcours.coachingEmploi.ctaUrl}
                                className="relative z-10 w-full text-center btn-orange py-4 text-lg"
                            >
                                {parcours.coachingEmploi.ctaLabel}
                            </Link>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}