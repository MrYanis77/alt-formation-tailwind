import React from 'react';

const BlogCard = ({ article }) => {
  return (
    <article className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
      {/* Thumbnail Placeholder */}
      <div className="h-52 bg-primary flex items-center justify-center text-white font-bold opacity-90">
        {article.categoryShort || 'Blog'}
      </div>

      <div className="p-6">
        <span className="inline-block px-4 py-1 bg-accent/10 text-accent rounded-full text-xs font-bold mb-4">
          {article.category}
        </span>
        <h3 className="text-primary font-bold text-[19px] leading-tight mb-4 group-hover:text-accent transition-colors">
          {article.title}
        </h3>
        <p className="text-content-muted text-sm line-clamp-3 mb-6">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-small text-content-muted">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">👤</span>
            {article.author}
          </div>
          <div className="flex items-center gap-2">
            📅 {article.date}
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;