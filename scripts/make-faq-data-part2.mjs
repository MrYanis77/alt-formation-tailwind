function cat(id, categorie, pairs) {
  return {
    id,
    categorie,
    questions: pairs.map(([q, a]) => ({ q, a })),
  };
}

const C = [
  [
    "Qu'est-ce que la certification Qualiopi ?",
    'Qualiopi est la marque unique de certification qualité des prestataires d\'actions concourant au développement des compétences, obligatoire pour bénéficier de fonds publics ou mutualisés.',
  ],
  [
    'Pourquoi est-il important de choisir un organisme certifié Qualiopi ?',
    'Cela vous garantit le sérieux de l\'organisme, la qualité des processus pédagogiques, la transparence de l\'information et l\'éligibilité aux financements (CPF, OPCO, etc.).',
  ],
  [
    "Qu'est-ce que le RNCP ?",
    "Le Répertoire National des Certifications Professionnelles (RNCP) recense les diplômes et titres à visée professionnelle reconnus par l'État, classés par niveaux de qualification.",
  ],
  [
    "Qu'est-ce que le RS (Répertoire Spécifique) ?",
    'Le Répertoire Spécifique (RS) recense les certifications correspondant à des compétences professionnelles complémentaires, des habilitations ou des spécialisations (ex: TOSA, TOEIC).',
  ],
  [
    "Quelle est la différence entre un titre RNCP et un diplôme d'État ?",
    'Tous deux ont la même valeur sur le marché du travail, mais le diplôme d\'État est délivré par un ministère (Éducation nationale) tandis que le titre RNCP est délivré par un organisme de formation et validé par France Compétences.',
  ],
  [
    "Qu'est-ce que France Compétences ?",
    "C'est l'autorité nationale de régulation et de financement de la formation professionnelle et de l'apprentissage en France, qui valide l'inscription des titres au RNCP et au RS.",
  ],
  [
    'Comment savoir si une formation Alt RH Formations est certifiante ?',
    "La mention « Certifiante » ainsi que le code RNCP ou RS officiel apparaissent explicitement sur la fiche de la formation et sur notre site.",
  ],
  [
    "Qu'est-ce qu'un bloc de compétences ?",
    "C'est une partie homogène et cohérente d'une certification professionnelle. On peut valider un titre RNCP bloc par bloc, à son propre rythme.",
  ],
  [
    'Peut-on obtenir une certification par capitalisation de blocs ?',
    'Oui, la validation de l\'ensemble des blocs constitutifs d\'une certification permet d\'obtenir le titre certifiant complet.',
  ],
  [
    "Quelle est la durée de validité d'une certification professionnelle ?",
    'Pour le titulaire, la certification est acquise à vie. En revanche, l\'enregistrement du titre par France Compétences est renouvelé tous les 3 à 5 ans.',
  ],
  [
    'Comment se déroule le passage devant le jury de certification ?',
    'Le candidat présente son dossier de projet ou sa soutenance orale devant un jury composé de professionnels indépendants du secteur visé.',
  ],
  [
    "Que se passe-t-il si j'échoue à l'examen de certification ?",
    "En cas d'échec partiel, vous conservez le bénéfice des blocs de compétences validés. Vous pouvez vous réinscrire pour repasser le ou les blocs manquants.",
  ],
  [
    "Qu'est-ce qu'un certificat de réalisation ?",
    "C'est le document officiel transmis à la fin de la formation prouvant l'assiduité du stagiaire et la réalisation effective de toutes les étapes de la formation.",
  ],
  [
    "Qu'est-ce que la VAE (Validation des Acquis de l'Expérience) ?",
    "C'est un dispositif permettant d'obtenir toute ou partie d'une certification professionnelle grâce à la reconnaissance de son expérience professionnelle d'au moins 1 an.",
  ],
  [
    'Alt RH Formations accompagne-t-elle les projets de VAE ?',
    'Oui, nous proposons des parcours d\'accompagnement méthodologique à la VAE pour vous aider à rédiger vos livrets et préparer l\'oral devant le jury.',
  ],
  [
    'Les certifications de langues (TOEIC, Bright) sont-elles valables à vie ?',
    'Non, la plupart des certifications linguistiques ont une validité recommandée de 2 ans, car le niveau de pratique peut évoluer.',
  ],
  [
    "Qu'est-ce qu'une habilitation professionnelle ?",
    "C'est une reconnaissance obligatoire pour exercer certaines tâches spécifiques en toute sécurité (ex: habilitation électrique, SST).",
  ],
  [
    "Comment vérifier l'authenticité d'une certification ?",
    'Chaque certification délivrée comporte un numéro d\'enregistrement unique vérifiable directement auprès de l\'organisme certificateur ou de France Compétences.',
  ],
  [
    "Qu'est-ce que le niveau de qualification Europe (EQF) ?",
    "C'est un cadre européen qui permet de faire correspondre les niveaux de diplômes d'un pays à l'autre (ex: Niveau 6 correspond au Bac+3/4).",
  ],
  [
    'Peut-on faire une formation certifiante sans passer l\'examen ?',
    'Si vous utilisez le CPF pour financer votre formation, le passage de l\'examen de certification est une obligation légale.',
  ],
  [
    "Qui fixe les modalités d'évaluation d'un titre RNCP ?",
    "C'est l'organisme certificateur dépositaire du titre auprès de France Compétences qui détermine précisément le référentiel d'évaluation.",
  ],
  [
    "Quel est l'impact de Qualiopi sur le suivi des stagiaires ?",
    'Qualiopi impose des processus stricts de suivi des présences, de traitement des réclamations et d\'évaluation continue pour protéger les bénéficiaires.',
  ],
  [
    "Qu'est-ce que la charte d'engagement du CPF ?",
    "C'est une charte de déontologie signée par les organismes de formation certifiés qui s'engagent à respecter des pratiques commerciales éthiques et transparentes.",
  ],
  [
    'Une certification professionnelle garantit-elle un emploi ?',
    'Elle ne le garantit pas juridiquement, mais elle atteste de compétences opérationnelles directement recherchées, ce qui augmente fortement l\'employabilité.',
  ],
  [
    'Quelles sont les certifications en ressources humaines disponibles chez Alt RH Formations ?',
    'Nous proposons des titres RNCP de Chargé de Recrutement, Responsable RH, ainsi que des certifications RS en gestion de paie et droit social.',
  ],
];

