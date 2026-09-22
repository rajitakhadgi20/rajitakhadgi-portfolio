import { CopyrightIcon } from "./icons";

export function Footer({ tk }) {
  return (
    <footer style={{ background:tk.bg,borderTop:`0.3px solid ${tk.footerBorder}`,height:55,display:"flex",alignItems:"center",padding:"0 80px",transition:"background .4s ease, border-color .4s" }}>
      <div style={{ display:"flex",alignItems:"center",gap:6 }}>
        <CopyrightIcon color={tk.footerIcon}/>
        <span style={{ fontFamily:"Inter,sans-serif",fontSize:14,fontWeight:400,lineHeight:"20px",color:tk.footerText,transition:"color .4s" }}>2026 Rajita. All rights reserved.</span>
      </div>
    </footer>
  );
}

