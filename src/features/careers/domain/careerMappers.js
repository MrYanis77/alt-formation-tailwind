/** Règles pures de présentation et de fusion des listes d'offres. */
import { dataNousRejoindre } from '../../../data/nous-rejoindre.js';

// Les dates venant de MySQL sont adaptées une seule fois à la locale du site.
function formatOfferDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return String(iso);
  }
}

/** Adapte une ligne API au format historique attendu par les cartes d'offres. */
export function mapCareerSummary(offer) {
  return {
    id: offer.id,
    slug: offer.slug,
    department: offer.department,
    poste: offer.title,
    type: offer.contract_type,
    lieu: offer.location,
    date: formatOfferDate(offer.published_at || offer.created_at),
    source: 'api',
  };
}

/** Fournit le contenu éditorial embarqué lorsque la base n'est pas disponible. */
export function getStaticCareerOffers(department) {
  const list = dataNousRejoindre[department]?.offres?.list ?? [];
  return list.map((offer) => ({ ...offer, source: 'static' }));
}

/**
 * Remplace les offres statiques par leur version BDD de même slug, puis ajoute
 * les nouvelles offres qui n'existent que dans la base.
 */
export function mergeCareerOffers(databaseOffers, department) {
  const staticOffers = getStaticCareerOffers(department);
  if (!databaseOffers.length) return staticOffers;

  // Un index évite une recherche complète pour chaque offre statique.
  const databaseBySlug = new Map(databaseOffers.map((offer) => [offer.slug, offer]));
  const merged = staticOffers.map((offer) => databaseBySlug.get(offer.slug) ?? offer);

  for (const offer of databaseOffers) {
    if (!staticOffers.some((staticOffer) => staticOffer.slug === offer.slug)) merged.push(offer);
  }
  return merged;
}
