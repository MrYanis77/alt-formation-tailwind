import { useEffect, useRef, useState } from 'react';
import ResponsiveImage from './ResponsiveImage';
import { FALLBACK_IMAGE } from '../utils/responsiveImage';

/**
 * Hero video with optional poster and lazy autoplay.
 */
export default function HeroVideo({
  video,
  poster,
  priority = false,
  className = 'absolute inset-0 w-full h-full object-cover z-0',
}) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);

  const posterSrc = posterFailed ? (video ? null : FALLBACK_IMAGE) : (poster || (!video ? FALLBACK_IMAGE : null));

  useEffect(() => {
    if (!video) return undefined;
    const el =
      sectionRef.current?.closest('section') ||
      sectionRef.current?.parentElement ||
      sectionRef.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [video]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !shouldLoadVideo) return;
    v.load();
    v.play().catch(() => {});
  }, [shouldLoadVideo, video]);

  return (
    <div ref={sectionRef} className="absolute inset-0 z-0">
      {posterSrc && (
        <ResponsiveImage
          src={posterSrc}
          alt=""
          ariaHidden
          priority={priority}
          sizes="100vw"
          className={className}
          onError={() => setPosterFailed(true)}
        />
      )}
      {shouldLoadVideo && video && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload={priority ? 'auto' : 'metadata'}
          className={`${className} ${posterSrc ? 'absolute inset-0' : ''}`}
        >
          <source src={video} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
