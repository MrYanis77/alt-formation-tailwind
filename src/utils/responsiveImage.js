/** Chemin fallback local (remplace Unsplash). */
export const FALLBACK_IMAGE = '/assets/images/fallback.webp';

const WIDTHS = [400, 800, 1200];

/**
 * Parse un chemin /assets/images/foo.jpg en composants.
 */
export function parseAssetImagePath(src) {
  if (!src || typeof src !== 'string') return null;
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return { external: true, src };
  }
  const clean = src.split('?')[0];
  const match = clean.match(/^(.+\/)([^/]+)\.(\w+)$/i);
  if (!match) return null;
  return {
    external: false,
    dir: match[1],
    baseName: match[2].replace(/-\d+w$/, ''),
    ext: match[3].toLowerCase(),
    src: clean,
  };
}

/**
 * Variante WebP responsive : /assets/images/foo-800w.webp
 */
export function webpVariantSrc(src, width) {
  const parsed = parseAssetImagePath(src);
  if (!parsed || parsed.external) return null;
  return `${parsed.dir}${parsed.baseName}-${width}w.webp`;
}

/**
 * srcSet WebP pour ResponsiveImage.
 */
export function buildWebpSrcSet(src, widths = WIDTHS) {
  const parsed = parseAssetImagePath(src);
  if (!parsed || parsed.external || parsed.ext === 'webp') return null;
  return widths
    .map((w) => {
      const url = webpVariantSrc(src, w);
      return url ? `${url} ${w}w` : null;
    })
    .filter(Boolean)
    .join(', ');
}

/**
 * Poster dérivé d'une vidéo : /assets/video/foo.mp4 → /assets/video/foo-poster.webp
 */
export function videoPosterSrc(videoSrc) {
  if (!videoSrc) return null;
  return videoSrc.replace(/\.mp4$/i, '-poster.webp');
}

export { WIDTHS };
