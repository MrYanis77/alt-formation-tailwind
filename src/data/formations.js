/**
 * formations.js — Données du catalogue formations
 * Source de vérité unique consommée par FormationsPage.jsx
 *
 * Structure :
 *   id       {string} — ancre HTML de la catégorie
 *   label    {string} — titre de la catégorie
 *   items[]  {Object} — formations : titre + features (3 bullets)
 */

export const hero = {
  titre: "Nos formations",
  sousTitre: "Des parcours certifiants adaptés à vos ambitions professionnelles",
};

export const catalogue = [
  {
    id: 'cybersecurite',
    label: 'Cybersécurité',
    items: [
      {
        titre: 'Expert en Cybersécurité (Bac+5)',
        features: [
          'Certification professionnelle reconnue',
          'Formateurs experts du secteur',
          'Plateforme e-learning accessible 24/7',
        ],
      },
      {
        titre: 'Administrateur Systèmes & Réseaux',
        features: [
          'Certification professionnelle reconnue',
          'Formateurs experts du secteur',
          'Plateforme e-learning accessible 24/7',
        ],
      },
      {
        titre: 'Analyste SOC',
        features: [
          'Certification professionnelle reconnue',
          'Formateurs experts du secteur',
          'Plateforme e-learning accessible 24/7',
        ],
      },
      {
        titre: 'Pentester & Ethical Hacking',
        features: [
          'Certification professionnelle reconnue',
          'Formateurs experts du secteur',
          'Plateforme e-learning accessible 24/7',
        ],
      },
    ],
  },
  {
    id: 'management',
    label: 'Management',
    items: [
      {
        titre: "Manager d'Équipe (Bac+3)",
        features: [
          'Certification professionnelle reconnue',
          'Formateurs experts du secteur',
          'Plateforme e-learning accessible 24/7',
        ],
      },
      {
        titre: 'Manager de Projet (Bac+5)',
        features: [
          'Certification professionnelle reconnue',
          'Formateurs experts du secteur',
          'Plateforme e-learning accessible 24/7',
        ],
      },
      {
        titre: "Leadership & Gestion d'équipe",
        features: [
          'Certification professionnelle reconnue',
          'Formateurs experts du secteur',
          'Plateforme e-learning accessible 24/7',
        ],
      },
      {
        titre: 'Management agile',
        features: [
          'Certification professionnelle reconnue',
          'Formateurs experts du secteur',
          'Plateforme e-learning accessible 24/7',
        ],
      },
    ],
  },
  {
    id: 'ressources-humaines',
    label: 'Ressources Humaines',
    items: [
      {
        titre: 'Responsable RH (Bac+5)',
        features: [
          'Certification professionnelle reconnue',
          'Formateurs experts du secteur',
          'Plateforme e-learning accessible 24/7',
        ],
      },
      {
        titre: 'Chargé de Recrutement',
        features: [
          'Certification professionnelle reconnue',
          'Formateurs experts du secteur',
          'Plateforme e-learning accessible 24/7',
        ],
      },
      {
        titre: 'Gestionnaire de Paie',
        features: [
          'Certification professionnelle reconnue',
          'Formateurs experts du secteur',
          'Plateforme e-learning accessible 24/7',
        ],
      },
      {
        titre: 'GPEC & Développement des compétences',
        features: [
          'Certification professionnelle reconnue',
          'Formateurs experts du secteur',
          'Plateforme e-learning accessible 24/7',
        ],
      },
    ],
  },
  {
    id: 'digital',
    label: 'Digital & Marketing',
    items: [
      {
        titre: 'Chef de Projet Digital',
        features: [
          'Certification professionnelle reconnue',
          'Formateurs experts du secteur',
          'Plateforme e-learning accessible 24/7',
        ],
      },
      {
        titre: 'Community Manager',
        features: [
          'Certification professionnelle reconnue',
          'Formateurs experts du secteur',
          'Plateforme e-learning accessible 24/7',
        ],
      },
      {
        titre: 'Traffic Manager',
        features: [
          'Certification professionnelle reconnue',
          'Formateurs experts du secteur',
          'Plateforme e-learning accessible 24/7',
        ],
      },
      {
        titre: 'Data Analyst',
        features: [
          'Certification professionnelle reconnue',
          'Formateurs experts du secteur',
          'Plateforme e-learning accessible 24/7',
        ],
      },
    ],
  },
];
