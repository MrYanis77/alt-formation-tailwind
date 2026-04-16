import React from 'react';

export default function CertificationSection({ data }) {
    if (!data) return null;

    return (
        <section className="py-16 bg-primary relative overflow-hidden border-y-4 border-accent">
            {/* Lueur subtile en fond pour le côté "Premium" */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full bg-white opacity-5 blur-[100px] pointer-events-none"></div>

            <div className="max-w-container-xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">

                {/* Partie Texte */}
                <div className="text-center md:text-left flex-1">
                    <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-white uppercase tracking-wider mb-4">
                        {data.titre}
                    </h2>
                    <p className="text-white/80 font-body text-base max-w-2xl leading-relaxed mx-auto md:mx-0">
                        {data.description}
                    </p>
                </div>

                {/* Partie Badges/Images */}
                <div className="flex-shrink-0 flex gap-6 items-center justify-center flex-wrap">
                    {data.badges.map((badge, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-center bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/20 shadow-2xl hover:scale-105 transition-transform duration-300"
                        >
                            <img
                                src={badge.image}
                                alt={badge.nom}
                                className="h-20 md:h-24 w-auto object-contain bg-white rounded-lg p-3 shadow-lg"
                            />
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}