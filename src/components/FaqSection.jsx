import React from 'react';
import { Link } from 'react-router-dom';
import Faq from './Faq';
import faqData from '../data/json/faq.json';

/**
 * FaqSection — Composant réutilisable de mini-FAQ à insérer dans n'importe quelle page.
 * @param {string} categoryId - ID de la catégorie FAQ à afficher (ex: "formations", "financement", "bilan")
 * @param {number} maxQuestions - Nombre max de questions à afficher (défaut: 4)
 */
export default function FaqSection({ categoryId = "formations", maxQuestions = 4 }) {
    // Cherche la catégorie correspondante (skip le hero à l'index 0)
    const allCategories = faqData.slice(1);
    const category = allCategories.find(c => c.id === categoryId);

    if (!category) return null;

    // Limite le nombre de questions
    const limitedCategory = {
        ...category,
        questions: category.questions.slice(0, maxQuestions)
    };

    return (
        <section className="py-20 px-6 bg-surface-soft border-t border-border">
            <div className="max-w-container-lg mx-auto">
                <div className="text-center mb-12">
                    <span className="inline-block text-accent font-bold text-xs uppercase tracking-[0.2em] mb-3">FAQ</span>
                    <h2 className="font-heading text-2xl md:text-h2 font-extrabold text-primary uppercase tracking-wider">
                        Questions fréquentes
                    </h2>
                </div>

                <Faq data={[limitedCategory]} />

                <div className="text-center mt-10">
                    <Link
                        to="/faq"
                        className="inline-flex items-center gap-2 text-accent font-bold text-sm hover:text-accent-dark transition-colors no-underline uppercase tracking-wider"
                    >
                        Voir toutes les questions →
                    </Link>
                </div>
            </div>
        </section>
    );
}
