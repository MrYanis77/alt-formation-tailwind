/**
 * Génère src/data/json/faq.json à partir des données Alt RH Formations.
 * Exécution : node scripts/make-faq-data.mjs
 */
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const hero = {
  titre: 'Foire Aux Questions',
  sousTitre:
    'Trouvez rapidement les réponses à vos questions sur nos formations, financements, certifications et services Alt RH Formations.',
  video: '/assets/video/formations/administration.mp4',
};

function cat(id, categorie, pairs) {
  return {
    id,
    categorie,
    questions: pairs.map(([q, a]) => ({ q, a })),
  };
}

// Paires [question, réponse] — texte décodé (apostrophes & esperluettes)
const F = [
  [
    "Qu'est-ce qu'une formation professionnelle continue ?",
    "La formation continue s'adresse aux personnes qui sont déjà entrées dans la vie active (salariés, demandeurs d'emploi, indépendants). Elle leur permet d'acquérir de nouvelles compétences, de se reconvertir ou de faire évoluer leur carrière.",
  ],
  [
    'Quelle est la différence entre formation initiale et formation continue ?',
    "La formation initiale s'adresse aux étudiants ou élèves avant leur entrée dans le monde du travail. La formation continue s'adresse aux actifs pour actualiser ou développer leurs compétences tout au long de leur vie.",
  ],
  [
    "Qui peut bénéficier des formations d'Alt RH Formations ?",
    'Nos formations sont ouvertes à tous les profils d\'actifs : salariés du secteur privé ou public, demandeurs d\'emploi, indépendants, chefs d\'entreprise, ainsi que les jeunes en alternance.',
  ],
  [
    "Comment s'inscrire à l'une de vos formations ?",
    "L'inscription se fait directement en ligne via notre site alt-rh.com, par téléphone avec un conseiller, ou directement via votre compte CPF si la formation y est éligible.",
  ],
  [
    'Quels sont les prérequis généraux pour intégrer vos cursus ?',
    'Les prérequis varient selon chaque formation. Ils sont explicitement détaillés sur chaque fiche programme (niveau d\'études, expérience professionnelle ou maîtrise d\'outils spécifiques).',
  ],
  [
    'Vos formations sont-elles accessibles entièrement à distance (e-learning) ?',
    'Oui, Alt RH Formations propose une large gamme de formations en e-learning, accessibles 24h/24 et 7j/7 via notre plateforme dédiée.',
  ],
  [
    "Qu'est-ce que le blended learning ou apprentissage mixte ?",
    "C'est un format qui combine des sessions de formation en ligne autonome (e-learning) et des sessions d'accompagnement ou de cours en présentiel ou en classe virtuelle avec un formateur.",
  ],
  [
    "Quelle est la durée moyenne d'une formation continue ?",
    'La durée est variable : de quelques heures (pour des modules courts de perfectionnement) à plusieurs mois pour des parcours certifiants complets.',
  ],
  [
    'Fournissez-vous une attestation de fin de formation ?',
    "Oui, une attestation de fin de formation mentionnant les objectifs, la nature et la durée de l'action, ainsi que les résultats des évaluations, est obligatoirement remise à chaque stagiaire.",
  ],
  [
    'Comment sont évalués les acquis au cours de la formation ?',
    'Nous utilisons des évaluations formatives en cours de parcours (quiz, cas pratiques, mises en situation) et une évaluation sommative ou un examen final pour valider la formation.',
  ],
  [
    'Peut-on suivre une formation en dehors de son temps de travail ?',
    "Tout à fait. Les formations à distance (e-learning) ou certaines sessions du soir/week-end permettent de se former sans impacter son activité professionnelle actuelle.",
  ],
  [
    'Quels sont les profils de vos formateurs ?',
    'Nos formateurs sont tous des professionnels experts de leur domaine, disposant d\'une solide expérience terrain et de compétences pédagogiques éprouvées et certifiées.',
  ],
  [
    'Comment assurez-vous la qualité de vos formations ?',
    "Notre organisme est certifié Qualiopi, ce qui garantit la conformité de nos processus pédagogiques aux exigences réglementaires de l'État français.",
  ],
  [
    'Proposez-vous des formations sur mesure pour les entreprises (intra-entreprise) ?',
    'Oui, nous concevons des programmes sur mesure adaptés aux besoins spécifiques, aux valeurs et aux objectifs de votre entreprise.',
  ],
  [
    "Quelle est la différence entre une formation inter-entreprise et intra-entreprise ?",
    'Une formation inter-entreprise réunit des stagiaires de différentes structures. Une formation intra-entreprise est dédiée exclusivement aux salariés d\'une seule et même entreprise.',
  ],
  [
    'Comment se déroule l\'accueil des personnes en situation de handicap ?',
    'Alt RH Formations dispose d\'un référent handicap dédié. Nous adaptons nos modalités pédagogiques et l\'accès à nos locaux ou outils numériques pour garantir l\'accessibilité de tous.',
  ],
  [
    "Quels sont les délais d'accès à vos formations ?",
    'Le délai moyen est de 15 jours entre la demande de formation et l\'entrée effective en stage, sous réserve de la validation du financement.',
  ],
  [
    'Puis-je annuler ou reporter mon inscription ?',
    "Oui, l'annulation ou le report est possible selon les conditions générales de vente (CGV) détaillées sur notre site, généralement sans frais jusqu'à 10 jours ouvrés avant le début.",
  ],
  [
    'Comment sont mis à jour vos programmes de formation ?',
    'Nos programmes font l\'objet d\'une veille réglementaire, technologique et pédagogique constante pour s\'aligner sur les exigences actuelles du marché du travail.',
  ],
  [
    'Vos formations mènent-elles à des métiers qui recrutent ?',
    'Oui, nous orientons en priorité notre catalogue vers des compétences en forte tension (RH, management, digital, commercial, gestion de carrière).',
  ],
  [
    "Quel est le taux de satisfaction de vos apprenants ?",
    'Le taux de satisfaction global d\'Alt RH Formations est supérieur à 94%, mis à jour régulièrement sur notre site internet.',
  ],
  [
    'Proposez-vous un accompagnement post-formation ?',
    'Oui, nous offrons un suivi post-formation (accès à la communauté, sessions de questions-réponses ou ressources complémentaires) pour faciliter l\'ancrage des connaissances.',
  ],
  [
    'Les supports de cours sont-ils fournis aux stagiaires ?',
    'Tous les supports pédagogiques, guides pratiques, fiches de synthèse et accès numériques sont inclus dans le prix de la formation et remis aux stagiaires.',
  ],
  [
    'Peut-on suivre plusieurs formations en même temps ?',
    "C'est possible techniquement mais fortement déconseillé afin de garantir une assimilation optimale des compétences et une charge de travail équilibrée.",
  ],
  [
    "Comment s'organise une journée type de formation en présentiel ?",
    'Une journée type dure généralement 7 heures, alternant apports théoriques (30%) et ateliers pratiques ou exercices collaboratifs (70%), avec des pauses régulières.',
  ],
];

