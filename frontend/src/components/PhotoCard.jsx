import { useRef, useState } from "react";
import { A } from "../data/assets";

export function PhotoCard({ isV2, T, tk }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const onMouseMove = (e) => {
    const card = cardRef.current; if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    card.style.transform = `perspective(900px) rotateX(${-(y-0.5)*10}deg) rotateY(${(x-0.5)*10}deg) scale(1.02)`;
    if (glowRef.current) glowRef.current.style.background =
      `radial-gradient(180px circle at ${x*100}% ${y*100}%, rgba(215,188,255,0.55) 0%, transparent 70%)`;
  };
  const onMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
    if (glowRef.current) glowRef.current.style.background = "transparent";
    setHovered(false);
  };

  return (
    <div style={{ position:"absolute", left:924, top:184, width:308, height:413,
      opacity: isV2?1:0, transform: isV2?"translateX(0)":"translateX(60px) scale(0.95)",
      transition:`opacity ${T}, transform ${T}`, transitionDelay:"150ms", zIndex:5 }}>
      <div ref={cardRef} onMouseMove={onMouseMove} onMouseEnter={() => setHovered(true)} onMouseLeave={onMouseLeave}
        style={{
          width:"100%", height:"100%", borderRadius:16,
          border:`4px solid ${tk.portraitBorder}`,
          overflow:"hidden", position:"relative", cursor:"default",
          transition:"transform 0.2s ease-out, border-color .4s ease", transformStyle:"preserve-3d", willChange:"transform"
        }}>
        <img src={A.portrait} alt="Rajita Khadgi" style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }}/>
        <div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.22)",pointerEvents:"none" }}/>
        <div ref={glowRef} style={{ position:"absolute",inset:0,background:"transparent",pointerEvents:"none",
          transition: hovered?"background 0.05s linear":"background 0.4s ease", zIndex:2,mixBlendMode:"screen" }}/>
        <div style={{ position:"absolute",inset:0,borderRadius:14,
          boxShadow: hovered?"inset 0 0 0 1px rgba(215,188,255,0.5), 0 0 40px rgba(166,95,215,0.4)":"none",
          pointerEvents:"none", transition:"box-shadow 0.3s ease", zIndex:3 }}/>
        <div style={{ position:"absolute",left:15,top:334,width:279,padding:"10px 12px",
          background:"rgba(255,255,255,0.14)",backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)",
          borderRadius:8,border:"1px solid rgba(255,255,255,0.12)",
          display:"flex",alignItems:"center",justifyContent:"space-between",zIndex:4 }}>
          <div style={{ display:"flex",alignItems:"center",gap:9 }}>
            <div style={{ width:33,height:33,borderRadius:"50%",background:"linear-gradient(135deg,#a65fd7,#5a0297)",flexShrink:0,overflow:"hidden" }}>
              <img src={A.portrait} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:3 }}>
              <p style={{ fontFamily:"Inter",fontSize:12,fontWeight:600,lineHeight:"16px",color:"#FBFBFB",letterSpacing:"0.3px" }}>RAJITA KHADGI</p>
              <div style={{ display:"flex",alignItems:"center",gap:4 }}>
                <div style={{ width:6,height:6,borderRadius:"50%",background:"#4ade80",flexShrink:0 }}/>
                <p style={{ fontFamily:"Inter",fontSize:10,fontWeight:400,lineHeight:"14px",color:"#E1E1E1" }}>Online</p>
              </div>
            </div>
          </div>
          <a href="#contact" style={{ height:28,padding:"4px 10px",background:"rgba(255,255,255,0.20)",borderRadius:7,display:"flex",alignItems:"center",cursor:"pointer",textDecoration:"none" }}>
            <p style={{ fontFamily:"Inter",fontSize:11,fontWeight:600,lineHeight:"18px",color:"white",whiteSpace:"nowrap" }}>Contact Me</p>
          </a>
        </div>
      </div>
    </div>
  );
}

