/**
 * Contenus des pages « démarches » (footer — informations légales & qualité).
 * Clé = chemin URL (pathname).
 */
export const demarchesContent = {
  '/demarche-pedagogique': {
    titre: 'Démarche pédagogique',
    breadcrumb: 'Démarche pédagogique',
    intro:
      'Chez Alt RH Formations, la pédagogie n’est pas un accessoire : c’est le fil conducteur de chaque parcours. Au-delà de la transmission de compétences numériques, RH ou tertiaires, nous accompagnons chaque projet avec une équipe engagée, de la définition de vos objectifs jusqu’à la valorisation de vos acquis.',
    articles: [
      {
        num: 1,
        titre: 'Une conception pédagogique collaborative',
        contenu:
          'Avant toute entrée en formation, nous identifons le profil du bénéficiaire, ses objectifs professionnels et le niveau de départ. Un test de positionnement ou un entretien préalable permet d’adapter le parcours (rythme, prérequis, modalités).',
        list: [
          'Entretien de cadrage avec un conseiller pédagogique',
          'Test de positionnement lorsque le référentiel l’exige',
          'Validation de l’adéquation formation / projet professionnel',
        ],
      },
      {
        num: 2,
        titre: 'Ingénierie et déroulement des formations',
        contenu:
          'Nos formations combinent apports théoriques, mises en situation, études de cas et travaux pratiques. Les formats varient selon les parcours : présentiel, distanciel synchrone, e-learning ou blended learning.',
        list: [
          'Référentiels alignés sur les certifications visées (RNCP, RS, éditeurs)',
          'Supports pédagogiques remis aux stagiaires',
          'Suivi de l’assiduité et des évaluations formatives',
        ],
      },
      {
        num: 3,
        titre: 'Évaluation et accompagnement',
        contenu:
          'L’évaluation est continue tout au long du parcours. Une évaluation sommative ou un passage devant jury valide les compétences en fin de formation certifiante. Un accompagnement post-formation peut être proposé selon les parcours.',
      },
    ],
  },

  '/demarche-qualite': {
    titre: 'Démarche qualité',
    breadcrumb: 'Démarche qualité',
    intro:
      'La qualité est au cœur de nos processus. Alt RH Formations est certifié Qualiopi au titre des actions de formation, garantissant la conformité de nos pratiques aux exigences réglementaires françaises.',
    articles: [
      {
        num: 1,
        titre: 'Engagement qualité',
        contenu:
          'Nous nous engageons à fournir des prestations conformes aux attentes des bénéficiaires et des financeurs, dans le respect des référentiels nationaux et des exigences de la certification Qualiopi.',
        list: [
          'Processus documentés et régulièrement revus',
          'Indicateurs de satisfaction et d’insertion suivis',
          'Amélioration continue à partir des retours stagiaires et partenaires',
        ],
      },
      {
        num: 2,
        titre: 'Indicateurs et suivi',
        contenu:
          'Nous mesurons la satisfaction des apprenants, le taux de réalisation des parcours et, lorsque c’est pertinent, les suites professionnelles. Ces données nourrissent nos plans d’amélioration.',
      },
      {
        num: 3,
        titre: 'Réclamations et traitement des aléas',
        contenu:
          'Toute réclamation peut être adressée par écrit à contact@alt-formations.com ou via notre formulaire de contact. Nous nous engageons à accuser réception et à apporter une réponse motivée dans les meilleurs délais.',
      },
    ],
  },

  '/demarche-rse': {
    titre: 'Démarche RSE',
    breadcrumb: 'Démarche RSE',
    intro:
      'Alt RH Formations intègre des principes de responsabilité sociétale dans son activité : respect des personnes, réduction de l’impact environnemental de nos activités et contribution à l’insertion professionnelle.',
    articles: [
      {
        num: 1,
        titre: 'Social et humain',
        contenu:
          'Nous favorisons l’égalité d’accès à la formation, l’accompagnement des publics en reconversion et le respect de la diversité au sein de nos équipes et de nos promotions.',
        list: [
          'Accessibilité et référent handicap (voir page dédiée)',
          'Parcours adaptés aux demandeurs d’emploi et aux salariés en évolution',
          'Relations de travail fondées sur l’écoute et la bienveillance',
        ],
      },
      {
        num: 2,
        titre: 'Environnement',
        contenu:
          'Nous développons le distanciel et l’e-learning pour limiter les déplacements lorsque cela est pertinent. Nos locaux et nos pratiques numériques visent à réduire le gaspillage (supports dématérialisés, impressions limitées).',
      },
      {
        num: 3,
        titre: 'Sociétal',
        contenu:
          'Par la formation et la certification, nous contribuons à la montée en compétences des territoires et des entreprises, en particulier dans les filières numériques, RH et tertiaire en tension de recrutement.',
      },
    ],
  },

  '/situation-handicap': {
    titre: 'Situation de handicap',
    breadcrumb: 'Situation de handicap',
    intro:
      'Alt RH Formations s’engage à accueillir et accompagner toute personne en situation de handicap dans les meilleures conditions. Un référent handicap dédié coordonne les aménagements nécessaires.',
    articles: [
      {
        num: 1,
        titre: 'Référent handicap',
        contenu:
          'Notre référent handicap est votre interlocuteur privilégié pour étudier les besoins d’aménagement avant et pendant la formation. Contact : contact@alt-formations.com — objet « Référent handicap ».',
      },
      {
        num: 2,
        titre: 'Aménagements possibles',
        contenu:
          'Selon votre situation et le parcours visé, nous pouvons adapter les modalités pédagogiques et l’accès à nos locaux ou outils numériques.',
        list: [
          'Adaptation des supports (formats, contrastes, synthèse vocale)',
          'Aménagement du temps et du rythme de formation',
          'Accès PMR et organisation des espaces en présentiel',
          'Formation en distanciel lorsque l’activité le permet',
          'Mise en relation avec l’AGEFIPH ou autres financeurs complémentaires',
        ],
      },
      {
        num: 3,
        titre: 'Démarche proactive',
        contenu:
          'Nous invitons chaque candidat à signaler dès l’inscription toute situation nécessitant un aménagement, afin de construire un parcours réaliste et sécurisé. Aucune discrimination ne sera tolérée dans l’accès à nos formations.',
      },
    ],
  },
};

/** Liens affichés dans le footer (ordre d’affichage). */
export const demarchesFooterLinks = [
  { to: '/demarche-pedagogique', label: 'Démarche pédagogique' },
  { to: '/demarche-qualite', label: 'Démarche qualité' },
  { to: '/demarche-rse', label: 'Démarche RSE' },
  { to: '/situation-handicap', label: 'Situation handicap' },
];

/**
 * @param {string} pathname
 * @returns {typeof demarchesContent[string] | undefined}
 */
export function getDemarchePage(pathname) {
  return demarchesContent[pathname];
}
