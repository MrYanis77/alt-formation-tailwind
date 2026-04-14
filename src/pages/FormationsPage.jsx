
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import Hero from '../components/Hero/Hero';
import CardFormation from '../components/Card/CardFormation'; // Import du nouveau composant
import CallToAction from '../components/CallToAction';
import { hero, catalogue } from '../data/formations';

export default function FormationsPage() {
  return (
    <div className="bg-white min-h-screen">

      {/* Hero Section (Carousel) */}
      <Hero
        title={hero.titre}
        subtitle={hero.sousTitre}
        video={hero.video}
      />

      {/* Fil d'ariane */}
      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Formations' }]} />

      {/* ===== CATALOGUE ===== */}
      <main className="max-w-[1200px] mx-auto py-[80px] px-6" id="main-content">
        {catalogue.map((category, index) => {
          // Alternance : une section sur deux en mode "Navy" (sombre)
          const isDarkSection = index % 2 !== 0;

          return (
            <section key={category.id} className="mb-[100px]" id={category.id}>

              {/* Header de catégorie (Image 9a22e3) */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div className="flex items-center group">
                  <div className="w-[6px] h-10 bg-orange rounded-full mr-4"></div>
                  <h2 className="font-heading text-2xl md:text-3xl font-[800] text-navy uppercase tracking-tight">
                    {category.label}
                  </h2>
                </div>

                {/* Bouton "Voir toutes" (Vu sur toutes tes images en haut à droite) */}
                <button className="btn-orange text-[12px] md:text-[13px] py-2 px-6 opacity-90 hover:opacity-100 self-start">
                  Voir toutes les formations
                </button>
              </div>

              {/* Grille de cartes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
                {category.items.map((item, idx) => (
                  <CardFormation
                    key={idx}
                    title={item.titre}
                    image={item.imageUrl || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800"} // Image dynamique
                    points={item.features}
                    variant={isDarkSection ? "navy" : "white"} // Respect de l'alternance des visuels
                    href={item.href}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* ===== CTA FINAL ===== */}

      <CallToAction
        variant="light"
        title="Besoin d'un conseil personnalisé ?"
        subtitle="Nos conseillers sont à votre écoute pour vous orienter vers la formation la plus adaptée à votre profil et vos financements."
        buttonText="Être rappelé gratuitement"
        onButtonClick={() => window.location.href = 'tel:0123456789'}
      />


    </div >
  );
}