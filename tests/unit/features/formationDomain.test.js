/**
 * Tests du cœur métier formation : normalisation, regroupement, modalités et mapping.
 * Les exemples mélangent données actuelles et formats historiques encore acceptés.
 */
import { describe, expect, it } from 'vitest';
import {
  FALLBACK_FORMATION_IMAGE,
  buildCatalogueFromCourses,
  buildNavMegaData,
  buildNavlinksFromMegaData,
  courseTypeBadge,
  getCourseCategorySlug,
  getCourseImage,
  getCourseModalites,
  getCourseRepertoire,
  getFormationCatalogCategory,
  normalizeCourseType,
} from '../../../src/features/formations/domain/catalog.js';
import {
  mapFormationCard,
  mapFormationCourseToDetail,
} from '../../../src/features/formations/domain/formationMappers.js';
import {
  getModaliteBadgeLabel,
  inferFormationModalites,
  matchesModaliteFilter,
  normalizeModalites,
} from '../../../src/features/formations/utils/formationModalites.js';

// Fixture minimale réutilisable ; chaque test ne surcharge que le comportement observé.
function course(overrides = {}) {
  return {
    id: 1,
    slug: 'formations-developpeur-web-mobile',
    title: 'Développeur web et mobile',
    subtitle: 'Titre professionnel',
    course_type: 'diplomante',
    category_slug: 'digital-developpement',
    category_name: 'Développement',
    duration: '12 mois',
    sort_order: 1,
    ...overrides,
  };
}

describe('règles du catalogue de formations', () => {
  // Les fonctions sont testées par comportement, sans reproduire leurs détails internes.
  it('normalise les types et leurs badges', () => {
    expect(normalizeCourseType('CERTIFIANTE')).toBe('certifiante');
    expect(normalizeCourseType('courte')).toBe('elearning');
    expect(normalizeCourseType('inconnu')).toBe('diplomante');
    expect(courseTypeBadge('certifiante')).toBe('Certifiante');
    expect(courseTypeBadge('elearning')).toBe('E-Learning');
    expect(courseTypeBadge()).toBe('Diplômante');
  });

  it('résout la catégorie, l’image et le répertoire de certification', () => {
    expect(getFormationCatalogCategory('formations-developpeur-web-mobile')).toBe('digital-developpement');
    expect(getFormationCatalogCategory('slug-inconnu')).toBeNull();
    expect(getCourseCategorySlug({ categorySlug: 'ia-data' })).toBe('ia-data');
    expect(getCourseCategorySlug({ category_slug: 'devops' })).toBe('devops');
    expect(getCourseCategorySlug({ slug: 'slug-inconnu' })).toBe('autre');
    expect(getCourseImage({ presentation_image_url: '/formation.webp' })).toBe('/formation.webp');
    expect(getCourseImage({ category_slug: 'ia-data' })).toContain('/assets/images/');
    expect(getCourseImage({ category_slug: 'inconnue' })).toBe(FALLBACK_FORMATION_IMAGE);
    expect(getCourseRepertoire({ rncp_repertoire: 'RS' })).toBe('RS');
    expect(getCourseRepertoire({ rncp_code: 'RS1234' })).toBe('RS');
    expect(getCourseRepertoire({ rncp_code: '40123' })).toBe('RNCP');
    expect(getCourseRepertoire({})).toBeNull();
  });

  it('impose le distanciel aux formations e-learning', () => {
    expect(getCourseModalites({ course_type: 'elearning' })).toEqual(['distanciel']);
    expect(getCourseModalites({ course_type: 'diplomante', modality_label: 'Mixte' }))
      .toEqual(['presentiel', 'distanciel']);
  });

  it('regroupe et trie les formations selon le périmètre demandé', () => {
    const courses = [
      course({ id: 3, slug: 'z', title: 'Zeta', sort_order: 20 }),
      course({ id: 2, slug: 'a', title: 'Alpha', sort_order: 10, course_type: 'certifiante', category_slug: 'ia-data' }),
      course({ id: 4, slug: 'e', title: 'E-learning', course_type: 'elearning', category_slug: 'ressources-humaines' }),
    ];

    const combined = buildCatalogueFromCourses(courses);
    expect(combined).toHaveLength(1);
    expect(combined[0].id).toBe('digital-ia-devops');
    expect(combined[0].items.map((item) => item.title)).toEqual(['Alpha', 'Zeta']);
    expect(buildCatalogueFromCourses(courses, { scope: 'certifiantes' })[0].items).toHaveLength(1);
    expect(buildCatalogueFromCourses(courses, { scope: 'diplomantes' })[0].items).toHaveLength(1);
    expect(buildCatalogueFromCourses(courses, { scope: 'elearning' })[0].items[0].title).toBe('E-learning');
  });

  it('construit la navigation à partir du même catalogue', () => {
    const courses = [
      mapFormationCard(course()),
      mapFormationCard(course({ id: 2, slug: 'cours-ia', course_type: 'elearning', category_slug: 'ia-data' })),
    ];
    const megaData = buildNavMegaData(courses);
    const links = buildNavlinksFromMegaData(megaData);
    expect(megaData.megaMenuCombinedDiplCertRows).toHaveLength(1);
    expect(megaData.megaMenuFormations.elearning).toHaveLength(1);
    expect(links[0]).toMatchObject({ label: 'Formations', href: '/formations' });
    expect(links[0].submenu).toHaveLength(2);
  });
});

