// Renders the Black Friday Instagram posts (1080x1350) into social/blackfriday/.
const { chromium } = require('playwright');
const fs = require('fs');
const F = process.argv[2], OUT = process.argv[3], D = process.argv[4];
const ff = (fam, dir, file) => `@font-face{font-family:'${fam}';src:url('file://${F}/${dir}/package/files/${file}')}`;
const css = ff('Aref Ruqaa','aref-ruqaa','aref-ruqaa-arabic-700-normal.woff2') + ff('Anton','anton','anton-latin-400-normal.woff2') + `
html,body{margin:0}*{box-sizing:border-box}
.p{width:1080px;height:1350px;background:#0c0c0c;color:#f7f2e8;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:90px;position:relative;font-family:Georgia,serif;overflow:hidden}
.p::before{content:"";position:absolute;inset:36px;border:2px solid #b08a3e;border-radius:28px;pointer-events:none}
.ar{font-family:'Aref Ruqaa';color:#e3c27a;font-size:120px;line-height:1.3}
.bf{font-family:Anton;font-size:150px;letter-spacing:10px;line-height:1}
.big{font-family:Anton;font-size:300px;color:#e3c27a;line-height:1;margin:10px 0}
.k{font-size:34px;letter-spacing:12px;text-transform:uppercase;color:#e3c27a;margin-bottom:24px}
.t{font-size:48px;line-height:1.3;max-width:860px;margin-top:20px}
.code{display:inline-block;margin-top:36px;border:3px dashed #e3c27a;border-radius:18px;padding:18px 40px;font-family:Anton;font-size:64px;letter-spacing:8px}
.brand{position:absolute;bottom:70px;font-size:28px;letter-spacing:12px}.brand span{font-family:'Aref Ruqaa';color:#e3c27a;font-size:38px;letter-spacing:0;margin-left:12px}
.art{max-width:430px;max-height:430px}.pair{display:flex;gap:40px;align-items:center;margin:20px 0}`;
const brand = `<div class="brand">HARF<span>حرف</span></div>`;
const posts = [
  ['bf1-teaser', `<div class="ar">الجمعة السوداء</div><div class="bf">BLACK FRIDAY</div><div class="k" style="margin-top:30px">Viernes 27 · noviembre</div><div class="big">−20%</div><div class="t">en toda la tienda. Camisetas y sudaderas con caligrafía árabe.</div>`],
  ['bf2-3dias', `<div class="k">Black Friday</div><div class="big" style="font-size:420px">3</div><div class="bf" style="font-size:110px">DÍAS</div><div class="t">para el −20 % en todo. Ve eligiendo tu palabra.</div>`],
  ['bf3-manana', `<div class="ar" style="font-size:150px">غداً</div><div class="bf">MAÑANA</div><div class="t">Black Friday empieza a medianoche.<br>−20 % en toda la colección.</div>`],
  ['bf4-ya', `<div class="k">Ya está aquí</div><div class="bf">BLACK FRIDAY</div><div class="big">−20%</div><div class="t">en todo hasta el lunes</div><div class="code">BLACKFRIDAY</div>`],
  ['bf5-pareja', `<div class="k">Regalo de pareja · −20 %</div><div class="pair"><img class="art" src="file://${D}/habibi-light.png"><img class="art" src="file://${D}/habibti-light.png"></div><div class="t">Habibi &amp; Habibti. «Mi amor» en árabe, para él y para ella.</div><div class="code" style="font-size:48px">BLACKFRIDAY</div>`],
  ['bf6-ultimas', `<div class="k">Cyber Monday</div><div class="bf" style="font-size:130px">ÚLTIMAS HORAS</div><div class="big" style="font-size:240px">−20%</div><div class="t">Termina hoy a medianoche.</div><div class="code">BLACKFRIDAY</div>`],
];
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const [id, h] of posts) {
    fs.writeFileSync(OUT + '/_t.html', `<html><head><style>${css}</style></head><body><div class="p">${h}${brand}</div></body></html>`);
    await p.goto('file://' + OUT + '/_t.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${OUT}/${id}.jpg`, type: 'jpeg', quality: 90 });
  }
  fs.unlinkSync(OUT + '/_t.html'); await b.close();
})();
