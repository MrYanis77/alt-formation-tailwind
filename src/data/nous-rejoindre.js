/**
 * nous-rejoindre.js - Source unique de données pour la page recrutement
 */

export const dataNousRejoindre = {
    collaborateur: {
        hero: {
            titre: "Rejoignez l'équipe Alt Formations",
            sousTitre: "Développez votre carrière au sein d'un organisme en pleine croissance.",
            video: "public/Assets/video/nous-rejoindre.mp4",
        },
        pourquoiNousRejoindre: {
            titre: "Pourquoi rejoindre ALT FORMATIONS ?",
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
                { id: 1, poste: "Chargé(e) de Communication", type: "CDI", lieu: "Paris", date: "26 Mars 2026" },
                { id: 2, poste: "Responsable Admissions", type: "CDI", lieu: "Lyon", date: "20 Mars 2026" },
                { id: 3, poste: "Assistant(e) Pédagogique", type: "CDD", lieu: "Paris", date: "15 Mars 2026" },
                { id: 4, poste: "Conseiller en Formation", type: "CDI", lieu: "Bordeaux", date: "10 Mars 2026" }
            ]
        },
        sectionEquipe: {
            titre: "Rejoignez une équipe passionnée",
            paragraphe1: "Chez ALT FORMATIONS, nous croyons que la force d'une entreprise réside dans ses collaborateurs.",
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
            video: "https://assets.mixkit.co/videos/preview/mixkit-group-of-designers-working-on-a-project-43277-large.mp4",
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
                { id: 1, poste: "Formateur Cybersécurité", type: "Freelance", lieu: "Paris / Remote", date: "25 Mars 2026" },
                { id: 2, poste: "Intervenant Management", type: "Freelance", lieu: "Lyon", date: "22 Mars 2026" },
                { id: 3, poste: "Formateur RH", type: "CDD", lieu: "Toulouse", date: "18 Mars 2026" }
            ]
        },
        sectionEquipe: {
            titre: "Accompagner la réussite",
            paragraphe1: "Nos formateurs sont des mentors qui préparent les élèves au monde réel.",
            paragraphe2: "Nous vous accompagnons dans la création de vos supports.",
            stats: [
                { label: "Formateurs experts", valeur: "80+" },
                { label: "Taux de réussite", valeur: "95%" }
            ]
        }
    }
};