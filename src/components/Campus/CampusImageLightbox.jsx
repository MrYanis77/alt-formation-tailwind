import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container) {
  return container ? [...container.querySelectorAll(FOCUSABLE_SELECTOR)] : [];
}

/**
 * Lightbox plein écran pour la galerie photos campus (backdrop flouté, navigation).
 */
export default function CampusImageLightbox({
  open,
  onClose,
  title,
  images = [],
  initialIndex = 0,
}) {
  const titleId = useId();
  const [slideIndex, setSlideIndex] = useState(initialIndex);
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  const count = images.length;
  const safeIndex =
    count === 0 ? 0 : ((slideIndex % count) + count) % count;
  const currentSrc = images[safeIndex];

  useEffect(() => {
    if (!open) return undefined;
    previouslyFocusedRef.current = document.activeElement;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusFrame = requestAnimationFrame(() => closeButtonRef.current?.focus());
    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = prev;
      previouslyFocusedRef.current?.focus?.();
    };
  }, [open]);

  const goPrev = useCallback(() => {
    if (count <= 1) return;
    setSlideIndex((i) => i - 1);
  }, [count]);

  const goNext = useCallback(() => {
    if (count <= 1) return;
    setSlideIndex((i) => i + 1);
  }, [count]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        const focusableElements = getFocusableElements(dialogRef.current);
        const firstElement = focusableElements[0];
        const lastElement = focusableElements.at(-1);
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
        return;
      }
      if (count <= 1) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, count, onClose, goPrev, goNext]);

  if (!open || count === 0) return null;

  return (
    <dialog
      ref={dialogRef}
      open
      onCancel={onClose}
      className="fixed inset-0 z-[100] m-0 max-w-none w-full h-full items-center justify-center p-4 sm:p-6 bg-transparent"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 z-0 bg-white/50 backdrop-blur-xl cursor-default border-0 p-0"
        aria-label="Fermer la vue agrandie"
        tabIndex="-1"
        onClick={onClose}
      />

      <p id={titleId} className="sr-only">
        Galerie photos — {title}
      </p>

      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        className="fixed top-4 right-4 z-[102] flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-primary shadow-lg border border-border hover:bg-accent hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        aria-label="Fermer"
      >
        <X className="w-5 h-5" aria-hidden />
      </button>

      {count > 1 ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          className="fixed left-3 sm:left-6 top-1/2 z-[102] -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-primary shadow-lg border border-border hover:bg-primary hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          aria-label="Photo précédente"
        >
          <ChevronLeft className="w-6 h-6" aria-hidden />
        </button>
      ) : null}

      {count > 1 ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          className="fixed right-3 sm:right-6 top-1/2 z-[102] -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-primary shadow-lg border border-border hover:bg-primary hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          aria-label="Photo suivante"
        >
          <ChevronRight className="w-6 h-6" aria-hidden />
        </button>
      ) : null}

      <div
        className="relative z-[101] max-h-[85vh] max-w-[90vw] rounded-lg overflow-hidden shadow-2xl bg-white ring-2 ring-white/80"
      >
        <img
          src={currentSrc}
          alt={`${title} — vue ${safeIndex + 1} sur ${count}`}
          className="max-h-[85vh] max-w-[90vw] w-auto h-auto object-contain block"
          decoding="async"
        />
      </div>
    </dialog>
  );
}
