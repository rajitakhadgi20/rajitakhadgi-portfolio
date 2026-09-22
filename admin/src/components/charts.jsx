import { useEffect, useId, useRef, useState } from "react";

// Dependency-free SVG charts, drawn with the admin's own colour tokens.

function useWidth() {
  const ref = useRef(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(el);
    setW(Math.round(el.getBoundingClientRect().width));
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

// Smooth line through points that never overshoots (monotone cubic).
function smoothPath(pts) {
  const n = pts.length;
  if (n === 0) return "";
  if (n === 1) return `M${pts[0][0]},${pts[0][1]}`;
  const m = [];
  for (let i = 0; i < n - 1; i++) m.push((pts[i + 1][1] - pts[i][1]) / (pts[i + 1][0] - pts[i][0]));
  const t = new Array(n);
  t[0] = m[0];
  t[n - 1] = m[n - 2];
  for (let i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (2 * m[i - 1] * m[i]) / (m[i - 1] + m[i]);
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    const dx = (x1 - x0) / 3;
    d += ` C${x0 + dx},${y0 + t[i] * dx} ${x1 - dx},${y1 - t[i + 1] * dx} ${x1},${y1}`;
  }
  return d;
}

const NICE = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2500, 5000, 10000];
function niceScale(max) {
  const step = NICE.find((s) => s * 4 >= max) || Math.ceil(max / 4);
  return { step, top: step * 4 };
}

/* ---------- Sparkline: tiny trend line for the stat cards ---------- */
export function Sparkline({ values, color = "var(--accent)", height = 40 }) {
  const id = useId();
  const max = Math.max(...values, 1);
  const W = 100;
  const H = 40;
  const pts = values.map((v, i) => [values.length === 1 ? W / 2 : (i / (values.length - 1)) * W, H - 4 - (v / max) * (H - 10)]);
  const line = smoothPath(pts);
  return (
    <svg className="ad-spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ height }} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {pts.length > 1 && <path d={`${line} L${W},${H} L0,${H} Z`} fill={`url(#${id})`} />}
      <path d={line} fill="none" stroke={color} strokeWidth="1.8" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- MiniBars: tiny bar strip for the stat cards ---------- */
export function MiniBars({ values, color = "var(--accent)", height = 40 }) {
  const max = Math.max(...values, 1);
  const n = Math.max(values.length, 1);
  const W = 100;
  const gap = 4;
  const bw = (W - gap * (n - 1)) / n;
  return (
    <svg className="ad-spark" viewBox={`0 0 ${W} 40`} preserveAspectRatio="none" style={{ height }} aria-hidden="true">
      {values.length === 0 && <rect x="0" y="36" width={W} height="3" rx="1.5" fill="var(--border)" />}
      {values.map((v, i) => {
        const h = Math.max(3, (v / max) * 36);
        return <rect key={i} x={i * (bw + gap)} y={40 - h} width={bw} height={h} rx="2" fill={color} opacity={0.35 + 0.65 * (v / max)} />;
      })}
    </svg>
  );
}

/* ---------- LineChart: multi-series, hover tooltip like the reference ---------- */
export function LineChart({ labels, tipLabels, series, height = 260, area = false }) {
  const [wrapRef, width] = useWidth();
  const gid = useId();
  const [hover, setHover] = useState(null);

  const pad = { l: 34, r: 14, t: 14, b: 28 };
  const W = Math.max(width, 260);
  const plotW = W - pad.l - pad.r;
  const plotH = height - pad.t - pad.b;
  const n = labels.length;
  const rawMax = Math.max(1, ...series.flatMap((s) => s.values));
  const { step, top } = niceScale(rawMax);
  const x = (i) => pad.l + (n === 1 ? plotW / 2 : (i / (n - 1)) * plotW);
  const y = (v) => pad.t + plotH - (v / top) * plotH;
  const every = Math.max(1, Math.ceil((n * 54) / plotW));

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const idx = Math.round(((px - pad.l) / plotW) * (n - 1));
    setHover(Math.min(n - 1, Math.max(0, idx)));
  };

  const tipLeft = hover === null ? 0 : x(hover);
  const flip = hover !== null && tipLeft > W * 0.62;

  return (
    <div ref={wrapRef} className="ad-chart" style={{ height }}>
      {width > 0 && (
        <svg width={W} height={height} onPointerMove={onMove} onPointerLeave={() => setHover(null)} role="img"
             aria-label={series.map((s) => s.name).join(" and ") + " over time"}>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={series[0].color} stopOpacity="0.32" />
              <stop offset="100%" stopColor={series[0].color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0, 1, 2, 3, 4].map((k) => (
            <g key={k}>
              <line x1={pad.l} x2={W - pad.r} y1={y(k * step)} y2={y(k * step)} stroke="var(--border)" strokeDasharray={k === 0 ? "0" : "3 5"} />
              <text x={pad.l - 10} y={y(k * step) + 4} textAnchor="end" className="ad-axis">{k * step}</text>
            </g>
          ))}
          {labels.map((l, i) => i % every === 0 && (
            <text key={i} x={x(i)} y={height - 8} textAnchor="middle" className="ad-axis">{l}</text>
          ))}

          {area && (
            <path d={`${smoothPath(series[0].values.map((v, i) => [x(i), y(v)]))} L${x(n - 1)},${y(0)} L${x(0)},${y(0)} Z`} fill={`url(#${gid})`} />
          )}
          {series.map((s) => (
            <path key={s.name} d={smoothPath(s.values.map((v, i) => [x(i), y(v)]))} fill="none" stroke={s.color}
                  strokeWidth="2.2" strokeLinecap="round" strokeDasharray={s.dashed ? "6 5" : undefined} />
          ))}

          {hover !== null && (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={pad.t + plotH} stroke="var(--accent)" strokeDasharray="4 4" opacity="0.7" />
              {series.map((s) => (
                <circle key={s.name} cx={x(hover)} cy={y(s.values[hover])} r="5" fill="var(--panel)" stroke={s.color} strokeWidth="2.5" />
              ))}
            </g>
          )}
          <rect x={pad.l} y={0} width={plotW} height={height} fill="transparent" />
        </svg>
      )}
      {hover !== null && (
        <div className="ad-tip" style={{ left: flip ? undefined : tipLeft + 14, right: flip ? W - tipLeft + 14 : undefined, top: 10 }}>
          <div className="ad-tip-title">{(tipLabels || labels)[hover]}</div>
          {series.map((s) => (
            <div key={s.name} className="ad-tip-row">
              <span className="ad-dot" style={{ background: s.color }} />
              <span>{s.name}</span>
              <b>{s.values[hover]}</b>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Donut ---------- */
export function Donut({ segments, size = 190, thickness = 22, centerTop, centerBottom }) {
  const r = (size - thickness) / 2;
  const C = 2 * Math.PI * r;
  const total = segments.reduce((a, s) => a + s.value, 0);
  const gap = segments.length > 1 ? 4 : 0;
  let offset = 0;
  return (
    <div className="ad-donut" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Projects by category">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--panel-alt)" strokeWidth={thickness} />
        {total > 0 && segments.map((s) => {
          const len = (s.value / total) * C;
          const el = (
            <circle key={s.label} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={s.color} strokeWidth={thickness}
                    strokeDasharray={`${Math.max(len - gap, 1)} ${C - Math.max(len - gap, 1)}`} strokeDashoffset={-offset}
                    transform={`rotate(-90 ${size / 2} ${size / 2})`} />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div className="ad-donut-center">
        <b>{centerTop}</b>
        <span>{centerBottom}</span>
      </div>
    </div>
  );
}