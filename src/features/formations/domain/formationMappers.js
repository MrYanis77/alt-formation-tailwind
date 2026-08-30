/** Adaptateurs purs entre les lignes de l'API formations et les modèles de vues React. */
import {
  courseTypeBadge,
  getCourseCategorySlug,
  getCourseImage,
  getCourseModalites,
  getCourseRepertoire,
  normalizeCourseType,
} from './catalog.js';

// Les colonnes JSON historiques peuvent être vides ou malformées : aucun parse ne doit casser la page.
function parseJson(value, fallback = null) {
  if (!value || typeof value !== 'string') return fallback;
  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

// Une présentation accepte historiquement un texte simple ou un tableau JSON de paragraphes.
function parseParagraphs(value) {
  const parsed = parseJson(value);
  if (Array.isArray(parsed)) return parsed.filter(Boolean);
  if (typeof parsed === 'string') return parsed;
  return value || '';
}

// Convertit la liste SQL typée en objet indexé, plus simple à consommer dans les composants.
function mapInfoBlocks(blocks = []) {
  const output = {};
  blocks.forEach((block) => {
    const type = block.block_type || 'autre';
    const mapped = {
      titre: block.title || '',
      points: (block.points || []).map((point) => point.content).filter(Boolean),
    };
    // Certains noms français diffèrent du snake_case stocké en base.
    if (type === 'modalites') output.modalites = mapped;
    else if (type === 'prerequis') output.prerequis = mapped;
    else if (type === 'financement') output.financement = mapped;
    else if (type === 'methodologie') output.methodologie = mapped;
    else if (type === 'pour_qui') output.pourQui = mapped;
    else output[type] = mapped;
  });
  return output;
}

/** Préfère les statistiques éditoriales, puis en calcule à partir des champs disponibles. */
function mapStats(course, skills) {
  const apiStats = (course.stats || [])
    .map((stat) => ({ label: stat.label, value: stat.value, icon: stat.icon }))
    .filter((stat) => stat.label && stat.value);

  if (apiStats.length > 0) return apiStats;

  // Ce repli garantit une section informative même pour les anciennes formations.
  const stats = [];
  if (course.duration) stats.push({ label: 'Durée', value: course.duration });
  if (course.modality_label) stats.push({ label: 'Modalité', value: course.modality_label });
  if (course.price) stats.push({ label: 'Tarif', value: `${course.price} EUR` });
  if (skills.length) stats.push({ label: 'Compétences', value: `${skills.length} compétences` });
  if (course.rncp_code) {
    stats.push({
      label: 'Certification',
      value: course.rncp_title || `${course.rncp_repertoire || 'RNCP'} ${course.rncp_code}`,
    });
  }
  return stats;
}

/** Modèle léger utilisé par catalogue, filtres et navigation. */
export function mapFormationCard(course) {
  const slug = course.slug;
  const courseType = normalizeCourseType(course.course_type);
  return {
    ...course,
    id: course.id,
    slug,
    title: course.title,
    titre: course.title,
    subtitle: course.subtitle || '',
    href: `/formation/${slug}`,
    image: getCourseImage(course),
    imageUrl: getCourseImage(course),
    typeBadge: courseTypeBadge(courseType),
    categorySlug: getCourseCategorySlug(course),
    categoryLabel: course.category_name || '',
    duration: course.duration,
    price: course.price,
    status: course.status,
    courseType,
    repertoireTitre: getCourseRepertoire(course),
    codeTitre: course.rncp_code || null,
    modalites: getCourseModalites({ ...course, courseType }),
  };
}

/** Modèle riche utilisé exclusivement par la page détaillée d'une formation. */
export function mapFormationCourseToDetail(course) {
  const slug = course.slug;
  const courseType = normalizeCourseType(course.course_type);
  const extra = parseJson(course.extra_json, {}) || {};
  // L'index fournit un identifiant de rendu stable si l'API historique n'en renvoie pas.
  const modules = (course.modules || []).map((module, index) => ({
    id: module.id ?? index + 1,
    titre: module.titre || module.title,
    description: module.description || '',
    duree: module.duree || module.duration || '',
  }));

  // Les trois formes de salaire possibles sont ramenées à une chaîne présentable.
  const jobs = (course.jobs || []).map((job) => ({
    titre: job.title,
    salaire:
      job.salary_label ||
      (job.salary_min && job.salary_max
        ? `${job.salary_min} - ${job.salary_max} EUR`
        : job.salary_min
          ? `à partir de ${job.salary_min} EUR`
          : 'Selon expérience'),
  }));

  const skills = (course.skills || []).map((skill) => skill.name).filter(Boolean);
  const stats = mapStats(course, skills);
  const image = getCourseImage(course);

  // Sans code officiel, la section certification doit être explicitement absente.
  const certificationOfficielle = course.rncp_code
    ? {
        repertoire: course.rncp_repertoire || 'RNCP',
        code: course.rncp_code,
        intituleOfficiel: course.rncp_title || course.title,
        niveau: course.rncp_level,
        url: course.rncp_url || '',
      }
    : null;

  return {
    source: 'api',
    id: slug,
    slug,
    titre: course.title,
    categorie: getCourseCategorySlug(course),
    type: courseType === 'elearning' ? 'courte' : courseType === 'certifiante' ? 'certifiante' : 'longue',
    hero: {
      titre: course.title,
      sousTitre: course.subtitle || '',
      video: course.video_url || '',
    },
    stats,
    presentation: {
      titre: course.presentation_title || 'Présentation',
      paragraphes: parseParagraphs(course.presentation_text) || course.subtitle || '',
      image,
    },
    infosPratiques: mapInfoBlocks(course.info_blocks || []),
    objectifs: (course.objectives || []).map((item) => item.content).filter(Boolean),
    debouches: {
      titre: course.debouches_title || 'Les métiers visés',
      sousTitre: course.debouches_subtitle || (jobs.length ? '' : 'Contactez-nous pour en savoir plus.'),
      postes: jobs,
      secteurs: course.debouches_sectors || course.category_name || '',
    },
    metiersVises: jobs.map((job) => job.titre).filter(Boolean),
    programme: {
      dureeTotale: course.programme_duration_total || course.duration || '',
      modules,
    },
    competences: skills,
    certificationOfficielle,
    cta: {
      titre: course.cta_title || 'Intéressé par cette formation ?',
      sousTitre: course.cta_subtitle || 'Contactez nos conseillers.',
    },
    // Le CTA éditorial stocké dans extra_json est prioritaire sur le CTA générique.
    ctaFinal: extra.ctaFinal || {
      titre: course.cta_title || 'Intéressé par cette formation ?',
      sousTitre: course.cta_subtitle || 'Contactez nos conseillers.',
      boutons: [{ label: "S'inscrire maintenant", url: '/contact' }],
    },
    extra,
    meta: {
      title: course.meta_title || course.title,
      description: course.meta_description || course.subtitle || '',
    },
  };
}
