import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import Hero from '../components/Hero/Hero';
import CallToAction from '../components/CallToAction';
import Faq from '../components/Faq';
import { faqHero, faqCategories } from '../data/faqSite';

export default function FaqPage() {
    const { hash } = useLocation();

    useEffect(() => {
        if (!hash) return;
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [hash]);

    return (
        <div className="bg-white min-h-screen antialiased">
            <Hero
                title={faqHero.titre}
                subtitle={faqHero.sousTitre}
                video={faqHero.video}
            />

            <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'FAQ' }]} />

            <main className="max-w-container-2xl mx-auto py-12 px-6" id="main-content">
                <div className="text-center mb-12">
                    <h2 className="font-heading text-xl md:text-2xl font-extrabold text-primary uppercase tracking-wider mb-4">
                        Comment pouvons-nous vous aider ?
                    </h2>
                    <p className="text-content-muted text-sm leading-relaxed max-w-2xl mx-auto">
                        Six rubriques couvrent l&apos;ensemble de nos prestations : formations, financement, bilan de
                        compétences, certification, accompagnement carrière, ainsi que Qualiopi, accessibilité et
                        démarches qualité.
                    </p>
                </div>

                <nav
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14"
                    aria-label="Rubriques de la FAQ"
                >
                    {faqCategories.map((cat) => (
                        <a
                            key={cat.id}
                            href={`#faq-${cat.id}`}
                            className="block p-5 rounded-xl border border-gray-200 bg-surface-soft hover:border-accent hover:shadow-sm transition-all no-underline group"
                        >
                            <span className="text-accent font-bold text-xs uppercase tracking-[0.15em]">
                                {cat.order}. {cat.theme}
                            </span>
                            <p className="font-heading font-extrabold text-primary text-sm uppercase mt-2 group-hover:text-accent transition-colors">
                                {cat.categorie}
                            </p>
                            <p className="text-content-muted text-xs mt-2">
                                {cat.questions.length} questions-réponses
                            </p>
                        </a>
                    ))}
                </nav>

                <Faq data={faqCategories} initialVisibleCount={10} />
            </main>

            <CallToAction
                variante="sombre"
                titre="Encore une question ?"
                sousTitre="Nos conseillers sont disponibles pour vous répondre."
                texteBouton="Contactez-nous"
                lienBouton="/contact"
            />
        </div>
    );
}
