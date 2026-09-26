import { useEffect, useRef } from "react";

/* A small purple butterfly that trails behind the cursor with a soft lag,
   hovering just above it, with a gentle slow wing flutter (not an energetic
   flap). Always stays upright — only mirrors left/right to face its
   direction of travel. Hidden on touch devices. */
export function CursorButterfly() {
  const svgRef = useRef(null);
  const wingLRef = useRef(null);
  const wingRRef = useRef(null);

  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (isTouch) return;

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { x: mouse.x, y: mouse.y - 30 };
    let facing = 1;
    let flap = 0;
    let raf;

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const tick = () => {
      // Hover just above the actual cursor position, trailing behind with a
      // soft, clearly-visible lag rather than snapping to it.
      const targetX = mouse.x;
      const targetY = mouse.y - 30;
      const dx = targetX - pos.x;
      const dy = targetY - pos.y;

      pos.x += dx * 0.06;
      pos.y += dy * 0.06;

      if (dx > 4) facing = 1;
      else if (dx < -4) facing = -1;

      // Slow, gentle flutter — not an energetic flap
      flap += 0.09;
      const wingScale = 0.78 + Math.sin(flap) * 0.22;

      if (svgRef.current) {
        svgRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px) scaleX(${facing})`;
      }
      if (wingLRef.current) wingLRef.current.style.transform = `scaleX(${wingScale})`;
      if (wingRRef.current) wingRRef.current.style.transform = `scaleX(${wingScale})`;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      width="40"
      height="34"
      viewBox="0 0 44 38"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        marginLeft: -20,
        marginTop: -17,
        pointerEvents: "none",
        zIndex: 9999,
        filter: "drop-shadow(0 4px 8px rgba(107,33,168,0.4))",
        willChange: "transform",
      }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cbfWingTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d8b4fe" />
          <stop offset="60%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#7e22ce" />
        </linearGradient>
        <linearGradient id="cbfWingBottom" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#6b21a8" />
        </linearGradient>
      </defs>

      <g ref={wingRRef} style={{ transformOrigin: "22px 15px" }}>
        <path d="M22 13 C 27 -1, 42 -2, 41 11 C 40 20, 29 19, 22 15 Z" fill="url(#cbfWingTop)" />
        <circle cx="33" cy="8" r="2.1" fill="#f5d0fe" opacity="0.8" />
        <path d="M22 17 C 26 21, 34 26, 31 32 C 28 36, 22 29, 22 21 Z" fill="url(#cbfWingBottom)" />
      </g>
      <g ref={wingLRef} style={{ transformOrigin: "22px 15px" }}>
        <path d="M22 13 C 17 -1, 2 -2, 3 11 C 4 20, 15 19, 22 15 Z" fill="url(#cbfWingTop)" />
        <circle cx="11" cy="8" r="2.1" fill="#f5d0fe" opacity="0.8" />
        <path d="M22 17 C 18 21, 10 26, 13 32 C 16 36, 22 29, 22 21 Z" fill="url(#cbfWingBottom)" />
      </g>

      <path d="M22 6 C 20 9, 20 24, 22 30 C 24 24, 24 9, 22 6 Z" fill="#3b0764" />
      <circle cx="22" cy="6" r="2" fill="#3b0764" />
      <path d="M22 6 C 20.2 3, 18.5 2, 17.2 1" stroke="#3b0764" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <path d="M22 6 C 23.8 3, 25.5 2, 26.8 1" stroke="#3b0764" strokeWidth="0.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}