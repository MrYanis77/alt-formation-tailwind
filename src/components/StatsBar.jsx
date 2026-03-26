import React from 'react';

export default function StatsBar({ stats }) {
  const iconMap = {
    clock: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
    ),
    medal: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
        <circle cx="12" cy="8" r="5" />
      </svg>
    ),
    users: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    trend: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M22 7L13.5 15.5L8.5 10.5L2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    )
  };

  if (!stats) return null;

  return (
    <div className="w-full bg-white py-14 border-b border-gray-100">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <div className="text-orange mb-4">
                {iconMap[stat.icon]}
              </div>
              <div className="text-navy font-black text-3xl md:text-4xl mb-1 tracking-tight">
                {stat.valeur}
              </div>
              <div className="text-muted text-[13px] md:text-[14px] font-medium uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}