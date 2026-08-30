/**
 * nous-rejoindre.js - Source unique de données pour la page recrutement
 */

export const dataNousRejoindre = {
    collaborateur: {
        hero: {
            titre: "Rejoignez l'équipe Alt RH Formations",
            sousTitre: "Développez votre carrière au sein d'un organisme en pleine croissance.",
            video: "/assets/video/nous-rejoindre.mp4",
        },
        pourquoiNousRejoindre: {
            titre: "Pourquoi rejoindre Alt RH Formations ?",
            sousTitre: "Intégrez une entreprise dynamique, innovante et humaine.",
            valeurs: [
                { id: 1, titre: "Ambiance conviviale", description: "Un environnement bienveillant et solidaire." },
                { id: 2, titre: "Évolution professionnelle", description: "Des opportunités réelles de montée en compétences." },
                { id: 3, titre: "Projets innovants", description: "Participez au futur de la formation digitale." }
            ]
        },
        avantages: [
            { id: 1, label: "Tickets restaurant", icone: "coffee" },
            { id: 2, label: "Télétravail possible", icone: "laptop" },
            { id: 3, label: "Formations continues", icone: "graduation-cap" },
            { id: 4, label: "Mutuelle santé", icone: "medal" }
        ],
        offres: {
            titre: "Postes ouverts - Collaborateurs",
            compteur: "4 offres disponibles",
            list: [
                {
                    id: 1,
                    slug: "charge-communication",
                    poste: "Chargé de Communication",
                    type: "CDI",
                    lieu: "Paris",
                    date: "26 Mars 2026",
                    short_description: "Renforcez la visibilité d'Alt RH Formations auprès de nos publics professionnels et institutionnels.",
                    full_description: "Au sein de l'équipe marketing & communication, vous pilotez la stratégie de contenu (web, réseaux sociaux, newsletters) et coordonnez les campagnes de notoriété. Vous travaillez en lien étroit avec les équipes pédagogiques et commerciales pour valoriser nos parcours certifiants.\n\nMissions principales :\n• Définir et déployer le calendrier éditorial\n• Produire et faire produire des contenus adaptés à nos cibles\n• Analyser les performances et proposer des optimisations\n• Participer aux événements et salons professionnels\n\nProfil recherché : expérience en communication B2B ou formation professionnelle, excellente expression écrite, autonomie et sens du relationnel."
                },
                {
                    id: 2,
                    slug: "responsable-admissions",
                    poste: "Responsable Admissions",
                    type: "CDI",
                    lieu: "Lyon",
                    date: "20 Mars 2026",
                    short_description: "Accompagnez les candidats de la première prise de contact jusqu'à l'inscription en formation.",
                    full_description: "Vous managez le parcours d'admission des apprenants : accueil, conseil, montage des dossiers de financement et suivi administratif. Vous garantissez une expérience fluide et professionnelle à chaque étape.\n\nMissions principales :\n• Piloter l'équipe admissions et les objectifs de conversion\n• Conseiller les candidats sur les parcours adaptés à leur projet\n• Coordonner les dossiers CPF, OPCO, France Travail et entreprises\n• Améliorer les process et outils CRM\n\nProfil recherché : expérience en admissions ou conseil en formation, leadership, rigueur administrative et orientation client."
                },
                {
                    id: 3,
                    slug: "assistant-pedagogique",
                    poste: "Assistant Pédagogique",
                    type: "CDD",
                    lieu: "Paris",
                    date: "15 Mars 2026",
                    short_description: "Soutenez le déploiement opérationnel des sessions de formation en présentiel et à distance.",
                    full_description: "Vous assistez les responsables pédagogiques dans l'organisation logistique des formations : planning, salles, supports, suivi des présences et relances apprenants.\n\nMissions principales :\n• Préparer les sessions (convocations, supports, accès plateforme)\n• Accueillir les apprenants et assurer le bon déroulement des cours\n• Suivre les émargements et la satisfaction\n• Contribuer à l'amélioration continue des parcours\n\nProfil recherché : organisation, sens du service, aisance relationnelle ; une première expérience en organisme de formation est un plus."
                },
                {
                    id: 4,
                    slug: "conseiller-formation",
                    poste: "Conseiller en Formation",
                    type: "CDI",
                    lieu: "Bordeaux",
                    date: "10 Mars 2026",
                    short_description: "Guidez les professionnels vers le parcours certifiant le plus adapté à leur projet.",
                    full_description: "En tant que conseiller·ère, vous analysez les besoins des prospects (reconversion, montée en compétences, certification) et proposez des solutions de financement adaptées.\n\nMissions principales :\n• Réaliser des entretiens de positionnement et de diagnostic\n• Présenter le catalogue et les débouchés métiers\n• Monter les dossiers de prise en charge\n• Assurer le suivi jusqu'à la signature\n\nProfil recherché : excellente écoute, connaissance du marché de la formation professionnelle, goût du challenge commercial éthique."
                }
            ]
        },
        sectionEquipe: {
            titre: "Rejoignez une équipe passionnée",
            paragraphe1: "Chez Alt RH Formations, nous croyons que la force d'une entreprise réside dans ses collaborateurs.",
            paragraphe2: "Nous avons une place pour vous dans notre équipe.",
            stats: [
                { label: "Collaborateurs", valeur: "50+" },
                { label: "Campus", valeur: "8" }
            ]
        }
    },
    formateur: {
        hero: {
            titre: "Devenez Intervenant Expert",
            sousTitre: "Partagez votre savoir-faire et formez les talents de demain.",
            video: "/assets/video/intervenant.mp4",
        },
        pourquoiNousRejoindre: {
            titre: "Transmettez votre expertise",
            sousTitre: "Nous recherchons des passionnés pour animer nos parcours certifiants.",
            valeurs: [
                { id: 1, titre: "Liberté Pédagogique", description: "Apportez votre expérience terrain à nos programmes." },
                { id: 2, titre: "Réseau d'Experts", description: "Intégrez une communauté hautement qualifiée." },
                { id: 3, titre: "Outils Modernes", description: "Accédez à des plateformes e-learning de pointe." }
            ]
        },
        avantages: [
            { id: 1, label: "Planning flexible", icone: "clock" },
            { id: 2, label: "Rémunération attractive", icone: "briefcase" },
            { id: 3, label: "Support pédagogique", icone: "book" },
            { id: 4, label: "Locaux modernes", icone: "map-pin" }
        ],
        offres: {
            titre: "Postes ouverts - Formateurs",
            compteur: "3 thématiques recherchées",
            list: [
                {
                    id: 1,
                    slug: "formateur-cybersecurite",
                    poste: "Formateur Cybersécurité",
                    type: "Freelance",
                    lieu: "Paris / Remote",
                    date: "25 Mars 2026",
                    short_description: "Animez nos parcours certifiants en cybersécurité auprès de professionnels en reconversion ou en montée en compétences.",
                    full_description: "Vous intervenez sur des modules techniques (réseaux, sécurité offensive/défensive, conformité) en présentiel ou distanciel. Vous contribuez à la mise à jour des contenus pédagogiques avec l'équipe Alt RH Formations.\n\nProfil recherché : expert·e cybersécurité avec expérience de formation adultes, certifications appréciées (CISSP, CEH, etc.), pédagogie active."
                },
                {
                    id: 2,
                    slug: "intervenant-management",
                    poste: "Intervenant Management",
                    type: "Freelance",
                    lieu: "Lyon",
                    date: "22 Mars 2026",
                    short_description: "Transmettez vos méthodes de management et de conduite du changement à nos apprenants.",
                    full_description: "Vous animez des sessions sur le management d'équipe, la gestion de projet agile et les soft skills managériales. Missions ponctuelles ou récurrentes selon votre disponibilité.\n\nProfil recherché : manager confirmé ou consultant RH/management, expérience en facilitation de groupes, capacité à ancrer la théorie dans des cas concrets."
                },
                {
                    id: 3,
                    slug: "formateur-rh",
                    poste: "Formateur RH",
                    type: "CDD",
                    lieu: "Toulouse",
                    date: "18 Mars 2026",
                    short_description: "Formez aux métiers des ressources humaines : paie, droit social, recrutement et GPEC.",
                    full_description: "Vous dispensez des modules du titre professionnel et des formations courtes RH. Vous participez aux évaluations et à l'accompagnement des apprenants en situation professionnelle simulée.\n\nProfil recherché : praticien·ne RH (DRH, responsable formation, gestionnaire paie) avec solide expérience terrain et appétence pédagogique."
                }
            ]
        },
        sectionEquipe: {
            titre: "Accompagner la réussite",
            paragraphe1: "Nos formateurs sont des mentors qui préparent les élèves au monde réel.",
            paragraphe2: "Nous vous accompagnons dans la création de vos supports.",
            stats: [
                { label: "Formateurs experts", valeur: "180+" },
                { label: "Taux de réussite", valeur: "95%" }
            ]
        }
    }
};

