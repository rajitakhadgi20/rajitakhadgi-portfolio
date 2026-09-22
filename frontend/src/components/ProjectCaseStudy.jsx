import { useEffect, useState } from "react";
import { CaseStudyPreview } from "./CaseStudyPreview";

function fullDateLabel(value) {
  if (!value) return "—";
  const d = new Date(`${value}T00:00:00`);
  if (isNaN(d)) return value;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

const panelStyle = {
  background: "linear-gradient(160deg, #f2eaf9 0%, #d9bff0 55%, #f6eefc 100%)",
  borderRadius: 20,
  padding: "48px 32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export function ProjectCaseStudy({ project, tk, onBack }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { window.scrollTo({ top: 0 }); const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, [project]);

  if (!project) return null;

  const cover = project.coverImage || project.img;
  const meta = [
    { label: "Client", value: project.client || "—" },
    { label: "Date", value: fullDateLabel(project.date) },
    { label: "Type", value: (project.tags || []).join(", ") || "—" },
    { label: "Role", value: project.role || "—" },
  ];

  return (
    <div style={{ background: tk.bg, minHeight: "100vh", paddingTop: 55, transition: "background .4s ease" }}>
      <div className="pf-inner" style={{ paddingTop: 32, display: "flex", flexDirection: "column", gap: 32 }}>
        {/* Back button */}
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          style={{
            width: 40, height: 40, borderRadius: "50%", border: `1px solid ${tk.cardBorder}`,
            background: tk.cardBg, color: tk.accentTitle, display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer",
            opacity: mounted ? 1 : 0, transition: "opacity .4s ease",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Title + description */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 820 }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 40, color: tk.accentTitle }}>{project.title}</h1>
          {project.desc && <p style={{ fontFamily: "Inter, sans-serif", fontSize: 16, lineHeight: "26px", color: tk.cardDesc }}>{project.desc}</p>}
        </div>

        {/* Meta grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 24, borderTop: `1px solid ${tk.cardBorder}`, borderBottom: `1px solid ${tk.cardBorder}`, padding: "24px 0" }}>
          {meta.map((m) => (
            <div key={m.label}>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: tk.cardDesc, marginBottom: 6 }}>{m.label}:</p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 500, color: tk.accentTitle }}>{m.value}</p>
            </div>
          ))}
        </div>

        {/* Cover */}
        {cover && (
          <div style={panelStyle}>
            <img src={cover} alt={project.title} style={{ maxWidth: "100%", maxHeight: 480, borderRadius: 12, boxShadow: "0 20px 50px rgba(0,0,0,0.2)" }} />
          </div>
        )}

        {/* Case study body text */}
        {project.caseStudyDesc && (
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 16, lineHeight: "28px", color: tk.cardDesc, maxWidth: 820 }}>
            {project.caseStudyDesc}
          </p>
        )}

        {/* Preview: live Figma viewer if a Figma link exists, otherwise the image board */}
        {(() => {
          const pages = [
            cover ? { name: "Cover", img: cover } : null,
            ...(project.caseStudyImages || []).map((img, i) => ({ name: `Image ${i + 1}`, img })),
          ].filter(Boolean);
          return (
            <CaseStudyPreview
              pages={pages}
              figma={project.figma}
              showFigmaLink={project.showFigmaLink !== false}
              tk={tk}
            />
          );
        })()}

        {/* Every uploaded case-study image, each framed in its own panel */}
        {(project.caseStudyImages || []).map((img, i) => (
          <div key={i} style={panelStyle}>
            <img src={img} alt={`${project.title} ${i + 1}`} style={{ maxWidth: "100%", borderRadius: 12, boxShadow: "0 20px 50px rgba(0,0,0,0.2)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}