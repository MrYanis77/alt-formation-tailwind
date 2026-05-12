import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChatWindow from '../components/Chat/ChatWindow';

const TABS = [
  { id: 'profile', label: 'Mon profil' },
  { id: 'messages', label: 'Mes messages' },
  { id: 'faq', label: 'Mes questions' },
];

export default function UserDashboard() {
  const { user, updateProfile, logout } = useAuth();
  const [tab, setTab] = useState('profile');

  return (
    <div className="min-h-screen bg-surface-soft">
      <header className="bg-primary text-white py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-accent font-bold">Mon espace</p>
            <h1 className="text-3xl font-extrabold mt-1">Bonjour {user?.prenom} {user?.nom}</h1>
            <p className="text-white/70 text-sm mt-1">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <nav className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
                tab === t.id
                  ? 'text-accent border-accent'
                  : 'text-content-muted border-transparent hover:text-primary'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {tab === 'profile' && <ProfileTab user={user} onUpdate={updateProfile} />}
        {tab === 'messages' && <MessagesTab />}
        {tab === 'faq' && <FaqTab />}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Profile tab
// ---------------------------------------------------------------------------
function ProfileTab({ user, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    prenom: user?.prenom || '',
    nom: user?.nom || '',
    telephone: user?.telephone || '',
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm({
      prenom: user?.prenom || '',
      nom: user?.nom || '',
      telephone: user?.telephone || '',
    });
  }, [user]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      await onUpdate(form);
      setSuccess(true);
      setEditing(false);
    } catch (err) {
      setError(err.message || 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-extrabold text-primary">Mes informations</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-sm font-bold text-accent hover:underline"
          >
            Modifier
          </button>
        )}
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-lg mb-4">
          Profil mis à jour.
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {editing ? (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Prénom" value={form.prenom} onChange={(v) => setForm({ ...form, prenom: v })} />
            <Field label="Nom" value={form.nom} onChange={(v) => setForm({ ...form, nom: v })} />
          </div>
          <Field label="Téléphone" value={form.telephone} onChange={(v) => setForm({ ...form, telephone: v })} />
          <div className="text-xs text-content-muted">L'email ne peut pas être modifié.</div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-accent hover:bg-accent-dark text-white font-bold px-5 py-2.5 rounded-lg text-sm disabled:opacity-60"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="border border-gray-300 text-content-dark font-bold px-5 py-2.5 rounded-lg text-sm"
            >
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <Info label="Prénom" value={user?.prenom} />
          <Info label="Nom" value={user?.nom} />
          <Info label="Email" value={user?.email} />
          <Info label="Téléphone" value={user?.telephone || 'Non renseigné'} />
          <Info label="Membre depuis" value={user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : '—'} />
          <Info label="Rôle" value={user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'} />
        </dl>
      )}
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-content-muted font-bold">{label}</dt>
      <dd className="text-content-dark mt-1">{value}</dd>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-content-muted font-bold">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
      />
    </label>
  );
}

// ---------------------------------------------------------------------------
// Messages tab
// ---------------------------------------------------------------------------
function MessagesTab() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openContact, setOpenContact] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact/mine', { credentials: 'include' });
      const data = await res.json();
      if (data.success) setContacts(data.contacts);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-primary">Mes messages</h2>
          <Link to="/contact" className="text-sm font-bold text-accent hover:underline">
            Nouveau message
          </Link>
        </div>
        {loading && <p className="text-content-muted text-sm">Chargement...</p>}
        {!loading && contacts.length === 0 && (
          <p className="text-content-muted text-sm">
            Vous n'avez pas encore envoyé de message. <Link to="/contact" className="text-accent font-bold underline">Contactez-nous</Link>.
          </p>
        )}
        <ul className="space-y-3">
          {contacts.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => setOpenContact(c)}
                className={`w-full text-left border rounded-xl p-4 transition-colors ${
                  openContact?.id === c.id ? 'border-accent bg-amber-50/50' : 'border-gray-200 hover:border-accent/50'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-bold text-sm text-primary truncate">{c.sujet}</h3>
                  <StatusBadge status={c.status} />
                </div>
                <p className="text-xs text-content-muted mt-1 truncate">{c.message}</p>
                <p className="text-[11px] text-content-muted mt-2">{new Date(c.created_at).toLocaleString('fr-FR')}</p>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        {openContact ? (
          <ChatWindow
            key={openContact.id}
            contactId={openContact.id}
            title={`Message : ${openContact.sujet}`}
          />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center text-content-muted text-sm h-[500px] flex items-center justify-center">
            Sélectionnez un message pour ouvrir la conversation.
          </div>
        )}
      </div>
    </section>
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
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// FAQ tab
// ---------------------------------------------------------------------------
function FaqTab() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [openRequest, setOpenRequest] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/faq/requests/mine', { credentials: 'include' });
      const data = await res.json();
      if (data.success) setRequests(data.requests);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setSubmitting(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch('/api/faq/requests', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Erreur');
      setQuestion('');
      setSuccess(true);
      load();
    } catch (err) {
      setError(err.message || 'Erreur');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-extrabold text-primary mb-2">Poser une question à l'équipe</h2>
          <p className="text-sm text-content-muted mb-4">
            Votre question sera envoyée à un administrateur qui vous répondra. Si la question est pertinente, elle pourra être publiée dans la FAQ publique.
          </p>
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-lg mb-3">
              Votre question a été envoyée.
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-3">
              {error}
            </div>
          )}
          <form onSubmit={onSubmit} className="space-y-3">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Quelle est votre question ?"
              rows={4}
              maxLength={1000}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
            <button
              type="submit"
              disabled={submitting || !question.trim()}
              className="bg-accent hover:bg-accent-dark disabled:opacity-60 text-white font-bold px-5 py-2.5 rounded-lg text-sm"
            >
              {submitting ? 'Envoi...' : 'Envoyer la question'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-extrabold text-primary mb-4">Mes questions</h2>
          {loading && <p className="text-content-muted text-sm">Chargement...</p>}
          {!loading && requests.length === 0 && (
            <p className="text-content-muted text-sm">Aucune question pour le moment.</p>
          )}
          <ul className="space-y-3">
            {requests.map((r) => (
              <li
                key={r.id}
                className={`border rounded-xl p-4 transition-colors cursor-pointer ${
                  openRequest?.id === r.id ? 'border-accent bg-amber-50/50' : 'border-gray-200 hover:border-accent/50'
                }`}
                onClick={() => setOpenRequest(openRequest?.id === r.id ? null : r)}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-content-dark font-medium">{r.question}</p>
                  <StatusBadge status={r.status} />
                </div>
                {r.admin_response && (
                  <div className="mt-3 bg-gray-50 border-l-4 border-accent p-3 text-sm">
                    <strong className="block text-xs uppercase text-accent mb-1">Réponse</strong>
                    {r.admin_response}
                  </div>
                )}
                <p className="text-[11px] text-content-muted mt-2">
                  {new Date(r.created_at).toLocaleString('fr-FR')}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        {openRequest ? (
          <ChatWindow
            key={openRequest.id}
            faqRequestId={openRequest.id}
            title="Discussion sur ma question"
          />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center text-content-muted text-sm h-[500px] flex items-center justify-center">
            Sélectionnez une question pour discuter avec l'équipe.
          </div>
        )}
      </div>
    </section>
  );
}
