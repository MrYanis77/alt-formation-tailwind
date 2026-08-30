import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_CATALOGUE_FILTERS,
  STORAGE_KEY,
  clearCatalogueFilters,
  getCatalogueTypeFromUrl,
  getModaliteFromUrl,
  parseDomainFromHash,
  readCatalogueFilters,
  resolveCatalogueFilters,
  writeCatalogueFilters,
} from '../../../src/utils/catalogueFiltersSession.js';
import { mapCertificationOfficielleToCertif } from '../../../src/utils/mapCertificationOfficielle.js';
import {
  FALLBACK_IMAGE,
  WIDTHS,
  buildWebpSrcSet,
  hasLocalWebpVariants,
  parseAssetImagePath,
  webpVariantSrc,
} from '../../../src/utils/responsiveImage.js';

function storageDouble() {
  const values = new Map();
  return {
    getItem: vi.fn((key) => values.get(key) ?? null),
    setItem: vi.fn((key, value) => values.set(key, value)),
    removeItem: vi.fn((key) => values.delete(key)),
  };
}

beforeEach(() => vi.stubGlobal('sessionStorage', storageDouble()));
afterEach(() => vi.unstubAllGlobals());

describe('images responsives', () => {
  it('distingue les images externes, locales et invalides', () => {
    expect(FALLBACK_IMAGE).toContain('fallback');
    expect(WIDTHS).toEqual([400, 800, 1200]);
    expect(parseAssetImagePath()).toBeNull();
    expect(parseAssetImagePath(42)).toBeNull();
    expect(parseAssetImagePath('https://cdn.test/image.jpg')).toEqual({
      external: true,
      src: 'https://cdn.test/image.jpg',
    });
    expect(parseAssetImagePath('data:image/png;base64,AA')).toEqual({
      external: true,
      src: 'data:image/png;base64,AA',
    });
    expect(parseAssetImagePath('/sans-extension')).toBeNull();
    expect(parseAssetImagePath('/assets/images/equipe-800w.JPG?cache=1')).toMatchObject({
      external: false,
      dir: '/assets/images/',
      baseName: 'equipe',
      ext: 'jpg',
    });
  });

  it('genere uniquement les variantes WebP des images locales optimisables', () => {
    const source = '/assets/images/equipe.jpg';
    expect(hasLocalWebpVariants(source)).toBe(true);
    expect(hasLocalWebpVariants('/images/equipe.jpg')).toBe(false);
    expect(hasLocalWebpVariants('/assets/images/equipe.webp')).toBe(false);
    expect(hasLocalWebpVariants('http://cdn.test/equipe.jpg')).toBe(false);
    expect(webpVariantSrc(source, 800)).toBe('/assets/images/equipe-800w.webp');
    expect(webpVariantSrc('/image.webp', 800)).toBeNull();
    expect(buildWebpSrcSet(source, [320, 640])).toBe(
      '/assets/images/equipe-320w.webp 320w, /assets/images/equipe-640w.webp 640w',
    );
    expect(buildWebpSrcSet('/image.webp')).toBeNull();
  });
});

describe('certification officielle', () => {
  it('refuse une certification incomplete', () => {
    expect(mapCertificationOfficielleToCertif(null, 'formation')).toBeNull();
    expect(mapCertificationOfficielleToCertif({ code: 'RNCP1' }, 'formation')).toBeNull();
  });

  it('normalise les champs affiches', () => {
    expect(mapCertificationOfficielleToCertif({
      code: 'RS123',
      url: 'https://example.test/rs123',
      repertoire: 'RS',
      niveau: 6,
    }, 'formation-ia', {
      categorie: 'IA',
      hero: { titre: 'Expert IA' },
      imageUrl: '/ia.webp',
    })).toEqual({
      nom: 'Expert IA',
      rncp: 'RS123',
      repertoire: 'RS',
      niveau: '6',
      category: 'IA',
      href: '/formation/formation-ia',
      lienFranceCompetence: 'https://example.test/rs123',
      imageUrl: '/ia.webp',
    });
  });

  it('applique les valeurs de repli', () => {
    expect(mapCertificationOfficielleToCertif({ code: 'RNCP1', url: '/rncp' }, 'f'))
      .toMatchObject({ nom: 'Certification professionnelle', repertoire: 'RNCP', niveau: '', imageUrl: null });
  });
});

