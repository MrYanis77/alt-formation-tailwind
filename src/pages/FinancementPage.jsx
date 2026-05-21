import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Briefcase, User, Users } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import Hero from '../components/Hero/Hero';
import CardDesc from '../components/Card/CardDesc';
import CallToAction from '../components/CallToAction';
import SEOHead from '../components/SEO/SEOHead';
import {
  seo,
  hero,
  trustBand,
  navSections,
  questionsOrientees,
  cpf,
  opco,
  poleEmploi,
  alternance,
  autresSolutions,
  ctaFinal,
} from '../data/financement';

const PROFILE_ICONS = {
  salarie: Briefcase,
  demandeur: User,
  employeur: Building2,
  independant: Users,
};

function sectionLinks(section, contactCta) {
  const links = [...(section.footerLinks || [])];
  if (contactCta) {
    links.unshift({ label: contactCta.label, href: contactCta.href });
  }
  return links;
}

export default function FinancementsPage() {
  const [activeProfile, setActiveProfile] = useState(null);

  const scrollToSection = useCallback((sectionId) => {
    requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  const handleProfileClick = useCallback(
    (item) => {
      setActiveProfile(item.id);
      const first = item.sections?.[0];
      if (first) scrollToSection(first);
    },
    [scrollToSection]
  );

  const isSectionHighlighted = (sectionId) => {
    if (!activeProfile) return true;
    const profile = questionsOrientees.items.find((p) => p.id === activeProfile);
    return profile?.sections?.includes(sectionId) ?? true;
  };

  return (
    <div className="bg-surface min-h-screen">
      <SEOHead title={seo.title} description={seo.description} canonical={seo.canonical} />

      <Hero title={hero.titre} subtitle={hero.sousTitre} video={hero.video} />

      <Breadcrumb items={[{ label: 'Accueil', to: '/accueil' }, { label: 'Financements' }]} />

      <main className="py-16 px-6 max-w-container-xl mx-auto flex flex-col gap-12" id="main-content">
        {/* Bandeau confiance */}
        <section
          aria-label="Accompagnement financement"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {trustBand.items.map((item) => (
            <div
              key={item.label}
              className="bg-white border border-border rounded-card p-5 text-center shadow-sm"
            >
              <p className="font-heading font-bold text-primary text-sm">{item.label}</p>
              <p className="text-xs text-content-muted mt-2 leading-relaxed">{item.hint}</p>
            </div>
          ))}
        </section>

        {/* Profils interactifs */}
        <section className="bg-surface-soft p-8 md:p-12 rounded-section border border-border shadow-sm">
          <div className="text-center mb-10">
            <h1 className="font-heading text-h2 md:text-h1 font-extrabold text-primary uppercase tracking-wide mb-4">
              {questionsOrientees.titre}
            </h1>
            <div className="w-20 h-1.5 bg-accent mx-auto rounded-full mb-6" />
            <p className="text-content-muted text-base max-w-2xl mx-auto">{questionsOrientees.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {questionsOrientees.items.map((item) => {
              const Icon = PROFILE_ICONS[item.id] || User;
              const active = activeProfile === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleProfileClick(item)}
                  className={`text-left bg-surface p-8 rounded-card border transition-all duration-300 group w-full ${
                    active
                      ? 'border-accent ring-2 ring-accent/20 shadow-md'
                      : 'border-border hover:border-accent hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-5 mb-4">
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        active
                          ? 'bg-accent text-white'
                          : 'bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white'
                      }`}
                    >
                      <Icon className="w-6 h-6" aria-hidden />
                    </div>
                    <h2 className="font-heading font-bold text-primary text-xl group-hover:text-accent transition-colors">
                      {item.q}
                    </h2>
                  </div>
                  <p className="text-medium text-content-muted leading-relaxed pl-0 md:pl-[4.25rem]">
                    {item.a}
                  </p>
                  <p className="text-xs font-bold text-accent mt-4 pl-0 md:pl-[4.25rem]">
                    Voir : {item.sections.map((s) => navSections.find((n) => n.id === s)?.label || s).join(', ')}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Sommaire */}
        <nav
          aria-label="Sommaire des dispositifs de financement"
          className="flex flex-wrap items-center justify-center gap-2 py-2"
        >
          {navSections.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollToSection(s.id)}
              className="px-4 py-2 rounded-full border border-border bg-white text-sm font-bold text-primary hover:border-accent hover:text-accent transition-colors"
            >
              {s.label}
            </button>
          ))}
        </nav>

        {/* CPF */}
        <div
          className={`transition-opacity duration-300 ${isSectionHighlighted(cpf.id) ? 'opacity-100' : 'opacity-50'}`}
        >
          <CardDesc
            sectionId={cpf.id}
            title={cpf.titre}
            description={cpf.description}
            highlight={cpf.highlight}
            image={cpf.image}
            imageContain={cpf.imageContain}
            columns={[
              { label: cpf.howTo.label, items: cpf.howTo.items },
              { label: cpf.amount.label, text: cpf.amount.description },
            ]}
            cta={{ label: cpf.amount.cta, href: cpf.amount.ctaHref }}
            footerLinks={sectionLinks(cpf, cpf.contactCta)}
          />
        </div>

        {/* OPCO */}
        <div className={`transition-opacity duration-300 ${isSectionHighlighted(opco.id) ? 'opacity-100' : 'opacity-50'}`}>
          <CardDesc
            sectionId={opco.id}
            title={opco.titre}
            description={opco.description}
            image={opco.image}
            imageContain={opco.imageContain}
            columns={opco.columns}
            footerLinks={sectionLinks(opco, opco.contactCta)}
          />
        </div>

        {/* France Travail */}
        <div
          className={`transition-opacity duration-300 ${isSectionHighlighted(poleEmploi.id) ? 'opacity-100' : 'opacity-50'}`}
        >
          <CardDesc
            sectionId={poleEmploi.id}
            title={poleEmploi.titre}
            description={poleEmploi.description}
            image={poleEmploi.image}
            imageContain={poleEmploi.imageContain}
            columns={poleEmploi.columns}
            footerLinks={sectionLinks(poleEmploi, poleEmploi.contactCta)}
          />
        </div>

        {/* Alternance */}
        <div
          className={`transition-opacity duration-300 ${isSectionHighlighted(alternance.id) ? 'opacity-100' : 'opacity-50'}`}
        >
          <CardDesc
            sectionId={alternance.id}
            title={alternance.titre}
            description={alternance.description}
            columns={alternance.columns}
            footerLinks={sectionLinks(alternance, alternance.contactCta)}
          />
        </div>

        {/* Autres */}
        <div
          className={`transition-opacity duration-300 ${isSectionHighlighted(autresSolutions.id) ? 'opacity-100' : 'opacity-50'}`}
        >
          <CardDesc
            sectionId={autresSolutions.id}
            title={autresSolutions.titre}
            description={autresSolutions.description}
            columns={autresSolutions.columns}
            footerLinks={sectionLinks(autresSolutions, autresSolutions.contactCta)}
          />
        </div>

        <p className="text-center text-sm text-content-muted">
          Organisme certifié Qualiopi —{' '}
          <Link to="/demarche-qualite" className="font-bold text-accent hover:underline">
            En savoir plus sur nos démarches qualité
          </Link>
        </p>
      </main>

      <CallToAction
        variante="claire"
        titre={ctaFinal.titre}
        sousTitre={ctaFinal.sousTitre}
        texteBouton={ctaFinal.texteBouton}
        lienBouton={ctaFinal.lienBouton}
        texteBoutonSecondaire={ctaFinal.texteBoutonSecondaire}
        lienBoutonSecondaire={ctaFinal.lienBoutonSecondaire}
      />
    </div>
  );
}
