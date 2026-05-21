import React, { useMemo, useState } from 'react';
import Faq from './Faq';
import { faqCategories } from '../data/faqSite';

/** Nombre max de questions affichées avant « Voir le reste des questions » (même page). */
export const FAQ_PAGE_PREVIEW_COUNT = 10;

/**
 * @typedef {object} FaqSectionProps
 * @property {string} [categoryId]
 * @property {number} [maxQuestions]
 * @property {string[]} [categoryIds]
 * @property {number} [maxQuestionsPerCategory]
 * @property {Record<string, (qa: { q: string, a: string }) => boolean>} [filtersByCategoryId]
 */

/**
 * Mini-FAQ — questions issues de `faqSite`, rubrique(s) selon la page.
 * Les questions du thème sont toutes chargées (après filtres, sans plafond par défaut) ;
 * `FAQ_PAGE_PREVIEW_COUNT` questions par rubrique sont visibles jusqu'au clic sur « Voir le reste des questions ».
 */
export default function FaqSection({
    categoryId = 'formation',
    maxQuestions,
    categoryIds,
    maxQuestionsPerCategory,
    filtersByCategoryId,
}) {
    const [expandAllThemes, setExpandAllThemes] = useState(false);

    const limitedCategories = useMemo(() => {
        const applyFilterAndOptionalCap = (cat, cap) => {
            const filter = filtersByCategoryId?.[cat.id];
            let qs = cat.questions || [];
            if (filter) qs = qs.filter(filter);
            const capped = cap != null ? qs.slice(0, cap) : qs;
            return {
                ...cat,
                questions: capped,
            };
        };

        if (categoryIds && categoryIds.length > 0) {
            const perCatCap = maxQuestionsPerCategory ?? maxQuestions ?? null;
            return categoryIds
                .map((fid) => faqCategories.find((c) => c.id === fid))
                .filter(Boolean)
                .map((cat) => applyFilterAndOptionalCap(cat, perCatCap))
                .filter((cat) => cat.questions.length > 0);
        }

        const category = faqCategories.find((c) => c.id === categoryId);
        if (!category) return [];
        const cap = maxQuestions ?? null;
        const capped = applyFilterAndOptionalCap(category, cap);
        return capped.questions.length > 0 ? [capped] : [];
    }, [
        categoryId,
        categoryIds,
        maxQuestions,
        maxQuestionsPerCategory,
        filtersByCategoryId,
    ]);

    const hasMoreToReveal = useMemo(
        () =>
            limitedCategories.some((cat) => cat.questions.length > FAQ_PAGE_PREVIEW_COUNT),
        [limitedCategories],
    );

    const multiCategory = Boolean(categoryIds && categoryIds.length > 1);

    if (!limitedCategories.length) return null;

    return (
        <section className="py-12 lg:py-16 px-6 bg-surface-soft border-t border-border">
            <div className="max-w-container-lg mx-auto">
                <div className="text-center mb-12">
                    <span className="inline-block text-accent font-bold text-xs uppercase tracking-[0.2em] mb-2">
                        FAQ
                    </span>
                    <h2 className="font-heading font-extrabold text-primary uppercase tracking-wider text-2xl md:text-h2">
                        Questions fréquentes
                    </h2>
                </div>

                <Faq
                    data={limitedCategories}
                    showCategoryMeta={multiCategory}
                    initialVisibleCount={FAQ_PAGE_PREVIEW_COUNT}
                    expandedGlobally={expandAllThemes}
                    disableInlineExpand
                />

                {hasMoreToReveal ? (
                    <div className="text-center mt-10">
                        {!expandAllThemes ? (
                            <button
                                type="button"
                                onClick={() => setExpandAllThemes(true)}
                                className="inline-flex items-center gap-2 text-accent font-bold text-sm hover:text-accent-dark transition-colors uppercase tracking-wider bg-transparent border-0 cursor-pointer font-[inherit]"
                            >
                                Voir le reste des questions →
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setExpandAllThemes(false)}
                                className="inline-flex items-center gap-2 text-accent font-bold text-sm hover:text-accent-dark transition-colors uppercase tracking-wider bg-transparent border-0 cursor-pointer font-[inherit]"
                            >
                                Voir moins
                            </button>
                        )}
                    </div>
                ) : null}
            </div>
        </section>
    );
}
