import { buildWebpSrcSet, parseAssetImagePath } from '../utils/responsiveImage';

/**
 * Image responsive avec variantes WebP (-400w, -800w, -1200w) si disponibles.
 */
export default function ResponsiveImage({
  src,
  alt = '',
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  width,
  height,
  aspectRatio,
  ariaHidden = false,
  onClick,
  onError,
  ...rest
}) {
  const parsed = parseAssetImagePath(src);
  const webpSrcSet = parsed && !parsed.external ? buildWebpSrcSet(src) : null;
  const loading = priority ? 'eager' : 'lazy';
  const fetchPriority = priority ? 'high' : undefined;

  const imgProps = {
    alt: ariaHidden ? '' : alt,
    className,
    loading,
    decoding: 'async',
    ...(fetchPriority ? { fetchPriority } : {}),
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
    ...(ariaHidden ? { 'aria-hidden': true } : {}),
    ...(onError ? { onError } : {}),
    ...rest,
  };

  const style = aspectRatio ? { aspectRatio, ...rest.style } : rest.style;
  if (style) imgProps.style = style;

  if (webpSrcSet) {
    return (
      <picture>
        <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
        <img src={src} sizes={sizes} {...imgProps} onClick={onClick} />
      </picture>
    );
  }

  return <img src={src} {...imgProps} onClick={onClick} />;
}
