/**
 * financements.js — Données de la page Financements
 */

export const seo = {
  title: 'Financement formation — CPF, OPCO, France Travail',
  description:
    'Financez votre formation avec le CPF, votre OPCO ou France Travail. Alt RH & formations (Qualiopi) vous accompagne gratuitement dans le montage de votre dossier.',
  canonical: 'https://alt-rh.com/financements',
};

export const hero = {
  titre: 'Financements',
  sousTitre: 'CPF, OPCO, France Travail et autres dispositifs : nous vous aidons à identifier le bon financement',
  video: '/assets/video/financement.mp4',
};

export const trustBand = {
  titre: 'Un accompagnement dossier inclus',
  items: [
    { label: 'Organisme certifié Qualiopi', hint: 'Éligibilité aux financeurs publics et mutualisés' },
    { label: 'Conseiller dédié', hint: 'Identification du dispositif et constitution du dossier' },
    { label: '15 jours en moyenne', hint: 'Délai indicatif entre demande et entrée en formation' },
    { label: 'Co-financement possible', hint: 'CPF + OPCO, CPF + employeur, CPF + France Travail' },
  ],
};

export const navSections = [
  { id: 'cpf', label: 'CPF' },
  { id: 'opco', label: 'OPCO' },
  { id: 'france-travail', label: 'France Travail' },
  { id: 'alternance', label: 'Alternance' },
  { id: 'autres', label: 'Autres solutions' },
];

export const questionsOrientees = {
  titre: 'Quel financement est fait pour vous ?',
  description: 'Cliquez sur votre profil pour accéder directement aux dispositifs adaptés.',
  items: [
    {
      id: 'salarie',
      q: 'Je suis salarié(e) en poste',
      a: 'Mobilisez votre CPF en autonomie. Si la formation répond à un besoin de l’entreprise, sollicitez le plan de développement des compétences via votre OPCO.',
      sections: ['cpf', 'opco'],
    },
    {
      id: 'demandeur',
      q: 'Je suis demandeur d’emploi',
      a: 'Votre CPF reste utilisable. France Travail peut financer tout ou partie de la formation via l’AIF ou une action préalable au recrutement (AFPR/POE).',
      sections: ['cpf', 'france-travail'],
    },
    {
      id: 'employeur',
      q: 'Je suis employeur / RH',
      a: 'Votre OPCO finance l’alternance, le plan de compétences et les formations collectives. Nous montons le dossier avec vous.',
      sections: ['opco', 'alternance'],
    },
    {
      id: 'independant',
      q: 'Je suis travailleur indépendant',
      a: 'Votre CPF est alimenté chaque année. Complétez avec le FAF de votre secteur (FIF PL, AGEFICE, FIF PL…).',
      sections: ['cpf', 'autres'],
    },
  ],
};

export const cpf = {
  id: 'cpf',
  titre: 'Compte Personnel de Formation (CPF)',
  description:
    'Utilisez vos droits à la formation accumulés tout au long de votre carrière. Les parcours certifiants (titres RNCP et RS) référencés sur moncompteformation.gouv.fr sont éligibles.',
  image: '/assets/images/Logo/cpf.png',
  imageContain: true,
  highlight: true,
  howTo: {
    label: 'Comment ça marche ?',
    items: [
      'Consultez vos droits sur moncompteformation.gouv.fr',
      'Recherchez la formation Alt RH & formations souhaitée',
      'Inscrivez-vous en ligne ou avec l’aide de nos conseillers',
      'Nous gérons la convention avec votre compte CPF',
    ],
  },
  amount: {
    label: 'Montant disponible',
    description:
      'Les droits sont exprimés en euros et alimentés chaque année (montants et plafonds selon votre situation — vérifiez votre solde en ligne).',
    cta: 'Vérifier mon solde CPF',
    ctaHref: 'https://www.moncompteformation.gouv.fr',
  },
  footerLinks: [
    { label: 'Voir nos formations certifiantes', href: '/formations' },
    { label: 'Titres RNCP & RS', href: '/certification' },
  ],
  contactCta: { label: 'Aide au montage CPF', href: '/contact' },
};

