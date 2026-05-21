/**
 * Génère les fichiers src/data/faqSite/*.js
 * Exécution : node scripts/generate-faq-site.mjs
 */
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import {
  formationExtra,
  financementExtra,
  bilanExtra,
  certificationExtra,
  recrutementExtra,
  qualiopiPairs,
} from './faq-site-extensions.mjs';

function appendPairs(category, pairs) {
  category.questions.push(...pairs.map(([q, a]) => ({ q, a })));
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '../src/data/faqSite');

mkdirSync(outDir, { recursive: true });

function cat(id, order, theme, categorie, pairs) {
  return { id, order, theme, categorie, questions: pairs.map(([q, a]) => ({ q, a })) };
}

const formation = cat(
  'formation',
  1,
  'Formation',
  'Formations professionnelles, continues & numériques',
  [
    [
      "Qu'est-ce qu'une formation professionnelle continue ?",
      "La formation professionnelle continue s'adresse aux personnes qui sont déjà entrées dans la vie active (salariés, demandeurs d'emploi, indépendants). Elle leur permet d'acquérir de nouvelles compétences, de se reconvertir ou de faire évoluer leur carrière.",
    ],
    [
      'Quelle est la différence entre formation initiale et formation continue ?',
      "La formation initiale s'adresse aux étudiants ou élèves avant leur entrée dans le monde du travail. La formation continue s'adresse aux actifs pour actualiser ou développer leurs compétences tout au long de leur vie professionnelle.",
    ],
    [
      "Qui peut bénéficier des formations d'Alt RH Formations ?",
      "Les formations sont ouvertes à tous les profils d'actifs : salariés du secteur privé ou public, demandeurs d'emploi, indépendants, chefs d'entreprise, ainsi que les jeunes en alternance.",
    ],
    [
      "Comment s'inscrire à l'une de vos formations ?",
      "L'inscription se fait directement en ligne via le site alt-rh.com, par téléphone avec un conseiller, ou directement via votre compte CPF si la formation y est éligible.",
    ],
    [
      'Quels sont les prérequis pour intégrer un cursus ?',
      "Les prérequis varient selon chaque formation et sont explicitement détaillés sur chaque fiche programme (niveau d'études, expérience professionnelle ou maîtrise d'outils spécifiques). Un test de positionnement permet de les vérifier.",
    ],
    [
      'Les formations sont-elles accessibles à distance (e-learning) ?',
      'Oui, Alt RH Formations propose une large gamme de formations en e-learning accessibles 24h/24 et 7j/7 via une plateforme dédiée. Des formats hybrides et des classes virtuelles complètent l\'offre.',
    ],
    [
      "Qu'est-ce que le blended learning ?",
      "C'est un format qui combine des sessions de formation en ligne autonome (e-learning) et des sessions d'accompagnement ou de cours en présentiel ou en classe virtuelle avec un formateur.",
    ],
    [
      "Quelle est la durée moyenne d'une formation continue ?",
      'La durée est variable : de quelques heures (modules courts de perfectionnement) à plusieurs mois pour des parcours certifiants complets.',
    ],
    [
      'Fournissez-vous une attestation de fin de formation ?',
      "Oui, une attestation de fin de formation mentionnant les objectifs, la nature et la durée de l'action, ainsi que les résultats des évaluations, est remise à chaque stagiaire.",
    ],
    [
      'Comment sont évalués les acquis en cours de formation ?',
      "Des évaluations formatives sont réalisées en cours de parcours (quiz, cas pratiques, mises en situation) ainsi qu'une évaluation sommative ou un examen final pour valider la formation.",
    ],
    [
      'Peut-on suivre une formation en dehors des heures de travail ?',
      "Tout à fait. Les formations à distance (e-learning) ou certaines sessions du soir/week-end permettent de se former sans impacter son activité professionnelle actuelle.",
    ],
    [
      'Quels sont les profils de vos formateurs ?',
      "Les formateurs sont des professionnels experts de leur domaine, disposant d'une solide expérience terrain et de compétences pédagogiques éprouvées.",
    ],
    [
      'Comment est assurée la qualité des formations ?',
      "L'organisme est certifié Qualiopi, ce qui garantit la conformité des processus pédagogiques aux exigences réglementaires de l'État français.",
    ],
    [
      'Proposez-vous des formations sur mesure intra-entreprise ?',
      'Oui, des programmes sur mesure sont conçus après analyse du besoin, adaptés aux outils, enjeux métiers et contraintes internes de chaque entreprise.',
    ],
    [
      'Quelle est la différence entre formation inter et intra-entreprise ?',
      "La formation inter-entreprises regroupe des participants de différentes structures autour d'un programme commun. La formation intra-entreprise est organisée pour une seule entreprise et peut être entièrement adaptée à ses besoins.",
    ],
    [
      "Quels délais d'accès à vos formations ?",
      'Le délai moyen est de 15 jours entre la demande de formation et l\'entrée effective en stage, sous réserve de la validation du financement.',
    ],
    [
      'Peut-on annuler ou reporter une inscription ?',
      "Oui, l'annulation ou le report est possible selon les conditions générales de vente (CGV), généralement sans frais jusqu'à 10 jours ouvrés avant le début.",
    ],
    [
      'Vos formations mènent-elles à des métiers qui recrutent ?',
      'Oui, le catalogue est orienté vers des compétences en forte tension : RH, management, digital, commercial, gestion de carrière, numérique et cybersécurité.',
    ],
    [
      'Quel est le taux de satisfaction de vos apprenants ?',
      'Le taux de satisfaction global est supérieur à 94 %, mis à jour régulièrement sur le site internet.',
    ],
    [
      'Proposez-vous un accompagnement post-formation ?',
      'Oui, un suivi post-formation est proposé (accès communauté, sessions de questions-réponses ou ressources complémentaires) pour faciliter l\'ancrage des connaissances.',
    ],
    [
      'Quels sont les avantages des formations numériques proposées ?',
      "L'offre couvre le développement web, les applications, les systèmes et réseaux, le cloud, la cybersécurité, le DevOps, l'IA, la data et l'UX/UI design — des domaines à forte demande d'emploi.",
    ],
    [
      'Pourquoi se former à la cybersécurité ?',
      'Les organisations sont exposées aux rançongiciels, fuites de données et attaques ciblées. Se former permet de comprendre les risques, appliquer les bonnes pratiques et renforcer la protection des systèmes d\'information.',
    ],
    [
      'Une formation IA nécessite-t-elle de savoir coder ?',
      "Pas toujours. Certaines formations sont conçues pour les utilisateurs métiers. D'autres, plus techniques, s'adressent aux profils data ou développeurs souhaitant manipuler des modèles, API et pipelines.",
    ],
    [
      "Qu'est-ce qu'une formation data ?",
      'Une formation data vise la collecte, la préparation, l\'analyse et la visualisation de données. Elle peut inclure Excel avancé, SQL, Python, tableaux de bord et initiation au machine learning selon le niveau visé.',
    ],
    [
      "Comment mesurer l'efficacité d'une formation ?",
      "L'efficacité se mesure par la satisfaction, l'acquisition de compétences, la mise en pratique, les résultats d'évaluation, l'évolution professionnelle et les retours de l'entreprise. Les indicateurs doivent être définis en amont.",
    ],
    [
      "Qu'est-ce qu'une formation en alternance ?",
      "L'alternance est un mode de formation qui combine périodes en entreprise et périodes en centre de formation. Elle prépare à un titre ou diplôme professionnel tout en acquérant une expérience pratique rémunérée.",
    ],
    [
      'Quelle différence entre contrat d\'apprentissage et contrat de professionnalisation ?',
      "Le contrat d'apprentissage vise l'obtention d'un diplôme ou titre RNCP et s'adresse principalement aux jeunes de 16 à 29 ans. Le contrat de professionnalisation vise l'insertion ou la reconversion des demandeurs d'emploi et salariés, avec plus de souplesse d'âge et de contenu.",
    ],
    [
      'Quels avantages pour une entreprise qui recrute un alternant ?',
      "L'entreprise bénéficie d'aides financières (aide unique apprentissage, exonérations de charges), d'un profil formé à ses pratiques, d'un accès aux compétences numériques récentes et d'une démarche structurée de transmission des savoir-faire.",
    ],
  ]
);

