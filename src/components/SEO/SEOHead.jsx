import { useEffect } from 'react';

/**
 * SEOHead — Injecte dynamiquement les balises <title> et <meta> SEO dans le <head>.
 *
 * @param {string} title       - Titre de la page (affiché dans l'onglet + résultats Google)
 * @param {string} description - Meta description (160 car. max recommandé)
 * @param {string} [canonical] - URL canonique de la page (sans slash final)
 * @param {string} [ogImage]   - URL absolue de l'image Open Graph (pour réseaux sociaux)
 */
export default function SEOHead({ title, description, canonical, ogImage }) {
  const siteName = 'Alt RH & formations';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultOgImage = 'https://alt-rh.com/assets/logo-altrh.png';

  useEffect(() => {
    // Titre
    document.title = fullTitle;

    // Helper pour upsert une balise meta
    const setMeta = (selector, attribute, value) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const [attr, val] = selector.replace('[', '').replace(']', '').split('=');
        el.setAttribute(attr.trim(), val.replace(/"/g, '').trim());
        document.head.appendChild(el);
      }
      el.setAttribute(attribute, value);
    };

    if (description) {
      setMeta('meta[name="description"]', 'content', description);
      setMeta('meta[property="og:description"]', 'content', description);
    }

    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:type"]', 'content', 'website');
    setMeta('meta[property="og:site_name"]', 'content', siteName);
    setMeta('meta[property="og:image"]', 'content', ogImage || defaultOgImage);

    if (canonical) {
      setMeta('meta[property="og:url"]', 'content', canonical);
      // Canonical link tag
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonical);
    }
  }, [fullTitle, description, canonical, ogImage]);

  return null;
}
