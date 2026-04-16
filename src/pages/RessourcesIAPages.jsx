import React from 'react';
import Hero from '../components/Hero/Hero';
import Breadcrumb from '../components/Breadcrumb';
import dataRessources from '../data/json/ressources-ia.json';
import CallToAction from '../components/CallToAction';

// 1. ICÔNES SVG MISES À JOUR
const Icons = {
    Message: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
    Palette: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" /><circle cx="8.5" cy="7.5" r=".5" /><circle cx="6.5" cy="12.5" r=".5" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></svg>,
    Zap: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
    ExternalLink: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
};

export default function RessourcesIA() {
    const data = dataRessources.ressourcesIA;

    if (!data) return <div className="text-center py-20 font-heading text-primary">Chargement des données...</div>;

    return (
        <div className="bg-surface-soft min-h-screen antialiased">

            {/* HERO SECTION */}
            <Hero
                title={data.hero.titre}
                subtitle={data.hero.sousTitre}
                video={data.hero.video}
            />

            {/* BREADCRUMB */}
            <Breadcrumb items={[
                { label: 'Accueil', to: '/' },
                { label: data.hero.titre }
            ]} />

            {/* INTRO SECTION */}
            <section className="py-20 bg-white">
                <div className="max-w-[850px] mx-auto px-6 text-center">
                    <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-primary mb-6">
                        {data.intro.titre}
                    </h2>
                    <div className="w-20 h-1.5 bg-accent mx-auto mb-8 rounded-full"></div>
                    <p className="text-lg text-slate-600 leading-relaxed font-body">
                        {data.intro.description}
                    </p>
                </div>
            </section>

            {/* CATÉGORIES D'OUTILS */}
            <section className="py-20 bg-surface-soft">
                <div className="max-w-container-xl mx-auto px-6 space-y-24">
                    {data.categories.map((cat, index) => {
                        const IconComponent = Icons[cat.icon] || Icons.Zap;

                        return (
                            <div key={index} className="scroll-mt-20">
                                {/* Header de catégorie */}
                                <div className="flex items-center gap-5 mb-12 border-b border-slate-200 pb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg transform -rotate-3">
                                        <IconComponent />
                                    </div>
                                    <h3 className="font-heading text-2xl md:text-3xl font-black text-primary uppercase tracking-tighter">
                                        {cat.titre}
                                    </h3>
                                </div>

                                {/* Grille d'outils (Responsive Grid) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {cat.outils.map((outil, idx) => (
                                        <a
                                            key={idx}
                                            href={outil.lien}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex flex-col bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
                                        >
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex items-center gap-3">
                                                    {outil.logo && (
                                                        <div className="flex-shrink-0 w-10 h-10 rounded-xl overflow-hidden border border-slate-100 shadow-sm bg-white flex items-center justify-center">
                                                            <img src={outil.logo} alt={outil.nom} className="w-7 h-7 object-contain" />
                                                        </div>
                                                    )}
                                                    <h4 className="font-heading text-xl font-bold text-primary group-hover:text-accent transition-colors duration-300">
                                                        {outil.nom}
                                                    </h4>
                                                </div>
                                                <span className="shrink-0 inline-block px-3 py-1 bg-primary/5 text-primary text-micro font-black uppercase rounded-md border border-primary/10 group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-300">
                                                    {outil.tag}
                                                </span>
                                            </div>

                                            <p className="text-slate-500 font-body text-sm leading-relaxed mb-8 flex-grow">
                                                {outil.description}
                                            </p>

                                            <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest group-hover:text-accent transition-colors">
                                                Explorer l'IA <Icons.ExternalLink />
                                            </div>

                                            {/* Accent visuel au survol */}
                                            <div className="absolute top-0 left-0 w-1 h-0 bg-accent group-hover:h-full transition-all duration-500"></div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* MINI-GLOSSAIRE */}
            <section className="py-24 bg-primary">
                <div className="max-w-[1100px] mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="font-heading text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
                            {data.glossaire.titre}
                        </h2>
                        <div className="w-12 h-1 bg-accent mx-auto mt-4"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {data.glossaire.termes.map((item, idx) => (
                            <div key={idx} className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:border-accent/50 transition-colors">
                                <h4 className="font-heading text-lg font-bold text-accent mb-4 italic">
                                    # {item.terme}
                                </h4>
                                <p className="text-sm text-slate-300 leading-relaxed font-body">
                                    {item.definition}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. CTA FINAL */}
            {data.cta && (
                <CallToAction
                    variante="claire"
                    titre={data.cta.titre}
                    sousTitre={data.cta.description}

                    // Bouton 1
                    texteBouton={data.cta.boutons[0]?.label}
                    lienBouton={data.cta.boutons[0]?.url}

                    // Bouton 2
                    texteBoutonSecondaire={data.cta.boutons[1]?.label}
                    lienBoutonSecondaire={data.cta.boutons[1]?.url}
                />
            )}
        </div>
    );
}