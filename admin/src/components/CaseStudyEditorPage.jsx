import { useState } from "react";
import { api } from "../api";
import { UploadBox, MultiUploadBox, resolveImg } from "./UploadBox";
import { isFigmaUrl, figmaEmbedUrl } from "../lib/figma";

export function CaseStudyEditorPage({ project, onBack, onSaved }) {
  const [coverImage, setCoverImage] = useState(project.coverImage || project.img || "");
  const [caseStudyImages, setCaseStudyImages] = useState(project.caseStudyImages || []);
  const [caseStudyDesc, setCaseStudyDesc] = useState(project.caseStudyDesc || "");
  const [showFigmaLink, setShowFigmaLink] = useState(project.showFigmaLink !== false);
  const [client, setClient] = useState(project.client || "");
  const [date, setDate] = useState(project.date || "");
  const [role, setRole] = useState(project.role || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await api.updateProject(project.id, {
        coverImage,
        img: coverImage,
        caseStudyImages,
        caseStudyDesc,
        showFigmaLink,
        client,
        date,
        role,
      });
      setSaved(true);
      onSaved?.();
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const hasFigma = isFigmaUrl(project.figma);
  // The live Figma preview always shows when a Figma link exists.
  // The checkbox only controls whether the "Open Figma file" link is shown.
  const showFigmaEmbed = hasFigma;

  return (
    <div className="ad-page">
      <button type="button" onClick={onBack} className="btn secondary small" style={{ marginBottom: 18 }}>← Back to Projects</button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 20, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <section className="ad-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, marginBottom: 4 }}>Case Study — {project.title}</h3>
            <p style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 18 }}>This is what shows on the project's public case-study page.</p>

            <div style={{ marginBottom: 20 }}>
              <label className="label">Cover Page</label>
              <UploadBox value={coverImage} onChange={setCoverImage} height={220} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label className="label">Case Study Images</label>
              <MultiUploadBox values={caseStudyImages} onChange={setCaseStudyImages} />
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1 }}>
                <label className="label">Client</label>
                <input className="input" value={client} onChange={(e) => setClient(e.target.value)} placeholder="e.g. Greenhub" />
              </div>
              <div style={{ flex: 1 }}>
                <label className="label">Role</label>
                <input className="input" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Product Designer" />
              </div>
              <div style={{ flex: 1 }}>
                <label className="label">Date</label>
                <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-dim)", marginTop: -12, marginBottom: 20 }}>
              "Type" on the public page comes from this project's Tags, set on the Edit form.
            </p>

            <div>
              <label className="label">Case Study Description</label>
              <textarea className="input" rows={8} value={caseStudyDesc} onChange={(e) => setCaseStudyDesc(e.target.value)} placeholder="Tell the fuller story of this project — the problem, the process, the result..." />
            </div>
          </section>

          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn" onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save Case Study"}</button>
            <button className="btn secondary" onClick={onBack}>Back</button>
            {saved && <span style={{ color: "var(--accent-2)", alignSelf: "center", fontSize: 13 }}>Saved!</span>}
          </div>
        </div>

        <section className="ad-card" style={{ padding: 24, position: "sticky", top: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <h3 style={{ fontSize: 16, margin: 0 }}>Preview</h3>
            {hasFigma && showFigmaLink && (
              <a href={project.figma} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "var(--accent-2)", textDecoration: "underline" }}>
                Open Figma file ↗
              </a>
            )}
          </div>

          {hasFigma && (
            <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, fontSize: 13, color: "var(--text)", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={showFigmaLink}
                onChange={(e) => setShowFigmaLink(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: "var(--accent-bg)", cursor: "pointer" }}
              />
              Show the "Open Figma file" link next to Preview (visitors can click it to open your Figma file directly)
            </label>
          )}

          {showFigmaEmbed ? (
            <>
              {/* Live Figma viewer — drag, zoom, switch pages, fullscreen */}
              <div style={{ width: "100%", height: 460, borderRadius: 12, overflow: "hidden", background: "#1e1e1e", border: "1px solid var(--border)" }}>
                <iframe
                  title="Figma preview"
                  src={figmaEmbedUrl(project.figma)}
                  allowFullScreen
                  loading="lazy"
                  style={{ width: "100%", height: "100%", border: 0, display: "block" }}
                />
              </div>
              <p style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 8, lineHeight: 1.5 }}>
                Click <b>Save Case Study</b> to apply. If the preview asks for a login, set the file to “Anyone with the link can view” in Figma.
              </p>
            </>
          ) : (
            <>
              {coverImage ? (
                <img
                  src={resolveImg(coverImage)}
                  alt="Cover"
                  style={{ display: "block", width: "100%", aspectRatio: "16 / 10", objectFit: "cover", borderRadius: 12, marginBottom: 14, border: "1px solid var(--border)" }}
                />
              ) : (
                <div className="ad-card ad-empty" style={{ height: 180, marginBottom: 14 }}>No cover image yet</div>
              )}
              {caseStudyImages.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 14 }}>
                  {caseStudyImages.map((img, i) => (
                    <img key={i} src={resolveImg(img)} alt={`Case study ${i + 1}`} style={{ display: "block", width: "100%", aspectRatio: "16 / 10", objectFit: "cover", borderRadius: 8 }} />
                  ))}
                </div>
              )}
              <p style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.5 }}>
                Add a Figma link to this project (Edit → Figma Link) to show a live, draggable Figma preview instead of this image board.
              </p>
            </>
          )}

          {caseStudyDesc && <p style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6, marginTop: 14 }}>{caseStudyDesc}</p>}
        </section>
      </div>
    </div>
  );
}