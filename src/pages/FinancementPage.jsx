import React from 'react';
import Breadcrumb from '../components/Breadcrumb';
import Hero from '../components/Hero/Hero';
import CardDesc from '../components/Card/CardDesc';
import CallToAction from '../components/CallToAction';

// N'oubliez pas d'importer 'questionsOrientees'
import { hero, cpf, opco, poleEmploi, autresSolutions, questionsOrientees } from '../data/financement';

export default function FinancementsPage() {
  return (
    <div className="bg-white min-h-screen">
      <Hero
        title={hero.titre}
        subtitle={hero.sousTitre}
        video={hero.video}
      />
      <Breadcrumb
        items={[{ label: 'Accueil', to: '/' }, { label: 'Financements' }]}
      />

      <main className="py-12 px-6 max-w-[1100px] mx-auto flex flex-col gap-10" id="main-content">

        {/* --- NOUVELLE SECTION : QUESTIONS ORIENTÉES --- */}
        <section className="bg-slate-50 p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E2F47] uppercase tracking-wider mb-3">
              {questionsOrientees.titre}
            </h2>
            <p className="text-muted text-sm md:text-base max-w-2xl mx-auto">
              {questionsOrientees.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {questionsOrientees.items.map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 hover:border-orange hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-orange/10 text-orange rounded-full flex items-center justify-center font-bold text-lg group-hover:bg-orange group-hover:text-white transition-colors">
                    ?
                  </div>
                  <h3 className="font-bold text-[#1E2F47] text-lg group-hover:text-orange transition-colors">
                    {item.q}
                  </h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed md:pl-14">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>
        {/* ---------------------------------------------- */}

        {/* SECTION CPF */}
        <CardDesc
          title={cpf.titre}
          description={cpf.description}
          highlight={true}
          columns={[
            { label: cpf.howTo.label, items: cpf.howTo.items },
            { label: cpf.amount.label, text: cpf.amount.description }
          ]}
          cta={{ label: cpf.amount.cta, href: cpf.amount.ctaHref }}
        />

        {/* SECTION OPCO */}
        <CardDesc
          title={opco.titre}
          description={opco.description}
          columns={opco.columns}
        />

        {/* SECTION POLE EMPLOI */}
        <CardDesc
          title={poleEmploi.titre}
          description={poleEmploi.description}
          columns={poleEmploi.columns}
        />

        {/* SECTION AUTRES */}
        <CardDesc
          title={autresSolutions.titre}
          columns={autresSolutions.columns}
        />

      </main>

      {/* CTA FINAL */}
      <CallToAction
        variante="claire"
        titre="Besoin d'aide pour votre financement ?"
        sousTitre="Nos conseillers vous accompagnent gratuitement dans le montage de votre dossier et le choix du dispositif adapté."
        texteBouton="Prendre rendez-vous"
        lienBouton="/contact"
      />
    </div>
  );
}