const CPF = [
  [
    "Qu'est-ce que le Compte Personnel de Formation (CPF) ?",
    "C'est un dispositif de financement de la formation professionnelle qui permet à toute personne active d'accumuler des droits à la formation dès son entrée sur le marché du travail.",
  ],
  [
    'Comment est alimenté mon compte CPF ?',
    'Pour un travail à temps plein ou à mi-temps, le compte est alimenté chaque année à hauteur de 500 € (dans la limite d\'un plafond total de 5 000 €).',
  ],
  [
    'Existe-t-il un CPF spécifique pour les personnes peu qualifiées ?',
    'Oui, pour les salariés non qualifiés (niveau inférieur au CAP/BEP), l\'alimentation est de 800 € par an, avec un plafond relevé à 8 000 €.',
  ],
  [
    'Où puis-je consulter le montant de mes droits CPF ?',
    "Sur le site officiel ou l'application mobile gouvernementale « Mon Compte Formation » (moncompteformation.gouv.fr) en vous connectant via FranceConnect+.",
  ],
  [
    'Pourquoi faut-il utiliser FranceConnect+ (Identité Numérique La Poste) ?',
    "C'est une mesure de sécurité obligatoire mise en place par l'État pour sécuriser la connexion et bloquer définitivement les tentatives de fraude au CPF.",
  ],
  [
    'Toutes vos formations sur alt-rh.com sont-elles éligibles au CPF ?',
    'Seules nos formations débouchant sur une certification enregistrée au RNCP ou au RS, ainsi que les bilans de compétences, sont éligibles au CPF.',
  ],
  [
    "Qu'est-ce que le reste à charge CPF mis en place récemment ?",
    "Depuis mai 2024, un reste à charge obligatoire de 100 € (indexé annuellement) s'applique pour chaque dossier CPF, sauf cas d'exonération spécifiques.",
  ],
  [
    'Qui est exonéré du reste à charge obligatoire de 100 € ?',
    'Les demandeurs d\'emploi, les salariés dont l\'entreprise cofinance le projet, et les bénéficiaires d\'un abondement de leur OPCO ou de la branche professionnelle.',
  ],
  [
    "Qu'est-ce qu'un abondement CPF ?",
    "C'est un financement complémentaire versé sur votre compte lorsque le coût de la formation choisie dépasse le montant de vos droits CPF disponibles.",
  ],
  [
    'Mon employeur peut-il m\'obliger à utiliser mon CPF ?',
    "Non, l'utilisation du CPF relève de la seule initiative du salarié. L'employeur ne peut en aucun cas vous imposer d'utiliser vos droits personnels.",
  ],
  [
    'Puis-je utiliser mon CPF pour une formation pendant mon temps de travail ?',
    'Oui, mais vous devez impérativement obtenir l\'accord préalable de votre employeur sur le calendrier et le contenu de la formation.',
  ],
  [
    "Quel est le délai pour demander l'accord de mon employeur pour une formation sur le temps de travail ?",
    'La demande doit être formulée au moins 60 jours avant le début pour une formation de moins de 6 mois, et 120 jours pour une formation de plus de 6 mois.',
  ],
  [
    "Que se passe-t-il si mon employeur ne répond pas à ma demande de formation CPF ?",
    "L'absence de réponse de l'employeur dans un délai de 30 jours calendaires vaut acceptation de sa part.",
  ],
  [
    'Puis-je utiliser mon CPF si je suis demandeur d\'emploi ?',
    'Oui, vos droits CPF acquis lorsque vous étiez salarié restent disponibles et mobilisables tout au long de votre période de recherche d\'emploi.',
  ],
  [
    'Les fonctionnaires ou agents publics ont-ils un CPF en euros ?',
    'Non, pour les agents publics, le CPF est toujours alimenté en heures de formation (25 heures par an en général) et non en euros.',
  ],
  [
    'Mes droits CPF peuvent-ils expirer ou être perdus ?',
    'Non, les droits acquis restent inscrits sur votre compte à vie, même en cas de changement d\'entreprise, de chômage ou de reconversion.',
  ],
  [
    'Que deviennent mes droits CPF au moment du départ à la retraite ?',
    'Les droits CPF sont gelés lors de la liquidation des droits à la retraite à taux plein et ne peuvent plus être mobilisés, sauf pour des activités de bénévolat (via le CEC).',
  ],
  [
    'Puis-je céder mes droits CPF à un proche ou un membre de ma famille ?',
    'Non, le Compte Personnel de Formation est strictement individuel, incessible et nominatif. Les droits ne peuvent être transférés à un tiers.',
  ],
  [
    'Que faire si le solde de mon CPF est insuffisant pour financer ma formation chez Alt RH Formations ?',
    'Vous pouvez compléter le paiement par carte bancaire directement sur la plateforme, ou solliciter une aide financière complémentaire (France Travail, OPCO, employeur).',
  ],
  [
    'Quel est le délai de rétractation après avoir validé une inscription CPF ?',
    'Vous disposez d\'un délai de rétractation légal de 11 jours ouvrés après la validation de votre dossier par l\'organisme de formation.',
  ],
  [
    'Est-il possible de financer un permis de conduire avec le CPF ?',
    'Oui, le CPF permet de financer les permis B, C, D et les extensions, à condition que l\'obtention du permis contribue directement à un projet professionnel.',
  ],
  [
    "Qu'est-ce que le CPF de transition ou Projet de Transition Professionnelle (PTP) ?",
    "C'est un dispositif spécifique permettant de s'absenter de son poste pour suivre une formation certifiante longue dans le but de se reconvertir, avec maintien de salaire.",
  ],
  [
    'Qui gère financièrement le dispositif Mon Compte Formation ?',
    "C'est la Caisse des Dépôts et Consignations (CDC) qui assure la gestion technique et financière globale du dispositif CPF.",
  ],
  [
    'Puis-je me faire rembourser une formation payée avec mon CPF si je l\'annule ?',
    'Si l\'annulation intervient hors délai légal et sans motif de force majeure, les droits CPF sont débités et non remboursés.',
  ],
  [
    'Comment s\'assurer qu\'on ne se fait pas arnaquer son compte CPF ?',
    'Ne donnez jamais vos identifiants de connexion. Alt RH Formations ne fait aucun démarchage agressif par téléphone, SMS ou email.',
  ],
];

