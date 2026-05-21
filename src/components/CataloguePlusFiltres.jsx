import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';

function FilterChipGroup({ label, options, value, onChange, activeVariant = 'accent' }) {
  const activeRing =
    activeVariant === 'primary'
      ? 'border-primary bg-primary/5 ring-2 ring-primary/15 shadow-sm'
      : 'border-accent bg-accent/10 ring-2 ring-accent/20 shadow-sm';

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-content-muted uppercase tracking-widest">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-2">
        {options.map((opt) => {
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              title={opt.hint}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-left border transition-all ${
                active
                  ? activeRing
                  : 'border-gray-200 bg-white hover:border-accent/40 hover:bg-surface-soft'
              }`}
            >
              {opt.icon ? (
                <span
                  className={`[&>svg]:w-3.5 [&>svg]:h-3.5 shrink-0 ${
                    active ? 'text-accent' : 'text-content-muted'
                  }`}
                >
                  {opt.icon}
                </span>
              ) : null}
              <span className="flex flex-col items-start">
                <span
                  className={`font-heading font-extrabold text-xs sm:text-sm tracking-wide ${
                    active
                      ? activeVariant === 'primary'
                        ? 'text-primary'
                        : 'text-accent'
                      : 'text-primary'
                  }`}
                >
                  {opt.label}
                </span>
                {opt.hint ? (
                  <span className="text-[10px] sm:text-[11px] text-content-muted leading-snug mt-0.5 hidden sm:block">
                    {opt.hint}
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Bouton « Plus de filtres » : panneau repliable avec référentiel titre (RNCP/RS) et domaines.
 */
export default function CataloguePlusFiltres({
  repertoireFilter,
  onRepertoireChange,
  repertoireOptions = [],
  modaliteFilter,
  onModaliteChange,
  modaliteOptions = [],
  activeDomain,
  onDomainChange,
  domainOptions = [],
  onReset,
}) {
  const panelId = useId();
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);

  const extraCount =
    (repertoireFilter !== 'all' ? 1 : 0) +
    (modaliteFilter !== 'all' ? 1 : 0) +
    (activeDomain !== 'all' ? 1 : 0);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const handleReset = () => {
    onRepertoireChange?.('all');
    onModaliteChange?.('all');
    onDomainChange?.('all');
    onReset?.();
  };

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-bold transition-all ${
          open || extraCount > 0
            ? 'border-accent bg-accent/10 text-accent shadow-sm'
            : 'border-border bg-white text-primary hover:border-accent/50 hover:bg-orange-50/40'
        }`}
      >
        <SlidersHorizontal className="w-4 h-4 shrink-0" aria-hidden />
        Plus de filtres
        {extraCount > 0 ? (
          <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-accent text-white text-[10px] font-extrabold">
            {extraCount}
          </span>
        ) : null}
        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          id={panelId}
          role="region"
          aria-label="Filtres avancés du catalogue"
          className="absolute right-0 top-full mt-2 z-50 w-[min(100vw-3rem,28rem)] rounded-xl border border-border bg-white shadow-xl p-4 sm:p-5 space-y-5"
        >
          <FilterChipGroup
            label="Référentiel titre"
            options={repertoireOptions}
            value={repertoireFilter}
            onChange={onRepertoireChange}
            activeVariant="primary"
          />

          {modaliteOptions.length > 0 ? (
            <FilterChipGroup
              label="Modalité"
              options={modaliteOptions}
              value={modaliteFilter}
              onChange={onModaliteChange}
              activeVariant="accent"
            />
          ) : null}

          {domainOptions.length > 0 ? (
            <FilterChipGroup
              label="Domaines"
              options={domainOptions}
              value={activeDomain}
              onChange={onDomainChange}
              activeVariant="accent"
            />
          ) : null}

          {extraCount > 0 ? (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-bold text-accent hover:text-primary hover:underline"
            >
              Réinitialiser les filtres avancés
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
