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

const getCategory = (id) => {
  if (id.includes('community') || id.includes('rh') || id.includes('commerciale') || id.includes('relation-client') || id.includes('administratifve')) return 'rh';
  if (id.includes('compta')) return 'comptabilite';
  return 'numerique';
};

try {
  let updatedCount = 0;
  for (const [id, item] of Object.entries(data)) {
    const cat = getCategory(id);
    
    // Si c'est RH ou Compta, on remplace tout le texte de l'informatique
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
  console.log(`Données corrigées avec succès pour ${updatedCount} formations RH / Compta !`);

} catch(err) {
  console.error("Erreur détaillée : ", err);
}