const FT = [
  [
    "Qu'est-ce que l'AIF (Aide Individuelle à la Formation) ?",
    "L'AIF est un financement accordé par France Travail pour prendre en charge tout ou partie des frais pédagogiques d'une formation non couverte par d'autres dispositifs.",
  ],
  [
    'Qui peut prétendre à l\'AIF de France Travail ?',
    'Les demandeurs d\'emploi inscrits, qu\'ils soient indemnisés ou non, ainsi que les personnes en contrat de sécurisation professionnelle (CSP).',
  ],
  [
    'Comment faire une demande d\'AIF pour une formation chez Alt RH Formations ?',
    'Vous devez nous demander un devis numérique personnalisé. Nous le déposons directement sur votre espace Kairos (plateforme France Travail), et vous devez ensuite le valider.',
  ],
  [
    "Qu'est-ce que la plateforme Kairos ?",
    "C'est l'outil d'échange de données dématérialisées entre France Travail et les organismes de formation pour gérer les devis, les entrées en formation et l'assiduité.",
  ],
  [
    "Quel est le délai de traitement d'une demande d'AIF par France Travail ?",
    'Le délai moyen est de 3 à 4 semaines. Il est recommandé de valider votre devis au moins 15 jours avant la date de début de la formation.',
  ],
  [
    "Qu'est-ce que la POEI (Préparation Opérationnelle à l'Emploi Individuelle) ?",
    "C'est un dispositif permettant de financer une formation de mise à niveau d'un candidat pour l'adapter précisément à un poste proposé par une entreprise qui s'engage à l'embaucher.",
  ],
  [
    'Quelle est la différence entre POEI et POEC ?',
    'La POEI est individuelle et liée à une offre d\'emploi précise d\'une entreprise. La POEC est collective, initiée par une branche professionnelle pour répondre à des besoins sectoriels.',
  ],
  [
    'Puis-je conserver mes allocations chômage (ARE) pendant ma formation ?',
    'Oui, si la formation est validée par votre conseiller dans le cadre de votre projet personnalisé d\'accès à l\'emploi (PPAE), l\'ARE devient l\'AREF (Allocation d\'Aide au Retour à l\'Emploi Formation).',
  ],
  [
    "Qu'est-ce que la RFF (Rémunération de Fin de Formation) ?",
    "C'est une aide financière qui prend le relais de vos allocations chômage si celles-ci prennent fin pendant que vous terminez une formation qualifiante agréée.",
  ],
  [
    'Quel est le montant maximal de la RFF en 2026 ?',
    'Le montant maximum de la RFF est plafonné par l\'État aux alentours de 712 € par mois, sous réserve des règles en vigueur.',
  ],
  [
    "Qu'est-ce que la RFPE (Rémunération des Formations de France Travail) ?",
    "C'est la rémunération versée par France Travail aux demandeurs d'emploi non indemnisés au titre de l'ARE qui suivent une formation agréée.",
  ],
  [
    'France Travail peut-il abonder mon compte CPF ?',
    'Oui, si vos droits CPF sont insuffisants pour couvrir le prix de la formation, vous pouvez solliciter un abondement direct de France Travail depuis la plateforme Mon Compte Formation.',
  ],
  [
    'Comment obtenir la validation de mon projet de formation par mon conseiller ?',
    'Vous devez lui présenter un projet solide, cohérent avec votre parcours et démontrer que la formation choisie favorisera concrètement votre retour à l\'emploi.',
  ],
  [
    "Qu'est-ce que le PPAE (Projet Personnel d'Accès à l'Emploi) ?",
    "C'est le document contractuel de référence élaboré avec votre conseiller France Travail, fixant la nature de vos recherches et les actions d'accompagnement (comme la formation).",
  ],
  [
    'Peut-on cumuler une aide de la Région et un financement France Travail ?',
    'Oui, les cofinancements entre les Conseils régionaux et France Travail sont fréquents et gérés de manière coordonnée pour les dossiers complexes.',
  ],
  [
    'Quelles sont les obligations d\'un stagiaire vis-à-vis de France Travail pendant la formation ?',
    'L\'obligation principale est l\'assiduité totale. Toute absence injustifiée peut entraîner la suspension des allocations et l\'exclusion du parcours.',
  ],
  [
    'Comment sont déclarées les absences auprès de France Travail ?',
    'Alt RH Formations déclare chaque mois vos heures de présence effectives et vos éventuelles absences via la plateforme Kairos.',
  ],
  [
    'Puis-je suivre une formation à distance tout en restant disponible pour chercher un emploi ?',
    'Oui, le e-learning offre une souplesse totale qui permet de caler vos temps d\'apprentissage en dehors des entretiens de recrutement.',
  ],
  [
    "Qu'est-ce qu'une formation « conventionnée » par la Région ou France Travail ?",
    "C'est une formation dont les places ont été achetées en lot par l'institution. Les places sont gratuites pour les demandeurs d'emploi sélectionnés.",
  ],
  [
    'Est-ce que France Travail prend en charge les frais de transport ou d\'hébergement ?',
    'Oui, sous certaines conditions de ressources et d\'éloignement (plus de 60 km aller-retour), vous pouvez bénéficier de l\'aide aux frais associés à la formation (aide à la mobilité).',
  ],
  [
    'Que se passe-t-il si je trouve un emploi en CDI au milieu de ma formation ?',
    'Vous pouvez interrompre votre formation pour signer votre contrat de travail, sans pénalité financière. France Travail suspendra alors vos droits de stagiaire.',
  ],
  [
    'Un travailleur indépendant peut-il solliciter France Travail s\'il s\'inscrit comme demandeur d\'emploi ?',
    'Oui, s\'il remplit les critères d\'inscription et qu\'il n\'a pas de revenus d\'activité suffisants, il entre dans le droit commun de l\'accompagnement.',
  ],
  [
    'Le Bilan de compétences peut-il être pris en charge par France Travail ?',
    'Oui, via l\'AIF ou directement par mobilisation de votre CPF, le bilan de compétences est parfaitement finançable pour un demandeur d\'emploi.',
  ],
  [
    "Que se passe-t-il si l'organisme de formation perd sa certification Qualiopi en cours de route ?",
    'France Travail bloque immédiatement les financements en cours et refuse tout nouveau dossier avec cet organisme.',
  ],
  [
    'Où trouver les formations d\'Alt RH Formations sur le catalogue France Travail ?',
    'Toutes nos sessions ouvertes sont visibles directement sur le site de France Travail, rubrique « Trouver ma formation » ou via votre espace candidat.',
  ],
];

