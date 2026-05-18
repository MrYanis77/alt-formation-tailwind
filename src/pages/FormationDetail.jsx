import React from 'react';
import { useParams, Link } from 'react-router-dom';
<<<<<<< HEAD
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
=======
import { formationsArray } from '../data/navdata'; // Importation centralisée avec les catégories sécurisées
import { imageMap } from '../data/formations';
import { certifications } from '../data/certification';

// Importation des composants standards
import Hero from '../components/Hero/Hero';
import StatsBar from '../components/Stats/StatsBar';
import TexteSection from '../components/Textes/TexteSection';
import CardModule from '../components/Card/CardModule';
import InfoGrid from '../components/Infos/InfoGrid';
import { Target, CheckCircle, GraduationCap, Briefcase } from "lucide-react";
import Breadcrumb from '../components/Breadcrumb';
>>>>>>> 0a48c2f2e8ddbb4846f055db09011af7079eaa03

export default function FormationDetail() {
  const { id } = useParams();

<<<<<<< HEAD
  const data = formationsArray.find((f) => f.id === id);

  const certif = certifications.find((c) => c.href === `/formation/${id}`);

=======
  // 1. Cherche dans le JSON (via le Mega Menu)
  const data = formationsArray.find(f => f.id === id);

  // Chercher la certification correspondante
  const certif = certifications.find(c => c.href === `/formation/${id}`);
  const franceCompetenceLink = certif?.lienFranceCompetence;

  // 1. Validation & Sécurité
>>>>>>> 0a48c2f2e8ddbb4846f055db09011af7079eaa03
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 font-heading text-primary bg-gray-50">
        <h1 className="text-4xl font-extrabold text-red-600">404</h1>
        <h2 className="text-2xl font-bold">Formation non disponible</h2>
<<<<<<< HEAD
        <p className="text-content-muted font-body mb-6">
          L'identifiant de cette formation est introuvable ou n'existe plus.
        </p>
        <Link to="/formations" className="btn-orange px-8 py-3">
          Retour aux formations
        </Link>
=======
        <p className="text-content-muted font-body mb-6">L'identifiant de cette formation est introuvable ou n'existe plus.</p>
        <Link to="/formations" className="btn-orange px-8 py-3">Retour aux formations</Link>
>>>>>>> 0a48c2f2e8ddbb4846f055db09011af7079eaa03
      </div>
    );
  }

<<<<<<< HEAD
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
      <Hero
        title={data.hero?.titre || data.titre}
        subtitle={
          data.hero?.sousTitre ||
          'Maîtrisez les compétences de demain avec nos experts.'
        }
        video={data.hero?.video}
        compact
        alignLeft
