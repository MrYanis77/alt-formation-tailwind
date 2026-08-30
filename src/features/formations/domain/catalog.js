import { inferFormationModalites } from '../utils/formationModalites';

/** Règles métier permettant de construire catalogue, filtres et navigation. */

// Valeur par défaut centralisée pour les visuels de formation absents.
export const FALLBACK_FORMATION_IMAGE = '/assets/images/fallback.webp';

// Métadonnées éditoriales indépendantes des lignes de formation stockées en BDD.
export const CATEGORY_META = {
  'cybersecurite-reseaux': {
    label: 'Cybersécurité, Réseaux & Infrastructure',
    description: 'Cybersécurité, réseaux, cloud et infrastructure.',
    image: '/assets/images/expert_cyber.jpg',
    sort: 10,
  },
  'digital-ia-devops': {
    label: 'IA, Data, Web, DevOps',
    description: 'Développement web, logiciel, IA, data et pratiques DevOps.',
    image: '/assets/images/concepteur_web.jpg',
    sort: 20,
  },
  'digital-developpement': {
    label: 'Développement & Big Data',
    description: 'Développement web, applicatif, logiciel et data.',
    image: '/assets/images/concepteur_web.jpg',
    sort: 30,
  },
  'ia-data': {
    label: 'IA, Data & Programmation',
    description: 'Intelligence artificielle, data et programmation.',
    image: '/assets/images/analyste_data.jpg',
    sort: 40,
  },
  'ressources-humaines': {
    label: 'RH & Comptabilité / Gestion',
    description: 'RH, administration, comptabilité, gestion et commerce.',
    image: '/assets/images/responsable_rh.jpg',
    sort: 50,
  },
  'comptabilite-gestion': {
    label: 'Comptabilité & Gestion',
    description: 'Comptabilité, gestion, commerce, immobilier et management.',
    image: '/assets/images/comptable_1.jpg',
    sort: 60,
  },
  cybersecurite: {
    label: 'Cybersécurité',
    description: 'Pentest, audit, sécurité cloud et cyberdéfense.',
    image: '/assets/images/pentester.jpg',
    sort: 70,
  },
  management: {
    label: 'Management',
    description: 'Management, projet, agilité et RSE.',
    image: '/assets/images/entreprise.jpg',
    sort: 80,
  },
  'devops-devsecops': {
    label: 'DevOps / DevSecOps',
    description: 'Conteneurs, automatisation, CI/CD et sécurité DevOps.',
    image: '/assets/images/devops.jpg',
    sort: 90,
  },
  devops: {
    label: 'DevOps',
    description: 'Méthodes et outillage DevOps.',
    image: '/assets/images/devops.jpg',
    sort: 100,
  },
  devsecops: {
    label: 'DevSecOps',
    description: 'Sécurité intégrée aux cycles DevOps.',
    image: '/assets/images/Datacenter.jpg',
    sort: 110,
  },
  'informatique-systemes-reseaux': {
    label: 'Informatique & Systèmes',
    description: 'Administration Windows Server, systèmes et réseaux.',
    image: '/assets/images/admin_system.jpg',
    sort: 120,
  },
  'systemes-embarques-iot': {
    label: 'Systèmes Embarqués & IoT',
    description: 'Android embarqué, Linux embarqué et objets connectés.',
    image: '/assets/images/concepteur_app.jpg',
    sort: 130,
  },
  bureautique: {
    label: 'Bureautique',
    description: 'Excel, Word, PowerPoint et certifications TOSA.',
    image: '/assets/images/comptable_1.jpg',
    sort: 140,
  },
  autre: {
    label: 'Autres formations',
    description: '',
    image: FALLBACK_FORMATION_IMAGE,
    sort: 999,
  },
};