const A = [
  [
    "Qu'est-ce que l'alternance ?",
    "L'alternance est un système de formation qui associe des périodes d'apprentissage théorique en centre de formation et des périodes de pratique professionnelle en entreprise.",
  ],
  [
    "Quelle est la différence entre contrat d'apprentissage et contrat de professionnalisation ?",
    "L'apprentissage relève de la formation initiale (visant un diplôme d'État ou titre RNCP) tandis que le contrat de professionnalisation relève de la formation continue (visant une qualification professionnelle précise).",
  ],
  [
    "Quel est l'âge limite pour entrer en contrat d'apprentissage ?",
    'La limite d\'âge est généralement de 29 ans révolus, sauf dérogations (travailleur handicapé, création d\'entreprise, sportif de haut niveau, etc.) où il n\'y a pas de limite.',
  ],
  [
    'Qui peut signer un contrat de professionnalisation ?',
    'Les jeunes de 16 à 25 ans révolus, les demandeurs d\'emploi de 26 ans et plus, ainsi que les bénéficiaires de minima sociaux (RSA, AAH, etc.).',
  ],
  [
    "Quel est le rythme d'alternance chez Alt RH Formations ?",
    'Nos rythmes sont adaptés aux besoins des entreprises : par exemple 1 semaine en centre / 3 semaines en entreprise, ou 2 jours en centre / 3 jours en entreprise selon la filière.',
  ],
  [
    "Comment trouver une entreprise d'accueil pour son alternance ?",
    'Il convient de cibler les entreprises en lien avec le métier visé, de postuler aux offres dédiées et de solliciter votre réseau. Alt RH Formations vous accompagne également dans cette démarche.',
  ],
  [
    'Alt RH Formations aide-t-elle les candidats à trouver une entreprise ?',
    'Oui, notre équipe de chargés de relations entreprises propose des ateliers de coaching (CV, entretien) et partage régulièrement les offres de nos entreprises partenaires.',
  ],
  [
    "Quel est le statut de l'alternant en entreprise ?",
    "L'alternant est un salarié à part entière, avec les mêmes droits (tickets restaurants, mutuelle, congés) et devoirs que les autres collaborateurs.",
  ],
  [
    'Un alternant a-t-il droit aux congés payés ?',
    'Oui, comme tout salarié, l\'alternant bénéficie de 2,5 jours de congés payés par mois de travail effectif, soit 5 semaines par an.',
  ],
  [
    'Comment est rémunéré un apprenti en 2026 ?',
    "La rémunération est un pourcentage du SMIC calculé selon l'âge de l'apprenti et sa progression dans le cycle de formation (de 27% à 100% du SMIC).",
  ],
  [
    'Quelle est la rémunération en contrat de professionnalisation ?',
    'Elle varie selon l\'âge et le niveau de diplôme initial du salarié, allant de 65% à 100% du SMIC ou du salaire minimum conventionnel.',
  ],
  [
    'Qui prend en charge le coût de la formation en alternance ?',
    "Le coût de la formation est intégralement pris en charge par l'OPCO de l'entreprise d'accueil. L'alternant ne paye aucuns frais de scolarité.",
  ],
  [
    "Qu'est-ce que le maître d'apprentissage ou tuteur ?",
    "C'est le salarié de l'entreprise désigné pour encadrer l'alternant, transmettre ses compétences, et faire le lien avec Alt RH Formations.",
  ],
  [
    "Quel est le rôle du tuteur en entreprise ?",
    "Il guide l'alternant dans ses missions au quotidien, veille à son intégration, évalue sa progression professionnelle et participe aux bilans de suivi.",
  ],
  [
    'Peut-on rompre un contrat d\'alternance ?',
    'Oui, durant la période d\'essai (45 jours de présence en entreprise pour l\'apprentissage), la rupture est libre. Au-delà, elle nécessite un accord amiable ou une procédure spécifique.',
  ],
  [
    'Quelle est la durée de la période d\'essai en alternance ?',
    "Pour un contrat d'apprentissage, elle est de 45 jours consécutifs ou non de formation pratique en entreprise. Pour un contrat de professionnalisation, elle suit le droit commun.",
  ],
  [
    "L'alternance est-elle ouverte aux personnes en situation de handicap ?",
    'Oui, avec des aménagements possibles de la durée du contrat, du rythme pédagogique, et des aides financières spécifiques de l\'AGEFIPH.',
  ],
  [
    'Quels sont les avantages de l\'alternance pour un employeur ?',
    'Former un futur collaborateur à ses méthodes, intégrer de nouvelles compétences à moindre coût et bénéficier d\'exonérations de charges ou d\'aides à l\'embauche.',
  ],
  [
    'Existe-t-il des aides financières pour les entreprises qui recrutent en alternance ?',
    "Oui, des aides d'État spécifiques ou des primes exceptionnelles sont régulièrement accordées pour soutenir l'embauche de contrats d'apprentissage et de professionnalisation.",
  ],
  [
    'Comment se déroulent les examens pour les alternants ?',
    'Ils se déroulent sous forme de contrôle continu tout au long de l\'année et/ou d\'examens terminaux oraux et écrits devant un jury professionnel.',
  ],
  [
    'Peut-on faire de l\'alternance dans le secteur public ?',
    'Oui, les administrations publiques (mairies, ministères, hôpitaux) peuvent recruter des apprentis, sous des conditions spécifiques de rémunération.',
  ],
  [
    "Qu'est-ce que le livret d'apprentissage numérique ?",
    "C'est un outil en ligne qui permet de suivre la progression de l'alternant, de consigner ses missions et de fluidifier la communication entre le tuteur, l'école et l'apprenant.",
  ],
  [
    'Peut-on effectuer son alternance en télétravail ?',
    'Oui, si l\'activité s\'y prête et que l\'entreprise le pratique, à condition que le tuteur puisse assurer l\'encadrement à distance de manière rigoureuse.',
  ],
  [
    "Que se passe-t-il si l'entreprise fait faillite en cours de contrat ?",
    "Le centre de formation accompagne l'alternant pour lui permettre de poursuivre ses cours tout en l'aidant à retrouver d'urgence une nouvelle entreprise d'accueil.",
  ],
  [
    "Quel est le taux d'insertion professionnelle après une alternance chez vous ?",
    'Plus de 82% de nos diplômés en alternance trouvent un emploi stable (CDI ou CDD de plus de 6 mois) dans les 6 mois suivant leur diplôme.',
  ],
];

