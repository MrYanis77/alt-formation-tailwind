/**
 * home.js — Données de la page d'accueil
 * * Regroupe toutes les données utilisées par HomePage.jsx
 */

/**
 * Slides du carousel hero.
 * Ajout de la propriété 'image' pour un fond dynamique.
 */
export const slides = [
  {
    id: 1,
    badge: 'Cybersécurité',
    title: 'Sécurisez votre carrière,\nrévélez votre potentiel',
    subtitle: 'Expert en Cybersécurité',
    desc: 'Protégez les données et systèmes de demain avec nos certifications de pointe.',
    cta: 'Découvrir nos formations',
    ctaTo: '/formations',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 2,
    badge: 'Management',
    title: 'Devenez le leader\nque vous rêvez d\'être',
    subtitle: 'Manager de Projet & d\'Équipe',
    desc: 'Développez vos compétences en leadership et gestion d\'équipe opérationnelle.',
    cta: 'Découvrir nos formations',
    ctaTo: '/formations',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 3,
    badge: 'Ressources Humaines',
    title: 'Façonnez l\'avenir\ndes talents en entreprise',
    subtitle: 'Responsable RH (Bac+5)',
    desc: 'Maîtrisez le recrutement, la paie et le développement stratégique des RH.',
    cta: 'Découvrir nos formations',
    ctaTo: '/formations',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 4,
    badge: 'Digital & Marketing',
    title: 'Boostez votre carrière\ndans le digital',
    subtitle: 'Chef de Projet Digital',
    desc: 'Maîtrisez les outils et stratégies de pointe du marketing numérique.',
    cta: 'Découvrir nos formations',
    ctaTo: '/formations',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200'
  },
];

/**
 * Statistiques clés.
 */
export const stats = [
  { value: '+5000', label: 'Stagiaires formés' },
  { value: '+40',   label: 'Experts formateurs' },
  { value: '95%',   label: 'Taux de satisfaction' },
  { value: '+150',  label: 'Formations disponibles' },
];

/**
 * Services mis en avant.
 * Ajout des propriétés 'href' et 'image' pour la grille.
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
 * Logos partenaires.
 * Note: Dans React, les fichiers dans 'public' sont accessibles via '/Assets/...'
 */
export const partenaires = [
  { nom: 'agefiph', logo: '/Assets/partenaires/agefiph.png' },
  { nom: 'akto', logo: '/Assets/partenaires/akto.png' },
  { nom: 'bnp-paribas', logo: '/Assets/partenaires/bnp-paribas.png' },
  { nom: 'cic', logo: '/Assets/partenaires/cic.png' },
  { nom: 'credit-agricole', logo: '/Assets/partenaires/credit-agricole.png' },
  { nom: 'edf', logo: '/Assets/partenaires/edf.png' },
  { nom: 'france-compétence', logo: '/Assets/partenaires/france-compétence.png' },
  { nom: 'france-travail', logo: '/Assets/partenaires/france-travail.png' },
  { nom: 'région ile de france', logo: '/Assets/partenaires/idf.png' },
  { nom: 'microsoft', logo: '/Assets/partenaires/microsoft.png' },
  { nom: 'orange', logo: '/Assets/partenaires/orange.png' },
  { nom: 'pdf', logo: '/Assets/partenaires/pdf.png' },
  { nom: 'pennylane', logo: '/Assets/partenaires/pennylane.png' },
  { nom: 'uniformation', logo: '/Assets/partenaires/uniformation.png' },
  { nom: 'verisure', logo: '/Assets/partenaires/verisure.png' },
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