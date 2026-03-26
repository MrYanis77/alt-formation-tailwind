/**
 * manager.js — Données complètes de la formation Management
 */

export const managementData = {
  // Image 1 : Hero Section
  hero: {
    badge: "Formations Bac+3 à Bac+5", //
    titre: "Management", //
    description: "Développez vos compétences en leadership et devenez un manager capable de piloter des équipes et des projets avec succès", //
    actions: [
      { label: "Candidater maintenant", primary: true }, //
      { label: "Télécharger la brochure", primary: false } //
    ]
  },

  // Image 2 : Chiffres clés (Stats)
  stats: [
    { label: "Durée de formation", valeur: "18 mois", icon: "clock" }, //
    { label: "Niveau de sortie", valeur: "Bac+3/+5", icon: "medal" }, //
    { label: "Taux d'employabilité", valeur: "92%", icon: "users" }, //
    { label: "Salaire annuel moyen", valeur: "35-80k€", icon: "trend" } //
  ],

  // Image 3 : Présentation
  presentation: {
    titre: "Qu'est-ce que le Management ?", //
    paragraphes: [
      "Le management est l'art de diriger, coordonner et optimiser les ressources humaines et matérielles d'une organisation pour atteindre ses objectifs stratégiques et opérationnels.", //
      "Dans un environnement professionnel en constante évolution, les managers jouent un rôle essentiel dans la motivation des équipes, la gestion des projets complexes et l'adaptation aux changements organisationnels.", //
      "Ce métier combine leadership, communication, vision stratégique et capacité à mobiliser les talents pour transformer les défis en opportunités de croissance et d'innovation." //
    ]
  },

  // Image 4 : Débouchés
  debouches: {
    titre: "Les débouchés professionnels", //
    sousTitre: "Des opportunités de carrière dans tous les secteurs d'activité", //
    postes: [
      { titre: "Manager d'Équipe", salaire: "35 000€ - 55 000€/an" }, //
      { titre: "Chef de Projet", salaire: "40 000€ - 65 000€/an" }, //
      { titre: "Directeur de Département", salaire: "50 000€ - 80 000€/an" }, //
      { titre: "Consultant en Management", salaire: "45 000€ - 75 000€/an" }, //
      { titre: "Responsable Opérationnel", salaire: "40 000€ - 70 000€/an" }, //
      { titre: "Directeur Général Adjoint", salaire: "60 000€ - 100 000€/an" } //
    ],
    secteurs: "Industrie, services, retail, banque, assurance, conseil, santé, fonction publique, associations, startups, grands groupes..." //
  },

  // Image 5 : Programme
  programme: {
    titre: "Programme de la formation", //
    dureeTotale: "18 mois de formation complète pour devenir un manager performant", //
    modules: [
      { id: 1, titre: "Fondamentaux du management", duree: "2 mois" }, //
      { id: 2, titre: "Leadership et communication managériale", duree: "3 mois" }, //
      { id: 3, titre: "Gestion de projet et méthodes agiles", duree: "3 mois" }, //
      { id: 4, titre: "Management stratégique et pilotage", duree: "2 mois" }, //
      { id: 5, titre: "Conduite du changement et innovation", duree: "2 mois" }, //
      { id: 6, titre: "Projet professionnel et stage", duree: "6 mois" } //
    ]
  },

  // Image 6 : Modalités & Prérequis
  infosPratiques: {
    modalites: {
      titre: "Modalités", //
      points: [
        "Formation en alternance possible", //
        "Cours en présentiel + e-learning", //
        "Certifications professionnelles incluses", //
        "Stage de 6 mois en entreprise" //
      ]
    },
    prerequis: {
      titre: "Prérequis", //
      points: [
        "Bac+2 minimum ou expérience professionnelle", //
        "Qualités relationnelles et leadership", //
        "Capacité d'organisation et de gestion", //
        "Motivation et esprit d'équipe" //
      ]
    }
  },

  // Image 7 : Compétences
  competences: [
    "Leadership et motivation d'équipe", //
    "Gestion de projet (Agile, Scrum, Prince2)", //
    "Communication interpersonnelle", //
    "Gestion des conflits et médiation", //
    "Pilotage de la performance", //
    "Management stratégique", //
    "Conduite du changement", //
    "Prise de décision et résolution de problèmes" //
  ],

  // Image 8 : CTA Final
  ctaFinal: {
    titre: "Prêt à devenir un manager d'excellence ?", //
    sousTitre: "Rejoignez notre prochaine promotion et développez votre leadership", //
    boutons: [
      { label: "Candidater maintenant", style: "white" }, //
      { label: "Demander un rendez-vous", style: "dark" } //
    ]
  }
};