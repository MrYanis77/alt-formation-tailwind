import formationsData from './json/formation.json';
import formationsCortesData from './json/formation-courtes.json';
import formationsCertifiantesData from './json/formations-certifiantes.json';
import { imageMap } from './formations';

// Mapping local en sécurité au cas où le fichier JSON est écrasé sans les catégories
const categoryMap = {
  // Cybersécurité
  'formations-administrateur-dinfrastructures-securisees-ais': 'cybersecurite-reseaux',
  'formations-technicien-superieur-systemes-et-reseaux': 'cybersecurite-reseaux',
  'administrateur-reseaux-netops': 'cybersecurite-reseaux',
  'administrateursysteme-devops': 'digital-developpement',
  'technicien-reseaux-cybersecurite': 'cybersecurite-reseaux',

  // Développement
  'formations-developpeur-web-mobile': 'digital-developpement',
  'formations-developpeur-dapplications-multimedia': 'digital-developpement',
  'formations-concepteur-developpeur-dapplications': 'digital-developpement',
  'formations-concepteur-designer-ui': 'digital-developpement',
  'formations-graphiste': 'digital-developpement',
  'formations-monteur-audiovisuel-analyse-sportive': 'digital-developpement',
  'formations-lead-developpeur-web': 'digital-developpement',
  'executive-mastere-ingenierie-logiciel': 'digital-developpement',
  'creer-site-internet-html-css-wordpress': 'digital-developpement',

  // RH
  'formations-assistante-ressources-humaines': 'ressources-humaines',
  'formations-conseiller-insertion-professionnelle': 'ressources-humaines',
  'formations-assistante-de-direction': 'ressources-humaines',
  'formations-assistante-administratifve': 'ressources-humaines',
  'formations-charge-accueil-et-gestion-administrative': 'ressources-humaines',
  'formations-secretaire-assistant-medico-administratif': 'ressources-humaines',
  'formations-assistante-commerciale': 'ressources-humaines',
  'formations-conseillerere-relation-client-a-distance': 'ressources-humaines',

  // Compta & Gestion
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
  'formations-employe-commercial': 'comptabilite-gestion'
};

/**
 * Identifiant de catégorie méga-menu / certifiante pour une fiche formation (diplômante ou certifiante).
 */
export function getFormationCatalogCategory(formationId) {
  const cert = formationsCertifiantesData[formationId];
  if (cert?.categorie) return cert.categorie;
  const long = formationsData[formationId];
  if (!long) return null;
  return long.categorie || categoryMap[formationId] || 'autre';
}

// Conversion du JSON en tableau et ajout dynamique de la catégorie si manquante
// On fait également correspondre la structure du JSON (anglais) à celle des composants (français)
const longFormationsArray = Object.entries(formationsData).map(([id, data]) => {

  // 1. Adapter stats (value -> valeur) et ajouter des icônes de fallback s'il n'y en a pas
  const statsFormatted = data.stats?.map((stat, idx) => ({
    label: stat.label,
    valeur: stat.valeur || stat.value,
    icon: stat.icon || (idx === 0 ? 'clock' : idx === 1 ? 'medal' : idx === 2 ? 'users' : 'trend')
  }));

  // 2. Adapter programme.modules (title -> titre, duration -> duree, id)
  let programmeFormatted = data.programme;
  if (programmeFormatted && programmeFormatted.modules) {
    programmeFormatted = {
      ...programmeFormatted,
      modules: programmeFormatted.modules.map(mod => ({
        id: mod.id,
        titre: mod.titre || mod.title,
        duree: mod.duree || mod.duration,
        description: mod.description
      }))
    };
  }

  return {
    id,
    categorie: data.categorie || categoryMap[id] || 'autre',
    type: 'longue',
    ...data,
    stats: statsFormatted || data.stats,
    programme: programmeFormatted || data.programme
  };
});

// Conversion du JSON des formations courtes en tableau
const formatEntry = (id, data) => {
  const statsFormatted = data.stats?.map((stat, idx) => ({
    label: stat.label,
    valeur: stat.valeur || stat.value,
    icon: stat.icon || (idx === 0 ? 'clock' : idx === 1 ? 'medal' : idx === 2 ? 'users' : 'trend')
  }));

  let programmeFormatted = data.programme;
  if (programmeFormatted && programmeFormatted.modules) {
    programmeFormatted = {
      ...programmeFormatted,
      modules: programmeFormatted.modules.map(mod => ({
        id: mod.id,
        titre: mod.titre || mod.title,
        duree: mod.duree || mod.duration,
        description: mod.description
      }))
    };
  }

  return {
    id,
    categorie: data.categorie || 'autre',
    type: data.type || 'longue',
    ...data,
    stats: statsFormatted || data.stats,
    programme: programmeFormatted || data.programme
  };
};

