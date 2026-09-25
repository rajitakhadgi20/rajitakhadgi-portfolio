import { useState, useEffect } from "react";
import { A } from "../data/assets";
import { PhotoCard } from "./PhotoCard";
import { HeroSocialIcon, LinkedInSVG, DribbbleSVG, InstagramSVG } from "./icons";
import { ThemeToggleBtn } from "./ThemeToggleBtn";

export function Hero({ setPage, skipAnimation, onAnimDone, tk, toggleTheme }) {
  const [v, setV] = useState(skipAnimation ? 2 : 1);
  useEffect(() => {
    if (skipAnimation) return;
    const t = setTimeout(() => { setV(2); onAnimDone?.(); }, 1000);
    return () => clearTimeout(t);
  }, [skipAnimation]);

  const isV2 = v === 2;
  const T = "1000ms cubic-bezier(0.37, 0, 0.63, 1)";
  const V1_TOP = "calc(50% - 137px)";
  const V1_LEFT = 143;
  const isLight = tk.moonIcon;

  return (
    <section id="home" style={{ position:"relative",height:724,overflow:"hidden",
      background: isLight ? "#ffffff" : "#160126" }}>
      {!isLight && <img src={A.heroBg} alt="" style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",pointerEvents:"none" }}/>}
      {isLight && <img src={A.heroBgLight} alt="" style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",pointerEvents:"none" }}/>}

      <div style={{ position:"relative", maxWidth:1440, height:"100%", margin:"0 auto" }}>

            <div style={{
        position:"absolute",top:20,left:0,right:0,height:55,
        display:"grid",gridTemplateColumns:"1fr auto 1fr",alignItems:"center",padding:"0 80px",
        opacity: isV2?1:0, transform: isV2?"translateY(0)":"translateY(-16px)",
        transition:`opacity ${T}, transform ${T}`, transitionDelay:"200ms",
        pointerEvents: isV2?"auto":"none", zIndex:10,
      }}>
        <div style={{ display:"contents" }}>
          <a href="#home" style={{ gridColumn:1,justifySelf:"start",width:63,height:40,display:"block",flexShrink:0,overflow:"hidden" }}>
            <img src={tk.moonIcon ? A.logoLight : A.logoDark} alt="RK" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
          </a>
          <div className="hero-links" style={{ gridColumn:2,display:"flex",alignItems:"center" }}>
            {[["Home","home"],["About","about"],["Projects","projects"],["Skills","skills"],["Experience","experience"],["Certificate","certificates"],["Gallery","gallery"],["Contact","contact"]].map(([l,id],i) => (
              <a key={l} href={`#${id}`} style={{
                position:"relative",display:"flex",alignItems:"center",justifyContent:"center",
                padding:"8px 16px",height:36,color:tk.navLink,
                fontFamily:"Inter,sans-serif",fontSize:16,fontWeight:400,lineHeight:"22px",
                whiteSpace:"nowrap",textDecoration:"none",
              }}>
                {l}
                {i===0 && <span style={{ position:"absolute",bottom:1,left:"50%",transform:"translateX(-50%)",width:49,height:2,background:tk.navUnderline,borderRadius:3 }}/>}
              </a>
            ))}
          </div>
        </div>
        <div style={{ gridColumn:3,justifySelf:"end",display:"flex",alignItems:"center",gap:16 }}>
          <ThemeToggleBtn tk={tk} toggleTheme={toggleTheme}/>
          <a href="#contact" className="bh"><span style={{ position:"relative",zIndex:1 }}>Hire Me</span></a>
        </div>
      </div>

      <p style={{
        position:"absolute",left:V1_LEFT,
        top: isV2 ? 268 : V1_TOP,
        fontFamily:"'Cormorant Garamond',serif",fontWeight:700,
        fontSize: isV2?32:56, lineHeight: isV2?"42px":"68px",
        letterSpacing: isV2?"1.5px":"0px",
        color: tk.heroGreeting,
        transition:`top ${T}, font-size ${T}, line-height ${T}, letter-spacing ${T}`,
        zIndex:5,pointerEvents:"none",willChange:"top,font-size",
      }}>Hello, I&apos;m</p>

      <p style={{
        position:"absolute",left:V1_LEFT,
        top: isV2 ? 310 : `calc(${V1_TOP} + 68px)`,
        fontFamily:"'Poppins',sans-serif",fontWeight:700,
        fontSize: isV2?46:84, lineHeight: isV2?"54px":"91px",
        color: tk.heroName,
        transition:`top ${T}, font-size ${T}, line-height ${T}`,
        zIndex:5,pointerEvents:"none",willChange:"top,font-size",
      }}>RAJITA KHADGI</p>

      <p style={{
        position:"absolute",left:V1_LEFT,top:`calc(${V1_TOP} + 68px + 91px)`,
        width:"min(945px, calc(100vw - 163px))",
        fontFamily:"'Cormorant Garamond',serif",fontWeight:700,
        fontSize:68,lineHeight:"88px",
        color: isLight ? "#464646" : "#DADADA",
        opacity: isV2?0:1, transform: isV2?"translateY(-8px)":"translateY(0)",
        transition:`opacity ${T}, transform ${T}`,
        zIndex:5,pointerEvents:"none",
      }}>Welcome to my Portfolio Website</p>

      <div style={{
        position:"absolute",left:V1_LEFT,top:376,width:615,
        display:"flex",flexDirection:"column",alignItems:"flex-start",
        opacity: isV2?1:0, transform: isV2?"translateY(0)":"translateY(18px)",
        transition:`opacity ${T}, transform ${T}`, transitionDelay:"350ms",
        zIndex:5,pointerEvents: isV2?"auto":"none",
      }}>
        <p style={{ color:tk.heroSub,fontSize:22,fontFamily:"'Poppins',sans-serif",fontWeight:700,lineHeight:"26px",letterSpacing:"0.5px",marginBottom:20 }}>UI/UX Designer</p>
        <p style={{ width:615,color:tk.heroDesc,fontSize:16,fontFamily:"Inter,sans-serif",fontWeight:400,lineHeight:"22px",marginBottom:22 }}>
          Crafting seamless user experiences through thoughtful design, visual precision, and user-centered thinking to create intuitive, impactful interfaces.
        </p>
        <div style={{ display:"flex",alignItems:"center",gap:4,marginBottom:28 }}>
          {[
            ["LinkedIn",  LinkedInSVG,  "https://www.linkedin.com/in/rajita-khadgi-bbb16b30b"],
            ["Dribble",   DribbbleSVG,  "https://dribbble.com/Raajiii"],
            ["Instagram", InstagramSVG, "https://www.instagram.com/rajita_shahi?igsh=czhuNm5oaWd3MXZ2"],
          ].map(([label,Icon,url]) => (
            <HeroSocialIcon key={label} label={label} Icon={Icon} color={isLight?"light":"dark"} url={url}/>
          ))}
        </div>
        <a href="/image/Rajita Khadgi_Resume.pdf" download="Rajita Khadgi_Resume.pdf" className="btn-dlcv" style={{
          width:178,height:40,background:"#8b31ca",borderRadius:8,
          display:"inline-flex",alignItems:"center",paddingLeft:20,gap:10,
          color:"white",fontFamily:"Inter,sans-serif",fontSize:16,fontWeight:500,
          textDecoration:"none",flexShrink:0,
        }}
        onMouseOver={e => e.currentTarget.style.transform="translateY(-1px)"}
        onMouseOut={e => e.currentTarget.style.transform="none"}>
          <span style={{ position:"relative",zIndex:1 }}>Download CV</span>
          <svg style={{ position:"relative",zIndex:1,flexShrink:0 }} width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 3v13M7 11l5 5 5-5M3 21h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>

      <PhotoCard isV2={isV2} T={T} tk={tk}/>

      </div>
    </section>
  );
}