describe('filtres de catalogue en session', () => {
  it('interprete les types et domaines historiques de l URL', () => {
    expect(getCatalogueTypeFromUrl('#diplomantes-rh')).toBe('diplomantes');
    expect(getCatalogueTypeFromUrl('', 'certifiantes')).toBe('certifiantes');
    expect(getCatalogueTypeFromUrl('#inconnu')).toBe('all');
    expect(parseDomainFromHash('#diplomantes-devops')).toBe('catalogue-digital-ia-devops');
    expect(parseDomainFromHash('#certifiantes-comptabilite-gestion')).toBe('catalogue-ressources-humaines');
    expect(parseDomainFromHash('#catalogue-ia-data')).toBe('catalogue-digital-ia-devops');
    expect(parseDomainFromHash('#catalogue-rh')).toBe('catalogue-rh');
    expect(parseDomainFromHash('#autre')).toBeNull();
    expect(parseDomainFromHash('#catalogue')).toBeNull();
    expect(getModaliteFromUrl('presentiel')).toBe('presentiel');
    expect(getModaliteFromUrl('hybride')).toBe('all');
  });

  it('lit, nettoie, fusionne et efface les filtres', () => {
    expect(readCatalogueFilters()).toEqual(DEFAULT_CATALOGUE_FILTERS);

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
      q: `  ${'x'.repeat(140)}  `,
      repertoire: 'INVALID',
      domain: 'catalogue-rh',
      type: 'certifiantes',
      modalite: 'distanciel',
    }));
    const filters = readCatalogueFilters();
    expect(filters).toMatchObject({
      q: 'x'.repeat(120),
      repertoire: 'all',
      domain: 'catalogue-rh',
      type: 'certifiantes',
      modalite: 'distanciel',
    });

    expect(writeCatalogueFilters({ q: '  data  ', domain: 'invalide' })).toMatchObject({
      q: 'data',
      domain: 'all',
    });
    clearCatalogueFilters();
    expect(sessionStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
  });

  it('resiste a un stockage indisponible ou corrompu', () => {
    sessionStorage.getItem.mockImplementation(() => { throw new Error('blocked'); });
    sessionStorage.setItem.mockImplementation(() => { throw new Error('blocked'); });
    sessionStorage.removeItem.mockImplementation(() => { throw new Error('blocked'); });
    expect(readCatalogueFilters()).toEqual(DEFAULT_CATALOGUE_FILTERS);
    expect(writeCatalogueFilters({ q: 'test' })).toBeNull();
    expect(() => clearCatalogueFilters()).not.toThrow();

    const broken = storageDouble();
    broken.getItem.mockReturnValue('{bad json');
    vi.stubGlobal('sessionStorage', broken);
    expect(readCatalogueFilters()).toEqual(DEFAULT_CATALOGUE_FILTERS);
  });

  it('donne la priorite aux filtres presents dans l URL', () => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
      q: 'emploi',
      repertoire: 'RS',
      domain: 'catalogue-rh',
      type: 'certifiantes',
      modalite: 'presentiel',
    }));

    expect(resolveCatalogueFilters('#diplomantes-devops', null, 'distanciel')).toEqual({
      q: 'emploi',
      repertoire: 'RS',
      domain: 'catalogue-digital-ia-devops',
      type: 'diplomantes',
      modalite: 'distanciel',
      needsTypeNavigation: false,
      typeToNavigate: 'certifiantes',
    });

    expect(resolveCatalogueFilters('', null, null)).toMatchObject({
      domain: 'catalogue-rh',
      type: 'certifiantes',
      modalite: 'presentiel',
      needsTypeNavigation: true,
    });
  });
});
