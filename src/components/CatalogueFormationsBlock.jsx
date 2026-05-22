import { useState, useMemo, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CardFormation from './Card/CardFormation';
import FiltreCat from './Items/FiltreCat';
import { Filter } from 'lucide-react';

const FALLBACK_IMG = '/assets/images/fallback.webp';

/**
 * Bloc catalogue (filtres + grille) avec id de catégories préfixés — évite les collisions
 * entre sections sur une même page. Avec `legacyDiplCertHashes`, accepte encore les ancres
 * historiques #diplomantes-* / #certifiantes-* (réécrites vers le préfixe du bloc, ex. catalogue).
 * Si `sharedSearchTerm` et `setSharedSearchTerm` sont fournis, la recherche est gérée par le parent.
 */
export default function CatalogueFormationsBlock({
  idPrefix,
  catalogue,
  categoryIcons = {},
  cardTypeBadge,
  sectionTitle,
  sectionDescription,
  sharedSearchTerm,
  setSharedSearchTerm,
  activeCategory: controlledActiveCategory,
  onActiveCategoryChange,
  hideDomainFilter = false,
  onResetAllFilters,
  legacyDiplCertHashes = false,
}) {
  const showSectionHeader = Boolean(sectionTitle?.trim() || sectionDescription?.trim());
  const location = useLocation();
  const [localSearch, setLocalSearch] = useState('');
  const searchControlled = sharedSearchTerm !== undefined && setSharedSearchTerm !== undefined;
  const searchTerm = searchControlled ? sharedSearchTerm : localSearch;
  const setSearchTerm = searchControlled ? setSharedSearchTerm : setLocalSearch;
  const categoryControlled =
    controlledActiveCategory !== undefined && onActiveCategoryChange !== undefined;
  const [localActiveCategory, setLocalActiveCategory] = useState('all');
  const activeCategory = categoryControlled ? controlledActiveCategory : localActiveCategory;
  const setActiveCategory = categoryControlled ? onActiveCategoryChange : setLocalActiveCategory;

  const prefixedCatalogue = useMemo(
    () =>
      catalogue.map((cat) => ({
        ...cat,
        id: `${idPrefix}-${cat.id}`,
      })),
    [catalogue, idPrefix]
  );

  const scrollToCatalogueHeading = useCallback(
    (categoryId) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const root = document.getElementById(`catalogue-formations-root-${idPrefix}`);
          const section = categoryId !== 'all' ? document.getElementById(categoryId) : null;
          const target = section ?? root;
          target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
    },
    [idPrefix]
  );

  const handleFilterCategoryChange = useCallback(
    (categoryId) => {
      setActiveCategory(categoryId);
      if (!categoryControlled) scrollToCatalogueHeading(categoryId);
    },
    [categoryControlled, scrollToCatalogueHeading, setActiveCategory]
  );

  useEffect(() => {
    const raw = (location.hash || '').replace(/^#/, '');
    if (!raw) return;

    let effective = raw;

    if (legacyDiplCertHashes && idPrefix === 'catalogue') {
      if (raw === 'diplomantes' || raw === 'certifiantes') {
        setActiveCategory('all');
        setTimeout(() => {
          document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
        return;
      }
      if (raw.startsWith('diplomantes-')) {
        effective = `catalogue-${raw.slice('diplomantes-'.length)}`;
      } else if (raw.startsWith('certifiantes-')) {
        effective = `catalogue-${raw.slice('certifiantes-'.length)}`;
      }
    }

    if (idPrefix === 'catalogue') {
      if (effective === 'catalogue-comptabilite-gestion') effective = 'catalogue-ressources-humaines';
      if (
        effective === 'catalogue-devops' ||
        effective === 'catalogue-digital-developpement' ||
        effective === 'catalogue-ia-data'
      ) {
        effective = 'catalogue-digital-ia-devops';
      }
    }

    if (effective === idPrefix) {
      setActiveCategory('all');
      setTimeout(() => {
        document.getElementById(idPrefix)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
      return;
    }

    if (effective.startsWith(`${idPrefix}-`)) {
      setActiveCategory(effective);
      setTimeout(() => {
        const el = document.getElementById(effective);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  }, [location.hash, idPrefix, legacyDiplCertHashes, setActiveCategory]);

  const filteredCatalogue = useMemo(
    () =>
      prefixedCatalogue
        .map((cat) => ({
          ...cat,
          items: cat.items.filter((item) =>
            item.titre.toLowerCase().includes(searchTerm.toLowerCase())
          ),
        }))
        .filter((cat) => cat.items.length > 0),
    [prefixedCatalogue, searchTerm]
  );

  useEffect(() => {
    if (activeCategory === 'all') return;
    if (!filteredCatalogue.some((c) => c.id === activeCategory)) {
      setActiveCategory('all');
    }
  }, [filteredCatalogue, activeCategory, setActiveCategory]);

  const visibleCatalogue = useMemo(
    () =>
      activeCategory === 'all'
        ? filteredCatalogue
        : filteredCatalogue.filter((c) => c.id === activeCategory),
    [filteredCatalogue, activeCategory]
  );

  const sectionAria =
    idPrefix === 'catalogue'
      ? 'Catalogue des formations diplômantes et certifiantes'
      : idPrefix === 'diplomantes'
        ? 'Catalogue des formations diplômantes'
        : 'Catalogue des formations certifiantes';

  return (
    <section
      id={idPrefix}
      aria-labelledby={showSectionHeader ? `${idPrefix}-heading` : undefined}
      aria-label={showSectionHeader ? undefined : sectionAria}
      className={`scroll-mt-[280px] border-t border-gray-100 first:border-t-0 ${
        showSectionHeader ? '' : hideDomainFilter ? 'pt-8 lg:pt-12' : 'pt-2'
      }`}
    >
      {showSectionHeader ? (
        <div className="max-w-container-3xl mx-auto px-6 pt-10 pb-4">
          <h2
            id={`${idPrefix}-heading`}
            className="font-heading text-2xl md:text-3xl font-extrabold text-primary uppercase tracking-wide"
          >
            {sectionTitle}
          </h2>
          {sectionDescription ? (
            <p className="text-content-muted text-sm font-body mt-2 max-w-3xl">{sectionDescription}</p>
          ) : null}
        </div>
      ) : null}

      {!hideDomainFilter ? (
        <FiltreCat
          categories={prefixedCatalogue.map((cat) => ({
            id: cat.id,
            label: cat.label,
            icon: categoryIcons[cat.id.replace(`${idPrefix}-`, '')] || <Filter className="w-3.5 h-3.5" />,
          }))}
          activeCat={activeCategory}
          setActiveCat={handleFilterCategoryChange}
          allValue="all"
          allLabel="Tous les domaines"
          sectionLabel="Domaines"
          searchTerm={searchControlled ? undefined : searchTerm}
          setSearchTerm={searchControlled ? undefined : setSearchTerm}
          showSearch={!searchControlled}
          searchPlaceholder="Rechercher une formation…"
        />
      ) : null}

      <div
        id={`catalogue-formations-root-${idPrefix}`}
        className="space-y-4 py-12 scroll-mt-[280px]"
      >
        {visibleCatalogue.length > 0 ? (
          visibleCatalogue.map((cat) => (
            <div key={cat.id} className="animate-fade-in">
              <div id={cat.id} className="max-w-container-3xl mx-auto px-6 mb-10 scroll-mt-[280px]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                    {categoryIcons[cat.id.replace(`${idPrefix}-`, '')] || (
                      <Filter className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl md:text-3xl font-extrabold text-primary uppercase tracking-wide">
                      {cat.label}
                    </h3>
                    {cat.description && (
                      <p className="text-content-muted text-sm font-body">{cat.description}</p>
                    )}
                  </div>
                </div>
                <div className="w-full h-px bg-gray-100" />
              </div>

              <div className="px-6">
                <div className="max-w-container-3xl mx-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {cat.items.map((item, idx) => (
                      <CardFormation
                        key={idx}
                        title={item.titre}
                        image={item.imageUrl || FALLBACK_IMG}
                        variant="white"
                        href={item.href}
                        typeBadge={item.typeBadge || cardTypeBadge}
                        modalites={item.modalites}
                        compact
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 px-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <Filter className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Aucune formation trouvée</h3>
            <p className="text-content-muted">Essayez d&apos;ajuster vos critères de recherche.</p>
            <button
              type="button"
              onClick={() => {
                if (onResetAllFilters) {
                  onResetAllFilters();
                  return;
                }
                setSearchTerm('');
                handleFilterCategoryChange('all');
                if (!categoryControlled) scrollToCatalogueHeading('all');
              }}
              className="mt-6 text-accent font-bold hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
