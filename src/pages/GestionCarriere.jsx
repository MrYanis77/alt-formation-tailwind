import React, { useState } from 'react';
import Hero from '../components/Hero/Hero';
import Breadcrumb from '../components/Breadcrumb';
import TexteSection from '../components/Textes/TexteSection';
import dataCarriere from '../data/json/carriere.json';
import CallToAction from '../components/CallToAction';

// --- ICÔNES SVG ---
const CheckIcon = () => (
    <svg className="w-5 h-5 text-orange shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
);
const Clock = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const Users = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const Calendar = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
const MapPin = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;

export default function GestionCarriere() {
    // 1. GESTION DES ONGLETS (Bilans)
    const [bilanView, setBilanView] = useState('bilanDeCompetences');

    // 2. EXTRACTION ROBUSTE DES DONNÉES
    // Données globales pour la page
    const globalData = dataCarriere?.gestionCarriere || dataCarriere;

    // Données spécifiques pour l'onglet Bilan actif (cherche à la racine ou dans gestionCarriere)
    const currentBilanData = dataCarriere[bilanView] || globalData[bilanView];

    if (!globalData || Object.keys(globalData).length === 0) {
        return <div className="text-center py-20 font-heading text-navy text-xl">Chargement des données...</div>;
    }

    // 3. PRÉPARATION DE LA SECTION TEXTE D'INTRODUCTION
    const introSectionData = {
        titre: globalData.titre || "Gestion de carrière",
        contenu: [
            globalData.tagline,
            globalData.description
        ].filter(Boolean),
        image: globalData.imageCoaching || globalData.image || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"
    };

    // 4. PRÉPARATION DE LA SECTION TEXTE DU BILAN ACTIF
    const bilanTexteSectionData = currentBilanData ? {
        titre: bilanView === 'bilanDeCompetences' ? 'En quoi ça consiste ?' : currentBilanData.pourquoi?.titre,
        contenu: bilanView === 'bilanDeCompetences'
            ? currentBilanData.descriptionComplete || [currentBilanData.description]
            : [
                currentBilanData.pourquoi?.description,
                currentBilanData.pourquoi?.pourQui,
                ...(currentBilanData.pourquoi?.items?.map(i => `• ${i}`) || [])
            ].filter(Boolean),
        image: currentBilanData.image || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800"
    } : null;

    return (
        <div className="bg-white min-h-screen antialiased">

            {/* --- HERO --- */}
            <Hero
                title={globalData.hero?.titre || globalData.titre || "Gestion de Carrière"}
                subtitle={globalData.hero?.sousTitre}
                video={globalData.hero?.video}
            />

            {/* --- BREADCRUMB --- */}
            <Breadcrumb items={[
                { label: 'Accueil', to: '/' },
                { label: 'Gestion de carrière' }
            ]} />

            {/* --- INTRODUCTION GESTION DE CARRIÈRE --- */}
            {introSectionData.contenu.length > 0 && (
                <TexteSection data={introSectionData} imageRight={true} />
            )}

            {/* ========================================== */}
            {/* --- BLOC DYNAMIQUE : LES BILANS CARRIÈRE --- */}
            {/* ========================================== */}

            <section className="pt-10 pb-6 bg-gray-50 border-t border-gray-200 mt-12">
                <div className="max-w-[1200px] mx-auto text-center px-6">
                    <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-navy uppercase tracking-wide mb-8">
                        Nos Bilans Professionnels
                    </h2>

                    {/* TOGGLE BOUTONS */}
                    <div className="flex bg-white p-1.5 rounded-full shadow-sm w-fit mx-auto border border-gray-200 flex-wrap justify-center gap-2 mb-8">
                        <button
                            onClick={() => setBilanView('bilanDeCompetences')}
                            className={`px-8 py-3 rounded-full font-heading font-bold transition-all duration-300 cursor-pointer ${bilanView === 'bilanDeCompetences' ? 'bg-orange text-white shadow-md' : 'text-gray-500 hover:text-navy'}`}
                        >
                            Bilan de compétences
                        </button>
                        <button
                            onClick={() => setBilanView('bilanDeMiCarriere')}
                            className={`px-8 py-3 rounded-full font-heading font-bold transition-all duration-300 cursor-pointer ${bilanView === 'bilanDeMiCarriere' ? 'bg-navy text-white shadow-md' : 'text-gray-500 hover:text-navy'}`}
                        >
                            Bilan de mi-carrière
                        </button>
                    </div>
                </div>
            </section>

            {currentBilanData && (
                <div className="bg-gray-50 pb-20">
                    {/* Texte Explicatif du Bilan */}
                    {bilanTexteSectionData?.contenu?.length > 0 && (
                        <div className="bg-white">
                            <TexteSection data={bilanTexteSectionData} imageRight={false} />
                        </div>
                    )}

                    {/* Informations Pratiques du Bilan */}
                    {(currentBilanData.publicConcerne || currentBilanData.duree || currentBilanData.delaiAcces || currentBilanData.lieu) && (
                        <div className="max-w-[1200px] mx-auto px-6 py-20">
                            <div className="text-center mb-16">
                                <h3 className="font-heading text-2xl md:text-3xl font-extrabold text-navy uppercase tracking-wide">Informations pratiques</h3>
                                <div className="w-20 h-1.5 bg-orange mx-auto mt-6 rounded-full"></div>
                            </div>
                            <div className={`grid grid-cols-1 md:grid-cols-2 ${bilanView === 'bilanDeCompetences' ? 'lg:grid-cols-4' : 'lg:grid-cols-2 max-w-4xl mx-auto'} gap-8`}>
                                {currentBilanData.publicConcerne && (
                                    <div className="bg-white rounded-[24px] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                                        <div className="absolute top-0 left-0 w-full h-2 bg-orange transition-all duration-300 group-hover:h-3"></div>
                                        <div className="text-orange mb-6"><Users /></div>
                                        <h4 className="font-heading text-xl font-bold text-navy mb-4">{currentBilanData.publicConcerne.titre}</h4>
                                        <ul className="space-y-3">
                                            {(currentBilanData.publicConcerne.items || []).map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-[14px] text-muted font-body"><span className="text-orange font-bold mt-0.5">•</span><span>{item}</span></li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {currentBilanData.duree && (
                                    <div className="bg-white rounded-[24px] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                                        <div className="absolute top-0 left-0 w-full h-2 bg-orange transition-all duration-300 group-hover:h-3"></div>
                                        <div className="text-orange mb-6"><Clock /></div>
                                        <h4 className="font-heading text-xl font-bold text-navy mb-4">{currentBilanData.duree.titre}</h4>
                                        {currentBilanData.duree.total && <p className="font-bold text-navy mb-3 text-[15px]">{currentBilanData.duree.total}</p>}
                                        <ul className="space-y-3">
                                            {(currentBilanData.duree.detail || currentBilanData.duree.items || []).map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-[14px] text-muted font-body"><span className="text-orange font-bold mt-0.5">•</span><span>{item}</span></li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {currentBilanData.delaiAcces && (
                                    <div className="bg-white rounded-[24px] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                                        <div className="absolute top-0 left-0 w-full h-2 bg-orange transition-all duration-300 group-hover:h-3"></div>
                                        <div className="text-orange mb-6"><Calendar /></div>
                                        <h4 className="font-heading text-xl font-bold text-navy mb-4">{currentBilanData.delaiAcces.titre}</h4>
                                        {currentBilanData.delaiAcces.delai && <p className="font-bold text-navy mb-3 text-[15px]">{currentBilanData.delaiAcces.delai}</p>}
                                        <ul className="space-y-3">
                                            {(currentBilanData.delaiAcces.detail || []).map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-[14px] text-muted font-body"><span className="text-orange font-bold mt-0.5">•</span><span>{item}</span></li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {currentBilanData.lieu && (
                                    <div className="bg-white rounded-[24px] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                                        <div className="absolute top-0 left-0 w-full h-2 bg-orange transition-all duration-300 group-hover:h-3"></div>
                                        <div className="text-orange mb-6"><MapPin /></div>
                                        <h4 className="font-heading text-xl font-bold text-navy mb-4">{currentBilanData.lieu.titre}</h4>
                                        <p className="text-[14px] text-muted mb-3">{currentBilanData.lieu.description}</p>
                                        <div className="p-3 bg-gray-50 rounded-lg text-[13px] text-muted mb-4 italic">{currentBilanData.lieu.accessibilite}</div>
                                        <div className="text-[14px] font-bold text-navy space-y-1">
                                            <p>📞 {currentBilanData.lieu.contact?.telephone}</p>
                                            <p>✉️ {currentBilanData.lieu.contact?.email}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Outils & Étapes du Bilan */}
                    {(currentBilanData.outilsMethodes || currentBilanData.objectifs || currentBilanData.etapes) && (
                        <div className="bg-white py-20 border-y border-gray-100">
                            <div className="max-w-[1200px] mx-auto px-6">

                                {/* Outils ou Objectifs */}
                                {(currentBilanData.outilsMethodes || currentBilanData.objectifs) && (
                                    <div className="mb-20">
                                        <div className="text-center mb-12">
                                            <h3 className="font-heading text-2xl md:text-3xl font-extrabold text-navy uppercase tracking-wide">
                                                {currentBilanData.outilsMethodes ? "Nos outils & méthodes" : "Objectifs de l'accompagnement"}
                                            </h3>
                                        </div>
                                        {currentBilanData.outilsMethodes && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {['accompagnementIndividualise', 'outilsAnalyse', 'enquetesMetiers', 'tests', 'ressourcesProfessionnelles'].map((key) => {
                                                    const block = currentBilanData.outilsMethodes[key];
                                                    if (!block) return null;
                                                    return (
                                                        <div key={key} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow duration-300">
                                                            <h4 className="font-heading text-[18px] font-bold text-navy mb-4">{block.titre}</h4>
                                                            {block.description && <p className="text-[14px] text-muted mb-4">{block.description}</p>}
                                                            <ul className="space-y-3">
                                                                {(block.items || []).map((item, i) => (
                                                                    <li key={i} className="text-[14px] text-muted flex items-start gap-2 leading-tight">
                                                                        <CheckIcon /><span>{item}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                        {currentBilanData.objectifs && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                                                {(currentBilanData.objectifs.items || currentBilanData.objectifs).map((obj, idx) => (
                                                    <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                                                        <CheckIcon />
                                                        <p className="text-navy font-medium">{typeof obj === 'string' ? obj : obj.titre || obj}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Étapes */}
                                {currentBilanData.etapes && (
                                    <div>
                                        <div className="text-center mb-12">
                                            <h3 className="font-heading text-2xl md:text-3xl font-extrabold text-navy uppercase tracking-wide">
                                                Les étapes de l'accompagnement
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            {currentBilanData.etapes.map((etape, idx) => (
                                                <div key={idx} className="group p-8 rounded-2xl bg-white border border-gray-200 hover:bg-orange transition-colors duration-300 flex flex-col h-full shadow-sm">
                                                    <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                                        <span className="font-heading text-xl font-bold text-orange">{etape.numero || `0${idx + 1}`}</span>
                                                    </div>
                                                    <h4 className="font-heading text-[18px] font-bold text-navy mb-4 group-hover:text-white transition-colors duration-300">{etape.titre || etape.phase}</h4>
                                                    <ul className="space-y-3 mt-auto">
                                                        {(etape.items || [etape.details]).filter(Boolean).map((item, i) => (
                                                            <li key={i} className="text-[14px] text-muted font-body leading-relaxed group-hover:text-white/90 transition-colors duration-300 flex items-start gap-2">
                                                                <span className="font-bold mt-0.5 text-orange group-hover:text-white">•</span><span>{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Financements du Bilan */}
                    {currentBilanData.financements && (
                        <div className="py-12 bg-white">
                            <div className="max-w-[900px] mx-auto px-6 text-center">
                                <h3 className="font-heading text-xl font-extrabold text-navy mb-8 uppercase tracking-wide">{currentBilanData.financements.titre}</h3>
                                <div className="flex flex-wrap justify-center gap-4">
                                    {(currentBilanData.financements.items || []).map((financement, idx) => (
                                        <span key={idx} className="bg-slate-100 text-navy font-semibold px-6 py-3 rounded-full border border-slate-200 text-[15px] hover:bg-navy hover:text-white hover:border-navy transition-colors cursor-default">
                                            {financement}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ========================================== */}
            {/* --- SUITE DE LA PAGE GESTION DE CARRIÈRE --- */}
            {/* ========================================== */}

            {/* --- COACHING (Individuel & Équipe) --- */}
            {(globalData.bilanIndividuel || globalData.bilanEquipe || globalData.coachingIndividuel || globalData.coachingEquipe) && (
                <section className="py-24 bg-white border-t border-gray-200">
                    <div className="max-w-[1200px] mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-navy uppercase tracking-wide">
                                Nos formules de Coaching
                            </h2>
                            <div className="w-20 h-1.5 bg-orange mx-auto mt-6 rounded-full"></div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Individuel */}
                            {(globalData.bilanIndividuel || globalData.coachingIndividuel) && (() => {
                                const indiv = globalData.bilanIndividuel || globalData.coachingIndividuel;
                                return (
                                    <div className="bg-white rounded-[24px] p-8 md:p-12 shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 h-fit">
                                        <div className="absolute top-0 left-0 w-full h-2 bg-orange"></div>
                                        <h3 className="font-heading text-2xl font-bold text-navy mb-4">{indiv.titre}</h3>
                                        <p className="text-muted font-body leading-relaxed mb-8">{indiv.intro}</p>
                                        <ul className="space-y-4">
                                            {indiv.benefices?.map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-navy font-medium font-body text-[15px]">
                                                    <CheckIcon /><span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )
                            })()}

                            {/* Équipe */}
                            {(globalData.bilanEquipe || globalData.coachingEquipe) && (() => {
                                const equipe = globalData.bilanEquipe || globalData.coachingEquipe;
                                return (
                                    <div className="bg-navy rounded-[24px] p-8 md:p-12 shadow-xl shadow-navy/20 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 h-fit text-white">
                                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                                        <h3 className="font-heading text-2xl font-bold mb-4 relative z-10">{equipe.titre}</h3>
                                        <p className="text-white/80 font-body leading-relaxed mb-8 relative z-10">{equipe.description}</p>
                                        <ul className="space-y-4 relative z-10">
                                            {equipe.axes?.map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-white font-medium font-body text-[15px]">
                                                    <svg className="w-5 h-5 text-orange shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )
                            })()}
                        </div>
                    </div>
                </section>
            )}

            {/* --- TESTS EXTÉRIEURS --- */}
            {globalData.testsExterieurs && (
                <section className="py-24 bg-gray-50 border-t border-gray-100">
                    <div className="max-w-[1200px] mx-auto px-6">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-navy uppercase tracking-wide mb-6">
                                {globalData.testsExterieurs.titre}
                            </h2>
                            <p className="text-[17px] text-muted leading-relaxed font-body">
                                {globalData.testsExterieurs.intro}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {globalData.testsExterieurs.tests?.map((test, idx) => (
                                <div key={idx} className="bg-white rounded-2xl p-8 border border-gray-100 flex flex-col h-full hover:shadow-lg transition-all duration-300">
                                    <div className="w-12 h-12 bg-navy rounded-lg flex items-center justify-center mb-6">
                                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                        </svg>
                                    </div>
                                    <h4 className="font-heading text-xl font-bold text-navy mb-3">{test.nom}</h4>
                                    <p className="text-muted font-body text-[15px] leading-relaxed mb-8 flex-grow">{test.description}</p>
                                    <a href={test.lien} className="inline-flex items-center gap-2 text-orange font-bold font-heading hover:text-navy transition-colors mt-auto">
                                        {test.labelLien}
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* --- POURQUOI CHOISIR --- */}
            {globalData.pourquoiChoisir?.avantages && (
                <section className="py-24 bg-white border-t border-gray-100">
                    <div className="max-w-[1200px] mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-navy uppercase tracking-wide mb-6">
                                {globalData.pourquoiChoisir.titre}
                            </h2>
                            {globalData.pourquoiChoisir.intro && (
                                <p className="text-[17px] text-muted leading-relaxed font-body max-w-3xl mx-auto">
                                    {globalData.pourquoiChoisir.intro}
                                </p>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {globalData.pourquoiChoisir.avantages.map((avantage, idx) => (
                                <div key={idx} className="group p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-orange transition-all duration-300 shadow-sm">
                                    <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <span className="font-heading text-xl font-bold text-orange">0{idx + 1}</span>
                                    </div>
                                    <h4 className="font-heading text-[18px] font-bold text-navy mb-3 group-hover:text-white transition-colors">{avantage.titre}</h4>
                                    <p className="text-[14px] text-muted font-body group-hover:text-white/90 transition-colors">{avantage.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* --- CTA FINAL --- */}
            {globalData.cta && globalData.cta.length > 0 && (
                <CallToAction
                    variante="sombre"
                    titre="Prêt(e) à développer votre potentiel ?"
                    texteBouton={globalData.cta[0]?.label}
                    lienBouton={globalData.cta[0]?.url}
                    texteBoutonSecondaire={globalData.cta[1]?.label}
                    lienBoutonSecondaire={globalData.cta[1]?.url}
                />
            )}

        </div>
    );
}