import Hero from '../components/Hero/Hero';
import Breadcrumb from '../components/Breadcrumb';
import CallToAction from '../components/CallToAction';
import Faq from '../components/Faq';
import { Link } from 'react-router-dom';
import data from '../data/json/bilan.json';
import bilanFaq from '../data/faqSite/bilan.js';

const bilan = data.bilanDeCompetences;

// ── Icônes ─────────────────────────────────────────────────────────────────────

const CheckIcon = () => (
  <svg className="w-5 h-5 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const CheckIconLight = () => (
  <svg className="w-5 h-5 text-white shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const ArrowIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

// ── Page ───────────────────────────────────────────────────────────────────────

function formatEuros(amount) {
  return new Intl.NumberFormat('fr-FR').format(amount);
}

export default function BilanDeCompetencePage() {
  const {
    introPlus,
    contenu,
    pourquoiFaire,
    demarrage,
    parcours,
    tarifs,
    chiffresCles,
    pourquoiChoisir,
    financementBloc,
    deontologie,
    faqPage,
    testsExterieurs,
    cta,
  } = bilan;

  const faqData = bilanFaq.questions?.length
    ? [
        {
          id: bilanFaq.id,
          theme: bilanFaq.theme,
          categorie: bilanFaq.categorie,
          order: bilanFaq.order,
          questions: bilanFaq.questions,
        },
      ]
    : [];

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
            <div>
              <p className="text-[11px] font-extrabold text-accent uppercase tracking-widest mb-3">Bilan de compétences</p>
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-primary mb-4">{bilan.titre}</h2>
              <p className="text-accent font-bold font-body mb-4">{bilan.tagline}</p>
              <p className="text-content-muted font-body leading-relaxed">{bilan.description}</p>

              {introPlus?.bullets?.length > 0 && (
                <ul className="mt-8 space-y-3">
                  {introPlus.bullets.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-content-muted font-body text-sm leading-relaxed">
                      <CheckIcon /><span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

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
            <div className="rounded-2xl overflow-hidden shadow-lg lg:sticky lg:top-28">
              <img src={bilan.image} alt={bilan.titre} className="w-full h-80 lg:h-auto lg:max-h-[560px] object-cover" />
            </div>
          </div>

          {/* ── OBJECTIFS + 3 PHASES ── */}
          <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm mb-16">
            <div className="text-center mb-10">
              <p className="text-[11px] font-extrabold text-accent uppercase tracking-widest mb-3">La démarche</p>
              <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-primary leading-tight">
                {contenu.titre}
              </h2>
              <div className="w-16 h-1.5 bg-accent mx-auto mt-4 rounded-full mb-6"></div>
              <p className="text-content-muted font-body leading-relaxed max-w-2xl mx-auto">
                {contenu.description}
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 mb-10">
              <h3 className="font-heading text-xl font-bold text-primary mb-6">À la fin du bilan, vous aurez</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contenu.objectifs.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-content-muted font-body">
                    <CheckIcon /><span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            <h3 className="font-heading text-xl font-bold text-primary text-center mb-8">
              Les trois phases légales
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

          {/* ── OUTILS D'ACCOMPAGNEMENT ── */}
          {testsExterieurs?.titre && (
            <div className="bg-white rounded-2xl p-10 md:p-12 border border-gray-100 shadow-sm mb-16">
              <div className="max-w-3xl mx-auto text-center">
                <p className="text-sm md:text-base font-extrabold text-accent uppercase tracking-widest mb-3">
                  Accompagnement
                </p>
                <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-primary leading-tight mb-6">
                  {testsExterieurs.titre}
                </h2>
                <p className="text-content-muted font-body text-sm md:text-[15px] leading-relaxed">
                  {testsExterieurs.paragraphe}
                </p>
              </div>
            </div>
          )}

          {/* ── POURQUOI FAIRE ── */}
          {pourquoiFaire && (
            <div className="mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-primary text-center mb-10 px-2">
                {pourquoiFaire.titre}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-8 md:p-10 border border-gray-100 shadow-sm">
                  <h3 className="font-heading text-lg font-bold text-primary mb-6">{pourquoiFaire.decalage.titre}</h3>
                  <ul className="space-y-3">
                    {pourquoiFaire.decalage.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-content-muted font-body text-sm leading-relaxed">
                        <span className="text-accent font-bold shrink-0">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-primary rounded-2xl p-8 md:p-10 text-white shadow-md">
                  <h3 className="font-heading text-lg font-bold mb-6">{pourquoiFaire.reprendre.titre}</h3>
                  <ul className="space-y-3">
                    {pourquoiFaire.reprendre.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-3 font-body text-sm leading-relaxed text-white/95">
                        <CheckIconLight />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ── COMMENT DÉMARRER ── */}
          {demarrage?.etapes?.length > 0 && (
            <div className="mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-primary text-center mb-10">
                {demarrage.titre}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {demarrage.etapes.map((etape, idx) => (
                  <div key={idx} className="relative bg-white rounded-2xl p-7 border border-gray-100 shadow-sm flex flex-col">
                    <span className="font-heading text-4xl font-extrabold text-accent/25 mb-3">{String(idx + 1).padStart(2, '0')}</span>
                    <h3 className="font-heading text-[17px] font-bold text-primary mb-3">{etape.titre}</h3>
                    <p className="text-content-muted font-body text-sm leading-relaxed flex-grow">{etape.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PARCOURS DÉTAILLÉ ── */}
          {parcours?.etapes?.length > 0 && (
            <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm mb-16">
              <div className="text-center mb-10">
                <p className="text-sm md:text-base font-extrabold text-accent uppercase tracking-widest mb-3">Méthode</p>
                <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-primary leading-tight mb-4">
                  {parcours.titre}
                </h2>
                <p className="text-content-muted font-body max-w-2xl mx-auto leading-relaxed">{parcours.sousTitre}</p>
              </div>
              <ol className="space-y-8">
                {parcours.etapes.map((etape, idx) => (
                  <li key={idx} className="flex gap-5 md:gap-8">
                    <span className="flex-shrink-0 w-11 h-11 rounded-full bg-accent text-white font-heading font-extrabold flex items-center justify-center text-lg">
                      {idx + 1}
                    </span>
                    <div className="flex-grow pt-1 border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                      <h3 className="font-heading text-lg font-bold text-primary mb-3">{etape.titre}</h3>
                      <ul className="space-y-2">
                        {etape.points.map((p, j) => (
                          <li key={j} className="flex items-start gap-2 text-content-muted font-body text-sm leading-relaxed">
                            <span className="text-accent mt-1">—</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* ── TARIFS ── */}
          {tarifs?.formules?.length > 0 && (
            <div className="mb-16">
              <div className="text-center mb-10">
                <p className="text-sm md:text-base font-extrabold text-accent uppercase tracking-widest mb-3">Tarifs</p>
                <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-primary leading-tight mb-4">
                  {tarifs.titre}
                </h2>
                <p className="text-content-muted font-body max-w-2xl mx-auto leading-relaxed">{tarifs.sousTitre}</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {tarifs.formules.map((formule) => (
                  <div
                    key={formule.nom}
                    className="flex flex-col rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="bg-primary px-6 py-5 text-center">
                      <h3 className="font-heading text-lg font-extrabold text-white uppercase tracking-wide">
                        Bilan « {formule.nom} »
                      </h3>
                      <p className="text-white/90 text-sm font-body mt-1">{formule.heures} h d&apos;accompagnement</p>
                    </div>
                    <div className="px-6 pt-6 pb-8 flex flex-col flex-grow text-left">
                      <p className="font-heading text-4xl font-extrabold text-accent text-center mb-6">
                        {formatEuros(formule.prix)}&nbsp;€
                      </p>

                      <div className="space-y-5 flex-grow">
                        <div>
                          <p className="font-heading text-[11px] font-extrabold text-primary uppercase tracking-widest mb-2">Programme</p>
                          <p className="text-content-muted font-body text-sm leading-relaxed">{formule.programme}</p>
                        </div>
                        <div>
                          <p className="font-heading text-[11px] font-extrabold text-primary uppercase tracking-widest mb-2">Durée</p>
                          <ul className="space-y-2">
                            {formule.dureeDetails?.map((line, i) => (
                              <li key={i} className="flex items-start gap-2 text-content-muted font-body text-sm leading-relaxed">
                                <span className="text-accent shrink-0">✓</span>
                                <span>{line}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-heading text-[11px] font-extrabold text-primary uppercase tracking-widest mb-2">Votre situation</p>
                          <ul className="space-y-2">
                            {formule.situations?.map((quote, i) => (
                              <li key={i} className="text-content-muted font-body text-sm italic leading-relaxed border-l-2 border-accent/40 pl-3">
                                {quote}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-heading text-[11px] font-extrabold text-primary uppercase tracking-widest mb-2">Modalités</p>
                          <p className="text-content-muted font-body text-sm leading-relaxed">{formule.modalite}</p>
                        </div>
                      </div>

                      <Link
                        to="/contact"
                        className="btn-orange no-underline inline-flex items-center justify-center w-full mt-8 box-border"
                      >
                        Eligible CPF - Nous contacter
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {tarifs.noteCommune && (
                <div className="mt-10 bg-gray-50 rounded-2xl p-8 border border-gray-100">
                  <h3 className="font-heading text-lg font-bold text-primary mb-3">{tarifs.noteCommune.titre}</h3>
                  <p className="text-content-muted font-body text-sm leading-relaxed mb-4">{tarifs.noteCommune.texte}</p>
                  <p className="text-content-muted font-body text-sm leading-relaxed border-t border-gray-200 pt-4">
                    {tarifs.noteCommune.mentionConsultant}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── CHIFFRES CLÉS ── */}
          {chiffresCles?.cartes?.length > 0 && (
            <div className="mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-primary text-center mb-10 px-2 leading-tight">
                {chiffresCles.titre}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {chiffresCles.cartes.map((carte, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl bg-accent px-8 py-10 text-center shadow-md flex flex-col justify-center min-h-[200px]"
                  >
                    <p className="font-heading text-5xl md:text-[3.25rem] font-extrabold text-white mb-5 tracking-tight">
                      {carte.valeur}
                    </p>
                    <p className="font-body text-sm md:text-[15px] leading-relaxed text-white">
                      {carte.texte}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── POURQUOI ALT ── */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-primary leading-tight mb-4">
                {pourquoiChoisir.titre}
              </h2>
              <p className="text-content-muted font-body max-w-2xl mx-auto">{pourquoiChoisir.intro}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

          {/* ── FINANCEMENT ── */}
          {financementBloc?.points?.length > 0 && (
            <div className="bg-primary rounded-2xl p-10 md:p-12 text-white shadow-md mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold mb-4">{financementBloc.titre}</h2>
              <p className="text-white/90 font-body leading-relaxed mb-8 max-w-3xl">{financementBloc.intro}</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                {financementBloc.points.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-3 font-body text-sm text-white/95 leading-relaxed">
                    <CheckIconLight />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
              {financementBloc.lienUrl && (
                <Link
                  to={financementBloc.lienUrl}
                  className="inline-flex items-center gap-2 bg-white text-primary font-heading font-extrabold px-6 py-3 rounded-sm hover:bg-gray-100 transition-colors no-underline"
                >
                  {financementBloc.lienLabel}
                  <ArrowIcon />
                </Link>
              )}
            </div>
          )}

          {/* ── DÉONTOLOGIE ── */}
          {deontologie?.points?.length > 0 && (
            <div className="mb-16 bg-white rounded-2xl p-10 border border-gray-100 shadow-sm">
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-primary mb-6">{deontologie.titre}</h2>
              <ul className="space-y-3">
                {deontologie.points.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-content-muted font-body text-sm leading-relaxed">
                    <CheckIcon /><span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── FAQ ── */}
          {faqData.length > 0 && (
            <div className="mb-16">
              <div className="text-center mb-8">
                <p className="text-sm md:text-base font-extrabold text-accent uppercase tracking-widest mb-3">FAQ</p>
                <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-primary leading-tight mb-3">
                  {faqPage.titre}
                </h2>
                {faqPage.sousTitre && (
                  <p className="text-content-muted font-body max-w-2xl mx-auto">{faqPage.sousTitre}</p>
                )}
              </div>
              <Faq
                data={faqData}
                initialVisibleCount={faqPage.initialVisibleCount ?? 6}
                showCategoryMeta={false}
              />
              {faqPage.lienVersFaqComplete?.url && (
                <div className="text-center mt-8">
                  <Link
                    to={faqPage.lienVersFaqComplete.url}
                    className="inline-flex items-center gap-2 text-accent font-bold font-heading hover:text-primary transition-colors text-sm no-underline"
                  >
                    {faqPage.lienVersFaqComplete.label}
                    <ArrowIcon />
                  </Link>
                </div>
              )}
            </div>
          )}

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
