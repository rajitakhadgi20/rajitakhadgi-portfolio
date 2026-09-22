import { useState, useRef } from "react";
import { useReveal } from "../hooks/useReveal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

/* ── CONTACT ─────────────────────────────────────────────────── */
export function Contact({ tk }) {
  const hdr = useReveal("rv");
  const lft = useReveal("rl");
  const rgt = useReveal("rr");
  const formRef = useRef(null);

  const [form, setF]     = useState({ fn:"", ln:"", email:"", subject:"", msg:"" });
  const [status, setSt]  = useState("idle");

  const ch = e => setF(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    const { fn, ln, email, subject, msg } = form;
    if (!fn || !email || !msg) {
      setSt("error");
      setTimeout(() => setSt("idle"), 3500);
      return;
    }
    setSt("sending");
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:    `${fn} ${ln}`.trim(),
          email,
          subject,
          message: msg,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSt("success");
      setF({ fn:"", ln:"", email:"", subject:"", msg:"" });
      setTimeout(() => setSt("idle"), 5000);
    } catch {
      setSt("error");
      setTimeout(() => setSt("idle"), 4000);
    }
  };

  const inp = {
    background:tk.contactInp, border:`1px solid ${tk.contactInpBorder}`,
    borderRadius:8, padding:"6px 12px",
    fontFamily:"Roboto,sans-serif", fontSize:14, fontWeight:400, lineHeight:"24px",
    color:tk.contactInpText, width:"100%", outline:"none",
    transition:"background .4s, border-color .4s",
  };
  const lbl = { fontFamily:"Roboto,sans-serif",fontSize:14,fontWeight:400,lineHeight:"normal",color:tk.contactLbl,transition:"color .4s" };

  const btnLabel = status === "sending" ? "Sending…" : status === "success" ? "Message Sent ✓" : "Submit Message";
  const btnBg    = status === "success" ? "#22c55e" : status === "error" ? "#ef4444" : "#8b31ca";

  return (
    <section id="contact" style={{ background:tk.bgAlt,overflow:"hidden",padding:"100px 0 120px",transition:"background .4s ease" }}>
      <div className="pf-inner">
        <h2 ref={hdr} style={{ fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:32,lineHeight:"42px",letterSpacing:"1.5px",color:tk.sectionTitle,transition:"color .4s" }}>GET IN TOUCH</h2>
        <div className="cont-g" style={{ marginTop:62 }}>
          <div ref={lft} style={{ display:"flex",flexDirection:"column",gap:18 }}>
            <p style={{ fontFamily:"Inter,sans-serif",fontSize:17,fontWeight:400,lineHeight:"28px",color:tk.contactText,transition:"color .4s" }}>If you have a project idea, a question, or simply want to connect, feel free to reach out. I'm currently available for freelance work and open to full-time opportunities.</p>
            <p style={{ fontFamily:"Inter,sans-serif",fontSize:17,fontWeight:400,lineHeight:"28px",color:tk.contactText,transition:"color .4s" }}>You can expect a response within 24 hours.</p>
            <div style={{ display:"flex",gap:16,alignItems:"center",marginTop:28,flexWrap:"wrap" }}>
              {[
                ["Linkedin",  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17A1.4 1.4 0 0 1 15.71 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z"/></svg>,  "https://www.linkedin.com/in/rajita-khadgi-bbb16b30b"],
                ["Instagram", <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7.8 2H16.2C19.4 2 22 4.6 22 7.8V16.2A5.8 5.8 0 0 1 16.2 22H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2M7.6 4A3.6 3.6 0 0 0 4 7.6V16.4C4 18.39 5.61 20 7.6 20H16.4A3.6 3.6 0 0 0 20 16.4V7.6C20 5.61 18.39 4 16.4 4H7.6M17.25 5.5A1.25 1.25 0 0 1 18.5 6.75A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75A1.25 1.25 0 0 1 17.25 5.5M12 7A5 5 0 0 1 17 12A5 5 0 0 1 12 17A5 5 0 0 1 7 12A5 5 0 0 1 12 7M12 9A3 3 0 0 0 9 12A3 3 0 0 0 12 15A3 3 0 0 0 15 12A3 3 0 0 0 12 9Z"/></svg>, "https://www.instagram.com/rajita_shahi?igsh=czhuNm5oaWd3MXZ2"],
                ["WhatsApp",  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.71C7 10.93 7.89 12.1 8 12.27C8.14 12.44 9.76 14.94 12.25 16C12.84 16.27 13.3 16.42 13.66 16.53C14.25 16.72 14.79 16.69 15.22 16.63C15.7 16.56 16.68 16.03 16.89 15.45C17.1 14.87 17.1 14.38 17.04 14.27C16.97 14.17 16.81 14.11 16.56 14C16.31 13.86 15.09 13.26 14.87 13.18C14.64 13.1 14.5 13.06 14.31 13.31C14.13 13.56 13.67 14.11 13.53 14.27C13.38 14.44 13.24 14.46 13 14.34C12.74 14.21 11.94 13.95 11 13.11C10.26 12.45 9.77 11.64 9.62 11.39C9.5 11.15 9.61 11 9.73 10.89C9.84 10.78 10 10.6 10.1 10.45C10.23 10.31 10.27 10.2 10.35 10.04C10.43 9.87 10.39 9.73 10.33 9.61C10.27 9.5 9.77 8.26 9.56 7.77C9.36 7.29 9.16 7.35 9 7.34C8.86 7.33 8.7 7.33 8.53 7.33Z"/></svg>, "https://wa.me/9779811052414"],
              ].map(([l, icon, href]) => (
                <a key={l} href={href} target="_blank" rel="noopener noreferrer" aria-label={l} style={{
                  display:"flex", alignItems:"center", gap:8, padding:"9px 14px",
                  background:tk.sbBg, border:`1px solid ${tk.sbBorder}`, borderRadius:24,
                  width:129, color:tk.sbText,
                  fontFamily:"Inter,sans-serif", fontSize:14, fontWeight:400, lineHeight:"20px",
                  transition:"background .2s, border-color .2s, transform .2s, color .4s", flexShrink:0,
                }}
                onMouseEnter={e => { e.currentTarget.style.background=tk.sbBgHov; e.currentTarget.style.borderColor="#a65fd7"; e.currentTarget.style.transform="translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background=tk.sbBg; e.currentTarget.style.borderColor=tk.sbBorder; e.currentTarget.style.transform="none"; }}
                >
                  <span style={{ display:"flex", alignItems:"center", color: tk.moonIcon ? "#000" : tk.sbText, flexShrink:0 }}>{icon}</span>{l}
                </a>
              ))}
            </div>
          </div>

          <div ref={rgt} style={{ display:"flex",flexDirection:"column",gap:14 }}>
            <div className="frow" style={{ display:"flex",gap:22 }}>
              {[["fn","First Name","Name","given-name"],["ln","Last Name","Name","family-name"]].map(([n,l,ph,ac]) => (
                <div key={n} style={{ display:"flex",flexDirection:"column",gap:8,flex:1 }}>
                  <label style={lbl}>{l}</label>
                  <input name={n} type="text" placeholder={ph} autoComplete={ac} value={form[n]} onChange={ch} style={{ ...inp, color:form[n]?tk.contactLbl:tk.contactInpText }}/>
                </div>
              ))}
            </div>
            {[["email","Email","Enter your email","email"],["subject","Subject","Enter the subject","off"]].map(([n,l,ph,ac]) => (
              <div key={n} style={{ display:"flex",flexDirection:"column",gap:8 }}>
                <label style={lbl}>{l}</label>
                <input name={n} type={n==="email"?"email":"text"} placeholder={ph} autoComplete={ac} value={form[n]} onChange={ch} style={{ ...inp, color:form[n]?tk.contactLbl:tk.contactInpText }}/>
              </div>
            ))}
            <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
              <label style={lbl}>Message</label>
              <textarea name="msg" placeholder="Type something....." value={form.msg} onChange={ch} style={{ ...inp,height:102,resize:"none",color:form.msg?tk.contactLbl:tk.contactInpText }}/>
            </div>
            {status === "error" && (
              <p style={{ fontFamily:"Inter,sans-serif",fontSize:13,color:"#ef4444",marginTop:-4 }}>
                {!form.fn || !form.email || !form.msg ? "Please fill in First Name, Email and Message." : "Something went wrong. Please try again."}
              </p>
            )}
            <button
              onClick={handleSubmit}
              disabled={status === "sending"}
              className="bsub"
              style={{ background:btnBg, transition:"background .3s ease, transform .2s", opacity: status==="sending" ? 0.8 : 1 }}
            >
              <span>{btnLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
