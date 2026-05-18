import { matchPath } from 'react-router-dom';

const LEGAL_PATHS = new Set([
    '/mentions-legales',
    '/politique-de-confidentialite',
    '/conditions-generales',
    '/reglement-interieur',
]);

/**
 * Props pour `FaqSection`, ou `null` si aucun bloc FAQ (page FAQ dédiée, légal, hors périmètre).
 * @param {string} pathname
 */
export function getFaqSectionProps(pathname) {
    if (pathname === '/faq') return null;
    if (LEGAL_PATHS.has(pathname)) return null;

    if (matchPath('/formation/:id', pathname)) {
        return { categoryId: 'formations', maxQuestions: 4 };
    }

    const byPath = {
        '/accueil': {
            categoryIds: ['formations', 'financement'],
            maxQuestionsPerCategory: 2,
            maxQuestions: 2,
        },
        '/formations': { categoryId: 'formations', maxQuestions: 4 },
        '/alternance': { categoryId: 'alternance', maxQuestions: 4 },
        '/financements': { categoryId: 'financement', maxQuestions: 4 },
        '/entreprise': { categoryId: 'entreprise', maxQuestions: 4 },
        '/a-propos': { categoryId: 'entreprise', maxQuestions: 4 },
        '/blog': { categoryId: 'blog', maxQuestions: 4 },
        '/contact': { categoryId: 'contact', maxQuestions: 4 },
        '/campus': { categoryId: 'campus', maxQuestions: 4 },
        '/certification': { categoryId: 'certification', maxQuestions: 4 },
        '/carrieres': {
            categoryIds: ['bilan', 'formations'],
            maxQuestionsPerCategory: 2,
            maxQuestions: 2,
        },
        '/bilan-de-competences': { categoryId: 'bilan', maxQuestions: 4 },
        '/ressources-ia': { categoryId: 'ia', maxQuestions: 4 },
        '/nous-rejoindre': { categoryId: 'recrutement', maxQuestions: 4 },
    };

    return byPath[pathname] ?? null;
}