const OPCO = [
  [
    "Qu'est-ce qu'un OPCO (Opérateur de Compétences) ?",
    "C'est un organisme agréé par l'État chargé d'accompagner la formation professionnelle des entreprises, de financer l'alternance et de soutenir les TPE/PME.",
  ],
  [
    "Combien d'OPCO existe-t-il en France actuellement ?",
    'Il existe 11 OPCO interprofessionnels, chacun étant sectorisé par branches professionnelles proches (ex: Atlas, Akto, Opco de la Construction).',
  ],
  [
    'Quel est l\'OPCO compétent pour les métiers du conseil, de l\'ingénierie et du numérique ?',
    'C\'est l\'OPCO Atlas, qui gère notamment la branche des bureaux d\'études techniques, du conseil et du numérique (syntec).',
  ],
  [
    "Qu'est-ce que le Plan de Développement des Compétences ?",
    "C'est le document qui rassemble l'ensemble des actions de formation retenues par l'employeur pour ses salariés au cours de l'année pour adapter leurs compétences.",
  ],
  [
    'Qui prend en charge les frais de formation dans le cadre du Plan de Développement des Compétences ?',
    'Pour les entreprises de moins de 50 salariés, l\'OPCO prend en charge tout ou partie des coûts. Pour les entreprises de plus de 50 salariés, le plan est financé sur les fonds propres de l\'entreprise.',
  ],
  [
    'Comment une TPE/PME peut-elle soumettre un dossier de financement à son OPCO ?',
    'L\'entreprise doit faire une demande de prise en charge (DPC) en ligne sur le portail de son OPCO, en y joignant le programme et le devis d\'Alt RH Formations.',
  ],
  [
    "Qu'est-ce que le FNE-Formation (Fonds National de l'Emploi) ?",
    "C'est un dispositif de l'État qui cofinance des formations de salariés d'entreprises confrontées à des mutations technologiques, écologiques ou économiques majeures.",
  ],
  [
    'Quels sont les taux de prise en charge du FNE-Formation ?',
    'Selon la taille de l\'entreprise et le cadre d\'intervention, l\'aide de l\'État peut couvrir de 50% à 80% des coûts pédagogiques.',
  ],
  [
    'Un salarié en activité partielle peut-il suivre une formation ?',
    'Oui, et les formations suivies pendant l\'activité partielle peuvent être prises en charge à 100% par l\'OPCO via les fonds spécifiques FNE.',
  ],
  [
    "Qu'est-ce que l'abondement correctif de l'employeur ?",
    "C'est une pénalité financière de 3 000 € versée sur le CPF d'un salarié si l'entreprise de plus de 50 salariés n'a pas respecté ses obligations d'entretiens professionnels biennaux.",
  ],
  [
    "Qu'est-ce qu'un accord de branche professionnelle ?",
    "C'est un accord collectif signé entre les syndicats d'employeurs et de salariés d'un secteur, définissant des priorités et des enveloppes de formation spécifiques.",
  ],
  [
    'Comment cofinancer une formation avec l\'OPCO et le CPF du salarié ?',
    'L\'entreprise formule une demande d\'abondement auprès de l\'OPCO qui procède au versement complémentaire direct sur le compte CPF du salarié via l\'espace EDEF.',
  ],
  [
    "Qu'est-ce que la plateforme EDEF pour les employeurs ?",
    "C'est l'Espace des Employeurs et des Financeurs géré par la Caisse des Dépôts, permettant aux entreprises d'attribuer des dotations financières CPF à leurs salariés.",
  ],
  [
    'Le coût de la rémunération du salarié en formation est-il pris en charge par l\'OPCO ?',
    'Pour les entreprises de moins de 50 salariés, certains OPCO proposent un remboursement forfaitaire des salaires pendant le temps de formation.',
  ],
  [
    "Qu'est-ce que la Pro-A (Reconversion ou Promotion par l'Alternance) ?",
    "C'est un dispositif permettant à des salariés de changer de métier ou de bénéficier d'une promotion sociale en suivant une formation en alternance tout en gardant leur contrat initial.",
  ],
  [
    'Quels salariés sont éligibles à la Pro-A ?',
    'Les salariés en CDI ou en CUI dont le niveau de qualification actuel est inférieur au niveau Licence (Bac+3).',
  ],
  [
    "Comment trouver l'OPCO dont dépend mon entreprise ?",
    'Vous pouvez trouver votre OPCO grâce au code IDCC (Identifiant de la Convention collective) de votre entreprise ou via son numéro SIRET sur les annuaires officiels.',
  ],
  [
    "Qu'est-ce que la contribution unique à la formation professionnelle (CUFPA) ?",
    "C'est une taxe obligatoire versée annuellement par les entreprises à l'URSSAF, qui est ensuite mutualisée auprès des OPCO et de France Compétences.",
  ],
  [
    "Qu'est-ce que l'OPCO AKTO ?",
    'AKTO est l\'opérateur de compétences des services à forte intensité de main-d\'œuvre (restauration, propreté, sécurité, travail temporaire).',
  ],
  [
    'Peut-on former des dirigeants non-salariés via un OPCO ?',
    'Non, les dirigeants non-salariés (TNS, gérants majoritaires) dépendent d\'un FAF (Fonds d\'Assurance Formation) comme le FIF PL, l\'AGEFICE ou la FAFCEA.',
  ],
  [
    'Quel est le délai idéal pour déposer une demande de financement OPCO ?',
    'Il est conseillé de soumettre la demande au moins 30 jours avant le début de l\'action de formation pour s\'assurer d\'obtenir l\'accord écrit (subrogation de paiement).',
  ],
  [
    "Qu'est-ce que la subrogation de paiement avec un OPCO ?",
    "C'est un accord par lequel l'OPCO règle directement les frais pédagogiques à Alt RH Formations, évitant ainsi à l'entreprise de faire l'avance des fonds.",
  ],
  [
    "Que se passe-t-il si l'OPCO refuse le financement ?",
    "L'entreprise peut décider de financer la formation sur ses fonds propres ou d'en réviser le périmètre, le devis d'Alt RH Formations devenant caduc sans accord.",
  ],
  [
    "Les actions collectives des OPCO, qu'est-ce que c'est ?",
    "Ce sont des programmes de formations clés en main sélectionnés par l'OPCO à des tarifs très avantageux, avec des critères de financement simplifiés pour les adhérents.",
  ],
  [
    'Alt RH Formations est-elle référencée auprès des principaux OPCO ?',
    'Oui, grâce à notre certification Qualiopi, nous sommes référencés et validés par l\'ensemble des OPCO du territoire français.',
  ],
];

