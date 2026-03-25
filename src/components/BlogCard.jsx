import React from 'react';

const BlogCard = ({ article }) => {
  return (
    <article className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
      {/* Thumbnail Placeholder */}
      <div className="h-52 bg-navy flex items-center justify-center text-white font-bold opacity-90">
        {article.categoryShort || 'Blog'}
      </div>
      
      <div className="p-6">
        <span className="inline-block px-4 py-1 bg-orange/10 text-orange rounded-full text-[12px] font-bold mb-4">
          {article.category}
        </span>
        <h3 className="text-navy font-bold text-[19px] leading-tight mb-4 group-hover:text-orange transition-colors">
          {article.title}
        </h3>
        <p className="text-[#666] text-[14px] line-clamp-3 mb-6">
          {article.excerpt}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-[13px] text-[#888]">
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