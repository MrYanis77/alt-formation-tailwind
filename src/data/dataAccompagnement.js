/**
 * dataAccompagnement.js — Données de la page Hub (Choix de l'accompagnement)
 */

export const heroHub = {
    titre: "Votre réussite professionnelle",
    sousTitre: "Découvrez nos solutions personnalisées pour propulser votre carrière ou décrocher votre prochain emploi.",
    video: "/assets/video/creation_tableau.mp4",
};

export const parcours = {
    titreSection: "Quel est votre objectif aujourd'hui ?",
    descriptionSection: "Sélectionnez le parcours qui correspond le mieux à votre situation actuelle pour découvrir comment nous pouvons vous aider.",

    // Carte 1 : Gestion de Carrière
    gestionCarriere: {
        titre: "Gestion de Carrière",
        tagline: "Faites le point et donnez une nouvelle direction à votre vie professionnelle.",
        description: "Un accompagnement en profondeur pour analyser vos compétences, définir vos envies et construire un projet professionnel qui vous ressemble vraiment.",
        icon: "compass",
        benefices: [
            "Faire un bilan complet de vos compétences",
            "Définir un projet de reconversion",
            "Retrouver du sens dans votre travail",
            "Préparer une évolution en interne"
        ],
        ctaLabel: "Découvrir la gestion de carrière",
        ctaUrl: "/gestion-carrieres",
        couleur: "primary"
    },

    // Carte 2 : Coaching Emploi
    coachingEmploi: {
        titre: "Coaching Emploi",
        tagline: "Accélérez votre recherche et décrochez le poste idéal.",
        description: "Un accompagnement tactique et opérationnel pour optimiser vos outils (CV, LinkedIn), réussir vos entretiens et convaincre les recruteurs.",
        icon: "rocket",
        benefices: [
            "Refonte de votre CV et profil LinkedIn",
            "Simulation et préparation aux entretiens",
            "Définition d'une stratégie de recherche",
            "Accompagnement individuel ou collectif"
        ],
        ctaLabel: "Voir les formules coaching",
        ctaUrl: "/coaching-emploi",
        couleur: "accent"
    }
};

