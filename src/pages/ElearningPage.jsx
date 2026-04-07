/*
 * Page ElearningPage
 * Présente la plateforme e-learning avec :
 * - Section héros
 * - Fonctionnalités de la plateforme (grille de cartes)
 * - Statistiques
 * - Appel à l'action pour accéder à la plateforme
 */

import Hero from '../components/Hero/Hero';
import Breadcrumb from '../components/Breadcrumb';
import CardGrid from '../components/Card/CardGrid';
import StatsSection from '../components/Stats/StatsSection';

// Données : features doit être formaté avec { titre, description, items }
import {hero, features, stats } from '../data/elearning';

export default function ElearningPage() {
  return (
    <div className="bg-white min-h-screen">
      
      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'E-learning' }]} />
      
      <Hero
          title={hero.titre}
          subtitle={hero.sousTitre}
      />

      {/* ===== SECTION PLATEFORME (Image 9ab569) ===== */}
      <main className="py-20 px-6 max-w-[1100px] mx-auto" id="main-content">
        <div className="text-center mb-16">
          <h2 className="font-heading font-extrabold text-3xl text-dark uppercase tracking-tight">
            Notre plateforme e-learning
          </h2>
          <div className="w-20 h-1 bg-orange mx-auto mt-4 rounded-full"></div>
        </div>
        
        {/* On utilise CardGrid avec 2 colonnes pour le look 2x2 de la maquette */}
        <CardGrid services={features} cols={2} />
      </main>

      {/* ===== SECTION STATISTIQUES ===== */}
      <StatsSection stats={stats} variant="light" />

      {/* ===== SECTION CTA ===== */}
      <section className="py-24 px-6 bg-gray-50 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold mb-6 text-navy">
            Prêt à démarrer votre apprentissage ?
          </h2>
          <p className="text-muted text-lg mb-10 leading-relaxed font-body">
            Rejoignez des milliers d'étudiants et accédez immédiatement à nos modules certifiants.
          </p>
          <a 
            href="/connexion" 
            className="inline-block bg-orange hover:bg-orange-dark text-white font-heading font-bold py-4 px-12 rounded-default transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-orange/20 no-underline uppercase tracking-wider text-sm"
          >
            Accéder à la plateforme
          </a>
        </div>
      </section>

    </div>
  );
}