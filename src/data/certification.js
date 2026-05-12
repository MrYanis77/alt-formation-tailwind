export const hero = {
  titre: "Certifications",
  sousTitre: "Plusieurs solutions de financement pour rendre votre formation accessible",
  video: "/assets/video/certification.mp4",
};

// Liste des catégories pour le filtre
export const categories = [
  "Tous",
  "Digital & Web",
  "Systèmes & Réseaux",
  "RH & Gestion",
  "Relation Client"
];

export const certifications = [
  {
    id: 1,
    nom: "Développeur Web et Web Mobile",
    rncp: "37674",
    niveau: "5",
    category: "Digital & Web",
    href: "/formation/formations-developpeur-web-mobile",
    lienFranceCompetence: "https://www.francecompetences.fr/recherche/rncp/37674/",
    imageUrl: "/assets/images/concepteur_web.jpg"
  },
  {
    id: 2,
    nom: "Concepteur Développeur d'Applications",
    rncp: "37625",
    niveau: "6",
    category: "Digital & Web",
    href: "/formation/formations-concepteur-developpeur-dapplications",
    lienFranceCompetence: "https://www.francecompetences.fr/recherche/rncp/37625/",
    imageUrl: "/assets/images/concepteur_app.jpg"
  },
  {
    id: 3,
    nom: "Technicien Supérieur Systèmes et Réseaux",
    rncp: "37682",
    niveau: "5",
    category: "Systèmes & Réseaux",
    href: "/formation/formations-technicien-superieur-systemes-et-reseaux",
    lienFranceCompetence: "https://www.francecompetences.fr/recherche/rncp/37682/",
    imageUrl: "/assets/images/Terchnicien_reseau.jpg"
  },
  {
    id: 4,
    nom: "Community Manager",
    rncp: "37682", // Note: vérifiez si le code RNCP est identique au id:3 par erreur dans vos data
    niveau: "6",
    category: "Digital & Web",
    href: "/formation/formations-community-manager",
    lienFranceCompetence: "https://www.francecompetences.fr/recherche/rncp/37682/",
    imageUrl: "/assets/images/designer_app_mobile.jpg"
  },
  {
    id: 5,
    nom: "Assistant Ressources Humaines",
    rncp: "36612",
    niveau: "5",
    category: "RH & Gestion",
    href: "/formation/formations-assistante-ressources-humaines",
    lienFranceCompetence: "https://www.francecompetences.fr/recherche/rncp/36612/",
    imageUrl: "/assets/images/responsable_rh.jpg"
  },
  {
    id: 6,
    nom: "Gestionnaire de Paie",
    rncp: "37948",
    niveau: "5",
    category: "RH & Gestion",
    href: "/formation/gestionnaire-comptable-fiscal",
    lienFranceCompetence: "https://www.francecompetences.fr/recherche/rncp/37948/",
    imageUrl: "/assets/images/comptable_1.jpg"
  },
  {
    id: 7,
    nom: "Secrétaire Comptable",
    rncp: "36434",
    niveau: "4",
    category: "RH & Gestion",
    href: "/formation/formations-secretaire-comptable",
    lienFranceCompetence: "https://www.francecompetences.fr/recherche/rncp/36434/",
    imageUrl: "/assets/images/secretaire_1.jpg"
  },
  {
    id: 9,
    nom: "Conseiller Relation Client à Distance",
    rncp: "35304",
    niveau: "4",
    category: "Relation Client",
    href: "/formation/formations-conseillerere-relation-client-a-distance",
    lienFranceCompetence: "https://www.francecompetences.fr/recherche/rncp/35304/",
    imageUrl: "/assets/images/secretaire_2.jpg"
  },
  {
    id: 10,
    nom: "Administrateur Système DevOps",
    rncp: "36061",
    niveau: "6",
    category: "Systèmes & Réseaux",
    href: "/formation/administrateursysteme-devops",
    lienFranceCompetence: "https://www.francecompetences.fr/recherche/rncp/36061/",
    imageUrl: "/assets/images/devops.jpg"
  }
];

