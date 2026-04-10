import React, { useState, useEffect } from 'react';

/*
 * Sous-composant pour animer le chiffre de 0 à sa valeur cible.
 * Il gère intelligemment les préfixes et suffixes (ex: "+150", "99%").
 */
const AnimatedNumber = ({ value, duration = 2000 }) => {
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    // Expression régulière pour séparer préfixe, nombre et suffixe
    // Gère les entiers et les décimales
    const match = String(value).match(/^(\D*)(\d+(?:\.\d+)?)(\D*)$/);

    // Si la valeur n'est pas un nombre (ex: juste du texte), on l'affiche direct
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const prefix = match[1];
    const target = parseFloat(match[2]);
    const suffix = match[3];
    const isFloat = match[2].includes('.');

    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      // Calcul de la progression entre 0 et 1
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Fonction d'ease-out (décélération vers la fin) pour un effet plus naturel
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = target * easeProgress;

      // Formatage (garde une décimale si le nombre d'origine en avait une)
      const formattedVal = isFloat
        ? currentVal.toFixed(1)
        : Math.floor(currentVal);

      setDisplayValue(`${prefix}${formattedVal}${suffix}`);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        // S'assurer qu'à la fin de l'animation, on affiche exactement la prop d'origine
        setDisplayValue(value);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration]);

  return <>{displayValue}</>;
};

/*
 * Composant StatsSection corrigé pour fond sombre + Animation Count Up
 */
export default function StatsSection({ stats, title, variant = 'navy' }) {
  const isNavy = variant === 'navy';

  return (
    <section className={`py-10 px-6 ${isNavy ? 'bg-navy' : 'bg-[#F9FAFB]'}`}>
      <div className="max-w-[1100px] mx-auto text-center">

        {/* Affichage conditionnel du titre */}
        {title && (
          <h2 className={`font-heading text-2xl md:text-3xl font-bold mb-12 uppercase tracking-wide ${isNavy ? 'text-white' : 'text-navy'}`}>
            {title}
          </h2>
        )}

        <div className="flex justify-center gap-10 md:gap-20 flex-wrap">
          {stats.map((s, idx) => (
            <div key={idx} className="flex flex-col items-center min-w-[150px]">
              {/* Le chiffre est toujours Orange et maintenant animé */}
              <span className="font-heading text-4xl md:text-[48px] font-extrabold text-orange leading-none">
                <AnimatedNumber value={s.value} duration={2000} />
              </span>

              {/* Le label change de couleur selon le fond */}
              <span className={`text-[13px] font-medium uppercase mt-4 tracking-tight font-body ${isNavy ? 'text-white/90' : 'text-[#444]'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}