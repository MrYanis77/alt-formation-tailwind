import formationsData from './json/formation.json';
import formationsCortesData from './json/formation-courtes.json';
import formationsCertifiantesData from './json/formations-certifiantes.json';

const categoryMap = {
  'formations-administrateur-dinfrastructures-securisees-ais': 'cybersecurite-reseaux',
  'formations-technicien-superieur-systemes-et-reseaux': 'cybersecurite-reseaux',
  'administrateur-reseaux-netops': 'cybersecurite-reseaux',
  'administrateursysteme-devops': 'digital-developpement',
  'technicien-reseaux-cybersecurite': 'cybersecurite-reseaux',
  'formations-developpeur-web-mobile': 'digital-developpement',
  'formations-developpeur-dapplications-multimedia': 'digital-developpement',
  'formations-concepteur-developpeur-dapplications': 'digital-developpement',
  'formations-concepteur-designer-ui': 'digital-developpement',
  'formations-graphiste': 'digital-developpement',
  'formations-monteur-audiovisuel-analyse-sportive': 'digital-developpement',
  'formations-lead-developpeur-web': 'digital-developpement',
  'executive-mastere-ingenierie-logiciel': 'digital-developpement',
  'creer-site-internet-html-css-wordpress': 'digital-developpement',
  'formations-assistante-ressources-humaines': 'ressources-humaines',
  'formations-conseiller-insertion-professionnelle': 'ressources-humaines',
  'formations-assistante-de-direction': 'ressources-humaines',
  'formations-assistante-administratifve': 'ressources-humaines',
  'formations-charge-accueil-et-gestion-administrative': 'ressources-humaines',
  'formations-secretaire-assistant-medico-administratif': 'ressources-humaines',
  'formations-assistante-commerciale': 'ressources-humaines',
  'formations-conseillerere-relation-client-a-distance': 'ressources-humaines',
  'formations-community-manager': 'comptabilite-gestion',
  'formations-secretaire-comptable': 'comptabilite-gestion',
  'gestionnaire-comptable-fiscal': 'comptabilite-gestion',
  'formations-comptable-assistant': 'comptabilite-gestion',
  'formations-responsable-etablissement-marchand': 'comptabilite-gestion',
  'formations-responsable-petite-moyenne-structure': 'comptabilite-gestion',
  'formations-responsable-developpement-des-activites': 'comptabilite-gestion',
  'formations-gestionnaire-de-paie': 'comptabilite-gestion',
  'formations-assistant-immobilier': 'comptabilite-gestion',
  'formations-assistant-import-export': 'comptabilite-gestion',
  'formations-conseiller-de-vente': 'comptabilite-gestion',
  'formations-employe-commercial': 'comptabilite-gestion',
};

/** Identifiant de catégorie méga-menu / certifiante pour une fiche formation. */
export function getFormationCatalogCategory(formationId) {
  const cert = formationsCertifiantesData[formationId];
  if (cert?.categorie) return cert.categorie;
  const long = formationsData[formationId];
  if (!long) return null;
  return long.categorie || categoryMap[formationId] || 'autre';
}