const financement = cat(
  'financement',
  2,
  'Financement',
  'CPF, France Travail, OPCO, employeurs & autres financeurs',
  [
    [
      "Qu'est-ce que le CPF (Compte Personnel de Formation) ?",
      "Le CPF est un compte individuel permettant à toute personne active d'accumuler des droits à la formation tout au long de sa carrière. Ces droits sont exprimés en euros et peuvent être utilisés pour financer des formations éligibles.",
    ],
    [
      'Qui alimente le CPF et de combien ?',
      "Le CPF est alimenté automatiquement à hauteur de 500 € par année de travail à temps plein, dans la limite d'un plafond de 5 000 € (800 €/an et 8 000 € de plafond pour les travailleurs peu qualifiés).",
    ],
    [
      'Comment vérifier le solde de son CPF ?',
      "Vous pouvez consulter votre solde sur le site moncompteformation.gouv.fr en vous identifiant avec votre numéro de sécurité sociale. L'application mobile Mon Compte Formation offre les mêmes fonctionnalités.",
    ],
    [
      'Toutes les formations sont-elles éligibles au CPF ?',
      "Non, seules les formations certifiantes enregistrées au RNCP ou au RS (Répertoire Spécifique) sont finançables via le CPF. La formation doit être référencée sur la plateforme moncompteformation.gouv.fr.",
    ],
    [
      'Le CPF peut-il financer un bilan de compétences ?',
      "Oui, le bilan de compétences est une prestation éligible au CPF à condition que le prestataire soit certifié Qualiopi et que le bilan soit référencé sur la plateforme Mon Compte Formation.",
    ],
    [
      'Comment utiliser son CPF pour une formation Alt RH Formations ?',
      "Il vous suffit de vous connecter sur moncompteformation.gouv.fr, de rechercher la formation souhaitée, de valider votre inscription et de payer avec vos droits CPF. Notre équipe peut vous accompagner dans cette démarche.",
    ],
    [
      'Que se passe-t-il si mon solde CPF est insuffisant ?',
      "Vous pouvez compléter le financement via d'autres sources : participation de votre employeur, abondement OPCO, financement France Travail ou prise en charge partielle personnelle.",
    ],
    [
      "Qu'est-ce que France Travail (ex-Pôle Emploi) peut financer ?",
      "France Travail peut financer tout ou partie de vos formations si vous êtes demandeur d'emploi. Les dispositifs incluent l'AREF (aide au retour à l'emploi formation), le FIF, les AIF (aides individuelles à la formation) ou des conventions régionales.",
    ],
    [
      'Comment demander une prise en charge à France Travail ?',
      "Vous devez vous rapprocher de votre conseiller France Travail, lui présenter un devis et expliquer en quoi la formation correspond à votre projet professionnel. Une demande d'AIF peut être initiée pour les formations hors CPF.",
    ],
    [
      "Qu'est-ce qu'un OPCO ?",
      "Un Opérateur de Compétences (OPCO) est un organisme agréé par l'État qui collecte les contributions formation des entreprises et finance les actions de formation des salariés et des alternants. Il en existe 11 selon les secteurs d'activité.",
    ],
    [
      'Comment savoir à quel OPCO appartient mon entreprise ?',
      "L'OPCO de rattachement est déterminé par la convention collective applicable dans l'entreprise. Vous pouvez le retrouver sur le site opco.fr ou en contactant directement le service RH de votre entreprise.",
    ],
    [
      "L'OPCO peut-il prendre en charge la totalité du coût d'une formation ?",
      "Cela dépend des plafonds de prise en charge par heure et du budget disponible sur votre compte OPCO. Dans certains cas, l'OPCO finance 100 % du coût pédagogique, notamment pour les entreprises de moins de 50 salariés.",
    ],
    [
      "Qu'est-ce que le plan de développement des compétences ?",
      "C'est le document établi par l'employeur qui recense toutes les actions de formation prévues pour ses salariés sur une période donnée. Il peut être co-financé par l'OPCO selon les priorités sectorielles définies.",
    ],
    [
      "Un salarié peut-il se former sans l'accord de son employeur ?",
      "Oui, sur son temps personnel avec son CPF. En revanche, si la formation se déroule sur le temps de travail, un accord préalable de l'employeur est nécessaire (sauf dans le cadre du CPF de transition professionnelle).",
    ],
    [
      "Qu'est-ce que le CPF de transition professionnelle (ex-CIF) ?",
      "Le CPF de transition professionnelle permet de financer une formation longue certifiante dans le cadre d'un projet de reconversion, tout en maintenant sa rémunération (sous conditions). Il est instruit par la Commission Paritaire Interprofessionnelle Régionale (CPIR/Transitions Pro).",
    ],
    [
      'Peut-on cumuler plusieurs financements pour une même formation ?',
      "Oui, le co-financement est possible et même encouragé : CPF + OPCO, CPF + employeur, CPF + France Travail. Le montant total ne peut toutefois pas dépasser le coût réel de la formation.",
    ],
    [
      'Les formations en alternance sont-elles financées différemment ?',
      "Oui, les formations en alternance sont financées par les OPCO selon un coût-contrat fixé par France compétences. L'entreprise n'a en général rien à débourser pour la formation elle-même.",
    ],
    [
      "Existe-t-il d'autres aides pour financer une formation ?",
      "Oui : les aides régionales (via les Conseils régionaux), les fonds sectoriels, les dispositifs pour les créateurs d'entreprise (ACRE), les bourses de certaines branches professionnelles et les aides des FAF (Fonds d'Assurance Formation) pour les indépendants.",
    ],
    [
      'Comment les travailleurs indépendants peuvent-ils financer leur formation ?',
      "Les indépendants, auto-entrepreneurs et professions libérales peuvent utiliser leur CPF et/ou solliciter le FAF correspondant à leur activité (FIFPL, AGEFICE, FAFCEA, etc.) pour obtenir une prise en charge complémentaire.",
    ],
    [
      'Quelles pièces justificatives sont généralement demandées pour un dossier de financement ?',
      "Selon le financeur : devis ou convention de formation, justificatif d'inscription, pièce d'identité, attestation d'inscription à France Travail (si demandeur d'emploi), contrat de travail ou KBIS (pour les indépendants).",
    ],
    [
      "Qu'est-ce qu'un devis de formation et pourquoi en demander un ?",
      "Le devis précise le périmètre, le prix, la durée, les modalités, les dates et les conditions de réalisation. Il est indispensable pour constituer un dossier de financement auprès d'un employeur, d'un OPCO, de France Travail ou d'un autre financeur.",
    ],
    [
      'Le financement de la formation peut-il être refusé ?',
      "Oui, un financeur peut refuser une prise en charge si la formation ne correspond pas aux priorités de financement, si le dossier est incomplet ou si les délais ne sont pas respectés. Il est conseillé d'anticiper les demandes.",
    ],
    [
      'Dans quel délai faut-il déposer un dossier de financement ?',
      "Les délais varient selon le financeur : en général 15 jours à 1 mois avant le début de la formation pour un OPCO, et plusieurs semaines pour France Travail ou Transitions Pro. Il vaut mieux anticiper au maximum.",
    ],
    [
      'Alt RH Formations accompagne-t-il dans le montage des dossiers de financement ?',
      "Oui, un conseiller dédié peut vous accompagner dans l'identification du bon financement et la constitution du dossier. Cet accompagnement est inclus dans le processus d'inscription.",
    ],
  ]
);

