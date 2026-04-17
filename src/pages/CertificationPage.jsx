import React, { useState } from 'react'; // Ajout de useState
import { certifications, hero, categories } from '../data/certification'; // Import des catégories
import CardFormation from '../components/Card/CardFormation';
import Breadcrumb from '../components/Breadcrumb';
import Hero from '../components/Hero/Hero';
import FiltreCat from '../components/Items/FiltreCat'; // Import de votre nouveau composant
import CallToAction from '../components/CallToAction';

export default function CertificationPage() {
  const [activeCategory, setActiveCategory] = useState("Tous");

  // Logique de filtrage
  const filteredCertifs = activeCategory === "Tous"
    ? certifications
    : certifications.filter(certif => certif.category === activeCategory);

  return (
    <div className="bg-white min-h-screen">

      <Hero
        title={hero.titre}
        subtitle={hero.sousTitre}
        video={hero.video}
      />

      <Breadcrumb
        items={[
          { label: 'Accueil', to: '/' },
          { label: 'Certifications' }
        ]}
      />

      {/* AJOUT : Composant de filtrage */}
      <FiltreCat
        categories={categories}
        activeCat={activeCategory}
        setActiveCat={setActiveCategory}
      />

      <section className="pb-20 px-6">
        <div className="max-w-container-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* On utilise filteredCertifs au lieu de certifications */}
            {filteredCertifs.map((certif) => (
              <CardFormation
                key={certif.id}
                title={certif.nom}
                image={certif.imageUrl || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80"}
                href={certif.lienFranceCompetence}
                points={[
                  `Code RNCP : ${certif.rncp}`,
                  `Niveau : ${certif.niveau}`,
                  "Éligible au compte CPF",
                  "Formation reconnue par l'État"
                ]}
              />
            ))}
          </div>

          {/* Message si aucun résultat (optionnel) */}
          {filteredCertifs.length === 0 && (
            <p className="text-center text-gray-500 mt-10">
              Aucune certification ne correspond à cette catégorie.
            </p>
          )}
        </div>
      </section>

      <CallToAction
        variante="claire"
        titre="Besoin d'un renseignement ?"
        sousTitre="Nos conseillers vous accompagnent dans le choix de votre certification et le montage de votre dossier de financement."
        texteBouton="Contactez un expert"
        lienBouton="/contact"
      />
    </div>
  );
}