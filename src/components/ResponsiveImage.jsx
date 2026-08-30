import { buildWebpSrcSet, parseAssetImagePath, hasLocalWebpVariants } from '../utils/responsiveImage';

/**
 * Responsive image with WebP variants only when generated local variants exist.
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
  onError,
  ...rest
}) {
  const parsed = parseAssetImagePath(src);
  const webpSrcSet = parsed && hasLocalWebpVariants(src) ? buildWebpSrcSet(src) : null;
  const loading = priority ? 'eager' : 'lazy';
  const fetchPriority = priority ? 'high' : undefined;
  const accessibleAlt = ariaHidden ? '' : alt;

  const imgProps = {
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
        <img src={src} alt={accessibleAlt} sizes={sizes} {...imgProps} />
      </picture>
    );
  }

  return <img src={src} alt={accessibleAlt} {...imgProps} />;
}
