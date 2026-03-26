import Breadcrumb from '../components/Breadcrumb';
import Hero from '../components/Hero';
import { 
  hero,
  formationSurMesure, 
  servicesComplementaires, 
  recrutementAlternance, 
  stats 
} from '../data/entreprise';

export default function EntreprisePage() {
  return (
    <div className="bg-white min-h-screen">
      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Entreprise' }]} />
      <Hero
          title={hero.titre}
          subtitle={hero.sousTitre}
      />

      <main className="py-[60px] px-6 max-w-[1100px] mx-auto flex flex-col gap-8" id="main-content">
        
        {/* ======== 1. FORMATION SUR-MESURE (Image a4b5b0) ======== */}
        <section className="bg-white border border-orange rounded-xl p-10 md:p-12 shadow-sm">
          <h2 className="font-heading text-[28px] font-bold text-navy mb-4">
            {formationSurMesure.titre}
          </h2>
          <p className="text-[15px] text-[#444] leading-relaxed mb-10">
            {formationSurMesure.description}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {formationSurMesure.columns.map((col) => (
              <div key={col.label}>
                <h4 className="font-heading text-[16px] font-bold text-navy mb-5">
                  {col.label}
                </h4>
                <ul className="flex flex-col gap-3">
                  {col.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[14px] text-[#555]">
                      <span className="text-orange">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ======== 2. AUDIT ET RH (Image a4b5b0) ======== */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {servicesComplementaires.map((s) => (
            <article key={s.titre} className="bg-white border border-gray-100 rounded-xl p-10 shadow-sm">
              <h3 className="font-heading text-[22px] font-bold text-navy mb-4">
                {s.titre}
              </h3>
              <p className="text-[14px] text-[#555] mb-6 leading-relaxed">
                {s.description}
              </p>
              <ul className="flex flex-col gap-3">
                {s.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[14px] text-[#555]">
                    <span className="text-orange">•</span> {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        {/* ======== 3. RECRUTEMENT EN ALTERNANCE (Image a4b5b0) ======== */}
        <section className="bg-white border border-gray-100 rounded-xl p-10 md:p-12 shadow-sm">
          <h2 className="font-heading text-[28px] font-bold text-navy mb-4">
            {recrutementAlternance.titre}
          </h2>
          <p className="text-[15px] text-[#444] leading-relaxed mb-10">
            {recrutementAlternance.description}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recrutementAlternance.steps.map((step) => (
              <div key={step.titre}>
                <h4 className="font-heading text-[16px] font-bold text-navy mb-3">
                  {step.titre}
                </h4>
                <p className="text-[14px] text-[#555] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ======== SECTION STATISTIQUES ======== */}
      <section className="bg-[#f9fafb] py-[80px] px-6 text-center">
        <h2 className="font-heading text-[32px] font-bold text-navy mb-12">
          Pourquoi choisir ALT FORMATIONS ?
        </h2>
        <div className="flex justify-center gap-10 md:gap-20 flex-wrap max-w-[1100px] mx-auto">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <span className="font-heading text-[48px] font-bold text-orange mb-2">
                {s.value}
              </span>
              <span className="text-[14px] text-[#666] font-medium uppercase tracking-wider">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ======== SECTION CTA FINAL ======== */}
      <section className="py-[80px] px-6 bg-white text-center">
        <h2 className="font-heading text-[32px] font-bold text-navy mb-4">
          Discutons de votre projet
        </h2>
        <p className="text-[#666] text-[16px] max-w-[600px] mx-auto mb-10">
          Nos experts vous proposent un audit gratuit et sans engagement pour identifier vos besoins en formation
        </p>
        <button className="bg-orange hover:bg-orange-dark text-white px-12 py-4 rounded-lg font-heading text-[16px] font-bold transition-all shadow-md">
          Demander un devis
        </button>
      </section>

    </div>
  );
}