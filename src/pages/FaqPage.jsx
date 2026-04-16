import React from 'react';
import Breadcrumb from '../components/Breadcrumb';
import Hero from '../components/Hero/Hero';
import CallToAction from '../components/CallToAction';

// 1. Import du nouveau composant
import Faq from '../components/Faq';

// Import du fichier JSON
import faqData from '../data/json/faq.json';

export default function FaqPage() {
    // On extrait les données du Hero (index 0)
    const heroData = faqData[0].hero;

    // On extrait les catégories de questions (du reste du tableau)
    const faqCategories = faqData.slice(1);

    return (
        <div className="bg-white min-h-screen antialiased">

            {/* HERO SECTION */}
            <Hero
                title={heroData.titre}
                subtitle={heroData.sousTitre}
                video={heroData.video}
            />

            {/* FIL D'ARIANE */}
            <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'FAQ' }]} />

            {/* CONTENU PRINCIPAL FAQ */}
            <main className="max-w-container-lg mx-auto py-12 px-6" id="main-content">

                <div className="text-center mb-12">
                    <h2 className="font-heading text-xl md:text-2xl font-extrabold text-primary uppercase tracking-wider mb-4">
                        Comment pouvons-nous vous aider ?
                    </h2>
                    <p className="text-content-muted text-sm leading-relaxed">
                        Parcourez nos catégories pour trouver rapidement la réponse que vous cherchez.
                    </p>
                </div>

                {/* 2. Appel du composant réutilisable */}
                <Faq data={faqCategories} />

            </main>

            {/* CTA FINAL */}
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