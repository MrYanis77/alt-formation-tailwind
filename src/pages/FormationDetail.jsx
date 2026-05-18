import React from 'react';
import SEOHead from '../components/SEO/SEOHead';
import { useParams, Link } from 'react-router-dom';
import { formationsArray } from '../data/navdata';
import { imageMap } from '../data/formations';
import { certifications } from '../data/certification';

import Hero from '../components/Hero/Hero';
import TexteSection from '../components/Textes/TexteSection';
import CardModule from '../components/Card/CardModule';
import FormationQuickFacts from '../components/Formation/FormationQuickFacts';
import { Briefcase, CheckCircle, NotebookText } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import CallToAction from '../components/CallToAction';
import FaqSection from '../components/FaqSection';
import FormationCertifSection from '../components/FormationCertifSection';

const sectionY = 'py-12 lg:py-16';

export default function FormationDetail() {
  const { id } = useParams();

  const data = formationsArray.find((f) => f.id === id);

  const certif = certifications.find((c) => c.href === `/formation/${id}`);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 font-heading text-primary bg-gray-50">
        <h1 className="text-4xl font-extrabold text-red-600">404</h1>
        <h2 className="text-2xl font-bold">Formation non disponible</h2>
        <p className="text-content-muted font-body mb-6">
          L'identifiant de cette formation est introuvable ou n'existe plus.
        </p>
        <Link to="/formations" className="btn-orange px-8 py-3">
          Retour aux formations
        </Link>
      </div>
    );
  }

  const showCertificationFallback =
    !certif && (data.type === 'longue' || data.type === 'certifiante');

  const infosModal =
    data.infosPratiques?.modalites?.points?.filter(Boolean) ?? [];
  const infosPrereq =
    data.infosPratiques?.prerequis?.points?.filter(Boolean) ?? [];
  const showInfosDetail =
    data.infosPratiques &&
    (infosModal.length > 0 || infosPrereq.length > 0);

  const showCarriereSection =
    (data.metiersVises && data.metiersVises.length > 0) || Boolean(data.debouches);

  return (
    <div className="bg-white min-h-screen antialiased text-left">
      <SEOHead
        title={data.hero?.titre || data.titre}
        description={`Découvrez la formation ${data.hero?.titre || data.titre} chez Alt RH & formations. ${data.hero?.sousTitre || 'Formation professionnelle certifiée Qualiopi. Financement CPF, OPCO, France Travail.'}`}
        canonical={`https://alt-rh.com/formation/${id}`}
      />
      <Hero
        title={data.hero?.titre || data.titre}
        subtitle={
          data.hero?.sousTitre ||
          'Maîtrisez les compétences de demain avec nos experts.'
        }
        video={data.hero?.video}
        compact
        alignLeft
      />

      <Breadcrumb
        items={[
          { label: 'Accueil', to: '/' },
          { label: 'Formations', to: '/formations' },
          { label: data.hero?.titre || data.titre },
        ]}
      />

      <div className="max-w-container-2xl mx-auto px-6 py-8 lg:py-12">
        <div className="lg:grid lg:grid-cols-[minmax(240px,280px)_1fr] lg:gap-10 xl:gap-12">
          <aside className="mb-8 lg:mb-0 lg:sticky lg:top-24 lg:self-start shrink-0">
            <FormationQuickFacts
              stats={data.stats}
              infosPratiques={data.infosPratiques}
            />
          </aside>

          <div className="min-w-0 flex flex-col gap-12 lg:gap-14">
            {data.presentation ? (
              <TexteSection
                variant="compact"
                data={{
                  titre: data.presentation.titre,
                  contenu: data.presentation.paragraphes,
                  image:
                    data.presentation?.image ||
                    imageMap[id] ||
                    data.presentation.image ||
                    'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80',
                }}
                imageRight={true}
              />
            ) : null}

            {data.programme ? (
              <section className="rounded-xl border border-border bg-surface-soft p-6 lg:p-8">
                <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">
                  Parcours
                </p>
                <div className="flex flex-wrap items-center gap-3 border-b border-border pb-4 mb-5">
                  <NotebookText
                    className="w-6 h-6 text-accent shrink-0"
                    aria-hidden
                  />
                  <h2 className="text-primary text-2xl md:text-3xl font-extrabold uppercase tracking-tight">
                    Programme détaillé
                  </h2>
                </div>
                {data.programme.dureeTotale ? (
                  <p className="text-content-muted text-sm md:text-base font-body leading-relaxed mb-6">
                    {data.programme.dureeTotale}
                  </p>
                ) : null}
                <div className="space-y-2 md:space-y-3">
                  {data.programme.modules?.map((module, idx) => (
                    <CardModule
                      key={module.id || idx}
                      module={module}
                      index={idx}
                      isLast={idx === data.programme.modules.length - 1}
                      density="compact"
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {data.competences ? (
              <section>
                <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">
                  Compétences
                </p>
                <h2 className="text-primary text-2xl md:text-3xl font-extrabold border-b border-border pb-3 mb-6 uppercase tracking-tight">
                  Compétences développées
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 list-none pl-0 m-0">
                  {data.competences.map((competence, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-primary font-medium text-sm md:text-[15px] leading-snug"
                    >
                      <CheckCircle
                        className="w-4 h-4 text-accent shrink-0 mt-0.5"
                        aria-hidden
                      />
                      <span>{competence}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {showInfosDetail ? (
              <section
                id="formation-infos-pratiques"
                className="scroll-mt-28 rounded-xl border border-border bg-white p-6 lg:p-8 shadow-sm"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">
                  Organisation
                </p>
                <h2 className="text-primary text-2xl md:text-3xl font-extrabold border-b border-border pb-3 mb-6 uppercase tracking-tight">
                  Informations pratiques
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                  {infosModal.length > 0 ? (
                    <div>
                      <h3 className="font-heading font-bold text-primary mb-3 text-base uppercase tracking-wide">
                        {data.infosPratiques.modalites?.titre ||
                          'Modalités'}
                      </h3>
                      <ul className="space-y-2 list-none pl-0 m-0">
                        {infosModal.map((p, i) => (
                          <li
                            key={i}
                            className="flex gap-2 text-content-muted text-sm md:text-[15px] leading-relaxed"
                          >
                            <CheckCircle
                              className="w-4 h-4 text-accent shrink-0 mt-0.5"
                              aria-hidden
                            />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {infosPrereq.length > 0 ? (
                    <div>
                      <h3 className="font-heading font-bold text-primary mb-3 text-base uppercase tracking-wide">
                        {data.infosPratiques.prerequis?.titre ||
                          'Prérequis'}
                      </h3>
                      <ul className="space-y-2 list-none pl-0 m-0">
                        {infosPrereq.map((p, i) => (
                          <li
                            key={i}
                            className="flex gap-2 text-content-muted text-sm md:text-[15px] leading-relaxed"
                          >
                            <CheckCircle
                              className="w-4 h-4 text-primary shrink-0 mt-0.5 opacity-80"
                              aria-hidden
                            />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </div>

      {showCarriereSection ? (
        <section className={`${sectionY} px-6 bg-primary`}>
          <div className="max-w-container-3xl mx-auto space-y-12 lg:space-y-14">
            {data.metiersVises && data.metiersVises.length > 0 ? (
              <div>
                <div className="mb-8">
                  <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">
                    Après la formation
                  </p>
                  <h2 className="text-white text-2xl md:text-3xl font-extrabold uppercase tracking-wider border-b border-white/20 pb-3 inline-block">
                    Métiers visés
                  </h2>
                  <p className="text-white/70 text-sm md:text-base max-w-xl mt-4 font-body">
                    Cette formation vous ouvre les portes des postes suivants.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {data.metiersVises.map((metier, idx) => (
                    <div
                      key={idx}
                      className="bg-white/10 border border-white/20 rounded-lg px-4 py-3.5 flex items-start gap-3 hover:bg-white/15 transition-colors"
                    >
                      <Briefcase
                        className="w-4 h-4 text-accent shrink-0 mt-0.5"
                        aria-hidden
                      />
                      <span className="text-white font-semibold text-sm leading-snug">
                        {metier}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {data.debouches ? (
              <div
                className={
                  data.metiersVises && data.metiersVises.length > 0
                    ? 'pt-2 border-t border-white/15'
                    : ''
                }
              >
                <div className="mb-8">
                  <h2 className="text-white text-2xl md:text-3xl font-extrabold uppercase tracking-wider border-b border-white/20 pb-3 inline-block">
                    {data.debouches.titre}
                  </h2>
                  <p className="text-white/80 text-sm md:text-base max-w-2xl mt-4 leading-relaxed font-body">
                    {data.debouches.sousTitre}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
                  {data.debouches.postes?.map((poste, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-between relative group transition-all duration-300 hover:shadow-lg"
                    >
                      <div className="absolute top-5 right-5 text-success">
                        <svg
                          className="w-7 h-7"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                      </div>
                      <div className="mt-1 pr-8">
                        <h3 className="font-heading font-black text-primary text-lg leading-tight mb-4">
                          {poste.titre}
                        </h3>
                        <div className="flex items-center gap-2 text-accent">
                          <svg
                            className="w-6 h-6 shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden
                          >
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                            <polyline points="17 6 23 6 23 12" />
                          </svg>
                          <span className="font-bold text-base tracking-wide">
                            {poste.salaire}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-5 md:p-6 backdrop-blur-sm">
                  <p className="text-white text-sm md:text-base leading-relaxed font-body">
                    <strong className="text-accent font-bold uppercase tracking-wider mr-2">
                      Secteurs d&apos;activité :
                    </strong>
                    {data.debouches.secteurs}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <FormationCertifSection certif={certif} showFallback={showCertificationFallback} />

      <FaqSection categoryId="formations" maxQuestions={4} />

      {data.ctaFinal ? (
        <CallToAction
          variante="sombre"
          titre={data.ctaFinal.titre}
          sousTitre={data.ctaFinal.sousTitre}
          texteBouton={data.ctaFinal.boutons?.[0]?.label || "S'inscrire maintenant"}
          lienBouton={data.ctaFinal.boutons?.[0]?.url || '/contact'}
          texteBoutonSecondaire="Toutes les formations"
          lienBoutonSecondaire="/formations"
        />
      ) : null}
    </div>
  );
}
