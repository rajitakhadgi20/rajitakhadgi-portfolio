import { useMemo, useState } from "react";
import { api } from "../api";
import { ProjectForm } from "./ProjectForm";
import { CaseStudyEditorPage } from "./CaseStudyEditorPage";

const SITE_URL = import.meta.env.VITE_SITE_URL || "http://localhost:5173";

function imgSrc(img) {
  if (!img) return "";
  if (img.startsWith("http") || img.startsWith("data:")) return img;
  return encodeURI(`${SITE_URL.replace(/\/$/, "")}${img}`);
}

export function ProjectsPage({ projects, setProjects, reload, loading, query, wantNew, onNewHandled }) {
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {...} = edit
  const [saving, setSaving] = useState(false);
  const [caseStudyProject, setCaseStudyProject] = useState(null);

  const active = wantNew ? {} : editing;
  const closeForm = () => {
    setEditing(null);
    onNewHandled();
  };

  const q = query.trim().toLowerCase();
  const visible = useMemo(
    () => (q ? projects.filter((p) => p.title.toLowerCase().includes(q) || (p.tags || []).some((t) => t.toLowerCase().includes(q))) : projects),
    [projects, q]
  );

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (active.id) {
        await api.updateProject(active.id, data);
      } else {
        await api.createProject(data);
      }
      closeForm();
      reload();
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p) => {
    if (!confirm(`Delete "${p.title}"? This can't be undone.`)) return;
    try {
      await api.deleteProject(p.id);
      reload();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDeleteActive = async () => {
    if (!active?.id) return;
    if (!confirm(`Delete "${active.title}"? This can't be undone.`)) return;
    try {
      await api.deleteProject(active.id);
      closeForm();
      reload();
    } catch (e) {
      alert(e.message);
    }
  };

  const move = async (project, dir) => {
    const index = projects.findIndex((p) => p.id === project.id);
    const target = index + dir;
    if (target < 0 || target >= projects.length) return;
    const next = [...projects];
    [next[index], next[target]] = [next[target], next[index]];
    setProjects(next);
    try {
      await api.reorderProjects(next.map((p) => p.id));
    } catch (e) {
      alert(e.message);
      reload();
    }
  };

  // Full-page case study editor takes over the whole view — placed after all
  // hooks above so it doesn't break React's rules of hooks.
  if (caseStudyProject) {
    return (
      <CaseStudyEditorPage
        project={caseStudyProject}
        onBack={() => setCaseStudyProject(null)}
        onSaved={reload}
      />
    );
  }

  return (
    <div className="ad-page">
      <p className="ad-page-sub">
        {q ? `${visible.length} of ${projects.length} projects match “${query.trim()}”` : `${projects.length} project${projects.length === 1 ? "" : "s"} — this is exactly what shows on your live site.`}
      </p>

      {loading && <p style={{ color: "var(--text-dim)" }}>Loading…</p>}

      {!loading && projects.length === 0 && (
        <div className="ad-card ad-empty big">
          No projects yet.
          <button className="btn" onClick={() => setEditing({})}>Add your first project</button>
        </div>
      )}

      {!loading && projects.length > 0 && visible.length === 0 && (
        <div className="ad-card ad-empty big">Nothing matches “{query.trim()}”. Try a project name or a tag.</div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {visible.map((p) => (
          <div key={p.id} className="ad-card ad-row">
            <div
              className="ad-thumb"
              style={{ backgroundImage: p.img ? `url("${imgSrc(p.img)}")` : "none" }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 600, fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</p>
              <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                {(p.tags || []).map((t) => <span key={t} className="badge">{t}</span>)}
              </div>
            </div>
            <div className="ad-row-actions">
              {!q && (
                <>
                  <button className="btn secondary small" onClick={() => move(p, -1)} disabled={p.id === projects[0].id} title="Move up" aria-label="Move up">↑</button>
                  <button className="btn secondary small" onClick={() => move(p, 1)} disabled={p.id === projects[projects.length - 1].id} title="Move down" aria-label="Move down">↓</button>
                </>
              )}
              <button className="btn secondary small" onClick={() => setCaseStudyProject(p)}>Case Study</button>
              <button className="btn secondary small" onClick={() => setEditing(p)}>Edit</button>
              <button className="btn danger small" onClick={() => handleDelete(p)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {active !== null && (
        <ProjectForm
          project={active.id ? active : null}
          saving={saving}
          onCancel={closeForm}
          onSave={handleSave}
          onDelete={handleDeleteActive}
        />
      )}
    </div>
  );
}