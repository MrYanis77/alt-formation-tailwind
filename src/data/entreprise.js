/**
 * entreprise.js — Données de la page Solutions Entreprises
 *
 * Couvre :
 *   - Services proposés (formation sur-mesure, audit, accompagnement RH)
 *   - Processus de recrutement en alternance (4 étapes)
 *   - Statistiques clés (4 chiffres forts)
 */

/**
 * Service "Formation sur-mesure" — carte principale avec bordure orange
 * Structuré en 3 colonnes : Analyse / Déploiement / Suivi & Évaluation
 * @type {Object}
 */

export const hero = {
  titre: "Solutions Entreprises",
  sousTitre: "Développez les compétences de vos équipes avec des solutions sur-mesure",
};

export const formationSurMesure = {
  titre: 'Formation sur-mesure',
  description:
    'Nous concevons des programmes de formation adaptés aux besoins spécifiques de votre entreprise et de vos équipes.',
  columns: [
    {
      label: 'Analyse des besoins',
      items: [
        'Audit de compétences',
        'Définition des objectifs',
        'Plan de formation personnalisé',
      ],
    },
    {
      label: 'Déploiement',
      items: [
        'Formations intra-entreprise',
        'Formateurs experts dédiés',
        'Modalités flexibles (présentiel/distanciel)',
      ],
    },
    {
      label: 'Suivi & Évaluation',
      items: [
        'Tableaux de bord de progression',
        "Évaluation des acquis",
        'Reporting détaillé',
      ],
    },
  ],
};

/**
 * Services complémentaires — 2 colonnes côte à côte (sans bordure forte)
 * @type {Array<Object>}
 */
export const servicesComplementaires = [
  {
    titre: 'Audit de compétences',
    description:
      "Identifiez les compétences clés de vos équipes et les axes d'amélioration",
    items: [
      'Cartographie des compétences existantes',
      'Gap analysis et recommandations',
      "Plan d'action stratégique",
    ],
  },
  {
    titre: 'Accompagnement RH',
    description: 'Support dans la gestion et le développement de vos talents',
    items: [
      'GPEC (Gestion Prévisionnelle des Emplois)',
      'Conseil en stratégie RH',
      'Gestion administrative complète',
    ],
  },
];

/**
 * Recrutement en alternance — processus en 4 étapes
 * @type {Object}
 */
export const recrutementAlternance = {
  titre: 'Recrutement en alternance',
  description:
    'Trouvez vos futurs talents parmi nos apprenants qualifiés et motivés',
  steps: [
    {
      titre: 'Sourcing',
      desc: 'Accès à votre vivier de candidats pré-qualifiés',
    },
    {
      titre: 'Présélection',
      desc: 'Profils adaptés à vos besoins et votre culture',
    },
    {
      titre: 'Intégration',
      desc: "Accompagnement durant la période d'essai",
    },
    {
      titre: 'Suivi',
      desc: 'Point régulier entreprise/alternant/tuteur',
    },
  ],
};

/**
 * Statistiques clés — 4 chiffres forts en orange
 * @type {Array<{value: string, label: string}>}
 */
export const stats = [
  { value: '+300', label: 'Entreprises partenaires' },
  { value: '98%',  label: 'Satisfaction clients' },
  { value: '72h',  label: 'Délai de réponse moyen' },
  { value: '100%', label: 'Financement OPCO' },
];