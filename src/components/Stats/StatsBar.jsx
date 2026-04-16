import React from 'react';

export default function StatsBar({ stats }) {
  const iconMap = {
    clock: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
    ),
    medal: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
        <circle cx="12" cy="8" r="5" />
      </svg>
    ),
    users: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    trend: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 7L13.5 15.5L8.5 10.5L2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    )
  };

  if (!stats) return null;

  return (
    <div className="w-full bg-primary py-0">
      <div className="max-w-container-xl mx-auto px-6">
        <div className={`grid gap-0 divide-x divide-white/10 ${
          stats.length <= 2 ? 'grid-cols-1 sm:grid-cols-2' :
          stats.length === 3 ? 'grid-cols-1 sm:grid-cols-3' :
          'grid-cols-2 lg:grid-cols-4'
        }`}>
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex items-center gap-5 px-8 py-7 group transition-all duration-300 hover:bg-white/5"
            >
              {/* Icône avec cercle accent */}
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center text-accent group-hover:bg-accent/25 transition-colors duration-300">
                {iconMap[stat.icon]}
              </div>

              {/* Texte */}
              <div className="flex flex-col">
                <span className="text-white font-heading font-extrabold text-lg md:text-xl leading-tight tracking-tight">
                  {stat.valeur}
                </span>
                <span className="text-white/55 text-xs font-semibold uppercase tracking-widest mt-1">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}