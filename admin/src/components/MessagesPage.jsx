import { useEffect, useMemo, useState } from "react";
import { api } from "../api";

function formatDate(iso) {
  try {
    return new Date(iso.replace(" ", "T") + "Z").toLocaleString();
  } catch {
    return iso;
  }
}

export function MessagesPage({ messages, setMessages, reload, loading, query, openId, onOpened }) {
  const [localId, setLocalId] = useState(null);
  // A message can be opened here (click) or from the dashboard's "Recent messages" (openId).
  const activeId = localId ?? openId;
  const open = activeId != null ? messages.find((m) => m.id === activeId) || null : null;

  const openMessage = (m) => setLocalId(m.id);
  const closeMessage = () => {
    setLocalId(null);
    onOpened();
  };

  // Opening an unread message marks it as read.
  const shouldMark = open && !open.read;
  useEffect(() => {
    if (!shouldMark) return;
    api.markMessageRead(activeId, true)
      .then(() => setMessages((list) => list.map((x) => (x.id === activeId ? { ...x, read: 1 } : x))))
      .catch(() => { /* non-critical */ });
  }, [shouldMark, activeId, setMessages]);

  const handleDelete = async (m) => {
    if (!confirm("Delete this message?")) return;
    try {
      await api.deleteMessage(m.id);
      closeMessage();
      reload();
    } catch (e) {
      alert(e.message);
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;
  const q = query.trim().toLowerCase();
  const visible = useMemo(
    () => (q ? messages.filter((m) => [m.name, m.email, m.subject, m.message].some((f) => (f || "").toLowerCase().includes(q))) : messages),
    [messages, q]
  );

  return (
    <div className="ad-page">
      <p className="ad-page-sub">
        {q
          ? `${visible.length} of ${messages.length} messages match “${query.trim()}”`
          : <>{messages.length} message{messages.length === 1 ? "" : "s"} from your contact form
            {unreadCount > 0 && <> · <span style={{ color: "var(--accent-2)" }}>{unreadCount} unread</span></>}</>}
      </p>

      {loading && <p style={{ color: "var(--text-dim)" }}>Loading…</p>}

      {!loading && messages.length === 0 && (
        <div className="ad-card ad-empty big">
          No messages yet. They'll show up here as soon as someone uses your contact form.
        </div>
      )}

      {!loading && messages.length > 0 && visible.length === 0 && (
        <div className="ad-card ad-empty big">Nothing matches “{query.trim()}”.</div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {visible.map((m) => (
          <div
            key={m.id}
            className="card"
            onClick={() => openMessage(m)}
            style={{
              padding: 16, cursor: "pointer", display: "flex", alignItems: "center", gap: 14,
              borderColor: m.read ? "var(--border)" : "var(--accent)",
            }}
          >
            {!m.read && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <p style={{ fontWeight: m.read ? 500 : 700, fontSize: 14 }}>{m.name} <span style={{ color: "var(--text-dim)", fontWeight: 400 }}>· {m.email}</span></p>
                <p style={{ fontSize: 12, color: "var(--text-dim)", flexShrink: 0 }}>{formatDate(m.created_at)}</p>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {m.subject ? `${m.subject} — ` : ""}{m.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 50 }}
          onClick={closeMessage}
        >
          <div className="card" onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 520, padding: 28 }}>
            <h3 style={{ fontSize: 20, marginBottom: 4 }}>{open.subject || "(no subject)"}</h3>
            <p style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 16 }}>
              From {open.name} &lt;{open.email}&gt; · {formatDate(open.created_at)}
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{open.message}</p>
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <a className="btn" style={{ flex: 1, textDecoration: "none" }} href={`mailto:${open.email}`}>Reply by Email</a>
              <button className="btn danger" onClick={() => handleDelete(open)}>Delete</button>
              <button className="btn secondary" onClick={closeMessage}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}