describe('modalités de formation', () => {
  // Les entrées structurées et la déduction depuis du texte libre sont toutes deux couvertes.
  it('préfère une valeur métier explicite et supprime les doublons', () => {
    expect(inferFormationModalites({ modalitesCatalogue: ['distanciel', 'distanciel', 'invalid'] }))
      .toEqual(['distanciel']);
  });

  it.each([
    ['Formation mixte', ['presentiel', 'distanciel']],
    ['Cours distanciel', ['distanciel']],
    ['Cours en presentiel', ['presentiel']],
    ['Modalité à préciser', ['presentiel', 'distanciel']],
  ])('déduit les modalités depuis "%s"', (text, expected) => {
    expect(inferFormationModalites({ hero: { sousTitre: text } })).toEqual(expected);
  });

  it('normalise les entrées invalides et fournit les badges', () => {
    expect(normalizeModalites(null)).toEqual(['presentiel', 'distanciel']);
    expect(normalizeModalites(['invalid'])).toEqual(['presentiel', 'distanciel']);
    expect(getModaliteBadgeLabel(['presentiel', 'distanciel'])).toBe('Mixte');
    expect(getModaliteBadgeLabel(['presentiel'])).toBe('Présentiel');
    expect(getModaliteBadgeLabel(['distanciel'])).toBe('Distanciel');
    expect(matchesModaliteFilter(['distanciel'], 'all')).toBe(true);
    expect(matchesModaliteFilter(['distanciel'], 'presentiel')).toBe(false);
    expect(matchesModaliteFilter(['distanciel'], 'distanciel')).toBe(true);
  });
});

describe('mappers des formations', () => {
  // Le modèle léger des cartes et le modèle riche de détail ont des contrats distincts.
  it('produit un modèle de carte stable pour les composants React', () => {
    expect(mapFormationCard(course({
      course_type: 'certifiante',
      rncp_code: 'RS1234',
      presentation_image_url: '/image.webp',
    }))).toMatchObject({
      titre: 'Développeur web et mobile',
      href: '/formation/formations-developpeur-web-mobile',
      imageUrl: '/image.webp',
      typeBadge: 'Certifiante',
      courseType: 'certifiante',
      repertoireTitre: 'RS',
      codeTitre: 'RS1234',
    });
  });

  it('adapte une formation complète sans perdre les données métier', () => {
    const detail = mapFormationCourseToDetail(course({
      course_type: 'certifiante',
      presentation_text: JSON.stringify(['Paragraphe 1', 'Paragraphe 2']),
      extra_json: JSON.stringify({ ctaFinal: { titre: 'CTA spécifique', boutons: [] } }),
      rncp_code: '40123',
      rncp_title: 'Titre RNCP',
      modules: [{ id: 5, title: 'Module 1', duration: '10 h' }],
      skills: [{ name: 'JavaScript' }],
      jobs: [
        { title: 'Développeur', salary_min: 30000, salary_max: 40000 },
        { title: 'Intégrateur', salary_min: 28000 },
        { title: 'Consultant' },
      ],
      stats: [{ label: 'Rythme', value: 'Alternance', icon: 'clock' }],
      objectives: [{ content: 'Concevoir une application' }],
      info_blocks: [
        { block_type: 'modalites', title: 'Modalités', points: [{ content: 'Présentiel' }] },
        { block_type: 'prerequis', title: 'Prérequis', points: [{ content: 'Bac' }] },
        { block_type: 'financement', title: 'Financement', points: [] },
        { block_type: 'methodologie', title: 'Méthode', points: [] },
        { block_type: 'pour_qui', title: 'Public', points: [] },
        { block_type: 'accessibilite', title: 'Accessibilité', points: [] },
      ],
    }));

    expect(detail).toMatchObject({
      source: 'api',
      type: 'certifiante',
      competences: ['JavaScript'],
      objectifs: ['Concevoir une application'],
      certificationOfficielle: { code: '40123', intituleOfficiel: 'Titre RNCP' },
      ctaFinal: { titre: 'CTA spécifique', boutons: [] },
    });
    expect(detail.presentation.paragraphes).toEqual(['Paragraphe 1', 'Paragraphe 2']);
    expect(detail.programme.modules[0]).toMatchObject({ titre: 'Module 1', duree: '10 h' });
    expect(detail.debouches.postes.map((job) => job.salaire)).toEqual([
      '30000 - 40000 EUR',
      'à partir de 28000 EUR',
      'Selon expérience',
    ]);
    expect(detail.infosPratiques.accessibilite.titre).toBe('Accessibilité');
  });

  it('résiste aux JSON invalides et construit des statistiques de repli', () => {
    // Reproduit une ligne issue d'une migration incomplète ou d'une ancienne base.
    const detail = mapFormationCourseToDetail(course({
      extra_json: '{invalid',
      presentation_text: '{invalid',
      modality_label: 'Présentiel',
      price: 1500,
      skills: [{ name: 'React' }, { name: '' }],
      jobs: [],
      modules: [],
    }));
    expect(detail.extra).toEqual({});
    expect(detail.presentation.paragraphes).toBe('{invalid');
    expect(detail.stats.map((stat) => stat.label)).toEqual(['Durée', 'Modalité', 'Tarif', 'Compétences']);
    expect(detail.certificationOfficielle).toBeNull();
    expect(detail.ctaFinal.boutons[0].url).toBe('/contact');
  });
});
