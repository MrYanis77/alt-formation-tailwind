import formationData from './json/formation.json';

/**
 * Mapping explicite des images locales par ID de formation.
 * Les fichiers se trouvent dans /public/Assets/images/
 */
export const imageMap = {
  // ── Cybersécurité & Réseaux ─────────────────────────────────────────────
  'formations-administrateur-dinfrastructures-securisees-ais': '/Assets/images/expert_cyber.jpg',
  'formations-technicien-superieur-systemes-et-reseaux': '/Assets/images/Terchnicien_reseau.jpg',
  'administrateur-reseaux-netops': '/Assets/images/Datacenter.jpg',
  'administrateursysteme-devops': '/Assets/images/devops.jpg',
  'technicien-reseaux-cybersecurite': '/Assets/images/analyst_soc.jpg',

  // ── Digital & Développement Web ─────────────────────────────────────────
  'formations-developpeur-web-mobile': '/Assets/images/concepteur_web.jpg',
  'formations-developpeur-dapplications-multimedia': '/Assets/images/designer_app_mobile.jpg',
  'formations-concepteur-developpeur-dapplications': '/Assets/images/concepteur_app.jpg',
  'formations-lead-developpeur-web': '/Assets/images/analyste_data.jpg',
  'formations-community-manager': '/Assets/images/admin_system.jpg',
  'formation-intelligence-artificielle': '/Assets/images/Datacenter.jpg',

  // ── Ressources Humaines & Tertiaire ─────────────────────────────────────
  'formations-assistante-ressources-humaines': '/Assets/images/responsable_rh.jpg',
  'formations-assistante-administratifve': '/Assets/images/secretaire_5.png',
  'formations-assistante-commerciale': '/Assets/images/secretaire_4.jpg',
  'formations-conseillerere-relation-client-a-distance': '/Assets/images/secretaire_1.jpg',

  // ── Comptabilité & Gestion ───────────────────────────────────────────────
  'formations-secretaire-comptable': '/Assets/images/secretaire_2.jpg',
  'gestionnaire-comptable-fiscal': '/Assets/images/comptable_1.jpg',
  'formations-comptable-assistant': '/Assets/images/comptable2.jpg',
};

// Fallback si un ID n'est pas encore dans le mapping
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800';

// Fonction d'aide pour extraire et formater une formation du JSON
const mapIdToItem = (id) => {
  const data = formationData[id];
  if (!data) return null;
  return {
    // On nettoie le titre pour l'affichage dans les cartes
    titre: data.hero.titre.replace(/^Devenez\s+/i, '').replace(/^Faites votre Formation en\s+/i, ''),
    features: (data.competences || []).slice(0, 3), // On prend au max les 3 premières compétences
    imageUrl: imageMap[id] || data.hero.image || FALLBACK_IMAGE,
    href: `/formation/${id}`
  };
};

export const hero = {
  titre: "Nos formations",
  sousTitre: "Des parcours certifiants adaptés à vos ambitions professionnelles",
  video: "/Assets/video/formations/dev-web-mobile.mp4",
};

export const catalogue = [
  {
    id: 'cybersecurite-reseaux',
    label: 'Cybersécurité & Réseaux',
    items: [
      'formations-administrateur-dinfrastructures-securisees-ais',
      'formations-technicien-superieur-systemes-et-reseaux',
      'administrateur-reseaux-netops',
      'administrateursysteme-devops',
      'technicien-reseaux-cybersecurite'
    ].map(mapIdToItem).filter(Boolean),
  },
  {
    id: 'digital-developpement',
    label: 'Digital & Développement Web',
    items: [
      'formations-developpeur-web-mobile',
      'formations-developpeur-dapplications-multimedia',
      'formations-concepteur-developpeur-dapplications',
      'formations-lead-developpeur-web',
      'formations-community-manager',
      'formation-intelligence-artificielle'
    ].map(mapIdToItem).filter(Boolean),
  },
  {
    id: 'rh-tertiaire',
    label: 'Ressources Humaines & Tertiaire',
    items: [
      'formations-assistante-ressources-humaines',
      'formations-assistante-administratifve',
      'formations-assistante-commerciale',
      'formations-conseillerere-relation-client-a-distance'
    ].map(mapIdToItem).filter(Boolean),
  },
  {
    id: 'comptabilite-gestion',
    label: 'Comptabilité & Gestion',
    items: [
      'formations-secretaire-comptable',
      'gestionnaire-comptable-fiscal',
      'formations-comptable-assistant'
    ].map(mapIdToItem).filter(Boolean),
  }
];