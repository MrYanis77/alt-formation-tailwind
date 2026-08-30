import { useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import Hero from '../components/Hero/Hero';
import BlogCard from '../components/Card/BlogCard';
import FiltreCat from '../components/Items/FiltreCat';
import { usePublicBlog } from '../features/blog/hooks/usePublicBlog';

const HERO = {
  titre: 'Blog',
  sousTitre: 'Actualités et conseils Alt RH Formations',
  video: '/assets/video/blog.mp4',
};

export default function BlogPage() {
  const { posts, categories, loading, error } = usePublicBlog();
  const [activeCategory, setActiveCategory] = useState('Tous');

  const filteredPosts =
    activeCategory === 'Tous' ? posts : posts.filter((post) => post.category === activeCategory);

  return (
    <div className="bg-white min-h-screen">
      <Hero title={HERO.titre} subtitle={HERO.sousTitre} video={HERO.video} />
      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Blog' }]} />

      <main className="max-w-container-3xl mx-auto px-6 py-[60px]">
        {loading ? <p className="text-content-muted text-sm mb-8">Chargement depuis la base…</p> : null}

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 px-5 py-4 text-sm mb-8">
            <strong>Erreur BDD :</strong> {error}
          </div>
        ) : null}

        {!loading && !error && posts.length === 0 ? (
          <p className="text-content-muted text-sm mb-8">Aucun article dans la base pour le moment.</p>
        ) : null}

        {posts.length > 0 ? (
          <>
            <FiltreCat categories={categories} activeCat={activeCategory} setActiveCat={setActiveCategory} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <BlogCard key={post.id ?? post.slug} article={post} />
              ))}
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
