import { useCallback, useEffect, useState } from "react";
import { api, getToken } from "./api";
import { Login } from "./components/Login";
import { Layout } from "./components/Layout";
import { DashboardPage } from "./components/DashboardPage";
import { ProjectsPage } from "./components/ProjectsPage";
import { MessagesPage } from "./components/MessagesPage";
import { ExperiencePage } from "./components/ExperiencePage"; // ← check
import { GalleryPage } from "./components/GalleryPage";       // ← check
import { ProfilePage } from "./components/ProfilePage";
import { CertificatesPage } from "./components/CertificatesPage";
import { SkillsPage } from "./components/SkillsPage";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [tab, setTab] = useState("dashboard");
  const [query, setQuery] = useState("");

  // Shared data, loaded once and reused by the dashboard, projects and messages pages
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: "" });

  // One-shot signals to child pages
  const [wantNewProject, setWantNewProject] = useState(false);
  const [openMessageId, setOpenMessageId] = useState(null);

  useEffect(() => {
    // A token in the URL (?token=...) comes from the portfolio site's login page.
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    if (urlToken) {
      localStorage.setItem("admin_token", urlToken);
      window.history.replaceState({}, "", window.location.pathname);
    }

    const token = getToken();
    setAdmin(token ? decodeToken(token) : null);
    setReady(true);
  }, []);

  const reload = useCallback(async () => {
    try {
      const [p, m] = await Promise.all([api.listProjects(), api.listMessages()]);
      setProjects(p);
      setMessages(m);
      setStatus({ loading: false, error: "" });
    } catch (e) {
      const offline = e instanceof TypeError; // fetch() rejects with TypeError when the server is unreachable
      setStatus({
        loading: false,
        error: offline ? `Can't reach the server at ${API_URL}. Start it with "npm run dev" in the backend folder.` : e.message,
      });
    }
  }, []);

  useEffect(() => {
    if (admin) reload();
  }, [admin, reload]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setAdmin(null);
  };

  const navigate = (id, openNew = false) => {
    setTab(id);
    setQuery("");
    if (openNew) setWantNewProject(true);
  };

  const handleQuery = (value) => {
    setQuery(value);
    if (tab === "dashboard" && value) setTab("projects"); // searching from the overview jumps to the list
  };

  const openMessage = (m) => {
    setTab("messages");
    setQuery("");
    setOpenMessageId(m.id);
  };

  if (!ready) return null;

  if (!admin) {
    return <Login onLoggedIn={() => setAdmin(decodeToken(getToken()))} />;
  }

  const unread = messages.filter((m) => !m.read).length;

  return (
    <Layout
      tab={tab}
      onNavigate={navigate}
      admin={admin}
      onLogout={handleLogout}
      unread={unread}
      query={query}
      onQuery={handleQuery}
      onNewProject={() => navigate("projects", true)}
    >
      {status.error && (
        <div className="ad-alert" role="alert">
          <span>{status.error}</span>
          <button className="btn secondary small" onClick={reload}>Try again</button>
        </div>
      )}

      {tab === "dashboard" && (
        <DashboardPage projects={projects} messages={messages} onOpenMessage={openMessage} onGo={navigate} />
      )}
      {tab === "projects" && (
        <ProjectsPage
          projects={projects} setProjects={setProjects} reload={reload}
          loading={status.loading} query={query}
          wantNew={wantNewProject} onNewHandled={() => setWantNewProject(false)}
        />
      )}
      {tab === "experience" && <ExperiencePage />} {/* ← check */}
      {tab === "gallery" && <GalleryPage />}       {/* ← check */}
      {tab === "messages" && (
        <MessagesPage
          messages={messages} setMessages={setMessages} reload={reload}
          loading={status.loading} query={query}
          openId={openMessageId} onOpened={() => setOpenMessageId(null)}
        />
      )}
      {tab === "profile" && <ProfilePage />}
      {tab === "certificates" && <CertificatesPage />}
      {tab === "skills" && <SkillsPage />}
    </Layout>
  );
}