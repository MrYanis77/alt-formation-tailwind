import React, { useState } from 'react';
import Hero from '../components/Hero/Hero';
import Breadcrumb from '../components/Breadcrumb';
import TexteSection from '../components/Textes/TexteSection';

// Import de votre JSON
import dataBilan from '../data/JSON/bilan.json';

// Icônes SVG au design moderne
const CheckIcon = () => (
    <svg className="w-5 h-5 text-orange shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
);
const Clock = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const Users = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const Calendar = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
const MapPin = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;

export default function BilansCarriere() {
    const [view, setView] = useState('bilanDeCompetences');
    const currentData = dataBilan[view];

    if (!currentData) return <div className="text-center py-20 font-heading text-navy">Chargement des données...</div>;

    // Préparation des données pour <TexteSection />
    const texteSectionData = {
        titre: view === 'bilanDeCompetences' ? 'En quoi ça consiste ?' : currentData.pourquoi?.titre,
        contenu: view === 'bilanDeCompetences'
            ? currentData.descriptionComplete
            : [
                currentData.pourquoi?.description,
                currentData.pourquoi?.pourQui,
                ...(currentData.pourquoi?.items?.map(i => `• ${i}`) || [])
            ],
        image: currentData.image
    };

    return (
        <div className="bg-white min-h-screen antialiased">

            {/* 1. HERO */}
            <Hero
                title={currentData.hero?.titre || currentData.titre}
                subtitle={currentData.hero?.sousTitre}
                video={currentData.hero?.video}
            />

            <Breadcrumb items={[
                { label: 'Accueil', to: '/' },
                { label: 'Gestion de carrière' },
                { label: currentData.titre }
            ]} />

            {/* 2. TOGGLE CATEGORIES */}
            <section className="py-10 bg-gray-50 border-b border-gray-200">
                <div className="max-w-[1100px] mx-auto text-center px-6">
                    <div className="flex bg-white p-1.5 rounded-full shadow-sm w-fit mx-auto border border-gray-200 flex-wrap justify-center gap-2">
                        <button
                            onClick={() => setView('bilanDeCompetences')}
                            className={`px-8 py-3 rounded-full font-heading font-bold transition-all duration-300 cursor-pointer ${view === 'bilanDeCompetences' ? 'bg-orange text-white shadow-md' : 'text-gray-500 hover:text-navy'
                                }`}
                        >
                            Bilan de compétences
                        </button>
                        <button
                            onClick={() => setView('bilanDeMiCarriere')}
                            className={`px-8 py-3 rounded-full font-heading font-bold transition-all duration-300 cursor-pointer ${view === 'bilanDeMiCarriere' ? 'bg-[#1E2F47] text-white shadow-md' : 'text-gray-500 hover:text-navy'
                                }`}
                        >
                            Bilan de mi-carrière
                        </button>
                    </div>
                </div>
            </section>

            {/* 3. SECTION TEXTE & IMAGE */}
            <TexteSection data={texteSectionData} imageRight={true} />

            {/* 4. INFORMATIONS PRATIQUES (Design inspiré des formules Coaching) */}
            <section className="py-24 bg-gray-50 border-t border-gray-100">
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-navy uppercase tracking-wide">
                            Informations pratiques
                        </h2>
                        <div className="w-20 h-1.5 bg-orange mx-auto mt-6 rounded-full"></div>
                    </div>

                    <div className={`grid grid-cols-1 md:grid-cols-2 ${view === 'bilanDeCompetences' ? 'lg:grid-cols-4' : 'lg:grid-cols-2 max-w-4xl mx-auto'} gap-8`}>

                        {/* Public */}
                        {currentData.publicConcerne && (
                            <div className="bg-white rounded-[24px] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                                <div className="absolute top-0 left-0 w-full h-2 bg-orange transition-all duration-300 group-hover:h-3"></div>
                                <div className="text-orange mb-6"><Users /></div>
                                <h3 className="font-heading text-xl font-bold text-navy mb-4">{currentData.publicConcerne.titre}</h3>
                                <ul className="space-y-3">
                                    {(currentData.publicConcerne.items || []).map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-[14px] text-muted font-body">
                                            <span className="text-orange font-bold mt-0.5">•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Durée */}
                        {currentData.duree && (
                            <div className="bg-white rounded-[24px] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                                <div className="absolute top-0 left-0 w-full h-2 bg-orange transition-all duration-300 group-hover:h-3"></div>
                                <div className="text-orange mb-6"><Clock /></div>
                                <h3 className="font-heading text-xl font-bold text-navy mb-4">{currentData.duree.titre}</h3>
                                {currentData.duree.total && <p className="font-bold text-navy mb-3 text-[15px]">{currentData.duree.total}</p>}
                                <ul className="space-y-3">
                                    {(currentData.duree.detail || currentData.duree.items || []).map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-[14px] text-muted font-body">
                                            <span className="text-orange font-bold mt-0.5">•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Délai d'accès */}
                        {currentData.delaiAcces && (
                            <div className="bg-white rounded-[24px] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                                <div className="absolute top-0 left-0 w-full h-2 bg-orange transition-all duration-300 group-hover:h-3"></div>
                                <div className="text-orange mb-6"><Calendar /></div>
                                <h3 className="font-heading text-xl font-bold text-navy mb-4">{currentData.delaiAcces.titre}</h3>
                                {currentData.delaiAcces.delai && <p className="font-bold text-navy mb-3 text-[15px]">{currentData.delaiAcces.delai}</p>}
                                <ul className="space-y-3">
                                    {(currentData.delaiAcces.detail || []).map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-[14px] text-muted font-body">
                                            <span className="text-orange font-bold mt-0.5">•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Lieu */}
                        {currentData.lieu && (
                            <div className="bg-white rounded-[24px] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                                <div className="absolute top-0 left-0 w-full h-2 bg-orange transition-all duration-300 group-hover:h-3"></div>
                                <div className="text-orange mb-6"><MapPin /></div>
                                <h3 className="font-heading text-xl font-bold text-navy mb-4">{currentData.lieu.titre}</h3>
                                <p className="text-[14px] text-muted mb-3">{currentData.lieu.description}</p>
                                <div className="p-3 bg-gray-50 rounded-lg text-[13px] text-muted mb-4 italic">
                                    {currentData.lieu.accessibilite}
                                </div>
                                <div className="text-[14px] font-bold text-navy space-y-1">
                                    <p>📞 {currentData.lieu.contact?.telephone}</p>
                                    <p>✉️ {currentData.lieu.contact?.email}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* 5. OUTILS, MÉTHODES / OBJECTIFS */}
            {(currentData.outilsMethodes || currentData.objectifs) && (
                <section className="py-24 bg-white border-t border-gray-100">
                    <div className="max-w-[1200px] mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-navy uppercase tracking-wide">
                                {currentData.outilsMethodes ? "Nos outils & méthodes" : "Objectifs de l'accompagnement"}
                            </h2>
                            <div className="w-20 h-1.5 bg-orange mx-auto mt-6 rounded-full"></div>
                        </div>

                        {/* Bilan de Compétences : Grille des outils */}
                        {currentData.outilsMethodes && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {['accompagnementIndividualise', 'outilsAnalyse', 'enquetesMetiers', 'tests', 'ressourcesProfessionnelles'].map((key) => {
                                    const block = currentData.outilsMethodes[key];
                                    if (!block) return null;
                                    return (
                                        <div key={key} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow duration-300">
                                            <h3 className="font-heading text-[18px] font-bold text-navy mb-4">{block.titre}</h3>
                                            {block.description && <p className="text-[14px] text-muted mb-4">{block.description}</p>}
                                            <ul className="space-y-3">
                                                {(block.items || []).map((item, i) => (
                                                    <li key={i} className="text-[14px] text-muted flex items-start gap-2 leading-tight">
                                                        <CheckIcon />
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Bilan Mi-Carrière : Liste des Objectifs */}
                        {currentData.objectifs && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                                {(currentData.objectifs.items || []).map((obj, idx) => (
                                    <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 hover:border-orange transition-colors duration-300">
                                        <CheckIcon />
                                        <p className="text-navy font-medium">{obj}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* 6. LES ÉTAPES (Design inspiré de "Pourquoi choisir" dans Coaching) */}
            {currentData.etapes && (
                <section className="py-24 bg-gray-50 border-t border-gray-100">
                    <div className="max-w-[1200px] mx-auto px-6">

                        <div className="text-center mb-16">
                            <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-navy uppercase tracking-wide mb-6">
                                Les étapes de l'accompagnement
                            </h2>
                            <div className="w-20 h-1.5 bg-orange mx-auto mt-6 rounded-full"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {currentData.etapes.map((etape, idx) => (
                                <div
                                    key={idx}
                                    className="group p-8 rounded-2xl bg-white border border-gray-200 hover:bg-orange transition-colors duration-300 flex flex-col h-full shadow-sm hover:shadow-xl"
                                >
                                    {/* Numérotation élégante */}
                                    <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <span className="font-heading text-xl font-bold text-orange">
                                            {etape.numero}
                                        </span>
                                    </div>
                                    <h4 className="font-heading text-[18px] font-bold text-navy mb-4 group-hover:text-white transition-colors duration-300">
                                        {etape.titre}
                                    </h4>
                                    <ul className="space-y-3 mt-auto">
                                        {(etape.items || []).map((item, i) => (
                                            <li key={i} className="text-[14px] text-muted font-body leading-relaxed group-hover:text-white/90 transition-colors duration-300 flex items-start gap-2">
                                                <span className="font-bold mt-0.5 group-hover:text-white text-orange">•</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                    </div>
                </section>
            )}

            {/* 7. FINANCEMENTS */}
            {currentData.financements && (
                <section className="py-20 bg-white border-t border-gray-100">
                    <div className="max-w-[900px] mx-auto px-6 text-center">
                        <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy mb-10 uppercase tracking-wide">
                            {currentData.financements.titre}
                        </h2>
                        <div className="flex flex-wrap justify-center gap-4">
                            {(currentData.financements.items || []).map((financement, idx) => (
                                <span key={idx} className="bg-slate-100 text-navy font-semibold px-6 py-3 rounded-full border border-slate-200 text-[15px] hover:bg-navy hover:text-white hover:border-navy transition-colors duration-300 cursor-default">
                                    {financement}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 8. CTA FINAL (Design Coaching) */}
            {currentData.cta && (
                <section className="relative py-24 px-6 bg-navy text-center overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="max-w-[800px] mx-auto relative z-10">
                        <h2 className="font-heading text-3xl md:text-5xl font-extrabold text-white mb-10 uppercase leading-tight tracking-tight">
                            {currentData.conclusion?.titre || "Prêt(e) à donner un nouvel élan à votre carrière ?"}
                        </h2>

                        <p className="text-[17px] text-white/80 mb-12 font-body max-w-2xl mx-auto leading-relaxed">
                            {currentData.conclusion?.description || "Contactez nos conseillers pour en savoir plus ou pour débuter votre accompagnement."}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <a
                                href={currentData.cta.url}
                                className="w-full sm:w-auto inline-block bg-orange hover:bg-white text-white hover:text-orange px-10 py-4 rounded-lg font-heading font-bold shadow-lg shadow-orange/20 transition-all duration-300 hover:-translate-y-1 uppercase tracking-wider"
                            >
                                {currentData.cta.label}
                            </a>

                            {currentData.cta.labelSecondaire && (
                                <a
                                    href={currentData.cta.url}
                                    className="w-full sm:w-auto inline-block bg-transparent border-2 border-white/70 text-white hover:bg-white hover:text-navy px-10 py-4 rounded-lg font-heading font-bold transition-all duration-300 hover:-translate-y-1 uppercase tracking-wider"
                                >
                                    {currentData.cta.labelSecondaire}
                                </a>
                            )}
                        </div>
                    </div>
                </section>
            )}

        </div>
    );
}