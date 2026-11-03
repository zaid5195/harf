// Instagram posts for the «Un idioma» collection: carousel (intro + 9 designs) and 3 language posts.
const { chromium } = require('playwright');
const fs = require('fs');
const F = process.argv[2], OUT = process.argv[3], D = process.argv[4];
const ff = (fam, dir, file, style = 'normal') => `@font-face{font-family:'${fam}';font-style:${style};src:url('file://${F}/${dir}/package/files/${file}')}`;
const css = ff('Aref Ruqaa','aref-ruqaa','aref-ruqaa-arabic-700-normal.woff2') + ff('Cormorant','cormorant-garamond','cormorant-garamond-latin-700-normal.woff2') +
  ff('Cormorant','cormorant-garamond','cormorant-garamond-latin-600-italic.woff2','italic') + `
html,body{margin:0}*{box-sizing:border-box}
.p{width:1080px;height:1350px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:90px;position:relative;font-family:Cormorant,Georgia,serif}
.cream{background:#f7f2e8;color:#1b1b1b}.black{background:#1b1b1b;color:#f7f2e8}
.k{font-size:32px;letter-spacing:12px;text-transform:uppercase;color:#b08a3e;margin-bottom:30px;font-weight:700}
h1{font-size:96px;line-height:1.05;margin:0 0 30px;font-weight:700}
.it{font-style:italic;font-weight:600;font-size:46px;line-height:1.35;max-width:840px}
.art{max-width:720px;max-height:760px}
.tag{position:absolute;top:80px;font-size:28px;letter-spacing:10px;text-transform:uppercase;color:#b08a3e;font-weight:700}
.brand{position:absolute;bottom:64px;font-size:28px;letter-spacing:12px;font-weight:700}.brand span{font-family:'Aref Ruqaa';color:#b08a3e;font-size:38px;letter-spacing:0;margin-left:12px}
.langs{display:flex;gap:46px;font-size:64px;margin:20px 0 40px}.langs span{border-bottom:4px solid #b08a3e;padding-bottom:6px}
.trio{display:flex;gap:30px;align-items:center;justify-content:center;margin:40px 0}.trio img{max-width:280px;max-height:300px}`;
const brand = '<div class="brand">HARF<span>حرف</span></div>';
const LBL = { ar: 'العربية', es: 'Español', en: 'English' };
const items = [['yusra','ar'],['qahwa','ar'],['nur','ar'],['azahar','es'],['azucar','es'],['almohada','es'],['patience','en'],['peace','en'],['everyletter','en']];
const posts = [
  ['c00-intro', 'black', `<div class="k">Nueva colección</div><h1>Un idioma.<br>Una palabra.</h1><div class="langs"><span style="font-family:'Aref Ruqaa'">العربية</span><span>Español</span><span>English</span></div><div class="it">Nueve diseños, cada uno en un solo idioma. Desliza →</div>`],
  ...items.map(([k, l], i) => [`c0${i + 1}-${k}`, i % 2 ? 'black' : 'cream', `<div class="tag">${l === 'ar' ? `<span style="font-family:'Aref Ruqaa';letter-spacing:0;font-size:40px">${LBL[l]}</span>` : LBL[l]}</div><img class="art" src="file://${D}/${k}-${i % 2 ? 'light' : 'dark'}.png">`]),
  ['l-ar', 'black', `<div class="k" style="font-family:'Aref Ruqaa';letter-spacing:0;font-size:56px">العربية</div><div class="trio">${['yusra','qahwa','nur'].map((k) => `<img src="file://${D}/${k}-light.png">`).join('')}</div><div class="it">Caligrafía pura, sin traducción. Para quien la lee… y para quien la admira.</div>`],
  ['l-es', 'cream', `<div class="k">Español</div><div class="trio">${['azahar','azucar','almohada'].map((k) => `<img src="file://${D}/${k}-dark.png">`).join('')}</div><div class="it">Palabras españolas que nacieron en árabe: azahar, azúcar, almohada… y 4.000 más.</div>`],
  ['l-en', 'black', `<div class="k">English</div><div class="trio">${['patience','peace','everyletter'].map((k) => `<img src="file://${D}/${k}-light.png">`).join('')}</div><div class="it">Arabic wisdom, in English. Patience, peace and stories.</div>`],
];
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const [id, c, h] of posts) {
    fs.writeFileSync(OUT + '/_t.html', `<html><head><style>${css}</style></head><body><div class="p ${c}">${h}${brand}</div></body></html>`);
    await p.goto('file://' + OUT + '/_t.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${OUT}/${id}.jpg`, type: 'jpeg', quality: 90 });
  }
  fs.unlinkSync(OUT + '/_t.html'); await b.close();
})();
