import React from 'react';
import { Coffee, Laptop, GraduationCap, Medal, Clock, Briefcase, BookOpen, MapPin, HelpCircle } from 'lucide-react';

const ICON_MAP = {
  coffee: Coffee,
  laptop: Laptop,
  'graduation-cap': GraduationCap,
  medal: Medal,
  clock: Clock,
  briefcase: Briefcase,
  book: BookOpen,
  'map-pin': MapPin,
};

export default function AdvantageCard({ label, iconeName, index, compact = false }) {
  const Icon = ICON_MAP[iconeName] || HelpCircle;

  const isNavy = Math.floor(index / 4) % 2 === 0
    ? index % 2 !== 0
    : index % 2 === 0;

  return (
    <div className={`
      ${isNavy ? 'bg-primary' : 'bg-accent'}
      rounded-card flex flex-col items-center justify-center text-center
      h-full transition-transform hover:scale-105 duration-300 shadow-md
      ${compact ? 'p-5 min-h-[130px]' : 'p-8 min-h-[200px]'}
    `}>
      <div className={`text-white ${compact ? 'mb-2' : 'mb-4'}`}>
        <Icon size={compact ? 28 : 42} strokeWidth={1.5} />
      </div>
      <h3 className={`text-white font-bold ${compact ? 'text-sm md:text-base' : 'text-lg md:text-xl'}`}>
        {label}
      </h3>
    </div>
  );
}
