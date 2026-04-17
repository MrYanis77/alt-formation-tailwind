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
    title: 'Devenez Administrateur\nd’infrastructures sécurisées',
    subtitle: 'Garantissez la disponibilité et la sécurité',
    desc: 'Concevez, administrez et sécurisez les infrastructures informatiques pour devenir un pilier stratégique des entreprises.',
    cta: 'Découvrir la formation',
    ctaTo: '/formation/formations-administrateur-dinfrastructures-securisees-ais',
    video: '/Assets/video/formations/infra-reseau.mp4'
  },
  {
    id: 2,
    badge: 'Développement Web',
    title: 'Devenez Développeur\nWeb & Mobile',
    subtitle: 'Créez les applications de demain',
    desc: 'Concevez la partie visible et technique d\'applications web et mobiles, en veillant à la performance et à l’expérience utilisateur.',
    cta: 'Découvrir la formation',
    ctaTo: '/formation/formations-developpeur-web-mobile',
    video: '/Assets/video/formations/dev-web-mobile.mp4'
  },
  {
    id: 3,
    badge: 'Ressources Humaines',
    title: 'Devenez Assistant\nRessources Humaines',
    subtitle: 'Véritable trait d\'union dans l\'entreprise',
    desc: 'Participez activement à la gestion administrative du personnel, au recrutement, à la formation et au bon climat social.',
    cta: 'Découvrir la formation',
    ctaTo: '/formation/formations-assistante-ressources-humaines',
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
    image: '/Assets/images/certification.jpg',
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
    image: '/Assets/images/emploi.jpg',
    items: [
      'Réseau d\'entreprises partenaires actif',
      'Aide au placement en entreprise',
      'Suivi personnalisé de votre intégration',
      'Coaching carrière et préparation entretiens',
    ],
  },
  {
    titre: 'Solutions entreprises',
    href: '/carriere',
    image: '/Assets/images/entreprise.jpg',
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
  { nom: 'pennylane', logo: '/Assets/partenaires/pennylane.png' },
  { nom: 'uniformation', logo: '/Assets/partenaires/uniformation.png' },
  { nom: 'verisure', logo: '/Assets/partenaires/verisure.png' },
  { nom: 'veolia', logo: '/Assets/partenaires/veolia.png' },
];

/**
 * Témoignages clients.
 */
