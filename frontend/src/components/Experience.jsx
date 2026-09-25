import { useState } from "react";
import { useReveal } from "../hooks/useReveal";

function ExperienceItem({ item, index, last, tk }) {
  const ref = useReveal("rl");
  const [hover, setHover] = useState(false);
  const dates = `${item.startDate || "—"} – ${item.endDate || "Present"}`;

  return (
    <li ref={ref} style={{ position:"relative", paddingLeft:44, paddingBottom: last ? 0 : 28, transitionDelay:`${index * 0.08}s` }}>
      {/* timeline line + dot */}
      {!last && <span aria-hidden="true" style={{ position:"absolute", left:7, top:22, bottom:-6, width:2, background:tk.divider, borderRadius:2 }}/>}
      <span aria-hidden="true" style={{
        position:"absolute", left:0, top:6, width:16, height:16, borderRadius:"50%",
        background: hover ? tk.statNum : tk.bg, border:`2px solid ${tk.statNum}`,
        transition:"background .3s, border-color .4s",
      }}/>

      <div
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          background:tk.cardBg, border:`1px solid ${hover ? tk.statNum : tk.cardBorder}`, borderRadius:12,
          padding:"24px 28px", boxShadow: hover ? `0 8px 28px ${tk.cardShadow}` : "none",
          transition:"border-color .3s, box-shadow .3s, background .4s",
        }}
      >
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, flexWrap:"wrap" }}>
          <div style={{ minWidth:0 }}>
            <h3 style={{ fontFamily:"Inter,sans-serif", fontWeight:600, fontSize:20, lineHeight:"28px", color:tk.cardTitle, transition:"color .4s" }}>{item.role}</h3>
            {item.company && (
              <p style={{ fontFamily:"Inter,sans-serif", fontSize:16, lineHeight:"24px", color:tk.cardLink, marginTop:2, transition:"color .4s" }}>
                {item.company}{item.type && ` · ${item.type}`}
              </p>
            )}
          </div>
          <span style={{
            fontFamily:"Inter,sans-serif", fontSize:13, fontWeight:500, lineHeight:"18px", whiteSpace:"nowrap",
            padding:"5px 12px", borderRadius:999, background:tk.cardTag, color:tk.cardTagText,
          }}>{dates}</span>
        </div>
        {item.description && (
          <p style={{ fontFamily:"Inter,sans-serif", fontSize:16, lineHeight:"26px", color:tk.cardDesc, marginTop:14, transition:"color .4s" }}>{item.description}</p>
        )}
      </div>
    </li>
  );
}

export function Experience({ tk, items }) {
  const hdr = useReveal("rv");
  if (!items || items.length === 0) return null;

  return (
    <section id="experience" style={{ background:tk.bgSection, overflow:"hidden", padding:"100px 0 120px", transition:"background .4s ease" }}>
      <div className="pf-inner">
        <h2 ref={hdr} style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:700, fontSize:32, lineHeight:"42px", letterSpacing:"1.5px", color:tk.accentTitle, marginBottom:48, transition:"color .4s" }}>EXPERIENCE</h2>
        <ol style={{ listStyle:"none", maxWidth:900, margin:0, padding:0 }}>
          {items.map((item, i) => (
            <ExperienceItem key={item.id ?? i} item={item} index={i} last={i === items.length - 1} tk={tk}/>
          ))}
        </ol>
      </div>
    </section>
  );
}