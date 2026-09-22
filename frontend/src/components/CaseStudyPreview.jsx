import { useMemo, useRef, useState, useEffect } from "react";
import { isFigmaUrl, figmaEmbedUrl } from "../lib/figma";

/* Case-study preview.
   - Whenever a Figma link is set, the public page shows the live Figma iframe.
   - If no Figma link is set, it falls back to your own uploaded images as a
     browsable, multi-page board (dropdown to pick a page, drag/scroll, zoom,
     fullscreen).
   - showFigmaLink only controls whether the "Open Figma file ↗" link next to
     the "Preview" heading is shown — it does NOT affect which preview renders. */
export function CaseStudyPreview({ pages = [], figma, showFigmaLink = true, tk }) {
  const hasFigma = isFigmaUrl(figma);
  const showFigmaEmbed = hasFigma;

  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const [selected, setSelected] = useState(0);
  const [zoom, setZoom] = useState(60);
  const [fullscreen, setFullscreen] = useState(false);
  const [figmaLoaded, setFigmaLoaded] = useState(false);

  useEffect(() => {
    if (showFigmaEmbed) return;
    cardRefs.current[selected]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [selected, fullscreen, showFigmaEmbed]);

  const zoomIn = () => setZoom((z) => Math.min(150, z + 10));
  const zoomOut = () => setZoom((z) => Math.max(20, z - 10));

  const canvas = useMemo(
    () => (
      <div
        style={{
          position: "relative",
          background: "linear-gradient(135deg, #0e0620 0%, #241247 45%, #2fae60 100%)",
          borderRadius: 16,
          overflow: "hidden",
          height: fullscreen ? "calc(100vh - 40px)" : 460,
        }}
      >
        {/* Page selector */}
        <div style={{ position: "absolute", top: 16, left: 16, zIndex: 2 }}>
          <select
            value={selected}
            onChange={(e) => setSelected(Number(e.target.value))}
            style={{
              appearance: "none",
              background: "rgba(15,10,25,0.85)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 8,
              padding: "8px 32px 8px 14px",
              fontSize: 13,
              fontFamily: "Inter, sans-serif",
              cursor: "pointer",
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='white' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
            }}
          >
            {pages.map((p, i) => (
              <option key={i} value={i} style={{ color: "#000" }}>Page: {p.name}</option>
            ))}
          </select>
        </div>

        {/* Scrollable board track */}
        <div
          ref={trackRef}
          style={{
            display: "flex",
            gap: 40,
            height: "100%",
            alignItems: "center",
            padding: "60px 80px",
            overflowX: "auto",
            scrollSnapType: "x proximity",
          }}
          className="scrollbar"
        >
          {pages.map((p, i) => (
            <img
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              src={p.img}
              alt={p.name}
              onClick={() => setSelected(i)}
              style={{
                height: "100%",
                width: "auto",
                borderRadius: "6px 6px 0 0",
                boxShadow: i === selected ? "0 20px 60px rgba(0,0,0,0.55)" : "0 10px 30px rgba(0,0,0,0.35)",
                opacity: i === selected ? 1 : 0.55,
                transform: `scale(${zoom / 100})`,
                transformOrigin: "center",
                transition: "opacity .25s ease, transform .25s ease, box-shadow .25s ease",
                cursor: "pointer",
                scrollSnapAlign: "center",
                flexShrink: 0,
              }}
            />
          ))}
        </div>

        {/* Zoom + fullscreen toolbar */}
        <div
          style={{
            position: "absolute", bottom: 16, right: 16, zIndex: 2,
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(15,10,25,0.85)", border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 10, padding: 6,
          }}
        >
          <button type="button" onClick={zoomOut} aria-label="Zoom out" style={toolBtnStyle}>−</button>
          <span style={{ color: "#fff", fontSize: 12, width: 38, textAlign: "center", fontFamily: "Inter, sans-serif" }}>{zoom}%</span>
          <button type="button" onClick={zoomIn} aria-label="Zoom in" style={toolBtnStyle}>+</button>
          <button type="button" onClick={() => setFullscreen((f) => !f)} aria-label="Toggle fullscreen" style={{ ...toolBtnStyle, marginLeft: 4 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
            </svg>
          </button>
        </div>
      </div>
    ),
    [pages, selected, zoom, fullscreen]
  );

  if (!showFigmaEmbed && !pages.length) return null;

  return (
    <div>
      {/* Header: title on the left, "Open Figma file" on the right (admin-controlled) */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 15, color: tk.accentTitle, margin: 0 }}>Preview</p>
        {hasFigma && showFigmaLink && (
          <a
            href={figma}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: tk.accentTitle, textDecoration: "underline" }}
          >
            Open Figma file ↗
          </a>
        )}
      </div>

      {showFigmaEmbed ? (
        /* Live Figma viewer — fills the whole box */
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "min(78vh, 680px)",
            minHeight: 380,
            borderRadius: 16,
            overflow: "hidden",
            background: "#1e1e1e",
          }}
        >
          {!figmaLoaded && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.6)", fontFamily: "Inter, sans-serif", fontSize: 13 }}>
              Loading Figma preview…
            </div>
          )}
          <iframe
            title="Figma preview"
            src={figmaEmbedUrl(figma)}
            allowFullScreen
            loading="lazy"
            onLoad={() => setFigmaLoaded(true)}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0, display: "block" }}
          />
        </div>
      ) : (
        <>
          {canvas}

          {fullscreen && (
            <div
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 200, display: "flex", flexDirection: "column", padding: 20 }}
              onClick={(e) => { if (e.target === e.currentTarget) setFullscreen(false); }}
            >
              <button
                type="button"
                onClick={() => setFullscreen(false)}
                style={{ alignSelf: "flex-end", marginBottom: 12, background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", borderRadius: 8, padding: "8px 14px", cursor: "pointer" }}
              >
                Close ✕
              </button>
              {canvas}
            </div>
          )}
        </>
      )}
    </div>
  );
}

const toolBtnStyle = {
  width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center",
  background: "transparent", border: "none", color: "#fff", fontSize: 16, cursor: "pointer", borderRadius: 6,
};