export const opco = {
  id: 'opco',
  titre: 'Financement OPCO',
  description:
    'Les Opérateurs de Compétences (OPCO) financent les formations des salariés et des entreprises selon votre branche professionnelle.',
  image: '/assets/images/Logo/opco.png',
  imageContain: true,
  columns: [
    {
      label: 'Pour les salariés',
      items: [
        'Plan de développement des compétences',
        'Pro-A (reconversion professionnelle)',
        'Validation des acquis de l’expérience (VAE)',
      ],
    },
    {
      label: 'Pour les entreprises',
      items: [
        'Financement des contrats d’alternance',
        'Aide au tutorat',
        'Formations collectives intra-entreprise',
      ],
    },
    {
      label: 'Nous vous accompagnons',
      text: 'Notre équipe administrative prend en charge les démarches avec votre OPCO : devis, convention et suivi administratif.',
    },
  ],
  footerLinks: [{ label: 'Espace entreprise', href: '/entreprise' }],
  contactCta: { label: 'Monter mon dossier OPCO', href: '/contact' },
};

export const poleEmploi = {
  id: 'france-travail',
  titre: 'France Travail',
  description:
    'Plusieurs dispositifs sont disponibles pour les demandeurs d’emploi et les projets de reconversion.',
  image: '/assets/images/Logo/france-travail.jpg',
  imageContain: true,
  columns: [
    {
      label: 'AIF — Aide Individuelle à la Formation',
      text: 'Prise en charge totale ou partielle de votre formation par France Travail, selon votre projet professionnel et l’avis de votre conseiller.',
    },
    {
      label: 'AFPR / POE',
      text: 'Formation préalable au recrutement pour adapter vos compétences à une offre d’emploi concrète.',
    },
    {
      label: 'CPF de transition',
      text: 'Pour une reconversion longue certifiante, le dispositif de transition professionnelle (ex-CIF) peut financer la formation et maintenir une partie de la rémunération sous conditions.',
    },
  ],
  footerLinks: [{ label: 'Questions financement (FAQ)', href: '/faq#financement' }],
  contactCta: { label: 'Parler à un conseiller', href: '/contact' },
};

export const alternance = {
  id: 'alternance',
  titre: 'Alternance & apprentissage',
  description:
    'Le coût pédagogique de l’alternance est pris en charge par l’OPCO. L’entreprise rémunère l’alternant selon la grille en vigueur.',
  columns: [
    {
      label: 'Ce qui est financé',
      items: [
        'Coût pédagogique via l’OPCO (contrat pro ou apprentissage)',
        'Accompagnement tutorat (aides possibles)',
        'Titres RNCP en alternance sur nos parcours diplômants',
      ],
    },
    {
      label: 'Votre démarche',
      items: [
        'Choisir un titre et une session',
        'Signer un contrat avec une entreprise',
        'Nous constituons le dossier OPCO avec l’employeur',
      ],
    },
  ],
  footerLinks: [
    { label: 'Page alternance', href: '/alternance' },
    { label: 'Catalogue formations', href: '/formations#diplomantes' },
  ],
  contactCta: { label: 'Candidater en alternance', href: '/contact' },
};

export const autresSolutions = {
  id: 'autres',
  titre: 'Autres solutions',
  description:
    'Selon votre profil, d’autres financeurs peuvent compléter ou remplacer le CPF et l’OPCO.',
  columns: [
    {
      label: 'Financement personnel',
      text: 'Facilités de paiement en plusieurs fois sans frais — contactez-nous pour un échéancier adapté.',
    },
    {
      label: 'Conseil régional',
      text: 'Aides spécifiques selon votre région (demandeurs d’emploi, jeunes, reconversion).',
    },
    {
      label: 'Agefiph & handicap',
      text: 'Prise en charge possible pour les personnes en situation de handicap — référente dédiée sur demande.',
    },
    {
      label: 'Bilan de compétences',
      text: 'Prestation éligible au CPF si le prestataire est certifié Qualiopi et référencé sur Mon Compte Formation.',
    },
  ],
  footerLinks: [
    { label: 'Bilan de compétences', href: '/bilan-de-competences' },
    { label: 'Situation handicap', href: '/situation-handicap' },
  ],
  contactCta: { label: 'Demander un devis', href: '/contact' },
};

export const ctaFinal = {
  titre: 'Besoin d’aide pour votre financement ?',
  sousTitre:
    'Nos conseillers vous accompagnent gratuitement dans le choix du dispositif et le montage de votre dossier (CPF, OPCO, France Travail).',
  texteBouton: 'Prendre rendez-vous',
  lienBouton: '/contact',
  texteBoutonSecondaire: 'Toutes les questions financement',
  lienBoutonSecondaire: '/faq#financement',
};
