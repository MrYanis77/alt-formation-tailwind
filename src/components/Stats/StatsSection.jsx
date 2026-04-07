/*
 * Composant StatsSection
 * Affiche une section de statistiques avec des valeurs en gros chiffres orange
 * et des labels en dessous. Utilisé pour mettre en avant des chiffres clés.
 * Props : stats (array d'objets avec value et label)
 */

/*
 * Composant StatsSection corrigé pour fond sombre
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
              {/* Le chiffre est toujours Orange */}
              <span className="font-heading text-4xl md:text-[48px] font-extrabold text-orange leading-none">
                {s.value}
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