import { useEffect, useState } from "react";
import { api } from "../api";
import { EXPERIENCE_TYPES } from "../lib/constants";
import { monthLabel } from "../lib/dates";

const empty = { role: "", company: "", type: "Full Time", startDate: "", endDate: "", description: "" };

function ExperienceForm({ entry, saving, onCancel, onSave, onDelete }) {
  const [form, setForm] = useState(
    entry ? { role: entry.role, company: entry.company, type: entry.type || "Full Time", startDate: entry.startDate, endDate: entry.endDate, description: entry.description || "" } : empty
  );
  const [error, setError] = useState("");
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.role.trim()) { setError("Role is required."); return; }
    onSave({ ...form, role: form.role.trim() });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 50 }} onClick={onCancel}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="card scrollbar" style={{ width: "100%", maxWidth: 520, padding: 28, display: "flex", flexDirection: "column", gap: 16, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: 22, color: "var(--accent-2)" }}>{entry ? "Edit Experience" : "Add Experience"}</h3>
          <button type="button" onClick={onCancel} aria-label="Close" style={{ background: "none", border: "none", color: "var(--danger)", fontSize: 20, cursor: "pointer" }}>×</button>
        </div>

        {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", color: "var(--danger)", fontSize: 13 }}>{error}</div>}

        <div>
          <label className="label">Role / Position</label>
          <input className="input" value={form.role} onChange={set("role")} placeholder="Enter Role" autoFocus />
        </div>
        <div>
          <label className="label">Company / Organisation</label>
          <input className="input" value={form.company} onChange={set("company")} placeholder="Enter Company" />
        </div>
        <div>
          <label className="label">Type</label>
          <select className="input" value={form.type} onChange={set("type")}>
            {EXPERIENCE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          {form.type === "Freelance" && (
            <p style={{ fontSize: 12, color: "var(--accent-2)", marginTop: 6 }}>This doesn't show on the website</p>
          )}
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label className="label">Start Date</label>
            <input className="input" type="month" value={form.startDate} onChange={set("startDate")} />
          </div>
          <div style={{ flex: 1 }}>
            <label className="label">End Date</label>
            <input className="input" type="month" value={form.endDate} onChange={set("endDate")} placeholder="Leave blank for Present" />
          </div>
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input" rows={4} value={form.description} onChange={set("description")} placeholder="What did you do in this role? Key projects, impact, tools used." />
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          {entry ? <button type="button" className="btn danger" onClick={onDelete}>Delete</button> : <button type="button" className="btn secondary" onClick={onCancel}>Cancel</button>}
          <button type="submit" className="btn" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
        </div>
      </form>
    </div>
  );
}

export function ExperiencePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => api.listExperience().then(setItems).catch((e) => setError(e.message)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (editing.id) await api.updateExperience(editing.id, data);
      else await api.createExperience(data);
      setEditing(null);
      load();
    } catch (e) { alert(e.message); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${editing.role}"? This can't be undone.`)) return;
    try {
      await api.deleteExperience(editing.id);
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
    try { await api.reorderExperience(next.map((i) => i.id)); } catch (e) { alert(e.message); load(); }
  };

  return (
    <div className="ad-page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
        <p className="ad-page-sub" style={{ margin: 0 }}>{items.length} entr{items.length === 1 ? "y" : "ies"} — Freelance entries are hidden from your live site.</p>
        <button className="btn" onClick={() => setEditing({})}>Add Experience</button>
      </div>

      {loading && <p style={{ color: "var(--text-dim)" }}>Loading…</p>}
      {error && <div className="ad-alert" role="alert"><span>{error}</span></div>}

      {!loading && !error && items.length === 0 && (
        <div className="ad-card ad-empty big">No experience yet.<button className="btn" onClick={() => setEditing({})}>Add your first entry</button></div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((item, i) => (
          <div key={item.id} className="ad-card ad-row" style={{ alignItems: "flex-start" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 600, fontSize: 15 }}>
                {item.role}
                {item.company && <span style={{ color: "var(--text-dim)", fontWeight: 400 }}> · {item.company}</span>}
                {item.type === "Freelance" && <span className="badge" style={{ marginLeft: 8 }}>Hidden</span>}
              </p>
              <p style={{ fontSize: 12, color: "var(--accent-2)", marginTop: 4 }}>
                {item.type} · {monthLabel(item.startDate) || "—"} – {monthLabel(item.endDate) || "Present"}
              </p>
            </div>
            <div className="ad-row-actions">
              <button className="btn secondary small" onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
              <button className="btn secondary small" onClick={() => move(i, 1)} disabled={i === items.length - 1}>↓</button>
              <button className="btn secondary small" onClick={() => setEditing(item)}>Edit</button>
            </div>
          </div>
        ))}
      </div>

      {editing !== null && (
        <ExperienceForm entry={editing.id ? editing : null} saving={saving} onCancel={() => setEditing(null)} onSave={handleSave} onDelete={handleDelete} />
      )}
    </div>
  );
}