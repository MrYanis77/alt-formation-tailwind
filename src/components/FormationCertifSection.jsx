import React from 'react';
import { Link } from 'react-router-dom';
import { Award } from 'lucide-react';

export default function FormationCertifSection({ certif, showFallback = false }) {
  if (!certif && !showFallback) return null;

  const repertoire = certif?.repertoire || 'RNCP';
  const isRs = repertoire === 'RS';
  const sectionTitle = isRs ? 'Certification RS visée' : 'Titre professionnel visé (RNCP)';
  const codeLabel = `${repertoire} ${certif?.rncp || certif?.code || ''}`.trim();

  return (
    <section className="py-12 lg:py-16 px-6 bg-white border-t border-border">
      <div className="max-w-container-3xl mx-auto">
        <div className="text-center mb-8 lg:mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-accent font-bold text-xs uppercase tracking-widest mb-4">
            <Award className="w-4 h-4" />
            Certification
          </div>
          <h2 className="font-heading text-2xl md:text-4xl font-extrabold text-primary uppercase tracking-wider">
            {certif ? sectionTitle : 'Certifications et qualité'}
          </h2>
        </div>

        {certif ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch rounded-2xl border border-border bg-gray-50 overflow-hidden shadow-md">
            <div className="relative min-h-[220px] lg:min-h-0">
              <img
                src={certif.imageUrl}
                alt={certif.nom}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h3 className="font-heading text-xl md:text-2xl font-extrabold text-primary mb-4 leading-snug">
                {certif.nom}
              </h3>
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="inline-flex items-center rounded-md bg-primary text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide">
                  {codeLabel}
                </span>
                {certif.niveau ? (
                  <span className="inline-flex items-center rounded-md bg-white border border-border px-3 py-1.5 text-xs font-bold text-primary">
                    Niveau {certif.niveau}
                  </span>
                ) : null}
                {certif.category ? (
                  <span className="inline-flex items-center rounded-md bg-accent/15 text-accent px-3 py-1.5 text-xs font-bold">
                    {certif.category}
                  </span>
                ) : null}
              </div>
              <p className="text-content-muted text-sm md:text-base leading-relaxed mb-6">
                {isRs
                  ? 'Cette formation prépare à une certification inscrite au Répertoire spécifique (RS). Consultez la fiche officielle sur France Compétences.'
                  : 'Cette formation prépare au titre figurant au Répertoire National des Certifications Professionnelles. Consultez la fiche officielle sur France Compétences.'}
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-auto">
                <a
                  href={certif.lienFranceCompetence}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-orange text-center text-sm py-3 px-6 no-underline inline-block transition-transform hover:scale-[1.02]"
                >
                  Fiche France Compétences
                </a>
                <Link
                  to="/certification"
                  className="text-center text-sm py-3 px-6 border-2 border-primary text-primary font-bold uppercase tracking-wider rounded-sm no-underline hover:bg-primary hover:text-white transition-colors"
                >
                  Toutes nos certifications
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto text-center rounded-2xl border border-border bg-gray-50 px-8 py-12">
            <p className="text-content-muted text-base leading-relaxed mb-8">
              Alt Formations est certifié Qualiopi et propose des parcours menant à des certifications reconnues.
              Retrouvez l'ensemble des titres RNCP associés à nos formations sur la page dédiée.
            </p>
            <Link to="/certification" className="btn-orange inline-block text-sm py-3 px-8 no-underline uppercase font-bold tracking-wider">
              Découvrir nos certifications
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
