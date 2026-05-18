/**
 * contact.js — Données de la page Contact
 */

export const hero = {
  titre: "Contactez-nous",
  sousTitre: "Notre équipe est à votre écoute pour répondre à toutes vos questions",
  video: "/assets/video/contact.mp4",
};

export const contactData = {
  coordonnees: {
    titre: "Nos coordonnées",
    items: [
      {
        type: "Téléphone",
        valeur: "01 60 43 94 30",
        icon: "📞"
      },
      {
        type: "Email",
        valeur: "formations@alt-rh.com",
        icon: "✉️"
      },
      {
        type: "Adresse",
        // Utilisation de \n pour marquer le saut de ligne
        valeur: "3 rue du cochet, 77700 Bailly-Romainvilliers\n2-4 boulevard Michaël Faraday, 77700 Serris",
        icon: "📍"
      }
    ]
  },
  // Section Horaires
  horaires: {
    titre: "Horaires d'ouverture",
    jours: [
      { label: "Lundi - Vendredi", heures: "9h00 - 18h00" },
    ]
  },
  // Formulaire de message
  formulaire: {
    titre: "Envoyez-nous un message",
    champs: {
      nom: "Nom *",
      prenom: "Prénom *",
      email: "Email *",
      telephone: "Téléphone",
      sujet: "Sujet *",
      message: "Message *"
    },
    boutonLabel: "Envoyer le message"
  }
};

