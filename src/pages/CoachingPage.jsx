import React from 'react';
import Hero from '../components/Hero/Hero';
import Breadcrumb from '../components/Breadcrumb';
import TexteSection from '../components/Textes/TexteSection';
import dataCoaching from '../data/json/coaching.json';
import CallToAction from '../components/CallToAction';

// --- ICÔNES SVG ---
const CheckIcon = () => (
    <svg className="w-5 h-5 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
);

export default function CoachingPage() {
    const data = dataCoaching?.coaching;

    if (!data) {
        return <div className="text-center py-20 font-heading text-primary text-xl">Chargement des données...</div>;
    }

    // Données pour la section texte d'introduction
    const introSectionData = {
        titre: data.titre || "Coaching Emploi",
        contenu: [data.tagline, data.description].filter(Boolean),
        image: data.imageCoaching || data.image
    };

    return (
        <div className="bg-white min-h-screen antialiased">

            {/* --- HERO --- */}
            <Hero
                title={data.hero?.titre || "Coaching Emploi"}
                subtitle={data.hero?.sousTitre}
                video={data.hero?.video}
            />

            {/* --- BREADCRUMB --- */}
            <Breadcrumb items={[
                { label: 'Accueil', to: '/' },
                { label: 'Coaching emploi' }
            ]} />

            {/* --- INTRODUCTION --- */}
            {introSectionData.contenu.length > 0 && (
                <TexteSection data={introSectionData} imageRight={true} />
            )}

            {/* ========================================== */}
            {/* --- MÉTHODE D'ACCOMPAGNEMENT (ÉTAPES) --- */}
            {/* ========================================== */}
            {data.methode && (
                <section className="py-24 bg-gray-50 border-t border-gray-200">
                    <div className="max-w-container-xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-primary uppercase tracking-wide mb-4">
                                {data.methode.titre}
                            </h2>
                            <p className="text-content-muted text-base max-w-2xl mx-auto leading-relaxed">
                                {data.methode.description}
                            </p>
                            <div className="w-20 h-1.5 bg-accent mx-auto mt-6 rounded-full"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {data.methode.etapes?.map((etape, idx) => (
                                <div key={idx} className="group p-8 rounded-2xl bg-white border border-gray-200 hover:bg-accent transition-colors duration-300 flex flex-col h-full shadow-sm">
                                    <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <span className="font-heading text-xl font-bold text-accent">{etape.numero}</span>
                                    </div>
                                    <h4 className="font-heading text-[18px] font-bold text-primary mb-4 group-hover:text-white transition-colors duration-300">{etape.titre}</h4>
                                    <ul className="space-y-3 mt-auto">
                                        {(etape.items || []).map((item, i) => (
                                            <li key={i} className="text-sm text-content-muted font-body leading-relaxed group-hover:text-white/90 transition-colors duration-300 flex items-start gap-2">
                                                <span className="font-bold mt-0.5 text-accent group-hover:text-white">•</span><span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ========================================== */}
            {/* --- COACHING INDIVIDUEL & ATELIERS --- */}
            {/* ========================================== */}
            {(data.coachingIndividuel || data.coachingEquipe) && (
                <section className="py-24 bg-white border-t border-gray-200">
                    <div className="max-w-container-xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-primary uppercase tracking-wide">
                                Nos formules d'accompagnement
                            </h2>
                            <div className="w-20 h-1.5 bg-accent mx-auto mt-6 rounded-full"></div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Individuel */}
                            {data.coachingIndividuel && (
                                <div className="bg-white rounded-card p-8 md:p-12 shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 h-fit">
                                    <div className="absolute top-0 left-0 w-full h-2 bg-accent"></div>
                                    <h3 className="font-heading text-2xl font-bold text-primary mb-4">{data.coachingIndividuel.titre}</h3>
                                    <p className="text-content-muted font-body leading-relaxed mb-8">{data.coachingIndividuel.intro}</p>
                                    <ul className="space-y-4">
                                        {data.coachingIndividuel.benefices?.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-primary font-medium font-body text-medium">
                                                <CheckIcon /><span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Ateliers collectifs */}
                            {data.coachingEquipe && (
                                <div className="bg-primary rounded-card p-8 md:p-12 shadow-xl shadow-primary/20 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 h-fit text-white">
                                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                                    <h3 className="font-heading text-2xl font-bold mb-4 relative z-10">{data.coachingEquipe.titre}</h3>
                                    <p className="text-white/80 font-body leading-relaxed mb-8 relative z-10">{data.coachingEquipe.description}</p>
                                    <ul className="space-y-4 relative z-10">
                                        {data.coachingEquipe.axes?.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-white font-medium font-body text-medium">
                                                <svg className="w-5 h-5 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
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

            {/* ========================================== */}
            {/* --- POURQUOI CHOISIR --- */}
            {/* ========================================== */}
            {data.pourquoiChoisir?.avantages && (
                <section className="py-24 bg-gray-50 border-t border-gray-100">
                    <div className="max-w-container-xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-primary uppercase tracking-wide mb-6">
                                {data.pourquoiChoisir.titre}
                            </h2>
                            {data.pourquoiChoisir.intro && (
                                <p className="text-[17px] text-content-muted leading-relaxed font-body max-w-3xl mx-auto">
                                    {data.pourquoiChoisir.intro}
                                </p>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {data.pourquoiChoisir.avantages.map((avantage, idx) => (
                                <div key={idx} className="group p-8 rounded-2xl bg-white border border-gray-100 hover:bg-accent transition-all duration-300 shadow-sm">
                                    <div className="w-14 h-14 bg-gray-50 rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <span className="font-heading text-xl font-bold text-accent">0{idx + 1}</span>
                                    </div>
                                    <h4 className="font-heading text-[18px] font-bold text-primary mb-3 group-hover:text-white transition-colors">{avantage.titre}</h4>
                                    <p className="text-sm text-content-muted font-body group-hover:text-white/90 transition-colors">{avantage.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* --- CTA FINAL --- */}
            {data.cta && data.cta.length > 0 && (
                <CallToAction
                    variante="sombre"
                    titre="Prêt(e) à décrocher le poste de vos rêves ?"
                    sousTitre="Nos coachs experts vous accompagnent à chaque étape de votre recherche d'emploi."
                    texteBouton={data.cta[0]?.label}
                    lienBouton={data.cta[0]?.url}
                    texteBoutonSecondaire={data.cta[1]?.label}
                    lienBoutonSecondaire={data.cta[1]?.url}
                />
            )}

        </div>
    );
}
