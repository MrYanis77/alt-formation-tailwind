/**
 * Hub catalogue formations : page unique /formations — catalogue diplômantes + certifiantes
 * fusionné par domaine (ancre de section #catalogue, domaines #catalogue-<id> ;
 * anciens liens #diplomantes-* / #certifiantes-* toujours pris en charge).
 * E-Learning via ?type=elearning. Redirections : App.jsx (RedirectFormationCatalogTab).
 */
import { useMemo, useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import Hero from '../components/Hero/Hero';
import Breadcrumb from '../components/Breadcrumb';
import CallToAction from '../components/CallToAction';
import CatalogueFormationsPage from '../components/CatalogueFormationsPage';
import CatalogueFormationsBlock from '../components/CatalogueFormationsBlock';
import {
  catalogueCourtes,
  catalogueDiplomesCertifiantsFusionne,
  hero,
} from '../data/formations';
import { hero as heroElearning } from '../data/elearning';
import { normalizeCatalogType } from '../data/formationsCatalogTypes';
import {
  HardDrive,
  Code,
  Brain,
  Users,
  Calculator,
  Container,
  Cpu,
  Shield,
  Monitor,
  Search,
} from 'lucide-react';

const categoryIconsDiplomantes = {
  'cybersecurite-reseaux': <HardDrive className="w-6 h-6" />,
  'digital-developpement': <Code className="w-6 h-6" />,
  'ia-data': <Brain className="w-6 h-6" />,
  'ressources-humaines': <Users className="w-6 h-6" />,
  'comptabilite-gestion': <Calculator className="w-6 h-6" />,
  'devops-devsecops': <Container className="w-6 h-6" />,
  'systemes-embarques-iot': <Cpu className="w-6 h-6" />,
};

const categoryIconsCertifiantes = {
  devops: <Container className="w-6 h-6" />,
  devsecops: <Container className="w-6 h-6" />,
  'digital-developpement': <Code className="w-6 h-6" />,
  'cybersecurite-reseaux': <Shield className="w-6 h-6" />,
};

const categoryIconsElearning = {
  cybersecurite: <Shield className="w-6 h-6" />,
  'digital-developpement': <Code className="w-6 h-6" />,
  management: <Users className="w-6 h-6" />,
  'devops-devsecops': <Container className="w-6 h-6" />,
  'informatique-systemes-reseaux': <Monitor className="w-6 h-6" />,
  'systemes-embarques-iot': <Cpu className="w-6 h-6" />,
};

/** Filtre « type » (partagé) dérivé du hash / param d’URL. */
function getFormationTypeVisibility(hash, typeQuery) {
  const h = (hash || '').replace(/^#/, '');
  if (typeQuery === 'certifiantes') return 'certifiantes';
  if (!h) return 'all';
  if (h === 'diplomantes' || h.startsWith('diplomantes-')) return 'diplomantes';
  if (h === 'certifiantes' || h.startsWith('certifiantes-')) return 'certifiantes';
  return 'all';
}

const FORMATION_TYPE_FILTERS = [
  { id: 'all', label: 'Toutes', hint: 'Diplômantes et certifiantes' },
  { id: 'diplomantes', label: 'Diplômantes', hint: 'Titres RNCP' },
  { id: 'certifiantes', label: 'Certifiantes', hint: 'Sessions certifiantes' },
];

const COMBINED_HERO = {
  titre: hero.titre,
  sousTitre:
    'Parcours diplômants (titres RNCP) et formations certifiantes : un catalogue unique par domaine, filtres par type ci-dessous.',
  video: hero.video,
};

const COMBINED_CTA = {
  titre: "Besoin d'orientation ?",
  sousTitre:
    'Diplômants ou certifiants, nos conseillers vous aident à choisir votre parcours, les financements et les dates de session.',
  bouton: 'NOUS CONTACTER',
  lien: '/contact',
};

export default function FormationsCatalogueHub() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const tab = normalizeCatalogType(searchParams.get('type'));
  const isElearning = tab === 'elearning';

  const [sharedSearch, setSharedSearch] = useState('');
  const formationVisibility = getFormationTypeVisibility(location.hash, searchParams.get('type'));

  const handleTypeFilter = useCallback(
    (mode) => {
      if (mode === 'all') navigate('/formations', { replace: true });
      else navigate(`/formations#${mode}`, { replace: true });
    },
    [navigate]
  );

  /** Ancienne URL ?type=certifiantes : scroll vers le catalogue unifié. */
  useEffect(() => {
    if (isElearning) return;
    if (searchParams.get('type') !== 'certifiantes') return;
    const t = setTimeout(() => {
      document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    return () => clearTimeout(t);
  }, [isElearning, searchParams]);

  const elearningBundle = useMemo(
    () => ({
      hero: heroElearning,
      breadcrumb: 'E-Learning',
      catalogue: catalogueCourtes,
      categoryIcons: categoryIconsElearning,
      cardTypeBadge: 'E-Learning',
      cta: {
        titre: 'Une formation sur mesure ?',
        sousTitre:
          'Nos conseillers peuvent adapter le contenu et le planning de toute formation courte à votre équipe ou vos besoins spécifiques.',
        bouton: 'NOUS CONTACTER',
        lien: '/contact',
      },
    }),
    []
  );

  const elearningAfterBreadcrumb = (
    <section className="bg-surface border-b border-gray-100">
      <div className="max-w-container-3xl mx-auto px-6 py-4">
        <Link
          to="/formations"
          className="text-sm font-bold text-accent hover:underline no-underline inline-flex items-center gap-1"
        >
          ← Formations diplômantes et certifiantes
        </Link>
      </div>
    </section>
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

  const categoryIconsFusion = { ...categoryIconsDiplomantes, ...categoryIconsCertifiantes };

  const mergedCatalogForView = useMemo(() => {
    const base = catalogueDiplomesCertifiantsFusionne;
    if (formationVisibility === 'all') return base;
    const badge = formationVisibility === 'diplomantes' ? 'Diplômante' : 'Certifiante';
    return base
      .map((cat) => ({
        ...cat,
        items: cat.items.filter((item) => item.typeBadge === badge),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [formationVisibility]);

  const unifiedFilterBar = (
    <section className="py-5 bg-white/95 backdrop-blur-md border-b border-border sticky top-20 z-30 shadow-[0_4px_24px_-4px_rgba(0,40,69,0.08)]">
      <div className="max-w-container-3xl mx-auto px-6">
        <div className="flex flex-col gap-4">
          <div className="relative flex-1 sm:max-w-md group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-content-muted group-focus-within:text-accent transition-colors" />
            </div>
            <input
              type="search"
              placeholder="Rechercher une formation…"
              className="block w-full pl-10 pr-10 py-2.5 border border-border rounded-lg bg-surface-soft focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all text-sm text-primary font-body outline-none placeholder:text-content-muted"
              value={sharedSearch}
              onChange={(e) => setSharedSearch(e.target.value)}
              aria-label="Rechercher parmi les formations diplômantes et certifiantes"
            />
            {sharedSearch ? (
              <button
                type="button"
                onClick={() => setSharedSearch('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-content-muted hover:text-primary transition-colors"
                aria-label="Effacer la recherche"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            ) : null}
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
                    <span
                      className={`font-heading font-extrabold text-sm tracking-wide ${
                        active ? 'text-accent' : 'text-primary'
                      }`}
                    >
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
        hero={elearningBundle.hero}
        breadcrumb={elearningBundle.breadcrumb}
        catalogue={elearningBundle.catalogue}
        categoryIcons={elearningBundle.categoryIcons}
        cta={elearningBundle.cta}
        crossLinks={[]}
        afterBreadcrumbSlot={elearningAfterBreadcrumb}
        cardTypeBadge={elearningBundle.cardTypeBadge}
      />
    );
  }

  return (
    <div className="bg-surface min-h-screen antialiased">
      <Hero
        title={COMBINED_HERO.titre}
        subtitle={COMBINED_HERO.sousTitre}
        video={COMBINED_HERO.video}
      />

      <Breadcrumb items={[{ label: 'Accueil', to: '/accueil' }, { label: 'Formations' }]} />

      {combinedAfterBreadcrumb}
      {unifiedFilterBar}

      <CatalogueFormationsBlock
        key={formationVisibility}
        idPrefix="catalogue"
        catalogue={mergedCatalogForView}
        categoryIcons={categoryIconsFusion}
        legacyDiplCertHashes={true}
        sharedSearchTerm={sharedSearch}
        setSharedSearchTerm={setSharedSearch}
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
