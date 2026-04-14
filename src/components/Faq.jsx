import React, { useState } from 'react';

export default function Faq({ data }) {
    // État pour gérer l'ouverture/fermeture des questions
    const [openQuestion, setOpenQuestion] = useState(null);

    const toggleQuestion = (id) => {
        setOpenQuestion(openQuestion === id ? null : id);
    };

    // Sécurité au cas où la donnée n'est pas encore chargée
    if (!data || data.length === 0) return null;

    return (
        <div className="w-full">
            {data.map((category, catIndex) => (
                <section key={category.id || catIndex} className="mb-12">

                    {/* Header de la Catégorie (Optionnel si vous n'avez pas de catégorie) */}
                    {category.categorie && (
                        <div className="flex items-center mb-6">
                            <div className="w-[5px] h-7 bg-orange rounded-full mr-4"></div>
                            <h3 className="font-heading text-lg md:text-xl font-[800] text-navy uppercase tracking-tight">
                                {category.categorie}
                            </h3>
                        </div>
                    )}

                    {/* Liste des questions en accordéon */}
                    <div className="space-y-3">
                        {category.questions.map((item, qIndex) => {
                            const questionId = `${catIndex}-${qIndex}`;
                            const isOpen = openQuestion === questionId;

                            return (
                                <div
                                    key={qIndex}
                                    className={`border rounded-xl transition-all duration-300 ${isOpen ? 'border-orange bg-orange/5 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                                >
                                    <button
                                        onClick={() => toggleQuestion(questionId)}
                                        className="w-full text-left px-5 py-4 flex items-center justify-between focus:outline-none cursor-pointer"
                                        aria-expanded={isOpen}
                                    >
                                        <span className={`font-bold text-sm pr-4 ${isOpen ? 'text-orange' : 'text-navy'}`}>
                                            {item.q}
                                        </span>

                                        <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-300 ${isOpen ? 'bg-orange text-white rotate-180' : 'bg-gray-100 text-gray-500'}`}>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                {isOpen ? (
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                ) : (
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                )}
                                            </svg>
                                        </span>
                                    </button>

                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                                    >
                                        <div className="px-5 pb-5 pt-1 text-slate-600 text-sm leading-relaxed">
                                            {item.a}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            ))}
        </div>
    );
}