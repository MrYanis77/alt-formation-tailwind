import { useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import AdminChatPanel from '../components/Chat/AdminChatPanel';

const TAB_DEF = [
  { id: 'overview', label: "Vue d'ensemble", roles: ['superadmin', 'admin', 'editor'] },
  { id: 'chat', label: 'Contacts (chat)', roles: ['superadmin', 'admin', 'editor'] },
  { id: 'chatbot', label: 'Chatbot', roles: ['superadmin', 'admin', 'editor'] },
  { id: 'contacts', label: 'Contacts', roles: ['superadmin', 'admin', 'editor'] },
  { id: 'faq', label: 'Demandes FAQ', roles: ['superadmin', 'admin', 'editor'] },
  { id: 'faq-public', label: 'FAQ publique', roles: ['superadmin', 'admin', 'editor'] },
  { id: 'blog', label: 'Blog', roles: ['superadmin', 'admin', 'editor'] },
  { id: 'newsletter', label: 'Newsletter', roles: ['superadmin', 'admin', 'editor'] },
  { id: 'users', label: 'Utilisateurs site', roles: ['superadmin', 'admin'] },
  { id: 'admins', label: 'Administrateurs', roles: ['superadmin'] },
];

export default function AdminDashboard() {
  const { admin, loading, login, logout } = useAdminAuth();
  const [tab, setTab] = useState('overview');
  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');
  const [loginErr, setLoginErr] = useState('');
  const [busy, setBusy] = useState(false);

  const tabs = useMemo(
    () => TAB_DEF.filter((t) => admin && t.roles.includes(admin.role)),
    [admin]
  );

  useEffect(() => {
    if (!admin || tabs.some((t) => t.id === tab)) return;
    setTab(tabs[0]?.id || 'overview');
  }, [admin, tabs, tab]);

  const submitLogin = async (e) => {
    e.preventDefault();
    setLoginErr('');
    setBusy(true);
    try {
      await login(loginId.trim(), loginPw);
      setLoginPw('');
    } catch (err) {
      setLoginErr(err.message || 'Connexion impossible');
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-soft flex items-center justify-center text-content-muted text-sm">
        Chargement…
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="min-h-screen bg-surface-soft flex items-center justify-center px-4">
        <form
          onSubmit={submitLogin}
          className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-4"
        >
          <div>
            <p className="text-xs uppercase tracking-widest text-accent font-bold">Back-office</p>
            <h1 className="text-2xl font-extrabold text-primary mt-1">Connexion administrateur</h1>
            <p className="text-xs text-content-muted mt-2">
              Compte distinct des utilisateurs du site (<code className="text-[11px]">admin_users</code>).
            </p>
          </div>
          {loginErr && <p className="text-red-600 text-sm font-semibold">{loginErr}</p>}
          <div>
            <label className="text-xs font-bold text-content-muted uppercase">Identifiant ou e-mail</label>
            <input
              type="text"
              autoComplete="username"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-content-muted uppercase">Mot de passe</label>
            <input
              type="password"
              autoComplete="current-password"
              value={loginPw}
              onChange={(e) => setLoginPw(e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
          <button
            type="submit"
            disabled={busy || !loginId.trim() || !loginPw}
            className="w-full bg-accent hover:bg-accent-dark disabled:opacity-50 text-white font-bold py-2.5 rounded-lg text-sm"
          >
            {busy ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-soft">
      <header className="bg-primary text-white py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-accent font-bold">Tableau de bord admin</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
              {admin.username}
              <span className="block text-sm font-normal opacity-90 mt-1">{admin.email}</span>
            </h1>
            <p className="text-[11px] uppercase tracking-wider mt-2 opacity-80">
              Rôle : {admin.role}
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <nav className="flex flex-wrap gap-1 mb-6 bg-white border border-gray-200 rounded-xl p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
                tab === t.id ? 'bg-accent text-white' : 'text-content-muted hover:text-primary'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {tab === 'overview' && <OverviewTab />}
        {tab === 'chat' && <AdminChatPanel />}
        {tab === 'chatbot' && <ChatbotTab />}
        {tab === 'contacts' && <ContactsTab />}
        {tab === 'faq' && <FaqRequestsTab />}
        {tab === 'faq-public' && <FaqPublicTab />}
        {tab === 'blog' && <BlogTab />}
        {tab === 'newsletter' && <NewsletterTab />}
        {tab === 'users' && <UsersTab />}
        {tab === 'admins' && <AdminUsersTab />}
      </div>
    </div>
  );
}

function OverviewTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setStats(data.stats);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-content-muted text-sm">Chargement...</p>;
  if (!stats) return <p className="text-red-600 text-sm">Erreur de chargement.</p>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Visites (7 jours)" value={stats.visits7d} hint={`${stats.visits30d} sur 30 jours`} />
        <StatCard label="Nouveaux utilisateurs (7j)" value={stats.newUsers7d} hint={`${stats.totalUsers} au total`} />
        <StatCard label="Contacts en attente" value={stats.pendingContacts} hint={`${stats.totalContacts} au total`} />
        <StatCard label="Questions FAQ en attente" value={stats.pendingFaq} hint={`${stats.totalFaq} au total`} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Newsletter confirmés" value={stats.newsletterConfirmed} hint="Abonnés opt-in" />
        <StatCard label="Articles publiés" value={stats.blogPublished} hint={`${stats.blogDraft} brouillon(s)`} />
        <StatCard label="Chatbot ouverts" value={stats.chatbotOpen} hint="Conversations actives" />
        <StatCard label="Campagnes envoyées" value={stats.campaignsSent} hint="Historique emailing" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-bold text-primary text-sm uppercase tracking-wider mb-4">Visites des 14 derniers jours</h3>
        <VisitChart data={stats.visitsDaily} />
      </div>
    </div>
  );
}

function StatCard({ label, value, hint }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <div className="text-xs uppercase tracking-wider text-content-muted font-bold">{label}</div>
      <div className="text-3xl font-extrabold text-primary mt-2">{value}</div>
      {hint && <div className="text-xs text-content-muted mt-1">{hint}</div>}
    </div>
  );
}

function VisitChart({ data }) {
  const days = [];
  const map = new Map();
  data.forEach((d) => {
    const key = String(d.day).slice(0, 10);
    map.set(key, d.count);
  });

  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ day: key, count: map.get(key) || 0 });
  }

  const max = Math.max(1, ...days.map((x) => x.count));

  return (
    <div className="flex items-end gap-1 h-40">
      {days.map((x) => {
        const heightPct = (x.count / max) * 100;
        return (
          <div key={x.day} className="flex-1 flex flex-col items-center gap-1">
            <div className="text-[10px] text-content-muted">{x.count}</div>
            <div
              className="w-full bg-accent rounded-t"
              style={{ height: `${Math.max(heightPct, 2)}%` }}
              title={`${x.day} : ${x.count} visites`}
            />
            <div className="text-[10px] text-content-muted truncate w-full text-center">{x.day.slice(5)}</div>
          </div>
        );
      })}
    </div>
  );
}

