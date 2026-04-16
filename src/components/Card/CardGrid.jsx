/*
 * Composant CardGrid
 * Affiche une grille de cartes pour les services ou formations.
 * Supporte deux variantes :
 * - "training" : cartes avec image pour les formations
 * - "default" : cartes simples pour les services/plateformes
 * Props : services (array), cols (2 ou 3), variant ("training" ou "default")
 */

export default function CardGrid({ services, cols = 3, variant = "default" }) {
  const gridCols = cols === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3';
  
  return (
    <div className={`grid grid-cols-1 ${gridCols} gap-6 md:gap-10`}>
      {services.map((service) => {
        // Logique pour la variante d'affichage des formations (Training)
        if (variant === "training") {
          const isNavy = service.theme === "navy";
          
          return (
            <article 
              key={service.titre} 
              className="flex flex-col overflow-hidden rounded-sm border border-border bg-white shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Image de la formation */}
              <div className="h-48 overflow-hidden">
                <img 
                  src={service.image || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600"} 
                  alt={service.titre} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>

              {/* Contenu textuel avec fond conditionnel */}
              <div className={`p-6 flex flex-col flex-grow ${isNavy ? 'bg-primary text-white' : 'bg-white text-content-dark'}`}>
                <h3 className="font-heading font-bold text-[17px] mb-4 leading-tight">
                  {service.titre}
                </h3>
                
                <ul className="flex flex-col gap-2.5 mb-6 flex-grow">
                  {service.items.map((item) => (
                    <li key={item} className="relative pl-5 text-small leading-snug font-body">
                      <span className="absolute left-0 text-accent font-bold">•</span>
                      <span className={isNavy ? 'text-white/80' : 'text-content-muted'}>{item}</span>
                    </li>
                  ))}
                </ul>

                <button className="btn-orange self-start text-small py-2 px-6 uppercase tracking-wider">
                  En savoir plus
                </button>
              </div>
            </article>
          );
        }

        // Variante par défaut (Platform / Services)
        return (
          <article 
            key={service.titre} 
            className="flex flex-col p-8 border border-border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300 border-t-4 hover:border-t-orange"
          >
            <h3 className="font-heading font-bold text-base text-primary mb-4 uppercase tracking-wide">
              {service.titre}
            </h3>
            {service.description && (
              <p className="text-small text-content-muted mb-4 leading-relaxed font-body">
                {service.description}
              </p>
            )}
            <ul className="flex flex-col gap-3 list-none p-0 m-0">
              {service.items.map((item) => (
                <li 
                  key={item} 
                  className="relative pl-5 text-small text-content-muted leading-relaxed font-body before:content-['•'] before:absolute before:left-0 before:text-accent before:font-bold"
                >
                  {item}
                </li>
              ))}
            </ul>
          </article>
        );
      })}
    </div>
  );
}