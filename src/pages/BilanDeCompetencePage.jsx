import Hero from '../components/Hero/Hero';
import Breadcrumb from '../components/Breadcrumb';
import CallToAction from '../components/CallToAction';
import { Link } from 'react-router-dom';
import data from '../data/json/bilan.json';

const bilan = data.bilanDeCompetences;

// ── Icônes ─────────────────────────────────────────────────────────────────────

const CheckIcon = () => (
  <svg className="w-5 h-5 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const ArrowIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

// ── Page ───────────────────────────────────────────────────────────────────────

export default function BilanDeCompetencePage() {
  const { contenu, pourquoiChoisir, testsExterieurs, cta } = bilan;

  return (
    <div className="bg-surface-soft min-h-screen antialiased">

      {/* ── HERO ── */}
      <Hero
        title={bilan.hero.titre}
        subtitle={bilan.hero.sousTitre}
        video={bilan.hero.video}
      />

      {/* ── BREADCRUMB ── */}
      <Breadcrumb items={[
        { label: 'Accueil', to: '/accueil' },
        { label: 'Bilan de Compétences' },
      ]} />

      <section className="py-20">
        <div className="max-w-container-3xl mx-auto px-6">

          {/* ── INTRO ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <p className="text-[11px] font-extrabold text-accent uppercase tracking-widest mb-3">Démarche officielle</p>
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-primary mb-4">{bilan.titre}</h2>
              <p className="text-accent font-bold font-body mb-4">{bilan.tagline}</p>
              <p className="text-content-muted font-body leading-relaxed">{bilan.description}</p>
              <div className="flex flex-wrap gap-4 mt-8">
                {cta.map((btn, i) => (
                  <Link
                    key={i}
                    to={btn.url}
                    className={i === 0 ? 'btn-orange no-underline' : 'btn-outline no-underline'}
                  >
                    {btn.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img src={bilan.image} alt={bilan.titre} className="w-full h-80 object-cover" />
            </div>
          </div>

          {/* ── OBJECTIFS + 3 PHASES ── */}
          <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm mb-16">
            <div className="text-center mb-10">
              <p className="text-[11px] font-extrabold text-accent uppercase tracking-widest mb-3">Notre accompagnement</p>
              <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-primary uppercase tracking-wide">
                {contenu.titre}
              </h2>
              <div className="w-16 h-1.5 bg-accent mx-auto mt-4 rounded-full mb-6"></div>
              <p className="text-content-muted font-body leading-relaxed max-w-2xl mx-auto">
                {contenu.description}
              </p>
            </div>

            {/* Objectifs */}
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 mb-10">
              <h3 className="font-heading text-xl font-bold text-primary mb-6">Objectifs de la démarche</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contenu.objectifs.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-content-muted font-body">
                    <CheckIcon /><span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Les 3 phases */}
            <h3 className="font-heading text-xl font-bold text-primary uppercase tracking-wide text-center mb-8">
              Les 3 phases de l'accompagnement
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contenu.lesTroisPhases.map((etape, idx) => (
                <div
                  key={idx}
                  className="group p-8 rounded-2xl bg-gray-50 border border-gray-200 hover:bg-accent transition-colors duration-300 flex flex-col shadow-sm"
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <span className="font-heading text-lg font-bold text-accent">0{idx + 1}</span>
                  </div>
                  <h4 className="font-heading text-[17px] font-bold text-primary mb-3 group-hover:text-white transition-colors duration-300">
                    {etape.phase}
                  </h4>
                  <p className="text-sm text-content-muted font-body leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                    {etape.details}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── POURQUOI CHOISIR ── */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-primary uppercase tracking-wide mb-4">
                {pourquoiChoisir.titre}
              </h2>
              <p className="text-content-muted font-body max-w-2xl mx-auto">{pourquoiChoisir.intro}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pourquoiChoisir.avantages.map((avantage, idx) => (
                <div
                  key={idx}
                  className="group p-8 rounded-2xl bg-white border border-gray-100 hover:bg-accent transition-all duration-300 shadow-sm"
                >
                  <div className="w-12 h-12 bg-gray-50 rounded-xl shadow-sm flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <span className="font-heading text-lg font-bold text-accent">0{idx + 1}</span>
                  </div>
                  <h4 className="font-heading text-[17px] font-bold text-primary mb-3 group-hover:text-white transition-colors">{avantage.titre}</h4>
                  <p className="text-sm text-content-muted font-body group-hover:text-white/90 transition-colors">{avantage.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── TESTS EXTÉRIEURS ── */}
          <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm">
            <div className="text-center mb-10">
              <p className="text-[11px] font-extrabold text-accent uppercase tracking-widest mb-3">Outils gratuits</p>
              <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-primary uppercase tracking-wide mb-4">
                {testsExterieurs.titre}
              </h2>
              <p className="text-content-muted font-body max-w-2xl mx-auto">{testsExterieurs.intro}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testsExterieurs.tests.map((test, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-7 border border-gray-100 flex flex-col hover:shadow-lg transition-all duration-300">
                  <div className="w-11 h-11 bg-primary rounded-lg flex items-center justify-center mb-5 shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h4 className="font-heading text-lg font-bold text-primary mb-2">{test.nom}</h4>
                  <p className="text-content-muted font-body text-sm leading-relaxed mb-6 flex-grow">{test.description}</p>
                  <a
                    href={test.lien}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-accent font-bold font-heading hover:text-primary transition-colors text-sm mt-auto no-underline"
                  >
                    {test.labelLien}
                    <ArrowIcon />
                  </a>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <CallToAction
        variante="sombre"
        titre="Prêt à faire le point sur vos compétences ?"
        sousTitre="Nos conseillers vous accompagnent dans votre bilan de compétences de A à Z."
        texteBouton={cta[0]?.label}
        lienBouton={cta[0]?.url}
        texteBoutonSecondaire={cta[1]?.label}
        lienBoutonSecondaire={cta[1]?.url}
      />

    </div>
  );
}
