import CardFormation from './Card/CardFormation';
import { usePublicFormations } from '../features/formations/hooks/usePublicFormations';

export default function FormationsBddSection({ showRaw = false }) {
  const { courses, categories, loading, error, site } = usePublicFormations();

  if (loading) {
    return (
      <section className="rounded-2xl border border-border bg-white p-6 md:p-8">
        <p className="text-content-muted text-sm">Chargement des formations depuis la base Ionos…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 md:p-8 text-red-800 text-sm">
        <strong>Erreur BDD :</strong> {error}
        <p className="mt-2 text-xs">
          Vérifiez <a href="/api/health.php" className="underline font-semibold" target="_blank" rel="noreferrer">/api/health.php</a>
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border bg-white p-6 md:p-8 shadow-sm">
      <div className="mb-6">
        <p className="text-xs font-extrabold text-accent uppercase tracking-widest mb-1">
          Base de données{site?.name ? ` — ${site.name}` : ''}
        </p>
        <h2 className="font-heading text-xl md:text-2xl font-extrabold text-primary">
          Formations ({courses.length})
        </h2>
      </div>

      {courses.length === 0 ? (
        <p className="text-content-muted text-sm">Aucune formation dans la base pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CardFormation
              key={course.slug}
              title={course.title}
              image={course.image}
              href={course.href}
              typeBadge={course.typeBadge}
              compact
            />
          ))}
        </div>
      )}

      {showRaw && categories.length > 0 ? (
        <pre className="mt-6 text-xs overflow-auto max-h-64 bg-surface-soft rounded-lg p-4">
          {JSON.stringify({ categories, courses }, null, 2)}
        </pre>
      ) : null}
    </section>
  );
}
