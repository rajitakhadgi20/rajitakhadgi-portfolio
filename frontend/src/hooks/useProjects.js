import { useEffect, useState } from "react";
import { ALL_PROJECTS } from "../data/projects";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

/* Fetches live project data from the backend (the same data the admin
   dashboard edits). Falls back to the static ALL_PROJECTS list if the
   backend can't be reached, so the site still renders on its own. */
export function useProjects() {
  const [projects, setProjects] = useState(ALL_PROJECTS);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/projects`)
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data) && data.length) {
          setProjects(data);
        } else {
          setUsingFallback(true);
        }
      })
      .catch(() => {
        if (!cancelled) setUsingFallback(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return { projects, loading, usingFallback };
}
