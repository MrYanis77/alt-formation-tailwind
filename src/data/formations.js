import formationData from './json/formation.json';
import formationCortesData from './json/formation-courtes.json';
import formationsCertifiantesData from './json/formations-certifiantes.json';

/**
 * Mapping explicite des images locales par ID de formation.
 * Les fichiers se trouvent dans /public/assets/images/
 */
export const imageMap = {
  // ── Cybersécurité, Réseaux & Infrastructure ───────────────────────────────
  'formations-administrateur-dinfrastructures-securisees-ais': '/assets/images/expert_cyber.jpg',
  'formations-technicien-superieur-systemes-et-reseaux': '/assets/images/Terchnicien_reseau.jpg',
  'administrateur-reseaux-netops': '/assets/images/Datacenter.jpg',
  'administrateursysteme-devops': '/assets/images/devops.jpg',
  'technicien-reseaux-cybersecurite': '/assets/images/analyst_soc.jpg',
  'formation-initiation-cybersecurite': '/assets/images/pentester.jpg',
  'formation-implementer-politique-cybersecurite': '/assets/images/admin_system.jpg',
  'formation-cisco-configuration-administration': '/assets/images/Terchnicien_reseau.jpg',

  // ── Digital & Développement Web ─────────────────────────────────────────
  'formations-developpeur-web-mobile': '/assets/images/concepteur_web.jpg',
  'formations-developpeur-dapplications-multimedia': '/assets/images/designer_app_mobile.jpg',
  'formations-concepteur-developpeur-dapplications': '/assets/images/concepteur_app.jpg',
  'formations-concepteur-designer-ui': '/assets/images/designer_app_mobile.jpg',
  'formations-lead-developpeur-web': '/assets/images/analyste_data.jpg',
  'formation-intelligence-artificielle': '/assets/images/analyste_data.jpg',
  'formation-python-tosa': '/assets/images/concepteur_app.jpg',
  'formation-responsive-web-design': '/assets/images/concepteur_web.jpg',
  'formation-php': '/assets/images/admin_system.jpg',
  'executive-mastere-ingenierie-logiciel': '/assets/images/concepteur_app.jpg',

  // ── RH, Gestion & Comptabilité ──────────────────────────────────────────
  'formations-community-manager': '/assets/images/designer_app_mobile.jpg',
  'formations-assistante-ressources-humaines': '/assets/images/responsable_rh.jpg',
  'formations-assistante-de-direction': '/assets/images/secretaire_5.png',
  'formations-assistante-administratifve': '/assets/images/secretaire_4.jpg',
  'formations-assistante-commerciale': '/assets/images/secretaire_1.jpg',
  'formations-conseillerere-relation-client-a-distance': '/assets/images/secretaire_2.jpg',
  'formations-secretaire-comptable': '/assets/images/comptable2.jpg',
  'gestionnaire-comptable-fiscal': '/assets/images/comptable_1.jpg',
  'formations-comptable-assistant': '/assets/images/comptable2.jpg',

  // ── E-Learning / Formations Courtes ─────────────────────────────────────
  'systemes-embarques-iot-android':                    '/assets/images/concepteur_app.jpg',
  'cybersecurite-pentest-web-serveurs':                '/assets/images/pentester.jpg',
  'cybersecurite-preparation-osed':                    '/assets/images/expert_cyber.jpg',
  'cybersecurite-pecb-lead-cloud-security-manager':    '/assets/images/Datacenter.jpg',
  'digital-developpement-big-data-strategie-marketing':'/assets/images/analyste_data.jpg',
  'digital-developpement-java':                        '/assets/images/concepteur_app.jpg',
  'management-situationnel':                           '/assets/images/responsable_rh.jpg',
  'management-rse':                                    '/assets/images/entreprise.jpg',
  'management-reussir-management-projet':              '/assets/images/emploi.jpg',
  'management-devenir-manager-agile':                  '/assets/images/designer_app_mobile.jpg',
  'management-management-3-0':                         '/assets/images/certification.jpg',
  'devops-devenez-devops-avec-docker':                 '/assets/images/devops.jpg',
  'informatique-administration-windows-server':        '/assets/images/admin_system.jpg',
  'istqb-testeur-certifie-niveau-fondation-ihmisen':     '/assets/images/concepteur_app.jpg',
  'istqb-testeur-agile-fondation-ib-cegos':             '/assets/images/concepteur_app.jpg',
  'istqb-tests-acceptation-fondation-m2i':               '/assets/images/concepteur_app.jpg',
  'piloter-animer-securite-informatique-sysdream':       '/assets/images/expert_cyber.jpg',
  'html5-css3-javascript-certifiante-eni':               '/assets/images/concepteur_web.jpg',
  'python-oriente-objet-certifiante-eni':                 '/assets/images/concepteur_app.jpg',

  // Formations certifiantes (alignées sur formations-certifiantes.json)
  'dasa-devops-fundamentals':                             '/assets/images/devops.jpg',
  'devops-methode-organisation':                          '/assets/images/devops.jpg',
  'iso-iec-27035-incident-management-foundation':        '/assets/images/analyst_soc.jpg',
  'sql-langage-bases-donnees-relationnelles-certifiante': '/assets/images/analyste_data.jpg',
  'docker-concevoir-deployer-applications-certifiante':   '/assets/images/devops.jpg',
  'cybersecurite-exhaustive-menaces-architectures-certifiante': '/assets/images/expert_cyber.jpg',
  'developper-culture-digitale': '/assets/images/designer_app_mobile.jpg',
  'csharp-dotnet-visual-studio': '/assets/images/concepteur_app.jpg',
  'conception-orientee-objet': '/assets/images/concepteur_app.jpg',
  'rssi-gouvernance-cybersecurite': '/assets/images/expert_cyber.jpg',
  'cloud-technology-associate-cta': '/assets/images/Datacenter.jpg',
  'cisco-ccna-fondamentaux': '/assets/images/Terchnicien_reseau.jpg',
  'professional-cloud-solution-architect-pcsa': '/assets/images/Datacenter.jpg',
  'cybersecurite-audit-android-introduction': '/assets/images/analyst_soc.jpg',
  'cybersecurite-c-dfe-certified-digital-forensics-examiner': '/assets/images/expert_cyber.jpg',
  'cybersecurite-isc2-cissp': '/assets/images/expert_cyber.jpg',
  'devsecops-engineering-dsoe': '/assets/images/devops.jpg',
  'programmation-objet-cpp': '/assets/images/concepteur_app.jpg',
};

