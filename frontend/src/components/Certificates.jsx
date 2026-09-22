import { useState } from "react";
import { A } from "../data/assets";
import { useReveal } from "../hooks/useReveal";
import { TickIcon } from "./icons";

const CERTS = [
  "Completion of UI/UX Internship at Yoddha lab Studio.",
  "Completion of UI/UX Traineeship at Web Studio Nepal.",
  "Certificate of Completion of Intro to UI/UX Design.",
  "Certificate of Completion of Basics of UI UX Strategy.",
];

export function Certificates({ tk }) {
  const hdr = useReveal("rv");
  const lst = useReveal("rl");
  const vis = useReveal("rr");
  const [hovered, setHovered] = useState(false);
  const T = "transform .5s cubic-bezier(.22,1,.36,1), left .5s cubic-bezier(.22,1,.36,1), top .5s cubic-bezier(.22,1,.36,1)";
  return (
    <section id="certificates" style={{ background:tk.bgSection,overflow:"hidden",padding:"100px 0 120px",transition:"background .4s ease" }}>
      <div className="pf-inner">
        <h2 ref={hdr} style={{ fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:32,lineHeight:"42px",letterSpacing:"1.5px",color:tk.sectionTitle,marginBottom:20,transition:"color .4s" }}>Certificates</h2>
        <div className="cert-g">
          <ul ref={lst} style={{ display:"flex",flexDirection:"column",gap:28 }}>
            {CERTS.map((t,i) => (
              <li key={i} style={{ display:"flex",gap:12,alignItems:"center" }}>
                <TickIcon color={tk.certTickStroke}/>
                <p style={{ fontFamily:"Inter,sans-serif",fontSize:18,fontWeight:400,lineHeight:"28px",color:tk.certText,transition:"color .4s" }}>{t}</p>
              </li>
            ))}
          </ul>
          <div className="cert-v" ref={vis}
            onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
            style={{ width:"100%",maxWidth:720,height:287.64,overflowX:hovered?"scroll":"hidden",overflowY:"hidden",position:"relative",borderRadius:4 }}>
            <div style={{ position:"relative",width:800,height:"100%" }}>
              <img src={A.certR} alt="" style={{ position:"absolute",width:hovered?269:272,height:hovered?193:196,left:hovered?491:428,top:hovered?101:81,transform:hovered?"rotate(0deg)":"rotate(9deg)",transformOrigin:"top left",borderRadius:6,objectFit:"cover",transition:T }}/>
              <img src={A.certL} alt="" style={{ position:"absolute",width:hovered?276:277,height:hovered?195:196,left:hovered?-33:33,top:hovered?101:124,transform:hovered?"rotate(0deg)":"rotate(-9deg)",transformOrigin:"top left",borderRadius:6,objectFit:"cover",transition:T }}/>
              <img src={A.certC} alt="" style={{ position:"absolute",width:hovered?220:222,height:hovered?320:324,left:257,top:hovered?32:33,borderRadius:6,objectFit:"cover",transition:T }}/>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

