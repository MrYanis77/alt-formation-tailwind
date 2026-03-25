export default function DetailHeader({ titre, code, duree, rythme }) {
  return (
    <div className="bg-white rounded-default shadow-sm border border-border border-l-[6px] border-l-orange p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-md">
      <div className="flex-1">
        {/* Utilise 'titre' de tes datas */}
        <h3 className="text-navy font-heading font-extrabold text-xl md:text-2xl mb-1">
          {titre}
        </h3>
        {/* 'code' contient déjà "Code RNCP : ..." dans tes datas */}
        <p className="text-orange font-bold text-xs uppercase tracking-wider mb-4">
          {code}
        </p>
        
        <div className="flex flex-wrap gap-x-12 gap-y-4">
          <div className="flex flex-col">
            <span className="text-dark font-bold text-sm">Durée :</span>
            <span className="text-muted text-sm">{duree}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-dark font-bold text-sm">Rythme :</span>
            <span className="text-muted text-sm max-w-[280px] leading-tight">
              {rythme}
            </span>
          </div>
        </div>
      </div>

      <button className="btn-orange px-10 py-3 self-start md:self-center shadow-lg hover:shadow-orange/20 active:scale-95 transition-all">
        Postuler
      </button>
    </div>
  );
}