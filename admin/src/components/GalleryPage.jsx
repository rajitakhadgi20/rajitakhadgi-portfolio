import { useEffect, useState } from "react";
import { api } from "../api";
import { TAG_OPTIONS } from "../lib/constants";
import { UploadBox } from "./UploadBox";

function GalleryForm({ item, saving, onCancel, onSave, onDelete }) {
  const [form, setForm] = useState(item ? { title: item.title, img: item.img, tag: item.tag || "Website" } : { title: "", img: "", tag: "Website" });
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!form.img.trim()) { setError("Image is required."); return; }
    onSave({ title: form.title.trim(), img: form.img, tag: form.tag });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 50 }} onClick={onCancel}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="card scrollbar" style={{ width: "100%", maxWidth: 480, padding: 28, display: "flex", flexDirection: "column", gap: 16, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: 22, color: "var(--accent-2)" }}>{item ? "Edit Gallery Image" : "Add Gallery Image"}</h3>
          <button type="button" onClick={onCancel} aria-label="Close" style={{ background: "none", border: "none", color: "var(--danger)", fontSize: 20, cursor: "pointer" }}>×</button>
        </div>

        {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", color: "var(--danger)", fontSize: 13 }}>{error}</div>}

        <div>
          <label className="label">Main Heading</label>
          <input className="input" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Enter Heading" autoFocus />
        </div>

        <div>
          <label className="label">Tag</label>
          <select className="input" value={form.tag} onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}>
            {TAG_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="label">Image</label>
          <UploadBox value={form.img} onChange={(v) => setForm((f) => ({ ...f, img: v }))} />
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

export function GalleryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => api.listGallery().then(setItems).catch((e) => setError(e.message)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (editing.id) await api.updateGalleryItem(editing.id, data);
      else await api.createGalleryItem(data);
      setEditing(null);
      load();
    } catch (e) { alert(e.message); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirm(`Remove "${editing.title || "this image"}" from the gallery?`)) return;
    try {
      await api.deleteGalleryItem(editing.id);
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
    try { await api.reorderGallery(next.map((i) => i.id)); } catch (e) { alert(e.message); load(); }
  };

  return (
    <div className="ad-page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
        <p className="ad-page-sub" style={{ margin: 0 }}>{items.length} image{items.length === 1 ? "" : "s"} — shown in the Design Gallery on your site.</p>
        <button className="btn" onClick={() => setEditing({})}>Add image</button>
      </div>

      {loading && <p style={{ color: "var(--text-dim)" }}>Loading…</p>}
      {error && <div className="ad-alert" role="alert"><span>{error}</span></div>}

      {!loading && !error && items.length === 0 && (
        <div className="ad-card ad-empty big">No images yet.<button className="btn" onClick={() => setEditing({})}>Add your first image</button></div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 16 }}>
        {items.map((item, i) => (
          <div key={item.id} className="ad-card" style={{ padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            <div className="ad-thumb" style={{ width: "100%", height: 150, backgroundImage: item.img ? `url("${item.img}")` : "none" }} />
            <p style={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {item.title || <span style={{ color: "var(--text-dim)", fontWeight: 400 }}>Untitled</span>}
            </p>
            {item.tag && <span className="badge" style={{ alignSelf: "flex-start" }}>{item.tag}</span>}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <button className="btn secondary small" onClick={() => move(i, -1)} disabled={i === 0}>←</button>
              <button className="btn secondary small" onClick={() => move(i, 1)} disabled={i === items.length - 1}>→</button>
              <button className="btn secondary small" onClick={() => setEditing(item)}>Edit</button>
            </div>
          </div>
        ))}
      </div>

      {editing !== null && (
        <GalleryForm item={editing.id ? editing : null} saving={saving} onCancel={() => setEditing(null)} onSave={handleSave} onDelete={handleDelete} />
      )}
    </div>
  );
}