export const temoignages = [
  {
    avatar: "https://ui-avatars.com/api/?name=Souf+Man&background=000&color=0cf",
    author: "Souf M",
    role: "Local Guide · 32 avis · 10 photos",
    date: "Modifié il y a un an",
    rating: 5,
    quote: "J'ai suivi une formation d'administrateur infrastructures sécurisées dans le centre de formation ALTRH et je ne regret pas, très bon suivi tout le long de formation et formateurs de qualité, grâce à eux j'ai pu acquérir des bonnes compétences et réussir mon diplôme 🎉 🎊",
  },
  {
    avatar: "https://ui-avatars.com/api/?name=Aude+Havette&background=7B1FA2&color=fff",
    author: "Aude H",
    role: "1 avis",
    date: "il y a 2 ans",
    rating: 5,
    quote: "J'ai suivi une formation préparatoire (non diplômante) chez Alt Rh afin de mieux aborder un cycle diplômant. Je recommande cette formation où l'on aborde HTML/CSS, Javascript ainsi que SQL, PHP/Symfony côté back-end. En fait, on est plus vraiment dans le cadre d'une formation préparatoire mais mi-chemin avec une formation diplômante. D'une manière générale, le volume horaire est très satisfaisant pour une formation préparatoire notamment en ce qui concerne PHP. Les formateurs sont compétents. Beaucoup de travail personnel à côté car c'est intense mais ça en vaut la peine.",
  },
  {
    avatar: "https://ui-avatars.com/api/?name=Guillaume&background=C2185B&color=fff",
    author: "Guillaume",
    role: "1 avis",
    date: "il y a 4 ans",
    rating: 4,
    quote: "Bonne formation en moyenne, condensée, rapide parfois trop rapide pour certains modules comme le code (html/css). Point a améliorer : la licence adobe et les logiciels qui sont partagés avec trop d'étudiants, du coup nous n'avions pas toujours les accès.",
  },
  {
    avatar: "https://ui-avatars.com/api/?name=Islem&background=004D40&color=fff",
    author: "Islem",
    role: "2 avis",
    date: "il y a 4 ans",
    rating: 4,
    quote: "La formation c'est bien passé avec des formateurs à l'écoute et pour certains très pédagogue, l'atmosphère au sein du groupe de travail est excellente et les outils nécessaires à notre apprentissage sont bien mis à notre disposition néanmoins le partage de comptes entre plusieurs étudiants c'est quelques fois révéler problématique",
  },
  {
    avatar: "https://ui-avatars.com/api/?name=Youssef+al+maizi&background=E91E63&color=fff",
    author: "Youssef A",
    role: "1 avis",
    date: "il y a 3 ans",
    rating: 5,
    quote: "Grace a la formation CDA j ai pu ameliorer mon savoir etre avant le savoir grace au coaching du formateur",
  },
  {
    avatar: "https://ui-avatars.com/api/?name=Amine+Hkn&background=1976D2&color=fff",
    author: "Amine H",
    role: "Local Guide · 18 avis · 3 photos",
    date: "il y a 3 ans",
    rating: 5,
    quote: "Excellent centre de formation, l'équipe pédagogique fais de son mieux pour assurer le suivi des lauréats.",
  },
  {
    avatar: "https://ui-avatars.com/api/?name=mohemad+belqas&background=00838F&color=fff",
    author: "mohemad b",
    role: "1 avis",
    date: "il y a 3 ans",
    rating: 5,
    quote: "La formation développement application est excellente merci a vous.",
  }
];

export const certifications = {
  titre: "Organisme certifié",
  description: "La qualité de nos formations est certifiée. Nous répondons aux exigences les plus strictes pour vous garantir une montée en compétences d'excellence, éligible aux dispositifs de financement (CPF, OPCO, France Travail).",
  badges: [
    {
      nom: "Qualiopi",
      image: "/Assets/images/qualiopi.png"
    }
    // Vous pouvez ajouter d'autres badges ici (RNCP, etc.)
  ]
};

/**
 * Section Présentation (Professionnels et engagés)
 */
export const presentation = {
  titre: "Professionnels et engagés",
  accroche: "Formons les talents au Travail de demain.",
  paragraphe1: "Notre centre de formation et CFA, filiale du groupe ALT RH CONSULTING, s’impose comme un acteur de référence dans la formation, le développement des compétences professionnelles. Spécialistes des métiers du numérique, de l’intelligence artificielle, de la cybersécurité et des ressources humaines, nous concevons des parcours de formation innovants, certifiants et orientés terrain.",
  paragraphe2: "Dans un environnement en constante mutation, marqué par la transformation digitale des entreprises, l’essor de l’intelligence artificielle et les enjeux croissants de la cybersécurité, notre ingénierie pédagogique moderne et des formateurs experts, nous proposons des formats d’apprentissage flexibles (présentiel, distanciel, blended learning) adaptés aux exigences actuelles des entreprises.",
  mission: {
    label: "Notre mission :",
    texte: "rendre chaque apprenant immédiatement opérationnel et favoriser son insertion ou sa reconversion professionnelle."
  },
  objectif: {
    label: "Notre Objectif :",
    texte: "vous faire réussir vos certifications, accélérer votre insertion ou votre reconversion, et vous rendre employable immédiatement."
  },
  conclusion: "Rejoindre ALT-FORMATIONS, c’est choisir une formation reconnue, concrète et tournée vers l’avenir professionnel."
};