import { useState, useRef, useEffect } from "react";
import { A } from "../data/assets";
import { useReveal } from "../hooks/useReveal";

export function SkillCard({ name, sub, icon, delay=0, tk, isFirst=false }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.classList.add("rv");
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("on"); obs.unobserve(el); } }, { threshold:0.06 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const T = ".5s cubic-bezier(.22,1,.36,1)";
  const lCardBg    = isFirst ? "#F8F8F8"           : "#FBFBFB";
  const lOutline   = isFirst ? "1px #BCBCBC solid" : "1px rgba(188,188,188,0.80) solid";
  const lIconBoxBg = isFirst ? "#F0F0F0"           : "#F1EBF5";
  return (
    <div ref={ref} className="scard"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        transitionDelay:`${delay}s`,
        background: tk.moonIcon ? lCardBg : tk.skillBg,
        borderRadius:12,
        cursor:"pointer",
        outline: tk.moonIcon ? lOutline : "none",
        outlineOffset:"-1px",
        boxSizing:"border-box",
        position:"relative", overflow:"hidden",
        transition:`background ${T}`,
      }}>
      <div style={{ position:"absolute",inset:0,background:"#8b31ca",borderRadius:12,transform:hovered?"translate(0,0)":"translate(102%,102%)",transition:`transform ${T}`,zIndex:0,pointerEvents:"none" }}/>
      <div style={{ width:63,height:63,left:16,top:16,position:"absolute",background:hovered?"rgba(255,255,255,0.15)":(tk.moonIcon?lIconBoxBg:tk.skillIconBg),borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",zIndex:2,transition:`background ${T}` }}>
        <img src={icon} alt={name} style={{ width:36,height:36,objectFit:"contain",filter:hovered?"brightness(0) invert(1)":tk.moonIcon?"invert(43%) sepia(55%) saturate(700%) hue-rotate(253deg) brightness(92%) contrast(95%)":"none",transition:`filter ${T}` }}/>
      </div>
      <div style={{ width:198,left:16,top:91,position:"absolute",display:"inline-flex",flexDirection:"column",justifyContent:"flex-start",alignItems:"flex-start",gap:5,zIndex:2 }}>
        <p style={{ margin:0,alignSelf:"stretch",color:hovered?"#fff":tk.skillName,fontSize:18,fontFamily:"Inter,sans-serif",fontWeight:500,lineHeight:"28px",wordWrap:"break-word",transition:`color ${T}` }}>{name}</p>
        <p style={{ margin:0,alignSelf:"stretch",color:hovered?"rgba(255,255,255,0.80)":tk.skillSub,fontSize:14,fontFamily:"Inter,sans-serif",fontWeight:400,lineHeight:"20px",wordWrap:"break-word",transition:`color ${T}` }}>{sub}</p>
      </div>
      <div style={{ width:100,height:100,left:231,top:154,position:"absolute",background:hovered?"rgba(255,255,255,0.15)":(tk.moonIcon?(isFirst?"#A65FD7":"#8B31CA"):"#CEA4EB"),borderRadius:8,zIndex:1,transition:`background ${T}` }}/>
    </div>
  );
}

const SKILLS = [
  { name:"Figma",         sub:"UI Design & Component Systems",              icon:A.skFig },
  { name:"Sketch",        sub:"Symbol-Based Layout & Interface Creation",   icon:A.skSkt },
  { name:"User Research", sub:"Insights Gathering & Usability Evaluation",  icon:A.skRes },
  { name:"Prototype",     sub:"Interactive Flows & Experience Validation",  icon:A.skPro },
  { name:"Web Design",    sub:"Responsive Layout & Visual Structure",       icon:A.skWeb },
  { name:"Wireframing",   sub:"Scalable Interface & Structured Components", icon:A.skWir },
  { name:"Design System", sub:"Visual Standards & Reusable Components",     icon:A.skDes },
  { name:"HTML & CSS",    sub:"Structured Markup & Responsive Styling",     icon:A.skHtm },
];


export function Skills({ tk }) {
  const hdr = useReveal("rv");
  return (
    <section id="skills" style={{ background:tk.bgAlt, overflow:"hidden", padding:"100px 0 120px", transition:"background .4s ease" }}>
      <div className="pf-inner" style={{ boxSizing:"border-box" }}>
        <h2 ref={hdr} style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:700, fontSize:32, lineHeight:"42px", letterSpacing:"1.5px", color:tk.sectionTitle, transition:"color .4s" }}>TOOLS &amp; SKILLS</h2>
        <div style={{ display:"flex", flexDirection:"column", gap:40, marginTop:57, width:"100%" }}>
          <div className="srow sk-row1">{SKILLS.slice(0,5).map((s,i) => <SkillCard key={s.name} {...s} delay={i*0.07} tk={tk} isFirst={i===0}/>)}</div>
          <div className="srow sk-row2">{SKILLS.slice(5,8).map((s,i) => <SkillCard key={s.name} {...s} delay={i*0.07} tk={tk}/>)}</div>
        </div>
      </div>
    </section>
  );
}

