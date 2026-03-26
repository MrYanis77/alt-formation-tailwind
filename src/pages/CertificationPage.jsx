import React from 'react';
import { certifications, hero } from '../data/certification'; 
import CardFormation from '../components/CardFormation';
import Breadcrumb from '../components/Breadcrumb';
import Hero from '../components/Hero';

export default function CertificationPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Fil d'Ariane cohérent avec le Hero */}
      <Breadcrumb
        items={[
          { label: 'Accueil', to: '/' }, 
          { label: 'Certifications' }
        ]}
      />

      {/* Hero dynamique via data/certification.js */}
      <Hero
        title={hero.titre}
        subtitle={hero.sousTitre}
      />

      <section className="py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          {/* Grille responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* CORRECTION : Utilisation de "certifications" (pluriel) défini dans l'import */}
            {certifications.map((certif) => (
              <CardFormation
                key={certif.id}
                title={certif.nom}
                image="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80"
                // AJOUT : Passage du lien vers le bouton de la carte
                href={certif.lien}
                points={[
                  `Code RNCP : ${certif.rncp}`,
                  `Niveau : ${certif.niveau}`,
                  "Éligible au compte CPF",
                  "Formation reconnue par l'État"
                ]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section de réassurance basse (optionnelle) */}
      <section className="bg-gray-50 py-16 border-t border-border">
        <div className="max-w-[800px] mx-auto text-center px-6">
          <h2 className="text-navy font-bold text-2xl mb-4">Besoin d'un renseignement ?</h2>
          <p className="text-muted mb-8">
            Nos conseillers vous accompagnent dans le choix de votre certification 
            et le montage de votre dossier de financement.
          </p>
          <button className="btn-orange">
            Contactez un expert
          </button>
        </div>
      </section>
    </div>
  );
}