const B = [
  [
    "Qu'est-ce qu'un bilan de compétences ?",
    "C'est un dispositif réglementé du droit du travail qui permet d'analyser ses compétences professionnelles et personnelles, ses aptitudes et ses motivations afin de définir un projet d'évolution ou de reconversion.",
  ],
  [
    'Combien de temps dure un bilan de compétences au maximum ?',
    'La durée légale maximale d\'un bilan de compétences est de 24 heures, réparties sur plusieurs semaines (généralement 6 à 12 semaines).',
  ],
  [
    'Quelles sont les 3 phases réglementaires d\'un bilan de compétences ?',
    'Le bilan comprend obligatoirement une phase préliminaire, une phase d\'investigation et une phase de conclusion.',
  ],
  [
    'En quoi consiste la phase préliminaire du bilan ?',
    'Elle permet de confirmer l\'engagement du bénéficiaire, de définir ses besoins précis et de valider les modalités de déroulement du bilan avec son consultant dédié.',
  ],
  [
    "En quoi consiste la phase d'investigation ?",
    "C'est la phase centrale permettant de co-construire le projet professionnel, d'analyser le parcours, de passer les tests d'orientation et de confronter les pistes au marché du travail.",
  ],
  [
    'En quoi consiste la phase de conclusion ?',
    'Elle permet de formaliser les résultats de l\'investigation, de recenser les facteurs de réussite et de remettre au bénéficiaire un document de synthèse confidentiel.',
  ],
  [
    "Qu'est-ce que le document de synthèse du bilan de compétences ?",
    "C'est le document officiel rédigé par le consultant résumant le projet, le plan d'action détaillé et les étapes à suivre. Il est la propriété exclusive du bénéficiaire.",
  ],
  [
    'Le bilan de compétences peut-il être réalisé entièrement à distance ?',
    'Oui, Alt RH Formations propose des bilans de compétences 100 % en visioconférence, associant rendez-vous individuels et exercices sur notre plateforme.',
  ],
  [
    'Puis-je faire un bilan de compétences sur mon temps de travail ?',
    'Oui, à condition d\'obtenir l\'accord écrit de votre employeur dans le cadre d\'un congé de bilan de compétences. Le contenu reste strictement confidentiel.',
  ],
  [
    'Mon employeur a-t-il accès aux résultats de mon bilan de compétences ?',
    'Absolument pas. Aucun résultat ni document de synthèse ne peut être communiqué à l\'employeur sans l\'accord écrit exprès du salarié.',
  ],
  [
    'Puis-je réaliser mon bilan de compétences en toute confidentialité hors temps de travail ?',
    'Oui, en mobilisant vos droits CPF en dehors de vos heures de bureau, l\'employeur n\'est pas informé et n\'intervient pas dans la démarche.',
  ],
  [
    'Le bilan de compétences est-il éligible au CPF ?',
    'Oui, le bilan de compétences est un droit éligible de plein droit au CPF, ce qui permet un financement à 100 % de la prestation.',
  ],
  [
    'Qui sont les consultants qui animent les bilans chez Alt RH Formations ?',
    'Nos consultants sont des psychologues du travail ou des experts RH seniors certifiés dans l\'accompagnement des trajectoires professionnelles.',
  ],
  [
    'Quelle est la fréquence moyenne des rendez-vous en bilan de compétences ?',
    'Les rendez-vous individuels d\'une durée de 1h30 à 2h ont lieu généralement toutes les semaines ou toutes les deux semaines.',
  ],
  [
    'Un demandeur d\'emploi peut-il faire un bilan de compétences ?',
    'Oui, c\'est un excellent outil pour faire le point sur ses acquis, redéfinir une stratégie de recherche d\'emploi ou amorcer une reconversion professionnelle pertinente.',
  ],
  [
    'Le bilan de compétences est-il obligatoire pour se reconvertir ?',
    'Non, il n\'est pas juridiquement obligatoire, mais il est vivement recommandé pour sécuriser son projet de reconversion et éviter les erreurs d\'orientation.',
  ],
  [
    'Existe-t-il un suivi après la fin du bilan de compétences ?',
    'Oui, la réglementation impose un entretien de suivi à 6 mois après la remise de la synthèse pour faire le point sur l\'avancement de votre plan d\'action.',
  ],
  [
    'Quelle est la différence entre un bilan de compétences et un coaching de carrière ?',
    'Le bilan est très normé par la loi avec une analyse complète des compétences passées et un livrable de synthèse, tandis que le coaching est centré sur le développement d\'objectifs futurs spécifiques.',
  ],
  [
    'Peut-on interrompre un bilan de compétences en cours ?',
    'Oui, la démarche repose sur le volontariat. L\'interruption se fait d\'un commun accord avec l\'organisme, selon les clauses contractuelles financières.',
  ],
  [
    'À quel moment de sa carrière est-il opportun de faire un bilan ?',
    'Lorsqu\'on ressent une perte de sens, une lassitude, un besoin d\'évolution, après une longue absence (congé parental, maladie), ou pour préparer une transition.',
  ],
  [
    "Qu'est-ce que l'enquête métier ou enquête terrain dans un bilan ?",
    "C'est une démarche clé consistant à interviewer des professionnels en activité pour valider la réalité du métier visé (missions, salaires, contraintes).",
  ],
  [
    'Le coût d\'un bilan de compétences varie-t-il selon les organismes ?',
    'Oui, les prix sont libres mais ils se situent généralement entre 1 500 € et 3 000 € TTC selon l\'expertise, les outils utilisés et le format.',
  ],
  [
    'Quels sont les engagements d\'Alt RH Formations en matière de déontologie ?',
    'Le secret professionnel absolu, la neutralité bienveillante, le respect de la vie privée et l\'indépendance du jugement pédagogique.',
  ],
  [
    'Un bilan de compétences peut-il déboucher sur l\'inscription à une formation ?',
    'Très souvent, le plan d\'action du bilan identifie un besoin de formation pour acquérir les compétences manquantes requises par le nouveau projet.',
  ],
  [
    'Peut-on faire plusieurs bilans de compétences au cours de sa vie ?',
    'Oui, il n\'y a pas de limite légale, à condition de respecter un délai de carence minimal si les bilans sont financés par certains dispositifs spécifiques.',
  ],
];

