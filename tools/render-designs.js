const { chromium } = require('playwright');
const path = require('path');
const F = process.argv[2], OUT = process.argv[3];
const font = (n,f)=>`@font-face{font-family:'${n}';src:url('file://${F}/${f}/package/files/${f}-arabic-700-normal.woff2')}`;
const designs = [
  {id:'sabr', ar:'صبر', fam:'Aref Ruqaa', tr:'SABR', es:'paciencia', size:1150},
  {id:'alhamdulillah', ar:'الحمد لله', fam:'Aref Ruqaa', tr:'ALHAMDULILLAH', es:'gracias a Dios', size:620},
  {id:'ramadan', ar:'رمضان كريم', fam:'Amiri', tr:'RAMADÁN KARIM', es:'un Ramadán generoso', size:560, moon:true},
  {id:'hubb', ar:'حب', fam:'Aref Ruqaa', tr:'HUBB', es:'amor', size:1300},
  {id:'umi', ar:'أمي', fam:'Aref Ruqaa', tr:'UMI', es:'mi madre', size:1150},
  {id:'baraka', ar:'بركة', fam:'Reem Kufi', tr:'BARAKA', es:'bendición', size:900},
];
(async()=>{
  const b = await chromium.launch();
  for (const ink of [{k:'dark',c:'#1b1b1b',g:'#b08a3e'},{k:'light',c:'#f7f2e8',g:'#d9b66a'}]) for (const d of designs) {
    const p = await b.newPage({viewport:{width:3000,height:3000}});
    const fs=require('fs');fs.writeFileSync(OUT+'/../tmp.html',`<html><head><style>${font('Aref Ruqaa','aref-ruqaa')}${font('Amiri','amiri')}${font('Reem Kufi','reem-kufi')}
    html,body{margin:0;background:transparent;width:3000px;height:3000px}
    .w{width:3000px;height:3000px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:${ink.c};}
    .ar{font-family:'${d.fam}';font-size:${d.size}px;line-height:1.25;direction:rtl}
    .rule{width:900px;height:10px;background:${ink.g};margin:220px 0 70px;border-radius:5px}
    .tr{font-family:Georgia,serif;font-size:170px;letter-spacing:40px;font-weight:700;margin-right:-40px}
    .es{font-family:Georgia,serif;font-style:italic;font-size:130px;color:${ink.g};margin-top:30px}
    .moon{font-size:380px;color:${ink.g};margin-bottom:-40px}</style></head><body><div class="w"><div class="in" style="display:flex;flex-direction:column;align-items:center;padding:80px">
    ${d.moon?'<div class="moon">☾</div>':''}<div class="ar">${d.ar}</div><div class="rule"></div><div class="tr">${d.tr}</div><div class="es">${d.es}</div></div></div></body></html>`);await p.goto('file://'+OUT+'/../tmp.html');
    await p.evaluate(()=>document.fonts.ready);
    await p.waitForTimeout(300);
    await p.locator(".in").screenshot({path:path.join(OUT,`${d.id}-${ink.k}.png`),omitBackground:true});
    await p.close();
  }
  await b.close();
})();
