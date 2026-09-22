import { A } from "./assets";
import { FIGMA } from "./figma";

/* ── FALLBACK PROJECTS DATA ─────────────────────────────────────
   Used only if the backend API is unreachable (e.g. previewing the
   site without the backend running). Once the backend is up, the
   Projects/AllProjectsPage components fetch live data from
   `${VITE_API_URL}/api/projects` instead, which is what the admin
   dashboard edits. ------------------------------------------------ */
export const ALL_PROJECTS = [
  { title:"Greenhub Organic Website",    tags:["WEBSITE"],           desc:"An e-commerce platform promoting fresh organic products with a clean and sustainable shopping experience.", img:A.pGrn,  figma:FIGMA.greenhub   },
  { title:"Hotel Booking App",           tags:["MOBILE APP"],        desc:"A user-friendly hotel reservation app with smart filters, secure payments, and booking management.",        img:A.pHot,  figma:FIGMA.hotel      },
  { title:"Thulo Help App",              tags:["MOBILE APP"],        desc:"A service marketplace connecting customers with trusted local professionals for easy booking.",             img:A.pThu,  figma:FIGMA.thulo      },
  { title:"Trip Land Travel Website",    tags:["WEBSITE"],           desc:"A modern travel booking platform for exploring destinations, planning trips, and managing reservations.",    img:A.pTrp,  figma:FIGMA.trip       },
  { title:"Daily UI Challenges",         tags:["WEBSITE"],           desc:"A collection of modern UI design exercises focused on improving visual hierarchy and interface skills.",     img:A.pDay,  figma:FIGMA.dailyui    },
  { title:"News Website",                tags:["WEBSITE"],           desc:"A responsive digital news platform delivering categorized stories with clear navigation.",                  img:A.pNews, figma:FIGMA.news       },
  { title:"Restaurant POS System",       tags:["POS"],               desc:"An intuitive point-of-sale system for managing orders, payments, inventory, and sales efficiently.",        img:A.pPos,  figma:FIGMA.pos        },
  { title:"Ecommerce Clothing Website",  tags:["WEBSITE"],           desc:"Stylish online store with smart filters, product options, secure checkout, and bold streetwear design.",   img:A.pEco,  figma:FIGMA.ecommerce  },
  { title:"Hydropower Website",          tags:["WEBSITE"],           desc:"A clean industrial website highlighting hydropower products, electrical solutions, and major infrastructure.", img:A.pHyd, figma:FIGMA.hydropower },
  { title:"Himalayan Travel Website",    tags:["WEBSITE","REDESIGN"],desc:"A trekking website redesign enhancing user experience and booking flow with a clean, immersive interface.", img:A.pHim,  figma:FIGMA.himalayan  },
];
