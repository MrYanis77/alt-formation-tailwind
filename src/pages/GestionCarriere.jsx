import React from 'react';
import Hero from '../components/Hero/Hero';
import Breadcrumb from '../components/Breadcrumb';
import TexteSection from '../components/Textes/TexteSection';
import dataCarriere from '../data/json/carriere.json';
import CallToAction from '../components/CallToAction';

// --- ICÔNES SVG ---
const CheckIcon = () => (
    <svg className="w-5 h-5 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
);

export default function GestionCarriere() {
    // EXTRACTION STRICTE DES DONNÉES DU JSON
    const globalData = dataCarriere?.gestionCarriere;

    if (!globalData) {
        return <div className="text-center py-20 font-heading text-primary text-xl">Chargement des données...</div>;
    }

    // PRÉPARATION DE LA SECTION TEXTE D'INTRODUCTION
    const introSectionData = {
        titre: globalData.titre,
        contenu: [
            globalData.tagline,
            globalData.description
        ].filter(Boolean),
        image: globalData.image
    };

    const bilanCompetencesData = globalData.bilanDeCompetences;

    return (
        <div className="bg-white min-h-screen antialiased">

            {/* --- HERO --- */}
            <Hero
                title={globalData.hero.titre}
                subtitle={globalData.hero.sousTitre}
                video={globalData.hero.video}
            />

            {/* --- BREADCRUMB --- */}
            <Breadcrumb items={[
                { label: 'Accueil', to: '/' },
                { label: globalData.titre }
            ]} />

            {/* --- INTRODUCTION GESTION DE CARRIÈRE --- */}
            <TexteSection data={introSectionData} imageRight={true} />

            {/* --- BLOC : LE BILAN DE COMPÉTENCES --- */}
            <section className="pt-16 pb-20 bg-gray-50 border-t border-gray-200">
                <div className="max-w-container-xl mx-auto px-6">

                    <div className="text-center mb-12">
                        <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-primary uppercase tracking-wide">
                            {bilanCompetencesData.titre}
                        </h2>
                        <div className="w-20 h-1.5 bg-accent mx-auto mt-6 rounded-full mb-8"></div>
                        <p className="text-[17px] text-content-muted leading-relaxed font-body max-w-3xl mx-auto">
                            {bilanCompetencesData.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                        {/* Objectifs */}
                        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                            <h3 className="font-heading text-2xl font-bold text-primary mb-6">Objectifs de la démarche</h3>
                            <ul className="space-y-4">
                                {bilanCompetencesData.objectifs.map((obj, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-content-muted font-body">
                                        <CheckIcon />
                                        <span>{obj}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Image Bilan */}
                        <div className="rounded-2xl overflow-hidden shadow-md">
                            <img src={globalData.image} alt={bilanCompetencesData.titre} className="w-full h-full object-cover" />
                        </div>
                    </div>

                    {/* Les 3 phases */}
                    <div className="text-center mb-10">
                        <h3 className="font-heading text-2xl font-bold text-primary uppercase tracking-wide">
                            Les 3 phases de l'accompagnement
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {bilanCompetencesData.lesTroisPhases.map((etape, idx) => (
                            <div key={idx} className="group p-8 rounded-2xl bg-white border border-gray-200 hover:bg-accent transition-colors duration-300 flex flex-col h-full shadow-sm">
                                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <span className="font-heading text-xl font-bold text-accent">0{idx + 1}</span>
                                </div>
                                <h4 className="font-heading text-[18px] font-bold text-primary mb-4 group-hover:text-white transition-colors duration-300">
                                    {etape.phase}
                                </h4>
                                <p className="text-sm text-content-muted font-body leading-relaxed group-hover:text-white/90 transition-colors duration-300 mt-auto">
                                    {etape.details}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- POURQUOI CHOISIR --- */}
            <section className="py-24 bg-white border-t border-gray-100">
                <div className="max-w-container-xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-primary uppercase tracking-wide mb-6">
                            {globalData.pourquoiChoisir.titre}
                        </h2>
                        <p className="text-[17px] text-content-muted leading-relaxed font-body max-w-3xl mx-auto">
                            {globalData.pourquoiChoisir.intro}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {globalData.pourquoiChoisir.avantages.map((avantage, idx) => (
                            <div key={idx} className="group p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-accent transition-all duration-300 shadow-sm">
                                <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <span className="font-heading text-xl font-bold text-accent">0{idx + 1}</span>
                                </div>
                                <h4 className="font-heading text-[18px] font-bold text-primary mb-3 group-hover:text-white transition-colors">{avantage.titre}</h4>
                                <p className="text-sm text-content-muted font-body group-hover:text-white/90 transition-colors">{avantage.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- TESTS EXTÉRIEURS --- */}
            <section className="py-24 bg-gray-50 border-t border-gray-100">
                <div className="max-w-container-xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-primary uppercase tracking-wide mb-6">
                            {globalData.testsExterieurs.titre}
                        </h2>
                        <p className="text-[17px] text-content-muted leading-relaxed font-body">
                            {globalData.testsExterieurs.intro}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {globalData.testsExterieurs.tests.map((test, idx) => (
                            <div key={idx} className="bg-white rounded-2xl p-8 border border-gray-100 flex flex-col h-full hover:shadow-lg transition-all duration-300">
                                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                </div>
                                <h4 className="font-heading text-xl font-bold text-primary mb-3">{test.nom}</h4>
                                <p className="text-content-muted font-body text-medium leading-relaxed mb-8 flex-grow">{test.description}</p>
                                <a href={test.lien} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-accent font-bold font-heading hover:text-primary transition-colors mt-auto">
                                    {test.labelLien}
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CTA FINAL --- */}
            {globalData.cta && globalData.cta.length > 0 && (
                <CallToAction
                    variante="sombre"
                    titre="Prêt(e) à faire le point sur votre carrière ?"
                    texteBouton={globalData.cta[0]?.label}
                    lienBouton={globalData.cta[0]?.url}
                    texteBoutonSecondaire={globalData.cta[1]?.label}
                    lienBoutonSecondaire={globalData.cta[1]?.url}
                />
            )}

        </div>
    );
}