export default function TrustSection({ partenaires, temoignages }) {
  // On double le tableau des partenaires pour créer l'effet de boucle infinie
  const doublePartenaires = [...partenaires, ...partenaires];

  return (
    <div className="bg-slate-50">
      {/* Partenaires avec Défilement Automatique */}
      <section className="py-[70px] bg-white border-t border-border overflow-hidden">
        <div className="max-w-[1100px] mx-auto px-6 mb-12">
          <h2 className="font-heading text-2xl md:text-[32px] font-extrabold text-[#1E2F47] text-center uppercase tracking-wider">
            Ils nous font confiance
          </h2>
        </div>

        {/* Conteneur du Carrousel */}
        <div className="relative flex overflow-hidden group">
          <div className="flex py-4 animate-scroll whitespace-nowrap">
            {doublePartenaires.map((partenaire, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 w-[150px] md:w-[200px] mx-8 md:mx-12 flex items-center justify-center transition-opacity duration-300 opacity-80 hover:opacity-100"
              >
                <img 
                  src={partenaire.logo} 
                  alt={partenaire.nom} 
                  className="h-12 md:h-16 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Ajout du style pour l'animation scroll */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll {
            display: flex;
            width: max-content;
            animation: scroll 60s linear infinite;
          }
        `}} />
      </section>

     
    </div>
  );
}