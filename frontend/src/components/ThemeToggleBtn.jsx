import { useState } from "react";
import { SunSVG, MoonSVG } from "./icons";

export function ThemeToggleBtn({ tk, toggleTheme, className="" }) {
  const [hov, setHov] = useState(false);
  const isLight = tk.moonIcon;
  return (
    <button aria-label="Toggle theme" className={className}
      onClick={toggleTheme}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width:32, height:32, borderRadius:"50%",
        background: tk.toggleBg,
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        display:"flex", alignItems:"center", justifyContent:"center",
        border:`1px solid ${tk.toggleBorder}`, cursor:"pointer", flexShrink:0,
        position:"relative", overflow:"hidden",
        transform: hov ? "scale(1.08) rotate(18deg)" : "scale(1) rotate(0deg)",
        transition:"transform .3s ease, background .3s ease",
        color: tk.toggleIcon,
      }}>
      <span style={{ position:"relative", zIndex:1, width:20, height:20, display:"flex", alignItems:"center", justifyContent:"center" }}>
        {isLight ? <MoonSVG/> : <SunSVG/>}
      </span>
    </button>
  );
}

