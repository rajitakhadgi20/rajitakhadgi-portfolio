// "2026-08" -> "Aug 2026"
export function monthLabel(value) {
  if (!value) return "";
  const [y, m] = value.split("-");
  if (!y || !m) return value;
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

// "2026-08-24" -> "24 Aug, 2026"
export function dateLabel(value) {
  if (!value) return "";
  const d = new Date(`${value}T00:00:00`);
  if (isNaN(d)) return value;
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleDateString("en-US", { month: "short" });
  return `${day} ${month}, ${d.getFullYear()}`;
}