/*
 * Page Alternance
 * Cette page présente les informations sur l'alternance, incluant :
 * - Les avantages de l'alternance
 * - Le catalogue des titres RNCP
 * - Les étapes pour intégrer les formations
 */

import Breadcrumb from '../components/Breadcrumb';
import Hero from '../components/Hero/Hero';
import InfoGrid from '../components/Infos/InfoGrid';
import DetailHeader from '../components/Card/CardJob';
import StepItem from '../components/Items/StepItem';
import { hero,benefits, formations, steps } from '../data/alternance';

export default function AlternancePage() {
  return (
    <div className="bg-white min-h-screen">
      <Hero 
        title={hero.titre}
        subtitle={hero.sousTitre}
        video={hero.video}
      />
      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Présentiel' }]} />

      {/* ===== SECTION AVANTAGES (Image 9a35a3) ===== */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-container-3xl mx-auto">
          <h2 className="font-heading font-extrabold text-2xl text-primary text-center mb-16 uppercase tracking-wider">
            Pourquoi l'alternance ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((b, index) => (
           <InfoGrid
                key={index} 
                titre={b.titre} 
                description={b.description}
                variant="orange" 
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION CATALOGUE RNCP (Image 9a35c1) ===== */}
      <section className="py-20 px-6 bg-surface-soft border-y border-border">
        <div className="max-w-container-xl mx-auto">
          <div className="flex items-center mb-10 group">
            <div className="w-[6px] h-10 bg-accent rounded-full mr-4 transition-transform group-hover:scale-y-110"></div>
            <h2 className="font-heading font-extrabold text-2xl text-primary uppercase tracking-tight">
              Catalogue des titres RNCP
            </h2>
          </div>
          
          <div className="flex flex-col gap-5">
            {formations.map((f, index) => (
              <DetailHeader 
                key={index}
                titre={f.titre}   
                code={f.code}     
                duree={f.duree}  
                rythme={f.rythme} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION ÉTAPES (Image 9a35de) ===== */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-container-3xl mx-auto">
          <h2 className="font-heading font-extrabold text-2xl text-primary text-center mb-20 uppercase tracking-wider">
            Comment intégrer nos formations ?
          </h2>
          
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Ligne de progression horizontale */}
            <div className="hidden lg:block absolute top-8 left-[15%] right-[15%] h-[1px] bg-border -z-0"></div>
            
            {steps.map((s) => (
              <div key={s.num} className="relative z-10 bg-white px-2">
                <StepItem 
                  num={s.num}    
                  titre={s.titre} 
                  desc={s.desc}   
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}