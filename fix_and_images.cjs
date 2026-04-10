const fs = require('fs');
const path = './src/data/JSON/formation.json';
const data = require(path);

// Textes de base selon la catégorie
const contenusParDev = {
  rh: {
    presentation: "Ce métier central vous permet d'intervenir sur la gestion administrative, le développement des talents et la stratégie des ressources humaines au sein de l'entreprise. Vous serez l'interlocuteur clé entre la direction et les collaborateurs, garantissant un environnement de travail épanouissant et conforme à la législation.",
    heroSousTitre: "Devenez un maillon essentiel de l'entreprise. Acquérez des compétences solides en gestion administrative, recrutement, paie et développement RH.",
    stats: [
      { label: "Durée", value: "12 à 24 mois" },
      { label: "Compétences clés", value: "Recrutement, Paie, Droit" },
      { label: "Certification", value: "Titre RNCP (Niveau 5 à 6)" }
    ],
    competences: [
      "Gestion de l'administration du personnel",
      "Élaboration et suivi du plan de formation",
      "Maîtrise du cadre légal et droit du travail",
      "Recrutement et intégration des talents",
      "Communication interne et relations sociales",
      "Préparation et gestion des éléments de paie"
    ],
    modules: [
        { id: 1, title: "Droit du travail et veille sociale", duration: "35 heures", description: "Comprendre les fondamentaux juridiques." },
        { id: 2, title: "Administration du personnel", duration: "49 heures", description: "Contrats, absences, et gestion quotidienne." },
        { id: 3, title: "Recrutement et intégration", duration: "35 heures", description: "Sourcing, entretiens, et onboarding." },
        { id: 4, title: "Gestion de la paie", duration: "70 heures", description: "Éléments variables, DSN, et bulletins." },
        { id: 5, title: "Développement des compétences", duration: "35 heures", description: "GPEC et ingénierie de formation." }
    ],
    prerequis: "Personnes ayant une forte appétence pour les relations humaines, titulaires d'un Bac ou équivalent, avec un bon sens de l'organisation."
  },
  comptabilite: {
    presentation: "La comptabilité est la colonne vertébrale de l'entreprise. Vous serez responsable de la lisibilité financière de la structure, de la saisie des opérations courantes jusqu'à la préparation des bilans. C'est un métier exigeant l'application de normes strictes et une maîtrise des outils numériques actuels.",
    heroSousTitre: "Un parcours exigeant pour maîtriser la gestion financière, fiscale et sociale des entreprises. Assurez la stabilité financière de votre structure.",
    stats: [
      { label: "Durée", value: "12 à 24 mois" },
      { label: "Compétences clés", value: "Bilan, TVA, Fiscalité" },
      { label: "Certification", value: "Titre RNCP (Niveau 5 à 6)" }
    ],
    competences: [
      "Saisie des écritures comptables courantes",
      "Établissements des déclarations fiscales (TVA, IS)",
      "Préparation du bilan et du compte de résultat",
      "Suivi de la trésorerie et rapprochements bancaires",
      "Traitement de la comptabilité fournisseurs et clients",
      "Utilisation des ERP et logiciels comptables"
    ],
    modules: [
        { id: 1, title: "Comptabilité générale et opérations courantes", duration: "70 heures", description: "Maîtrise des écritures de base." },
        { id: 2, title: "Fiscalité de l'entreprise", duration: "49 heures", description: "TVA, impôts sur les sociétés, liasses fiscales." },
        { id: 3, title: "Travaux d'inventaire et Bilan", duration: "70 heures", description: "Amortissements, provisions, et clôture." },
        { id: 4, title: "Gestion financière et trésorerie", duration: "35 heures", description: "Analyse financière et suivi bancaire." },
        { id: 5, title: "Numérisation de la fonction comptable", duration: "21 heures", description: "Maîtrise de Sage, Cegid et autres ERP." }
    ],
    prerequis: "Personnes rigoureuses, avec un goût prononcé pour les chiffres. Titulaires d'un Bac ou équivalent."
  }
};

