export { faqHero } from './hero.js';
import formation from './formation.js';
import financement from './financement.js';
import bilan from './bilan.js';
import certificationTests from './certification-tests.js';
import recrutementCarriere from './recrutement-carriere.js';
import qualiopiOrganisme from './qualiopi-organisme.js';

export const faqCategories = [
  formation,
  financement,
  bilan,
  certificationTests,
  recrutementCarriere,
  qualiopiOrganisme,
];

/** @param {string} id */
export function getFaqCategoryById(id) {
  return faqCategories.find((c) => c.id === id) ?? null;
}
