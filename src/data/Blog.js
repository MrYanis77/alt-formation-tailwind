/**
 * blogData.js - Données extraites des maquettes pour la section Actualités / Blog
 */

export const hero= {
  titre: "Blog",
  sousTitre: "Actualités, conseils et tendances du monde de la formation professionnelle",
};

// 1. Liste des catégories pour les filtres (image_a607a6.png)
export const categories = [
  "Tous",
  "Cybersécurité",
  "Financement",
  "Formations",
  "Management",
  "Conseils",
  "Digital"
];

// 2. Liste des articles de blog (exemple basé sur image_a607c5.png)
export const blogPosts = [
  {
    id: 1,
    image: "/images/blog/cyber-security-2026.jpg", // Correspond au placeholder "cyber"
    category: "Cybersécurité",
    title: "Les métiers de la cybersécurité en 2026 : perspectives et opportunités",
    excerpt: "Découvrez les tendances du marché de la cybersécurité et les compétences les plus recherchées par les recruteurs cette année.",
    author: "Sophie Martin",
    date: "15 Mars 2026",
    link: "/blog/metiers-cybersecurite-2026"
  },
  // Tu peux ajouter d'autres objets ici pour tester ta grille
  {
    id: 2,
    image: "/images/blog/financement-formation.jpg",
    category: "Financement",
    title: "Comment financer sa reconversion professionnelle en 2026 ?",
    excerpt: "Le point complet sur les dispositifs CPF, OPCO et aides régionales disponibles pour booster votre carrière.",
    author: "Jean Dupont",
    date: "10 Mars 2026",
    link: "/blog/financement-formation"
  }
];

// 3. Données de la section Newsletter (image_a607e5.png)
export const newsletterData = {
  title: "Restez informé",
  subtitle: "Inscrivez-vous à notre newsletter pour recevoir nos derniers articles et actualités",
  placeholder: "Votre adresse email",
  buttonText: "S'inscrire"
};

// 4. Données de pagination (image_a6007d.png du message précédent)
export const paginationData = {
  currentPage: 1,
  totalPages: 3,
  prevLabel: "Précédent",
  nextLabel: "Suivant"
};