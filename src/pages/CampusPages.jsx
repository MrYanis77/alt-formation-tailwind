import React from 'react';
import { campus, hero } from '../data/campus';
import CardFormation from '../components/Card/CardFormation';
import Breadcrumb from '../components/Breadcrumb';
import Hero from '../components/Hero/Hero';

export default function CampusPages() {
  return (
    <div className="bg-surface min-h-screen">
      <Hero
        title={hero.titre}
        subtitle={hero.sousTitre}
        video={hero.video}
      />

      <Breadcrumb
        items={[
          { label: 'Accueil', to: '/' },
          { label: 'Nos Campus' },
        ]}
      />

      <section className="py-20 px-6 bg-surface-soft">
        <div className="max-w-container-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold font-heading text-primary mb-4">
              Découvrez nos Campus et  infrastructures
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {campus.map((item) => (
              <CardFormation
                key={item.id}
                title={item.nom}
                image={item.image}
                href="#"
                variant="white"
                hideButton
                mapsHref={item.mapLink}
                mapsButtonLabel="Ouvrir dans Google Maps"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
