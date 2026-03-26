/**
 * formation-cyber.js — Données complètes de la formation Expert en Cybersécurité
 */

export const cybersecuriteData = {
  // Image 1 : Hero Section
  hero: {
    badge: "Formation Bac+5",
    titre: "Expert en Cybersécurité",
    description: "Devenez un expert recherché dans la protection des systèmes d'information et la lutte contre les cybermenaces",
    actions: [
      { label: "Candidater maintenant", primary: true },
      { label: "Télécharger la brochure", primary: false }
    ]
  },

  // Image 2 : Chiffres clés (Stats)
  stats: [
    { label: "Durée de formation", valeur: "18 mois", icon: "clock" },
    { label: "Niveau de sortie", valeur: "Bac+5", icon: "medal" },
    { label: "Taux d'employabilité", valeur: "95%", icon: "users" },
    { label: "Salaire annuel moyen", valeur: "45-80k€", icon: "trend" }
  ],

  // Image 3 : Présentation
  presentation: {
    titre: "Qu'est-ce que la Cybersécurité ?",
    paragraphes: [
      "La cybersécurité est l'ensemble des moyens techniques, organisationnels, juridiques et humains nécessaires à la protection des données et des systèmes d'information contre les menaces numériques.",
      "Face à la multiplication des cyberattaques (ransomwares, phishing, violations de données), les experts en cybersécurité sont devenus indispensables pour protéger les entreprises, les institutions et les particuliers.",
      "Ce métier combine expertise technique, analyse stratégique et veille permanente sur les nouvelles menaces."
    ]
  },

  // Image 4 : Débouchés
  debouches: {
    titre: "Les débouchés professionnels",
    sousTitre: "Un secteur en forte croissance avec des opportunités variées",
    postes: [
      { titre: "Expert en Cybersécurité", salaire: "45 000€ - 80 000€/an" },
      { titre: "Responsable de la Sécurité des Systèmes d'Information (RSSI)", salaire: "60 000€ - 100 000€/an" },
      { titre: "Analyse SOC (Security Operations Center)", salaire: "35 000€ - 55 000€/an" },
      { titre: "Pentester / Ethical Hacker", salaire: "40 000€ - 70 000€/an" },
      { titre: "Consultant en Cybersécurité", salaire: "45 000€ - 85 000€/an" },
      { titre: "Architecte Sécurité", salaire: "55 000€ - 90 000€/an" }
    ],
    secteurs: "Banque et finance, santé, télécommunications, e-commerce, industrie, administration publique, conseil en cybersécurité, éditeurs de logiciels..."
  },

  // Image 5 : Programme
  programme: {
    titre: "Programme de la formation",
    dureeTotale: "18 mois de formation intensive pour devenir expert",
    modules: [
      { id: 1, titre: "Fondamentaux de la cybersécurité", duree: "2 mois" },
      { id: 2, titre: "Sécurité des réseaux et infrastructure", duree: "3 mois" },
      { id: 3, titre: "Tests d'intrusion et ethical hacking", duree: "3 mois" },
      { id: 4, titre: "Cryptographie et protection des données", duree: "2 mois" },
      { id: 5, titre: "Gestion des incidents et réponse", duree: "2 mois" },
      { id: 6, titre: "Projet professionnel et stage", duree: "6 mois" }
    ]
  },

  // Image 6 : Modalités & Prérequis
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
        "Bac+3 en informatique ou équivalent",
        "Bases en programmation et réseaux",
        "Motivation et curiosité technique",
        "Bon niveau d'anglais technique"
      ]
    }
  },

  // Image 7 : Compétences
  competences: [
    "Sécurité des réseaux et systèmes",
    "Cryptographie et chiffrement",
    "Tests d'intrusion et audit de sécurité",
    "Gestion des incidents de sécurité",
    "Analyse de vulnérabilités",
    "Conformité et normes (ISO 27001, RGPD)",
    "Programmation (Python, C++, JavaScript)",
    "Administration Linux/Windows"
  ],

  // Image 8 : CTA Final
  ctaFinal: {
    titre: "Prêt à devenir expert en Cybersécurité ?",
    sousTitre: "Rejoignez notre prochaine promotion et lancez votre carrière dans un secteur d'avenir",
    boutons: [
      { label: "Candidater maintenant", style: "white" },
      { label: "Demander un rendez-vous", style: "dark" }
    ]
  }
};