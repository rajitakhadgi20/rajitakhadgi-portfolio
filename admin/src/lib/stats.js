// Small date/number helpers used by the dashboard. The API returns created_at as
// "YYYY-MM-DD HH:MM:SS" in UTC (SQLite datetime('now')).

export function parseDate(s) {
  if (!s) return new Date(NaN);
  return new Date(String(s).replace(" ", "T") + "Z");
}

const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const DAY = 86400000;

/** Count items per calendar day for the last `n` days (oldest → today). */
export function bucketDays(items, n, pred = () => true) {
  const today = startOfDay(new Date());
  const days = Array.from({ length: n }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (n - 1 - i));
    return d;
  });
  const values = days.map(() => 0);
  for (const it of items) {
    if (!pred(it)) continue;
    const d = parseDate(it.created_at);
    if (isNaN(d)) continue;
    const idx = Math.round((startOfDay(d) - days[0]) / DAY);
    if (idx >= 0 && idx < n) values[idx]++;
  }
  return { days, values };
}

/** Count items per calendar month for the last `n` months (oldest → this month). */
export function bucketMonths(items, n, pred = () => true) {
  const now = new Date();
  const months = Array.from({ length: n }, (_, i) => new Date(now.getFullYear(), now.getMonth() - (n - 1 - i), 1));
  const base = months[0].getFullYear() * 12 + months[0].getMonth();
  const values = months.map(() => 0);
  for (const it of items) {
    if (!pred(it)) continue;
    const d = parseDate(it.created_at);
    if (isNaN(d)) continue;
    const idx = d.getFullYear() * 12 + d.getMonth() - base;
    if (idx >= 0 && idx < n) values[idx]++;
  }
  return { months, values };
}

/** Count items per 7-day block for the last `n` weeks (oldest → this week). */
export function bucketWeeks(items, n, pred = () => true) {
  const today = startOfDay(new Date());
  const values = Array.from({ length: n }, () => 0);
  for (const it of items) {
    if (!pred(it)) continue;
    const d = parseDate(it.created_at);
    if (isNaN(d)) continue;
    const daysAgo = Math.round((today - startOfDay(d)) / DAY);
    if (daysAgo < 0 || daysAgo >= n * 7) continue;
    values[n - 1 - Math.floor(daysAgo / 7)]++;
  }
  return values;
}

export const sum = (arr) => arr.reduce((a, b) => a + b, 0);

export const dayLabel = (d) => d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
export const monthShort = (d) => d.toLocaleDateString(undefined, { month: "short" });
export const monthLong = (d) => d.toLocaleDateString(undefined, { month: "long", year: "numeric" });

export function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export function timeAgo(iso) {
  const d = parseDate(iso);
  if (isNaN(d)) return "";
  const mins = Math.round((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return dayLabel(d);
}