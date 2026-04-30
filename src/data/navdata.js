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
  'administrateursysteme-devops': 'cybersecurite-reseaux',
  'technicien-reseaux-cybersecurite': 'cybersecurite-reseaux',
  'formation-initiation-cybersecurite': 'cybersecurite-reseaux',
  'formation-implementer-politique-cybersecurite': 'cybersecurite-reseaux',
  'formation-cisco-configuration-administration': 'cybersecurite-reseaux',

  // Développement
  'formations-developpeur-web-mobile': 'digital-developpement',
  'formations-developpeur-dapplications-multimedia': 'digital-developpement',
  'formations-concepteur-developpeur-dapplications': 'digital-developpement',
  'formations-concepteur-designer-ui': 'digital-developpement',
  'formations-lead-developpeur-web': 'digital-developpement',
  'formation-responsive-web-design': 'digital-developpement',
  'formation-php': 'digital-developpement',
  'executive-mastere-ingenierie-logiciel': 'digital-developpement',

  // IA
  'formation-intelligence-artificielle': 'ia-data',
  'formation-python-tosa': 'ia-data',

  // RH
  'formations-assistante-ressources-humaines': 'ressources-humaines',
  'formations-assistante-de-direction': 'ressources-humaines',
  'formations-assistante-administratifve': 'ressources-humaines',
  'formations-assistante-commerciale': 'ressources-humaines',
  'formations-conseillerere-relation-client-a-distance': 'ressources-humaines',

  // Compta & Gestion
  'formations-community-manager': 'comptabilite-gestion',
  'formations-secretaire-comptable': 'comptabilite-gestion',
  'gestionnaire-comptable-fiscal': 'comptabilite-gestion',
  'formations-comptable-assistant': 'comptabilite-gestion'
};

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

// Filtrage pour récupérer chaque groupe et générer le sous-sous-menu
const getSubMenu = (categoryKey) => {
  return formationsArray
    .filter(f => f.categorie === categoryKey)
    .map(f => ({
      label: f.hero?.titre || f.titre || f.id,
      href: `/formation/${f.id}`
    }));
};

// Sous-menu des formations courtes (E-Learning)
const getFormationsCortesSubMenu = () => {
  return formationsCortesArray.map(f => ({
    label: f.hero?.titre || f.titre || f.id,
    href: `/formation/${f.id}`
  }));
};

/**
 * navlinks — Structure de la navigation principale
 */
export const navlinks = [
  {
    label: "Formations",
    href: "/formations",
    submenu: [
      {
        label: "Formations Diplômantes",
        href: "/formations",
        submenu: [
          {
            label: "Cybersécurité",
            href: "/formations#cybersecurite-reseaux",
            submenu: getSubMenu('cybersecurite-reseaux')
          },
          {
            label: "Développement Web",
            href: "/formations#digital-developpement",
            submenu: getSubMenu('digital-developpement')
          },
          {
            label: "IA & Data",
            href: "/formations#ia-data",
            submenu: getSubMenu('ia-data')
          },
          {
            label: "Ressources Humaines",
            href: "/formations#ressources-humaines",
            submenu: getSubMenu('ressources-humaines')
          },
          {
            label: "Gestion & Compta",
            href: "/formations#comptabilite-gestion",
            submenu: getSubMenu('comptabilite-gestion')
          }
        ],
      },
      {
        label: "Formations Certifiantes",
        href: "/formations-certifiantes",
        submenu: formationsCertifiantesArray.map(f => ({
          label: f.hero?.titre || f.titre || f.id,
          href: `/formation/${f.id}`
        })),
      },
      {
        label: "E-Learning",
        href: "/formations-courtes",
        submenu: getFormationsCortesSubMenu(),
      },
    ],
  },
  { label: "Certifications", href: "/certification" },
  { label: "Financements", href: "/financements" },
  { label: "F.A.Q", href: "/faq" },
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
        label: "Gestion de Carrières",
        href: "/carrieres",
        image: "/assets/images/emploi.jpg",
        description: "Gestion de carrière, coaching emploi et accompagnement professionnel.",
      },
    ],
  },
  { label: "Nos Campus", href: "/campus" },
  { label: "Contact", href: "/contact" },
  { label: "Nous rejoindre", href: "/nous-rejoindre" },
];

// ── Mega Menu Formations ───────────────────────────────────────────────────────
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400';

const categoryImages = {
  'cybersecurite-reseaux':         '/assets/images/expert_cyber.jpg',
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
};

const cortesLabels = {
  'cybersecurite':                 'Cybersécurité',
  'digital-developpement':         'Développement & Big Data',
  'management':                    'Management',
  'devops-devsecops':              'DevOps / DevSecOps',
  'devops':                        'DevOps',
  'devsecops':                     'DevSecOps',
  'informatique-systemes-reseaux': 'Informatique & Systèmes',
  'systemes-embarques-iot':        'Systèmes Embarqués & IOT',
};

const buildMegaCategory = (categoryKey, label, href) => ({
  id: categoryKey,
  label,
  href,
  image: categoryImages[categoryKey] || FALLBACK_IMG,
  formations: formationsArray
    .filter(f => f.categorie === categoryKey)
    .map(f => ({
      label: f.hero?.titre || f.titre || f.id,
      href:  `/formation/${f.id}`,
      image: imageMap[f.id] || categoryImages[categoryKey] || FALLBACK_IMG,
      video: f.hero?.video || null,
    })),
});

const buildElearningCategories = () => {
  const grouped = {};
  formationsCortesArray.forEach(f => {
    const cat = f.categorie || 'autre';
    if (!grouped[cat]) {
      grouped[cat] = {
        id:         cat,
        label:      cortesLabels[cat] || cat,
        href:       `/formations-courtes#${cat}`,
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

const buildCertifiantesCategories = () => {
  const grouped = {};
  formationsCertifiantesArray.forEach(f => {
    const cat = f.categorie || 'autre';
    if (!grouped[cat]) {
      grouped[cat] = {
        id:         cat,
        label:      cortesLabels[cat] || cat,
        href:       `/formations-certifiantes#${cat}`,
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

export const megaMenuFormations = {
  diplomantes: [
    buildMegaCategory('cybersecurite-reseaux',  'Cybersécurité & Réseaux',  '/formations#cybersecurite-reseaux'),
    buildMegaCategory('digital-developpement',  'Développement Web',        '/formations#digital-developpement'),
    buildMegaCategory('ia-data',                'IA & Data',                '/formations#ia-data'),
    buildMegaCategory('ressources-humaines',    'Ressources Humaines',      '/formations#ressources-humaines'),
    buildMegaCategory('comptabilite-gestion',   'Comptabilité & Gestion',   '/formations#comptabilite-gestion'),
  ],
  certifiantes: buildCertifiantesCategories(),
  elearning: buildElearningCategories(),
};