const bilan = cat(
  'bilan',
  3,
  'Bilan de compétences',
  'Méthodologie, déroulement & accompagnement',
  [
    [
      "Qu'est-ce qu'un bilan de compétences ?",
      "Un bilan de compétences est une prestation réglementée qui permet à un actif d'analyser ses compétences professionnelles et personnelles, ses aptitudes et ses motivations, afin de définir un projet professionnel et, si nécessaire, un plan de formation.",
    ],
    [
      "Qui peut bénéficier d'un bilan de compétences ?",
      "Tout actif peut en bénéficier : salarié du secteur privé ou public, demandeur d'emploi, travailleur indépendant ou personne en reconversion. La demande peut être à l'initiative du salarié ou de l'employeur (avec accord du salarié).",
    ],
    [
      "Quelle est la durée d'un bilan de compétences ?",
      "Un bilan de compétences dure au maximum 24 heures, réparties sur plusieurs semaines. Il se déroule en trois phases : préliminaire, investigation et conclusion.",
    ],
    [
      'Comment se déroule la phase préliminaire ?',
      "La phase préliminaire confirme l'engagement du bénéficiaire, analyse ses besoins, lui présente les conditions et méthodes du bilan, et s'assure que le contexte est adapté à la démarche.",
    ],
    [
      "En quoi consiste la phase d'investigation ?",
      "C'est la phase la plus longue : elle explore les compétences, savoir-faire, savoir-être, motivations, valeurs, intérêts professionnels et personnels. Elle s'appuie sur des entretiens, des tests et des exercices d'introspection.",
    ],
    [
      'Que contient la phase de conclusion ?',
      "La phase de conclusion présente les résultats, valide le projet professionnel, identifie les étapes de mise en œuvre et formule des recommandations (formation, réseau, stratégie de recherche d'emploi, mobilité).",
    ],
    [
      'Quels tests sont utilisés pendant un bilan de compétences ?',
      "Selon le prestataire et le projet, on peut utiliser des tests de personnalité (MBTI, Big Five, DISC), d'intérêts professionnels (Holland), de valeurs, d'aptitudes cognitives ou des outils d'auto-évaluation des compétences.",
    ],
    [
      'Le bilan de compétences est-il confidentiel ?',
      "Oui, les résultats et documents du bilan appartiennent au bénéficiaire. L'employeur ne peut en aucun cas avoir accès aux informations issues du bilan sans l'accord écrit du salarié.",
    ],
    [
      'Peut-on réaliser un bilan de compétences à distance ?',
      "Oui, un bilan de compétences peut se dérouler entièrement à distance par visioconférence, sous réserve que les conditions de confidentialité et de qualité d'accompagnement soient respectées.",
    ],
    [
      'Quelle est la différence entre un bilan de compétences et un coaching professionnel ?',
      "Le bilan de compétences est une prestation réglementée, encadrée par le Code du travail, avec un cadre strict (phases, durée, synthèse). Le coaching est un accompagnement libre, non réglementé, axé sur l'atteinte d'objectifs définis.",
    ],
    [
      'Comment financer un bilan de compétences ?',
      "Le bilan peut être financé par le CPF (s'il est référencé sur Mon Compte Formation), par l'employeur via le plan de développement des compétences, par France Travail pour les demandeurs d'emploi, ou par un OPCO.",
    ],
    [
      "Quel document est remis à l'issue d'un bilan de compétences ?",
      "Un document de synthèse est obligatoirement remis au bénéficiaire. Il reprend les compétences analysées, le projet professionnel retenu, les étapes de mise en œuvre et les ressources mobilisables.",
    ],
    [
      'Un bilan de compétences peut-il déboucher sur une formation ?',
      "Oui, c'est souvent l'une des recommandations : identifier une formation certifiante ou professionnalisante en lien avec le projet défini. Alt RH Formations peut proposer un parcours formation dans la continuité du bilan.",
    ],
    [
      'Le bilan de compétences peut-il aider à préparer une reconversion ?',
      "Oui, c'est l'un de ses objectifs prioritaires. Il permet de valider la faisabilité d'un projet de reconversion, d'identifier les compétences transférables, les formations nécessaires et les risques à anticiper.",
    ],
    [
      'Peut-on faire un bilan de compétences sans en parler à son employeur ?',
      "Oui, si la démarche est initiée sur le temps personnel (hors temps de travail) et financée par le CPF. Dans ce cas, l'employeur n'a pas à être informé.",
    ],
    [
      'Combien coûte un bilan de compétences ?',
      "Le coût varie entre 1 500 € et 3 000 € selon la durée et le prestataire. Le CPF couvre généralement tout ou une grande partie de ce coût pour les prestataires référencés sur Mon Compte Formation.",
    ],
    [
      'Quand est-il recommandé de faire un bilan de compétences ?',
      "Il est recommandé lors d'un questionnement sur l'orientation professionnelle, en cas de souhait de reconversion, avant une demande de formation longue, après un licenciement, ou à tout moment où l'on souhaite faire le point sur sa carrière.",
    ],
    [
      'Comment choisir son prestataire de bilan de compétences ?',
      "Il faut vérifier la certification Qualiopi du prestataire, son expérience dans votre secteur, les méthodes utilisées, la disponibilité des consultants et les avis d'anciens bénéficiaires. Un entretien préalable gratuit est souvent possible.",
    ],
    [
      'Quels outils psychométriques sont fiables pour un bilan de compétences ?',
      "Les outils validés scientifiquement comme le MBTI, le Big Five (OCEAN), le DISC ou l'inventaire Holland sont les plus utilisés. Ils doivent être interprétés par un consultant formé et certifié à leur utilisation.",
    ],
    [
      'Un bilan de compétences peut-il être réalisé en groupe ?',
      "Non, le bilan de compétences est un accompagnement strictement individuel. Les échanges entre bénéficiaire et consultant restent personnels et confidentiels.",
    ],
  ]
);

