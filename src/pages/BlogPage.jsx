import React, { useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import Hero from '../components/Hero/Hero';
import { categories, blogPosts, newsletterData, paginationData } from '../data/Blog';
import BlogCard from '../components/Card/BlogCard';
import FiltreCat from '../components/Items/FiltreCat'; // <-- Import du nouveau composant

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("Tous");

  // Filtrage des articles selon la catégorie sélectionnée
  const filteredPosts = activeCategory === "Tous"
    ? blogPosts
    : blogPosts.filter(post => post.category === activeCategory);

  return (
    <div className="bg-white min-h-screen">

      <Hero
        title="Actualités & Ressources"
        subtitle="Suivez les dernières tendances de la formation et du digital"
        image="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200"
      />

      <Breadcrumb
        items={[{ label: 'Accueil', to: '/' }, { label: 'Actualités' }]}
      />

      <main className="max-w-container-3xl mx-auto px-6 py-[60px]">

        {/* ======== SECTION FILTRES ======== */}
        <FiltreCat
          categories={categories}
          activeCat={activeCategory}
          setActiveCat={setActiveCategory}
        />

        {/* ======== GRILLE D'ARTICLES (image_a607c5.png) ======== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} article={post} />
          ))}
        </div>

        {/* ======== PAGINATION (image_a607d7.png) ======== */}
        <div className="flex justify-center items-center gap-2 mb-20">
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-primary text-sm hover:bg-gray-50">
            {paginationData.prevLabel}
          </button>
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm
                ${num === paginationData.currentPage ? 'bg-accent text-white' : 'border border-gray-200 text-primary hover:bg-gray-50'}`}
            >
              {num}
            </button>
          ))}
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-primary text-sm hover:bg-gray-50">
            {paginationData.nextLabel}
          </button>
        </div>

        {/* ======== NEWSLETTER (image_a607e5.png) ======== */}
        <section className="bg-surface-alt border border-gray-100 rounded-3xl p-10 md:p-16 text-center">
          <h2 className="font-heading text-h2 md:text-h1 font-bold text-primary mb-4">
            {newsletterData.title}
          </h2>
          <p className="text-content-muted text-base mb-10 max-w-xl mx-auto leading-relaxed">
            {newsletterData.subtitle}
          </p>
          <form className="flex flex-col md:flex-row max-w-2xl mx-auto gap-4" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder={newsletterData.placeholder}
              className="flex-1 bg-white border border-gray-200 px-6 py-4 rounded-xl focus:outline-none focus:border-accent transition-colors text-medium"
              required
            />
            <button
              type="submit"
              className="bg-accent hover:bg-accent-dark text-white px-10 py-4 rounded-xl font-bold text-base transition-all shadow-lg shadow-accent/20"
            >
              {newsletterData.buttonText}
            </button>
          </form>
        </section>

      </main>

    </div>
  );
};