function ContactsTab() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const url = filter ? `/api/admin/contacts?status=${filter}` : '/api/admin/contacts';
      const res = await fetch(url, { credentials: 'include' });
      const data = await res.json();
      if (data.success) setContacts(data.contacts);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (id, status) => {
    await fetch(`/api/admin/contacts/${id}/status`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    load();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex flex-wrap gap-2 items-center">
        <h3 className="font-bold text-primary text-sm uppercase tracking-wider mr-auto">
          Messages reçus ({contacts.length})
        </h3>
        {[
          { id: '', label: 'Tous' },
          { id: 'pending', label: 'En attente' },
          { id: 'read', label: 'Lus' },
          { id: 'replied', label: 'Répondus' },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`text-xs font-bold px-3 py-1.5 rounded ${filter === f.id ? 'bg-accent text-white' : 'bg-gray-100 text-content-muted hover:bg-gray-200'}`}
          >
            {f.label}
          </button>
        ))}
      </div>
      {loading ? (
        <p className="p-4 text-content-muted text-sm">Chargement...</p>
      ) : contacts.length === 0 ? (
        <p className="p-4 text-content-muted text-sm">Aucun message.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-xs uppercase text-content-muted">Date</th>
                <th className="px-4 py-3 text-left font-bold text-xs uppercase text-content-muted">Contact</th>
                <th className="px-4 py-3 text-left font-bold text-xs uppercase text-content-muted">Sujet</th>
                <th className="px-4 py-3 text-left font-bold text-xs uppercase text-content-muted">Statut</th>
                <th className="px-4 py-3 text-left font-bold text-xs uppercase text-content-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-xs text-content-muted whitespace-nowrap">
                    {new Date(c.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-primary">
                      {c.prenom} {c.nom}
                    </div>
                    <a href={`mailto:${c.email}`} className="text-xs text-accent">
                      {c.email}
                    </a>
                    {c.telephone && <div className="text-xs text-content-muted">{c.telephone}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-content-dark">{c.sujet}</div>
                    <div className="text-xs text-content-muted line-clamp-2 max-w-md">{c.message}</div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      {c.status === 'pending' && (
                        <button
                          type="button"
                          onClick={() => setStatus(c.id, 'read')}
                          className="text-xs font-bold text-blue-700 hover:underline text-left"
                        >
                          Marquer lu
                        </button>
                      )}
                      {c.status !== 'replied' && (
                        <button
                          type="button"
                          onClick={() => setStatus(c.id, 'replied')}
                          className="text-xs font-bold text-green-700 hover:underline text-left"
                        >
                          Marquer répondu
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function FaqRequestsTab() {
  const [requests, setRequests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [responseDraft, setResponseDraft] = useState('');
  const [publishDraft, setPublishDraft] = useState({
    question: '',
    reponse: '',
    category_slug: 'formations',
  });
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [rRes, cRes] = await Promise.all([
        fetch('/api/faq/requests', { credentials: 'include' }),
        fetch('/api/faq/admin/categories', { credentials: 'include' }),
      ]);
      const rData = await rRes.json();
      const cData = await cRes.json();
      if (rData.success) setRequests(rData.requests);
      if (cData.success) setCategories(cData.categories.filter((x) => x.is_active));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openRequest = (req) => {
    setOpenId(req.id);
    setResponseDraft(req.admin_response || '');
    setPublishDraft({
      question: req.published_question || req.question,
      reponse: req.published_response || req.admin_response || '',
      category_slug: categories[0]?.slug || 'formations',
    });
  };

  const submitReply = async () => {
    if (!responseDraft.trim() || !openId) return;
    setBusy(true);
    try {
      await fetch(`/api/faq/requests/${openId}/reply`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response: responseDraft.trim() }),
      });
      load();
    } finally {
      setBusy(false);
    }
  };

  const submitPublish = async () => {
    if (!publishDraft.question.trim() || !publishDraft.reponse.trim() || !openId) return;
    setBusy(true);
    try {
      await fetch(`/api/faq/requests/${openId}/publish`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: publishDraft.question.trim(),
          reponse: publishDraft.reponse.trim(),
          category_slug: publishDraft.category_slug,
        }),
      });
      load();
    } finally {
      setBusy(false);
    }
  };

  const open = requests.find((r) => r.id === openId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-4">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-bold text-primary text-sm uppercase tracking-wider">Demandes FAQ ({requests.length})</h3>
        </div>
        {loading ? (
          <p className="p-4 text-content-muted text-sm">Chargement...</p>
        ) : requests.length === 0 ? (
          <p className="p-4 text-content-muted text-sm">Aucune demande.</p>
        ) : (
          <ul className="max-h-[640px] overflow-y-auto">
            {requests.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => openRequest(r)}
                  className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 ${
                    openId === r.id ? 'bg-amber-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-bold text-sm text-primary">
                      {r.prenom} {r.nom}
                    </span>
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="text-xs text-content-muted line-clamp-2">{r.question}</p>
                  <p className="text-[10px] text-content-muted mt-1">
                    {new Date(r.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-4">
        {!open ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-content-muted text-sm">
            Sélectionnez une demande pour la traiter.
          </div>
        ) : (
          <>
            <section className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h4 className="font-bold text-primary">
                    {open.prenom} {open.nom}
                  </h4>
                  <a href={`mailto:${open.email}`} className="text-xs text-accent">
                    {open.email}
                  </a>
                </div>
                <StatusBadge status={open.status} />
              </div>
              <div className="bg-gray-50 border-l-4 border-accent p-3 text-sm">
                <strong className="block text-xs uppercase text-accent mb-1">Question</strong>
                {open.question}
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-gray-200 p-5">
              <h4 className="font-bold text-primary text-sm uppercase tracking-wider mb-3">1. Répondre à l&apos;utilisateur</h4>
              <textarea
                value={responseDraft}
                onChange={(e) => setResponseDraft(e.target.value)}
                rows={4}
                placeholder="Votre réponse..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
              <button
                type="button"
                onClick={submitReply}
                disabled={busy || !responseDraft.trim()}
                className="mt-3 bg-accent hover:bg-accent-dark disabled:opacity-60 text-white font-bold px-5 py-2.5 rounded-lg text-sm"
              >
                Envoyer la réponse
              </button>
            </section>

            <section className="bg-white rounded-2xl border border-gray-200 p-5">
              <h4 className="font-bold text-primary text-sm uppercase tracking-wider mb-1">
                2. Publier dans la FAQ publique (faq_items)
              </h4>
              <p className="text-xs text-content-muted mb-3">Choisissez une rubrique existante.</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs uppercase tracking-wider text-content-muted font-bold">Rubrique</label>
                  <select
                    value={publishDraft.category_slug}
                    onChange={(e) => setPublishDraft({ ...publishDraft, category_slug: e.target.value })}
                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-content-muted font-bold">Question (publique)</label>
                  <textarea
                    value={publishDraft.question}
                    onChange={(e) => setPublishDraft({ ...publishDraft, question: e.target.value })}
                    rows={2}
                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-content-muted font-bold">Réponse (publique)</label>
                  <textarea
                    value={publishDraft.reponse}
                    onChange={(e) => setPublishDraft({ ...publishDraft, reponse: e.target.value })}
                    rows={4}
                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={submitPublish}
                disabled={busy || !publishDraft.question.trim() || !publishDraft.reponse.trim()}
                className="mt-3 bg-primary hover:bg-primary-light disabled:opacity-60 text-white font-bold px-5 py-2.5 rounded-lg text-sm"
              >
                Publier dans la FAQ
              </button>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function FaqPublicTab() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cRes, iRes] = await Promise.all([
        fetch('/api/faq/admin/categories', { credentials: 'include' }),
        fetch('/api/faq/admin/items', { credentials: 'include' }),
      ]);
      const cData = await cRes.json();
      const iData = await iRes.json();
      if (cData.success) setCategories(cData.categories);
      if (iData.success) setItems(iData.items);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    if (!editing) return;
    await fetch(`/api/faq/admin/items/${editing.id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category_id: editing.category_id,
        question: editing.question,
        reponse: editing.reponse,
        ordre: editing.ordre,
        is_active: editing.is_active !== false,
      }),
    });
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm('Supprimer cette entrée FAQ ?')) return;
    await fetch(`/api/faq/admin/items/${id}`, { method: 'DELETE', credentials: 'include' });
    load();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-bold text-primary text-sm uppercase tracking-wider">FAQ publique ({items.length})</h3>
      </div>
      {loading ? (
        <p className="p-4 text-content-muted text-sm">Chargement...</p>
      ) : items.length === 0 ? (
        <p className="p-4 text-content-muted text-sm">Aucune entrée dans faq_items.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {items.map((it) => (
            <li key={it.id} className="p-4">
              {editing?.id === it.id ? (
                <div className="space-y-3">
                  <select
                    value={editing.category_id}
                    onChange={(e) => setEditing({ ...editing, category_id: Number(e.target.value) })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <textarea
                    value={editing.question}
                    onChange={(e) => setEditing({ ...editing, question: e.target.value })}
                    rows={2}
                    placeholder="Question"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                  <textarea
                    value={editing.reponse}
                    onChange={(e) => setEditing({ ...editing, reponse: e.target.value })}
                    rows={4}
                    placeholder="Réponse"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={editing.is_active !== false}
                      onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                    />
                    Actif
                  </label>
                  <input
                    type="number"
                    value={editing.ordre}
                    onChange={(e) => setEditing({ ...editing, ordre: Number(e.target.value) })}
                    placeholder="Ordre"
                    className="w-32 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={save}
                      className="bg-accent hover:bg-accent-dark text-white font-bold px-4 py-2 rounded-lg text-sm"
                    >
                      Enregistrer
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(null)}
                      className="border border-gray-300 font-bold px-4 py-2 rounded-lg text-sm"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-accent">{it.categorie}</span>
                      <h4 className="font-bold text-primary mt-1">{it.question}</h4>
                      {!it.is_active && (
                        <span className="text-[10px] font-bold text-amber-700">Masqué</span>
                      )}
                    </div>
                    <div className="flex gap-3 text-xs">
                      <button
                        type="button"
                        onClick={() =>
                          setEditing({
                            ...it,
                            ordre: it.ordre,
                            is_active: it.is_active !== 0 && it.is_active !== false,
                          })
                        }
                        className="text-blue-700 font-bold hover:underline"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(it.id)}
                        className="text-red-700 font-bold hover:underline"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-content-muted whitespace-pre-wrap">{it.reponse}</p>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: siteUser } = useAuth();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users', { credentials: 'include' });
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setRole = async (id, role) => {
    await fetch(`/api/admin/users/${id}/role`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    load();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-bold text-primary text-sm uppercase tracking-wider">Utilisateurs site ({users.length})</h3>
      </div>
      {loading ? (
        <p className="p-4 text-content-muted text-sm">Chargement...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-xs uppercase text-content-muted">Utilisateur</th>
                <th className="px-4 py-3 text-left font-bold text-xs uppercase text-content-muted">Email</th>
                <th className="px-4 py-3 text-left font-bold text-xs uppercase text-content-muted">Rôle</th>
                <th className="px-4 py-3 text-left font-bold text-xs uppercase text-content-muted">Inscrit</th>
                <th className="px-4 py-3 text-left font-bold text-xs uppercase text-content-muted">Activité</th>
                <th className="px-4 py-3 text-left font-bold text-xs uppercase text-content-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-bold text-primary">
                    {u.prenom} {u.nom}
                  </td>
                  <td className="px-4 py-3">
                    <a href={`mailto:${u.email}`} className="text-accent text-xs">
                      {u.email}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-content-muted">
                    {new Date(u.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3 text-xs text-content-muted">
                    {u.contacts_count} contacts · {u.faq_count} questions
                  </td>
                  <td className="px-4 py-3">
                    {u.id !== siteUser?.id &&
                      (u.role === 'user' ? (
                        <button
                          type="button"
                          onClick={() => setRole(u.id, 'admin')}
                          className="text-xs font-bold text-purple-700 hover:underline"
                        >
                          Promouvoir admin site
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setRole(u.id, 'user')}
                          className="text-xs font-bold text-gray-700 hover:underline"
                        >
                          Rétrograder
                        </button>
                      ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function BlogTab() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([
        fetch('/api/admin/blog/posts', { credentials: 'include' }),
        fetch('/api/admin/blog/categories', { credentials: 'include' }),
      ]);
      const pj = await p.json();
      const cj = await c.json();
      if (pj.success) setPosts(pj.posts);
      if (cj.success) setCategories(cj.categories);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const patchStatus = async (id, status) => {
    await fetch(`/api/admin/blog/posts/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    load();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-bold text-primary text-sm uppercase tracking-wider">Articles ({posts.length})</h3>
      </div>
      {loading ? (
        <p className="p-4 text-sm text-content-muted">Chargement…</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs uppercase font-bold text-content-muted">Titre</th>
                <th className="px-4 py-3 text-left text-xs uppercase font-bold text-content-muted">Catégorie</th>
                <th className="px-4 py-3 text-left text-xs uppercase font-bold text-content-muted">Statut</th>
                <th className="px-4 py-3 text-left text-xs uppercase font-bold text-content-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-primary">{p.title}</td>
                  <td className="px-4 py-3 text-xs">{p.category_label}</td>
                  <td className="px-4 py-3 text-xs uppercase font-bold">{p.status}</td>
                  <td className="px-4 py-3 flex flex-wrap gap-2">
                    {p.status !== 'published' && (
                      <button
                        type="button"
                        onClick={() => patchStatus(p.id, 'published')}
                        className="text-xs font-bold text-green-700 hover:underline"
                      >
                        Publier
                      </button>
                    )}
                    {p.status !== 'draft' && (
                      <button
                        type="button"
                        onClick={() => patchStatus(p.id, 'draft')}
                        className="text-xs font-bold text-gray-700 hover:underline"
                      >
                        Brouillon
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="p-4 text-[11px] text-content-muted">
        Catégories disponibles : {categories.map((c) => c.slug).join(', ')}
      </p>
    </div>
  );
}

function NewsletterTab() {
  const [subscribers, setSubscribers] = useState([]);
  const [lists, setLists] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, l, c] = await Promise.all([
        fetch('/api/admin/newsletter/subscribers', { credentials: 'include' }),
        fetch('/api/admin/newsletter/lists', { credentials: 'include' }),
        fetch('/api/admin/newsletter/campaigns', { credentials: 'include' }),
      ]);
      const [sj, lj, cj] = await Promise.all([s.json(), l.json(), c.json()]);
      if (sj.success) setSubscribers(sj.subscribers);
      if (lj.success) setLists(lj.lists);
      if (cj.success) setCampaigns(cj.campaigns);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <h3 className="font-bold text-primary text-sm uppercase tracking-wider mb-3">
          Abonnés ({subscribers.length})
        </h3>
        {loading ? (
          <p className="text-sm text-content-muted">Chargement…</p>
        ) : (
          <div className="overflow-x-auto max-h-64 overflow-y-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-content-muted">
                  <th className="py-2">Email</th>
                  <th className="py-2">Confirmé</th>
                  <th className="py-2">Inscription</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.slice(0, 80).map((s) => (
                  <tr key={s.id} className="border-t border-gray-100">
                    <td className="py-2">{s.email}</td>
                    <td className="py-2">{s.is_confirmed ? 'oui' : 'non'}</td>
                    <td className="py-2">{new Date(s.subscribed_at).toLocaleDateString('fr-FR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <h3 className="font-bold text-primary text-sm uppercase tracking-wider mb-3">Listes</h3>
        <ul className="text-sm space-y-2">
          {lists.map((li) => (
            <li key={li.id} className="border-b border-gray-100 pb-2">
              <strong>{li.name}</strong>
              <span className="text-content-muted text-xs block">{li.description}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <h3 className="font-bold text-primary text-sm uppercase tracking-wider mb-3">Campagnes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-content-muted">
                <th className="py-2">Sujet</th>
                <th className="py-2">Statut</th>
                <th className="py-2">Ouverts %</th>
                <th className="py-2">Clics %</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} className="border-t border-gray-100">
                  <td className="py-2">{c.subject}</td>
                  <td className="py-2">{c.status}</td>
                  <td className="py-2">{c.stat_open_rate_pct ?? '—'}</td>
                  <td className="py-2">{c.stat_click_rate_pct ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function ChatbotTab() {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [active, setActive] = useState(null);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);

  const loadConv = useCallback(async () => {
    const res = await fetch('/api/admin/chatbot/conversations', { credentials: 'include' });
    const data = await res.json();
    if (data.success) setConversations(data.conversations);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadConv();
    const id = setInterval(loadConv, 20000);
    return () => clearInterval(id);
  }, [loadConv]);

  const openConv = async (c) => {
    setActive(c);
    const res = await fetch(`/api/admin/chatbot/conversations/${c.id}/messages`, {
      credentials: 'include',
    });
    const data = await res.json();
    if (data.success) setMessages(data.messages);
  };

  const send = async () => {
    if (!active || !draft.trim()) return;
    await fetch(`/api/admin/chatbot/conversations/${active.id}/messages`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: draft.trim() }),
    });
    setDraft('');
    openConv(active);
    loadConv();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-4 min-h-[520px]">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 font-bold text-primary text-sm uppercase tracking-wider">
          Conversations chatbot
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading && <p className="p-4 text-sm text-content-muted">Chargement…</p>}
          {!loading &&
            conversations.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => openConv(c)}
                className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 ${active?.id === c.id ? 'bg-amber-50' : ''}`}
              >
                <div className="text-xs font-bold text-primary truncate">{c.user_email || c.session_id}</div>
                <div className="text-[11px] text-content-muted truncate">{c.last_message}</div>
                <div className="text-[10px] uppercase mt-1">{c.status}</div>
              </button>
            ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col">
        {!active ? (
          <p className="text-sm text-content-muted m-auto">Sélectionnez une conversation.</p>
        ) : (
          <>
            <div className="border-b border-gray-100 pb-3 mb-3">
              <h4 className="font-bold text-primary text-sm">{active.user_name || 'Visiteur'}</h4>
              <p className="text-xs text-content-muted">{active.user_email}</p>
              <p className="text-[10px] text-content-muted mt-1 font-mono">{active.session_id}</p>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 max-h-[380px] mb-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`text-sm rounded-lg px-3 py-2 max-w-[90%] ${
                    m.sender === 'admin'
                      ? 'bg-accent text-white ml-auto'
                      : m.sender === 'bot'
                        ? 'bg-gray-100 text-content-dark'
                        : 'border border-gray-200'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold opacity-70">{m.sender}</span>
                  <p className="whitespace-pre-wrap">{m.message}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={2}
                placeholder="Réponse administrateur…"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={send}
                className="bg-primary text-white font-bold px-4 rounded-lg text-sm self-end"
              >
                Envoyer
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function AdminUsersTab() {
  const { admin: currentAdmin } = useAdminAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/admin-users', { credentials: 'include' });
      const data = await res.json();
      if (data.success) setAdmins(data.admins);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const patchAdmin = async (id, body) => {
    await fetch(`/api/admin/admin-users/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    load();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-bold text-primary text-sm uppercase tracking-wider">Comptes admin_users</h3>
      </div>
      {loading ? (
        <p className="p-4 text-sm text-content-muted">Chargement…</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs uppercase font-bold text-content-muted">User</th>
                <th className="px-4 py-3 text-left text-xs uppercase font-bold text-content-muted">Email</th>
                <th className="px-4 py-3 text-left text-xs uppercase font-bold text-content-muted">Rôle</th>
                <th className="px-4 py-3 text-left text-xs uppercase font-bold text-content-muted">Actif</th>
                <th className="px-4 py-3 text-left text-xs uppercase font-bold text-content-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => (
                <tr key={a.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-bold">{a.username}</td>
                  <td className="px-4 py-3 text-xs">{a.email}</td>
                  <td className="px-4 py-3">
                    <select
                      defaultValue={a.role}
                      disabled={a.id === currentAdmin.id}
                      onChange={(e) => patchAdmin(a.id, { role: e.target.value })}
                      className="border border-gray-200 rounded px-2 py-1 text-xs"
                    >
                      <option value="editor">editor</option>
                      <option value="admin">admin</option>
                      <option value="superadmin">superadmin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      disabled={a.id === currentAdmin.id}
                      onClick={() => patchAdmin(a.id, { is_active: !(a.is_active === 1 || a.is_active === true) })}
                      className="text-xs font-bold text-accent hover:underline disabled:opacity-40"
                    >
                      {a.is_active ? 'Désactiver' : 'Activer'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-xs text-content-muted">
                    Dernière connexion :{' '}
                    {a.last_login ? new Date(a.last_login).toLocaleString('fr-FR') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending: { label: 'En attente', className: 'bg-amber-100 text-amber-800' },
    read: { label: 'Lu', className: 'bg-blue-100 text-blue-800' },
    replied: { label: 'Répondu', className: 'bg-green-100 text-green-800' },
    published: { label: 'Publié', className: 'bg-purple-100 text-purple-800' },
  };
  const cfg = map[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${cfg.className} whitespace-nowrap`}>
      {cfg.label}
    </span>
  );
}
