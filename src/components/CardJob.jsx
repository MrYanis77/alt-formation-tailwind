import React from 'react';

/**
 * CardJob.jsx — Design fidèle à l'image 3ea2a0.png
 */
const CardJob = ({ poste }) => {
  return (
    <div className="bg-white p-8 rounded-[20px] shadow-lg flex flex-col justify-between relative group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      {/* Icône de validation verte */}
      <div className="absolute top-6 right-6 text-[#4ADE80]">
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>

      <div className="mt-2">
        <h3 className="font-heading font-black text-navy text-[20px] leading-tight mb-6 pr-8">
          {poste.titre}
        </h3>

        <div className="flex items-center gap-3 text-orange">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
          <span className="font-bold text-[16px] tracking-wide">
            {poste.salaire}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardJob;