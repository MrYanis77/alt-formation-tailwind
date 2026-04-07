/*
 * Données de la page E-learning
 * Contient le texte du hero, les fonctionnalités de la plateforme
 * et les statistiques clés affichées sur la page.
 */

export const hero = {
  titre: "E-learning",
  sousTitre: "Formez-vous à votre rythme avec notre plateforme d'apprentissage en ligne",
};

export const features = [
  {
    titre: 'Accessible 24/7',
    description:
      "Apprenez où vous voulez, quand vous voulez, depuis n'importe quel appareil",
    items: [
      'Interface intuitive et responsive',
      'Application mobile iOS et Android',
      'Mode hors ligne disponible',
    ],
  },
  {
    titre: 'Contenus interactifs',
    description:
      'Des ressources pédagogiques variées pour un apprentissage optimal',
    items: [
      'Vidéos HD avec formateurs experts',
      'Quiz et exercices pratiques',
      'Études de cas réels',
    ],
  },
  {
    titre: 'Suivi personnalisé',
    description:
      'Un accompagnement individualisé tout au long de votre parcours',
    items: [
      'Tableau de bord de progression',
      'Tutorat en ligne avec formateurs',
      'Feedback personnalisé sur vos travaux',
    ],
  },
  {
    titre: 'Certifications',
    description: 'Validez vos acquis avec des certifications reconnues',
    items: [
      'Badges de compétences',
      'Certificats de réussite',
      'Attestations téléchargeables',
    ],
  },
];

/** Statistiques clés affichées en grand format orange */
export const stats = [
  { value: '+200',  label: 'Heures de contenu vidéo' },
  { value: '92%',   label: 'Taux de complétion' },
  { value: '4.8/5', label: 'Satisfaction apprenants' },
];