const TM = [
  [
    'Quels types de tests passe-t-on durant un bilan de compétences ?',
    'On utilise des tests de personnalité (MBTI, RIASEC), des inventaires d\'intérêts professionnels, des tests de motivation et d\'aptitudes relationnelles.',
  ],
  [
    "Qu'est-ce que le test RIASEC ou modèle de Holland ?",
    "C'est un outil d'orientation qui classe les intérêts professionnels en 6 types de profils : Réaliste, Investigateur, Artiste, Social, Entreprenant, Conventionnel.",
  ],
  [
    'À quoi sert le test de personnalité MBTI dans un cadre professionnel ?',
    'Le MBTI permet de comprendre vos préférences de fonctionnement, votre mode de communication, de prise de décision et vos environnements de travail idéaux.',
  ],
  [
    'Ces tests de personnalité sont-ils fiables et scientifiques ?',
    'Oui, Alt RH Formations utilise exclusivement des outils validés scientifiquement par des comités de psychométrie et actualisés régulièrement.',
  ],
  [
    'Puis-je rater ou échouer à un test de personnalité ?',
    'Absolument pas. Il n\'y a pas de bonne ou de mauvaise réponse, l\'objectif est d\'obtenir une image fidèle de vos préférences naturelles.',
  ],
  [
    'Qui interprète les résultats de mes tests ?',
    'Les résultats sont toujours interprétés, débriefés et restitués de vive voix par votre consultant certifié lors d\'une séance d\'échange personnalisée.',
  ],
  [
    'Les résultats des tests me sont-ils remis par écrit ?',
    'Oui, un rapport complet et détaillé généré par l\'éditeur du test vous est remis et reste votre propriété exclusive.',
  ],
  [
    "Qu'est-ce qu'un inventaire des valeurs professionnelles ?",
    "C'est un outil permettant de hiérarchiser ce qui est le plus important pour vous au travail (autonomie, salaire, sécurité, altruisme, équilibre de vie).",
  ],
  [
    "Utilisez-vous des tests d'aptitudes logiques ou de QI ?",
    'Non, sauf demande très spécifique, car le bilan de compétences vise la valorisation de l\'expérience et du profil comportemental, non la performance pure.',
  ],
  [
    'Combien de temps faut-il pour passer un test en ligne ?',
    'La plupart des inventaires d\'intérêts ou de personnalité durent entre 15 et 30 minutes de passation autonome.',
  ],
  [
    'Puis-je mentir ou manipuler un test professionnel ?',
    'C\'est possible mais contre-productif, car cela fausserait les résultats du bilan et vous orienterait vers des pistes professionnelles inadaptées à votre vraie nature.',
  ],
  [
    "Qu'est-ce que le test SOSIE ?",
    "C'est un test de personnalité de référence très utilisé en recrutement et en bilan, qui évalue à la fois les traits de personnalité et les valeurs de la personne.",
  ],
  [
    'Les tests d\'orientation sont-ils adaptés aux adultes en reconversion ?',
    'Tout à fait, les questionnaires que nous sélectionnons intègrent des scénarios professionnels typiquement adaptés à la gestion de carrière d\'adultes expérimentés.',
  ],
  [
    'Comment le test aide-t-il à identifier une liste de fiches métiers ?',
    'Le croisement de votre profil de personnalité et de vos intérêts génère automatiquement des suggestions de métiers issues des référentiels ROME.',
  ],
  [
    "Qu'est-ce que le référentiel ROME ?",
    "Le Répertoire Opérationnel des Métiers et des Emplois est l'outil de référence de France Travail qui structure l'ensemble des métiers en France.",
  ],
  [
    'Puis-je passer les tests sans faire l\'intégralité du bilan ?',
    'Nous proposons des modules courts d\'évaluation de profil ou de coaching incluant la passation d\'un test spécifique en dehors du cadre global du bilan.',
  ],
  [
    'Les données de mes tests sont-elles protégées (RGPD) ?',
    'Oui, toutes nos plateformes d\'évaluation respectent scrupuleusement les normes RGPD. Vos données sont chiffrées et ne sont jamais vendues.',
  ],
  [
    'Que se passe-t-il si je ne me reconnais pas dans les résultats d\'un test ?',
    'Le test n\'est qu\'un outil de dialogue. Si les résultats ne vous correspondent pas, le consultant travaille avec vous pour comprendre les écarts constatés.',
  ],
  [
    "Qu'est-ce qu'un test de gestion du stress ou d'intelligence émotionnelle ?",
    "C'est un outil qui mesure votre capacité à identifier, comprendre et réguler vos émotions ainsi que celles de vos collaborateurs en situation complexe.",
  ],
  [
    'Peut-on utiliser ces tests pour le recrutement en entreprise ?',
    'Oui, les entreprises font appel à Alt RH Formations pour évaluer la personnalité des candidats short-listés et sécuriser leurs recrutements.',
  ],
  [
    'Existe-t-il des tests pour évaluer le potentiel managérial ?',
    'Oui, nous disposons d\'outils spécifiques évaluant la capacité d\'influence, la prise de décision stratégique et la délégation.',
  ],
  [
    'Le test de positionnement et le test psychométrique, est-ce la même chose ?',
    'Non, le positionnement évalue des connaissances techniques acquises (ex: Excel), le test psychométrique évalue des traits de personnalité ou des schémas d\'intérêts.',
  ],
  [
    'Les tests sont-ils accessibles aux personnes malvoyantes ?',
    'Nos plateformes de tests intègrent de plus en plus d\'options d\'accessibilité numérique conformes aux standards en vigueur.',
  ],
  [
    'Combien de tests passe-t-on en moyenne dans un bilan Alt RH ?',
    'En moyenne, nos bénéficiaires passent 2 tests majeurs (un de personnalité globale et un dédié aux intérêts professionnels).',
  ],
  [
    'Quelle est l\'importance de l\'échange de restitution avec le consultant ?',
    'Le rapport écrit seul n\'est qu\'une donnée brute. C\'est l\'échange avec le consultant qui apporte de la valeur en faisant le lien avec votre vécu et votre projet réel.',
  ],
];

