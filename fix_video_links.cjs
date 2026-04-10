const fs = require('fs');
const path = './src/data/JSON/formation.json';
const data = require(path);

// On va utiliser un dossier local public/videos car Pexels/Freepik bloquent souvent les accès externes via lien direct
const videoMap = {
    // NUMERIQUE
    "formations-administrateur-dinfrastructures-securisees-ais": "/videos/numerique.mp4",
    "formations-developpeur-web-mobile": "/videos/numerique.mp4",
    "formations-developpeur-dapplications-multimedia": "/videos/numerique.mp4",
    "formations-concepteur-developpeur-dapplications": "/videos/numerique.mp4",
    "formations-technicien-superieur-systemes-et-reseaux": "/videos/numerique.mp4",
    "formations-lead-developpeur-web": "/videos/numerique.mp4",
    "administrateur-reseaux-netops": "/videos/numerique.mp4",
    "administrateursysteme-devops": "/videos/numerique.mp4",
    "technicien-reseaux-cybersecurite": "/videos/numerique.mp4",
    "formation-intelligence-artificielle": "/videos/numerique.mp4",
    
    // RH / GESTION
    "formations-community-manager": "/videos/rh.mp4",
    "formations-assistante-ressources-humaines": "/videos/rh.mp4",
    "formations-assistante-administratifve": "/videos/rh.mp4",
    "formations-assistante-commerciale": "/videos/rh.mp4",
    "formations-conseillerere-relation-client-a-distance": "/videos/rh.mp4",
    
    // COMPTABILITE
    "formations-secretaire-comptable": "/videos/compta.mp4",
    "gestionnaire-comptable-fiscal": "/videos/compta.mp4",
    "formations-comptable-assistant": "/videos/compta.mp4"
};

try {
  let imageCount = 0;

  for (const [id, item] of Object.entries(data)) {
    if (item.hero && videoMap[id]) {
        item.hero.image = videoMap[id];
        imageCount++;
    }
  }

  fs.writeFileSync(path, JSON.stringify(data, null, 4), 'utf-8');
  console.log(`Données corrigées avec succès ! Liens vers vidéos locales attribués.`);
} catch(err) {
  console.error("Erreur : ", err);
}
