import React from 'react';

const FiltreCat = ({ categories = [], activeCat = 'Tous', setActiveCat }) => {
  return (
    <div className="flex flex-wrap items-center gap-3 py-8 max-w-[1100px] mx-auto px-6 border-b border-gray-50 mb-12">
      <span className="font-bold text-primary text-base mr-2">Catégories :</span>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setActiveCat(cat)}
          className={`px-6 py-2 rounded-lg border text-sm font-medium transition-all
            ${activeCat === cat
              ? 'bg-accent border-accent text-white shadow-accent/20 shadow-lg'
              : 'bg-white border-gray-200 text-primary hover:border-accent hover:text-accent'}`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default FiltreCat;