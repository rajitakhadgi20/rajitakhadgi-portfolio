import { useState, useRef, useEffect } from "react";
import { A } from "../data/assets";
import { useReveal } from "../hooks/useReveal";

export function About({ tk, profile }) {
  const photo = useReveal("rl");
  const content = useReveal("rr");
  const statsRef = useRef(null);
  const [counts, setCounts] = useState([0,0,0]);

  const toNum = (v, fallback) => {
    const n = parseInt(String(v ?? "").replace(/[^0-9]/g, ""), 10);
    return Number.isFinite(n) ? n : fallback;
  };
  const STATS = [
    { num: toNum(profile?.yearsExp, 1), suffix:"+", label:"YEARS OF EXPERIENCE" },
    { num: toNum(profile?.projectsDone, 8), suffix:"+", label:"PROJECTS COMPLETED" },
    { num: toNum(profile?.happyClients, 4), suffix:"+", label:"SATISFIED CLIENTS" },
  ];
  const paragraphs = (profile?.longDesc || "").split(/\n+/).filter(Boolean);

  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const el = statsRef.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; obs.unobserve(el);
      setRevealed(true);
    }, { threshold:0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Animates to the current target numbers once the section has been seen —
  // and re-runs if the real profile numbers arrive after that (the fetch can
  // finish after the user has already scrolled past this point).
  const targetsKey = STATS.map(s => s.num).join(",");
  useEffect(() => {
    if (!revealed) return;
    const targets = STATS.map(s => s.num);
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min((now - start) / 1800, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCounts(targets.map(t => Math.floor(ease * t)));
      if (p < 1) raf = requestAnimationFrame(tick); else setCounts(targets);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [revealed, targetsKey]);

  return (
    <section id="about" style={{ background:tk.bgAlt,overflow:"hidden",padding:"100px 0 120px",transition:"background .4s ease" }}>
      <div className="pf-inner">
        <div className="about-g">
          <div ref={photo} className="about-ph flip-card" style={{ flexShrink:0 }}>
            <div className="flip-card-inner">
              <div className="flip-front" style={{ border:`4px solid ${tk.aboutBorder}`, transition:"border-color .4s" }}>
                <img src={A.aboutFront} alt="Rajita Khadgi" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
              </div>
              <div className="flip-back" style={{ border:`4px solid ${tk.aboutBorder}`, transition:"border-color .4s" }}>
                <img src={A.aboutFlip} alt="Rajita Khadgi" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
                <div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.20)" }}/>
              </div>
            </div>
          </div>
          <div ref={content} style={{ display:"flex",flexDirection:"column",gap:32,alignItems:"flex-end" }}>
            <div style={{ width:"100%",display:"flex",flexDirection:"column",gap:24 }}>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:32,lineHeight:"42px",letterSpacing:"1.5px",color:tk.sectionTitle,alignSelf:"stretch",transition:"color .4s" }}>ABOUT ME</h2>
              <div style={{ display:"flex",flexDirection:"column",gap:18 }}>
                {paragraphs.map((p, i) => (
                  <p key={i} style={{ fontFamily:"Inter,sans-serif",fontSize:17,fontWeight:400,lineHeight:"28px",color:tk.bodyText,alignSelf:"stretch",transition:"color .4s" }}>{p}</p>
                ))}
              </div>
            </div>
            <div style={{ width:"100%",height:0,outline:`0.1px solid ${tk.divider}` }}/>
            <div ref={statsRef} style={{ width:"100%",display:"flex",justifyContent:"flex-start",alignItems:"center",gap:143 }}>
              {STATS.map((s,i) => (
                <div key={s.label} style={{ display:"flex",flexDirection:"column",gap:2,alignItems:"flex-start" }}>
                  <span style={{ fontFamily:"'Poppins',sans-serif",fontWeight:500,fontSize:40,lineHeight:"50px",color:tk.statNum,transition:"color .4s" }}>{counts[i]}{s.suffix}</span>
                  <span style={{ fontFamily:"Inter,sans-serif",fontSize:14,fontWeight:400,lineHeight:"20px",color:tk.statLabel,transition:"color .4s" }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}