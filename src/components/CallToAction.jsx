import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction = ({
    titre,
    sousTitre,

    // Bouton Principal (Requis)
    texteBouton,
    lienBouton = "/contact",

    // Bouton Secondaire (Optionnel)
    texteBoutonSecondaire,
    lienBoutonSecondaire,

    variante = "claire"
}) => {

    const estSombre = variante === "sombre";

    return (
        <section className={`relative py-12 px-6 text-center border-t overflow-hidden ${estSombre
            ? "bg-primary text-white border-primary/10"
            : "bg-surface-soft text-primary border-gray-100"
            }`}>

            {/* Décoration d'arrière-plan optionnelle pour la version sombre */}
            {estSombre && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>
            )}

            <div className="max-w-3xl mx-auto relative z-10">
                {/* TITRE (Taille et marges réduites) */}
                <h2 className={`font-heading text-2xl md:text-3xl font-extrabold uppercase tracking-tight leading-tight ${sousTitre ? 'mb-3' : 'mb-6'}`}>
                    {titre}
                </h2>

                {/* SOUS-TITRE (Taille et marges réduites) */}
                {sousTitre && (
                    <p className={`font-body text-sm md:text-base mb-6 max-w-xl mx-auto leading-relaxed ${estSombre ? "text-slate-300" : "text-slate-600"
                        }`}>
                        {sousTitre}
                    </p>
                )}

                {/* ZONE DES BOUTONS (Espacement réduit) */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

                    {/* Bouton Principal (Orange) - Paddings réduits */}
                    <Link
                        to={lienBouton}
                        className={`w-full sm:w-auto inline-block bg-accent text-white px-8 py-3 rounded-lg font-heading font-bold transition-all duration-300 shadow-md hover:shadow-accent/20 hover:-translate-y-1 uppercase tracking-widest text-xs ${estSombre ? "hover:bg-white hover:text-accent" : "hover:bg-accent-dark"
                            }`}
                    >
                        {texteBouton}
                    </Link>

                    {/* Bouton Secondaire (Outline / Transparent) - Paddings réduits */}
                    {texteBoutonSecondaire && lienBoutonSecondaire && (
                        <Link
                            to={lienBoutonSecondaire}
                            className={`w-full sm:w-auto inline-block px-8 py-3 rounded-lg font-heading font-bold transition-all duration-300 hover:-translate-y-1 uppercase tracking-widest text-xs border-2 ${estSombre
                                ? "bg-transparent border-white/70 text-white hover:bg-white hover:text-primary"
                                : "bg-transparent border-primary/20 text-primary hover:border-primary hover:bg-primary hover:text-white"
                                }`}
                        >
                            {texteBoutonSecondaire}
                        </Link>
                    )}

                </div>
            </div>
        </section>
    );
};

export default CallToAction;