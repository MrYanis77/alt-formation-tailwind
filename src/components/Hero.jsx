/**
 * Hero.jsx — Bannière hero fidèle à la maquette
 * Utilise l'overlay navy translucide et les polices définies dans index.css
 */
export default function Hero({ title, subtitle }) {
  return (
    <section 
      className="relative min-h-[400px] flex items-center justify-center bg-navy px-6 py-20 text-center"
      style={{
        // On utilise ici une image d'illustration, l'overlay est géré par la div suivante
        backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
      aria-label={`Bandeau ${title}`}
    >
      {/* Overlay respectant ta variable --color-hero-overlay */}
      <div className="absolute inset-0 bg-hero-overlay z-0"></div>

      {/* Contenu textuel */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
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