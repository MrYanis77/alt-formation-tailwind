import { Search, Filter } from 'lucide-react';

/**
 * Barre de filtre par catégorie réutilisable — sticky, avec chips pill.
 *
 * Props
 * ─────────────────────────────────────────────────────────────────────────────
 * categories        string[] | {id, label, icon?}[]   — liste des catégories
 * activeCat         string                             — catégorie active
 * setActiveCat      (id: string) => void
 * allValue          string   (défaut : "Tous")         — valeur du bouton "Tout"
 * allLabel          string   (défaut : allValue)       — libellé du bouton "Tout"
 * sectionLabel      string   (défaut : "Catégories")   — label à gauche
 * searchTerm        string   (optionnel)
 * setSearchTerm     fn       (optionnel)
 * searchPlaceholder string   (défaut : "Rechercher…")
 * showSearch        bool     (défaut : true) — masquer la zone recherche (ex. recherche gérée au-dessus)
 */
const FiltreCat = ({
  categories = [],
  activeCat,
  setActiveCat,
  allValue = 'Tous',
  allLabel,
  sectionLabel = 'Catégories',
  searchTerm,
  setSearchTerm,
  searchPlaceholder = 'Rechercher…',
  showSearch = true,
}) => {
  const normalizedCats = categories
    .map(cat => (typeof cat === 'string' ? { id: cat, label: cat } : cat))
    .filter(cat => cat.id !== allValue);

  const hasSearch =
    showSearch && searchTerm !== undefined && setSearchTerm !== undefined;
  const displayAllLabel = allLabel ?? allValue;

  return (
    <section className="py-6 lg:py-7 bg-white/95 backdrop-blur-md border-b border-border sticky top-20 z-30 shadow-[0_4px_24px_-4px_rgba(0,40,69,0.08)]">
      <div className="max-w-container-3xl mx-auto px-6">

        {hasSearch && (
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-5">
            <div className="relative flex-1 sm:max-w-sm group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-content-muted group-focus-within:text-accent transition-colors" />
              </div>
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="block w-full pl-10 pr-10 py-2.5 border border-border rounded-lg bg-surface-soft focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all text-sm text-primary font-body outline-none placeholder:text-content-muted"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-content-muted hover:text-primary transition-colors"
                  aria-label="Effacer la recherche"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
          <span className="shrink-0 text-xs font-semibold text-content-muted uppercase tracking-widest mr-1 hidden md:block">
            {sectionLabel} :
          </span>

          <button
            onClick={() => setActiveCat(allValue)}
            className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap border ${
              activeCat === allValue
                ? 'bg-accent text-white border-accent shadow-[0_2px_8px_rgba(243,146,51,0.35)] scale-[1.03]'
                : 'bg-white text-primary border-border hover:border-accent/50 hover:text-accent hover:bg-accent/5'
            }`}
          >
            {displayAllLabel}
          </button>

          <div className="w-px h-5 bg-border shrink-0 mx-0.5 hidden md:block" />

          {normalizedCats.map(cat => {
            const isActive = activeCat === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap border ${
                  isActive
                    ? 'bg-primary text-white border-primary shadow-[0_2px_8px_rgba(0,40,69,0.25)] scale-[1.03]'
                    : 'bg-white text-primary border-border hover:border-primary/40 hover:text-primary hover:bg-primary/5'
                }`}
              >
                {cat.icon && (
                  <span className={`[&>svg]:w-3.5 [&>svg]:h-3.5 transition-colors ${isActive ? 'text-white' : 'text-content-muted'}`}>
                    {cat.icon}
                  </span>
                )}
                {cat.label}
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FiltreCat;
