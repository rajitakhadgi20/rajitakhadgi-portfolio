import { useRef, useEffect } from "react";

/* ── Scroll-reveal hook (adds `cls` class when element enters view) ── */
export function useReveal(cls) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.classList.add(cls);
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("on"); obs.unobserve(el); } },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

