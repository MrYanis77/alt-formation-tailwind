/** Local fallback image. */
export const FALLBACK_IMAGE = '/assets/images/fallback.webp';

const WIDTHS = [400, 800, 1200];

/**
 * Parse /assets/images/foo.jpg-like paths into reusable parts.
 */
export function parseAssetImagePath(src) {
  if (!src || typeof src !== 'string') return null;
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return { external: true, src };
  }
  const clean = src.split('?')[0];
  const match = /^(.+\/)([^/]+)\.(\w+)$/i.exec(clean);
  if (!match) return null;
  return {
    external: false,
    dir: match[1],
    baseName: match[2].replace(/-\d+w$/, ''),
    ext: match[3].toLowerCase(),
    src: clean,
  };
}

export function hasLocalWebpVariants(src) {
  const parsed = parseAssetImagePath(src);
  return Boolean(
    parsed
      && !parsed.external
      && parsed.ext !== 'webp'
      && parsed.dir.startsWith('/assets/images/')
  );
}

/**
 * Responsive WebP variant: /assets/images/foo-800w.webp.
 */
export function webpVariantSrc(src, width) {
  const parsed = parseAssetImagePath(src);
  if (!parsed || parsed.external || !hasLocalWebpVariants(src)) return null;
  return `${parsed.dir}${parsed.baseName}-${width}w.webp`;
}

/**
 * WebP srcSet for local optimized /assets/images files only.
 */
export function buildWebpSrcSet(src, widths = WIDTHS) {
  const parsed = parseAssetImagePath(src);
  if (!parsed || !hasLocalWebpVariants(src)) return null;
  return widths
    .map((w) => {
      const url = webpVariantSrc(src, w);
      return url ? `${url} ${w}w` : null;
    })
    .filter(Boolean)
    .join(', ');
}

export { WIDTHS };
