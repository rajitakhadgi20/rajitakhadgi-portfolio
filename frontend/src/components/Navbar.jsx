import { useState, useEffect, useRef } from "react";
import { A } from "../data/assets";
import { ThemeToggleBtn } from "./ThemeToggleBtn";

export function Navbar({ open, setOpen, page, setPage, tk, toggleTheme }) {
  const [pastHero, setPastHero] = useState(false);
  const [activeSection, setActive] = useState("home");
  const [ind, setInd] = useState({ left:0, width:0, ready:false });
  const navRef = useRef(null);
  const linkRefs = useRef({});

    const LINKS = [
    { label:"Home",        href:"#home",         id:"home" },
    { label:"About",       href:"#about",        id:"about" },
    { label:"Projects",    href:"#projects",     id:"projects" },
    { label:"Skills",      href:"#skills",       id:"skills" },
    { label:"Experience",  href:"#experience",   id:"experience" },
    { label:"Certificate", href:"#certificates", id:"certificates" },
    { label:"Gallery",     href:"#gallery",      id:"gallery" },
    { label:"Contact",     href:"#contact",      id:"contact" },
  ];

  useEffect(() => {
    const fn = () => setPastHero(window.scrollY > 680);
    window.addEventListener("scroll", fn, { passive:true }); fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (page === "projects" || page === "case-study") { setActive("projects"); return; }
    const ids = LINKS.map(l => l.id);
    const update = () => {
      const y = window.scrollY + 80; let cur = ids[0];
      for (const id of ids) { const el = document.getElementById(id); if (el && el.offsetTop <= y) cur = id; }
      setActive(cur);
    };
    window.addEventListener("scroll", update, { passive:true }); update();
    return () => window.removeEventListener("scroll", update);
  }, [page]);

  useEffect(() => {
    const nav = navRef.current; const link = linkRefs.current[activeSection];
    if (!nav || !link) return;
    const nr = nav.getBoundingClientRect(); const lr = link.getBoundingClientRect();
    setInd({ left: lr.left - nr.left + (lr.width - 49) / 2, width:49, ready:true });
  }, [activeSection, pastHero]);

  const showNav = (page === "projects" || page === "case-study") ? true : pastHero;

  return (
    <>
      <nav className="top-nav" style={{
        position:"fixed", top:0, left:0, right:0, zIndex:1000,
        opacity: showNav ? 1 : 0,
        visibility: showNav ? "visible" : "hidden",
        pointerEvents: showNav ? "auto" : "none",
        transition:`opacity 400ms ease, visibility 0s linear ${showNav ? "0s" : "400ms"}, background .4s ease`,
        height:55, display:"grid", gridTemplateColumns:"1fr auto 1fr", alignItems:"center",
        padding:"0 80px",
        background: tk.navBg,
        backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)",
        boxShadow:"none",
      }}>
        <div style={{ display:"contents" }}>
          <a href="#home" aria-label="Home" onClick={() => setPage("home")}
            style={{ gridColumn:1, justifySelf:"start", width:63, height:40, overflow:"hidden", flexShrink:0, display:"block" }}>
            <img src={tk.moonIcon ? A.logoLight : A.logoDark} alt="RK" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
          </a>
          <div ref={navRef} className="dnav nav-ml"
            style={{ gridColumn:2, display:"flex", alignItems:"center", position:"relative" }}>
            {LINKS.map(l => (
              <a key={l.label} href={l.href}
                ref={el => { linkRefs.current[l.id] = el; }}
                onClick={(e) => {
  if (l.id === "projects") {
    if (page !== "home") { e.preventDefault(); setPage("projects"); window.scrollTo({ top: 0 }); }
    return;
  }
  if (page !== "home") setPage("home");
}}
                style={{
                  position:"relative", display:"flex", alignItems:"center", justifyContent:"center",
                  padding:"7px 17.756px", height:36, color: tk.navLink,
                  fontFamily:"Inter,sans-serif", fontSize:16, fontWeight:400, lineHeight:"22px",
                  whiteSpace:"nowrap", transition:"color .2s",
                }}
                onMouseEnter={e => e.currentTarget.style.color = tk.navLinkHover}
                onMouseLeave={e => e.currentTarget.style.color = tk.navLink}
              >{l.label}</a>
            ))}
            <span style={{
              position:"absolute", bottom:1, left:ind.left, width:ind.width, height:2,
              background: tk.navUnderline, borderRadius:3,
              opacity: ind.ready ? 1 : 0,
              transition: ind.ready ? "left 500ms cubic-bezier(.34,1.1,.64,1), opacity 300ms ease" : "none",
              pointerEvents:"none",
            }}/>
          </div>
        </div>
        <div style={{ gridColumn:3, justifySelf:"end", display:"flex", alignItems:"center", gap:16 }}>
          <ThemeToggleBtn tk={tk} toggleTheme={toggleTheme} className="dnav"/>
          <a href="#contact" className="bh dnav" onClick={() => setPage("home")}><span>Hire Me</span></a>
          <button className="ham" onClick={() => setOpen(o => !o)}
            aria-expanded={open} aria-controls="mmenu" aria-label="Menu">
            <span style={{ background:tk.navLink, transform: open ? "translateY(7px) rotate(45deg)" : "none" }}/>
            <span style={{ background:tk.navLink, opacity: open ? 0 : 1 }}/>
            <span style={{ background:tk.navLink, transform: open ? "translateY(-7px) rotate(-45deg)" : "none" }}/>
          </button>
        </div>
      </nav>
      <div id="mmenu" className="mmenu" style={{
        position:"fixed", top:55, left:0, right:0, zIndex:999,
        background: tk.mobileMenu, backdropFilter:"blur(12px)",
        borderTop: open ? `1px solid ${tk.mobileMenuBorder||tk.cardBorder}` : "none", visibility: open ? "visible" : "hidden", flexDirection:"column",
        maxHeight: open ? 400 : 0, overflow:"hidden",
        padding: open ? "16px 24px" : "0 24px",
        transition:`max-height .3s, padding .3s, visibility 0s linear ${open ? "0s" : ".3s"}`, display:"flex", gap:4,
      }}>
        {[...LINKS, { label:"Login", href:"#login", id:"login" }, { label:"Hire Me", href:"#contact", id:"hire" }].map((l) => (
          <a key={l.label} href={l.href}
            onClick={() => {
  setOpen(false);
  if (l.id === "login") { setPage("login"); return; }
  if (l.id === "projects") { setPage("projects"); window.scrollTo({ top: 0 }); return; }
  setPage("home");
}}
            style={{
              display:"block", padding:"12px 0", fontSize:16,
              color: l.id === "hire" ? "#8B31CA" : l.id === "login" ? "#8B31CA" : activeSection === l.id ? "#8B31CA" : tk.navLink,
              borderBottom: (l.id === "hire" || l.id === "login") ? "none" : `1px solid ${tk.divider}`,
              marginTop: (l.id === "hire" || l.id === "login") ? 8 : 0,
              fontWeight: activeSection === l.id ? 500 : 400,
              transition:"color .2s",
            }}>{l.label}</a>
        ))}
      </div>
    </>
  );
}