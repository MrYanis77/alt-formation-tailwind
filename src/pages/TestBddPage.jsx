import { useCallback, useEffect, useState } from 'react';

async function fetchApiJson(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let res;
  try {
    res = await fetch(url, { signal: controller.signal });
  } catch (err) {
    if (err?.name === 'AbortError') {
      throw new Error(
        `Délai dépassé (${timeoutMs / 1000}s). Le serveur PHP ne répond pas — vérifiez api/config/.env (DB_HOST) sur le FTP et testez /test-connexion.php.`
      );
    }
    throw new Error(
      'Serveur PHP inaccessible. Relancez npm run dev:local (Vite + PHP port 8000) ou vérifiez le dossier api/ sur le FTP Ionos.'
    );
  } finally {
    clearTimeout(timer);
  }
  const text = await res.text();
  if (!text.trim()) {
    throw new Error(
      'Réponse vide du serveur. Lancez npm run dev:local (PHP + Vite) ou vérifiez api/ sur le FTP Ionos.'
    );
  }
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Réponse non-JSON : ${text.slice(0, 280)}`);
  }
  if (!res.ok || !json.ok) {
    const parts = [json.error, json.hint].filter(Boolean);
    const err = new Error(parts.join(' — ') || `HTTP ${res.status}`);
    err.diagnostics = json.diagnostics;
    throw err;
  }
  return json;
}

function CountBadge({ label, value }) {
  if (value === undefined) return null;
  return (
    <span className="inline-flex items-center rounded-full bg-primary text-white px-3 py-1 text-xs font-bold">
      {label} : {value}
    </span>
  );
}

function Section({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left font-heading font-bold text-primary hover:bg-surface-soft transition-colors"
      >
        {title}
        <span className="text-accent text-sm">{open ? '−' : '+'}</span>
      </button>
      {open ? <div className="px-5 pb-5 border-t border-border">{children}</div> : null}
    </div>
  );
}

export default function TestBddPage() {
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState('');
  const [diagnostics, setDiagnostics] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    setLoading(true);
    setError('');
    setDiagnostics(null);

    return fetchApiJson('/api/test-data.php?all=1')
      .then((json) => setPayload(json))
      .catch((err) => {
        setPayload(null);
        setError(err.message || 'Erreur inconnue');
        if (err.diagnostics) setDiagnostics(err.diagnostics);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = setTimeout(loadData, 0);
    return () => clearTimeout(timer);
  }, [loadData]);

  const d = payload?.data ?? {};
  const courses = d.formation_courses ?? [];

  return (
    <div className="min-h-screen bg-surface-soft py-10 px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold text-accent uppercase tracking-widest mb-2">Diagnostic</p>
            <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-primary">
              Test BDD Nexytal — Alt Formation
            </h1>
            <p className="text-content-muted text-sm mt-2 font-body">
              Site <strong>core_sites.id = {payload?.site_id ?? 1}</strong>
              {payload?.site?.name ? ` (${payload.site.name})` : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="btn-orange text-sm px-4 py-2 disabled:opacity-50"
          >
            {loading ? 'Chargement…' : 'Actualiser'}
          </button>
        </header>

        <p className="text-content-muted text-sm">
          <a href="/api/health.php" className="text-accent font-semibold hover:underline" target="_blank" rel="noreferrer">
            health
          </a>
          {' · '}
          <a href="/api/test-data.php?all=1" className="text-accent font-semibold hover:underline" target="_blank" rel="noreferrer">
            JSON brut
          </a>
        </p>

        {loading ? <p className="text-content-muted text-sm">Connexion à la base…</p> : null}

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 px-5 py-4 text-sm">
            <strong>Erreur :</strong> {error}
            <p className="mt-2 text-xs opacity-90">
              <strong>Ionos (prod)</strong> : testez d&apos;abord{' '}
              <a href="/test-connexion.php" className="underline font-semibold" target="_blank" rel="noreferrer">
                /test-connexion.php
              </a>
              . <code className="bg-red-100 px-1 rounded">DB_HOST</code> ={' '}
              <code className="bg-red-100 px-1 rounded">127.0.0.1</code> ou{' '}
              <code className="bg-red-100 px-1 rounded">db….hosting-data.io</code> (copié depuis Ionos).
              <br />
              <strong>Local (XAMPP)</strong> : <code className="bg-red-100 px-1 rounded">USE_LOCAL_ENV=1</code> +{' '}
              <code className="bg-red-100 px-1 rounded">.env.local</code> + MySQL XAMPP démarré.
            </p>
            {diagnostics ? (
              <pre className="mt-3 text-xs overflow-auto max-h-48 bg-red-100/50 rounded p-3">
                {JSON.stringify(diagnostics, null, 2)}
              </pre>
            ) : null}
          </div>
        ) : null}

        {payload ? (
          <>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="font-bold text-sm text-green-700">Connexion OK</span>
              <span className="text-content-muted text-sm">
                — {payload.db} @ {payload.host}
              </span>
              {payload.env ? (
                <span className="text-content-muted text-xs">env: {payload.env}</span>
              ) : null}
              <CountBadge label="formations" value={payload.counts?.formation_courses} />
              <CountBadge label="articles blog" value={payload.counts?.blog_posts} />
              <CountBadge label="abonnés newsletter" value={payload.counts?.newsletter_subscribers} />
            </div>

            {payload.tables_found?.length ? (
              <p className="text-xs text-content-muted">
                Tables : {payload.tables_found.join(', ')}
              </p>
            ) : null}

            <div className="space-y-3">
              <Section title={`Formations (${courses.length})`} defaultOpen>
                <pre className="text-xs overflow-auto max-h-96 bg-surface-soft rounded-lg p-4 mt-3">
                  {JSON.stringify({ categories: d.formation_categories, courses }, null, 2)}
                </pre>
              </Section>

              <Section title={`Blog (${d.blog_posts?.length ?? 0} articles)`}>
                <pre className="text-xs overflow-auto max-h-96 bg-surface-soft rounded-lg p-4 mt-3">
                  {JSON.stringify(
                    {
                      categories: d.blog_categories,
                      authors: d.blog_authors,
                      posts: d.blog_posts,
                      comments: d.blog_comments,
                      tags: d.blog_tags,
                    },
                    null,
                    2
                  )}
                </pre>
              </Section>

              <Section title={`Newsletter (${d.newsletter_subscribers?.length ?? 0} abonnés)`}>
                <pre className="text-xs overflow-auto max-h-96 bg-surface-soft rounded-lg p-4 mt-3">
                  {JSON.stringify(
                    {
                      subscribers: d.newsletter_subscribers,
                      email_logs: d.newsletter_email_logs,
                    },
                    null,
                    2
                  )}
                </pre>
              </Section>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
