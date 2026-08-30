import { Link, useParams } from 'react-router-dom';
import FormulaireCandidature from '../components/Form/FormulaireCandidature';
import { useCareerOffer } from '../features/careers/hooks/useCareerOffer';

export default function CareerJobDetailPage() {
  const { slug } = useParams();
  const { offer, loading, error } = useCareerOffer(slug);

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-content-muted">
        Chargement de l&apos;offre…
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="font-heading text-2xl font-bold text-primary">Offre introuvable</h1>
        <p className="text-content-muted max-w-md">
          {error || "Cette offre n'existe pas ou n'est plus disponible."}
        </p>
        <Link to="/nous-rejoindre" className="btn-orange px-8 py-3 no-underline">
          Retour aux offres
        </Link>
      </div>
    );
  }

  const department = offer.department ?? 'collaborateur';

  return (
    <div className="bg-surface min-h-screen antialiased">
      <article className="max-w-container-lg mx-auto px-6 py-8 md:py-10">
        <h1 className="text-xl md:text-2xl font-extrabold text-primary uppercase tracking-wider mb-4">
          {offer.title}
        </h1>

        <div className="flex flex-wrap gap-3 text-xs md:text-sm text-content-muted mb-6 pb-4 border-b border-border">
          <span className="font-bold text-accent uppercase tracking-wider">{offer.contract_type}</span>
          <span>📍 {offer.location}</span>
          {offer.dateLabel ? <span>📅 Publié le {offer.dateLabel}</span> : null}
        </div>

        {offer.short_description ? (
          <p className="text-base text-content-muted leading-relaxed mb-6 font-medium">
            {offer.short_description}
          </p>
        ) : null}

        {offer.full_description ? (
          <div className="prose prose-sm md:prose-base max-w-none text-content-dark font-body leading-relaxed whitespace-pre-wrap mb-8">
            {offer.full_description}
          </div>
        ) : null}

        <div className="bg-white border border-border rounded-card p-4 md:p-5 shadow-sm">
          <h2 className="text-base font-extrabold text-primary uppercase tracking-wider mb-1">
            Intéressé(e) par ce poste ?
          </h2>
          <p className="text-content-muted text-sm mb-0">
            Complétez le formulaire ci-dessous pour nous transmettre votre candidature.
          </p>
        </div>
      </article>

      <FormulaireCandidature
        type={department}
        offerId={offer.source === 'api' ? offer.id : null}
        offerSlug={offer.slug}
        offerTitle={offer.title}
      />
    </div>
  );
}