// Compatibilité des formations historiques qui ne possèdent pas encore de catégorie en BDD.
const SLUG_CATEGORY_MAP = {
  'formations-administrateur-dinfrastructures-securisees-ais': 'cybersecurite-reseaux',
  'formations-technicien-superieur-systemes-et-reseaux': 'cybersecurite-reseaux',
  'administrateur-reseaux-netops': 'cybersecurite-reseaux',
  'administrateursysteme-devops': 'digital-developpement',
  'technicien-reseaux-cybersecurite': 'cybersecurite-reseaux',
  'formations-developpeur-web-mobile': 'digital-developpement',
  'formations-developpeur-dapplications-multimedia': 'digital-developpement',
  'formations-concepteur-developpeur-dapplications': 'digital-developpement',
  'formations-concepteur-designer-ui': 'digital-developpement',
  'formations-graphiste': 'digital-developpement',
  'formations-monteur-audiovisuel-analyse-sportive': 'digital-developpement',
  'formations-lead-developpeur-web': 'digital-developpement',
  'executive-mastere-ingenierie-logiciel': 'digital-developpement',
  'creer-site-internet-html-css-wordpress': 'digital-developpement',
  'formations-assistante-ressources-humaines': 'ressources-humaines',
  'formations-conseiller-insertion-professionnelle': 'ressources-humaines',
  'formations-assistante-de-direction': 'ressources-humaines',
  'formations-assistante-administratifve': 'ressources-humaines',
  'formations-charge-accueil-et-gestion-administrative': 'ressources-humaines',
  'formations-secretaire-assistant-medico-administratif': 'ressources-humaines',
  'formations-assistante-commerciale': 'ressources-humaines',
  'formations-conseillerere-relation-client-a-distance': 'ressources-humaines',
  'formations-community-manager': 'comptabilite-gestion',
  'formations-secretaire-comptable': 'comptabilite-gestion',
  'gestionnaire-comptable-fiscal': 'comptabilite-gestion',
  'formations-comptable-assistant': 'comptabilite-gestion',
  'formations-responsable-etablissement-marchand': 'comptabilite-gestion',
  'formations-responsable-petite-moyenne-structure': 'comptabilite-gestion',
  'formations-responsable-developpement-des-activites': 'comptabilite-gestion',
  'formations-gestionnaire-de-paie': 'comptabilite-gestion',
  'formations-assistant-immobilier': 'comptabilite-gestion',
  'formations-assistant-import-export': 'comptabilite-gestion',
  'formations-conseiller-de-vente': 'comptabilite-gestion',
  'formations-employe-commercial': 'comptabilite-gestion',
};

/** Ramène toutes les variantes techniques aux trois types compris par l'interface. */
export function normalizeCourseType(raw) {
  const value = String(raw || '').toLowerCase();
  if (value === 'certifiante') return 'certifiante';
  if (value === 'elearning' || value === 'courte') return 'elearning';
  return 'diplomante';
}

/** Produit le libellé court visible sur les cartes de formation. */
export function courseTypeBadge(courseType) {
  const type = normalizeCourseType(courseType);
  if (type === 'certifiante') return 'Certifiante';
  if (type === 'elearning') return 'E-Learning';
  return 'Diplômante';
}

/** Résout uniquement les anciennes associations slug → catégorie. */
export function getFormationCatalogCategory(slug) {
  return SLUG_CATEGORY_MAP[slug] || null;
}

/** Applique les sources de catégorie par ordre de fiabilité, puis le groupe `autre`. */
export function getCourseCategorySlug(course) {
  return course.categorySlug || course.category_slug || getFormationCatalogCategory(course.slug) || 'autre';
}

// Le catalogue principal fusionne certaines catégories fines pour rester lisible.
function normalizeCombinedCategory(slug) {
  if (['digital-developpement', 'ia-data', 'devops'].includes(slug)) return 'digital-ia-devops';
  if (['ressources-humaines', 'comptabilite-gestion'].includes(slug)) return 'ressources-humaines';
  return slug;
}

/** Choisit l'image la plus spécifique disponible avant le visuel de repli global. */
export function getCourseImage(course) {
  return course.presentation_image_url || course.imageUrl || course.image || CATEGORY_META[getCourseCategorySlug(course)]?.image || FALLBACK_FORMATION_IMAGE;
}

/** Déduit les modalités ; une formation e-learning reste toujours distancielle. */
export function getCourseModalites(course) {
  const type = normalizeCourseType(course.courseType || course.course_type);
  if (type === 'elearning') return ['distanciel'];
  return inferFormationModalites({
    stats: [{ label: 'Modalité', value: course.modality_label || course.modality || '' }],
    hero: { sousTitre: course.subtitle || '' },
    presentation: { paragraphes: course.presentation_text || '' },
  });
}

/** Distingue le Répertoire spécifique (RS) du Répertoire national (RNCP). */
export function getCourseRepertoire(course) {
  if (course.rncp_repertoire) return course.rncp_repertoire;
  const code = String(course.rncp_code || course.codeTitre || '').toUpperCase();
  if (code.startsWith('RS')) return 'RS';
  if (code) return 'RNCP';
  return null;
}

// Normalise une ligne une seule fois avant le regroupement et le tri.
function mapCatalogueItem(course) {
  const type = normalizeCourseType(course.courseType || course.course_type);
  return {
    ...course,
    titre: course.titre || course.title,
    title: course.title || course.titre,
    imageUrl: getCourseImage(course),
    href: course.href || `/formation/${course.slug}`,
    typeBadge: courseTypeBadge(type),
    courseType: type,
    repertoireTitre: getCourseRepertoire(course),
    codeTitre: course.rncp_code || course.codeTitre || null,
    modalites: getCourseModalites(course),
  };
}

/**
 * Construit des groupes prêts à afficher selon le périmètre demandé.
 * Le tri métier combine ordre éditorial, identifiant puis titre alphabétique.
 */
