/**
 * home.js — Données de la page d'accueil
 *
 * Regroupe toutes les données utilisées par HomePage.jsx :
 *   - slides      : Carousel hero (4 slides, une par domaine)
 *   - stats       : 4 chiffres clés du site
 *   - services    : 3 colonnes "Nos services"
 *   - partenaires : 5 logos partenaires (placeholders)
 *   - temoignages : 3 avis clients avec citation, nom, rôle
 */

/**
 * Slides du carousel hero.
 * Chaque slide correspond à un domaine de formation.
 * @type {Array<{badge, title, subtitle, desc, cta, ctaTo}>}
 */
export const slides = [
  {
    badge: 'Cybersécurité',
    title: 'Sécurisez votre carrière,\nrévélez votre potentiel',
    subtitle: 'Expert en Cybersécurité',
    desc: 'Protégez les données et systèmes de demain',
    cta: 'Découvrir nos formations',
    ctaTo: '/formations#cybersecurite',
  },
  {
    badge: 'Management',
    title: 'Devenez le leader\nque vous rêvez d\'être',
    subtitle: 'Manager de Projet & d\'Équipe',
    desc: 'Développez vos compétences en leadership et gestion d\'équipe',
    cta: 'Découvrir nos formations',
    ctaTo: '/formations#management',
  },
  {
    badge: 'Ressources Humaines',
    title: 'Façonnez l\'avenir\ndes talents en entreprise',
    subtitle: 'Responsable RH (Bac+5)',
    desc: 'Maîtrisez le recrutement, la paie et le développement RH',
    cta: 'Découvrir nos formations',
    ctaTo: '/formations#ressources-humaines',
  },
  {
    badge: 'Digital & Marketing',
    title: 'Boostez votre carrière\ndans le digital',
    subtitle: 'Chef de Projet Digital',
    desc: 'Maîtrisez les outils et stratégies du marketing digital',
    cta: 'Découvrir nos formations',
    ctaTo: '/formations#digital',
  },
];

/**
 * Statistiques clés affichées en orange sous le hero.
 * @type {Array<{value: string, label: string}>}
 */
export const stats = [
  { value: '+5000', label: 'Stagiaires formés' },
  { value: '+40',   label: 'Experts formateurs' },
  { value: '95%',   label: 'Taux de satisfaction' },
  { value: '+150',  label: 'Formations disponibles' },
];

/**
 * Services mis en avant dans la section "Nos services".
 * 3 colonnes, chacune avec un titre et une liste de points.
 * @type {Array<{titre: string, items: string[]}>}
 */
export const services = [
  {
    titre: 'Formations certifiantes',
    items: [
      'Titres RNCP reconnus par l\'État',
      'Parcours personnalisés selon vos objectifs',
      'Accompagnement individuel tout au long du cursus',
      'Expertise reconnue dans les métiers du digital',
    ],
  },
  {
    titre: 'Alternance & emploi',
    items: [
      'Réseau d\'entreprises partenaires actif',
      'Aide au placement en entreprise',
      'Suivi personnalisé de votre intégration',
      'Coaching carrière et préparation entretiens',
    ],
  },
  {
    titre: 'Solutions entreprises',
    items: [
      'Formation sur-mesure pour vos équipes',
      'Audit de compétences et accompagnement RH',
      'Gestion administrative simplifiée',
      'Financement facilité via OPCO',
    ],
  },
];

/**
 * Logos partenaires — placeholders textuels.
 * À remplacer par de vraies images lorsqu'elles sont disponibles.
 * @type {string[]}
 */
export const partenaires = [
  'Partenaire 1',
  'Partenaire 2',
  'Partenaire 3',
  'Partenaire 4',
  'Partenaire 5',
];

/**
 * Témoignages clients.
 * Chaque card a : une citation, un nom d'auteur, et un rôle (en orange).
 * @type {Array<{quote: string, author: string, role: string}>}
 */
export const temoignages = [
  {
    quote:
      "Grâce à ALT FORMATIONS, j'ai pu me reconvertir dans la cybersécurité. L'accompagnement était exceptionnel et j'ai trouvé un poste en CDI avant même la fin de ma formation.",
    author: 'Marie Dupont',
    role: 'Analyste Cybersécurité',
  },
  {
    quote:
      "Une formation en alternance qui m'a permis d'acquérir de vraies compétences terrain. Les formateurs sont des experts passionnés et disponibles.",
    author: 'Thomas Martin',
    role: 'Chef de projet digital',
  },
  {
    quote:
      "ALT FORMATIONS nous accompagne dans la formation de nos équipes depuis 2 ans. Un partenaire fiable, réactif et à l'écoute de nos besoins spécifiques.",
    author: 'Sophie Bernard',
    role: 'DRH Entreprise Tech',
  },
];