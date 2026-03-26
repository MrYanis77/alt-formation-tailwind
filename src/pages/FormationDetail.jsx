import React from 'react';
import { useParams, Navigate } from 'react-router-dom'; // <-- Ajout des hooks de routing
import Breadcrumb from '../components/Breadcrumb';
import HeroFormation from '../components/HeroFormation'; 
import StatsBar from '../components/StatsBar'; 
import TexteSection from '../components/TexteSection';
import CardModule from '../components/CardModule';
import CardJob from '../components/CardJob';
import InfoCard from '../components/InfoCard';
import { allFormations } from '../data'; // <-- On importe notre dictionnaire de données

export default function FormationDetail() {
  const { slug } = useParams(); // Récupère "expert-cybersecurite" ou "ressources-humaines" depuis l'URL
  const data = allFormations[slug];

  // Si l'utilisateur tape une URL qui n'existe pas dans nos données, on le redirige
  if (!data) return <Navigate to="/404" replace />;

  return (
    <div className="bg-white font-body antialiased">
      <Breadcrumb 
        items={[
          { label: 'Accueil', to: '/' }, 
          { label: 'Formations', to: '/formations' }, 
          { label: data.hero.titre } // <-- Le titre change dynamiquement !
        ]} 
      />

      <HeroFormation hero={data.hero} />
      <StatsBar stats={data.stats} />

      <TexteSection 
        data={{
          titre: data.presentation.titre,
          contenu: data.presentation.paragraphes,
          image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80"
        }} 
        imageRight={true} 
      />

      <section className="bg-navy py-24 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-[42px] font-black text-white mb-4 tracking-tight">
              {data.debouches.titre}
            </h2>
            <p className="text-white/90 text-lg font-medium">
              {data.debouches.sousTitre}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {data.debouches.postes.map((poste, idx) => (
              <CardJob key={idx} poste={poste} />
            ))}
          </div>

          <div className="bg-white rounded-xl p-8 border-l-[6px] border-orange shadow-xl">
            <p className="text-navy text-[15px] leading-relaxed">
              <strong className="font-black uppercase tracking-wider mr-2">Secteurs d'activité :</strong>
              {data.debouches.secteurs}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-[42px] font-black text-navy mb-4">
              Programme de la formation
            </h2>
            <p className="text-muted text-lg">
              {data.programme.dureeTotale} {/* Rendu dynamique */}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {data.programme.modules.map((module) => (
              <CardModule key={module.id} module={module} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <InfoCard 
              titre={data.infosPratiques.modalites.titre}
              description={
                <ul className="space-y-4 text-left w-full">
                  {data.infosPratiques.modalites.points.map((point, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full border border-orange flex items-center justify-center">
                        <svg className="w-3 h-3 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-navy font-medium">{point}</span>
                    </li>
                  ))}
                </ul>
              }
            />
            <InfoCard 
              titre={data.infosPratiques.prerequis.titre}
              description={
                <ul className="space-y-4 text-left w-full">
                  {data.infosPratiques.prerequis.points.map((point, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full border border-orange flex items-center justify-center">
                        <svg className="w-3 h-3 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-navy font-medium">{point}</span>
                    </li>
                  ))}
                </ul>
              }
            />
          </div>
        </div>
      </section>

      <section className="bg-navy py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-[42px] font-black text-white mb-4 tracking-tight">
              Compétences développées
            </h2>
            <div className="w-20 h-1 bg-orange mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.competences.map((competence, idx) => (
              <div 
                key={idx} 
                className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-center gap-4 hover:border-orange/50 transition-all group"
              >
                <div className="flex-shrink-0 text-orange">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-white/90 font-bold text-[17px] tracking-wide group-hover:text-white transition-colors">
                  {competence}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="bg-orange rounded-[20px] p-12 md:p-20 text-center flex flex-col items-center justify-center shadow-lg">
            <h2 className="font-heading text-3xl md:text-[44px] font-black text-navy mb-6 tracking-tight">
              {data.ctaFinal.titre}
            </h2>
            <p className="text-navy text-lg md:text-xl font-medium mb-12 max-w-2xl">
              {data.ctaFinal.sousTitre}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button className="bg-white text-orange px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-50 transition-colors shadow-sm">
                {data.ctaFinal.boutons[0].label}
              </button>
              <button className="bg-navy text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-navy-light transition-colors shadow-sm">
                {data.ctaFinal.boutons[1].label}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}