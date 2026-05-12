/**
 * authData.js - Données pour la page d'inscription Alt Formations
 */

export const registerData = {
  header: {
    title: "Alt Formations",
    subtitle: "Créez votre compte pour accéder à nos formations"
  },
  sections: {
    personal: "Informations personnelles",
    contact: "Coordonnées",
    security: "Sécurité"
  },
  fields: {
    firstName: { label: "Prénom *", placeholder: "Jean" },
    lastName: { label: "Nom *", placeholder: "Dupont" },
    email: { label: "Adresse email *", placeholder: "nom@exemple.com" },
    phone: { label: "Téléphone *", placeholder: "06 12 34 56 78" },
    password: { 
      label: "Mot de passe *", 
      placeholder: "••••••••",
      hint: "Minimum 8 caractères avec majuscules, minuscules et chiffres"
    },
    confirmPassword: { label: "Confirmer le mot de passe *", placeholder: "••••••••" }
  },
  legal: {
    text: "J'accepte les",
    cgu: "conditions générales d'utilisation",
    privacy: "politique de confidentialité",
    linkText: "et la"
  },
  buttons: {
    submit: "Créer mon compte",
    google: "S'inscrire avec Google",
    linkedin: "S'inscrire avec LinkedIn",
    or: "OU"
  },
  footer: {
    hasAccount: "Vous avez déjà un compte ?",
    loginLink: "Se connecter",
    backHome: "← Retour à l'accueil"
  }
};