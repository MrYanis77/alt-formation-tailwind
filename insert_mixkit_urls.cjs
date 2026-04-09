const fs = require('fs');
const path = './src/data/JSON/formation.json';
const data = require(path);

// Utilisation de MIXKIT : Leurs serveurs acceptent le hotlinking (les vidéos s'afficheront sans être bloquées directement depuis les URL).
const videoMap = {
    // NUMERIQUE (Lignes de code / Développeur)
    "formations-administrateur-dinfrastructures-securisees-ais": "https://assets.mixkit.co/videos/preview/mixkit-set-of-code-lines-running-on-screen-22634-large.mp4",
    "formations-developpeur-web-mobile": "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-41876-large.mp4",
    "formations-developpeur-dapplications-multimedia": "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-41876-large.mp4",
    "formations-concepteur-developpeur-dapplications": "https://assets.mixkit.co/videos/preview/mixkit-set-of-code-lines-running-on-screen-22634-large.mp4",
    "formations-technicien-superieur-systemes-et-reseaux": "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-41876-large.mp4",
    "formations-lead-developpeur-web": "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-41876-large.mp4",
    "administrateur-reseaux-netops": "https://assets.mixkit.co/videos/preview/mixkit-set-of-code-lines-running-on-screen-22634-large.mp4",
    "administrateursysteme-devops": "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-41876-large.mp4",
    "technicien-reseaux-cybersecurite": "https://assets.mixkit.co/videos/preview/mixkit-set-of-code-lines-running-on-screen-22634-large.mp4",
    "formation-intelligence-artificielle": "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-41876-large.mp4",
    
    // RH / GESTION (Réunions / Business)
    "formations-community-manager": "https://assets.mixkit.co/videos/preview/mixkit-two-business-women-having-a-professional-conversation-41707-large.mp4",
    "formations-assistante-ressources-humaines": "https://assets.mixkit.co/videos/preview/mixkit-two-business-women-having-a-professional-conversation-41707-large.mp4",
    "formations-assistante-administratifve": "https://assets.mixkit.co/videos/preview/mixkit-business-people-meeting-at-a-work-table-41718-large.mp4",
    "formations-assistante-commerciale": "https://assets.mixkit.co/videos/preview/mixkit-two-business-women-having-a-professional-conversation-41707-large.mp4",
    "formations-conseillerere-relation-client-a-distance": "https://assets.mixkit.co/videos/preview/mixkit-business-people-meeting-at-a-work-table-41718-large.mp4",
    
    // COMPTABILITE (Finance, Stats)
    "formations-secretaire-comptable": "https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-calculator-and-a-keyboard-41619-large.mp4",
    "gestionnaire-comptable-fiscal": "https://assets.mixkit.co/videos/preview/mixkit-financial-graphs-and-charts-on-a-computer-screen-41584-large.mp4",
    "formations-comptable-assistant": "https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-calculator-and-a-keyboard-41619-large.mp4"
};

try {
  let count = 0;
  for (const [id, item] of Object.entries(data)) {
    if (item.hero && videoMap[id]) {
      item.hero.image = videoMap[id];
      count++;
    }
  }

  // Rewrite formation.json
  fs.writeFileSync(path, JSON.stringify(data, null, 4), 'utf-8');
  console.log(`Succès: ${count} URLs de vidéos injectées dans le JSON.`);
} catch(err) {
  console.error("Erreur : ", err);
}
