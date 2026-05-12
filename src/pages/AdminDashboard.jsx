import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminChatPanel from '../components/Chat/AdminChatPanel';

const TABS = [
  { id: 'overview', label: "Vue d'ensemble" },
  { id: 'chat', label: 'Conversations' },
  { id: 'contacts', label: 'Contacts' },
  { id: 'faq', label: 'Demandes FAQ' },
  { id: 'faq-public', label: 'FAQ publiée' },
  { id: 'users', label: 'Utilisateurs' },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('overview');

  return (
    <div className="min-h-screen bg-surface-soft">
      <header className="bg-primary text-white py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-accent font-bold">Tableau de bord admin</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">Bienvenue {user?.prenom}</h1>
          </div>
          <button
            onClick={logout}
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <nav className="flex flex-wrap gap-1 mb-6 bg-white border border-gray-200 rounded-xl p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
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
        {tab === 'contacts' && <ContactsTab />}
        {tab === 'faq' && <FaqRequestsTab />}
        {tab === 'faq-public' && <FaqPublicTab />}
        {tab === 'users' && <UsersTab />}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Overview tab
// ---------------------------------------------------------------------------
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

  const max = Math.max(1, ...days.map((d) => d.count));

  return (
    <div className="flex items-end gap-1 h-40">
      {days.map((d) => {
        const heightPct = (d.count / max) * 100;
        return (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
            <div className="text-[10px] text-content-muted">{d.count}</div>
            <div
              className="w-full bg-accent rounded-t"
              style={{ height: `${Math.max(heightPct, 2)}%` }}
              title={`${d.day} : ${d.count} visites`}
            />
            <div className="text-[10px] text-content-muted truncate w-full text-center">
              {d.day.slice(5)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Contacts tab
// ---------------------------------------------------------------------------
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
                    <div className="font-bold text-primary">{c.prenom} {c.nom}</div>
                    <a href={`mailto:${c.email}`} className="text-xs text-accent">{c.email}</a>
                    {c.telephone && <div className="text-xs text-content-muted">{c.telephone}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-content-dark">{c.sujet}</div>
                    <div className="text-xs text-content-muted line-clamp-2 max-w-md">{c.message}</div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      {c.status === 'pending' && (
                        <button onClick={() => setStatus(c.id, 'read')} className="text-xs font-bold text-blue-700 hover:underline text-left">
                          Marquer lu
                        </button>
                      )}
                      {c.status !== 'replied' && (
                        <button onClick={() => setStatus(c.id, 'replied')} className="text-xs font-bold text-green-700 hover:underline text-left">
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

// ---------------------------------------------------------------------------
// FAQ requests tab
// ---------------------------------------------------------------------------
function FaqRequestsTab() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [responseDraft, setResponseDraft] = useState('');
  const [publishDraft, setPublishDraft] = useState({ question: '', reponse: '', categorie: 'Général' });
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/faq/requests', { credentials: 'include' });
      const data = await res.json();
      if (data.success) setRequests(data.requests);
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
      categorie: 'Général',
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
        body: JSON.stringify(publishDraft),
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
                  onClick={() => openRequest(r)}
                  className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 ${
                    openId === r.id ? 'bg-amber-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-bold text-sm text-primary">{r.prenom} {r.nom}</span>
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="text-xs text-content-muted line-clamp-2">{r.question}</p>
                  <p className="text-[10px] text-content-muted mt-1">{new Date(r.created_at).toLocaleDateString('fr-FR')}</p>
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
                  <h4 className="font-bold text-primary">{open.prenom} {open.nom}</h4>
                  <a href={`mailto:${open.email}`} className="text-xs text-accent">{open.email}</a>
                </div>
                <StatusBadge status={open.status} />
              </div>
              <div className="bg-gray-50 border-l-4 border-accent p-3 text-sm">
                <strong className="block text-xs uppercase text-accent mb-1">Question</strong>
                {open.question}
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-gray-200 p-5">
              <h4 className="font-bold text-primary text-sm uppercase tracking-wider mb-3">1. Répondre à l'utilisateur</h4>
              <textarea
                value={responseDraft}
                onChange={(e) => setResponseDraft(e.target.value)}
                rows={4}
                placeholder="Votre réponse (visible dans l'espace de l'utilisateur)..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
              <button
                onClick={submitReply}
                disabled={busy || !responseDraft.trim()}
                className="mt-3 bg-accent hover:bg-accent-dark disabled:opacity-60 text-white font-bold px-5 py-2.5 rounded-lg text-sm"
              >
                Envoyer la réponse
              </button>
            </section>

            <section className="bg-white rounded-2xl border border-gray-200 p-5">
              <h4 className="font-bold text-primary text-sm uppercase tracking-wider mb-1">
                2. Publier dans la FAQ publique (optionnel)
              </h4>
              <p className="text-xs text-content-muted mb-3">
                Reformulez la question et la réponse pour un usage public. La réponse à l'utilisateur reste inchangée.
              </p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs uppercase tracking-wider text-content-muted font-bold">Catégorie</label>
                  <input
                    type="text"
                    value={publishDraft.categorie}
                    onChange={(e) => setPublishDraft({ ...publishDraft, categorie: e.target.value })}
                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  />
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

// ---------------------------------------------------------------------------
// Public FAQ management tab
// ---------------------------------------------------------------------------
function FaqPublicTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/faq/admin/list', { credentials: 'include' });
      const data = await res.json();
      if (data.success) setItems(data.items);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    if (!editing) return;
    await fetch(`/api/faq/admin/${editing.id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    });
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm('Supprimer cette entrée FAQ ?')) return;
    await fetch(`/api/faq/admin/${id}`, { method: 'DELETE', credentials: 'include' });
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
        <p className="p-4 text-content-muted text-sm">Aucune entrée. Publiez une demande FAQ depuis l'onglet précédent.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {items.map((it) => (
            <li key={it.id} className="p-4">
              {editing?.id === it.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editing.categorie}
                    onChange={(e) => setEditing({ ...editing, categorie: e.target.value })}
                    placeholder="Catégorie"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  />
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
                  <input
                    type="number"
                    value={editing.ordre}
                    onChange={(e) => setEditing({ ...editing, ordre: Number(e.target.value) })}
                    placeholder="Ordre"
                    className="w-32 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                  <div className="flex gap-2">
                    <button onClick={save} className="bg-accent hover:bg-accent-dark text-white font-bold px-4 py-2 rounded-lg text-sm">Enregistrer</button>
                    <button onClick={() => setEditing(null)} className="border border-gray-300 font-bold px-4 py-2 rounded-lg text-sm">Annuler</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-accent">{it.categorie}</span>
                      <h4 className="font-bold text-primary mt-1">{it.question}</h4>
                    </div>
                    <div className="flex gap-3 text-xs">
                      <button onClick={() => setEditing(it)} className="text-blue-700 font-bold hover:underline">Modifier</button>
                      <button onClick={() => remove(it.id)} className="text-red-700 font-bold hover:underline">Supprimer</button>
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

// ---------------------------------------------------------------------------
// Users tab
// ---------------------------------------------------------------------------
function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

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
        <h3 className="font-bold text-primary text-sm uppercase tracking-wider">Utilisateurs ({users.length})</h3>
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
                  <td className="px-4 py-3 font-bold text-primary">{u.prenom} {u.nom}</td>
                  <td className="px-4 py-3"><a href={`mailto:${u.email}`} className="text-accent text-xs">{u.email}</a></td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                      u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-content-muted">{new Date(u.created_at).toLocaleDateString('fr-FR')}</td>
                  <td className="px-4 py-3 text-xs text-content-muted">
                    {u.contacts_count} contacts · {u.faq_count} questions
                  </td>
                  <td className="px-4 py-3">
                    {u.id !== currentUser?.id && (
                      u.role === 'user' ? (
                        <button onClick={() => setRole(u.id, 'admin')} className="text-xs font-bold text-purple-700 hover:underline">Promouvoir admin</button>
                      ) : (
                        <button onClick={() => setRole(u.id, 'user')} className="text-xs font-bold text-gray-700 hover:underline">Rétrograder</button>
                      )
                    )}
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

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------
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
