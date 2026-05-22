import ResponsiveImage from '../ResponsiveImage';

/*
 * Composant TexteSection
 * Affiche une section de texte avec titre et contenu, optionnellement accompagnée d'une image.
 * Props :
 * - data : objet avec titre, contenu (array de paragraphes), image (optionnel)
 * - imageRight : boolean pour positionner l'image à droite (défaut) ou à gauche
 * - variant : 'default' | 'compact' — paddings et typo réduits (pages formation détail)
 */

export default function TexteSection({ data, imageRight = true, variant = 'default' }) {
  if (!data) return null;

  const { titre, contenu, image } = data;
  const hasImage = Boolean(image);
  const isCompact = variant === 'compact';

  const sectionPad = isCompact ? 'py-0 bg-transparent' : 'py-20 bg-white';
  const containerPad = isCompact ? 'px-0' : 'px-6';
  const gridGap = isCompact ? 'gap-8 lg:gap-10' : 'gap-16';
  const titleClass = isCompact
    ? 'font-heading text-2xl md:text-3xl font-extrabold text-primary mb-6 leading-tight tracking-tight border-b border-border pb-4'
    : 'font-heading text-[36px] md:text-[44px] font-black text-primary mb-10 leading-tight tracking-tight';
  const bodyGap = isCompact ? 'gap-4' : 'gap-8';
  const paragraphClass = isCompact
    ? 'text-[15px] md:text-base text-content-muted leading-relaxed font-body'
    : 'text-[17px] md:text-[18px] text-content-muted leading-relaxed font-body';
  const imageWrap = isCompact
    ? 'rounded-lg overflow-hidden shadow-md border border-border'
    : 'rounded-card overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-[1.02]';

  return (
    <section className={sectionPad}>
      <div className={`max-w-container-xl mx-auto ${containerPad}`}>
        <div className={`grid grid-cols-1 ${hasImage ? 'lg:grid-cols-2' : ''} ${gridGap} items-start`}>
          <div className={`${hasImage && !imageRight ? 'lg:order-last' : ''}`}>
            <h2 className={titleClass}>
              {titre}
            </h2>

            <div className={`flex flex-col ${bodyGap}`}>
              {(Array.isArray(contenu) ? contenu : [contenu])
                .filter(Boolean)
                .map((paragraphe, index) => (
                  <p key={index} className={paragraphClass}>
                    {paragraphe}
                  </p>
                ))}
            </div>
          </div>

          {hasImage && (
            <div className="relative">
              <div className={imageWrap}>
                <ResponsiveImage
                  src={image}
                  alt={titre}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="w-full object-cover h-auto aspect-[4/3]"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
