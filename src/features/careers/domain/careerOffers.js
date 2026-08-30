/** Modèle de détail et stratégie de repli des offres de recrutement. */
import { dataNousRejoindre } from '../../../data/nous-rejoindre';

/** Index statique des offres par slug (repli si BDD indisponible). */
export function getStaticOffersIndex() {
  const index = new Map();

  for (const department of ['collaborateur', 'formateur']) {
    const list = dataNousRejoindre[department]?.offres?.list ?? [];
    for (const item of list) {
      if (!item.slug) continue;
      // Les noms historiques sont normalisés pour correspondre au contrat de l'API.
      index.set(item.slug, {
        ...item,
        department,
        title: item.poste,
        contract_type: item.type,
        location: item.lieu,
        short_description: item.short_description ?? null,
        full_description: item.full_description ?? item.description ?? null,
        source: 'static',
      });
    }
  }

  return index;
}

/** Recherche sûre : un slug vide ou inconnu produit toujours `null`. */
export function findStaticOfferBySlug(slug) {
  if (!slug) return null;
  return getStaticOffersIndex().get(slug) ?? null;
}

/** Produit le modèle unique consommé par la page détail, quelle que soit la source. */
export function mapCareerOfferForDetail(offer) {
  if (!offer) return null;
  return {
    id: offer.id ?? null,
    slug: offer.slug,
    department: offer.department,
    title: offer.title ?? offer.poste,
    contract_type: offer.contract_type ?? offer.type,
    location: offer.location ?? offer.lieu,
    short_description: offer.short_description ?? null,
    full_description: offer.full_description ?? offer.description ?? null,
    published_at: offer.published_at ?? null,
    dateLabel: offer.dateLabel ?? offer.date ?? null,
    source: offer.source ?? 'api',
  };
}

// Isole la dépendance de locale du reste de la fusion métier.
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

/** Complète une offre BDD partielle avec le contenu éditorial statique correspondant. */
export function mergeCareerOfferWithStatic(apiRow, slug) {
  const staticOffer = findStaticOfferBySlug(slug);
  const mapped = mapCareerOfferForDetail({
    ...apiRow,
    short_description: apiRow.short_description || staticOffer?.short_description,
    full_description: apiRow.full_description || staticOffer?.full_description,
    dateLabel: formatOfferDate(apiRow.published_at || apiRow.created_at) || staticOffer?.date,
    source: 'api',
  });

  // Le département est indispensable pour reconstruire la navigation de retour.
  if (!mapped.department && staticOffer?.department) mapped.department = staticOffer.department;
  return mapped;
}
