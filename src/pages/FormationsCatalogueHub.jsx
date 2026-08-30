import { useMemo, useCallback } from 'react';
import { Link, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import Hero from '../components/Hero/Hero';
import Breadcrumb from '../components/Breadcrumb';
import CallToAction from '../components/CallToAction';
import CatalogueFormationsPage from '../components/CatalogueFormationsPage';
import CatalogueFormationsBlock from '../components/CatalogueFormationsBlock';
import CataloguePlusFiltres from '../components/CataloguePlusFiltres';
import useCatalogueFiltersSession from '../hooks/useCatalogueFiltersSession';
import { usePublicFormations } from '../features/formations/hooks/usePublicFormations';
import { buildCatalogueFromCourses } from '../features/formations/domain/catalog';
import { hero as heroElearning } from '../data/elearning';
import { normalizeCatalogType } from '../data/formationsCatalogTypes';
import {
  MODALITE_FILTERS,
  matchesModaliteFilter,
} from '../features/formations/utils/formationModalites';
import {
  Brain,
  Calculator,
  Code,
  Container,
  Cpu,
  FileSpreadsheet,
  HardDrive,
  Monitor,
  Search,
  Shield,
  Users,
} from 'lucide-react';

const categoryIcons = {
  'cybersecurite-reseaux': <HardDrive className="w-6 h-6" />,
  'digital-ia-devops': <Code className="w-6 h-6" />,
  'digital-developpement': <Code className="w-6 h-6" />,
  'ia-data': <Brain className="w-6 h-6" />,
  'ressources-humaines': <Users className="w-6 h-6" />,
  'comptabilite-gestion': <Calculator className="w-6 h-6" />,
  cybersecurite: <Shield className="w-6 h-6" />,
  management: <Users className="w-6 h-6" />,
  'devops-devsecops': <Container className="w-6 h-6" />,
  devops: <Container className="w-6 h-6" />,
  devsecops: <Container className="w-6 h-6" />,
  'informatique-systemes-reseaux': <Monitor className="w-6 h-6" />,
  'systemes-embarques-iot': <Cpu className="w-6 h-6" />,
  bureautique: <FileSpreadsheet className="w-6 h-6" />,
};

const FORMATION_TYPE_FILTERS = [
  { id: 'all', label: 'Toutes', hint: 'Diplômantes et certifiantes' },
  { id: 'diplomantes', label: 'Diplômantes', hint: 'Parcours longs certifiants' },
  { id: 'certifiantes', label: 'Certifiantes', hint: 'Sessions certifiantes' },
];

const REPERTOIRE_TITRE_FILTERS = [
  { id: 'all', label: 'Tous les référentiels', hint: 'RNCP, RS et autres' },
  { id: 'RNCP', label: 'Titres RNCP', hint: 'Répertoire national' },
  { id: 'RS', label: 'Titres RS', hint: 'Répertoire spécifique' },
];

const COMBINED_HERO = {
  titre: 'Nos formations',
  sousTitre:
    'Parcours diplômants et formations certifiantes : un catalogue unique par domaine, avec filtres par type et par référentiel.',
  video: '/assets/video/formation.mp4',
};

const COMBINED_CTA = {
  titre: "Besoin d'orientation ?",
  sousTitre:
    'Diplômants ou certifiants, nos conseillers vous aident à choisir votre parcours, les financements et les dates de session.',
  bouton: 'NOUS CONTACTER',
  lien: '/contact',
};

function BddStatus({ loading, error }) {
  if (loading) {
    return (
      <section className="bg-surface border-b border-gray-100">
        <div className="max-w-container-3xl mx-auto px-6 py-4 text-sm text-content-muted">
          Chargement des formations depuis la base de données...
        </div>
      </section>
    );
  }
  if (error) {
    return (
      <section className="bg-red-50 border-b border-red-100">
        <div className="max-w-container-3xl mx-auto px-6 py-4 text-sm font-semibold text-red-800">
          Erreur BDD : {error}
        </div>
      </section>
    );
  }
  return null;
}

export default function FormationsCatalogueHub() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const tab = normalizeCatalogType(searchParams.get('type'));
  const isElearning = tab === 'elearning';
  const { courses, loading, error } = usePublicFormations();

  const {
    sharedSearch,
    setSharedSearch,
    repertoireFilter,
    setRepertoireFilter,
    activeDomain,
    setActiveDomain,
    modaliteFilter,
    setModaliteFilter,
    formationVisibility,
    resetAdvancedFilters,
    clearAllFilters,
  } = useCatalogueFiltersSession({
    enabled: !isElearning,
    hash: location.hash,
    typeQuery: searchParams.get('type'),
    modaliteQuery: searchParams.get('modalite'),
    navigate,
  });

  const handleTypeFilter = useCallback(
    (mode) => {
      if (mode === 'all') navigate('/formations', { replace: true });
      else navigate(`/formations#${mode}`, { replace: true });
    },
    [navigate],
  );

  const handleDomainChange = useCallback(
    (domainId) => {
      setActiveDomain(domainId);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const id = domainId === 'all' ? 'catalogue' : domainId;
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
    },
    [setActiveDomain],
  );

  const elearningCatalogue = useMemo(
    () => buildCatalogueFromCourses(courses, { scope: 'elearning' }),
    [courses],
  );

  const mergedCatalogForView = useMemo(() => {
    let rows = buildCatalogueFromCourses(courses, { scope: 'combined' });

    if (formationVisibility !== 'all') {
      const badge = formationVisibility === 'diplomantes' ? 'Diplômante' : 'Certifiante';
      rows = rows
        .map((cat) => ({ ...cat, items: cat.items.filter((item) => item.typeBadge === badge) }))
        .filter((cat) => cat.items.length > 0);
    }

    if (repertoireFilter !== 'all') {
      rows = rows
        .map((cat) => ({ ...cat, items: cat.items.filter((item) => item.repertoireTitre === repertoireFilter) }))
        .filter((cat) => cat.items.length > 0);
    }

    if (modaliteFilter !== 'all') {
      rows = rows
        .map((cat) => ({ ...cat, items: cat.items.filter((item) => matchesModaliteFilter(item.modalites, modaliteFilter)) }))
        .filter((cat) => cat.items.length > 0);
    }

    return rows;
  }, [courses, formationVisibility, repertoireFilter, modaliteFilter]);

  const domainOptions = useMemo(
    () => [
      { id: 'all', label: 'Tous', hint: 'Tous les domaines' },
      ...mergedCatalogForView.map((cat) => ({
        id: `catalogue-${cat.id}`,
        label: cat.label,
        icon: categoryIcons[cat.id],
      })),
    ],
    [mergedCatalogForView],
  );

  const combinedAfterBreadcrumb = (
    <section className="bg-surface border-b border-gray-100">
      <div className="max-w-container-3xl mx-auto px-6 py-4">
        <p className="text-xs font-extrabold text-accent uppercase tracking-widest">Catalogue des formations</p>
        <p className="text-xs text-content-muted mt-2">
          E-Learning / formations courtes :{' '}
          <Link to="/formations?type=elearning" className="font-bold text-accent hover:underline">
            voir le catalogue à distance →
          </Link>
        </p>
      </div>
    </section>
  );

  const unifiedFilterBar = (
    <section className="py-5 bg-white/95 backdrop-blur-md border-b border-border sticky top-20 z-30 shadow-[0_4px_24px_-4px_rgba(0,40,69,0.08)]">
      <div className="max-w-container-3xl mx-auto px-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1 sm:max-w-md group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-content-muted group-focus-within:text-accent transition-colors" />
              </div>
              <input
                type="search"
                placeholder="Rechercher une formation..."
                className="block w-full pl-10 pr-10 py-2.5 border border-border rounded-lg bg-surface-soft focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all text-sm text-primary font-body outline-none placeholder:text-content-muted"
                value={sharedSearch}
                onChange={(e) => setSharedSearch(e.target.value)}
                aria-label="Rechercher parmi les formations diplômantes et certifiantes"
              />
            </div>

            <CataloguePlusFiltres
              repertoireFilter={repertoireFilter}
              onRepertoireChange={setRepertoireFilter}
              repertoireOptions={REPERTOIRE_TITRE_FILTERS}
              modaliteFilter={modaliteFilter}
              onModaliteChange={setModaliteFilter}
              modaliteOptions={MODALITE_FILTERS}
              activeDomain={activeDomain}
              onDomainChange={handleDomainChange}
              domainOptions={domainOptions}
              onReset={resetAdvancedFilters}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="shrink-0 text-xs font-semibold text-content-muted uppercase tracking-widest">
              Type de formation :
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {FORMATION_TYPE_FILTERS.map((f) => {
                const active = formationVisibility === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleTypeFilter(f.id)}
                    title={f.hint}
                    className={`shrink-0 inline-flex flex-col items-start px-4 py-2 rounded-xl text-left border transition-all ${
                      active
                        ? 'border-accent bg-accent/10 ring-2 ring-accent/20 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-accent/50 hover:bg-orange-50/40'
                    }`}
                  >
                    <span className={`font-heading font-extrabold text-sm tracking-wide ${active ? 'text-accent' : 'text-primary'}`}>
                      {f.label}
                    </span>
                    <span className="text-[11px] text-content-muted leading-snug mt-0.5">{f.hint}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  if (isElearning) {
    return (
      <CatalogueFormationsPage
        key="elearning"
        hero={heroElearning}
        breadcrumb="E-Learning"
        catalogue={elearningCatalogue}
        categoryIcons={categoryIcons}
        cta={{
          titre: 'Une formation sur mesure ?',
          sousTitre: 'Nos conseillers peuvent adapter le contenu et le planning de toute formation courte à votre équipe ou vos besoins spécifiques.',
          bouton: 'NOUS CONTACTER',
          lien: '/contact',
        }}
        crossLinks={[]}
        afterBreadcrumbSlot={(
          <>
            <section className="bg-surface border-b border-gray-100">
              <div className="max-w-container-3xl mx-auto px-6 py-4">
                <Link to="/formations" className="text-sm font-bold text-accent hover:underline no-underline inline-flex items-center gap-1">
                  ← Formations diplômantes et certifiantes
                </Link>
              </div>
            </section>
            <BddStatus loading={loading} error={error} />
          </>
        )}
        cardTypeBadge="E-Learning"
      />
    );
  }

  return (
    <div className="bg-surface min-h-screen antialiased">
      <Hero title={COMBINED_HERO.titre} subtitle={COMBINED_HERO.sousTitre} video={COMBINED_HERO.video} />
      <Breadcrumb items={[{ label: 'Accueil', to: '/accueil' }, { label: 'Formations' }]} />
      {combinedAfterBreadcrumb}
      <BddStatus loading={loading} error={error} />
      {unifiedFilterBar}

      <CatalogueFormationsBlock
        key={`${formationVisibility}-${repertoireFilter}-${modaliteFilter}`}
        idPrefix="catalogue"
        catalogue={mergedCatalogForView}
        categoryIcons={categoryIcons}
        legacyDiplCertHashes
        sharedSearchTerm={sharedSearch}
        setSharedSearchTerm={setSharedSearch}
        activeCategory={activeDomain}
        onActiveCategoryChange={handleDomainChange}
        hideDomainFilter
        onResetAllFilters={clearAllFilters}
      />

      <CallToAction
        variante="sombre"
        titre={COMBINED_CTA.titre}
        sousTitre={COMBINED_CTA.sousTitre}
        texteBouton={COMBINED_CTA.bouton}
        lienBouton={COMBINED_CTA.lien}
      />
    </div>
  );
}