export const formationsCortesArray = Object.entries(formationsCortesData).map(([id, data]) =>
  formatEntry(id, data)
);

export const formationsCertifiantesArray = Object.entries(formationsCertifiantesData).map(([id, data]) =>
  formatEntry(id, data)
);

// Fusion de toutes les formations dans un tableau unique
export const formationsArray = [...longFormationsArray, ...formationsCortesArray, ...formationsCertifiantesArray];

// Filtrage pour récupérer chaque groupe et générer le sous-sous-menu (diplômantes = parcours longs uniquement)
const getSubMenu = (categoryKey) => {
  return formationsArray
    .filter(f => f.categorie === categoryKey && f.type === 'longue')
    .map(f => ({
      label: f.hero?.titre || f.titre || f.id,
      href: `/formation/${f.id}`
    }));
};

const getSubMenuMulti = (categoryKeys) => {
  return formationsArray
    .filter((f) => categoryKeys.includes(f.categorie) && f.type === 'longue')
    .map((f) => ({
      label: f.hero?.titre || f.titre || f.id,
      href: `/formation/${f.id}`,
    }));
};

// Sous-menu des formations courtes (E-Learning)
const getFormationsCortesSubMenu = () => {
  return formationsCortesArray.map(f => ({
    label: f.hero?.titre || f.titre || f.id,
    href: `/formation/${f.id}`
  }));
};

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400';

const categoryImages = {
  'cybersecurite-reseaux':         '/assets/images/expert_cyber.jpg',
  'digital-ia-devops':             '/assets/images/concepteur_web.jpg',
  'digital-developpement':         '/assets/images/concepteur_web.jpg',
  'ia-data':                       '/assets/images/analyste_data.jpg',
  'ressources-humaines':           '/assets/images/responsable_rh.jpg',
  'comptabilite-gestion':          '/assets/images/comptable_1.jpg',
  'cybersecurite':                 '/assets/images/pentester.jpg',
  'management':                    '/assets/images/entreprise.jpg',
  'devops-devsecops':              '/assets/images/Datacenter.jpg',
  'devops':                        '/assets/images/devops.jpg',
  'devsecops':                     '/assets/images/Datacenter.jpg',
  'informatique-systemes-reseaux': '/assets/images/Terchnicien_reseau.jpg',
  'systemes-embarques-iot':        '/assets/images/admin_system.jpg',
  'bureautique':                   '/assets/images/comptable_1.jpg',
};

const cortesLabels = {
  'cybersecurite':                 'Cybersécurité',
  'digital-ia-devops':             'IA, Data, Web, DevOps',
  'digital-developpement':         'Développement & Big Data',
  'management':                    'Management',
  'devops-devsecops':              'DevOps / DevSecOps',
  'devops':                        'DevOps',
  'devsecops':                     'DevSecOps',
  'informatique-systemes-reseaux': 'Informatique & Systèmes',
  'systemes-embarques-iot':        'Systèmes Embarqués & IOT',
  'cybersecurite-reseaux':         'Cybersécurité, Réseaux & Infrastructure',
  'bureautique':                   'Bureautique',
  'ia-data':                       'IA, Data & Programmation',
};

const buildMegaCategory = (categoryKey, label, href, { onlyLong = false } = {}) => ({
  id: categoryKey,
  label,
  href,
  image: categoryImages[categoryKey] || FALLBACK_IMG,
  formations: formationsArray
    .filter(f => f.categorie === categoryKey && (!onlyLong || f.type === 'longue'))
    .map(f => ({
      label: f.hero?.titre || f.titre || f.id,
      href:  `/formation/${f.id}`,
      image: imageMap[f.id] || categoryImages[categoryKey] || FALLBACK_IMG,
      video: f.hero?.video || null,
    })),
});

