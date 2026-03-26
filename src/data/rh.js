/**
 * rh.js — Données complètes de la formation Ressources Humaines
 */

export const rhData = {
  // Image : Hero Section
  hero: {
    badge: "Formations Bac+3 à Bac+5",
    titre: "Ressources Humaines",
    description: "Développez vos compétences en gestion du capital humain et devenez un acteur stratégique du développement des entreprises",
    actions: [
      { label: "Candidater maintenant", primary: true },
      { label: "Télécharger la brochure", primary: false }
    ]
  },

  // Image : Chiffres clés (Stats)
  stats: [
    { label: "Durée de formation", valeur: "18 mois", icon: "clock" },
    { label: "Niveau de sortie", valeur: "Bac+3/+5", icon: "medal" },
    { label: "Taux d'employabilité", valeur: "94%", icon: "users" },
    { label: "Salaire annuel moyen", valeur: "32-65k€", icon: "trend" }
  ],

  // Image : Présentation
  presentation: {
    titre: "Qu'est-ce que les Ressources Humaines ?",
    paragraphes: [
      "Les ressources humaines désignent l'ensemble des collaborateurs d'une organisation, mais aussi la fonction qui consiste à gérer ce capital humain de manière stratégique.",
      "Le rôle des RH a considérablement évolué, passant d'une gestion purement administrative à une fonction centrale qui accompagne la transformation des entreprises, le développement des talents et le bien-être au travail.",
      "Ce métier combine des compétences juridiques, psychologiques, sociales et stratégiques pour harmoniser les besoins de l'entreprise avec les aspirations des salariés."
    ]
  },

  // Image : Débouchés
  debouches: {
    titre: "Les débouchés professionnels",
    sousTitre: "Un métier indispensable au cœur de toutes les organisations",
    postes: [
      { titre: "Chargé de Recrutement", salaire: "30 000€ - 45 000€/an" },
      { titre: "Responsable des Ressources Humaines (RRH)", salaire: "45 000€ - 70 000€/an" },
      { titre: "Gestionnaire de Paie", salaire: "28 000€ - 42 000€/an" },
      { titre: "Responsable Formation", salaire: "35 000€ - 55 000€/an" },
      { titre: "Consultant en RH", salaire: "35 000€ - 65 000€/an" },
      { titre: "Directeur des Ressources Humaines (DRH)", salaire: "70 000€ - 120 000€/an" }
    ],
    secteurs: "Toutes les entreprises (PME, grands groupes), cabinets de recrutement, agences d'intérim, cabinets de conseil, secteur public, associations..."
  },

  // Image : Programme
  programme: {
    titre: "Programme de la formation",
    dureeTotale: "18 mois de formation spécialisée pour devenir un expert RH",
    modules: [
      { id: 1, titre: "Droit du travail et relations sociales", duree: "3 mois" },
      { id: 2, titre: "Recrutement et gestion des talents", duree: "3 mois" },
      { id: 3, titre: "Gestion de la paie et administration", duree: "2 mois" },
      { id: 4, titre: "Management et communication interne", duree: "2 mois" },
      { id: 5, titre: "Stratégie RH et transformation digitale", duree: "2 mois" },
      { id: 6, titre: "Projet professionnel et stage", duree: "6 mois" }
    ]
  },

  // Image : Modalités & Prérequis
  infosPratiques: {
    modalites: {
      titre: "Modalités",
      points: [
        "Formation en alternance possible",
        "Cours en présentiel + e-learning",
        "Certifications professionnelles incluses",
        "Stage de 6 mois en entreprise"
      ]
    },
    prerequis: {
      titre: "Prérequis",
      points: [
        "Bac+2 minimum ou expérience professionnelle",
        "Sens de l'écoute et bon relationnel",
        "Rigueur et sens de l'organisation",
        "Intérêt pour les relations humaines et le droit"
      ]
    }
  },

  // Image : Compétences
  competences: [
    "Maîtrise du droit du travail et social",
    "Gestion du processus de recrutement",
    "Élaboration et suivi de la paie",
    "Gestion prévisionnelle des emplois (GPEC)",
    "Animation du dialogue social",
    "Conduite d'entretiens professionnels",
    "Pilotage de la communication interne",
    "Maîtrise des logiciels SIRH"
  ],

  // Image : CTA Final
  ctaFinal: {
    titre: "Prêt à lancer votre carrière en Ressources Humaines ?",
    sousTitre: "Rejoignez notre prochaine promotion et devenez un expert du capital humain",
    boutons: [
      { label: "Candidater maintenant", style: "white" },
      { label: "Demander un rendez-vous", style: "dark" }
    ]
  }
};