const certificationTests = cat(
  'certification-tests',
  4,
  'Certification & Tests métiers',
  'RNCP, RS, évaluations, VAE & tests de positionnement',
  [
    [
      "Qu'est-ce qu'une certification professionnelle ?",
      "Une certification professionnelle est un document officiel attestant qu'une personne maîtrise un ensemble de compétences définies dans un référentiel. Elle peut prendre la forme d'un titre professionnel, d'un diplôme, d'une licence professionnelle ou d'une certification de compétences.",
    ],
    [
      'Quelle est la différence entre RNCP et RS ?',
      "Le RNCP (Répertoire National des Certifications Professionnelles) recense les titres et diplômes reconnus par l'État. Le RS (Répertoire Spécifique) recense des certifications de compétences complémentaires (ex. : bureautique, langues, soft skills) qui ne sont pas des diplômes mais qui sont éligibles au CPF.",
    ],
    [
      'Comment savoir si une formation est certifiante ?',
      "Une formation certifiante prépare à une certification enregistrée au RNCP ou au RS, visible sur le site France Compétences. La fiche programme doit mentionner le numéro de certification, le niveau et le certificateur.",
    ],
    [
      "Qu'est-ce que la VAE (Validation des Acquis de l'Expérience) ?",
      "La VAE permet d'obtenir tout ou partie d'une certification reconnue (diplôme, titre professionnel, certificat) en faisant valider les compétences acquises par l'expérience professionnelle ou bénévole, sans passer par une formation classique.",
    ],
    [
      'Comment se déroule une procédure de VAE ?',
      "La VAE comprend : la recevabilité du dossier (Livret 1), la constitution du dossier de preuves (Livret 2), puis un jury qui évalue les compétences sur la base du dossier et d'un entretien. Le jury peut valider tout ou partie de la certification.",
    ],
    [
      "Qu'est-ce qu'un titre professionnel ?",
      "Un titre professionnel est une certification délivrée par le ministère chargé de l'Emploi. Il atteste qu'une personne maîtrise les compétences d'un métier précis et est enregistré au RNCP. Il peut être obtenu en formation ou par VAE.",
    ],
    [
      'Comment sont organisés les examens de certification ?',
      "Les modalités varient selon la certification : épreuves écrites, mises en situation professionnelle, dossier de preuves, soutenance orale devant un jury ou questionnaire en ligne. Les critères d'évaluation sont définis dans le référentiel de certification.",
    ],
    [
      "Qu'est-ce qu'un test de positionnement avant formation ?",
      "C'est une évaluation initiale réalisée en amont de l'entrée en formation pour mesurer les connaissances actuelles et adapter le parcours pédagogique. Il ne s'agit pas d'un examen éliminatoire mais d'un outil de diagnostic.",
    ],
    [
      'Le test de positionnement est-il obligatoire ?',
      "Oui, dans le cadre de la démarche Qualiopi, il est obligatoire pour valider l'adéquation entre le profil du candidat, ses objectifs et le programme choisi.",
    ],
    [
      'Sous quelle forme se déroulent les tests de positionnement ?',
      "Il s'agit généralement de questionnaires à choix multiples (QCM), d'études de cas courtes ou d'entretiens techniques individuels menés à distance via la plateforme sécurisée.",
    ],
    [
      'Combien de temps dure un test de positionnement ?',
      'En moyenne, un test dure entre 20 et 45 minutes selon la complexité des compétences à évaluer.',
    ],
    [
      'Un test de positionnement peut-il raccourcir la formation ?',
      'Oui. Si les compétences initiales sont déjà avancées sur certains modules, une individualisation peut réduire la durée totale du parcours (allègement de formation).',
    ],
    [
      "Qu'est-ce qu'un test de positionnement managérial ?",
      "Il évalue les postures de communication, le style de leadership face à des situations concrètes et la connaissance des outils clés de gestion d'équipe.",
    ],
    [
      'Les tests de langues sont-ils alignés sur le CECRL ?',
      'Oui, les tests en langues (anglais, espagnol, allemand) mesurent le niveau selon la grille européenne de A1 à C2.',
    ],
    [
      "Qu'est-ce qu'une évaluation formative ?",
      "C'est une évaluation continue tout au long de la formation (quiz, exercices) servant à mesurer la progression et à réajuster la pédagogie en temps réel.",
    ],
    [
      'Quelle est la différence entre évaluation formative et sommative ?',
      "L'évaluation formative sert à ajuster l'apprentissage en cours de route. L'évaluation sommative, réalisée en fin de parcours, vise à certifier le niveau atteint par rapport aux objectifs visés.",
    ],
    [
      'Comment obtenir ses résultats d\'évaluation ?',
      'Un compte rendu détaillé est partagé et commenté par le conseiller pédagogique après chaque évaluation.',
    ],
    [
      'Quelles certifications numériques sont accessibles via Alt RH Formations ?',
      "Plusieurs certifications du numérique sont proposées ou préparées : certifications cloud (AWS, Azure, GCP), certifications sécurité (CompTIA, ANSSI), certifications projet (Prince2, Scrum), ainsi que les titres RNCP de la filière informatique.",
    ],
    [
      "Le passage d'une certification est-il inclus dans le coût de la formation ?",
      "Cela dépend du programme. Pour certaines formations, les frais de passage de l'examen sont inclus. Pour d'autres, ils sont facturés en sus. Le devis détaille ce point.",
    ],
    [
      'Combien de temps sont valables les certifications obtenues ?',
      'La durée de validité varie selon la certification : certaines sont permanentes (titres RNCP), d\'autres ont une durée de validité limitée (2 à 3 ans pour de nombreuses certifications IT) et nécessitent un renouvellement.',
    ],
  ]
);

