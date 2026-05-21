import { Link } from 'react-router-dom';

/**
 * Section descriptive (financement, entreprise…)
 * @param {string} [sectionId] - Ancre HTML (#cpf, etc.)
 * @param {Object} [cta] - Bouton principal { label, href, external? }
 * @param {Array<{label, href}>} [footerLinks] - Liens internes sous le contenu
 * @param {boolean} [imageContain] - object-contain pour les logos
 */
export default function CardDesc({
  sectionId,
  title,
  description,
  columns = [],
  highlight = false,
  cta = null,
  footerLinks = [],
  image = null,
  imageContain = false,
}) {
  const isExternal = (href) => href?.startsWith('http');

  return (
    <section
      id={sectionId}
      className={`scroll-mt-28 bg-surface border ${
        highlight ? 'border-accent shadow-md' : 'border-border shadow-sm'
      } rounded-card overflow-hidden transition-shadow hover:shadow-lg`}
    >
      <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12">
        {image ? (
          <div
            className={`flex-shrink-0 w-32 h-32 md:w-48 md:h-48 rounded-[24px] overflow-hidden border border-border shadow-sm bg-white flex items-center justify-center p-3 ${
              imageContain ? '' : 'bg-surface'
            }`}
          >
            <img
              src={image}
              alt=""
              className={`w-full h-full ${imageContain ? 'object-contain' : 'object-cover'}`}
            />
          </div>
        ) : null}

        <div className="flex-1 w-full">
          <h2 className="font-heading text-h2 font-bold text-primary mb-4 text-center md:text-left">
            {title}
          </h2>

          {description ? (
            <p className="text-medium text-content-muted leading-relaxed mb-8 text-center md:text-left">
              {description}
            </p>
          ) : null}

          <div
            className={`grid grid-cols-1 ${
              columns.length >= 4
                ? 'lg:grid-cols-4'
                : columns.length === 3
                  ? 'lg:grid-cols-3'
                  : 'lg:grid-cols-2'
            } gap-8`}
          >
            {columns.map((col, idx) => (
              <div key={idx} className="flex flex-col h-full">
                <h3 className="font-heading text-medium font-bold text-primary mb-4 uppercase tracking-tight">
                  {col.label || col.titre}
                </h3>

                {col.items?.length > 0 ? (
                  <ul className="flex flex-col gap-3 mb-6">
                    {col.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-medium text-content-muted">
                        <span className="text-accent font-bold text-xl leading-none mt-[-2px]">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}

                {(col.text || col.desc) ? (
                  <p className="text-medium text-content-muted leading-relaxed mb-6">
                    {col.text || col.desc}
                  </p>
                ) : null}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-center gap-4 mt-6 pt-4 border-t border-border/60">
            {cta ? (
              isExternal(cta.href) ? (
                <a
                  href={cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-orange inline-block no-underline"
                >
                  {cta.label}
                </a>
              ) : (
                <Link to={cta.href} className="btn-orange inline-block no-underline">
                  {cta.label}
                </Link>
              )
            ) : null}

            {footerLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-bold text-accent hover:text-primary hover:underline no-underline"
              >
                {link.label} →
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
