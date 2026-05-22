/**
 * Liens de navigation statiques (sans catalogue formations lourd).
 * Le sous-menu Formations est chargé dynamiquement via navdata-mega.js.
 */
export const navlinksStatic = [
  {
    label: "Formations",
    href: "/formations",
    megaMenu: true,
    lazySubmenu: true,
  },
  { label: "Certifications", href: "/certification" },
  { label: "Financements", href: "/financements" },
  { label: "Bilan de Compétences", href: "/bilan-de-competences" },
  {
    label: "Ressources",
    submenu: [
      {
        label: "IA & Ressources numériques",
        href: "/ressources-ia",
        image: "/assets/images/analyste_data.jpg",
        description: "Fiches pratiques, outils IA et ressources pédagogiques gratuites.",
      },
      {
        label: "Blog & actualités",
        href: "/blog",
        image: "/assets/images/blog.jpg",
        description: "Articles, conseils et tendances sur la formation et le digital.",
      },
      {
        label: "Gestion de Carrières",
        href: "/carrieres",
        image: "/assets/images/emploi.jpg",
        description: "Gestion de carrière, coaching emploi et accompagnement professionnel.",
      },
    ],
  },
  { label: "Nos Campus", href: "/campus" },
  { label: "F.A.Q", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Nous rejoindre", href: "/nous-rejoindre" },
];

/** Charge le module méga-menu (JSON formations) à la demande. */
let megaCache = null;
export async function loadNavMegaData() {
  if (megaCache) return megaCache;
  megaCache = await import('./navdata-mega.js');
  return megaCache;
}

/** navlinks complets avec sous-menu Formations (après chargement lazy). */
export async function getFullNavlinks() {
  const mega = await loadNavMegaData();
  return mega.navlinks;
}
