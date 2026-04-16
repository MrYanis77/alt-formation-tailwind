/**
 * financements.js — Données de la page Financements
 *
 * Regroupe toutes les solutions de financement disponibles,
 * organisées par dispositif :
 * - CPF (Compte Personnel de Formation)
 * - OPCO (Opérateurs de Compétences)
 * - Pôle Emploi / France Travail
 * - Autres solutions
 */

export const hero = {
  titre: "Financements",
  sousTitre: "Plusieurs solutions de financement pour rendre votre formation accessible",
  video: "/Assets/video/financement.mp4",
};

/**
 * Dispositif CPF
 */
export const cpf = {
  titre: 'Compte Personnel de Formation (CPF)',
  description: 'Utilisez vos droits à la formation accumulés tout au long de votre carrière. Toutes nos formations certifiantes sont éligibles au CPF.',
  image: '/Assets/images/Logo/cpf.png', // <-- Ajout de l'image ici
  howTo: {
    label: 'Comment ça marche ?',
    items: [
      'Consultez vos droits sur moncompteformation.gouv.fr',
      'Recherchez la formation ALT FORMATIONS souhaitée',
      'Inscrivez-vous directement en ligne',
      'Nous gérons le reste avec votre compte CPF',
    ],
  },
  amount: {
    label: 'Montant disponible',
    description: "Chaque année, vous accumulez jusqu'à 500€ (800€ pour les moins qualifiés), dans la limite de 5000€",
    cta: 'Vérifier mon solde CPF',
    ctaHref: 'https://www.moncompteformation.gouv.fr',
  },
};

/**
 * Dispositif OPCO
 */
export const opco = {
  titre: 'Financement OPCO',
  description: 'Les Opérateurs de Compétences (OPCO) financent les formations des salariés et des entreprises.',
  image: '/Assets/images/Logo/opco.png', // <-- Ajout de l'image ici
  columns: [
    {
      label: 'Pour les salariés',
      items: [
        'Plan de développement des compétences',
        'Pro-A (reconversion)',
        'Validation des Acquis',
      ],
    },
    {
      label: 'Pour les entreprises',
      items: [
        "Financement des contrats d'alternance",
        'Aide au tutorat',
        'Formations collectives',
      ],
    },
    {
      label: 'Nous vous accompagnons',
      text: 'Notre équipe administrative prend en charge toutes les démarches avec votre OPCO',
      items: [],
    },
  ],
};

/**
 * Dispositif Pôle Emploi / France Travail
 */
export const poleEmploi = {
  titre: 'Pôle Emploi (France Travail)',
  description: 'Plusieurs dispositifs sont disponibles pour les demandeurs emploi.',
  image: '/Assets/images/Logo/france-travail.jpg', // <-- Ajout de l'image ici
  columns: [
    {
      label: 'AIF - Aide Individuelle à la Formation',
      text: "Prise en charge totale ou partielle de votre formation par Pôle Emploi selon votre projet professionnel",
    },
    {
      label: 'AFPR / POE',
      text: "Formation préalable au recrutement pour adapter vos compétences à une offre d'emploi",
    },
  ],
};

/**
 * Autres solutions de financement
 */
export const autresSolutions = {
  titre: 'Autres solutions',
  columns: [
    {
      label: 'Financement personnel',
      text: 'Facilités de paiement en plusieurs fois sans frais',
    },
    {
      label: 'Conseil régional',
      text: 'Aides spécifiques selon votre région',
    },
    {
      label: 'Agefiph',
      text: 'Financement pour les personnes en situation de handicap',
    },
  ],
};

export const questionsOrientees = {
  titre: "Quel financement est fait pour vous ?",
  description: "Sélectionnez votre situation actuelle pour découvrir les dispositifs les plus adaptés à votre profil.",
  items: [
    {
      q: "Je suis salarié(e) en poste",
      a: "Vous pouvez mobiliser votre CPF en toute autonomie. Si la formation répond à un besoin de l'entreprise, sollicitez le Plan de Développement des Compétences via votre OPCO."
    },
    {
      q: "Je suis demandeur d'emploi",
      a: "Votre CPF est utilisable. De plus, France Travail (Pôle Emploi) peut financer tout ou partie de votre formation via l'AIF ou une action préalable au recrutement (AFPR/POE)."
    },
    {
      q: "Je suis employeur / RH",
      a: "Votre OPCO est votre interlocuteur privilégié. Il permet de financer les contrats d'alternance, de bénéficier d'aides au tutorat et de financer les formations collectives."
    },
    {
      q: "Je suis travailleur indépendant",
      a: "Vous dépendez d'un Fonds d'Assurance Formation (FAF) défini selon votre secteur (FIF PL, AGEFICE...). Votre CPF est également alimenté chaque année pour vos projets."
    }
  ]
};