import { useEffect, useRef } from "react";

/* A small purple butterfly that drifts after the cursor with a lagged,
   slightly wobbly flight path (not a rigid 1:1 follow) and flapping wings.
   Hidden on touch devices, since there's no cursor to follow. */
export function CursorButterfly() {
  const svgRef = useRef(null);
  const wingLRef = useRef(null);
  const wingRRef = useRef(null);

  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (isTouch) return;

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { x: mouse.x, y: mouse.y };
    let angle = 0;
    let flap = 0;
    let raf;
    let lastMoveT = performance.now();

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      lastMoveT = performance.now();
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const tick = (t) => {
      // Lag behind the cursor with easing, offset up-and-left a bit so it
      // trails like a companion rather than sitting under the pointer.
      const targetX = mouse.x + 26;
      const targetY = mouse.y - 34;
      const dx = targetX - pos.x;
      const dy = targetY - pos.y;
      const idle = t - lastMoveT > 120;

      // A little organic wobble, stronger when idle (gentle hover/drift)
      const wobbleX = Math.sin(t / 420) * (idle ? 10 : 3);
      const wobbleY = Math.cos(t / 340) * (idle ? 8 : 3);

      pos.x += dx * 0.08 + (wobbleX - (pos._wx || 0)) * 0.02;
      pos.y += dy * 0.08 + (wobbleY - (pos._wy || 0)) * 0.02;
      pos._wx = wobbleX;
      pos._wy = wobbleY;

      const moveAngle = Math.atan2(dy, dx) * (180 / Math.PI);
      const speed = Math.min(1, Math.hypot(dx, dy) / 120);
      angle += (moveAngle - angle) * 0.06;

      flap += idle ? 0.18 : 0.28 + speed * 0.25;
      const wingScale = 0.55 + Math.abs(Math.sin(flap)) * 0.45;

      if (svgRef.current) {
        svgRef.current.style.transform =
          `translate(${pos.x}px, ${pos.y}px) rotate(${angle * 0.2}deg)`;
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
      width="46"
      height="40"
      viewBox="0 0 46 40"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        marginLeft: -23,
        marginTop: -20,
        pointerEvents: "none",
        zIndex: 9999,
        filter: "drop-shadow(0 4px 10px rgba(124,58,237,0.35))",
        willChange: "transform",
      }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cbfWing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="55%" stopColor="#9333ea" />
          <stop offset="100%" stopColor="#6b21a8" />
        </linearGradient>
      </defs>

      {/* Right wings (flap around body axis at x=23) */}
      <g ref={wingRRef} style={{ transformOrigin: "23px 18px" }}>
        <path d="M23 16 C 30 2, 45 4, 44 15 C 43 23, 32 22, 23 18 Z" fill="url(#cbfWing)" opacity="0.95" />
        <path d="M23 20 C 29 24, 39 30, 36 36 C 33 40, 25 32, 23 24 Z" fill="url(#cbfWing)" opacity="0.85" />
      </g>
      {/* Left wings (mirrored) */}
      <g ref={wingLRef} style={{ transformOrigin: "23px 18px" }}>
        <path d="M23 16 C 16 2, 1 4, 2 15 C 3 23, 14 22, 23 18 Z" fill="url(#cbfWing)" opacity="0.95" />
        <path d="M23 20 C 17 24, 7 30, 10 36 C 13 40, 21 32, 23 24 Z" fill="url(#cbfWing)" opacity="0.85" />
      </g>

      {/* Body */}
      <ellipse cx="23" cy="19" rx="1.6" ry="9" fill="#3b0764" />
      <circle cx="23" cy="9" r="1.8" fill="#3b0764" />
      <path d="M23 9 C 21.5 6, 20 5.5, 19 4" stroke="#3b0764" strokeWidth="0.7" fill="none" strokeLinecap="round" />
      <path d="M23 9 C 24.5 6, 26 5.5, 27 4" stroke="#3b0764" strokeWidth="0.7" fill="none" strokeLinecap="round" />
    </svg>
  );
}