export default function CardFormation({ 
  title, 
  image, 
  points = [
    "Certification professionnelle reconnue",
    "Formateurs experts du secteur",
    "Plateforme e-learning accessible 24/7"
  ],
  variant = "white" 
}) {
  const isNavy = variant === "navy";

  return (
    <div className={`
      flex flex-col rounded-default overflow-hidden border transition-all duration-300
      ${isNavy 
        ? "bg-navy text-white border-navy shadow-lg" 
        : "bg-white text-dark border-border shadow-sm"}
    `}>
      
      {/* Image de la formation */}
      <div className="h-48 w-full overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contenu de la carte */}
      <div className="p-6 flex flex-col flex-grow">
        
        {/* Titre (Montserrat via index.css) */}
        <h3 className="text-lg font-bold mb-5 min-h-[3rem] leading-tight">
          {title}
        </h3>

        {/* Liste à puces orange */}
        <ul className="space-y-3 mb-8 flex-grow">
          {points.map((point, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <span className="text-orange mt-1.5 text-[10px]">•</span>
              <span className={isNavy ? "text-white/90" : "text-muted"}>
                {point}
              </span>
            </li>
          ))}
        </ul>

        {/* Bouton (Classe personnalisée de ton index.css) */}
        <button className="btn-orange self-start text-sm py-2.5 px-6">
          En savoir plus
        </button>
      </div>
    </div>
  );
}