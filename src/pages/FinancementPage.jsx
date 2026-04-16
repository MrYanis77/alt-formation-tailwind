import React from 'react';
import Breadcrumb from '../components/Breadcrumb';
import Hero from '../components/Hero/Hero';
import CardDesc from '../components/Card/CardDesc';
import CallToAction from '../components/CallToAction';

// Importation des données
import { hero, cpf, opco, poleEmploi, autresSolutions, questionsOrientees } from '../data/financement';

export default function FinancementsPage() {
  return (
    <div className="bg-surface min-h-screen">
      <Hero
        title={hero.titre}
        subtitle={hero.sousTitre}
        video={hero.video}
      />
      <Breadcrumb
        items={[{ label: 'Accueil', to: '/' }, { label: 'Financements' }]}
      />

      {/* Utilisation de la variable CSS max-w-container-xl */}
      <main className="py-20 px-6 max-w-container-xl mx-auto flex flex-col gap-12" id="main-content">

        {/* --- SECTION : QUESTIONS ORIENTÉES --- */}
        <section className="bg-surface-soft p-8 md:p-12 rounded-section border border-border shadow-sm">
          <div className="text-center mb-10">
            <h2 className="font-heading text-h2 md:text-h1 font-extrabold text-primary uppercase tracking-wide mb-4">
              {questionsOrientees.titre}
            </h2>
            <div className="w-20 h-1.5 bg-accent mx-auto rounded-full mb-6"></div>
            <p className="text-content-muted text-base max-w-2xl mx-auto">
              {questionsOrientees.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {questionsOrientees.items.map((item, idx) => (
              <div key={idx} className="bg-surface p-8 rounded-card border border-border hover:border-accent hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center gap-5 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center font-bold text-xl group-hover:bg-accent group-hover:text-white transition-colors">
                    ?
                  </div>
                  <h3 className="font-heading font-bold text-primary text-xl group-hover:text-accent transition-colors">
                    {item.q}
                  </h3>
                </div>
                <p className="text-medium text-content-muted leading-relaxed md:pl-17">
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
          image={cpf.image} // Remplacé dynamiquement !
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
          image={opco.image} // Remplacé dynamiquement !
          columns={opco.columns}
        />

        {/* SECTION POLE EMPLOI */}
        <CardDesc
          title={poleEmploi.titre}
          description={poleEmploi.description}
          image={poleEmploi.image} // Remplacé dynamiquement !
          columns={poleEmploi.columns}
        />

        {/* SECTION AUTRES */}
        <CardDesc
          title={autresSolutions.titre}
          image={autresSolutions.image} // Remplacé dynamiquement !
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