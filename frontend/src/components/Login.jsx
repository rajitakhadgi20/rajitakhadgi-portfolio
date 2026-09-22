import { useState } from "react";
import { A } from "../data/assets";

const API_URL   = import.meta.env.VITE_API_URL   || "http://localhost:4000";
const ADMIN_URL = import.meta.env.VITE_ADMIN_URL || "http://localhost:5174";

/* ── LOGIN PAGE ──────────────────────────────────────────────────
   Sign-in gateway for the admin dashboard. Authenticates against the
   backend (/api/auth/login); on success it hands the JWT to the admin
   app and redirects there. Admin accounts are created on the backend
   (see backend/README.md) rather than through public sign-up. -----*/
export function Login({ tk, onBack }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const isLight = tk.moonIcon;

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Invalid email or password.");
        setLoading(false);
        return;
      }
      // Hand the token to the admin app and go there.
      window.location.href = `${ADMIN_URL}/?token=${encodeURIComponent(data.token)}`;
    } catch {
      setError("Couldn't reach the server. Is the backend running?");
      setLoading(false);
    }
  };

  const cardBg   = isLight ? "#FBFBFB" : "#1e1e1e";
  const cardBdr  = isLight ? "#E1E1E1" : "#555";
  const pageBg   = isLight ? "#ffffff" : "#0b0013";
  const titleClr = isLight ? "#464646" : "#F6E9FF";
  const subClr   = isLight ? "#727272" : "#BCBCBC";
  const lblClr   = isLight ? "#0B0013" : "#fbfbfb";
  const inpBg    = isLight ? "#ffffff" : "#272522";
  const inpBdr   = isLight ? "#BCBCBC" : "#3d3a38";
  const errBg    = "rgba(239,68,68,0.1)";
  const errBdr   = "rgba(239,68,68,0.3)";
  const txtClr   = isLight ? "#1E2A3A" : "#fff";

  const lbl = { fontFamily:"Roboto,sans-serif", fontSize:14, fontWeight:400, lineHeight:"normal", color:lblClr, transition:"color .4s" };
  const inp = {
    background: inpBg, border: `1px solid ${inpBdr}`, borderRadius: 8,
    padding: "10px 14px", fontFamily: "Roboto,sans-serif", fontSize: 14, fontWeight: 400,
    lineHeight: "24px", color: txtClr, width: "100%", outline: "none",
    transition: "border-color .2s, background .4s",
  };
  const btnStyle = {
    width: "100%", height: 44, background: "#8b31ca", border: "none", borderRadius: 8,
    color: "#fff", fontFamily: "Inter,sans-serif", fontSize: 16, fontWeight: 500,
    cursor: loading ? "not-allowed" : "pointer",
    transition: "opacity .2s, transform .2s",
    opacity: loading ? 0.7 : 1,
  };

  return (
    <div style={{ minHeight:"100vh", background:pageBg, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 20px", fontFamily:"Inter,sans-serif", transition:"background .4s ease" }}>
      <div style={{ width:"100%", maxWidth:420 }}>
        <div style={{ textAlign:"center", marginBottom:32, animation:"fadeInUp .4s ease" }}>
          <a href="#home" onClick={onBack} style={{ display:"inline-block", marginBottom:20, cursor:"pointer", textDecoration:"none" }}
            onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
          >
            <img src={isLight ? A.logoLight : A.logoDark} alt="RK" style={{ height:40, margin:"0 auto", transition:"opacity .2s" }}/>
          </a>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:700, fontSize:32, color:titleClr, marginBottom:8, transition:"color .4s" }}>
            Welcome Back
          </h1>
          <p style={{ fontFamily:"Inter,sans-serif", fontSize:14, color:subClr, lineHeight:"20px", transition:"color .4s" }}>
            Sign in to access the admin panel
          </p>
        </div>
        <div style={{ background:cardBg, border:`1px solid ${cardBdr}`, borderRadius:16, padding:"32px 28px", boxShadow: isLight ? "0 1px 3px rgba(0,0,0,0.08)" : "0 4px 24px rgba(0,0,0,0.3)", transition:"background .4s, border-color .4s" }}>
          <div style={{ animation:"fadeInUp .4s ease" }}>
            {error && <div style={{ background:errBg, border:`1px solid ${errBdr}`, borderRadius:8, padding:"10px 14px", marginBottom:16, fontFamily:"Inter,sans-serif", fontSize:13, color:"#ef4444", animation:"shake .3s ease" }}>{error}</div>}
            <form onSubmit={handleSignIn}>
              <div style={{ marginBottom:16 }}>
                <label style={lbl}>Email</label>
                <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} style={{ ...inp, marginTop:6 }}/>
              </div>
              <div style={{ marginBottom:8 }}>
                <label style={lbl}>Password</label>
                <input type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} style={{ ...inp, marginTop:6 }}/>
              </div>
              <button type="submit" disabled={loading} style={{ ...btnStyle, marginTop:24 }}
                onMouseOver={e => { if (!loading) e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseOut={e => { e.currentTarget.style.transform = "none"; }}>
                {loading ? "Signing In…" : "Sign In"}
              </button>
            </form>
          </div>
        </div>
        <p style={{ textAlign:"center", fontFamily:"Inter,sans-serif", fontSize:13, color:subClr, marginTop:20, transition:"color .4s" }}>
          <a href="#home" onClick={onBack} style={{ color:"#8B31CA", textDecoration:"none", fontWeight:500 }}
            onMouseOver={e => e.currentTarget.style.opacity = "0.7"}
            onMouseOut={e => e.currentTarget.style.opacity = "1"}>Back to Portfolio</a>
        </p>
      </div>
    </div>
  );
}
