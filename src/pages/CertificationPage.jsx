import React, { useState, useCallback, useMemo } from 'react';
import { certifications, hero, categories, certificationEditorial } from '../data/certification';
import CardFormation from '../components/Card/CardFormation';
import Breadcrumb from '../components/Breadcrumb';
import Hero from '../components/Hero/Hero';
import FiltreCat from '../components/Items/FiltreCat';
import CallToAction from '../components/CallToAction';
import SEOHead from '../components/SEO/SEOHead';

const CheckIcon = () => (
  <svg
    className="w-5 h-5 text-accent shrink-0 mt-0.5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

export default function CertificationPage() {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');

  const scrollToCertificationGrid = useCallback(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getElementById('catalogue-certifications-root')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
    });
  }, []);

  const handleFilterCategoryChange = useCallback(
    (cat) => {
      setActiveCategory(cat);
      scrollToCertificationGrid();
    },
    [scrollToCertificationGrid]
  );

  const filteredCertifs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return certifications.filter((certif) => {
      const matchCategory =
        activeCategory === 'Tous' || certif.category === activeCategory;
      if (!matchCategory) return false;
      if (!q) return true;
      const haystack = [certif.nom, certif.category, certif.rncp, certif.repertoire]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [activeCategory, searchQuery]);

  const ed = certificationEditorial;

  return (
    <div className="bg-surface-soft min-h-screen antialiased">
      <SEOHead
        title="Certifications professionnelles — Cybersécurité, DevOps, Développement"
        description="Préparez vos certifications professionnelles avec Alt RH Formations : CISSP, CCNA, AWS, Azure, ISTQB, DevSecOps et bien plus. Formations certifiantes finançables CPF et OPCO."
        canonical="https://alt-rh.com/certification"
      />

      <Hero
        title={hero.titre}
        subtitle={hero.sousTitre}
        video={hero.video}
        compact
        subtleTypography
      />

      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Certifications' }]} />

      {/* Intro - Texte principal uniquement */}
      <section className="pt-14 lg:pt-16 pb-10 px-6">
        <div className="max-w-container-3xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-[11px] font-extrabold text-accent uppercase tracking-widest mb-3">
              {ed.badge}
            </p>
            <h2 className="font-heading text-lg md:text-xl lg:text-[1.35rem] font-bold text-primary uppercase tracking-tight leading-snug mb-6">
              {ed.headline[0]}
              <br />
              {ed.headline[1]}
            </h2>
            <div className="space-y-4 text-content-muted font-body text-sm md:text-[15px] leading-relaxed">
              {ed.lead.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filtres de recherche */}
      <FiltreCat
        categories={categories}
        activeCat={activeCategory}
        setActiveCat={handleFilterCategoryChange}
        searchTerm={searchQuery}
        setSearchTerm={setSearchQuery}
        searchPlaceholder="Rechercher par nom, catégorie ou code RNCP / RS…"
        sectionLabel="Catégories"
      />

      {/* Catalogue de formations */}
      <section
        id="catalogue-certifications-root"
        className="pt-10 lg:pt-12 pb-16 px-6 scroll-mt-[280px] bg-white"
      >
        <div className="max-w-[min(100%,90rem)] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 lg:gap-6">
            {filteredCertifs.map((certif) => (
              <CardFormation
                key={certif.id}
                title={certif.nom}
                image={
                  certif.imageUrl ||
                  '/assets/images/fallback.webp'
                }
                href={certif.lienFranceCompetence}
                compact
              />
            ))}
          </div>

          {filteredCertifs.length === 0 && (
            <p className="text-center text-content-muted font-body mt-4 py-12">
              Aucune certification ne correspond à votre recherche.
              {searchQuery.trim() ? (
                <>
                  {' '}
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('Tous');
                    }}
                    className="text-accent font-bold underline underline-offset-2 hover:text-primary"
                  >
                    Réinitialiser les filtres
                  </button>
                </>
              ) : null}
            </p>
          )}
        </div>
      </section>

      {/* Avantages / Bénéfices (Déplacés après le catalogue) */}
      <section className="py-14 lg:py-16 px-6 bg-surface-soft border-t border-border">
        <div className="max-w-container-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {ed.benefits.map((b) => (
              <article
                key={b.id}
                className="rounded-2xl border border-border bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-heading font-bold text-primary text-lg mb-3">{b.titre}</h3>
                <p className="text-content-muted font-body text-sm md:text-[15px] leading-relaxed">
                  {b.texte}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Référentiels + publics */}
      <section className="py-14 lg:py-16 px-6 bg-white border-t border-border">
        <div className="max-w-container-3xl mx-auto space-y-14">
          <div>
            <div className="text-center mb-10">
              <p className="text-[11px] font-extrabold text-accent uppercase tracking-widest mb-3">
                Référentiels
              </p>
              <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-primary mb-4">
                {ed.referentiels.titre}
              </h2>
              <p className="text-content-muted font-body text-[15px] leading-relaxed max-w-2xl mx-auto">
                {ed.referentiels.intro}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
              {ed.referentiels.blocs.map((b) => (
                <article
                  key={b.id}
                  className="rounded-2xl border border-border bg-surface-soft p-6 md:p-7"
                >
                  <span className="inline-block text-accent font-heading font-extrabold text-2xl mb-2">
                    {b.titre}
                  </span>
                  <p className="text-primary font-heading font-semibold text-sm mb-3">
                    {b.sousTitre}
                  </p>
                  <p className="text-content-muted font-body text-sm leading-relaxed">{b.texte}</p>
                </article>
              ))}
            </div>
          </div>

          <div>
            <div className="text-center mb-10">
              <p className="text-[11px] font-extrabold text-accent uppercase tracking-widest mb-3">
                Pour qui ?
              </p>
              <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-primary">
                Une certification adaptée à votre situation
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
              {ed.publics.map((bloc) => (
                <article
                  key={bloc.id}
                  className="rounded-2xl border border-border bg-white p-6 shadow-sm flex flex-col"
                >
                  <h3 className="font-heading font-bold text-primary text-lg mb-2">{bloc.titre}</h3>
                  <p className="text-content-muted font-body text-sm leading-relaxed mb-4">
                    {bloc.intro}
                  </p>
                  <ul className="space-y-2 mt-auto">
                    {bloc.points.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-content-muted font-body text-sm leading-relaxed"
                      >
                        <CheckIcon />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Parcours accompagnement */}
      <section className="py-14 lg:py-16 px-6 bg-primary text-white">
        <div className="max-w-container-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[11px] font-extrabold text-accent uppercase tracking-widest mb-3">
              Accompagnement
            </p>
            <h2 className="font-heading text-2xl md:text-3xl font-extrabold mb-4">
              {ed.parcours.titre}
            </h2>
            <p className="text-white/80 font-body text-[15px] leading-relaxed max-w-2xl mx-auto">
              {ed.parcours.intro}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ed.parcours.etapes.map((etape) => (
              <div
                key={etape.numero}
                className="rounded-2xl bg-white/10 border border-white/20 p-6 md:p-8 backdrop-blur-sm"
              >
                <span className="inline-flex w-11 h-11 items-center justify-center rounded-xl bg-accent text-primary font-heading font-bold text-sm mb-4">
                  {etape.numero}
                </span>
                <h3 className="font-heading font-bold text-lg mb-2">{etape.titre}</h3>
                <p className="text-white/85 font-body text-sm leading-relaxed">{etape.texte}</p>
              </div>
            ))}
          </div>
          {ed.parcours.note ? (
            <p className="text-center text-white/70 font-body text-sm mt-8 max-w-2xl mx-auto">
              {ed.parcours.note}
            </p>
          ) : null}
        </div>
      </section>

      <CallToAction
        variante="claire"
        titre="Besoin d'un renseignement ?"
        sousTitre="Nos conseillers vous accompagnent dans le choix de votre certification et le montage de votre dossier de financement."
        texteBouton="Contactez un expert"
        lienBouton="/contact"
      />
    </div>
  );
}