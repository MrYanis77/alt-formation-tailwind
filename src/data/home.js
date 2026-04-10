/**
 * home.js — Données de la page d'accueil
 * * Regroupe toutes les données utilisées par HomePage.jsx
 */

/**
 * Slides du carousel hero.
 * - 2 Formations Numérique
 * - 2 Formations Gestion / RH
 * Les liens 'ctaTo' sont prêts pour rediriger vers les bonnes pages.
 */
export const slides = [
  {
    id: 1,
    badge: 'Infrastructure & Sécurité',
    title: 'Devenez Administrateur·rice\nd’infrastructures sécurisées',
    subtitle: 'Garantissez la disponibilité et la sécurité',
    desc: 'Concevez, administrez et sécurisez les infrastructures informatiques pour devenir un pilier stratégique des entreprises.',
    cta: 'Découvrir la formation',
    ctaTo: '/formations/administrateur-dinfrastructures-securisees-ais',
    video: '/Assets/video/formations/admin-infra.mp4'
  },
  {
    id: 2,
    badge: 'Développement Web',
    title: 'Devenez Développeur\nWeb & Mobile',
    subtitle: 'Créez les applications de demain',
    desc: 'Concevez la partie visible et technique d\'applications web et mobiles, en veillant à la performance et à l’expérience utilisateur.',
    cta: 'Découvrir la formation',
    ctaTo: '/formations/developpeur-web-mobile',
    video: '/Assets/video/formations/dev-web-mobile.mp4'
  },
  {
    id: 3,
    badge: 'Ressources Humaines',
    title: 'Devenez Assistant(e)\nRessources Humaines',
    subtitle: 'Véritable trait d\'union dans l\'entreprise',
    desc: 'Participez activement à la gestion administrative du personnel, au recrutement, à la formation et au bon climat social.',
    cta: 'Découvrir la formation',
    ctaTo: '/formations/assistante-ressources-humaines',
    video: '/Assets/video/formations/rh.mp4'
  },
  {
    id: 4,
    badge: 'Comptabilité & Gestion',
    title: 'Devenez Gestionnaire\ncomptable et fiscal',
    subtitle: 'La colonne vertébrale de l\'entreprise',
    desc: 'Assurez la lisibilité financière de la structure, de la saisie des opérations courantes jusqu\'à l\'élaboration de la liasse fiscale.',
    cta: 'Découvrir la formation',
    ctaTo: '/formations/gestionnaire-comptable-fiscal',
    video: '/Assets/video/formations/comptable.mp4'
  }
];

/**
 * Statistiques clés.
 */
export const stats = [
  { value: '+5000', label: 'Stagiaires formés' },
  { value: '+40', label: 'Experts formateurs' },
  { value: '95%', label: 'Taux de satisfaction' },
  { value: '+150', label: 'Formations disponibles' },
];

/**
 * Services mis en avant.
 * Les liens 'href' sont intégrés pour vos cartes de services.
 */
export const services = [
  {
    titre: 'Formations certifiantes',
    href: '/formations',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
    items: [
      'Titres RNCP reconnus par l\'État',
      'Parcours personnalisés selon vos objectifs',
      'Accompagnement individuel tout au long du cursus',
      'Expertise reconnue dans les métiers du digital',
    ],
  },
  {
    titre: 'Alternance & emploi',
    href: '/alternance',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
    items: [
      'Réseau d\'entreprises partenaires actif',
      'Aide au placement en entreprise',
      'Suivi personnalisé de votre intégration',
      'Coaching carrière et préparation entretiens',
    ],
  },
  {
    titre: 'Solutions entreprises',
    href: '/entreprises',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800',
    items: [
      'Formation sur-mesure pour vos équipes',
      'Audit de compétences et accompagnement RH',
      'Gestion administrative simplifiée',
      'Financement facilité via OPCO',
    ],
  },
];

/**
 * Logos partenaires avec liens vers leurs sites officiels.
 */
export const partenaires = [
  { nom: 'agefiph', logo: '/Assets/partenaires/agefiph.png', url: 'https://www.agefiph.fr/' },
  { nom: 'akto', logo: '/Assets/partenaires/akto.png', url: 'https://www.akto.fr/' },
  { nom: 'bnp-paribas', logo: '/Assets/partenaires/bnp-paribas.png', url: 'https://mabanque.bnpparibas/' },
  { nom: 'cic', logo: '/Assets/partenaires/cic.png', url: 'https://www.cic.fr/' },
  { nom: 'credit-agricole', logo: '/Assets/partenaires/credit-agricole.png', url: 'https://www.credit-agricole.fr/' },
  { nom: 'edf', logo: '/Assets/partenaires/edf.png', url: 'https://www.edf.fr/' },
  { nom: 'france-compétence', logo: '/Assets/partenaires/france-competence.png', url: 'https://www.francecompetences.fr/' },
  { nom: 'france-travail', logo: '/Assets/partenaires/france-travail.png', url: 'https://www.francetravail.fr/' },
  { nom: 'région ile de france', logo: '/Assets/partenaires/idf.png', url: 'https://www.iledefrance.fr/' },
  { nom: 'microsoft', logo: '/Assets/partenaires/microsoft.png', url: 'https://www.microsoft.com/' },
  { nom: 'orange', logo: '/Assets/partenaires/orange.png', url: 'https://www.orange.fr/' },
  { nom: 'pdf', logo: '/Assets/partenaires/pdf.png', url: 'https://adobe.com/pdf' },
  { nom: 'pennylane', logo: '/Assets/partenaires/pennylane.png', url: 'https://www.pennylane.com/' },
  { nom: 'uniformation', logo: '/Assets/partenaires/uniformation.png', url: 'https://www.uniformation.fr/' },
  { nom: 'verisure', logo: '/Assets/partenaires/verisure.png', url: 'https://www.verisure.fr/' },
];

/**
 * Témoignages clients.
 */
export const temoignages = [
  {
    quote: "Grâce à ALT FORMATIONS, j'ai pu me reconvertir dans la cybersécurité. L'accompagnement était exceptionnel et j'ai trouvé un poste en CDI avant même la fin de ma formation.",
    author: 'Marie Dupont',
    role: 'Analyste Cybersécurité',
  },
  {
    quote: "Une formation en alternance qui m'a permis d'acquérir de vraies compétences terrain. Les formateurs sont des experts passionnés et disponibles.",
    author: 'Thomas Martin',
    role: 'Chef de projet digital',
  },
  {
    quote: "ALT FORMATIONS nous accompagne dans la formation de nos équipes depuis 2 ans. Un partenaire fiable, réactif et à l'écoute de nos besoins spécifiques.",
    author: 'Sophie Bernard',
    role: 'DRH Entreprise Tech',
  },
];

export const certifications = {
  titre: "Organisme certifié & reconnu",
  description: "La qualité de nos formations est certifiée. Nous répondons aux exigences les plus strictes pour vous garantir une montée en compétences d'excellence, éligible aux dispositifs de financement (CPF, OPCO, France Travail).",
  badges: [
    {
      nom: "Qualiopi",
      image: "Assets/images/qualiopi.png"
    }
    // Vous pouvez ajouter d'autres badges ici (RNCP, etc.)
  ]
};