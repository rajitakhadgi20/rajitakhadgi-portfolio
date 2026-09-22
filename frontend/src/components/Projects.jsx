import { useState, useEffect } from "react";
import { useReveal } from "../hooks/useReveal";
import { ProjectCard } from "./ProjectCard";

/* Home page grid: first 8 projects from the live/fallback project list */
export function Projects({ setPage, setSkipAnim, tk, projects, onOpen }) {
  const hdr = useReveal("rv");
  return (
    <section id="projects" style={{ background:tk.bgSection,overflow:"hidden",padding:"100px 0 120px",transition:"background .4s ease" }}>
      <div className="pf-inner">
        <div ref={hdr} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:57 }}>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:32,lineHeight:"42px",letterSpacing:"1.5px",color:tk.accentTitle,transition:"color .4s" }}>LATEST PROJECT</h2>
          <button onClick={() => { setSkipAnim(true); setPage("projects"); window.scrollTo({top:0,behavior:"smooth"}); }} className="bs" style={{ cursor:"pointer" }}>
            <span className="bs-outside-arr"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
            <span className="bs-inner">See All<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
          </button>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:30 }}>
          <div className="prow">{projects.slice(0,4).map((p,i) => <ProjectCard key={p.title} {...p} delay={i*0.08} tk={tk} onOpen={onOpen}/>)}</div>
          <div className="prow">{projects.slice(4,8).map((p,i) => <ProjectCard key={p.title} {...p} delay={i*0.08} tk={tk} onOpen={onOpen}/>)}</div>
        </div>
      </div>
    </section>
  );
}


/* Full grid shown on the "All Projects" page */
export function AllProjectsPage({ setPage, setSkipAnim, tk, projects, onOpen }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  return (
    <div style={{ background:tk.bg,minHeight:"100vh",paddingTop:55,transition:"background .4s ease" }}>
      <div className="pf-inner" style={{ paddingTop:32 }}>
        <div style={{
          display:"inline-flex",justifyContent:"space-between",alignItems:"center",width:"100%",
          opacity: mounted?1:0, transform: mounted?"translateY(0)":"translateY(-10px)",
          transition:"opacity .5s ease, transform .5s ease",
        }}>
          <div style={{ display:"flex",justifyContent:"flex-start",alignItems:"center",gap:6 }}>
            <span
              onClick={() => { setSkipAnim(true); setPage("home"); setTimeout(() => window.scrollTo({top:0,behavior:"smooth"}),50); }}
              style={{ color:tk.breadcrumb,fontSize:16,fontFamily:"Inter",fontWeight:400,lineHeight:"22px",cursor:"pointer",transition:"color .2s,opacity .2s" }}
              onMouseEnter={e => e.currentTarget.style.opacity="0.6"}
              onMouseLeave={e => e.currentTarget.style.opacity="1"}
            >Home</span>
            <div style={{ width:4,height:4,background:tk.breadcrumbDot,borderRadius:9999 }}/>
            <span style={{ color:tk.breadcrumb,fontSize:16,fontFamily:"Inter",fontWeight:400,lineHeight:"22px" }}>Projects</span>
          </div>
        </div>
      </div>
      <div style={{ padding:"48px 0 120px" }}>
        <div className="pf-inner">
          <div className="ap-grid">
            {projects.map((p,i) => (
              <div key={p.title} style={{
                opacity: mounted?1:0,
                transform: mounted?"translateY(0)":"translateY(28px)",
                transition:`opacity .6s ease ${0.08+i*0.07}s, transform .6s ease ${0.08+i*0.07}s`,
              }}>
                <ProjectCard {...p} animate={false} tk={tk} onOpen={onOpen}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

