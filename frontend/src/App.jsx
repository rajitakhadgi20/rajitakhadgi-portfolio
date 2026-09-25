import { useState, useEffect } from "react";
import { DARK, LIGHT } from "./data/tokens";
import { CSS } from "./styles/globalCss";
import { useProjects } from "./hooks/useProjects";
import { useApiList } from "./hooks/useApiList";

import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Ticker } from "./components/Ticker";
import { About } from "./components/About";
import { Projects, AllProjectsPage } from "./components/Projects";
import { Skills } from "./components/Skills";
import { Certificates } from "./components/Certificates";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Login } from "./components/Login";
import { Gallery } from "./components/Gallery";
import { Experience } from "./components/Experience";
import { ProjectCaseStudy } from "./components/ProjectCaseStudy";

export default function Portfolio() {
  const [open, setOpen]         = useState(false);
  const [page, setPage]         = useState("home");
  const [skipAnim, setSkipAnim] = useState(false);
  const [isDark, setIsDark]     = useState(true);
  const [activeProject, setActiveProject] = useState(null);

  const tk = isDark ? DARK : LIGHT;
  const toggleTheme = () => setIsDark(d => !d);

  const { projects } = useProjects();

  const experience = useApiList("/api/experience", []);
  // If the backend is unreachable, the gallery falls back to the project images
  const gallery = useApiList("/api/gallery", projects.map((p) => ({ id: p.title, title: p.title, img: p.img })));

  useEffect(() => {
    const id = "pf-css";
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id; s.textContent = CSS;
      document.head.appendChild(s);
    }
    return () => document.getElementById(id)?.remove();
  }, []);

  useEffect(() => {
    document.body.style.background = tk.bg;
  }, [isDark]);

  useEffect(() => {
    const h = e => { if (!e.target.closest(".ham") && !e.target.closest("#mmenu")) setOpen(false); };
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, []);

  useEffect(() => {
    if (page === "projects" || page === "case-study") window.scrollTo({ top: 0 });
  }, [page]);

  const handleBackToPortfolio = () => {
    setPage("home");
    window.location.hash = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openCaseStudy = (project) => {
    setActiveProject(project);
    setSkipAnim(true);
    setPage("case-study");
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="pf-root" style={{ background: tk.bg }}>
      {page === "login" ? (
        <Login tk={tk} onBack={handleBackToPortfolio} />
      ) : (
        <>
          <Navbar open={open} setOpen={setOpen} page={page} setPage={setPage} tk={tk} toggleTheme={toggleTheme} />

          {page === "case-study" && activeProject ? (
            <>
              <ProjectCaseStudy project={activeProject} tk={tk} onBack={handleBackToPortfolio} />
              <Footer tk={tk} />
            </>
          ) : page === "projects" ? (
            <>
              <AllProjectsPage setPage={setPage} setSkipAnim={setSkipAnim} tk={tk} projects={projects} onOpen={openCaseStudy} />
              <Footer tk={tk} />
            </>
          ) : (
            <>
              <Hero setPage={setPage} skipAnimation={skipAnim} onAnimDone={() => setSkipAnim(true)} tk={tk} toggleTheme={toggleTheme} />
              <Ticker tk={tk} />
              <About tk={tk} />
              <Projects setPage={setPage} setSkipAnim={setSkipAnim} tk={tk} projects={projects} onOpen={openCaseStudy} />
              <Skills tk={tk} />
              <Experience tk={tk} items={experience} />
              <Certificates tk={tk} />
              <Gallery tk={tk} items={gallery} />
              <Contact tk={tk} />
              <Footer tk={tk} />
            </>
          )}
        </>
      )}
    </div>
  );
}