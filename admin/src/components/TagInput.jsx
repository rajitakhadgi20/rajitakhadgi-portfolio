import { useState } from "react";
import { TAG_OPTIONS } from "../lib/constants";

export function TagInput({ value = [], onChange, options = TAG_OPTIONS }) {
  const [text, setText] = useState("");

  const add = (tag) => {
    const clean = tag.trim();
    if (!clean) return;
    if (value.some((t) => t.toLowerCase() === clean.toLowerCase())) { setText(""); return; }
    onChange([...value, clean]);
    setText("");
  };

  const remove = (tag) => onChange(value.filter((t) => t !== tag));
  const remaining = options.filter((o) => !value.some((t) => t.toLowerCase() === o.toLowerCase()));

  return (
    <div>
      {value.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
          {value.map((t) => (
            <span key={t} className="badge" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              {t}
              <button type="button" onClick={() => remove(t)} aria-label={`Remove ${t}`} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
            </span>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <input
          className="input"
          list="tag-suggestions"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(text); } }}
          placeholder="Type a tag and press Add"
        />
        <datalist id="tag-suggestions">
          {remaining.map((o) => <option key={o} value={o} />)}
        </datalist>
        <button type="button" className="btn secondary" onClick={() => add(text)}>Add</button>
      </div>

      {remaining.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
          {remaining.map((o) => (
            <button key={o} type="button" className="btn secondary small" onClick={() => add(o)}>+ {o}</button>
          ))}
        </div>
      )}
    </div>
  );
}