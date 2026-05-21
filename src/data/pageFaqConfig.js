import { matchPath } from 'react-router-dom';
import { getFormationCatalogCategory } from './navdata';

/** Pages sans mini-FAQ (contenu légal uniquement). */
const LEGAL_PATHS = new Set([
    '/mentions-legales',
    '/politique-de-confidentialite',
    '/conditions-generales',
    '/reglement-interieur',
]);

/** Texte question + réponse (filtres ciblés). */
export function faqQaPlainText(qa) {
    return `${qa.q} ${qa.a}`;
}

/** Sous-ensemble « formation » pour la page Ressources IA uniquement (rubrique Formation). */
const formationIaDataFilter = (qa) =>
    /\bIA\b|intelligence artificielle|machine learning|formation data|\bdata\b|GPT|big data/i.test(faqQaPlainText(qa));

const FAQ_FILTERS_BY_CATALOG = {
    'ia-data': formationIaDataFilter,
    'cybersecurite-reseaux': (qa) =>
        /cyber|Cybersécurité|pentest|SOC\b|réseaux|sécurité informatique/i.test(faqQaPlainText(qa)),
    'digital-developpement': (qa) =>
        /développe|web|applicatif|logiciel|numérique|digital|concepteur|graphiste/i.test(faqQaPlainText(qa)),
    devops: (qa) => /DevOps|docker|Kubernetes|CI\/CD|livraison continue|infra|cloud/i.test(faqQaPlainText(qa)),
    devsecops: (qa) =>
        /DevOps|docker|Kubernetes|cyber|SOC|sécurité informatique/i.test(faqQaPlainText(qa)),
    bureautique: (qa) => /Excel|TOSA|Word|Office|bureaut/i.test(faqQaPlainText(qa)),
    'ressources-humaines': (qa) =>
        /\bRH\b|ressources humaines|alternance|apprentissage|contrat d'apprentissage|professionnalisation|tutorat|insertion professionnelle/i.test(
            faqQaPlainText(qa),
        ),
    'comptabilite-gestion': (qa) =>
        /comptab|gestion|fiscal|commercial|immobilier|import|export|secrétaire\b/i.test(faqQaPlainText(qa)),
};

/**
 * FAQ en bas de page : uniquement les rubriques `faqSite`
 * (`formation`, `financement`, `bilan`, `certification-tests`, `recrutement-carriere`, `qualiopi-organisme`)
 * et seulement sur les pages dont le sujet correspond.
 *
 * Pas d’autre rubrique ajoutée. Pas de bloc FAQ sur accueil, blog, contact, entreprise, etc.
 *
 * Props optionnelles `maxQuestions` / `maxQuestionsPerCategory` permettent encore de plafonner
 * le nombre de questions chargées (après filtres) si besoin ; par défaut on charge tout le thème.
 *
 * @param {string} pathname
 * @returns {import('../components/FaqSection').FaqSectionProps | null}
 */
export function getFaqSectionProps(pathname) {
    if (pathname === '/faq') return null;
    if (LEGAL_PATHS.has(pathname)) return null;

    const formationMatch = matchPath('/formation/:id', pathname);
    if (formationMatch?.params?.id) {
        const cat = getFormationCatalogCategory(formationMatch.params.id);
        const formationFilter = cat && FAQ_FILTERS_BY_CATALOG[cat] ? FAQ_FILTERS_BY_CATALOG[cat] : null;
        return {
            categoryIds: ['formation', 'financement'],
            ...(formationFilter ? { filtersByCategoryId: { formation: formationFilter } } : {}),
        };
    }

    const byPath = {
        '/formations': { categoryId: 'formation' },
        '/alternance': { categoryId: 'formation' },
        '/financements': { categoryId: 'financement' },
        '/a-propos': { categoryId: 'qualiopi-organisme' },
        '/campus': { categoryId: 'formation' },
        '/certification': { categoryId: 'certification-tests' },
        '/carrieres': { categoryId: 'recrutement-carriere' },
        '/bilan-de-competences': { categoryId: 'bilan' },
        '/ressources-ia': {
            categoryId: 'formation',
            filtersByCategoryId: { formation: formationIaDataFilter },
        },
        '/nous-rejoindre': { categoryId: 'recrutement-carriere' },
        '/demarche-pedagogique': { categoryId: 'formation' },
        '/demarche-qualite': { categoryId: 'qualiopi-organisme' },
        '/demarche-rse': { categoryId: 'qualiopi-organisme' },
        '/situation-handicap': { categoryId: 'qualiopi-organisme' },
    };

    return byPath[pathname] ?? null;
}
