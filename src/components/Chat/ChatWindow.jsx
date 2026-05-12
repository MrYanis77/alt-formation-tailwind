import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const POLL_INTERVAL = 5000;

function formatDate(d) {
  if (!d) return '';
  try {
    const date = new Date(d);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

/**
 * Conversation chat window.
 * - Fetches the conversation "context" (original contact message or FAQ Q/A)
 *   from /api/chat/context and displays it as pinned items at the top.
 * - Polls /api/chat/messages every 5s for new messages, with race-safe
 *   deduplication.
 *
 * Props:
 *   contactId or faqRequestId — exactly one identifies the conversation
 *   onClose (optional)        — close handler ("X" button)
 *   onBack (optional)         — back handler (left arrow, e.g. return to list)
 *   title (optional)          — header label override
 *   compact (optional)        — render without surrounding card chrome
 */
export default function ChatWindow({
  contactId,
  faqRequestId,
  onClose,
  onBack,
  title,
  compact = false,
}) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [context, setContext] = useState(null);
  const [contextType, setContextType] = useState(null);
  const lastIdRef = useRef(0);
  const inFlightRef = useRef(false);
  const scrollRef = useRef(null);
  const intervalRef = useRef(null);

  const queryString = contactId
    ? `contactId=${contactId}`
    : faqRequestId
      ? `faqRequestId=${faqRequestId}`
      : '';

  // ----------------------------------------------------------------- Context
  useEffect(() => {
    let cancelled = false;
    setContext(null);
    setContextType(null);
    if (!queryString) return undefined;
    fetch(`/api/chat/context?${queryString}`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data?.success) return;
        setContext(data.context);
        setContextType(data.type);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [queryString]);

  // ----------------------------------------------------------------- Messages
  const fetchMessages = useCallback(async () => {
    if (!queryString) return;
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    try {
      const res = await fetch(`/api/chat/messages?${queryString}&after=${lastIdRef.current}`, {
        credentials: 'include',
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && data.messages.length > 0) {
        setMessages((prev) => {
          const seen = new Set(prev.map((m) => m.id));
          const fresh = data.messages.filter((m) => !seen.has(m.id));
          if (fresh.length === 0) return prev;
          return [...prev, ...fresh];
        });
        lastIdRef.current = data.messages[data.messages.length - 1].id;
      }
    } catch {
      // silent — next poll will retry
    } finally {
      inFlightRef.current = false;
    }
  }, [queryString]);

  useEffect(() => {
    lastIdRef.current = 0;
    inFlightRef.current = false;
    setMessages([]);
    fetchMessages();
    intervalRef.current = setInterval(fetchMessages, POLL_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [fetchMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, context]);

  // ----------------------------------------------------------------- Seeds
  const seedItems = useMemo(() => {
    if (!context) return [];
    if (contextType === 'contact') {
      const items = [];
      if (context.message) {
        items.push({
          key: `contact-${context.id}`,
          role: 'user',
          label: `${context.prenom || ''} ${context.nom || ''} — message initial`.trim(),
          message: context.message,
          created_at: context.created_at,
        });
      }
      return items;
    }
    if (contextType === 'faq') {
      const items = [];
      if (context.question) {
        items.push({
          key: `faq-${context.id}-q`,
          role: 'user',
          label: `${context.prenom || ''} ${context.nom || ''} — question`.trim(),
          message: context.question,
          created_at: context.created_at,
        });
      }
      if (context.admin_response) {
        items.push({
          key: `faq-${context.id}-a`,
          role: 'admin',
          label: 'Réponse de l\'équipe (publiée)',
          message: context.admin_response,
          created_at: context.replied_at,
        });
      }
      return items;
    }
    return [];
  }, [context, contextType]);

  // ----------------------------------------------------------------- Send
  const sendMessage = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId, faqRequestId, message: trimmed }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erreur lors de l'envoi");
      }
      setInput('');
      await fetchMessages();
    } catch (err) {
      setError(err.message || 'Erreur réseau');
    } finally {
      setSending(false);
    }
  };

  const wrapperClass = compact
    ? 'flex flex-col h-full bg-white'
    : 'flex flex-col bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden h-[500px]';

  const computedTitle =
    title ||
    (contextType === 'contact' && context?.sujet) ||
    (contextType === 'faq' && 'Discussion FAQ') ||
    'Conversation';

  return (
    <div className={wrapperClass}>
      <div className="flex items-center gap-2 px-4 py-3 bg-primary text-white shrink-0">
        {onBack && (
          <button
            onClick={onBack}
            className="text-white/80 hover:text-white p-1"
            aria-label="Retour"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <h3 className="font-bold text-sm truncate flex-1">{computedTitle}</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
        {seedItems.map((item) => {
          const isAdmin = item.role === 'admin';
          return (
            <div key={`seed-${item.key}`} className="flex justify-start">
              <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm border-2 border-dashed ${
                isAdmin ? 'border-primary/40 bg-primary/5' : 'border-accent/40 bg-accent/5'
              }`}>
                <div className={`text-[10px] uppercase tracking-wider font-bold mb-0.5 ${
                  isAdmin ? 'text-primary' : 'text-accent'
                }`}>
                  {item.label}
                </div>
                <div className="whitespace-pre-wrap break-words text-content-dark">{item.message}</div>
                {item.created_at && (
                  <div className="text-[10px] text-content-muted mt-1 text-right">
                    {formatDate(item.created_at)}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {seedItems.length === 0 && messages.length === 0 && (
          <p className="text-center text-content-muted text-sm py-6">
            Aucun message pour l'instant. Envoyez le premier !
          </p>
        )}

        {messages.map((m) => {
          const mine = m.sender_id === user?.id;
          const isAdmin = m.sender_role === 'admin';
          return (
            <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                mine
                  ? 'bg-accent text-white rounded-br-sm'
                  : isAdmin
                    ? 'bg-primary text-white rounded-bl-sm'
                    : 'bg-white border border-gray-200 text-content-dark rounded-bl-sm'
              }`}>
                <div className="text-[10px] uppercase tracking-wider font-bold opacity-70 mb-0.5">
                  {isAdmin ? 'Équipe Alt Formations' : `${m.prenom} ${m.nom}`}
                </div>
                <div className="whitespace-pre-wrap break-words">{m.message}</div>
                <div className="text-[10px] opacity-60 mt-1 text-right">{formatDate(m.created_at)}</div>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={sendMessage} className="flex items-end gap-2 p-3 border-t border-gray-200 bg-white shrink-0">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage(e);
            }
          }}
          placeholder="Écrivez votre message..."
          rows={2}
          disabled={sending}
          className="flex-1 resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:bg-gray-50"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="bg-accent hover:bg-accent-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors"
        >
          {sending ? '...' : 'Envoyer'}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border-t border-red-200 text-red-700 text-xs font-semibold px-4 py-2">
          {error}
        </div>
      )}
    </div>
  );
}
