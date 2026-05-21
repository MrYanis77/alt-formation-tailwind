/**
 * Convertit certificationOfficielle (formation.json) vers la forme utilisée par FormationCertifSection.
 */
export function mapCertificationOfficielleToCertif(cert, formationId, data = {}) {
  if (!cert?.code || !cert?.url) return null;

  const repertoire = cert.repertoire || 'RNCP';
  const categoryFromData = data.categorie || '';

  return {
    nom: cert.intituleOfficiel || data.hero?.titre || 'Certification professionnelle',
    rncp: cert.code,
    repertoire,
    niveau: cert.niveau != null ? String(cert.niveau) : '',
    category: categoryFromData,
    href: `/formation/${formationId}`,
    lienFranceCompetence: cert.url,
    imageUrl: data.imageUrl || null,
  };
}
