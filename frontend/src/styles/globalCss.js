/* ── GLOBAL CSS (injected once by the root App component) ─────── */
export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Poppins:wght@500;700&family=Inter:wght@400;500;600&family=Roboto:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{font-family:Inter,sans-serif;overflow-x:hidden;-webkit-font-smoothing:antialiased;}
img{display:block;max-width:100%;}
a{text-decoration:none;color:inherit;}
button{cursor:pointer;border:none;background:none;font:inherit;}
ul{list-style:none;padding:0;margin:0;}
.pf-root{width:100%;min-height:100vh;transition:background .4s ease;}
.pf-inner{width:100%;max-width:1440px;margin:0 auto;padding:0 80px;}
@keyframes tick{0%{transform:translateX(-50%);}100%{transform:translateX(0);}}
.tt{animation:tick 28s linear infinite;will-change:transform;}
.tt:hover{animation-play-state:paused;}
.rv{opacity:0;transform:translateY(36px);transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1);}
.rv.on{opacity:1;transform:none;}
.rl{opacity:0;transform:translateX(-40px);transition:opacity .75s cubic-bezier(.22,1,.36,1),transform .75s cubic-bezier(.22,1,.36,1);}
.rl.on{opacity:1;transform:none;}
.rr{opacity:0;transform:translateX(40px);transition:opacity .75s cubic-bezier(.22,1,.36,1) .15s,transform .75s cubic-bezier(.22,1,.36,1) .15s;}
.rr.on{opacity:1;transform:none;}
.bh{display:flex;align-items:center;justify-content:center;width:92px;height:32px;background:#8b31ca;border-radius:8px;overflow:hidden;position:relative;color:#fff;font-family:Inter,sans-serif;font-size:16px;font-weight:500;line-height:22px;transition:color .35s ease,transform .2s;flex-shrink:0;text-decoration:none;}
.bh span{position:relative;z-index:1;}
.bh::before{content:'';position:absolute;width:72px;height:72px;left:0;top:-20px;background:linear-gradient(90deg,#B3ABFF 0%,#C0B2FF 31%,#D7BCFF 70%,#F1C9FE 100%);border-radius:9999px;pointer-events:none;z-index:0;transform:translateX(-110%);transition:transform .4s ease,width .4s ease,height .4s ease;}
.bh:hover::before{transform:translateX(-12%);width:160px;height:72px;}
.bh:hover{color:#464646;transform:translateY(-1px);}
.bs{display:inline-flex;align-items:center;justify-content:center;height:32px;padding:5px 12px;background:#8b31ca;border-radius:8px;color:#fff;font-family:Inter,sans-serif;font-size:16px;font-weight:500;line-height:22px;flex-shrink:0;position:relative;text-decoration:none;overflow:hidden;width:104px;transition:width .4s cubic-bezier(.22,1,.36,1),transform .2s;}
.bs:hover{width:68px;transform:translateY(-1px);}
.bs .bs-inner{display:inline-flex;align-items:center;gap:8px;transition:transform .4s cubic-bezier(.22,1,.36,1),opacity .3s ease;transform:translateX(0);opacity:1;white-space:nowrap;}
.bs:hover .bs-inner{transform:translateX(130%);opacity:0;}
.bs .bs-outside-arr{position:absolute;left:50%;top:50%;transform:translate(calc(-50% - 80px),-50%);display:inline-flex;align-items:center;justify-content:center;transition:transform .4s cubic-bezier(.22,1,.36,1);}
.bs:hover .bs-outside-arr{transform:translate(-50%,-50%);}
.bsub{display:flex;align-items:center;justify-content:center;width:100%;height:40px;background:#8b31ca;border-radius:12px;border:none;cursor:pointer;color:#fff;font-family:Roboto,sans-serif;font-size:16px;font-weight:500;line-height:20px;position:relative;overflow:hidden;transition:color .35s ease,transform .2s;}
.bsub::before{content:'';position:absolute;width:72px;height:72px;left:0;top:-16px;background:linear-gradient(90deg,#B3ABFF 0%,#C0B2FF 31%,#D7BCFF 70%,#F1C9FE 100%);border-radius:9999px;pointer-events:none;transform:translateX(-110%);transition:transform .4s ease,width .4s ease,height .4s ease;z-index:0;}
.bsub span{position:relative;z-index:1;}
.bsub:hover::before{transform:translateX(-12%);width:608px;height:72px;}
.bsub:hover{color:#464646;transform:translateY(-1px);}
.btn-dlcv{position:relative;overflow:hidden;transition:color .35s ease,transform .2s;}
.btn-dlcv::before{content:'';position:absolute;width:72px;height:72px;left:0;top:-15px;background:linear-gradient(90deg,#B3ABFF 0%,#C0B2FF 31%,#D7BCFF 70%,#F1C9FE 100%);border-radius:9999px;pointer-events:none;transform:translateX(-110%);transition:transform .35s ease,width .35s ease,height .35s ease;z-index:0;}
.btn-dlcv span{position:relative;z-index:1;}
.btn-dlcv svg{position:relative;z-index:1;}
.btn-dlcv:hover::before{transform:translateX(-25%);width:283px;height:72px;}
.btn-dlcv:hover{color:#464646!important;}
.pc{transition:transform .3s cubic-bezier(.22,1,.36,1),box-shadow .3s ease,border-color .3s ease;}
.pc:hover{transform:translateY(-6px);}
.ham{display:none;flex-direction:column;justify-content:center;align-items:center;gap:5px;width:36px;height:36px;cursor:pointer;background:none;border:none;padding:4px;flex-shrink:0;}
.ham span{display:block;width:22px;height:2px;border-radius:2px;transition:transform .3s,opacity .3s;}
.flip-card{perspective:1000px;}
.flip-card-inner{width:100%;height:100%;position:relative;transform-style:preserve-3d;transition:transform 0.7s cubic-bezier(.22,1,.36,1);}
.flip-card:hover .flip-card-inner{transform:rotateY(180deg);}
.flip-front,.flip-back{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:12px;overflow:hidden;}
.flip-back{transform:rotateY(180deg);}
.about-g{display:grid;grid-template-columns:337px 1fr;gap:63px;align-items:start;}
.about-ph{width:337px;height:452px;}
.prow{display:flex;gap:25px;}
.pcard{flex:1 1 0;min-width:0;}
.ap-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:25px;}
.srow{display:flex;gap:33px;align-items:stretch;overflow-x:auto;overflow-y:visible;}
.srow::-webkit-scrollbar{display:none;}
.sk-row1{justify-content:center;width:100%;}
.sk-row2{justify-content:flex-start;}
.scard{flex:0 0 230px!important;width:230px!important;min-width:230px!important;max-width:230px!important;height:180px!important;min-height:180px!important;max-height:180px!important;border-radius:12px;overflow:hidden!important;cursor:pointer;box-sizing:border-box!important;}
.cert-g{display:grid;grid-template-columns:1fr 1fr;gap:53px;align-items:center;}
.cont-g{display:grid;grid-template-columns:55% 1fr;gap:60px;align-items:start;}
@media(max-width:1100px){.nav-ml a,.hero-links a{padding-left:7px!important;padding-right:7px!important;}}
.top-nav{box-shadow:none!important;}
.mmenu{border-top:none!important;}}
@media(max-width:1200px){.top-nav{padding:0 40px!important;}.pf-inner{padding:0 40px;}
@media(max-width:1024px){.dnav{display:none!important;}.ham{display:flex!important;}.mmenu{display:flex!important;}.prow{flex-wrap:wrap!important;}.pcard{flex:0 0 calc(50% - 13px)!important;}.ap-grid{grid-template-columns:repeat(2,1fr)!important;}.srow{gap:20px!important;}.scard{flex:0 0 200px!important;width:200px!important;min-width:200px!important;max-width:200px!important;}}
@media(min-width:1025px){.ham{display:none!important;}.mmenu{display:none!important;}}
@media(max-width:900px){.pf-inner{padding:0 24px;}.about-g{grid-template-columns:1fr!important;}.about-ph{width:100%!important;height:280px!important;}.prow{flex-direction:column!important;align-items:stretch!important;}.pcard{flex:none!important;max-width:400px!important;margin:0 auto!important;}.cert-g{grid-template-columns:1fr!important;}.cert-v{display:none!important;}.cont-g{grid-template-columns:1fr!important;gap:40px!important;}.frow{flex-direction:column!important;}.skills-gap{gap:20px!important;}.scard{flex:0 0 180px!important;width:180px!important;}}
@media(max-width:768px){.ap-grid{grid-template-columns:repeat(2,1fr)!important;gap:16px!important;}.scard{flex:0 0 160px!important;width:160px!important;height:180px!important;}}
@media(max-width:600px){.pf-inner{padding:0 20px;}.prow{gap:16px!important;}.pcard{max-width:100%!important;}.ap-grid{grid-template-columns:1fr!important;}.scard{flex:0 0 150px!important;width:150px!important;height:180px!important;}}
@keyframes galL{from{transform:translateX(0);}to{transform:translateX(-50%);}}
@keyframes galR{from{transform:translateX(-50%);}to{transform:translateX(0);}}
.gal-row{overflow:hidden;padding:14px 0;-webkit-mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent);mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent);}
.gal-track{display:flex;width:max-content;animation:galL 40s linear infinite;will-change:transform;}
.gal-track.rev{animation-name:galR;}
.gal-row:hover .gal-track,.gal-row:focus-within .gal-track{animation-play-state:paused;}
.gal-set{display:flex;gap:20px;padding-right:20px;flex-shrink:0;}
.gal-card{position:relative;display:block;width:340px;height:221px;border:1px solid;border-radius:12px;overflow:hidden;padding:0;cursor:pointer;transition:transform .3s cubic-bezier(.22,1,.36,1),box-shadow .3s ease,border-color .3s ease;}
.gal-card img{width:100%;height:100%;object-fit:cover;}
.gal-card:hover,.gal-card:focus-visible{transform:translateY(-6px);border-color:#A65FD7;box-shadow:0 10px 30px rgba(187,114,239,.30);outline:none;}
.gal-cap{position:absolute;left:0;right:0;bottom:0;padding:28px 16px 12px;text-align:left;font-family:Inter,sans-serif;font-size:14px;font-weight:500;line-height:20px;color:#fff;background:linear-gradient(to top,rgba(11,0,19,.85),transparent);opacity:0;transition:opacity .3s ease;}
.gal-card:hover .gal-cap,.gal-card:focus-visible .gal-cap{opacity:1;}
.gal-lb{position:fixed;inset:0;z-index:2000;background:rgba(11,0,19,.9);display:flex;align-items:center;justify-content:center;padding:32px;animation:fadeIn .25s ease;}
.gal-lb figure{max-width:min(1100px,100%);max-height:100%;display:flex;flex-direction:column;align-items:center;gap:14px;}
.gal-lb img{max-width:100%;max-height:calc(100vh - 140px);border-radius:12px;object-fit:contain;}
.gal-lb figcaption{font-family:Inter,sans-serif;font-size:16px;color:#f6e9ff;text-align:center;}
.gal-lb-x{position:absolute;top:20px;right:20px;width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;transition:background .2s;}
.gal-lb-x:hover,.gal-lb-x:focus-visible{background:#8b31ca;outline:none;}
@media(max-width:768px){.gal-card{width:260px;height:169px;}.gal-set{gap:14px;padding-right:14px;}}
@media(prefers-reduced-motion:reduce){.gal-track{animation:none!important;}.gal-row{overflow-x:auto;-webkit-mask-image:none;mask-image:none;}.gal-set[aria-hidden="true"]{display:none;}}
@keyframes fadeInUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
@keyframes dotBounce{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}
`;
