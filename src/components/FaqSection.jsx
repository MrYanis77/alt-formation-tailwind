import React from 'react';
import { Link } from 'react-router-dom';
import Faq from './Faq';
import faqData from '../data/json/faq.json';

/**
<<<<<<< HEAD
 * FaqSection — Mini-FAQ réutilisable.
 * @param {string} [categoryId] — Une catégorie (comportement historique si categoryIds absent).
 * @param {number} [maxQuestions=4] — Nb max de questions pour categoryId seul, ou défaut par catégorie avec categoryIds.
 * @param {string[]} [categoryIds] — Si défini, plusieurs catégories fusionnées sous un seul bloc.
 * @param {number} [maxQuestionsPerCategory] — Plafond par catégorie quand categoryIds est utilisé (sinon maxQuestions).
 */
export default function FaqSection({
    categoryId = 'formations',
    maxQuestions = 4,
    categoryIds,
    maxQuestionsPerCategory,
}) {
    const allCategories = faqData.slice(1);

    let limitedCategories;

    if (categoryIds && categoryIds.length > 0) {
        const perCat = maxQuestionsPerCategory ?? maxQuestions;
        limitedCategories = categoryIds
            .map((fid) => allCategories.find((c) => c.id === fid))
            .filter(Boolean)
            .map((cat) => ({
                ...cat,
                questions: cat.questions.slice(0, perCat),
            }));
    } else {
        const category = allCategories.find((c) => c.id === categoryId);
        if (!category) return null;
        limitedCategories = [
            {
                ...category,
                questions: category.questions.slice(0, maxQuestions),
            },
        ];
    }

    if (!limitedCategories.length) return null;

    return (
        <section className="py-12 lg:py-16 px-6 bg-surface-soft border-t border-border">
            <div className="max-w-container-lg mx-auto">
                <div className="text-center mb-12">
                    <span className="inline-block text-accent font-bold text-xs uppercase tracking-[0.2em] mb-2">FAQ</span>
                    <h2 className="font-heading font-extrabold text-primary uppercase tracking-wider text-2xl md:text-h2">
=======
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
>>>>>>> 0a48c2f2e8ddbb4846f055db09011af7079eaa03
                        Questions fréquentes
                    </h2>
                </div>

<<<<<<< HEAD
                <Faq data={limitedCategories} />
=======
                <Faq data={[limitedCategory]} />
>>>>>>> 0a48c2f2e8ddbb4846f055db09011af7079eaa03

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
