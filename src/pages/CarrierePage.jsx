import React, { useState } from 'react';
import Hero from '../components/Hero/Hero';
import Breadcrumb from '../components/Breadcrumb';
import CallToAction from '../components/CallToAction';
import dataCarrieres from '../data/json/carrieres.json';

// ── Icônes ────────────────────────────────────────────────────────────────────

const CheckIcon = () => (
    <svg className="w-5 h-5 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
);

const CompassIcon = ({ active }) => (
    <svg className={`w-10 h-10 transition-colors duration-300 ${active ? 'text-white' : 'text-primary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.494 9.06a4.013 4.013 0 01-2.453 2.452l-5.666 1.889a.5.5 0 01-.632-.632l1.889-5.666a4.013 4.013 0 012.453-2.452l5.666-1.889a.5.5 0 01.632.632l-1.889 5.666z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
    </svg>
);

const RocketIcon = ({ active }) => (
    <svg className={`w-10 h-10 transition-colors duration-300 ${active ? 'text-white' : 'text-accent'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 10.5L21 3m-7.5 7.5v9l-3.5-3.5-2.5 2.5v-5l-4-4h5l2.5-2.5 3.5 3.5zM10.5 13.5l-3 3M15 9l3-3" />
    </svg>
);

// ── Contenu : Gestion de Carrière ────────────────────────────────────────────

function ContenuCarriere({ data }) {
    return (
        <div className="flex flex-col gap-16">

            {/* Introduction */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                    <p className="text-[11px] font-extrabold text-accent uppercase tracking-widest mb-3">Notre accompagnement</p>
                    <h3 className="font-heading text-2xl md:text-3xl font-extrabold text-primary mb-4">{data.titre}</h3>
                    <p className="text-accent font-bold font-body mb-4">{data.tagline}</p>
                    <p className="text-content-muted font-body leading-relaxed">{data.description}</p>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg">
                    <img src={data.image} alt={data.titre} className="w-full h-72 object-cover" />
                </div>
            </div>

            {/* Accompagnement en gestion de carrière */}
            <div className="bg-gray-50 rounded-2xl p-10 border border-gray-100">
                <div className="text-center mb-10">
                    <h3 className="font-heading text-2xl md:text-3xl font-extrabold text-primary uppercase tracking-wide">
                        {data.accompagnement.titre}
                    </h3>
                    <div className="w-16 h-1.5 bg-accent mx-auto mt-4 rounded-full mb-6"></div>
                    <p className="text-content-muted font-body leading-relaxed max-w-2xl mx-auto">
                        {data.accompagnement.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {data.accompagnement.etapes.map((etape, idx) => (
                        <div key={idx} className="group p-8 rounded-2xl bg-white border border-gray-200 hover:bg-accent transition-colors duration-300 flex flex-col shadow-sm">
                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                                <span className="font-heading text-lg font-bold text-accent">{etape.numero}</span>
                            </div>
                            <h5 className="font-heading text-[17px] font-bold text-primary mb-3 group-hover:text-white transition-colors duration-300">
                                {etape.titre}
                            </h5>
                            <p className="text-sm text-content-muted font-body leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                                {etape.description}
                            </p>
                        </div>
                    ))}
                </div>

            </div>

            {/* Pourquoi choisir */}
            <div>
                <div className="text-center mb-10">
                    <h3 className="font-heading text-2xl md:text-3xl font-extrabold text-primary uppercase tracking-wide mb-4">
                        {data.pourquoiChoisir.titre}
                    </h3>
                    <p className="text-content-muted font-body max-w-2xl mx-auto">{data.pourquoiChoisir.intro}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {data.pourquoiChoisir.avantages.map((avantage, idx) => (
                        <div key={idx} className="group p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-accent transition-all duration-300 shadow-sm">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <span className="font-heading text-lg font-bold text-accent">0{idx + 1}</span>
                            </div>
                            <h5 className="font-heading text-[17px] font-bold text-primary mb-3 group-hover:text-white transition-colors">{avantage.titre}</h5>
                            <p className="text-sm text-content-muted font-body group-hover:text-white/90 transition-colors">{avantage.description}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

// ── Contenu : Coaching Emploi ─────────────────────────────────────────────────

function ContenuCoaching({ data }) {
    return (
        <div className="flex flex-col gap-16">

            {/* Introduction */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1 rounded-2xl overflow-hidden shadow-lg">
                    <img src={data.imageCoaching || data.image} alt={data.titre} className="w-full h-72 object-cover" />
                </div>
                <div className="order-1 lg:order-2">
                    <p className="text-[11px] font-extrabold text-accent uppercase tracking-widest mb-3">Notre accompagnement</p>
                    <h3 className="font-heading text-2xl md:text-3xl font-extrabold text-primary mb-4">{data.titre}</h3>
                    <p className="text-accent font-bold font-body mb-4">{data.tagline}</p>
                    <p className="text-content-muted font-body leading-relaxed">{data.description}</p>
                </div>
            </div>

            {/* Méthode */}
            {data.methode && (
                <div className="bg-gray-50 rounded-2xl p-10 border border-gray-100">
                    <div className="text-center mb-10">
                        <h3 className="font-heading text-2xl md:text-3xl font-extrabold text-primary uppercase tracking-wide mb-3">
                            {data.methode.titre}
                        </h3>
                        <div className="w-16 h-1.5 bg-accent mx-auto mt-4 rounded-full mb-5"></div>
                        <p className="text-content-muted font-body max-w-2xl mx-auto">{data.methode.description}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {data.methode.etapes?.map((etape, idx) => (
                            <div key={idx} className="group p-8 rounded-2xl bg-white border border-gray-200 hover:bg-accent transition-colors duration-300 flex flex-col shadow-sm">
                                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                                    <span className="font-heading text-lg font-bold text-accent">{etape.numero}</span>
                                </div>
                                <h5 className="font-heading text-[17px] font-bold text-primary mb-3 group-hover:text-white transition-colors duration-300">{etape.titre}</h5>
                                <ul className="space-y-2 mt-auto">
                                    {(etape.items || []).map((item, i) => (
                                        <li key={i} className="text-sm text-content-muted font-body group-hover:text-white/90 transition-colors duration-300 flex items-start gap-2">
                                            <span className="font-bold mt-0.5 text-accent group-hover:text-white shrink-0">•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Coaching individuel & ateliers */}
            {(data.coachingIndividuel || data.coachingEquipe) && (
                <div>
                    <div className="text-center mb-10">
                        <h3 className="font-heading text-2xl md:text-3xl font-extrabold text-primary uppercase tracking-wide">
                            Nos formules d'accompagnement
                        </h3>
                        <div className="w-16 h-1.5 bg-accent mx-auto mt-4 rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {data.coachingIndividuel && (
                            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden hover:-translate-y-1 transition-transform duration-300">
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-accent"></div>
                                <h4 className="font-heading text-xl font-bold text-primary mb-3">{data.coachingIndividuel.titre}</h4>
                                <p className="text-content-muted font-body text-sm leading-relaxed mb-7">{data.coachingIndividuel.intro}</p>
                                <ul className="space-y-3">
                                    {data.coachingIndividuel.benefices?.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-primary font-medium font-body text-sm">
                                            <CheckIcon /><span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {data.coachingEquipe && (
                            <div className="bg-primary rounded-2xl p-8 md:p-10 shadow-xl shadow-primary/20 relative overflow-hidden hover:-translate-y-1 transition-transform duration-300 text-white">
                                <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-white/5 rounded-full blur-3xl"></div>
                                <h4 className="font-heading text-xl font-bold mb-3 relative z-10">{data.coachingEquipe.titre}</h4>
                                <p className="text-white/80 font-body text-sm leading-relaxed mb-7 relative z-10">{data.coachingEquipe.description}</p>
                                <ul className="space-y-3 relative z-10">
                                    {data.coachingEquipe.axes?.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-white font-medium font-body text-sm">
                                            <svg className="w-5 h-5 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            )}

            {/* Pourquoi choisir */}
            {data.pourquoiChoisir?.avantages && (
                <div>
                    <div className="text-center mb-10">
                        <h3 className="font-heading text-2xl md:text-3xl font-extrabold text-primary uppercase tracking-wide mb-4">
                            {data.pourquoiChoisir.titre}
                        </h3>
                        {data.pourquoiChoisir.intro && (
                            <p className="text-content-muted font-body max-w-2xl mx-auto">{data.pourquoiChoisir.intro}</p>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {data.pourquoiChoisir.avantages.map((avantage, idx) => (
                            <div key={idx} className="group p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-accent transition-all duration-300 shadow-sm">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                    <span className="font-heading text-lg font-bold text-accent">0{idx + 1}</span>
                                </div>
                                <h5 className="font-heading text-[17px] font-bold text-primary mb-3 group-hover:text-white transition-colors">{avantage.titre}</h5>
                                <p className="text-sm text-content-muted font-body group-hover:text-white/90 transition-colors">{avantage.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Page principale ───────────────────────────────────────────────────────────

export default function CarrierePage() {
    const carriere = dataCarrieres?.gestionCarriere;
    const coaching = dataCarrieres?.coaching;
    const [selected, setSelected] = useState('carriere');

    if (!carriere || !coaching) {
        return <div className="text-center py-20 font-heading text-primary text-xl">Chargement des données...</div>;
    }

    const isCarriere = selected === 'carriere';
    const ctaData = isCarriere ? carriere.cta : coaching.cta;
    const boutons = ctaData?.boutons || [];

    return (
        <div className="bg-surface-soft min-h-screen antialiased">

            {/* ── HERO ── */}
            <Hero
                title={isCarriere ? carriere.hero.titre : coaching.hero.titre}
                subtitle={isCarriere ? carriere.hero.sousTitre : coaching.hero.sousTitre}
                video={isCarriere ? carriere.hero.video : coaching.hero.video}
            />

            {/* ── BREADCRUMB ── */}
            <Breadcrumb items={[
                { label: 'Accueil', to: '/' },
                { label: 'Nos Accompagnements' },
            ]} />

            {/* ── SÉLECTEURS ── */}
            <section className="py-20">
                <div className="max-w-container-3xl mx-auto px-6">

                    <div className="text-center mb-14">
                        <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-primary tracking-wide">
                            Quel est votre objectif aujourd'hui ?
                        </h2>
                        <div className="w-20 h-1.5 bg-accent mx-auto mt-6 rounded-full mb-6"></div>
                        <p className="text-[17px] text-content-muted leading-relaxed font-body max-w-2xl mx-auto">
                            Sélectionnez le parcours qui correspond à votre situation pour découvrir notre accompagnement.
                        </p>
                    </div>

                    {/* Cartes sélecteurs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">

                        {/* CARTE — GESTION DE CARRIÈRE */}
                        <button
                            onClick={() => setSelected('carriere')}
                            className={`text-left rounded-card p-10 md:p-12 border-2 flex flex-col transition-all duration-300 group cursor-pointer
                                ${isCarriere
                                    ? 'bg-primary border-primary shadow-2xl shadow-primary/30 -translate-y-1'
                                    : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50 hover:-translate-y-1 hover:border-primary/30'
                                }`}
                        >
                            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-8 transition-all duration-300 group-hover:scale-110
                                ${isCarriere ? 'bg-white/10' : 'bg-primary/5'}`}>
                                <CompassIcon active={isCarriere} />
                            </div>
                            <h3 className={`font-heading text-2xl font-bold mb-3 transition-colors duration-300 ${isCarriere ? 'text-white' : 'text-primary'}`}>
                                {carriere.titre}
                            </h3>
                            <p className={`font-bold font-body mb-4 transition-colors duration-300 ${isCarriere ? 'text-accent' : 'text-accent'}`}>
                                {carriere.tagline}
                            </p>
                            <p className={`font-body leading-relaxed text-sm transition-colors duration-300 ${isCarriere ? 'text-white/80' : 'text-content-muted'}`}>
                                {carriere.description}
                            </p>
                            <div className={`mt-8 inline-flex items-center gap-2 font-heading font-bold text-sm transition-colors duration-300 ${isCarriere ? 'text-accent' : 'text-primary'}`}>
                                {isCarriere ? 'Sélectionné' : 'Voir ce parcours'}
                                <svg className={`w-4 h-4 transition-transform duration-300 ${isCarriere ? '' : 'group-hover:translate-x-1'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>

                        {/* CARTE — COACHING EMPLOI */}
                        <button
                            onClick={() => setSelected('coaching')}
                            className={`text-left rounded-card p-10 md:p-12 border-2 flex flex-col transition-all duration-300 group cursor-pointer relative overflow-hidden
                                ${!isCarriere
                                    ? 'bg-accent border-accent shadow-2xl shadow-accent/30 -translate-y-1'
                                    : 'bg-white border-accent/20 shadow-xl shadow-accent/10 hover:-translate-y-1 hover:border-accent/40'
                                }`}
                        >
                            {!isCarriere && (
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full z-0"></div>
                            )}
                            <div className={`relative z-10 w-20 h-20 rounded-2xl flex items-center justify-center mb-8 transition-all duration-300 group-hover:scale-110
                                ${!isCarriere ? 'bg-white/15' : 'bg-accent/10'}`}>
                                <RocketIcon active={!isCarriere} />
                            </div>
                            <h3 className={`relative z-10 font-heading text-2xl font-bold mb-3 transition-colors duration-300 ${!isCarriere ? 'text-white' : 'text-primary'}`}>
                                {coaching.titre}
                            </h3>
                            <p className={`relative z-10 font-bold font-body mb-4 transition-colors duration-300 ${!isCarriere ? 'text-white/90' : 'text-accent'}`}>
                                {coaching.tagline}
                            </p>
                            <p className={`relative z-10 font-body leading-relaxed text-sm transition-colors duration-300 ${!isCarriere ? 'text-white/80' : 'text-content-muted'}`}>
                                {coaching.description}
                            </p>
                            <div className={`relative z-10 mt-8 inline-flex items-center gap-2 font-heading font-bold text-sm transition-colors duration-300 ${!isCarriere ? 'text-white' : 'text-accent'}`}>
                                {!isCarriere ? 'Sélectionné' : 'Voir ce parcours'}
                                <svg className={`w-4 h-4 transition-transform duration-300 ${!isCarriere ? '' : 'group-hover:translate-x-1'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                    </div>

                    {/* ── CONTENU DYNAMIQUE ── */}
                    <div key={selected} className="animate-fadeIn">
                        {isCarriere
                            ? <ContenuCarriere data={carriere} />
                            : <ContenuCoaching data={coaching} />
                        }
                    </div>
                </div>
            </section>

            {/* ── CTA FINAL ── */}
            <CallToAction
                variante="sombre"
                titre={ctaData.titre}
                sousTitre={ctaData.sousTitre}
                texteBouton={boutons[0]?.label}
                lienBouton={boutons[0]?.url}
                texteBoutonSecondaire={boutons[1]?.label}
                lienBoutonSecondaire={boutons[1]?.url}
            />

        </div>
    );
}
