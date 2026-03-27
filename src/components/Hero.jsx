/**
 * Hero.jsx — Bannière hero dynamique
 * Supporte maintenant une image de fond personnalisée via props.
 */
export default function Hero({ 
  title, 
  subtitle, 
  image  
}) {
  return (
    <section 
      className="relative min-h-[400px] flex items-center justify-center bg-navy px-6 py-20 text-center overflow-hidden"
      style={{
        // L'image est maintenant dynamique via la prop 'image'
        backgroundImage: `url('${image}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed' // Optionnel : petit effet parallaxe sympa
      }}
      aria-label={`Bandeau ${title}`}
    >
      {/* Overlay respectant ta variable --color-hero-overlay (défini dans index.css) */}
      <div className="absolute inset-0 bg-hero-overlay z-0"></div>

      {/* Contenu textuel */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 uppercase tracking-tight">
          {title}
        </h1>
        
        {subtitle && (
          <p className="text-white/90 text-lg md:text-xl font-body max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}