import React, { useState, useCallback, useMemo } from 'react';
import { certifications, hero, categories, certificationEditorial } from '../data/certification';
import CardFormation from '../components/Card/CardFormation';
import Breadcrumb from '../components/Breadcrumb';
import Hero from '../components/Hero/Hero';
import FiltreCat from '../components/Items/FiltreCat';
import CallToAction from '../components/CallToAction';
import SEOHead from '../components/SEO/SEOHead';

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
    <div className="bg-white min-h-screen">
      <SEOHead
        title="Certifications professionnelles — Cybersécurité, DevOps, Développement"
        description="Préparez vos certifications professionnelles avec Alt RH & formations : CISSP, CCNA, AWS, Azure, ISTQB, DevSecOps et bien plus. Formations certifiantes finançables CPF et OPCO."
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

      <section className="py-10 lg:py-14 px-6 bg-white border-b border-border">
        <div className="max-w-container-lg mx-auto text-center">
          <span className="inline-block text-accent font-semibold text-[11px] uppercase tracking-[0.18em] mb-3">
            {ed.badge}
          </span>
          <h2 className="font-heading font-bold text-primary uppercase tracking-tight text-xl md:text-2xl lg:text-[1.65rem] leading-snug mb-5">
            {ed.headline}
          </h2>
          <div className="space-y-4 text-content-muted font-body text-sm md:text-[15px] leading-relaxed max-w-2xl mx-auto text-left md:text-center">
            {ed.lead.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <FiltreCat
        categories={categories}
        activeCat={activeCategory}
        setActiveCat={handleFilterCategoryChange}
        searchTerm={searchQuery}
        setSearchTerm={setSearchQuery}
        searchPlaceholder="Rechercher par nom, catégorie ou code RNCP / RS…"
        sectionLabel="Catégories"
      />

    <section id="catalogue-certifications-root" className="pt-10 lg:pt-12 pb-16 px-6 scroll-mt-[280px]">
      <div className="max-w-[min(100%,90rem)] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 lg:gap-6">
          {filteredCertifs.map((certif) => (
            <CardFormation
              key={certif.id}
              title={certif.nom}
              image={
                certif.imageUrl ||
                'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80'
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

      <section className="py-10 lg:py-14 px-6 bg-surface-soft border-b border-border">
        <div className="max-w-container-xl mx-auto">
          <div className="flex items-center mb-6">
            <div className="w-[5px] h-8 bg-accent rounded-full mr-3 shrink-0" />
            <h2 className="font-heading font-bold text-lg md:text-xl text-primary uppercase tracking-tight">
              {ed.pourquoiCertifiante.titre}
            </h2>
          </div>
          <div className="space-y-3.5 text-content-muted font-body text-sm md:text-[15px] leading-relaxed">
            {ed.pourquoiCertifiante.paragraphes.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-14 px-6 bg-white border-b border-border">
        <div className="max-w-container-xl mx-auto">
          <div className="flex items-center mb-5">
            <div className="w-[5px] h-8 bg-accent rounded-full mr-3 shrink-0" />
            <h2 className="font-heading font-bold text-lg md:text-xl text-primary uppercase tracking-tight">
              {ed.reconversion.titre}
            </h2>
          </div>
          <p className="text-content-muted font-body text-sm md:text-[15px] leading-relaxed mb-5">
            {ed.reconversion.texte}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-content-muted font-body text-sm leading-relaxed">
            {ed.reconversion.points.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-12 lg:py-14 px-6 bg-white">
        <div className="max-w-container-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {ed.publics.map((bloc) => (
              <article
                key={bloc.id}
                className="rounded-2xl border border-border bg-surface-soft p-5 md:p-6 shadow-sm flex flex-col"
              >
                <h3 className="font-heading font-bold text-base text-primary uppercase tracking-wide mb-2.5 leading-snug">
                  {bloc.titre}
                </h3>
                <p className="text-content-muted font-body text-sm leading-relaxed mb-4">{bloc.intro}</p>
                <ul className="list-disc pl-5 space-y-1.5 text-content-muted font-body text-sm leading-relaxed mt-auto">
                  {bloc.points.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-14 px-6 bg-surface-soft border-y border-border">
        <div className="max-w-container-3xl mx-auto">
          <h2 className="font-heading font-bold text-lg md:text-xl text-primary text-center uppercase tracking-wide mb-8 leading-snug">
            {ed.complementaires.titre}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ed.complementaires.blocs.map((b) => (
              <div key={b.titre} className="rounded-xl border border-border bg-white p-5 shadow-sm">
                <h3 className="font-heading font-semibold text-primary uppercase text-xs tracking-wide mb-2">
                  {b.titre}
                </h3>
                <p className="text-content-muted font-body text-sm leading-relaxed">{b.texte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-14 px-6 bg-white">
        <div className="max-w-container-xl mx-auto">
          <div className="flex items-center mb-5">
            <div className="w-[5px] h-8 bg-accent rounded-full mr-3 shrink-0" />
            <h2 className="font-heading font-bold text-lg md:text-xl text-primary uppercase tracking-tight">
              {ed.approche.titre}
            </h2>
          </div>
          <p className="text-content-muted font-body text-sm md:text-[15px] leading-relaxed mb-5">{ed.approche.intro}</p>
          <ul className="list-disc pl-5 space-y-1.5 text-content-muted font-body text-sm md:text-[15px] leading-relaxed mb-6">
            {ed.approche.points.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="text-content-muted font-body text-sm leading-relaxed border-t border-border pt-5">
            {ed.approche.entrepriseFocus}
          </p>
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
