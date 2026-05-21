import { useCallback, useEffect, useRef, useState } from 'react';
import {
  clearCatalogueFilters,
  getCatalogueTypeFromUrl,
  getModaliteFromUrl,
  resolveCatalogueFilters,
  writeCatalogueFilters,
} from '../utils/catalogueFiltersSession';

const SEARCH_DEBOUNCE_MS = 300;

/**
 * États filtres catalogue + persistance sessionStorage (F5, même onglet).
 * @param {{ enabled: boolean, hash: string, typeQuery: string | null, modaliteQuery: string | null, navigate: (to: string, opts?: object) => void }} options
 */
export default function useCatalogueFiltersSession({ enabled, hash, typeQuery, modaliteQuery, navigate }) {
  const initialRef = useRef(null);
  if (enabled && initialRef.current === null) {
    initialRef.current = resolveCatalogueFilters(hash, typeQuery, modaliteQuery);
  }

  const initial = enabled
    ? initialRef.current
    : { q: '', repertoire: 'all', domain: 'all', type: 'all', modalite: 'all', needsTypeNavigation: false };

  const [sharedSearch, setSharedSearch] = useState(initial.q ?? '');
  const [repertoireFilter, setRepertoireFilter] = useState(initial.repertoire ?? 'all');
  const [activeDomain, setActiveDomain] = useState(initial.domain ?? 'all');
  const [modaliteFilter, setModaliteFilter] = useState(initial.modalite ?? 'all');

  const formationVisibility = getCatalogueTypeFromUrl(hash, typeQuery);

  const typeNavigationDone = useRef(false);

  useEffect(() => {
    if (!enabled || typeNavigationDone.current) return;
    if (!initial.needsTypeNavigation) return;

    typeNavigationDone.current = true;
    navigate(`/formations#${initial.typeToNavigate}`, { replace: true });
  }, [enabled, initial.needsTypeNavigation, initial.typeToNavigate, navigate]);

  useEffect(() => {
    if (!enabled) return;
    setModaliteFilter(getModaliteFromUrl(modaliteQuery));
  }, [enabled, modaliteQuery]);

  useEffect(() => {
    if (!enabled) return undefined;

    const payload = {
      q: sharedSearch,
      repertoire: repertoireFilter,
      domain: activeDomain,
      type: formationVisibility,
      modalite: modaliteFilter,
    };

    const timer = setTimeout(() => {
      writeCatalogueFilters(payload);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [enabled, sharedSearch, repertoireFilter, activeDomain, formationVisibility, modaliteFilter]);

  const resetAdvancedFilters = useCallback(() => {
    setRepertoireFilter('all');
    setActiveDomain('all');
    setModaliteFilter('all');
    writeCatalogueFilters({
      repertoire: 'all',
      domain: 'all',
      modalite: 'all',
      type: formationVisibility,
      q: sharedSearch,
    });
  }, [formationVisibility, sharedSearch]);

  const clearAllFilters = useCallback(() => {
    clearCatalogueFilters();
    setSharedSearch('');
    setRepertoireFilter('all');
    setActiveDomain('all');
    setModaliteFilter('all');
    navigate('/formations', { replace: true });
  }, [navigate]);

  return {
    sharedSearch,
    setSharedSearch,
    repertoireFilter,
    setRepertoireFilter,
    activeDomain,
    setActiveDomain,
    modaliteFilter,
    setModaliteFilter,
    formationVisibility,
    resetAdvancedFilters,
    clearAllFilters,
  };
}
