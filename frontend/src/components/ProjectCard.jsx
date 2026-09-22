import { useRef, useState, useEffect } from "react";
import { ArrowRight } from "./icons";

export function ProjectCard({ title, tags, tag, desc, img, figma, delay = 0, animate = true, tk, onOpen, ...project }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const resolvedTags = tags || (tag ? [tag] : []);

  useEffect(() => {
    if (!animate) return;
    const el = ref.current; if (!el) return;
    el.classList.add("rv");
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("on"); obs.unobserve(el); } },
      { threshold: 0.06 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [animate]);

  const handleOpen = () => onOpen?.({ title, tags, tag, desc, img, figma, ...project });

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleOpen(); } }}
      className="pc pcard"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: tk.cardBg, border: `1px solid ${hovered ? "#A65FD7" : tk.cardBorder}`, borderRadius: 10,
        padding: "16px 10px", display: "flex", flexDirection: "column", gap: 16,
        transitionDelay: `${delay}s`,
        boxShadow: hovered ? `-4px -4px 10px rgba(187,114,239,0.30), 4px 4px 10px rgba(187,114,239,0.30)` : tk.moonIcon ? `2px 2px 8px ${tk.cardShadow}` : "none",
        transform: hovered ? "translateY(-6px)" : "none",
        transition: "transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s ease, border-color .3s ease, background .4s",
        cursor: "pointer",
      }}
    >
      <div style={{ height: 183, borderRadius: 10, overflow: "hidden", position: "relative", flexShrink: 0, background: tk.cardBg }}>
        <div style={{
          position: "absolute", inset: 0,
          background: tk.moonIcon ? "linear-gradient(135deg, #f0e8f8 0%, #e2d0f0 100%)" : "linear-gradient(135deg, #1a0a2e 0%, #2d1050 100%)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 0,
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" opacity="0.3">
            <rect x="3" y="3" width="18" height="18" rx="3" stroke={tk.moonIcon ? "#8B31CA" : "#CEA4EB"} strokeWidth="1.5" />
            <circle cx="8.5" cy="8.5" r="1.5" fill={tk.moonIcon ? "#8B31CA" : "#CEA4EB"} />
            <path d="M3 15l5-4 4 3 3-2.5 6 5.5" stroke={tk.moonIcon ? "#8B31CA" : "#CEA4EB"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <img
          src={img}
          alt={title}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
            transform: hovered ? "scale(1.08)" : "scale(1)",
            transition: "transform .5s cubic-bezier(.22,1,.36,1)",
            zIndex: 1,
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 9, padding: "0 6px" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {resolvedTags.map(t => (
            <span key={t} style={{
              display: "inline-flex", alignItems: "center", height: 19, padding: "4px 12px",
              background: tk.cardTag, borderRadius: 16,
              fontFamily: "Inter,sans-serif", fontSize: 10, fontWeight: 600, lineHeight: "20px",
              color: tk.cardTagText, whiteSpace: "nowrap", transition: "background .4s",
            }}>{t}</span>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <p style={{ fontFamily: "Inter,sans-serif", fontSize: 16, fontWeight: 500, lineHeight: "22px", color: tk.cardTitle, transition: "color .4s" }}>{title}</p>
          <p style={{ fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 400, lineHeight: "20px", color: tk.cardDesc, transition: "color .4s" }}>{desc}</p>
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${tk.cardBorder}`, padding: "8px 6px 6px", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{
          fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 600, lineHeight: "20px",
          color: hovered ? tk.cardLinkHover : tk.cardLink,
          display: "flex", alignItems: "center", gap: 8, transition: "color .2s",
        }}>
          View Case Study <ArrowRight color={hovered ? tk.cardLinkHover : tk.cardLink} />
        </span>
      </div>
    </div>
  );
}