import { Link } from 'react-router-dom';

export default function HeroSlide({ slide }) {
  return (
    <div className="max-w-[700px]">
      <span className="inline-block bg-orange text-white font-heading text-[11px] font-bold px-3 py-1 rounded-full tracking-wider mb-4.5 uppercase">
        {slide.badge}
      </span>

      <h1 className="font-heading text-3xl md:text-[38px] font-extrabold text-white leading-[1.15] mb-3 whitespace-pre-line">
        {slide.title}
      </h1>

      <p className="font-heading text-[16px] font-bold text-orange mb-2.5">
        {slide.subtitle}
      </p>

      <p className="text-white/85 text-[14px] leading-relaxed mb-6 max-w-[500px] font-body">
        {slide.desc}
      </p>

      <Link 
        to={slide.ctaTo} 
        className="btn-orange inline-block px-7 py-3 text-sm shadow-lg"
      >
        {slide.cta}
      </Link>
    </div>
  );
}