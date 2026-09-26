import { useState } from "react";
import { TagInput } from "./TagInput";
import { UploadBox } from "./UploadBox";

const emptyForm = { title: "", tags: [], date: "", client: "", role: "", desc: "", figma: "", img: "" };

export function ProjectForm({ project, onCancel, onSave, onDelete, saving }) {
  const [form, setForm] = useState(
    project
      ? {
          title: project.title,
          tags: project.tags || [],
          date: project.date || "",
          client: project.client || "",
          role: project.role || "",
          desc: project.desc,
          figma: project.figma,
          img: project.img || "",
        }
      : emptyForm
  );
  const [error, setError] = useState("");
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError("Title is required."); return; }
    onSave({ ...form, title: form.title.trim(), figma: form.figma || "#" });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 50 }} onClick={onCancel}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="card scrollbar" style={{ width: "100%", maxWidth: 520, padding: 28, display: "flex", flexDirection: "column", gap: 16, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: 22, color: "var(--accent-2)" }}>{project ? "Edit Project" : "Add Project"}</h3>
          <button type="button" onClick={onCancel} aria-label="Close" style={{ background: "none", border: "none", color: "var(--danger)", fontSize: 20, cursor: "pointer" }}>×</button>
        </div>

        {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", color: "var(--danger)", fontSize: 13 }}>{error}</div>}

        <div>
          <label className="label">Title</label>
          <input className="input" value={form.title} onChange={set("title")} placeholder="Enter Title" autoFocus />
        </div>

        <div>
          <label className="label">Thumbnail Image <span style={{ color: "var(--text-dim)", fontWeight: 400 }}>(shown on the Projects grid)</span></label>
          <UploadBox value={form.img} onChange={(img) => setForm((f) => ({ ...f, img }))} height={160} />
        </div>

        <div>
          <label className="label">Tags</label>
          <TagInput value={form.tags} onChange={(tags) => setForm((f) => ({ ...f, tags }))} />
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label className="label">Client</label>
            <input className="input" value={form.client} onChange={set("client")} placeholder="e.g. Fishking" />
          </div>
          <div style={{ flex: 1 }}>
            <label className="label">Role</label>
            <input className="input" value={form.role} onChange={set("role")} placeholder="e.g. Product Designer" />
          </div>
        </div>

        <div>
          <label className="label">Date</label>
          <input className="input" type="date" value={form.date} onChange={set("date")} />
        </div>

        <div>
          <label className="label">Description</label>
          <textarea className="input" rows={3} value={form.desc} onChange={set("desc")} placeholder="Enter description..." />
        </div>

        <div>
          <label className="label">Figma Link <span style={{ color: "var(--text-dim)", fontWeight: 400 }}>(shown as a live preview on the case-study page)</span></label>
          <input className="input" value={form.figma} onChange={set("figma")} placeholder="https://www.figma.com/...." />
        </div>

        {!project && (
          <p style={{ fontSize: 12, color: "var(--text-dim)" }}>You can add the case-study cover image, extra pictures and long description after saving, from the new "Case Study" button.</p>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button type="submit" className="btn" disabled={saving} style={{ flex: 1 }}>{saving ? "Saving…" : "Save"}</button>
          {project ? (
            <button type="button" className="btn danger" onClick={onDelete} style={{ flex: 1 }}>Delete</button>
          ) : (
            <button type="button" className="btn secondary" onClick={onCancel} style={{ flex: 1 }}>Cancel</button>
          )}
        </div>
      </form>
    </div>
  );
}