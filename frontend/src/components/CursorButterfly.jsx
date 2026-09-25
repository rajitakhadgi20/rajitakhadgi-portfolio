import { useEffect, useRef } from "react";

/* A small purple butterfly that drifts after the cursor with a lagged,
   slightly wobbly flight path (not a rigid 1:1 follow) and flapping wings.
   It stays upright at all times — it only mirrors left/right to face its
   direction of travel and tilts gently, never spins or flips upside down.
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
    let facing = 1; // 1 = facing right, -1 = facing left
    let tilt = 0;
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
      const targetX = mouse.x + 26;
      const targetY = mouse.y - 34;
      const dx = targetX - pos.x;
      const dy = targetY - pos.y;
      const idle = t - lastMoveT > 120;

      const wobbleX = Math.sin(t / 420) * (idle ? 10 : 3);
      const wobbleY = Math.cos(t / 340) * (idle ? 8 : 3);

      pos.x += dx * 0.08 + (wobbleX - (pos._wx || 0)) * 0.02;
      pos.y += dy * 0.08 + (wobbleY - (pos._wy || 0)) * 0.02;
      pos._wx = wobbleX;
      pos._wy = wobbleY;

      // Face left/right only (never flips upside down); small hysteresis so
      // it doesn't flicker when barely moving.
      if (dx > 6) facing = 1;
      else if (dx < -6) facing = -1;

      // Gentle bank into turns, clamped to a small range — always stays
      // right-side up.
      const targetTilt = Math.max(-14, Math.min(14, dy * 0.06));
      tilt += (targetTilt - tilt) * 0.08;

      const speed = Math.min(1, Math.hypot(dx, dy) / 120);
      flap += idle ? 0.16 : 0.26 + speed * 0.22;
      const wingScale = 0.5 + Math.abs(Math.sin(flap)) * 0.5;

      if (svgRef.current) {
        svgRef.current.style.transform =
          `translate(${pos.x}px, ${pos.y}px) scaleX(${facing}) rotate(${tilt}deg)`;
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
      width="44"
      height="38"
      viewBox="0 0 44 38"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        marginLeft: -22,
        marginTop: -19,
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

      {/* Right-side wings, flapping around the body's spine (x=22) */}
      <g ref={wingRRef} style={{ transformOrigin: "22px 15px" }}>
        <path d="M22 13 C 27 -1, 42 -2, 41 11 C 40 20, 29 19, 22 15 Z" fill="url(#cbfWingTop)" />
        <circle cx="33" cy="8" r="2.1" fill="#f5d0fe" opacity="0.8" />
        <path d="M22 17 C 26 21, 34 26, 31 32 C 28 36, 22 29, 22 21 Z" fill="url(#cbfWingBottom)" />
      </g>
      {/* Left-side wings (mirrored) */}
      <g ref={wingLRef} style={{ transformOrigin: "22px 15px" }}>
        <path d="M22 13 C 17 -1, 2 -2, 3 11 C 4 20, 15 19, 22 15 Z" fill="url(#cbfWingTop)" />
        <circle cx="11" cy="8" r="2.1" fill="#f5d0fe" opacity="0.8" />
        <path d="M22 17 C 18 21, 10 26, 13 32 C 16 36, 22 29, 22 21 Z" fill="url(#cbfWingBottom)" />
      </g>

      {/* Body: head at top, abdomen curving down */}
      <path d="M22 6 C 20 9, 20 24, 22 30 C 24 24, 24 9, 22 6 Z" fill="#3b0764" />
      <circle cx="22" cy="6" r="2" fill="#3b0764" />
      <path d="M22 6 C 20.2 3, 18.5 2, 17.2 1" stroke="#3b0764" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <path d="M22 6 C 23.8 3, 25.5 2, 26.8 1" stroke="#3b0764" strokeWidth="0.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}