const T = [
  [
    "Qu'est-ce qu'un test de positionnement avant formation ?",
    "C'est une évaluation initiale réalisée en amont de l'entrée en formation pour mesurer vos connaissances actuelles et adapter votre parcours pédagogique.",
  ],
  [
    'Le test de positionnement est-il obligatoire ?',
    'Oui, dans le cadre de notre démarche Qualiopi, il est obligatoire afin de valider l\'adéquation entre votre profil, vos objectifs et le programme choisi.',
  ],
  [
    'Sous quelle forme se déroulent ces tests ?',
    "Il s'agit généralement de questionnaires à choix multiples (QCM), d'études de cas courtes ou d'entretiens techniques individuels menés à distance.",
  ],
  [
    'Combien de temps dure un test de positionnement ?',
    'En moyenne, un test dure entre 20 et 45 minutes selon la complexité des compétences à évaluer.',
  ],
  [
    'Puis-je échouer à un test de positionnement ?',
    "Non, il ne s'agit pas d'un examen éliminatoire mais d'un outil de diagnostic pour personnaliser au mieux votre futur parcours de formation.",
  ],
  [
    'Les tests se font-ils sur table ou en ligne ?',
    'Pour plus de flexibilité, la grande majorité de nos tests de positionnement sont accessibles en ligne via notre plateforme sécurisée.',
  ],
  [
    'Quand dois-je passer ce test de positionnement ?',
    'Il doit être réalisé après la validation de votre projet d\'inscription et impérativement avant le premier jour de la formation.',
  ],
  [
    "Qu'évalue-t-on dans un test de positionnement managérial ?",
    'Nous évaluons vos postures de communication, votre style de leadership face à des situations concrètes et votre connaissance des outils clés de gestion d\'équipe.',
  ],
  [
    'Les tests de positionnement en langues sont-ils alignés sur le CECRL ?',
    'Oui, nos tests en langues (anglais, espagnol, allemand) mesurent votre niveau selon la grille européenne de A1 à C2.',
  ],
  [
    'Comment sont utilisés les résultats par les formateurs ?',
    'Les résultats permettent au formateur d\'identifier les forces et axes d\'amélioration du groupe pour adapter le rythme et insister sur les notions clés.',
  ],
  [
    'Puis-je avoir accès à mes résultats détaillés ?',
    'Oui, un compte rendu de votre positionnement initial vous est partagé et commenté par votre conseiller pédagogique.',
  ],
  [
    'Le test de positionnement peut-il raccourcir ma formation ?',
    'Oui, si vos compétences initiales sont déjà très avancées sur certains modules, une individualisation peut réduire la durée totale du parcours (allègement de formation).',
  ],
  [
    "Qu'est-ce qu'une évaluation formative ?",
    "C'est une évaluation continue tout au long de la formation (quiz, exercices) servant à mesurer votre progression et à réajuster la pédagogie en temps réel.",
  ],
  [
    "Qu'est-ce qu'une évaluation sommative ?",
    "C'est l'évaluation finale qui intervient au terme de la formation pour valider l'acquisition globale des compétences et délivrer le certificat.",
  ],
  [
    "Quelle est la différence entre évaluation à chaud et à froid ?",
    "L'évaluation à chaud mesure votre satisfaction immédiate en fin de stage. L'évaluation à froid (à 3 ou 6 mois) mesure l'impact réel de la formation sur votre poste de travail.",
  ],
  [
    'Les tests de positionnement intègrent-ils des tests de logique ?',
    'Seulement pour certaines filières techniques ou de gestion de projet qui nécessitent des aptitudes analytiques spécifiques.',
  ],
  [
    'Comment sont sécurisées les sessions de tests en ligne ?',
    'Nos tests en ligne utilisent des plateformes chiffrées garantissant la stricte confidentialité de vos réponses et de vos données personnelles.',
  ],
  [
    'Le niveau informatique est-il testé pour le e-learning ?',
    'Oui, un rapide test d\'aisance numérique est prévu pour s\'assurer que vous saurez naviguer sereinement sur notre plateforme d\'apprentissage.',
  ],
  [
    'Que se passe-t-il si mon niveau est jugé insuffisant lors du test ?',
    'Nous vous proposerons un module de mise à niveau ou une orientation vers une formation plus adaptée à vos bases actuelles.',
  ],
  [
    'Qui conçoit vos tests de positionnement ?',
    'Ils sont conçus sur mesure par nos ingénieurs pédagogiques et nos formateurs experts en s\'appuyant sur les référentiels de compétences officiels.',
  ],
  [
    'Puis-je repasser un test de positionnement ?',
    'Le principe du positionnement étant de mesurer le niveau de départ réel, il ne se passe qu\'une seule fois par projet de formation.',
  ],
  [
    'Quels outils de test utilisez-vous pour les compétences bureautiques ?',
    'Nous utilisons des outils reconnus comme TOSA ou ENI qui simulent des cas réels directement sur Excel, Word ou PowerPoint.',
  ],
  [
    'Les tests mesurent-ils aussi les soft skills ?',
    'Oui, pour les modules de management et de ressources humaines, des questions de mise en situation comportementale sont intégrées.',
  ],
  [
    "Y a-t-il un entretien oral après le test écrit ?",
    'Pour la plupart des parcours certifiants, le test en ligne est complété par un entretien de 15 minutes avec un conseiller.',
  ],
  [
    'Le coût du test de positionnement est-il facturé à part ?',
    "Non, l'ingénierie de positionnement initial est totalement intégrée dans les frais généraux de la formation.",
  ],
];

// Suite dans make-faq-data-part2.mjs — import dynamique pour garder des fichiers lisibles
const part2 = await import('./make-faq-data-part2.mjs');

const categories = [
  cat('formations', 'Formations professionnelles & continues (généralités)', F),
  cat('alternance', 'Alternance (apprentissage & professionnalisation)', A),
  cat('tests-positionnement', 'Tests de positionnement & évaluations', T),
  ...part2.extraCategories(),
];

const out = [{ hero }, ...categories];
const dest = join(__dirname, '../src/data/json/faq.json');
writeFileSync(dest, JSON.stringify(out, null, 4), 'utf8');
console.log('Written', dest, 'categories:', categories.length);