const imageMap = {
    // NUMERIQUE
    "formations-administrateur-dinfrastructures-securisees-ais": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80",
    "formations-developpeur-web-mobile": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80",
    "formations-developpeur-dapplications-multimedia": "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80",
    "formations-concepteur-developpeur-dapplications": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80",
    "formations-technicien-superieur-systemes-et-reseaux": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80",
    "formations-lead-developpeur-web": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80",
    "administrateur-reseaux-netops": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80",
    "administrateursysteme-devops": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80",
    "technicien-reseaux-cybersecurite": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80",
    "formation-intelligence-artificielle": "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80",
    
    // RH / GESTION
    "formations-community-manager": "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80",
    "formations-assistante-ressources-humaines": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80",
    "formations-assistante-administratifve": "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80",
    "formations-assistante-commerciale": "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?auto=format&fit=crop&q=80",
    "formations-conseillerere-relation-client-a-distance": "https://images.unsplash.com/photo-1549923746-c502b217a94f?auto=format&fit=crop&q=80",
    
    // COMPTABILITE
    "formations-secretaire-comptable": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80",
    "gestionnaire-comptable-fiscal": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80",
    "formations-comptable-assistant": "https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&q=80"
};

const getCategory = (id) => {
  if (id.includes('community') || id.includes('rh') || id.includes('commerciale') || id.includes('relation-client') || id.includes('administratifve')) return 'rh';
  if (id.includes('compta')) return 'comptabilite';
  return 'numerique';
};

try {
  let updatedCount = 0;
  let imageCount = 0;

  for (const [id, item] of Object.entries(data)) {
    const cat = getCategory(id);
    
    // 1. AJOUT DE L'IMAGE CORRESPONDANTE
    if (item.hero) {
        if (imageMap[id]) {
            item.hero.image = imageMap[id];
            imageCount++;
        }
    }
    
    // 2. CORRECTION DES DONNEES RH ET COMPTABILITE (qui étaient dupliquées avec celles du numérique)
    if (cat === 'rh' || cat === 'comptabilite') {
      const template = contenusParDev[cat];
      const jobName = item.hero?.titre ? item.hero.titre.replace("Devenez ", "") : "ce métier";

      // Patch Héro
      if (item.hero) {
          if (item.hero.sousTitre.includes("L’Administrateur d’infrastructures")) {
              item.hero.sousTitre = template.heroSousTitre;
          }
      }

      // Patch Presentation
      if (item.presentation) {
          item.presentation.paragraphes = template.presentation;
      }

      // Patch Stats
      item.stats = template.stats;

      // Patch Compétences
      item.competences = template.competences;

      // Patch Programme Modules
      if (item.programme) {
          item.programme.modules = template.modules;
      }

      // Patch Infos Pratiques (Prérequis spécifiques)
      if (item.infosPratiques && item.infosPratiques.prerequis) {
          item.infosPratiques.prerequis.points = [
              template.prerequis,
              "Aisance avec les outils informatiques.",
              "Motivation et capacité d'adaptation."
          ];
      }

      // Patch Débouchés (On garde le titre du métier pour générer un poste)
      if (item.debouches) {
          item.debouches.postes = [
              { titre: jobName, salaire: cat === 'rh' ? "24K€ - 35K€ brut/an" : "26K€ - 38K€ brut/an" },
              { titre: `Assistant(e) de direction / ${cat.toUpperCase()}`, salaire: "22K€ - 30K€ brut/an" }
          ];
          item.debouches.secteurs = cat === 'rh' ? "Ressources Humaines, Secrétariat, Management, Tertiaire." : "Cabinets d'expertise comptable, PME, Grandes entreprises.";
      }

      updatedCount++;
    }
  }

  fs.writeFileSync(path, JSON.stringify(data, null, 4), 'utf-8');
  console.log(`Données corrigées avec succès ! ${imageCount} images attribuées et ${updatedCount} formations RH / Compta textuellement réparées !`);

} catch(err) {
  console.error("Erreur détaillée : ", err);
}
