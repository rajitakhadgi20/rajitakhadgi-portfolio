import { useEffect, useRef, useState } from "react";
import { useReveal } from "../hooks/useReveal";

/* One auto-scrolling row. The set of cards is rendered twice and the track slides
   by exactly one set (-50%), so the loop is seamless. */
function GalleryRow({ items, reverse, onOpen, tk }) {
  // Repeat short lists so one set is always wider than the screen
  const reps = Math.max(1, Math.ceil(8 / items.length));
  const set = Array.from({ length: reps }, () => items).flat();
  const seconds = Math.max(30, set.length * 5);

  return (
    <div className="gal-row">
      <div className={`gal-track${reverse ? " rev" : ""}`} style={{ animationDuration: `${seconds}s` }}>
        {[0, 1].map((copy) => (
          <ul key={copy} className="gal-set" aria-hidden={copy === 1 ? "true" : undefined}>
            {set.map((it, i) => (
              <li key={i}>
                <button
                  className="gal-card"
                  tabIndex={copy === 1 ? -1 : 0}
                  onClick={() => onOpen(it)}
                  aria-label={`View ${it.title || "design"}`}
                  style={{ background: tk.cardBg, borderColor: tk.cardBorder }}
                >
                  <img src={it.img} alt={it.title || ""} loading="lazy" draggable="false" />
                  {it.title && <span className="gal-cap">{it.title}</span>}
                </button>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export function Gallery({ tk, items }) {
  const hdr = useReveal("rv");
  const [active, setActive] = useState(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e) => { if (e.key === "Escape") setActive(null); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  if (!items || items.length === 0) return null;

  // Always a single auto-scrolling row
  const twoRows = false;
  const rowA = items;
  const rowB = [];

  return (
    <section id="gallery" style={{ background: tk.bgSection, overflow: "hidden", padding: "100px 0 120px", transition: "background .4s ease" }}>
      <div className="pf-inner">
        <h2 ref={hdr} style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 32, lineHeight: "42px", letterSpacing: "1.5px", color: tk.accentTitle, marginBottom: 40, transition: "color .4s" }}>DESIGN GALLERY</h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <GalleryRow items={rowA} onOpen={setActive} tk={tk} />
        {twoRows && <GalleryRow items={rowB} reverse onOpen={setActive} tk={tk} />}
      </div>

      {active && (
        <div className="gal-lb" role="dialog" aria-modal="true" aria-label={active.title || "Design preview"} onClick={() => setActive(null)}>
          <button ref={closeRef} className="gal-lb-x" aria-label="Close preview" onClick={() => setActive(null)}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4l12 12M16 4L4 16" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={active.img} alt={active.title || ""} />
            {active.title && <figcaption>{active.title}</figcaption>}
          </figure>
        </div>
      )}
    </section>
  );
}