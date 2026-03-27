import React from 'react';
import * as LucideIcons from 'lucide-react';

export default function AdvantageCard({ label, iconeName, index }) {
  // Récupération dynamique de l'icône Lucide
  const Icon = LucideIcons[iconeName.charAt(0).toUpperCase() + iconeName.slice(1)] || LucideIcons.HelpCircle;

  // Logique d'alternance des couleurs (Orange / Navy)
  // Basé sur le design : [Orange, Navy, Orange, Navy] puis [Navy, Orange, Navy, Orange]
  const isNavy = Math.floor(index / 4) % 2 === 0 
    ? index % 2 !== 0 
    : index % 2 === 0;

  return (
    <div className={`
      ${isNavy ? 'bg-[#1E2F47]' : 'bg-[#D9934A]'} 
      rounded-[20px] p-8 flex flex-col items-center justify-center text-center 
      aspect-[16/9] transition-transform hover:scale-105 duration-300 shadow-md
    `}>
      <div className="text-white mb-4">
        <Icon size={42} strokeWidth={1.5} />
      </div>
      <h3 className="text-white font-bold text-lg md:text-xl">
        {label}
      </h3>
    </div>
  );
}