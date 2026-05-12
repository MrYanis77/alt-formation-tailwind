import { useEffect, useState, useCallback } from 'react';
import ChatWindow from './ChatWindow';

export default function AdminChatPanel() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openContact, setOpenContact] = useState(null);
  const [filter, setFilter] = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/chat/conversations', { credentials: 'include' });
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
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, [load]);

  const filtered = contacts.filter((c) => {
    if (filter === 'all') return true;
    if (filter === 'open') return c.status !== 'replied';
    if (filter === 'replied') return c.status === 'replied';
    return true;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4 h-[640px]">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 shrink-0">
          <h3 className="font-bold text-primary text-sm uppercase tracking-wider">Conversations</h3>
          <div className="flex gap-1 mt-3">
            {['all', 'open', 'replied'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs font-bold px-3 py-1.5 rounded ${filter === f ? 'bg-accent text-white' : 'bg-gray-100 text-content-muted hover:bg-gray-200'}`}
              >
                {f === 'all' ? 'Toutes' : f === 'open' ? 'Ouvertes' : 'Répondues'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && <p className="p-4 text-content-muted text-sm">Chargement...</p>}
          {!loading && filtered.length === 0 && (
            <p className="p-4 text-content-muted text-sm">Aucune conversation.</p>
          )}
          <ul>
            {filtered.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => setOpenContact(c)}
                  className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    openContact?.id === c.id ? 'bg-amber-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-bold text-sm text-primary truncate">
                      {c.prenom} {c.nom}
                    </span>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="text-xs text-content-muted truncate">{c.sujet}</p>
                  <p className="text-[11px] text-content-muted mt-1 truncate">
                    {c.last_message || 'Aucun message dans le chat'}
                  </p>
                  <p className="text-[10px] text-content-muted mt-1">
                    {new Date(c.last_message_at || c.created_at).toLocaleString('fr-FR')}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        {openContact ? (
          <ContactChatPanel key={openContact.id} contact={openContact} />
        ) : (
          <div className="h-full bg-white rounded-2xl border border-gray-200 flex items-center justify-center text-content-muted text-sm">
            Sélectionnez une conversation pour répondre.
          </div>
        )}
      </div>
    </div>
  );
}

function ContactChatPanel({ contact }) {
  return (
    <div className="space-y-3 h-full flex flex-col">
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h4 className="font-bold text-primary text-sm">{contact.prenom} {contact.nom}</h4>
            <a href={`mailto:${contact.email}`} className="text-xs text-accent">{contact.email}</a>
          </div>
          <span className="text-xs font-mono text-content-muted">#{contact.id}</span>
        </div>
        <div className="mt-3 bg-gray-50 border-l-4 border-accent p-3 text-sm text-content-dark">
          <strong className="block text-xs uppercase text-accent mb-1">Sujet : {contact.sujet}</strong>
          {contact.telephone && (
            <p className="text-xs text-content-muted mt-1">Téléphone : {contact.telephone}</p>
          )}
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <ChatWindow
          contactId={contact.id}
          title={`Conversation avec ${contact.prenom} ${contact.nom}`}
          compact
        />
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending: { label: 'Nouveau', className: 'bg-amber-100 text-amber-800' },
    read: { label: 'Lu', className: 'bg-blue-100 text-blue-800' },
    replied: { label: 'Répondu', className: 'bg-green-100 text-green-800' },
  };
  const cfg = map[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
  return (
    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${cfg.className} whitespace-nowrap`}>
      {cfg.label}
    </span>
  );
}
