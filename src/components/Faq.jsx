import React, { useState } from 'react';

/**
 * @param {object[]} data — Catégories FAQ
 * @param {number|null} [initialVisibleCount] — Nb de questions visibles avant « Voir plus » (null = tout afficher)
 * @param {boolean} [showCategoryMeta=true] — Affiche thème, sous-titre et compteur
 * @param {boolean} [expandedGlobally=false] — Si true, toutes les questions sont visibles (ex. lien « Voir le reste » page)
 * @param {boolean} [disableInlineExpand=false] — Masque le « Voir plus » par rubrique (mini-FAQ avec lien global en bas)
 */
export default function Faq({
    data,
    initialVisibleCount = null,
    showCategoryMeta = true,
    expandedGlobally = false,
    disableInlineExpand = false,
}) {
    const [openQuestion, setOpenQuestion] = useState(null);
    const [expandedCategories, setExpandedCategories] = useState({});

    const toggleQuestion = (id) => {
        setOpenQuestion(openQuestion === id ? null : id);
    };

    const toggleCategoryExpanded = (catKey) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [catKey]: !prev[catKey],
        }));
    };

    if (!data || data.length === 0) return null;

    return (
        <div className="w-full">
            {data.map((category, catIndex) => {
                const catKey = category.id || String(catIndex);
                const total = category.questions?.length ?? 0;
                const categoryExpanded = expandedGlobally || expandedCategories[catKey];
                const limit =
                    initialVisibleCount != null && !categoryExpanded
                        ? Math.min(initialVisibleCount, total)
                        : total;
                const visibleQuestions = category.questions.slice(0, limit);
                const hasMore =
                    initialVisibleCount != null &&
                    total > initialVisibleCount &&
                    !categoryExpanded &&
                    !expandedGlobally;
                const canCollapse =
                    initialVisibleCount != null &&
                    total > initialVisibleCount &&
                    expandedCategories[catKey] &&
                    !expandedGlobally;

                return (
                    <section
                        key={catKey}
                        id={`faq-${catKey}`}
                        className="mb-14 scroll-mt-24"
                    >
                        {showCategoryMeta && (category.theme || category.categorie) && (
                            <header className="mb-6">
                                {category.order != null && category.theme && (
                                    <p className="text-accent font-bold text-xs uppercase tracking-[0.2em] mb-2">
                                        {category.order}. {category.theme}
                                    </p>
                                )}
                                {category.categorie && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-[5px] min-h-[1.75rem] self-stretch bg-accent rounded-full shrink-0" />
                                        <div>
                                            <h3 className="font-heading text-lg md:text-xl font-extrabold text-primary uppercase tracking-tight">
                                                {category.categorie}
                                            </h3>
                                            <p className="text-content-muted text-sm mt-1">
                                                {total} question{total > 1 ? 's' : ''}-réponse{total > 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </header>
                        )}

                        {!showCategoryMeta && category.categorie && (
                            <div className="flex items-center mb-6">
                                <div className="w-[5px] h-7 bg-accent rounded-full mr-4" />
                                <h3 className="font-heading text-lg md:text-xl font-extrabold text-primary uppercase tracking-tight">
                                    {category.categorie}
                                </h3>
                            </div>
                        )}

                        <div className="space-y-3">
                            {visibleQuestions.map((item, qIndex) => {
                                const questionId = `${catKey}-${qIndex}`;
                                const isOpen = openQuestion === questionId;

                                return (
                                    <div
                                        key={qIndex}
                                        className={`border rounded-xl transition-all duration-300 ${isOpen ? 'border-accent bg-accent/5 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => toggleQuestion(questionId)}
                                            className="w-full text-left px-5 py-4 flex items-center justify-between focus:outline-none cursor-pointer"
                                            aria-expanded={isOpen}
                                        >
                                            <span
                                                className={`font-bold text-sm pr-4 ${isOpen ? 'text-accent' : 'text-primary'}`}
                                            >
                                                {item.q}
                                            </span>

                                            <span
                                                className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-300 ${isOpen ? 'bg-accent text-white rotate-180' : 'bg-gray-100 text-gray-500'}`}
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    aria-hidden
                                                >
                                                    {isOpen ? (
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M20 12H4"
                                                        />
                                                    ) : (
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M12 4v16m8-8H4"
                                                        />
                                                    )}
                                                </svg>
                                            </span>
                                        </button>

                                        <div
                                            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}
                                        >
                                            <div className="px-5 pb-5 pt-1 text-slate-600 text-sm leading-relaxed">
                                                {item.a}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {(hasMore || canCollapse) && !disableInlineExpand && (
                            <div className="mt-4 text-center">
                                <button
                                    type="button"
                                    onClick={() => toggleCategoryExpanded(catKey)}
                                    className="inline-flex items-center gap-2 text-accent font-bold text-sm hover:text-accent-dark transition-colors uppercase tracking-wider"
                                >
                                    {hasMore
                                        ? `Voir les ${total - initialVisibleCount} autres questions`
                                        : 'Voir moins'}
                                </button>
                            </div>
                        )}
                    </section>
                );
            })}
        </div>
    );
}