const RC = [
  [
    "Qu'est-ce qu'une fiche métier et à quoi sert-elle ?",
    "C'est un document de synthèse décrivant les missions principales, les compétences requises, les conditions de travail, les formations d'accès et la rémunération d'un métier.",
  ],
  [
    'Comment Alt RH Formations utilise-t-elle les fiches métiers ?',
    'Nous les utilisons comme base de référence lors des bilans pour cartographier précisément les compétences à acquérir pour atteindre le métier cible.',
  ],
  [
    'Qu\'est-ce que la gestion des emplois et des parcours professionnels (GEPP) ?',
    'C\'est une stratégie managériale d\'entreprise visant à adapter les compétences des salariés aux évolutions technologiques et économiques à moyen terme.',
  ],
  [
    'Comment optimiser son CV pour un logiciel de recrutement (ATS) ?',
    'Il faut utiliser des mots-clés précis correspondant aux compétences demandées dans l\'offre d\'emploi, utiliser une mise en page simple et éviter les formats d\'image.',
  ],
  [
    "Qu'est-ce qu'une compétence transférable ?",
    "C'est un savoir ou savoir-faire acquis dans une expérience passée qui peut être réutilisé avec succès dans un tout autre secteur d'activité (ex: gestion de projet).",
  ],
  [
    'Comment réussir son entretien d\'embauche selon vos experts ?',
    'Il faut préparer minutieusement la présentation de son parcours en s\'appuyant sur des résultats chiffrés (méthode STAR) et s\'être renseigné sur la culture de l\'entreprise.',
  ],
  [
    "Qu'est-ce que la méthode STAR en entretien ?",
    "C'est une technique structurée pour répondre aux questions : décrire la Situation, la Tâche à accomplir, l'Action menée, et le Résultat obtenu.",
  ],
  [
    'Alt RH Formations propose-t-elle un service de cabinet de recrutement ?',
    'Oui, nous accompagnons les entreprises dans l\'identification, la sélection, l\'évaluation et l\'intégration de talents sur des profils spécialisés.',
  ],
  [
    "Qu'est-ce que la marque employeur d'une entreprise ?",
    "C'est l'image de marque renvoyée par une entreprise auprès de ses salariés actuels et des candidats potentiels (valeurs, qualité de vie au travail, réputation).",
  ],
  [
    'Comment négocier son salaire lors d\'une embauche ou d\'une promotion ?',
    'Il faut s\'appuyer sur des études de salaires du marché, valoriser ses compétences uniques et proposer une approche globale (salaire fixe + variable + avantages).',
  ],
  [
    'Qu\'est-ce que le personal branding professionnel ?',
    'C\'est l\'art de gérer sa propre image et sa réputation professionnelle comme s\'il s\'agissait d\'une marque, notamment sur les réseaux sociaux comme LinkedIn.',
  ],
  [
    'Pourquoi utiliser LinkedIn pour sa recherche d\'emploi ou son réseau ?',
    'LinkedIn est le premier réseau professionnel mondial. Il permet de se faire chasser par les recruteurs, de faire de la veille et de développer son réseau direct.',
  ],
  [
    "Qu'est-ce qu'un entretien professionnel obligatoire ?",
    "C'est un entretien légal que l'employeur doit réaliser tous les deux ans avec chaque salarié, dédié à ses perspectives d'évolution professionnelle et de formation.",
  ],
  [
    'Quelle est la différence entre l\'entretien annuel d\'évaluation et l\'entretien professionnel ?',
    'L\'entretien annuel évalue les performances de l\'année écoulée et fixe les objectifs. L\'entretien professionnel est prospectif et centré sur le parcours de carrière et la formation.',
  ],
  [
    'Qu\'est-ce que la mobilité interne dans une entreprise ?',
    'C\'est le fait pour un salarié de changer de poste ou de responsabilité au sein de la même structure ou du même groupe.',
  ],
  [
    'Comment savoir si mon profil correspond aux besoins actuels du marché du travail ?',
    'Nos consultants RH réalisent des diagnostics d\'employabilité pour analyser l\'attractivité de votre profil face à l\'offre et à la demande.',
  ],
  [
    "Qu'est-ce qu'un chasseur de têtes ?",
    "C'est un recruteur spécialisé qui démarche directement des professionnels hautement qualifiés ou de niveau direction pour le compte d'entreprises, même s'ils ne sont pas activement à l'écoute du marché.",
  ],
  [
    'Quelles sont les compétences les plus recherchées par les recruteurs aujourd\'hui ?',
    'Outre l\'expertise technique (hard skills), les recruteurs privilégient l\'adaptabilité, l\'esprit d\'équipe, la communication et l\'intelligence émotionnelle (soft skills).',
  ],
  [
    'Comment rédiger une lettre de motivation efficace en 2026 ?',
    'Elle doit être courte, personnalisée, structurée selon la méthode « Vous (l\'entreprise), Moi (mon parcours), Nous (notre future collaboration) ». Modernisez-la en insistant sur l\'impact opérationnel.',
  ],
  [
    "Qu'est-ce qu'un projet de transition professionnelle (PTP) ?",
    "C'est le dispositif qui remplace l'ancien CIF, permettant à tout salarié de s'absenter de son poste pour suivre une formation certifiante en vue d'une reconversion.",
  ],
  [
    "Qu'est-ce que l'outplacement individuel ?",
    "C'est un accompagnement au reclassement externe proposé par l'entreprise à un salarié qui la quitte (généralement suite à un licenciement ou rupture conventionnelle).",
  ],
  [
    'Comment se déroule un accompagnement à l\'outplacement chez Alt RH ?',
    'Nous proposons un bilan de transition, des ateliers de techniques de recherche d\'emploi intensives, du réseau et un soutien psychologique jusqu\'au retour à l\'emploi.',
  ],
  [
    'Comment gérer une reconversion professionnelle après 45 ans ?',
    'C\'est un atout majeur. Il convient de capitaliser sur votre maturité professionnelle, d\'identifier vos compétences clés transférables et de cibler des secteurs en pénurie de main-d\'œuvre.',
  ],
  [
    'Qu\'est-ce que la flexibilité du travail et quel impact sur les carrières ?',
    'Le développement du télétravail, du management hybride et du freelancing redéfinit la gestion des carrières en demandant plus d\'autonomie et de compétences digitales.',
  ],
  [
    'Comment contacter Alt RH Formations pour un besoin en recrutement ou de carrière ?',
    'Vous pouvez remplir notre formulaire de contact dédié aux entreprises ou aux particuliers sur alt-rh.com ou appeler notre agence pour fixer un premier rendez-vous gratuit.',
  ],
];

export function extraCategories() {
  return [
    cat('certification', 'Certifications, RNCP, RS & Qualiopi', C),
    cat('financement-cpf', 'Financement via le Compte Personnel de Formation (CPF)', CPF),
    cat('financement-france-travail', 'Financement via France Travail', FT),
    cat('financement-opco', 'Financement via les OPCO & employeurs', OPCO),
    cat('bilan', 'Bilans de compétences (méthodologie & déroulement)', B),
    cat('tests-metiers', 'Tests métiers & outils psychométriques', TM),
    cat('recrutement-carriere', 'Recrutement, gestion de carrière & fiches métiers', RC),
  ];
}
