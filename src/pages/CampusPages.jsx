import React from 'react';
import { campus } from '../data/campus';
import CardFormation from '../components/CardFormation';
import Breadcrumb from '../components/Breadcrumb'; // Assure-toi de l'import
import Hero from '../components/Hero'; // Assure-toi de l'import

export default function CampusPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Fil d'Ariane */}
      <Breadcrumb
        items={[
          { label: 'Accueil', to: '/' }, 
          { label: 'Nos Campus' }
        ]}
      />

      {/* 1. HERO SECTION (Utilisation du composant Hero) */}
      <Hero
        title="Nos Campus"
        subtitle="Retrouvez-nous dans toute l'Île-de-France. Des infrastructures modernes au service de votre réussite."
      />

      {/* 2. GRILLE DES CAMPUS */}
      <section className="py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campus.map((item) => (
              <CardFormation
                key={item.id}
                title={item.nom}
                image={item.image}
                // Adaptation des points pour le contexte Campus
                points={[
                  item.adresse,
                  "Espaces de coworking modernes",
                  "Accessible en transports en commun",
                  item.id === "val-d-europe" ? "Campus principal (Siège)" : "Centre de formation certifié"
                ]}
                variant="white"
              />
            ))}
          </div>
        </div>
      </section>

      
    </div>
  );
}