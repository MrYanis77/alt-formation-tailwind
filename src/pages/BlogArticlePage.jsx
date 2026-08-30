import { Link, useParams } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import Hero from '../components/Hero/Hero';
import { hero as staticHero } from '../data/Blog';
import { usePublicBlog } from '../features/blog/hooks/usePublicBlog';

export default function BlogArticlePage() {
  const { slug } = useParams();
  const { posts, loading, error } = usePublicBlog({ slug });
  const article = posts[0];

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-content-muted">
        Chargement de l&apos;article…
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="font-heading text-2xl font-bold text-primary">Article introuvable</h1>
        <p className="text-content-muted max-w-md">{error || "Cet article n'existe pas ou n'est pas encore publié."}</p>
        <Link to="/blog" className="btn-orange px-8 py-3">
          Retour au blog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Hero title={article.title} subtitle={article.category} video={staticHero.video} />

      <Breadcrumb
        items={[
          { label: 'Accueil', to: '/' },
          { label: 'Actualités', to: '/blog' },
          { label: article.title },
        ]}
      />

      <article className="max-w-container-lg mx-auto px-6 py-12 md:py-16">
        <div className="flex flex-wrap gap-4 text-sm text-content-muted mb-8 pb-6 border-b border-border">
          <span>Par {article.author}</span>
          <span>{article.date}</span>
          {article.readTime ? <span>{article.readTime} de lecture</span> : null}
        </div>

        {article.image && !article.image.includes('fallback') ? (
          <img
            src={article.image}
            alt=""
            className="w-full max-h-[420px] object-cover rounded-2xl mb-10"
          />
        ) : null}

        {article.excerpt ? (
          <p className="text-lg text-content-muted leading-relaxed mb-8 font-medium">{article.excerpt}</p>
        ) : null}

        <div
          className="prose prose-lg max-w-none text-content-dark font-body leading-relaxed"
        >
          {article.content?.includes('<') ? (
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          ) : (
            <p className="whitespace-pre-wrap">{article.content}</p>
          )}
        </div>
      </article>
    </div>
  );
}