=======
  // Calcul des formations suggérées (Même catégorie, excluant la courante, max 2)
  const suggestedFormations = formationsArray
    .filter(f => f.categorie === data.categorie && f.id !== id)
    .slice(0, 2);

  return (
    <div className="bg-white min-h-screen antialiased text-left">
      {/* 1. HERO */}
      <Hero
        title={data.hero?.titre || data.titre}
        subtitle={data.hero?.sousTitre || "Maîtrisez les compétences de demain avec nos experts."}
        video={data.hero?.video}
>>>>>>> 0a48c2f2e8ddbb4846f055db09011af7079eaa03
      />

      <Breadcrumb
        items={[
          { label: 'Accueil', to: '/' },
          { label: 'Formations', to: '/formations' },
<<<<<<< HEAD
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
=======
          { label: data.hero?.titre || data.titre }
        ]}
      />

      {/* 2. STATS BAR */}
      {data.stats && <StatsBar stats={data.stats} />}

      {/* 3. PRÉSENTATION */}
      {data.presentation && (
        <TexteSection
          data={{
            titre: data.presentation.titre,
            contenu: data.presentation.paragraphes,
            image: imageMap[id] || data.presentation.image || "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80"
          }}
          imageRight={true}
        />
      )}

      {/* 5. PROGRAMME */}
      {data.programme && (
        <section className="py-20 px-6 bg-surface-soft">
          <div className="max-w-container-2xl mx-auto">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-accent font-bold text-xs uppercase tracking-widest mb-6">
                <GraduationCap className="w-4 h-4" />
                Votre parcours vers la réussite
              </div>
              <h2 className="text-primary text-3xl md:text-4xl font-extrabold uppercase tracking-tight mb-4">
                Programme détaillé
              </h2>
              <div className="w-24 h-1.5 bg-accent mx-auto rounded-full mb-6"></div>
              {data.programme.dureeTotale && (
                <p className="text-content-muted text-base max-w-2xl mx-auto leading-relaxed">
                  {data.programme.dureeTotale}
                </p>
              )}
            </div>
            <div className="max-w-[700px] mx-auto">
              {data.programme.modules?.map((module, idx) => (
                <CardModule
                  key={module.id || idx}
                  module={module}
                  index={idx}
                  isLast={idx === data.programme.modules.length - 1}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. COMPÉTENCES */}
      {data.competences && (
        <section className="py-[70px] px-6 bg-white">
          <div className="max-w-container-3xl mx-auto">
            <h2 className="text-primary-light text-2xl md:text-h1 font-extrabold text-center mb-12 uppercase tracking-wider">
              Compétences développées
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.competences.map((competence, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-gray-50 border border-border p-5 rounded-xl hover:shadow-md transition-all group">
                  <div className="bg-white p-2 rounded-lg shadow-sm group-hover:bg-accent transition-colors">
                    <CheckCircle className="w-5 h-5 text-accent group-hover:text-white" />
                  </div>
                  <span className="text-primary font-bold text-medium">{competence}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. INFOS PRATIQUES */}
      {data.infosPratiques && (
        <section className="py-[70px] px-6 bg-gray-50 border-y border-border">
          <div className="max-w-container-3xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            <InfoGrid
              titre={data.infosPratiques.modalites?.titre || "Modalités"}
              icon={Target}
              variant="orange"
              description={
                <ul className="space-y-3 mt-4">
                  {data.infosPratiques.modalites?.points?.map((p, i) => (
                    <li key={i} className="flex items-center gap-3 text-primary font-medium text-sm">
                      <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" /> {p}
                    </li>
                  ))}
                </ul>
              }
            />
            <InfoGrid
              titre={data.infosPratiques.prerequis?.titre || "Prérequis"}
              icon={GraduationCap}
              variant="navy"
              description={
                <ul className="space-y-3 mt-4">
                  {data.infosPratiques.prerequis?.points?.map((p, i) => (
                    <li key={i} className="flex items-center gap-3 text-primary font-medium text-sm">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" /> {p}
                    </li>
                  ))}
                </ul>
              }
            />
          </div>
        </section>
      )}

      {/* MÉTIERS VISÉS — formations courtes */}
      {data.metiersVises && data.metiersVises.length > 0 && (
        <section className="py-[70px] px-6 bg-primary">
          <div className="max-w-container-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white font-bold text-xs uppercase tracking-widest mb-6">
                <Briefcase className="w-4 h-4" />
                Après la formation
              </div>
              <h2 className="text-white text-2xl md:text-h1 font-extrabold mb-4 uppercase tracking-wider">
                Métiers visés
              </h2>
              <p className="text-white/70 text-sm max-w-[600px] mx-auto">
                Cette formation vous ouvre les portes des postes suivants.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.metiersVises.map((metier, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 border border-white/20 rounded-xl px-6 py-5 flex items-center gap-4 hover:bg-white/20 transition-colors"
                >
                  <div className="bg-accent/20 rounded-lg p-2 shrink-0">
                    <Briefcase className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-white font-semibold text-sm leading-snug">
                    {metier}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. DÉBOUCHÉS */}
      {data.debouches && (
        <section className="py-[70px] px-6 bg-primary">
          <div className="max-w-container-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-white text-2xl md:text-h1 font-extrabold mb-4 uppercase tracking-wider">
                {data.debouches.titre}
              </h2>
              <p className="text-white/80 text-medium max-w-[700px] mx-auto leading-relaxed">
                {data.debouches.sousTitre}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
              {data.debouches.postes?.map((poste, idx) => (
                <div key={idx} className="bg-white p-8 rounded-card shadow-lg flex flex-col justify-between relative group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                  <div className="absolute top-6 right-6 text-success">
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <div className="mt-2">
                    <h3 className="font-heading font-black text-primary text-[20px] leading-tight mb-6 pr-8">
                      {poste.titre}
                    </h3>
                    <div className="flex items-center gap-3 text-accent">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <p className="text-white text-medium leading-relaxed">
                <strong className="text-accent font-bold uppercase tracking-wider mr-2 text-sm">Secteurs d'activité :</strong>
                {data.debouches.secteurs}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 8. FORMATIONS SUGGÉRÉES */}
      {suggestedFormations.length > 0 && (
        <section className="py-[70px] px-6 bg-gray-100">
          <div className="max-w-container-3xl mx-auto">
            <h2 className="text-primary-light text-2xl md:text-h2 font-extrabold mb-8 uppercase tracking-wider text-center">
              Formations suggérées
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center">
              {suggestedFormations.map((f, idx) => (
                <Link key={idx} to={`/formation/${f.id}`} className="block group no-underline">
                  <div className="bg-white p-6 rounded-xl shadow border border-transparent group-hover:border-accent transition-all duration-300">
                    <div className="overflow-hidden rounded-lg mb-4">
                      <img 
                        src={imageMap[f.id] || f.hero?.image || f.presentation?.image || "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80"} 
                        alt={f.hero?.titre || f.titre || f.id} 
                        loading="lazy"
                        decoding="async"
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                    <span className="text-xs font-bold text-accent uppercase tracking-wider mb-2 block">
                      {f.categorie === 'numerique' ? 'Numérique' : f.categorie === 'rh' ? 'Gestion & RH' : 'Comptabilité'}
                    </span>
                    <h3 className="font-heading font-black text-primary text-[20px] mb-2 group-hover:text-accent transition-colors">
                      {f.hero?.titre || f.titre || f.id}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. CTA FINAL */}
      {data.ctaFinal && (
        <section className="py-20 px-6 bg-primary text-center text-white">
          <div className="max-w-container-xl mx-auto">
            <h2 className="text-2xl md:text-[34px] font-extrabold mb-4 uppercase">
              {data.ctaFinal.titre}
            </h2>
            <p className="text-medium opacity-80 mb-10 leading-relaxed">
              {data.ctaFinal.sousTitre}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {data.ctaFinal.boutons?.[0] && (
                <Link to="/contact" className="btn-orange px-10 py-4 text-sm shadow-xl hover:-translate-y-1 transition-all no-underline inline-block">
                  {data.ctaFinal.boutons[0].label}
                </Link>
              )}
              {franceCompetenceLink && (
                <a href={franceCompetenceLink} target="_blank" rel="noopener noreferrer" className="bg-white text-primary px-10 py-4 rounded-sm font-bold text-sm hover:bg-gray-100 transition-all border-2 border-primary no-underline inline-block">
                  Fiche France Compétences
                </a>
              )}
              <Link to="/formations" className="bg-white text-primary px-10 py-4 rounded-sm font-bold text-sm hover:bg-gray-100 transition-all no-underline inline-block">
                Toutes les formations
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
>>>>>>> 0a48c2f2e8ddbb4846f055db09011af7079eaa03