/** Plusieurs clés `categorie` — id de ligne = `rowId` si fourni, sinon la première clé. */
const buildMegaCategoryMulti = (categoryKeys, label, href, { onlyLong = false, rowId } = {}) => {
  const resolvedId = rowId || categoryKeys[0];
  return {
    id: resolvedId,
    label,
    href,
    image: categoryImages[resolvedId] || categoryImages[categoryKeys[0]] || FALLBACK_IMG,
    formations: formationsArray
      .filter((f) => categoryKeys.includes(f.categorie) && (!onlyLong || f.type === 'longue'))
      .map((f) => ({
        label: f.hero?.titre || f.titre || f.id,
        href: `/formation/${f.id}`,
        image: imageMap[f.id] || categoryImages[f.categorie] || categoryImages[resolvedId] || FALLBACK_IMG,
        video: f.hero?.video || null,
      })),
  };
};

const buildElearningCategories = () => {
  const grouped = {};
  formationsCortesArray.forEach(f => {
    const cat = f.categorie || 'autre';
    if (!grouped[cat]) {
      grouped[cat] = {
        id:         cat,
        label:      cortesLabels[cat] || cat,
        href:       `/formations?type=elearning#${cat}`,
        image:      categoryImages[cat] || FALLBACK_IMG,
        formations: [],
      };
    }
    grouped[cat].formations.push({
      label: f.hero?.titre || f.id,
      href:  `/formation/${f.id}`,
      image: imageMap[f.id] || categoryImages[f.categorie] || FALLBACK_IMG,
      video: f.hero?.video || null,
    });
  });
  return Object.values(grouped);
};

const buildCertifiantesCategoriesRaw = () => {
  const grouped = {};
  formationsCertifiantesArray.forEach((f) => {
    const cat = f.categorie || 'autre';
    if (!grouped[cat]) {
      grouped[cat] = {
        id: cat,
        label: cortesLabels[cat] || cat,
        href: `/formations#certifiantes-${cat}`,
        image: categoryImages[cat] || FALLBACK_IMG,
        formations: [],
      };
    }
    grouped[cat].formations.push({
      label: f.hero?.titre || f.id,
      href: `/formation/${f.id}`,
      image: imageMap[f.id] || categoryImages[f.categorie] || FALLBACK_IMG,
      video: f.hero?.video || null,
    });
  });
  return Object.values(grouped);
};

const buildCertifiantesCategories = () =>
  buildCertifiantesCategoriesRaw().filter(
    (g) => !['devops', 'digital-developpement', 'ia-data'].includes(g.id)
  );

const CERT_MERGE_KEYS = ['digital-developpement', 'ia-data', 'devops'];

const getCertifiantesNavSubmenu = () => {
  const grouped = {};
  formationsCertifiantesArray.forEach((f) => {
    const cat = f.categorie || 'autre';
    if (!grouped[cat]) {
      grouped[cat] = {
        label: cortesLabels[cat] || cat,
        href: `/formations#certifiantes-${cat}`,
        submenu: [],
      };
    }
    grouped[cat].submenu.push({
      label: f.hero?.titre || f.titre || f.id,
      href: `/formation/${f.id}`,
    });
  });

  const mergedSubs = CERT_MERGE_KEYS.flatMap((k) => grouped[k]?.submenu || []);

  const rest = Object.entries(grouped)
    .filter(([cat]) => !CERT_MERGE_KEYS.includes(cat))
    .map(([, v]) => v);

  if (mergedSubs.length === 0) return rest;

  const mergedEntry = {
    label: cortesLabels['digital-ia-devops'] || 'IA, Data, Web, DevOps',
    href: '/formations#certifiantes-digital-ia-devops',
    submenu: dedupeMegaFormations(mergedSubs),
  };

  return [mergedEntry, ...rest];
};

export const megaMenuFormations = {
  diplomantes: [
    buildMegaCategory('cybersecurite-reseaux',  'Cybersécurité, Réseaux & Infrastructure',  '/formations#diplomantes-cybersecurite-reseaux', { onlyLong: true }),
    buildMegaCategoryMulti(
      ['digital-developpement', 'ia-data'],
      'IA, Data, Web, DevOps',
      '/formations#diplomantes-digital-ia-devops',
      { onlyLong: true, rowId: 'digital-ia-devops' }
    ),
    buildMegaCategoryMulti(['ressources-humaines', 'comptabilite-gestion'], 'RH & Comptabilité / Gestion', '/formations#diplomantes-ressources-humaines', { onlyLong: true }),
  ],
  certifiantes: buildCertifiantesCategories(),
  elearning: buildElearningCategories(),
};