const recrutement = cat(
  'recrutement-carriere',
  5,
  'Recrutement & Gestion de carrière',
  'Accompagnement candidats, employeurs, mobilité & reconversion',
  [
    [
      'Comment Alt RH Formations accompagne-t-il les recruteurs ?',
      "Alt RH Formations accompagne les employeurs dans la définition des besoins, la rédaction des fiches de poste, la sélection des candidats, les tests de positionnement, la conduite d'entretien et l'intégration des nouveaux collaborateurs.",
    ],
    [
      "Un candidat peut-il être accompagné dans sa recherche d'emploi ?",
      "Oui, l'accompagnement candidat couvre le bilan des compétences, la stratégie de recherche d'emploi, la rédaction du CV et de la lettre de motivation, la préparation aux entretiens et le suivi post-embauche.",
    ],
    [
      "Qu'est-ce qu'une fiche métier et pourquoi la consulter ?",
      "Une fiche métier décrit les activités, compétences, débouchés et perspectives d'évolution d'un métier. Elle est utile pour valider un projet professionnel, choisir une formation ou préparer une reconversion.",
    ],
    [
      'Comment Alt RH Formations peut-il aider à une reconversion professionnelle ?',
      "Un parcours complet de reconversion peut démarrer par un bilan de compétences ou un entretien d'orientation, se poursuivre par une formation certifiante et aboutir à un accompagnement à la recherche d'emploi ou à la création d'activité.",
    ],
    [
      'Quels outils sont utilisés pour évaluer un candidat dans le cadre du recrutement ?',
      "Les outils peuvent inclure des tests de personnalité (MBTI, DISC), des tests psychométriques, des mises en situation professionnelle, des entretiens structurés et des tests de compétences techniques adaptés au poste.",
    ],
    [
      "Qu'est-ce que la mobilité professionnelle interne ?",
      "La mobilité interne désigne le changement de poste, de service ou de site au sein de la même entreprise. Elle peut être horizontale (changement de fonction de même niveau) ou verticale (promotion). Alt RH Formations peut accompagner ce type de transition.",
    ],
    [
      'Comment préparer une transition professionnelle ?',
      "La préparation passe par un bilan de compétences, une analyse du marché cible, l'identification des compétences à acquérir, un plan de formation, la construction du réseau professionnel et la mise en valeur des compétences transférables.",
    ],
    [
      'Quels sont les secteurs en forte tension sur le marché de l\'emploi ?',
      "Parmi les secteurs en forte tension : le numérique (développement, cybersécurité, data, cloud), les métiers de la santé et du médico-social, la logistique, le commerce, les ressources humaines et les métiers de la transition écologique.",
    ],
    [
      "Comment valoriser ses compétences lors d'un entretien d'embauche ?",
      "Il est recommandé d'illustrer ses compétences par des exemples concrets (méthode STAR : Situation, Tâche, Action, Résultat), de montrer sa capacité d'adaptation, sa motivation et sa connaissance du secteur ciblé.",
    ],
    [
      "Qu'est-ce que la méthode STAR pour les entretiens ?",
      "La méthode STAR (Situation, Tâche, Action, Résultat) est une technique pour structurer ses réponses lors d'un entretien. Elle permet de démontrer ses compétences par des exemples précis et mesurables.",
    ],
    [
      "Le réseau professionnel est-il important dans une recherche d'emploi ?",
      "Oui, une majorité des offres ne sont jamais publiées. Développer et activer son réseau (LinkedIn, anciens collègues, associations professionnelles) est un levier majeur pour accéder au marché caché de l'emploi.",
    ],
    [
      'Comment rédiger un CV efficace en 2025-2026 ?',
      "Un CV efficace est clair, ciblé et orienté résultats. Il doit être adapté à chaque offre, utiliser des mots-clés du secteur, mettre en avant les compétences clés, les certifications obtenues et quantifier les réalisations lorsque c'est possible.",
    ],
    [
      "Qu'est-ce qu'un profil LinkedIn optimisé ?",
      "Un profil LinkedIn optimisé contient une photo professionnelle, un titre accrocheur, un résumé orienté valeur, des expériences détaillées avec résultats, les certifications et formations, ainsi que des recommandations de collègues ou managers.",
    ],
    [
      "Alt RH Formations accompagne-t-il les créateurs d'entreprise ?",
      "Oui, un accompagnement peut être proposé pour les porteurs de projet souhaitant acquérir les compétences nécessaires à la gestion d'une activité : management, droit, communication, outils numériques ou gestion financière.",
    ],
    [
      'Comment gérer une période de chômage pour rebondir professionnellement ?',
      "La période de chômage peut être mise à profit pour réaliser un bilan de compétences, se former, obtenir une certification, renforcer son réseau et clarifier son projet professionnel. Un conseiller peut structurer cette démarche.",
    ],
    [
      "Qu'est-ce que l'outplacement ?",
      "L'outplacement est un accompagnement proposé (généralement par l'employeur) à un salarié qui quitte l'entreprise pour l'aider à retrouver rapidement un emploi ou à développer un nouveau projet professionnel.",
    ],
    [
      'Comment accompagner un senior dans sa gestion de carrière ?',
      "L'accompagnement senior porte sur la valorisation des compétences acquises, le mentorat, la gestion des préjugés liés à l'âge, la reconversion si nécessaire, et les dispositifs dédiés (cumul emploi-retraite, mécénat de compétences).",
    ],
    [
      "Qu'est-ce que la GPEC (Gestion Prévisionnelle des Emplois et des Compétences) ?",
      "La GPEC est une démarche d'entreprise qui anticipe les besoins en compétences à moyen terme (3 à 5 ans) pour adapter les ressources humaines aux évolutions stratégiques, technologiques et organisationnelles.",
    ],
    [
      'Comment Alt RH Formations peut-il soutenir une politique de GPEC ?',
      "En cartographiant les compétences, en identifiant les écarts avec les besoins futurs, en proposant des plans de formation ciblés, en accompagnant les mobilités internes et en outillant les managers pour les entretiens professionnels.",
    ],
    [
      'Quels outils numériques sont incontournables pour un professionnel RH ?',
      "Un professionnel RH doit maîtriser les SIRH (systèmes d'information RH), les outils ATS (applicant tracking system), les plateformes de formation en ligne, les outils de communication collaborative et les bases de la data RH (tableaux de bord, analytics).",
    ],
  ]
);

