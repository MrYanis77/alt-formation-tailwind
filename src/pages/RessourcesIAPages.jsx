import React from 'react';
import Hero from '../components/Hero/Hero';
import Breadcrumb from '../components/Breadcrumb';
import dataRessources from '../data/JSON/ressources-ia.json';

// 2. ICÔNES SVG SUR-MESURE
const Icons = {
    Message: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
    Palette: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" /><circle cx="8.5" cy="7.5" r=".5" /><circle cx="6.5" cy="12.5" r=".5" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></svg>,
    Zap: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
    ExternalLink: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
};

export default function RessourcesIA() {
    const data = dataRessources.ressourcesIA;

    if (!data) return <div className="text-center py-20 font-heading text-navy">Chargement des données...</div>;

    return (
        <div className="bg-[#F8FAFC] min-h-screen antialiased">

            {/* 1. HERO (Utilisation de votre composant) */}
            <Hero
                title={data.hero.titre}
                subtitle={data.hero.sousTitre}
                video={data.hero.video}
            />

            {/* 2. BREADCRUMB (Utilisation de votre composant) */}
            <Breadcrumb items={[
                { label: 'Accueil', to: '/' },
                { label: data.hero.titre }
            ]} />

            {/* 3. INTRO SECTION */}
            <section className="py-20 bg-white">
                <div className="max-w-[800px] mx-auto px-6 text-center">
                    <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-navy mb-6">
                        {data.intro.titre}
                    </h2>
                    <div className="w-16 h-1 bg-orange mx-auto mb-8 rounded-full"></div>
                    <p className="text-lg text-slate-600 leading-relaxed font-body">
                        {data.intro.description}
                    </p>
                </div>
            </section>

            {/* 4. CATÉGORIES D'OUTILS (Le cœur de la page) */}
            <section className="py-20 bg-[#F8FAFC]">
                <div className="max-w-[1200px] mx-auto px-6 space-y-20">
                    {data.categories.map((cat, index) => {
                        const IconComponent = Icons[cat.icon] || Icons.Zap;

                        return (
                            <div key={index}>
                                {/* En-tête de la catégorie */}
                                <div className="flex items-center gap-4 mb-10 border-b border-slate-200 pb-4">
                                    <div className="w-12 h-12 rounded-xl bg-navy text-white flex items-center justify-center shadow-md">
                                        <IconComponent />
                                    </div>
                                    <h3 className="font-heading text-2xl md:text-3xl font-bold text-navy uppercase tracking-wide">
                                        {cat.titre}
                                    </h3>
                                </div>

                                {/* Grille d'outils pour cette catégorie */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {cat.outils.map((outil, idx) => (
                                        <a
                                            key={idx}
                                            href={outil.lien}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group block bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <h4 className="font-heading text-xl font-bold text-navy group-hover:text-orange transition-colors">
                                                    {outil.nom}
                                                </h4>
                                                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase rounded-full border border-slate-200 group-hover:bg-orange/10 group-hover:border-orange/20 group-hover:text-orange transition-colors">
                                                    {outil.tag}
                                                </span>
                                            </div>
                                            <p className="text-slate-600 font-body leading-relaxed mb-6">
                                                {outil.description}
                                            </p>
                                            <div className="flex items-center gap-2 text-sm font-bold text-navy group-hover:text-orange transition-colors mt-auto">
                                                Découvrir l'outil <Icons.ExternalLink />
                                            </div>
                                            {/* Ligne décorative au bas de la carte au survol */}
                                            <div className="absolute bottom-0 left-0 w-0 h-1 bg-orange group-hover:w-full transition-all duration-500 ease-out"></div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 5. MINI-GLOSSAIRE */}
            <section className="py-24 bg-white border-t border-slate-200">
                <div className="max-w-[1000px] mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-navy uppercase tracking-wide">
                            {data.glossaire.titre}
                        </h2>
                        <p className="text-slate-500 mt-4 font-body">Le vocabulaire essentiel pour comprendre l'écosystème de l'Intelligence Artificielle.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {data.glossaire.termes.map((item, idx) => (
                            <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <h4 className="font-heading text-lg font-bold text-orange mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-navy block"></span>
                                    {item.terme}
                                </h4>
                                <p className="text-sm text-slate-600 leading-relaxed font-body">
                                    {item.definition}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. CTA FINAL */}
            <section className="relative py-24 px-6 bg-navy text-center overflow-hidden">
                {/* Effet tech : grille de fond très subtile */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                <div className="max-w-[800px] mx-auto relative z-10">
                    <h2 className="font-heading text-3xl md:text-4xl font-black text-white mb-6 uppercase leading-tight tracking-tight">
                        {data.cta.titre}
                    </h2>
                    <p className="text-white/80 font-body text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
                        {data.cta.description}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <a
                            href={data.cta.boutons[0]?.url}
                            className="w-full sm:w-auto inline-block bg-orange hover:bg-white text-white hover:text-orange px-10 py-4 rounded-lg font-heading font-bold shadow-lg shadow-orange/20 transition-all duration-300 hover:-translate-y-1 uppercase tracking-wider"
                        >
                            {data.cta.boutons[0]?.label}
                        </a>

                        <a
                            href={data.cta.boutons[1]?.url}
                            className="w-full sm:w-auto inline-block bg-transparent border-2 border-white/70 text-white hover:bg-white hover:text-navy px-10 py-4 rounded-lg font-heading font-bold transition-all duration-300 hover:-translate-y-1 uppercase tracking-wider"
                        >
                            {data.cta.boutons[1]?.label}
                        </a>
                    </div>
                </div>
            </section>

        </div>
    );
}