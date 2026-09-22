import { useRef, useState } from "react";

const SITE_URL = import.meta.env.VITE_SITE_URL || "http://localhost:5173";

// Resolves old-style relative paths (e.g. "/image/foo.png") from before this
// update against the public site, so legacy images still preview correctly.
// Data URLs and full http(s) URLs pass through unchanged.
export function resolveImg(img) {
  if (!img) return "";
  if (img.startsWith("http") || img.startsWith("data:")) return img;
  return encodeURI(`${SITE_URL.replace(/\/$/, "")}${img}`);
}

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function UploadIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 16V4M12 4l-4 4M12 4l4 4" />
      <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  );
}

// Single-image drag & drop / click-to-upload box. `value` is a data URL (or
// existing image path). Calls onChange(dataUrl) when a file is picked.
export function UploadBox({ value, onChange, height = 180, accept = "image/*", label = "Upload Images" }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const resolved = resolveImg(value);

  const handleFile = async (file) => {
    if (!file) return;
    setError("");
    try {
      const dataUrl = await readAsDataURL(file);
      onChange(dataUrl);
    } catch {
      setError("Couldn't read that file.");
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        style={{
          border: `1px dashed ${dragOver ? "var(--accent-2)" : "var(--border)"}`,
          borderRadius: 10,
          height,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          cursor: "pointer",
          color: "var(--text-dim)",
          background: dragOver ? "rgba(166,95,215,0.06)" : resolved ? "transparent" : "var(--bg-alt, rgba(0,0,0,0.02))",
          backgroundImage: resolved ? `url("${resolved}")` : "none",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {!resolved && (
          <>
            <UploadIcon />
            <b style={{ fontSize: 14, color: "var(--text)" }}>{label}</b>
            <span style={{ fontSize: 12 }}>Drag and drop or click to select</span>
          </>
        )}
        {value && !resolved && (
          <span style={{ fontSize: 12, textAlign: "center", padding: "0 16px" }}>
            This image can't be previewed here (old path), but it's still saved. Upload a new one to replace it.
          </span>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {value && (
        <button
          type="button"
          className="btn secondary small"
          style={{ marginTop: 8 }}
          onClick={() => onChange("")}
        >
          Remove image
        </button>
      )}
      {error && <p style={{ color: "var(--danger)", fontSize: 12, marginTop: 6 }}>{error}</p>}
    </div>
  );
}

// Multi-image version: keeps an array of data URLs, lets you add more and remove any.
export function MultiUploadBox({ values = [], onChange, height = 140, accept = "image/*" }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    const urls = await Promise.all(files.map(readAsDataURL));
    onChange([...values, ...urls]);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const removeAt = (i) => onChange(values.filter((_, idx) => idx !== i));

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        style={{
          border: `1px dashed ${dragOver ? "var(--accent-2)" : "var(--border)"}`,
          borderRadius: 10,
          height,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          cursor: "pointer",
          color: "var(--text-dim)",
          background: dragOver ? "rgba(166,95,215,0.06)" : "var(--bg-alt, rgba(0,0,0,0.02))",
        }}
      >
        <UploadIcon />
        <b style={{ fontSize: 14, color: "var(--text)" }}>Upload Images</b>
        <span style={{ fontSize: 12 }}>Drag and drop or click to select</span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        style={{ display: "none" }}
        onChange={(e) => addFiles(e.target.files)}
      />
      {values.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: 8, marginTop: 10 }}>
          {values.map((v, i) => (
            <div key={i} style={{ position: "relative" }}>
              <div style={{ width: "100%", height: 70, borderRadius: 8, backgroundImage: `url("${resolveImg(v)}")`, backgroundSize: "cover", backgroundPosition: "center", border: "1px solid var(--border)" }} />
              <button
                type="button"
                onClick={() => removeAt(i)}
                aria-label="Remove image"
                style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", border: "none", background: "var(--danger)", color: "#fff", fontSize: 12, cursor: "pointer" }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}