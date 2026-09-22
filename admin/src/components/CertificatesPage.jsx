import { useEffect, useState } from "react";
import { api } from "../api";
import { UploadBox } from "./UploadBox";

function CertificateForm({ item, saving, onCancel, onSave, onDelete }) {
  const [form, setForm] = useState(item ? { title: item.title, image: item.image } : { title: "", image: "" });
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError("Title is required."); return; }
    onSave({ title: form.title.trim(), image: form.image });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 50 }} onClick={onCancel}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="card scrollbar" style={{ width: "100%", maxWidth: 480, padding: 28, display: "flex", flexDirection: "column", gap: 16, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: 22, color: "var(--accent-2)" }}>{item ? "Edit Certificate" : "Add Certificate"}</h3>
          <button type="button" onClick={onCancel} aria-label="Close" style={{ background: "none", border: "none", color: "var(--danger)", fontSize: 20, cursor: "pointer" }}>×</button>
        </div>

        {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", color: "var(--danger)", fontSize: 13 }}>{error}</div>}

        <div>
          <label className="label">Title</label>
          <input className="input" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Enter Title" autoFocus />
        </div>

        <div>
          <label className="label">Image</label>
          <UploadBox value={form.image} onChange={(v) => setForm((f) => ({ ...f, image: v }))} />
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button type="submit" className="btn" disabled={saving} style={{ flex: 1 }}>{saving ? "Saving…" : "Save"}</button>
          {item ? (
            <button type="button" className="btn danger" onClick={onDelete} style={{ flex: 1 }}>Delete</button>
          ) : (
            <button type="button" className="btn secondary" onClick={onCancel} style={{ flex: 1 }}>Cancel</button>
          )}
        </div>
      </form>
    </div>
  );
}

export function CertificatesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => api.listCertificates().then(setItems).catch((e) => setError(e.message)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (editing.id) await api.updateCertificate(editing.id, data);
      else await api.createCertificate(data);
      setEditing(null);
      load();
    } catch (e) { alert(e.message); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${editing.title}"? This can't be undone.`)) return;
    try {
      await api.deleteCertificate(editing.id);
      setEditing(null);
      load();
    } catch (e) { alert(e.message); }
  };

  const move = async (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    try { await api.reorderCertificates(next.map((i) => i.id)); } catch (e) { alert(e.message); load(); }
  };

  return (
    <div className="ad-page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
        <p className="ad-page-sub" style={{ margin: 0 }}>{items.length} certificate{items.length === 1 ? "" : "s"} — shown in the Certificates section of your site.</p>
        <button className="btn" onClick={() => setEditing({})}>Add Certificate</button>
      </div>

      {loading && <p style={{ color: "var(--text-dim)" }}>Loading…</p>}
      {error && <div className="ad-alert" role="alert"><span>{error}</span></div>}

      {!loading && !error && items.length === 0 && (
        <div className="ad-card ad-empty big">No certificates yet.<button className="btn" onClick={() => setEditing({})}>Add your first certificate</button></div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        {items.map((item, i) => (
          <div key={item.id} className="ad-card" style={{ padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            <div className="ad-thumb" style={{ width: "100%", height: 140, backgroundImage: item.image ? `url("${item.image}")` : "none" }} />
            <p style={{ fontSize: 14, fontWeight: 600 }}>{item.title}</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <button className="btn secondary small" onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
              <button className="btn secondary small" onClick={() => move(i, 1)} disabled={i === items.length - 1}>↓</button>
              <button className="btn secondary small" onClick={() => setEditing(item)}>Edit</button>
            </div>
          </div>
        ))}
      </div>

      {editing !== null && (
        <CertificateForm item={editing.id ? editing : null} saving={saving} onCancel={() => setEditing(null)} onSave={handleSave} onDelete={handleDelete} />
      )}
    </div>
  );
}