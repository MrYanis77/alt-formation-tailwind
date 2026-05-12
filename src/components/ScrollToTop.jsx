import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Si l'URL contient une ancre (ex: /a-propos#equipe), on essaie de scroller vers cet élément
    if (hash) {
      // Un petit setTimeout permet de s'assurer que la nouvelle page a eu le temps de faire son rendu
      setTimeout(() => {
        const element = document.getElementById(hash.replace('#', ''));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Comportement par défaut : on remonte tout en haut instantanément
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}