export function buildCatalogueFromCourses(courses, { scope = 'combined' } = {}) {
  const groups = new Map();

  courses
    .map(mapCatalogueItem)
    .filter((course) => {
      // Les scopes correspondent directement aux onglets du catalogue public.
      if (scope === 'elearning') return course.courseType === 'elearning';
      if (scope === 'certifiantes') return course.courseType === 'certifiante';
      if (scope === 'diplomantes') return course.courseType === 'diplomante';
      return course.courseType !== 'elearning';
    })
    .forEach((course) => {
      const rawCategory = getCourseCategorySlug(course);
      const id = scope === 'combined' ? normalizeCombinedCategory(rawCategory) : rawCategory;
      const meta = CATEGORY_META[id] || CATEGORY_META[rawCategory] || CATEGORY_META.autre;
      if (!groups.has(id)) {
        // La catégorie est créée au premier élément afin de ne jamais afficher un groupe vide.
        groups.set(id, {
          id,
          label: meta.label,
          description: meta.description,
          image: meta.image,
          sort: meta.sort,
          items: [],
        });
      }
      groups.get(id).items.push(course);
    });

  return [...groups.values()]
    .map((group) => ({
      ...group,
      items: group.items.sort((a, b) => (a.sort_order ?? a.id ?? 0) - (b.sort_order ?? b.id ?? 0) || a.titre.localeCompare(b.titre)),
    }))
    .sort((a, b) => a.sort - b.sort || a.label.localeCompare(b.label));
}

// Adapte les groupes du catalogue au modèle hiérarchique attendu par la Navbar.
function catalogueRowsToMegaRows(catalogue, kindOverride = null) {
  return catalogue.map((cat) => {
    const types = new Set(cat.items.map((item) => item.courseType));
    const kind = kindOverride || (types.size > 1 ? 'merged' : types.has('certifiante') ? 'certifiantes' : 'diplomantes');
    return {
      id: cat.id,
      label: cat.label,
      href: kind === 'elearning' ? `/formations?type=elearning#${cat.id}` : `/formations#catalogue-${cat.id}`,
      image: cat.image || CATEGORY_META[cat.id]?.image || FALLBACK_FORMATION_IMAGE,
      kind,
      formations: cat.items.map((item) => ({
        label: item.titre,
        href: item.href,
        image: item.imageUrl,
        video: item.video_url || null,
      })),
    };
  });
}

/** Construit simultanément les branches formation classique et e-learning du méga-menu. */
export function buildNavMegaData(courses) {
  const combinedCatalogue = buildCatalogueFromCourses(courses, { scope: 'combined' });
  const elearningCatalogue = buildCatalogueFromCourses(courses, { scope: 'elearning' });
  return {
    megaMenuFormations: {
      elearning: catalogueRowsToMegaRows(elearningCatalogue, 'elearning'),
    },
    megaMenuCombinedDiplCertRows: catalogueRowsToMegaRows(combinedCatalogue),
  };
}

/** Assemble les données dynamiques de formation avec les liens statiques du site. */
export function buildNavlinksFromMegaData(megaData) {
  return [
    {
      label: 'Formations',
      href: '/formations',
      submenu: [
        {
          label: 'Diplômantes & certifiantes',
          href: '/formations',
          submenu: megaData.megaMenuCombinedDiplCertRows.map((row) => ({
            label: row.label,
            href: row.href,
            submenu: row.formations.map((formation) => ({ label: formation.label, href: formation.href })),
          })),
        },
        {
          label: 'E-Learning',
          href: '/formations?type=elearning',
          submenu: megaData.megaMenuFormations.elearning.flatMap((row) =>
            row.formations.map((formation) => ({ label: formation.label, href: formation.href })),
          ),
        },
      ],
    },
    { label: 'Certifications', href: '/certification' },
    { label: 'Financements', href: '/financements' },
    { label: 'Bilan de Compétences', href: '/bilan-de-competences' },
    {
      label: 'Ressources',
      submenu: [
        { label: 'IA & Ressources numériques', href: '/ressources-ia', image: '/assets/images/analyste_data.jpg', description: 'Fiches pratiques, outils IA et ressources pédagogiques gratuites.' },
        { label: 'Blog & actualités', href: '/blog', image: '/assets/images/blog.jpg', description: 'Articles, conseils et tendances sur la formation et le digital.' },
        { label: 'Gestion de Carrières', href: '/carrieres', image: '/assets/images/emploi.jpg', description: 'Gestion de carrière, coaching emploi et accompagnement professionnel.' },
      ],
    },
    { label: 'Nos Campus', href: '/campus' },
    { label: 'F.A.Q', href: '/faq' },
    { label: 'Contact', href: '/contact' },
    { label: 'Nous rejoindre', href: '/nous-rejoindre' },
  ];
}
