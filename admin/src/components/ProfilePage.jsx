import { useEffect, useState } from "react";
import { api } from "../api";
import { UploadBox } from "./UploadBox";

const empty = {
  fullName: "", email: "", avatar: "", title: "", location: "", shortDesc: "",
  longDesc: "", cvUrl: "", cvName: "", yearsExp: "", projectsDone: "", happyClients: "",
  githubUrl: "", linkedinUrl: "", dribbbleUrl: "", mediaImages: [],
};

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ProfilePage() {
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const load = () =>
    api.getProfile()
      .then((p) => setForm({ ...empty, ...p }))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const addMediaImage = async (file) => {
    if (!file) return;
    const url = await readAsDataURL(file);
    setForm((f) => ({ ...f, mediaImages: [...f.mediaImages, { name: file.name, url }] }));
  };

  const removeMediaImage = (i) =>
    setForm((f) => ({ ...f, mediaImages: f.mediaImages.filter((_, idx) => idx !== i) }));

  const changeCv = async (file) => {
    if (!file) return;
    const url = await readAsDataURL(file);
    setForm((f) => ({ ...f, cvUrl: url, cvName: file.name }));
  };

  const previewCv = () => {
    if (!form.cvUrl) return;
    const win = window.open();
    if (win) win.document.write(`<iframe src="${form.cvUrl}" style="border:0;width:100%;height:100vh"></iframe>`);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await api.updateProfile(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ color: "var(--text-dim)" }}>Loading…</p>;

  return (
    <form className="ad-page" onSubmit={handleSave}>
      {error && <div className="ad-alert" role="alert"><span>{error}</span></div>}

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, alignItems: "start" }}>
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <section className="ad-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, marginBottom: 18 }}>First Paragraph</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label className="label">Full Name</label>
                <input className="input" value={form.fullName} onChange={set("fullName")} placeholder="Rajita Khadgi" />
              </div>
              <div>
                <label className="label">Email</label>
                <input className="input" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" />
              </div>
              <div>
                <label className="label">Avatar Initials</label>
                <input className="input" value={form.avatar} onChange={set("avatar")} placeholder="RK" maxLength={3} />
              </div>
              <div>
                <label className="label">Title / Role</label>
                <input className="input" value={form.title} onChange={set("title")} placeholder="UI/UX Designer" />
              </div>
              <div>
                <label className="label">Location</label>
                <input className="input" value={form.location} onChange={set("location")} placeholder="Kathmandu, Nepal" />
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <label className="label">Description</label>
              <textarea className="input" rows={3} value={form.shortDesc} onChange={set("shortDesc")} placeholder="Short tagline shown near your name" />
            </div>
          </section>

          <section className="ad-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, marginBottom: 18 }}>Second Paragraph</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <div>
                <label className="label">Years of Exp</label>
                <input className="input" value={form.yearsExp} onChange={set("yearsExp")} placeholder="+1" />
              </div>
              <div>
                <label className="label">Projects Done</label>
                <input className="input" value={form.projectsDone} onChange={set("projectsDone")} placeholder="+8" />
              </div>
              <div>
                <label className="label">Happy Clients</label>
                <input className="input" value={form.happyClients} onChange={set("happyClients")} placeholder="+4" />
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <label className="label">GitHub URL</label>
              <input className="input" value={form.githubUrl} onChange={set("githubUrl")} placeholder="https://github.com" />
            </div>
            <div style={{ marginTop: 16 }}>
              <label className="label">LinkedIn URL</label>
              <input className="input" value={form.linkedinUrl} onChange={set("linkedinUrl")} placeholder="https://linkedin.com" />
            </div>
            <div style={{ marginTop: 16 }}>
              <label className="label">Dribbble URL</label>
              <input className="input" value={form.dribbbleUrl} onChange={set("dribbbleUrl")} placeholder="https://dribbble.com" />
            </div>
            <div style={{ marginTop: 16 }}>
              <label className="label">Description</label>
              <textarea className="input" rows={6} value={form.longDesc} onChange={set("longDesc")} placeholder="The full About Me bio" />
            </div>
          </section>
        </div>

        {/* Right column: Media */}
        <section className="ad-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, marginBottom: 18 }}>Media</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
            {form.mediaImages.map((img, i) => (
              <div key={i} className="ad-row" style={{ padding: 8, gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, backgroundImage: `url("${img.url}")`, backgroundSize: "cover", backgroundPosition: "center", flexShrink: 0 }} />
                <span style={{ fontSize: 13, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{img.name}</span>
                <button type="button" className="btn danger small" onClick={() => removeMediaImage(i)}>Remove</button>
              </div>
            ))}
          </div>

          <UploadBox
            value=""
            onChange={() => {}}
            height={90}
            label="Add image"
          />
          {/* UploadBox above only previews; wire its file input directly for adding to the list */}
          <input
            type="file"
            accept="image/*"
            style={{ marginTop: 8 }}
            onChange={(e) => { addMediaImage(e.target.files?.[0]); e.target.value = ""; }}
          />

          <div className="ad-card" style={{ marginTop: 20, padding: 16, textAlign: "center", border: "1px solid var(--border)" }}>
            {form.cvUrl ? (
              <>
                <div style={{ fontSize: 32 }}>📄</div>
                <p style={{ fontSize: 13, margin: "8px 0 14px", wordBreak: "break-all" }}>{form.cvName || "Resume.pdf"}</p>
                <label className="btn small" style={{ display: "block", cursor: "pointer", marginBottom: 8 }}>
                  Change Document
                  <input type="file" accept="application/pdf" style={{ display: "none" }} onChange={(e) => { changeCv(e.target.files?.[0]); e.target.value = ""; }} />
                </label>
                <button type="button" className="btn secondary small" style={{ width: "100%" }} onClick={previewCv}>Preview Document</button>
              </>
            ) : (
              <label className="btn small" style={{ display: "block", cursor: "pointer" }}>
                Upload CV
                <input type="file" accept="application/pdf" style={{ display: "none" }} onChange={(e) => { changeCv(e.target.files?.[0]); e.target.value = ""; }} />
              </label>
            )}
          </div>
        </section>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button type="submit" className="btn" disabled={saving}>{saving ? "Saving…" : "Save Profile"}</button>
        <button type="button" className="btn secondary" onClick={load}>Cancel</button>
        {saved && <span style={{ color: "var(--accent-2)", alignSelf: "center", fontSize: 13 }}>Saved!</span>}
      </div>
    </form>
  );
}