/*
 * Composant StepItem
 * Affiche un élément d'étape dans un processus, avec :
 * - Un cercle numéroté en orange
 * - Un titre en majuscules
 * - Une description courte
 */

export default function StepItem({ num, titre, desc }) {
  return (
    <div className="flex flex-col items-center text-center group">
      {/* Cercle Orange avec 'num' */}
      <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-5 shadow-md transition-transform group-hover:scale-110">
        <span className="text-white font-heading font-bold text-2xl">
          {num}
        </span>
      </div>
      
      {/* 'titre' en Navy */}
      <h4 className="text-primary font-heading font-bold text-lg mb-2 uppercase tracking-wide">
        {titre}
      </h4>
      
      {/* 'desc' en Muted */}
      <p className="text-content-muted font-body text-sm leading-snug max-w-[200px]">
        {desc}
      </p>
    </div>
  );
}