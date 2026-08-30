import { Link } from 'react-router-dom';

export default function BlogCard({ article }) {
  const inner = (
    <>
      <div className="h-52 bg-primary flex items-center justify-center overflow-hidden">
        {article.image && !article.image.includes('fallback') ? (
          <img
            src={article.image}
            alt=""
            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-white font-bold opacity-90">{article.categoryShort || 'Blog'}</span>
        )}
      </div>

      <div className="p-6">
        <span className="inline-block px-4 py-1 bg-accent/10 text-accent rounded-full text-xs font-bold mb-4">
          {article.category}
        </span>
        <h3 className="text-primary font-bold text-[19px] leading-tight mb-4 group-hover:text-accent transition-colors">
          {article.title}
        </h3>
        <p className="text-content-muted text-sm line-clamp-3 mb-6">{article.excerpt}</p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-small text-content-muted">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">👤</span>
            {article.author}
          </div>
          <div className="flex items-center gap-2">📅 {article.date}</div>
        </div>
      </div>
    </>
  );

  const className =
    'bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group block';

  if (article.link) {
    return (
      <Link to={article.link} className={className}>
        {inner}
      </Link>
    );
  }

  return <article className={className}>{inner}</article>;
}
