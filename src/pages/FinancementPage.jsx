import Navbar from '../components/Navbar';
import Breadcrumb from '../components/Breadcrumb';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import { cpf, opco, poleEmploi, autresSolutions } from '../data/financement';

export default function FinancementsPage() {
  return (
    <div className="bg-white min-h-screen">
      <Breadcrumb
        items={[{ label: 'Accueil', to: '/' }, { label: 'Financements' }]}
      />
      <Hero
        title="Financements"
        subtitle="Plusieurs solutions de financement pour rendre votre formation accessible"
      />

      <main className="py-[60px] px-6 max-w-[1100px] mx-auto flex flex-col gap-8" id="main-content">
        
        {/* ======== BLOC 1 : CPF ======== */}
        <section className="bg-white border border-orange rounded-xl p-10 md:p-12 shadow-sm">
          <h2 className="font-heading text-[28px] font-bold text-navy mb-4">
            {cpf.titre}
          </h2>
          <p className="text-[15px] text-[#444] leading-relaxed mb-10">
            {cpf.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-heading text-[18px] font-bold text-navy mb-5">
                {cpf.howTo.label}
              </h3>
              <ul className="flex flex-col gap-3">
                {cpf.howTo.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] text-[#555]">
                    <span className="text-orange font-bold text-xl leading-none mt-[-2px]">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-heading text-[18px] font-bold text-navy mb-5">
                {cpf.amount.label}
              </h3>
              <p className="text-[14px] text-[#555] leading-relaxed mb-8">
                {cpf.amount.description}
              </p>
              <a
                href={cpf.amount.ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-orange hover:bg-orange-dark text-white px-8 py-3.5 rounded-lg font-heading text-[15px] font-bold transition-all no-underline shadow-sm"
              >
                {cpf.amount.cta}
              </a>
            </div>
          </div>
        </section>

        {/* ======== BLOC 2 : OPCO ======== */}
        <section className="bg-[#fcfcfc] border border-gray-100 rounded-xl p-10 md:p-12 shadow-sm">
          <h2 className="font-heading text-[28px] font-bold text-navy mb-4">
            {opco.titre}
          </h2>
          <p className="text-[15px] text-[#444] leading-relaxed mb-10">
            {opco.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {opco.columns.map((col, idx) => (
              <div key={idx}>
                <h4 className="font-heading text-[16px] font-bold text-navy mb-5">
                  {col.label}
                </h4>
                {col.items && col.items.length > 0 ? (
                  <ul className="flex flex-col gap-3">
                    {col.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-[14px] text-[#555]">
                        <span className="text-orange">•</span> {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[14px] text-[#555] leading-relaxed">
                    {col.text}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ======== BLOC 3 : POLE EMPLOI ======== */}
        <section className="bg-white border border-gray-100 rounded-xl p-10 md:p-12 shadow-sm">
          <h2 className="font-heading text-[28px] font-bold text-navy mb-4">
            {poleEmploi.titre}
          </h2>
          <p className="text-[15px] text-[#444] leading-relaxed mb-10">
            {poleEmploi.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {poleEmploi.columns.map((col, idx) => (
              <div key={idx}>
                <h4 className="font-heading text-[16px] font-bold text-navy mb-3">
                  {col.label}
                </h4>
                <p className="text-[14px] text-[#555] leading-relaxed">
                  {col.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ======== BLOC 4 : AUTRES SOLUTIONS ======== */}
        <section className="bg-white border border-gray-100 rounded-xl p-10 md:p-12 shadow-sm">
          <h2 className="font-heading text-[28px] font-bold text-navy mb-10">
            {autresSolutions.titre}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {autresSolutions.columns.map((col, idx) => (
              <div key={idx}>
                <h4 className="font-heading text-[16px] font-bold text-navy mb-3">
                  {col.label}
                </h4>
                <p className="text-[14px] text-[#555] leading-relaxed">
                  {col.text}
                </p>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* ======== SECTION CTA FINAL ======== */}
      <section className="bg-[#f9fafb] py-[80px] px-6 text-center">
        <h2 className="font-heading text-[32px] font-bold text-navy mb-4">
          Besoin d'aide pour votre financement ?
        </h2>
        <p className="text-[#666] text-[16px] mb-10">
          Nos conseillers vous accompagnent dans le montage de votre dossier
        </p>
        <a 
          href="#contact" 
          className="inline-block bg-orange hover:bg-orange-dark text-white px-12 py-4 rounded-lg font-heading text-[16px] font-bold transition-all no-underline shadow-md"
        >
          Prendre rendez-vous
        </a>
      </section>
    </div>
  );
}