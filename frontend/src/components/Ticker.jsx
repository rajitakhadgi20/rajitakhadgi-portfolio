import { Fragment } from "react";

const TICKS = ["WEB DESIGN","MOBILE APP DESIGN","PRODUCT DESIGN","DASHBOARD  DESIGN","INTERACTIVE  DESIGN"];

export function Ticker({ tk }) {
  const items = [...TICKS, ...TICKS];
  return (
    <div style={{ overflow:"hidden",width:"100%",background:tk.tickerBg,height:77,display:"flex",alignItems:"center",transition:"background .4s ease" }}>
      <div className="tt" style={{ display:"flex",gap:32,alignItems:"center",whiteSpace:"nowrap",width:"max-content" }}>
        {items.map((t,i) => (
          <Fragment key={i}>
            <span style={{ fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:22,lineHeight:"26px",letterSpacing:"0.5px",color:tk.tickerText,flexShrink:0,transition:"color .4s" }}>{t}</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink:0 }}>
              <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z" fill={tk.tickerText} opacity="0.7"/>
            </svg>
          </Fragment>
        ))}
      </div>
    </div>
  );
}