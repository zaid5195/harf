const { chromium } = require('playwright');
const fs = require('fs');
const F = process.argv[2], OUT = process.argv[3], D = process.argv[4];
const ff = (n,f,w=700)=>`@font-face{font-family:'${n}';src:url('file://${F}/${f}/package/files/${f}-arabic-${w}-normal.woff2')}`;
const css = `${ff('Aref Ruqaa','aref-ruqaa')}${ff('Amiri','amiri')}
html,body{margin:0}*{box-sizing:border-box}
.p{width:1080px;height:1350px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:Georgia,serif;position:relative;padding:90px;text-align:center}
.cream{background:#f7f2e8;color:#1b1b1b}.black{background:#1b1b1b;color:#f7f2e8}.gold{color:#b08a3e}
.brand{position:absolute;bottom:60px;font-size:30px;letter-spacing:12px}
.brand span{font-family:'Aref Ruqaa';letter-spacing:0;font-size:40px;color:#b08a3e;margin-left:14px}
.art{max-width:620px;max-height:720px}
.k{font-size:34px;letter-spacing:10px;text-transform:uppercase;color:#b08a3e;margin-bottom:30px}
h1{font-weight:400;font-size:74px;line-height:1.15;margin:0 0 30px}
p{font-size:38px;line-height:1.45;margin:0;max-width:860px}
.ar{font-family:'Aref Ruqaa';font-size:330px;line-height:1.1;color:#b08a3e}`;
const brand = `<div class="brand">HARF<span>حرف</span></div>`;
const posts = [
 {id:'01-intro', c:'black', h:`<div class="ar">حرف</div><h1>Caligrafía árabe<br>para llevar puesta</h1><p>Palabras con alma, impresas bajo pedido en Europa.</p>`},
 ...['sabr','alhamdulillah','ramadan','hubb','umi','baraka'].map((k,i)=>({id:`0${i+2}-${k}`, c: i%2? 'black':'cream', h:`<img class="art" src="file://${D}/${k}-${i%2?'light':'dark'}.png">`})),
 {id:'08-como', c:'cream', h:`<div class="k">Cómo funciona</div><h1>Hecha solo para ti</h1><p>Eliges tu palabra y tu talla.<br>La imprimimos en Europa.<br>Llega a tu casa en 7–14 días.</p>`},
 {id:'09-ramadan', c:'black', h:`<div class="k">Ramadán 2027</div><div class="ar" style="font-size:190px;line-height:1.6;margin-bottom:40px">رمضان كريم</div><h1 style="font-size:60px">Regala con sentido</h1><p>Pide antes de enero para recibirla a tiempo.</p>`},
];
(async()=>{
  const b = await chromium.launch();
  const p = await b.newPage({viewport:{width:1080,height:1350}});
  for (const x of posts) {
    fs.writeFileSync(OUT+'/_t.html',`<html><head><style>${css}</style></head><body><div class="p ${x.c}">${x.h}${brand}</div></body></html>`);
    await p.goto('file://'+OUT+'/_t.html'); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({path:`${OUT}/${x.id}.jpg`,type:'jpeg',quality:90});
  }
  // profile picture
  await p.setViewportSize({width:1080,height:1080});
  fs.writeFileSync(OUT+'/_t.html',`<html><head><style>${css}</style></head><body><div style="width:1080px;height:1080px;background:#1b1b1b;display:flex;align-items:center;justify-content:center"><div class="ar" style="font-size:520px;margin-top:-60px">حرف</div></div></body></html>`);
  await p.goto('file://'+OUT+'/_t.html'); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(200);
  await p.screenshot({path:`${OUT}/perfil-harf.jpg`,type:'jpeg',quality:92});
  fs.unlinkSync(OUT+'/_t.html'); await b.close();
})();
