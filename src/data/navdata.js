import formationsData from './json/formation.json';

// Mapping local en sécurité au cas où le fichier JSON est écrasé sans les catégories
const categoryMap = {
  'formations-administrateur-dinfrastructures-securisees-ais': 'numerique',
  'formations-developpeur-web-mobile': 'numerique',
  'formations-developpeur-dapplications-multimedia': 'numerique',
  'formations-concepteur-developpeur-dapplications': 'numerique',
  'formations-technicien-superieur-systemes-et-reseaux': 'numerique',
  'formations-lead-developpeur-web': 'numerique',
  'formations-community-manager': 'rh',
  'formations-assistante-ressources-humaines': 'rh',
  'formations-assistante-administratifve': 'rh',
  'formations-assistante-commerciale': 'rh',
  'formations-secretaire-comptable': 'rh',
  'formations-conseillerere-relation-client-a-distance': 'rh',
  'administrateur-reseaux-netops': 'numerique',
  'administrateursysteme-devops': 'numerique',
  'technicien-reseaux-cybersecurite': 'numerique',
  'formation-intelligence-artificielle': 'numerique',
  'gestionnaire-comptable-fiscal': 'rh',
  'formations-comptable-assistant': 'rh'
};

// Conversion du JSON en tableau et ajout dynamique de la catégorie si manquante
// On fait également correspondre la structure du JSON (anglais) à celle des composants (français)
export const formationsArray = Object.entries(formationsData).map(([id, data]) => {

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
    ...data,
    stats: statsFormatted || data.stats,
    programme: programmeFormatted || data.programme
  };
});

// Filtrage pour récupérer chaque groupe et générer le sous-sous-menu
const getSubMenu = (categoryKey) => {
  return formationsArray
    .filter(f => f.categorie === categoryKey)
    .map(f => ({
      label: f.hero?.titre || f.titre || f.id,
      href: `/formation/${f.id}` // Le lien pointant vers /formation/:id
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
        label: "Présentiel",
        href: "/alternance",
      },
      {
        label: "E-learning",
        href: "/e-learning",
        submenu: [
          {
            label: "Formations Numériques",
            href: "/formations?categorie=numerique",
            submenu: getSubMenu('numerique')
          },
          {
            label: "Formations Gestion/RH",
            href: "/formations?categorie=rh",
            submenu: getSubMenu('rh')
          }
        ],
      },

    ],
  },


  { label: "Certifications", href: "/certification" },
  { label: "Financements", href: "/financements" },
  {
    label: "Carrières",
    submenu: [
      {
        label: "Gestion de carrières",
        href: "/gestion-carrieres",
      },
      {
        label: "Coaching emploi",
        href: "/coaching-emploi",
      },
    ],
  },
  {
    label: "Ressources",
    submenu: [

      {
        label: "Fiches métier",
        href: "/ressources-ia",
      },
      {
        label: "IA",
        href: "/ressources-ia",
      },
      {
        label: "Cybersécurité",
        href: "/cybersécurité",
      },

    ],
  },
  // {
  //   label: "Entreprises",
  //   href: "/entreprise",
  //   submenu: [
  //     {
  //       label: "Solutions recrutement",
  //       href: "/bilans-carriere",
  //     },
  //     {
  //       label: "Formation collaborateurs",
  //       href: "/coaching-emploi",
  //     },
  //   ],
  // },
  { label: "Nous rejoindre", href: "/nous-rejoindre" },
  { label: "Nos Campus", href: "/campus" },
  { label: "Contact", href: "/contact" },
  { label: "F.A.Q", href: "/faq" },


];