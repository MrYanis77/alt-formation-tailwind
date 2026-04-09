import React from 'react';

export default function ExpertiseCard({ title, description, icon }) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-50 flex flex-col items-start text-left transition-all duration-300 hover:shadow-2xl hover:shadow-orange-100/50">
      
      {/* Conteneur Icône */}
      <div className="w-14 h-14 bg-[#F8FAFC] rounded-2xl flex items-center justify-center text-2xl mb-6 border border-gray-100">
        {icon}
      </div>

      {/* Titre de l'expertise */}
      <h3 className="text-xl font-black text-[#002D4C] mb-4 uppercase tracking-tight">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-500 text-sm leading-relaxed">
        {description}
      </p>
      
    </div>
  );
}