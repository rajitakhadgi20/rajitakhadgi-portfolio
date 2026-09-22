import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

/* Fetches a public list from the backend (e.g. "/api/experience").
   If the backend can't be reached, `fallback` is used instead so the site
   still renders on its own. */
export function useApiList(path, fallback = []) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}${path}`)
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setItems(data);
      })
      .catch(() => {
        if (!cancelled) setItems(fallback);
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  return items;
}