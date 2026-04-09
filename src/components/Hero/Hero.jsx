/**
 * Hero.jsx — Bannière hero dynamique
 * Supporte maintenant une image de fond personnalisée via props.
 */
export default function Hero({ 
  title, 
  subtitle, 
  image  
}) {
  // Détection d'une vidéo
  const isVideo = image?.includes('.mp4');

  return (
    <section 
      className="relative min-h-[400px] flex items-center justify-center bg-navy px-6 py-20 text-center overflow-hidden"
      aria-label={`Bandeau ${title}`}
    >
      {/* Gestion dynamique de l'arrière-plan (Vidéo vs Image) */}
      {isVideo ? (
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={image} type="video/mp4" />
        </video>
      ) : (
        <div 
          className="absolute inset-0 w-full h-full z-0"
          style={{
            backgroundImage: `url('${image}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        />
      )}

      {/* Overlay beaucoup plus clair (éclaircissement demandé) */}
      <div className="absolute inset-0 bg-[#0A192F]/40 z-0"></div>

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