function dedupeMegaFormations(list) {
  const seen = new Set();
  return list.filter((f) => {
    if (seen.has(f.href)) return false;
    seen.add(f.href);
    return true;
  });
}

/** Lignes du méga-menu combiné : une seule entrée par id quand diplômantes et certifiantes partagent la même clé ; le domaine digital-ia-devops regroupe dev web, IA/data et DevOps côté certifiantes. */
export const megaMenuCombinedDiplCertRows = (() => {
  const diplomantes = megaMenuFormations.diplomantes;
  const certifiantes = buildCertifiantesCategoriesRaw();
  const certById = Object.fromEntries(certifiantes.map((c) => [c.id, c]));
  const mergedCertIds = new Set();

  const rows = [];
  for (const d of diplomantes) {
    const certBuckets = [];
    if (d.id === 'digital-ia-devops') {
      for (const cid of ['digital-developpement', 'ia-data', 'devops']) {
        const bucket = certById[cid];
        if (bucket) {
          mergedCertIds.add(cid);
          certBuckets.push(bucket);
        }
      }
    } else {
      const c = certById[d.id];
      if (c) {
        mergedCertIds.add(c.id);
        certBuckets.push(c);
      }
    }

    const extra = certBuckets.flatMap((c) => c.formations);
    const mergedFormations = dedupeMegaFormations([...d.formations, ...extra]);
    const kind = certBuckets.length ? 'merged' : 'diplomantes';

    rows.push({
      id: d.id,
      label: d.label,
      href: d.href,
      image: d.image,
      formations: mergedFormations,
      kind,
    });
  }
  for (const c of certifiantes) {
    if (mergedCertIds.has(c.id)) continue;
    rows.push({
      id: c.id,
      label: c.label,
      href: c.href,
      image: c.image,
      formations: c.formations,
      kind: "certifiantes",
    });
  }
  return rows;
})();

const DIPLOMANTES_NAV_SUBMENU = [
  {
    label: "Cybersécurité",
    href: "/formations#diplomantes-cybersecurite-reseaux",
    submenu: getSubMenu('cybersecurite-reseaux'),
  },
  {
    label: "IA, Data, Web, DevOps",
    href: "/formations#diplomantes-digital-ia-devops",
    submenu: getSubMenuMulti(['digital-developpement', 'ia-data']),
  },
  {
    label: "RH & Comptabilité / Gestion",
    href: "/formations#diplomantes-ressources-humaines",
    submenu: getSubMenuMulti(['ressources-humaines', 'comptabilite-gestion']),
  },
];

const COMBINED_FORMATIONS_SUBMENU = [
  {
    label: "Formations diplômantes",
    href: "/formations#diplomantes",
    submenu: DIPLOMANTES_NAV_SUBMENU,
  },
  {
    label: "Formations certifiantes",
    href: "/formations#certifiantes",
    submenu: getCertifiantesNavSubmenu(),
  },
];

/**
 * navlinks — Formations avec sous-menu Diplômantes & certifiantes / E-Learning.
 */
export const navlinks = [
  {
    label: "Formations",
    href: "/formations",
    submenu: [
      {
        label: "Diplômantes & certifiantes",
        href: "/formations",
        submenu: COMBINED_FORMATIONS_SUBMENU,
      },
      {
        label: "E-Learning",
        href: "/formations?type=elearning",
        submenu: getFormationsCortesSubMenu(),
      },
    ],
  },
  { label: "Certifications", href: "/certification" },
  { label: "Financements", href: "/financements" },
  { label: "Bilan de Compétences", href: "/bilan-de-competences" },
  {
    label: "Ressources",
    submenu: [
      {
        label: "IA & Ressources numériques",
        href: "/ressources-ia",
        image: "/assets/images/analyste_data.jpg",
        description: "Fiches pratiques, outils IA et ressources pédagogiques gratuites.",
      },
      {
        label: "Blog & actualités",
        href: "/blog",
        image: "/images/blog/financement-formation.jpg",
        description: "Articles, conseils et tendances sur la formation et le digital.",
      },
      {
        label: "Gestion de Carrières",
        href: "/carrieres",
        image: "/assets/images/emploi.jpg",
        description: "Gestion de carrière, coaching emploi et accompagnement professionnel.",
      },
    ],
  },
  { label: "Nos Campus", href: "/campus" },
  { label: "F.A.Q", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Nous rejoindre", href: "/nous-rejoindre" },
];