appendPairs(formation, formationExtra);
appendPairs(financement, financementExtra);
appendPairs(bilan, bilanExtra);
appendPairs(certificationTests, certificationExtra);
appendPairs(recrutement, recrutementExtra);

const qualiopiOrganisme = cat(
  'qualiopi-organisme',
  6,
  'Qualiopi, accessibilité & qualité',
  'Certification Qualiopi, handicap, réclamations & indicateurs',
  qualiopiPairs
);

const categories = [formation, financement, bilan, certificationTests, recrutement, qualiopiOrganisme];

function serializeCategory(c) {
  const lines = [
    `export default {`,
    `  id: ${JSON.stringify(c.id)},`,
    `  order: ${c.order},`,
    `  theme: ${JSON.stringify(c.theme)},`,
    `  categorie: ${JSON.stringify(c.categorie)},`,
    `  questions: [`,
  ];
  for (const { q, a } of c.questions) {
    lines.push(`    { q: ${JSON.stringify(q)}, a: ${JSON.stringify(a)} },`);
  }
  lines.push(`  ],`, `};`, ``);
  return lines.join('\n');
}

for (const c of categories) {
  writeFileSync(join(outDir, `${c.id}.js`), serializeCategory(c), 'utf8');
}

const indexContent = `import { faqHero } from './hero.js';
import formation from './formation.js';
import financement from './financement.js';
import bilan from './bilan.js';
import certificationTests from './certification-tests.js';
import recrutementCarriere from './recrutement-carriere.js';
import qualiopiOrganisme from './qualiopi-organisme.js';

export { faqHero };

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
`;

writeFileSync(join(outDir, 'index.js'), indexContent, 'utf8');

const counts = categories.map((c) => `${c.theme}: ${c.questions.length}`).join(', ');
console.log(`Generated ${categories.length} categories (${counts})`);
