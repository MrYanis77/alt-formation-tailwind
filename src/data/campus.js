// Données de campus pour l'application Alt Formations
// Chaque objet contient les informations de localisation et d'affichage
// `images` : galerie lightbox (optionnel — sinon `image` est utilisée comme unique slide)

/**
 * URLs pour la lightbox campus.
 * @param {{ image?: string, images?: string[] }} item
 * @returns {string[]}
 */
export function getCampusGalleryImages(item) {
  if (Array.isArray(item.images) && item.images.length > 0) {
    return item.images.filter(Boolean);
  }
  return item.image ? [item.image] : [];
}

export const hero = {
  titre: "Nos Campus",
  sousTitre: "Retrouvez-nous dans toute l'Île-de-France. Des infrastructures modernes au service de votre réussite.",
  video: "/assets/video/campus.mp4"
};

export const campus = [
  {
    id: "paris-la-defense",
    nom: "Paris La Défense",
    adresse: "Tour Égée, 9/11 allée de l'arche, 92400 Courbevoie",
    mail: "formations@altformations.fr",
    image: "/assets/images/campus/img2.jpeg",
    images: [
      "/assets/images/campus/img2.jpeg",
      "/assets/images/campus/img11.jpeg",
    ],
    mapLink: "https://maps.app.goo.gl/k9roCdPP5f8ZapFx8",
  },
  {
    id: "montevrain",
    nom: "Montévrain",
    adresse: "Regus Neos Building, 77144 Montévrain",
    mail: "formations@altformations.fr",
    image: "/assets/images/campus/img3.jpeg",
    mapLink: "https://maps.app.goo.gl/2BL4KnpHoajwjoNK6",
  },
  {
    id: "noisiel",
    nom: "Noisiel",
    adresse: "6 Rue de la Mare Blanche, 77186 Noisiel",
    mail: "formations@altformations.fr",
    image: "/assets/images/campus/img4.jpeg",
    mapLink: "https://maps.app.goo.gl/BMGk5inFgGBsmPfR9",
  },
  {
    id: "trappes",
    nom: "Trappes",
    adresse: "5 Av. Pavlov, 78190 Trappes",
    mail: "formations@altformations.fr",
    image: "/assets/images/campus/img5.jpeg",
    mapLink: "https://maps.app.goo.gl/vucXNTwuTX8imwZW6",
  },
  {
    id: "cergy",
    nom: "Cergy",
    adresse: "20 Rue Lavoisier, 95300 Pontoise",
    mail: "formations@altformations.fr",
    image: "/assets/images/campus/img6.jpeg",
    mapLink: "https://maps.app.goo.gl/Hv1W1LhuEoZdSPYA6",
  },
  {
    id: "asnieres",
    nom: "Asnières",
    adresse: "25 Rue des Bas, 92600 Asnières-sur-Seine",
    mail: "formations@altformations.fr",
    image: "/assets/images/campus/img7.jpeg",
    mapLink: "https://maps.app.goo.gl/Aqqjh2qA8h6Vtpju6",
  },
  {
    id: "créteil",
    nom: "Créteil",
    adresse: "70 Av. du Général de Gaulle, 94000 Créteil",
    mail: "formations@altformations.fr",
    image: "/assets/images/campus/img9.jpeg",
    mapLink: "https://maps.app.goo.gl/UKee2Ddq3YoHxQKu8",
  },
  {
    id: "melun",
    nom: "Melun",
    adresse: "11 Rue Benjamin Franklin, 77000 La Rochette",
    mail: "formations@altformations.fr",
    image: "/assets/images/campus/img10.jpeg",
    images: [
      "/assets/images/campus/img10.jpeg",
      "/assets/images/campus/img12.jpeg",
    ],
    mapLink: "https://maps.app.goo.gl/KYYBpf2ydsfFRRYS9",
  },
 
];
