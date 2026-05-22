import { useEffect, useRef, useState } from 'react';
import ResponsiveImage from './ResponsiveImage';
import { videoPosterSrc } from '../utils/responsiveImage';

/**
 * Vidéo hero optimisée : poster immédiat, chargement différé, pas de vidéo sur mobile.
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
  const [isMobile, setIsMobile] = useState(false);

  const posterSrc = poster || videoPosterSrc(video) || null;

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (isMobile || !video) return undefined;
    const el = sectionRef.current?.closest('section') || sectionRef.current?.parentElement;
    if (!el) {
      setShouldLoadVideo(true);
      return undefined;
    }
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
  }, [isMobile, video]);

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
        />
      )}
      {!isMobile && shouldLoadVideo && video && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload={priority ? 'auto' : 'none'}
          className={`${className} ${posterSrc ? 'absolute inset-0' : ''}`}
        >
          <source src={video.replace(/\.mp4$/i, '.webm')} type="video/webm" />
          <source src={video} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