// Fallback si un ID n'est pas encore dans le mapping
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800';

// Fonction d'aide pour extraire et formater une formation du JSON
const mapIdToItem = (id) => {
  const data = formationData[id];
  if (!data) return null;
  return {
    titre: data.hero.titre.replace(/^Devenez\s+/i, '').replace(/^Faites votre Formation en\s+/i, ''),
    features: (data.competences || []).slice(0, 3),
    competences: data.competences || [],
    imageUrl: imageMap[id] || data.hero.image || FALLBACK_IMAGE,
    href: `/formation/${id}`
  };
};

// Fonction d'aide pour les formations courtes
const mapCourteIdToItem = (id) => {
  const data = formationCortesData[id];
  if (!data) return null;
  return {
    titre: data.hero.titre,
    features: (data.competences || []).slice(0, 3),
    competences: data.competences || [],
    imageUrl: imageMap[id] || FALLBACK_IMAGE,
    href: `/formation/${id}`
  };
};

// Fonction d'aide pour les formations certifiantes
const mapCertifianteIdToItem = (id) => {
  const data = formationsCertifiantesData[id];
  if (!data) return null;
  return {
    titre: data.hero.titre,
    features: (data.competences || []).slice(0, 3),
    competences: data.competences || [],
    imageUrl: data.presentation?.image || imageMap[id] || FALLBACK_IMAGE,
    href: `/formation/${id}`
  };
};

export const hero = {
  titre: "Nos formations",
  sousTitre: "Des parcours certifiants adaptés à vos ambitions professionnelles",
  video: "/assets/video/formation.mp4",
};

export const catalogue = [
  {
    id: 'cybersecurite-reseaux',
    label: 'Cybersécurité, Réseaux & Infrastructure',
    items: [
      'formations-administrateur-dinfrastructures-securisees-ais',
      'formations-technicien-superieur-systemes-et-reseaux',
      'administrateur-reseaux-netops',
      'administrateursysteme-devops',
      'technicien-reseaux-cybersecurite',
      'formation-initiation-cybersecurite',
      'formation-implementer-politique-cybersecurite',
      'formation-cisco-configuration-administration'
    ].map(mapIdToItem).filter(Boolean),
  },
  {
    id: 'digital-developpement',
    label: 'Développement Web',
    items: [
      'formations-developpeur-web-mobile',
      'formations-developpeur-dapplications-multimedia',
      'formations-concepteur-developpeur-dapplications',
      'formations-concepteur-designer-ui',
      'formations-lead-developpeur-web',
      'formation-responsive-web-design',
      'formation-php',
      'executive-mastere-ingenierie-logiciel'
    ].map(mapIdToItem).filter(Boolean),
  },
  {
    id: 'ia-data',
    label: 'Intelligence Artificielle',
    items: [
      'formation-intelligence-artificielle',
      'formation-python-tosa'
    ].map(mapIdToItem).filter(Boolean),
  },
  {
    id: 'ressources-humaines',
    label: 'Ressources Humaines',
    items: [
      'formations-assistante-ressources-humaines',
      'formations-assistante-de-direction',
      'formations-assistante-administratifve',
      'formations-assistante-commerciale',
      'formations-conseillerere-relation-client-a-distance',
    ].map(mapIdToItem).filter(Boolean),
  },
  {
    id: 'comptabilite-gestion',
    label: 'Comptabilité & Gestion',
    items: [
      'formations-community-manager',
      'formations-secretaire-comptable',
      'gestionnaire-comptable-fiscal',
      'formations-comptable-assistant'
    ].map(mapIdToItem).filter(Boolean),
  }
];

