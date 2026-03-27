import Breadcrumb from '../components/Breadcrumb';
import Hero from '../components/Hero';
import InfoCard from '../components/InfoCard';
import DetailHeader from '../components/DetailHeader';
import StepItem from '../components/StepItem';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Import des données
import { hero,benefits, formations, steps } from '../data/alternance';

export default function AlternancePage() {
  return (
    <div className="bg-white min-h-screen">
      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Alternance' }]} />
      
    <Hero
        title={hero.titre}
        subtitle={hero.sousTitre}
    />

      {/* ===== SECTION AVANTAGES (Image 9a35a3) ===== */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="font-heading font-extrabold text-2xl text-navy text-center mb-16 uppercase tracking-wider">
            Pourquoi l'alternance ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((b, index) => (
           <InfoCard 
                key={index} 
                titre={b.titre} 
                description={b.description}
                // Si tu veux que l'icône dans l'InfoCard suive aussi 
                // la charte, tu peux forcer la variante ici
                variant="orange" 
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION CATALOGUE RNCP (Image 9a35c1) ===== */}
      <section className="py-20 px-6 bg-[#f5f7fa] border-y border-border">
        <div className="max-w-[900px] mx-auto">
          <div className="flex items-center mb-10 group">
            <div className="w-[6px] h-10 bg-orange rounded-full mr-4 transition-transform group-hover:scale-y-110"></div>
            <h2 className="font-heading font-extrabold text-2xl text-navy uppercase tracking-tight">
              Catalogue des titres RNCP
            </h2>
          </div>
          
          <div className="flex flex-col gap-5">
            {formations.map((f, index) => (
              <DetailHeader 
                key={index}
                titre={f.titre}   // Prop corrigée : titre
                code={f.code}     // Prop corrigée : code
                duree={f.duree}   // Prop corrigée : duree
                rythme={f.rythme} // Prop corrigée : rythme
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION ÉTAPES (Image 9a35de) ===== */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="font-heading font-extrabold text-2xl text-navy text-center mb-20 uppercase tracking-wider">
            Comment intégrer nos formations ?
          </h2>
          
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Ligne de progression horizontale */}
            <div className="hidden lg:block absolute top-8 left-[15%] right-[15%] h-[1px] bg-border -z-0"></div>
            
            {steps.map((s) => (
              <div key={s.num} className="relative z-10 bg-white px-2">
                <StepItem 
                  num={s.num}    // Prop corrigée : num
                  titre={s.titre} // Prop corrigée : titre
                  desc={s.desc}   // Prop corrigée : desc
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}