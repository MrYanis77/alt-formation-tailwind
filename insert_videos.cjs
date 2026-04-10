const fs = require('fs');
const path = './src/data/JSON/formation.json';
const data = require(path);

const videoMap = {
    // NUMERIQUE
    "formations-administrateur-dinfrastructures-securisees-ais": "https://videos.pexels.com/video-files/3129957/3129957-uhd_2560_1440_30fps.mp4",
    "formations-developpeur-web-mobile": "https://videos.pexels.com/video-files/8732731/8732731-uhd_2560_1440_25fps.mp4",
    "formations-developpeur-dapplications-multimedia": "https://videos.pexels.com/video-files/5460591/5460591-uhd_2560_1440_30fps.mp4",
    "formations-concepteur-developpeur-dapplications": "https://videos.pexels.com/video-files/8732731/8732731-uhd_2560_1440_25fps.mp4",
    "formations-technicien-superieur-systemes-et-reseaux": "https://videos.pexels.com/video-files/3129957/3129957-uhd_2560_1440_30fps.mp4",
    "formations-lead-developpeur-web": "https://videos.pexels.com/video-files/8732731/8732731-uhd_2560_1440_25fps.mp4",
    "administrateur-reseaux-netops": "https://videos.pexels.com/video-files/5460591/5460591-uhd_2560_1440_30fps.mp4",
    "administrateursysteme-devops": "https://videos.pexels.com/video-files/3129957/3129957-uhd_2560_1440_30fps.mp4",
    "technicien-reseaux-cybersecurite": "https://videos.pexels.com/video-files/5460591/5460591-uhd_2560_1440_30fps.mp4",
    "formation-intelligence-artificielle": "https://videos.pexels.com/video-files/8732731/8732731-uhd_2560_1440_25fps.mp4",
    
    // RH / GESTION
    "formations-community-manager": "https://videos.pexels.com/video-files/3141208/3141208-uhd_2560_1440_25fps.mp4",
    "formations-assistante-ressources-humaines": "https://videos.pexels.com/video-files/7551405/7551405-uhd_2560_1440_25fps.mp4",
    "formations-assistante-administratifve": "https://videos.pexels.com/video-files/8292882/8292882-uhd_2560_1440_25fps.mp4",
    "formations-assistante-commerciale": "https://videos.pexels.com/video-files/3141208/3141208-uhd_2560_1440_25fps.mp4",
    "formations-conseillerere-relation-client-a-distance": "https://videos.pexels.com/video-files/8292882/8292882-uhd_2560_1440_25fps.mp4",
    
    // COMPTABILITE
    "formations-secretaire-comptable": "https://videos.pexels.com/video-files/6803730/6803730-uhd_2160_4096_25fps.mp4",
    "gestionnaire-comptable-fiscal": "https://videos.pexels.com/video-files/7710243/7710243-uhd_2560_1440_30fps.mp4",
    "formations-comptable-assistant": "https://videos.pexels.com/video-files/6774640/6774640-uhd_2160_4096_30fps.mp4"
};

try {
  let imageCount = 0;

  for (const [id, item] of Object.entries(data)) {
    if (item.hero && videoMap[id]) {
      // Injection du lien vidéo
      item.hero.image = videoMap[id];
      imageCount++;
    }
  }

  fs.writeFileSync(path, JSON.stringify(data, null, 4), 'utf-8');
  console.log(`Données corrigées avec succès ! ${imageCount} vidéos ont été ajoutées en background !`);

} catch(err) {
  console.error("Erreur détaillée : ", err);
}
