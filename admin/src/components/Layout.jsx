import { useEffect, useRef, useState } from "react";
import { Icon } from "./icons";
import { initials } from "../lib/stats";

const SITE_URL = import.meta.env.VITE_SITE_URL || "http://localhost:5173";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "profile", label: "Profile", icon: "user" },
  { id: "projects", label: "Project", icon: "projects" },
  { id: "experience", label: "Experience", icon: "experience" },
  { id: "certificates", label: "Certificates", icon: "certificate" },
  { id: "skills", label: "Skills", icon: "skills" },
  { id: "gallery", label: "Gallery", icon: "gallery" },
  { id: "messages", label: "Messages", icon: "mail" },
];

const TITLES = {
  dashboard: "Overview", profile: "Profile", projects: "Projects", experience: "Experience",
  certificates: "Certificates", skills: "Skills", gallery: "Gallery", messages: "Messages",
};

// Tabs where the top-bar search does something
const SEARCHABLE = ["dashboard", "projects", "messages"];

export function Layout({ tab, onNavigate, admin, onLogout, unread, query, onQuery, onNewProject, children }) {
  const [navOpen, setNavOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const name = admin.name || admin.email || "Admin";

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [menuOpen]);

  const go = (id) => { onNavigate(id); setNavOpen(false); };

  return (
    <div className="ad-shell">
      {navOpen && <div className="ad-scrim" onClick={() => setNavOpen(false)} />}

      <aside className={`ad-side ${navOpen ? "open" : ""}`} aria-label="Main navigation">
        <div className="ad-brand">
          <h2>Rajita</h2>
          <p>Portfolio admin</p>
        </div>

        <nav className="ad-nav">
          {NAV.map((n) => (
            <button key={n.id} className="ad-link" aria-current={tab === n.id ? "page" : undefined} onClick={() => go(n.id)}>
              <Icon name={n.icon} />
              {n.label}
              {n.id === "messages" && unread > 0 && <span className="ad-count">{unread}</span>}
            </button>
          ))}
          <span className="ad-navlabel">Your site</span>
          <a className="ad-link" href={SITE_URL} target="_blank" rel="noreferrer">
            <Icon name="external" />
            View portfolio
          </a>
        </nav>

        <div className="ad-side-card">
          <p><b>Everything here is live.</b> Changes to your content show on your portfolio straight away.</p>
          <a className="btn small" href={SITE_URL} target="_blank" rel="noreferrer">Open site</a>
        </div>
      </aside>

      <div className="ad-main">
        <header className="ad-top">
          <button className="ad-icon-btn ad-menu" onClick={() => setNavOpen(true)} aria-label="Open navigation"><Icon name="menu" /></button>
          <h1>{TITLES[tab]}</h1>

          {SEARCHABLE.includes(tab) && (
            <label className="ad-search">
              <Icon name="search" size={16} />
              <input
                value={query}
                onChange={(e) => onQuery(e.target.value)}
                placeholder={tab === "messages" ? "Search messages" : "Search projects"}
                aria-label="Search"
              />
            </label>
          )}

          <div className="ad-top-actions">
            <button className="ad-icon-btn" onClick={() => go("messages")} aria-label={unread ? `${unread} unread messages` : "Messages"}>
              <Icon name="bell" />
              {unread > 0 && <span className="ad-badge-dot" />}
            </button>

            <div className="ad-user" ref={menuRef}>
              <button className="ad-user-btn" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen} aria-haspopup="menu">
                <span className="ad-avatar sm">{initials(name)}</span>
                <span className="ad-user-text">
                  <b>{name}</b>
                  {admin.email && admin.email !== name && <small>{admin.email}</small>}
                </span>
                <Icon name="chevron" size={14} />
              </button>
              {menuOpen && (
                <div className="ad-menu-pop" role="menu">
                  <button role="menuitem" onClick={onLogout}><Icon name="logout" size={16} />Log out</button>
                </div>
              )}
            </div>

            <button className="btn ad-new" onClick={onNewProject}>
              <Icon name="plus" size={16} /><span>New project</span>
            </button>
          </div>
        </header>

        <main className="ad-content">{children}</main>
      </div>
    </div>
  );
}