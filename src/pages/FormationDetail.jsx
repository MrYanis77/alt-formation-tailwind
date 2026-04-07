import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom'; 
import { allFormations } from '../data';

// Importation des composants standards
import Hero from '../components/Hero/Hero';
import StatsBar from '../components/StatsBar'; 
import TexteSection from '../components/TexteSection';
import CardModule from '../components/CardModule';
// CardJob supprimé car injecté en ligne
import InfoGrid from '../components/Infos/InfoGrid';
import { Target, CheckCircle, GraduationCap } from "lucide-react";
import Breadcrumb from '../components/Breadcrumb';

export default function FormationDetail() {
  const { slug } = useParams(); 
  const data = allFormations[slug];

  if (!data) return <Navigate to="/404" replace />;

  return (
    <div className="bg-white min-h-screen antialiased text-left">
       <Breadcrumb 
        items={[
          { label: 'Accueil', to: '/' }, 
          { label: 'Formations', to: '/formations' }, 
          { label: data.hero.titre } 
        ]} 
      />
      
      {/* 1. HERO */}
      <Hero 
        title={data.hero.titre}
        subtitle={data.hero.sousTitre || "Maîtrisez les compétences de demain avec nos experts."}
        image={data.hero.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"}
      />

      {/* 2. STATS BAR */}
      <StatsBar stats={data.stats} />

      {/* 3. PRÉSENTATION */}
      <TexteSection 
        data={{
          titre: data.presentation.titre,
          contenu: data.presentation.paragraphes,
          image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80"
        }} 
        imageRight={true} 
      />

      {/* 4. DÉBOUCHÉS - Avec le code de CardJob intégré directement */}
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
            {data.debouches.postes.map((poste, idx) => (
              /* --- DÉBUT DU CODE CARDJOB INJECTÉ --- */
              <div key={idx} className="bg-white p-8 rounded-[20px] shadow-lg flex flex-col justify-between relative group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                {/* Icône de validation verte */}
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
              /* --- FIN DU CODE CARDJOB INJECTÉ --- */
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

      {/* 5. PROGRAMME */}
      <section className="py-[70px] px-6 bg-white">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[#1E2F47] text-2xl md:text-[32px] font-extrabold mb-3 uppercase tracking-wider">
              Programme de la formation
            </h2>
            <p className="text-orange font-bold text-sm uppercase tracking-widest">
              {data.programme.dureeTotale}
            </p>
          </div>

          <div className="space-y-4">
            {data.programme.modules.map((module) => (
              <CardModule key={module.id} module={module} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. INFOS PRATIQUES */}
      <section className="py-[70px] px-6 bg-gray-50 border-y border-border">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InfoGrid 
            titre={data.infosPratiques.modalites.titre}
            icon={Target}
            variant="orange"
            description={
              <ul className="space-y-3 mt-4">
                {data.infosPratiques.modalites.points.map((p, i) => (
                  <li key={i} className="flex items-center gap-3 text-navy font-medium text-[14px]">
                    <CheckCircle className="w-4 h-4 text-orange flex-shrink-0" /> {p}
                  </li>
                ))}
              </ul>
            }
          />
          <InfoGrid 
            titre={data.infosPratiques.prerequis.titre}
            icon={GraduationCap}
            variant="navy"
            description={
              <ul className="space-y-3 mt-4">
                {data.infosPratiques.prerequis.points.map((p, i) => (
                  <li key={i} className="flex items-center gap-3 text-navy font-medium text-[14px]">
                    <CheckCircle className="w-4 h-4 text-navy flex-shrink-0" /> {p}
                  </li>
                ))}
              </ul>
            }
          />
        </div>
      </section>

      {/* 7. COMPÉTENCES */}
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

      {/* 8. CTA FINAL */}
      <section className="py-20 px-6 bg-navy text-center text-white">
        <div className="max-w-[700px] mx-auto">
          <h2 className="text-2xl md:text-[34px] font-extrabold mb-4 uppercase">
            {data.ctaFinal.titre}
          </h2>
          <p className="text-[15px] opacity-80 mb-10 leading-relaxed">
            {data.ctaFinal.sousTitre}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-orange px-10 py-4 text-sm shadow-xl hover:-translate-y-1 transition-all no-underline inline-block">
              {data.ctaFinal.boutons[0].label}
            </Link>
            <Link to="/formations" className="bg-white text-navy px-10 py-4 rounded-default font-bold text-sm hover:bg-gray-100 transition-all no-underline inline-block">
              Toutes les formations
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}