import { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, X, ChevronRight, MessageSquare, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ChatWindow from './ChatWindow';

const POLL_LIST_INTERVAL = 20000;

/**
 * Floating chat widget for connected users.
 * - Shows a list of all open tickets (contacts + FAQ requests)
 * - Click a ticket to open the full chat for that conversation
 * - Hidden for admins and on auth/dashboard pages
 */
export default function ChatWidget() {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [faqRequests, setFaqRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(null); // { kind: 'contact' | 'faq', id, title }

  const hideOnPaths = ['/connexion', '/inscription', '/admin', '/mon-espace'];
  const shouldHide =
    !user ||
    isAdmin ||
    hideOnPaths.some((p) => location.pathname.startsWith(p));

  const loadConversations = useCallback(async () => {
    if (!user || isAdmin) return;
    setLoading(true);
    try {
      const res = await fetch('/api/chat/conversations/mine', { credentials: 'include' });
      if (!res.ok) return;
      const data = await res.json();
      if (data?.success) {
        setContacts(data.conversations.contacts || []);
        setFaqRequests(data.conversations.faqRequests || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin]);

  useEffect(() => {
    if (!open || !user || isAdmin) return undefined;
    loadConversations();
    const id = setInterval(loadConversations, POLL_LIST_INTERVAL);
    return () => clearInterval(id);
  }, [open, user, isAdmin, loadConversations]);

  if (shouldHide) return null;

  const total = contacts.length + faqRequests.length;

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-[200] bg-accent hover:bg-accent-dark text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110"
        aria-label={open ? 'Fermer le chat' : 'Ouvrir le chat'}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-[200] w-[380px] max-w-[calc(100vw-3rem)] h-[560px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
          {active ? (
            <ChatWindow
              key={`${active.kind}-${active.id}`}
              contactId={active.kind === 'contact' ? active.id : undefined}
              faqRequestId={active.kind === 'faq' ? active.id : undefined}
              title={active.title}
              compact
              onBack={() => setActive(null)}
              onClose={() => {
                setActive(null);
                setOpen(false);
              }}
            />
          ) : (
            <ConversationList
              contacts={contacts}
              faqRequests={faqRequests}
              loading={loading}
              total={total}
              onPick={setActive}
              onClose={() => setOpen(false)}
            />
          )}
        </div>
      )}
    </>
  );
}

function ConversationList({ contacts, faqRequests, loading, total, onPick, onClose }) {
  return (
    <>
      <div className="flex items-center justify-between bg-primary text-white px-4 py-3 shrink-0">
        <div>
          <h3 className="font-bold text-sm">Mes conversations</h3>
          <p className="text-[11px] text-white/70">{total} ticket{total > 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white p-1"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50">
        {loading && total === 0 && (
          <p className="p-4 text-content-muted text-sm">Chargement...</p>
        )}

        {!loading && total === 0 && (
          <div className="p-6 text-center">
            <p className="text-sm text-content-muted mb-4">
              Aucun ticket pour le moment. Démarrez une conversation depuis la page contact ou la FAQ.
            </p>
            <div className="flex flex-col gap-2">
              <Link
                to="/contact"
                onClick={onClose}
                className="bg-accent hover:bg-accent-dark text-white font-bold px-4 py-2 rounded-lg text-sm no-underline"
              >
                Page contact
              </Link>
              <Link
                to="/faq"
                onClick={onClose}
                className="border border-gray-300 hover:bg-white text-content-dark font-bold px-4 py-2 rounded-lg text-sm no-underline"
              >
                Poser une question FAQ
              </Link>
            </div>
          </div>
        )}

        {contacts.length > 0 && (
          <ListSection
            title="Tickets contact"
            icon={<MessageSquare className="w-3.5 h-3.5" />}
            items={contacts.map((c) => ({
              kind: 'contact',
              id: c.id,
              title: c.sujet,
              status: c.status,
              preview: c.last_message,
              created_at: c.created_at,
              messageCount: c.message_count,
            }))}
            onPick={onPick}
          />
        )}

        {faqRequests.length > 0 && (
          <ListSection
            title="Mes questions FAQ"
            icon={<HelpCircle className="w-3.5 h-3.5" />}
            items={faqRequests.map((r) => ({
              kind: 'faq',
              id: r.id,
              title: r.question,
              status: r.status,
              preview: r.last_message,
              created_at: r.created_at,
              messageCount: r.message_count,
            }))}
            onPick={onPick}
          />
        )}
      </div>

      <div className="border-t border-gray-200 bg-white p-2 shrink-0 flex gap-2">
        <Link
          to="/contact"
          onClick={onClose}
          className="flex-1 text-center bg-accent hover:bg-accent-dark text-white font-bold px-3 py-2 rounded-lg text-xs no-underline"
        >
          Nouveau message
        </Link>
        <Link
          to="/faq"
          onClick={onClose}
          className="flex-1 text-center border border-gray-300 hover:bg-gray-50 text-content-dark font-bold px-3 py-2 rounded-lg text-xs no-underline"
        >
          Nouvelle question
        </Link>
      </div>
    </>
  );
}

function ListSection({ title, icon, items, onPick }) {
  return (
    <div>
      <div className="px-4 py-2 bg-gray-100 border-b border-gray-200 flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-content-muted">
        {icon}
        {title}
      </div>
      <ul>
        {items.map((it) => (
          <li key={`${it.kind}-${it.id}`}>
            <button
              onClick={() =>
                onPick({
                  kind: it.kind,
                  id: it.id,
                  title: it.kind === 'contact' ? it.title : 'Discussion FAQ',
                })
              }
              className="w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-white transition-colors flex items-start gap-2"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="font-bold text-sm text-primary truncate">
                    {it.title}
                  </span>
                  <StatusDot status={it.status} />
                </div>
                <p className="text-xs text-content-muted truncate">
                  {it.preview || (it.messageCount === 0 ? 'Aucun message dans le chat' : '...')}
                </p>
                <p className="text-[10px] text-content-muted mt-0.5">
                  {new Date(it.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-content-muted shrink-0 self-center" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatusDot({ status }) {
  const map = {
    pending: { className: 'bg-amber-400', label: 'En attente' },
    read: { className: 'bg-blue-400', label: 'Lu' },
    replied: { className: 'bg-green-500', label: 'Répondu' },
    published: { className: 'bg-purple-500', label: 'Publié' },
  };
  const cfg = map[status] || { className: 'bg-gray-400', label: status };
  return (
    <span
      className={`w-2 h-2 rounded-full shrink-0 ${cfg.className}`}
      title={cfg.label}
    />
  );
}
