import React from 'react';
import { useParams, Link } from 'react-router-dom';
import formationsData from '../data/json/formation.json';
import { formationsArray } from '../data/navdata'; // Importation centralisée avec les catégories sécurisées
import { allFormations } from '../data/index'; // Importation des 4 formations originelles spécifiques
import { imageMap } from '../data/formations';

// Importation des composants standards
import Hero from '../components/Hero/Hero';
import StatsBar from '../components/Stats/StatsBar';
import TexteSection from '../components/Textes/TexteSection';
import CardModule from '../components/Card/CardModule';
import InfoGrid from '../components/Infos/InfoGrid';
import { Target, CheckCircle, GraduationCap } from "lucide-react";
import Breadcrumb from '../components/Breadcrumb';

export default function FormationDetail() {
  const { id } = useParams();

  // 1. Cherche dans les 4 pages métiers "Premium" (via FormationsPage) 
  // 2. Ou sinon, cherche dans le JSON (via le Mega Menu)
  const data = allFormations[id] || formationsArray.find(f => f.id === id);

  // 1. Validation & Sécurité
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 font-heading text-navy bg-gray-50">
        <h1 className="text-4xl font-extrabold text-red-600">404</h1>
        <h2 className="text-2xl font-bold">Formation non disponible</h2>
        <p className="text-muted font-body mb-6">L'identifiant de cette formation est introuvable ou n'existe plus.</p>
        <Link to="/formations" className="btn-orange px-8 py-3">Retour aux formations</Link>
      </div>
    );
  }

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
      />

      <Breadcrumb
        items={[
          { label: 'Accueil', to: '/' },
          { label: 'Formations', to: '/formations' },
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

      {/* 4. DÉBOUCHÉS */}
      {data.debouches && (
        <section className="py-[70px] px-6 bg-navy">
          <div className="max-w-[1100px] mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-white text-2xl md:text-[32px] font-extrabold mb-4 uppercase tracking-wider">
                {data.debouches.titre}
              </h2>
              <p className="text-white/80 text-[15px] max-w-[700px] mx-auto leading-relaxed">
                {data.debouches.sousTitre}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
              {data.debouches.postes?.map((poste, idx) => (
                <div key={idx} className="bg-white p-8 rounded-[20px] shadow-lg flex flex-col justify-between relative group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                  <div className="absolute top-6 right-6 text-[#4ADE80]">
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <div className="mt-2">
                    <h3 className="font-heading font-black text-navy text-[20px] leading-tight mb-6 pr-8">
                      {poste.titre}
                    </h3>
                    <div className="flex items-center gap-3 text-orange">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                        <polyline points="17 6 23 6 23 12" />
                      </svg>
                      <span className="font-bold text-[16px] tracking-wide">
                        {poste.salaire}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <p className="text-white text-[15px] leading-relaxed">
                <strong className="text-orange font-bold uppercase tracking-wider mr-2 text-sm">Secteurs d'activité :</strong>
                {data.debouches.secteurs}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 5. PROGRAMME */}
      {data.programme && (
        <section className="py-[70px] px-6 bg-white">
          <div className="max-w-[900px] mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-[#1E2F47] text-2xl md:text-[32px] font-extrabold mb-3 uppercase tracking-wider">
                Programme de la formation
              </h2>
            </div>
            <div className="space-y-4">
              {data.programme.modules?.map((module, idx) => (
                <CardModule key={module.id || idx} module={module} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. INFOS PRATIQUES */}
      {data.infosPratiques && (
        <section className="py-[70px] px-6 bg-gray-50 border-y border-border">
          <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            <InfoGrid
              titre={data.infosPratiques.modalites?.titre || "Modalités"}
              icon={Target}
              variant="orange"
              description={
                <ul className="space-y-3 mt-4">
                  {data.infosPratiques.modalites?.points?.map((p, i) => (
                    <li key={i} className="flex items-center gap-3 text-navy font-medium text-[14px]">
                      <CheckCircle className="w-4 h-4 text-orange flex-shrink-0" /> {p}
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
                    <li key={i} className="flex items-center gap-3 text-navy font-medium text-[14px]">
                      <CheckCircle className="w-4 h-4 text-navy flex-shrink-0" /> {p}
                    </li>
                  ))}
                </ul>
              }
            />
          </div>
        </section>
      )}

      {/* 7. COMPÉTENCES */}
      {data.competences && (
        <section className="py-[70px] px-6 bg-white">
          <div className="max-w-[1100px] mx-auto">
            <h2 className="text-[#1E2F47] text-2xl md:text-[32px] font-extrabold text-center mb-12 uppercase tracking-wider">
              Compétences développées
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.competences.map((competence, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-gray-50 border border-border p-5 rounded-xl hover:shadow-md transition-all group">
                  <div className="bg-white p-2 rounded-lg shadow-sm group-hover:bg-orange transition-colors">
                    <CheckCircle className="w-5 h-5 text-orange group-hover:text-white" />
                  </div>
                  <span className="text-navy font-bold text-[15px]">{competence}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. FORMATIONS SUGGÉRÉES */}
      {suggestedFormations.length > 0 && (
        <section className="py-[70px] px-6 bg-gray-100">
          <div className="max-w-[1100px] mx-auto">
            <h2 className="text-[#1E2F47] text-2xl md:text-[28px] font-extrabold mb-8 uppercase tracking-wider text-center">
              Formations suggérées
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center">
              {suggestedFormations.map((f, idx) => (
                <Link key={idx} to={`/formation/${f.id}`} className="block group no-underline">
                  <div className="bg-white p-6 rounded-xl shadow border border-transparent group-hover:border-orange transition-all duration-300">
                    <div className="overflow-hidden rounded-lg mb-4">
                      {f.hero?.image && (
                        <img src={f.hero.image} alt={f.hero?.titre || f.id} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                      )}
                    </div>
                    <span className="text-xs font-bold text-orange uppercase tracking-wider mb-2 block">
                      {f.categorie === 'numerique' ? 'Numérique' : f.categorie === 'rh' ? 'Gestion & RH' : 'Comptabilité'}
                    </span>
                    <h3 className="font-heading font-black text-navy text-[20px] mb-2 group-hover:text-orange transition-colors">
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
        <section className="py-20 px-6 bg-navy text-center text-white">
          <div className="max-w-[700px] mx-auto">
            <h2 className="text-2xl md:text-[34px] font-extrabold mb-4 uppercase">
              {data.ctaFinal.titre}
            </h2>
            <p className="text-[15px] opacity-80 mb-10 leading-relaxed">
              {data.ctaFinal.sousTitre}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {data.ctaFinal.boutons?.[0] && (
                <Link to="/contact" className="btn-orange px-10 py-4 text-sm shadow-xl hover:-translate-y-1 transition-all no-underline inline-block">
                  {data.ctaFinal.boutons[0].label}
                </Link>
              )}
              <Link to="/formations" className="bg-white text-navy px-10 py-4 rounded-default font-bold text-sm hover:bg-gray-100 transition-all no-underline inline-block">
                Toutes les formations
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}