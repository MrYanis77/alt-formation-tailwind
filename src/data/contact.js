/**
 * contact.js — Données de la page Contact
 */

export const hero = {
  titre: "Contactez-nous",
  sousTitre: "Notre équipe est à votre écoute pour répondre à toutes vos questions",
  video: "public/Assets/video/contact.mp4",
};

export const contactData = {
  // Section Coordonnées
  coordonnees: {
    titre: "Nos coordonnées",
    items: [
      {
        type: "Téléphone",
        valeur: "01 23 45 67 89",
        icon: "📞"
      },
      {
        type: "Email",
        valeur: "yanislaldjipro@gmail.com",
        icon: "✉️"
      },
      {
        type: "Adresse",
        valeur: "3 rue du cochet 77700 Baily-Romainvilliers",
        icon: "📍"
      }
    ]
  },
  // Section Horaires
  horaires: {
    titre: "Horaires d'ouverture",
    jours: [
      { label: "Lundi - Vendredi", heures: "9h00 - 18h00" },
      { label: "Samedi", heures: "Fermé" },
      { label: "Dimanche", heures: "Fermé" }
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