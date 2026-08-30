/**
 * Tests des transformations blog, tarification et recrutement.
 * Ces fonctions pures concentrent les règles de repli entre BDD et contenu statique.
 */
import { describe, expect, it } from 'vitest';
import { mapBlogCategories, mapBlogPost } from '../../../src/features/blog/domain/blogMappers.js';
import {
  getStaticCareerOffers,
  mapCareerSummary,
  mergeCareerOffers,
} from '../../../src/features/careers/domain/careerMappers.js';
import {
  findStaticOfferBySlug,
  getStaticOffersIndex,
  mapCareerOfferForDetail,
  mergeCareerOfferWithStatic,
} from '../../../src/features/careers/domain/careerOffers.js';
import { mapPricingPlansToBilanFormules } from '../../../src/features/pricing/domain/pricingMappers.js';

describe('blog mappers', () => {
  // Les valeurs optionnelles d'un brouillon ou ancien article ne doivent jamais casser une carte.
  it('produit une carte complète avec les valeurs de repli', () => {
    const post = mapBlogPost({
      id: 3,
      slug: 'emploi-ia',
      title: 'Les métiers de l’IA',
      published_at: '2026-08-20T08:00:00Z',
    });
    expect(post).toMatchObject({
      id: 3,
      image: '/assets/images/fallback.webp',
      author: 'Alt Formation',
      link: '/blog/emploi-ia',
      readTime: null,
    });
    expect(post.date).toContain('2026');
  });

  it('conserve les métadonnées éditoriales fournies', () => {
    expect(mapBlogPost({
      slug: 'article',
      title: 'Article',
      category_name: 'Orientation professionnelle longue',
      author_name: ' Ada Lovelace ',
      cover_image_url: '/cover.webp',
      read_time_mins: 7,
    })).toMatchObject({
      categoryShort: 'Orientation pr',
      author: 'Ada Lovelace',
      image: '/cover.webp',
      readTime: '7 min',
    });
  });

  it('déduplique les catégories API et celles des articles', () => {
    expect(mapBlogCategories(
      [{ category: 'IA' }, { category: 'RH' }, { category: 'IA' }, { category: '' }],
      [{ name: 'RH' }, { name: 'Emploi' }],
    )).toEqual(['Tous', 'RH', 'Emploi', 'IA']);
  });
});

describe('pricing mapper', () => {
  // Les métadonnées récentes et les descriptions historiques sont toutes deux supportées.
  it('préfère le libellé et les métadonnées métier', () => {
    expect(mapPricingPlansToBilanFormules([{
      plan_code: 'essentiel',
      label: 'Bilan Essentiel',
      amount_eur: '1600.00',
      description: 'Base',
      meta: { heures: 16, resume: 'Diagnostic', programme: 'Programme', modalite: 'Distanciel' },
    }])).toEqual([expect.objectContaining({
      nom: 'Essentiel',
      prix: 1600,
      heures: 16,
      resume: 'Diagnostic',
      programme: 'Programme',
    })]);
  });

  it('utilise le code et les valeurs de repli si les métadonnées manquent', () => {
    expect(mapPricingPlansToBilanFormules([{
      plan_code: 'premium',
      amount_eur: '2100',
      description: 'Accompagnement complet',
    }])[0]).toEqual({
      nom: 'Premium',
      heures: null,
      prix: 2100,
      resume: 'Accompagnement complet',
      programme: 'Accompagnement complet',
      dureeDetails: [],
      situations: [],
      modalite: '',
    });
    expect(mapPricingPlansToBilanFormules([])).toBeNull();
    expect(mapPricingPlansToBilanFormules(null)).toBeNull();
  });
});

describe('career mappers', () => {
  // La continuité du site est garantie même si l'API carrières devient indisponible.
  it('mappe une offre API et sa date', () => {
    expect(mapCareerSummary({
      id: 9,
      slug: 'formateur-ia',
      department: 'formateur',
      title: 'Formateur IA',
      contract_type: 'Freelance',
      location: 'Paris',
      published_at: '2026-08-20T08:00:00Z',
    })).toMatchObject({ poste: 'Formateur IA', type: 'Freelance', source: 'api' });
  });

  it('retourne les offres statiques si la base est vide', () => {
    const staticOffers = getStaticCareerOffers('collaborateur');
    expect(staticOffers.length).toBeGreaterThan(0);
    expect(staticOffers.every((offer) => offer.source === 'static')).toBe(true);
    expect(getStaticCareerOffers('departement-inconnu')).toEqual([]);
    expect(mergeCareerOffers([], 'collaborateur')).toEqual(staticOffers);
  });

  it('fusionne les remplacements BDD et les nouvelles offres', () => {
    // Ce jeu couvre à la fois l'écrasement par slug et l'ajout d'un slug inédit.
    const existing = getStaticCareerOffers('collaborateur')[0];
    const databaseOffers = [
      { ...existing, poste: 'Remplacé par la BDD', source: 'api' },
      { slug: 'nouvelle-offre', poste: 'Nouvelle', source: 'api' },
    ];
    const merged = mergeCareerOffers(databaseOffers, 'collaborateur');
    expect(merged.find((offer) => offer.slug === existing.slug)?.poste).toBe('Remplacé par la BDD');
    expect(merged.at(-1).slug).toBe('nouvelle-offre');
  });

  it('indexe et adapte une offre statique pour la page détail', () => {
    const index = getStaticOffersIndex();
    const [slug, offer] = index.entries().next().value;
    expect(findStaticOfferBySlug(slug)).toEqual(offer);
    expect(findStaticOfferBySlug('')).toBeNull();
    expect(findStaticOfferBySlug('absente')).toBeNull();
    expect(mapCareerOfferForDetail(offer)).toMatchObject({ slug, source: 'static' });
    expect(mapCareerOfferForDetail(null)).toBeNull();
  });

  it('complète une offre API avec sa description statique', () => {
    const staticOffer = getStaticOffersIndex().values().next().value;
    const merged = mergeCareerOfferWithStatic({
      slug: staticOffer.slug,
      title: 'Titre BDD',
      published_at: '2026-08-20T08:00:00Z',
    }, staticOffer.slug);
    expect(merged).toMatchObject({
      title: 'Titre BDD',
      source: 'api',
      department: staticOffer.department,
      short_description: staticOffer.short_description,
    });
    expect(merged.dateLabel).toContain('2026');
  });
});
