import { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Hero from '../components/Hero/Hero';
import Breadcrumb from '../components/Breadcrumb';
import CardFormation from '../components/Card/CardFormation';
import CallToAction from '../components/CallToAction';
import FiltreCat from '../components/Items/FiltreCat';
import { Filter } from 'lucide-react';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800';

/**
 * Composant partagé pour les pages catalogue de formations.
 *
 * Props :
 * - hero        : { titre, sousTitre, video }
 * - breadcrumb  : string (label du dernier fil d'Ariane)
 * - catalogue   : Array<{ id, label, description, items: [{ titre, features, imageUrl, href }] }>
 * - categoryIcons : Record<string, ReactNode> (optionnel)
 * - cta         : { titre, sousTitre, bouton, lien } (optionnel)
 * - crossLinks  : Array<{ label, to }> (optionnel — liens vers les autres types de formations)
 */
export default function CatalogueFormationsPage({
  hero,
  breadcrumb,
  catalogue,
  categoryIcons = {},
  cta,
  crossLinks = [],
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const location = useLocation();

  // Scroll vers l'ancre si présente dans l'URL
  useMemo(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setActiveCategory(id);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.hash]);

  const filteredCatalogue = useMemo(() =>
    catalogue
      .map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
          item.titre.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      }))
      .filter(cat => cat.items.length > 0),
    [catalogue, searchTerm]
  );

  const visibleCatalogue = useMemo(() =>
    activeCategory === 'all'
      ? filteredCatalogue
      : filteredCatalogue.filter(c => c.id === activeCategory),
    [filteredCatalogue, activeCategory]
  );

  return (
    <div className="bg-surface min-h-screen antialiased">

      {/* ── HERO ── */}
      <Hero title={hero.titre} subtitle={hero.sousTitre} video={hero.video} />

      {/* ── BREADCRUMB ── */}
      <Breadcrumb items={[{ label: 'Accueil', to: '/accueil' }, { label: breadcrumb }]} />

      {/* ── FILTRE & RECHERCHE ── */}
      <FiltreCat
        categories={catalogue.map(cat => ({
          id: cat.id,
          label: cat.label,
          icon: categoryIcons[cat.id] || <Filter className="w-3.5 h-3.5" />,
        }))}
        activeCat={activeCategory}
        setActiveCat={setActiveCategory}
        allValue="all"
        allLabel="Tous les domaines"
        sectionLabel="Domaines"
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchPlaceholder="Rechercher une formation…"
      />

      {/* ── CATALOGUE ── */}
      <div className="space-y-4 py-12">
        {visibleCatalogue.length > 0 ? (
          visibleCatalogue.map(cat => (
            <section key={cat.id} id={cat.id} className="scroll-mt-[180px] animate-fade-in">

              {/* Header catégorie */}
              <div className="max-w-container-3xl mx-auto px-6 mb-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                    {categoryIcons[cat.id] || <Filter className="w-6 h-6" />}
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-primary uppercase tracking-wide">
                      {cat.label}
                    </h2>
                    {cat.description && (
                      <p className="text-content-muted text-sm font-body">{cat.description}</p>
                    )}
                  </div>
                </div>
                <div className="w-full h-px bg-gray-100" />
              </div>

              {/* Grille formations */}
              <div className="px-6">
                <div className="max-w-container-3xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cat.items.map((item, idx) => (
                      <CardFormation
                        key={idx}
                        title={item.titre}
                        image={item.imageUrl || FALLBACK_IMG}
                        points={item.features}
                        variant="white"
                        href={item.href}
                      />
                    ))}
                  </div>
                </div>
              </div>

            </section>
          ))
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <Filter className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Aucune formation trouvée</h3>
            <p className="text-content-muted">Essayez d'ajuster vos critères de recherche.</p>
            <button
              onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}
              className="mt-6 text-accent font-bold hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      {/* ── LIENS CROISÉS VERS LES AUTRES TYPES ── */}
      {crossLinks.length > 0 && (
        <section className="py-12 px-6 bg-gray-50 border-y border-gray-100">
          <div className="max-w-container-xl mx-auto flex flex-wrap items-center justify-center gap-6">
            {crossLinks.map((link, i) => (
              <Link
                key={i}
                to={link.to}
                className="inline-flex items-center gap-2 text-primary font-bold hover:text-accent transition-colors text-sm no-underline"
              >
                {link.label} →
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA FINAL ── */}
      <CallToAction
        variante="sombre"
        titre={cta?.titre || "Besoin d'un conseil personnalisé ?"}
        sousTitre={cta?.sousTitre || "Nos conseillers sont à votre écoute pour vous orienter vers la formation la plus adaptée."}
        texteBouton={cta?.bouton || "PRENDRE RENDEZ-VOUS"}
        lienBouton={cta?.lien || "/contact"}
      />

    </div>
  );
}
