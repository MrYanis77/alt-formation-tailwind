// Tracking de visites commenté (nécessite le backend /api/visit)
/*
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/admin') || path.startsWith('/mon-espace')) return;

    const body = JSON.stringify({ page: path });

    try {
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' });
        navigator.sendBeacon('/api/visit', blob);
        return;
      }
    } catch {
      // fallback
    }

    fetch('/api/visit', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {});
  }, [location.pathname]);
}
*/

export default function usePageTracking() {}
