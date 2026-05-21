import React, { useMemo, useState } from 'react';
import { campus, hero, getCampusGalleryImages } from '../data/campus';
import CardFormation from '../components/Card/CardFormation';
import Breadcrumb from '../components/Breadcrumb';
import Hero from '../components/Hero/Hero';
import CampusImageLightbox from '../components/Campus/CampusImageLightbox';

export default function CampusPages() {
  const [lightboxCampusId, setLightboxCampusId] = useState(null);

  const activeCampus = useMemo(
    () => (lightboxCampusId ? campus.find((c) => c.id === lightboxCampusId) : null),
    [lightboxCampusId],
  );

  const galleryImages = useMemo(
    () => (activeCampus ? getCampusGalleryImages(activeCampus) : []),
    [activeCampus],
  );

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

      <section className="py-14 md:py-16 px-6 bg-surface-soft">
        <div className="max-w-container-xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold font-heading text-primary mb-4">
              Découvrez nos Campus et  infrastructures
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {campus.map((item) => (
              <CardFormation
                key={item.id}
                title={item.nom}
                image={item.image}
                href="#"
                variant="white"
                compact
                dense
                hideButton
                mapsHref={item.mapLink}
                mapsButtonLabel={`Aller à ${item.nom}`}
                onImageClick={() => setLightboxCampusId(item.id)}
              />
            ))}
          </div>
        </div>
      </section>

      <CampusImageLightbox
        open={Boolean(lightboxCampusId)}
        onClose={() => setLightboxCampusId(null)}
        title={activeCampus?.nom ?? ''}
        images={galleryImages}
        initialIndex={0}
      />
    </div>
  );
}
