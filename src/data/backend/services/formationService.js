import {
  findCourseJobs,
  findCourseModules,
  findCourseSkills,
  findFormationCategories,
  findFormationCourses,
} from '../repositories/formationRepository.js';

async function attachCourseDetails(course) {
  const [modules, skills, jobs] = await Promise.all([
    findCourseModules(course.id),
    findCourseSkills(course.id),
    findCourseJobs(course.id),
  ]);

  return {
    ...course,
    modules,
    skills,
    jobs,
  };
}

export async function getFormationCatalog({ siteId, publishedOnly }) {
  const [categories, courses] = await Promise.all([
    findFormationCategories({ siteId, publishedOnly }),
    findFormationCourses({ siteId, publishedOnly }),
  ]);

  const enrichedCourses = await Promise.all(courses.map(attachCourseDetails));

  return {
    categories,
    courses: enrichedCourses,
    formations: enrichedCourses,
  };
}

export async function getFormationBySlug({ siteId, slug, publishedOnly }) {
  const courses = await findFormationCourses({ siteId, slug, publishedOnly });
  if (courses.length === 0) return null;

  return attachCourseDetails(courses[0]);
}
