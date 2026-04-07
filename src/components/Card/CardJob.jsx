/*
 * Composant CardJob
 * Affiche une carte pour une offre d'emploi avec :
 * - Le titre du poste
 * - Le type de contrat (CDI, CDD, Freelance)
 * - Le lieu et la date de publication
 * - Un bouton pour postuler
 */

export default function CardJob({ titre, type, lieu, date, onClick, href = "#contact" }) {
  return (
    <div className="bg-white rounded-default shadow-sm border border-border border-l-[6px] border-l-orange p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-md w-full">
      <div className="flex-1">
        <h3 className="text-navy font-heading font-extrabold text-xl md:text-2xl mb-1">
          {titre}
        </h3>
        {/* 'type' affiche CDI, CDD ou Freelance */}
        <p className="text-orange font-bold text-xs uppercase tracking-wider mb-4">
          Type de contrat : {type}
        </p>
        
        <div className="flex flex-wrap gap-x-12 gap-y-4">
          <div className="flex flex-col">
            <span className="text-dark font-bold text-sm">📍 Lieu :</span>
            <span className="text-muted text-sm">{lieu}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-dark font-bold text-sm">📅 Publié le :</span>
            <span className="text-muted text-sm leading-tight">
              {date}
            </span>
          </div>
        </div>
      </div>

      <a 
        href={"/contact"}
        onClick={onClick}
        className="btn-orange px-10 py-3 self-start md:self-center shadow-lg hover:shadow-orange/20 active:scale-95 transition-all no-underline inline-block text-center"
      >
        Postuler
      </a>
    </div>
  );
}