const categoriesCourtes = {
  'cybersecurite': {
    label: 'Cybersécurité',
    description: 'Pentest, audit mobile, exploit dev et certifications cloud.',
  },
  'digital-developpement': {
    label: 'Développement & Big Data',
    description: 'Java, Big Data et stratégies marketing digitales.',
  },
  'management': {
    label: 'Management',
    description: 'Management situationnel, agile, RSE et gestion de projet.',
  },
  'devops-devsecops': {
    label: 'DevOps / DevSecOps',
    description: 'Conteneurisation, CI/CD et culture DevOps avec Docker.',
  },
  'informatique-systemes-reseaux': {
    label: 'Informatique & Systèmes',
    description: 'Administration Windows Server et infrastructure réseau.',
  },
  'systemes-embarques-iot': {
    label: 'Systèmes Embarqués & IOT',
    description: 'Android embarqué, noyau Linux et périphériques IoT.',
  },
};

export const catalogueCourtes = (() => {
  const grouped = {};
  Object.entries(formationCortesData).forEach(([id, data]) => {
    const cat = data.categorie || 'autre';
    if (!grouped[cat]) grouped[cat] = [];
    const item = mapCourteIdToItem(id);
    if (item) grouped[cat].push(item);
  });

  return Object.entries(grouped).map(([id, items]) => ({
    id,
    label: categoriesCourtes[id]?.label || id,
    description: categoriesCourtes[id]?.description || '',
    items,
  }));
})();

const categoriesCertifiantes = {
  'cybersecurite-reseaux': {
    label: 'Cybersécurité, Réseaux & Infrastructure',
    description: 'Cybersécurité, conformité, réseaux, cloud et virtualisation certifiants.',
  },
  'devops': {
    label: 'DevOps',
    description: 'Formations certifiantes DevOps, méthodes agiles et organisation.',
  },
  'devsecops': {
    label: 'DevSecOps',
    description: 'Sécurité intégrée au cycle DevOps, pratiques et outils DevSecOps.',
  },
  'digital-developpement': {
    label: 'Développement & Big Data',
    description:
      'SQL, langages, développement logiciel, ISTQB et qualité logicielle certifiants.',
  },
};

export const catalogueCertifiantes = (() => {
  const grouped = {};
  Object.entries(formationsCertifiantesData).forEach(([id, data]) => {
    const cat = data.categorie || 'autre';
    if (!grouped[cat]) grouped[cat] = [];
    const item = mapCertifianteIdToItem(id);
    if (item) grouped[cat].push(item);
  });

  return Object.entries(grouped).map(([id, items]) => ({
    id,
    label: categoriesCertifiantes[id]?.label || id,
    description: categoriesCertifiantes[id]?.description || '',
    items,
  }));
})();

function withFormationTypeBadge(items, badge) {
  return items.map((item) => ({ ...item, typeBadge: badge }));
}

function dedupeCatalogueItemsByHref(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.href)) return false;
    seen.add(item.href);
    return true;
  });
}

/**
 * Catalogue /formations unifié : mêmes domaines que les diplômantes, fusionnés avec
 * les certifiantes lorsque l'id de catégorie est identique ; sinon les domaines
 * certifiants seuls (ex. devops) suivent dans l'ordre du JSON.
 */
export const catalogueDiplomesCertifiantsFusionne = (() => {
  const certById = Object.fromEntries(catalogueCertifiantes.map((c) => [c.id, c]));
  const mergedCertIds = new Set();
  const rows = [];

  for (const d of catalogue) {
    const c = certById[d.id];
    const dItems = withFormationTypeBadge(d.items, 'Diplômante');
    if (c) {
      mergedCertIds.add(c.id);
      const cItems = withFormationTypeBadge(c.items, 'Certifiante');
      const descParts = [d.description, c.description].filter(Boolean);
      rows.push({
        id: d.id,
        label: d.label,
        description: descParts.join(' ').trim(),
        items: dedupeCatalogueItemsByHref([...dItems, ...cItems]),
      });
    } else {
      rows.push({
        id: d.id,
        label: d.label,
        description: d.description || '',
        items: dItems,
      });
    }
  }

  for (const c of catalogueCertifiantes) {
    if (mergedCertIds.has(c.id)) continue;
    rows.push({
      id: c.id,
      label: c.label,
      description: c.description || '',
      items: withFormationTypeBadge(c.items, 'Certifiante'),
    });
  }

  return rows;
})();

export const heroCertifiantes = {
  titre: "Formations Certifiantes",
  sousTitre: "Des formations pratiques et certifiées pour booster vos compétences professionnelles.",
  video: "/assets/video/formation.mp4",
};
