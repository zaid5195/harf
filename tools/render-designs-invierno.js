// HARF – Colección Invierno. Renders transparent print PNGs (dark ink + light ink).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const F = process.argv[2], OUT = process.argv[3];
const ff = (fam, dir, file) => `@font-face{font-family:'${fam}';src:url('file://${F}/${dir}/package/files/${file}')}`;
const fonts = [
  ff('Aref Ruqaa','aref-ruqaa','aref-ruqaa-arabic-700-normal.woff2'), ff('Amiri','amiri','amiri-arabic-700-normal.woff2'),
  ff('Lalezar','lalezar','lalezar-arabic-400-normal.woff2'), ff('Rakkas','rakkas','rakkas-arabic-400-normal.woff2'),
  ff('Katibeh','katibeh','katibeh-arabic-400-normal.woff2'), ff('Reem Kufi','reem-kufi','reem-kufi-arabic-700-normal.woff2'),
  ff('Anton','anton','anton-latin-400-normal.woff2'), ff('Noto Kufi','noto-kufi-arabic','noto-kufi-arabic-arabic-900-normal.woff2'),
].join('');
// Horseshoe arch of the Mezquita de Córdoba: alternating voussoirs.
function arch(ink, gold) {
  const cx = 600, cy = 560, r1 = 430, r2 = 560, a0 = -200, a1 = 20, n = 21; let segs = '';
  for (let i = 0; i < n; i++) {
    const s = (a0 + (a1 - a0) * i / n) * Math.PI / 180, e = (a0 + (a1 - a0) * (i + 1) / n) * Math.PI / 180;
    const p = (r, a) => `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
    segs += `<path d="M${p(r1,s)} L${p(r2,s)} A${r2},${r2} 0 0,1 ${p(r2,e)} L${p(r1,e)} A${r1},${r1} 0 0,0 ${p(r1,s)}Z" fill="${i % 2 ? '#b5532c' : '#efe0c2'}" stroke="${ink}" stroke-width="10"/>`;
  }
  return `<svg width="1200" height="980" viewBox="0 0 1200 980">${segs}
    <path d="M${600-430*Math.cos(20*Math.PI/180)},${560+430*Math.sin(20*Math.PI/180)} L${600-430*Math.cos(20*Math.PI/180)},970 M${600+430*Math.cos(20*Math.PI/180)},${560+430*Math.sin(20*Math.PI/180)} L${600+430*Math.cos(20*Math.PI/180)},970" stroke="${ink}" stroke-width="14"/>
    <text x="600" y="740" text-anchor="middle" font-family="Katibeh" font-size="270" fill="${ink}">الأندلس</text></svg>`;
}
const designs = [
  { id: 'ojala', html: (c) => `
    <div style="font-family:'Aref Ruqaa';font-size:620px;line-height:1.35;color:${c.ink}">إن شاء الله</div>
    <div style="width:1500px;height:10px;background:${c.gold};margin:40px 0 70px"></div>
    <div style="font-family:Georgia,serif;font-weight:700;font-size:400px;letter-spacing:60px;margin-right:-60px;line-height:1;color:${c.ink}">OJALÁ</div>
    <div style="font-family:Georgia,serif;font-style:italic;font-size:120px;margin-top:70px;color:${c.gold}">del árabe andalusí «law šá lláh»</div>` },
  { id: 'habibi', html: (c) => `
    <div style="font-family:'Lalezar';font-size:1050px;line-height:1.2;color:${c.ink}">حبيبي</div>
    <div style="font-family:Anton;font-size:360px;letter-spacing:30px;margin:40px -30px 0 0;color:${c.gold}">HABIBI</div>
    <div style="font-family:Georgia,serif;font-style:italic;font-size:120px;margin-top:30px;color:${c.ink}">(mi amor)</div>` },
  { id: 'habibti', html: (c) => `
    <div style="font-family:'Lalezar';font-size:1050px;line-height:1.2;color:${c.ink}">حبيبتي</div>
    <div style="font-family:Anton;font-size:360px;letter-spacing:30px;margin:40px -30px 0 0;color:${c.gold}">HABIBTI</div>
    <div style="font-family:Georgia,serif;font-style:italic;font-size:120px;margin-top:30px;color:${c.ink}">(mi amor)</div>` },
  { id: 'yalla', html: (c) => `
    <div style="font-family:'Rakkas';font-size:1250px;line-height:1.15;color:${c.ink}">يلا</div>
    <div style="display:flex;align-items:center;gap:60px;margin-top:-40px">
      <div style="font-family:Anton;font-size:340px;letter-spacing:26px;color:${c.ink}">YALLA</div>
      <svg width="300" height="200" viewBox="0 0 300 200"><path d="M10 100 H260 M190 30 L270 100 L190 170" fill="none" stroke="${c.gold}" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
    <div style="font-family:Georgia,serif;font-style:italic;font-size:130px;margin-top:20px;color:${c.gold}">¡vamos!</div>` },
  { id: 'andalus', html: (c) => `${arch(c.ink, c.gold)}
    <div style="font-family:Georgia,serif;font-weight:700;font-size:210px;letter-spacing:44px;margin:90px -44px 0 0;color:${c.ink}">AL-ÁNDALUS</div>
    <div style="font-family:Georgia,serif;font-size:110px;letter-spacing:22px;margin-top:40px;color:${c.gold}">CÓRDOBA · GRANADA · SEVILLA</div>` },
  { id: 'salam', html: (c) => `
    <div style="font-family:'Noto Kufi';font-size:900px;line-height:1.35;color:${c.ink}">سلام</div>
    <div style="display:flex;align-items:center;gap:50px;margin-top:10px">
      <div style="width:260px;height:8px;background:${c.gold}"></div>
      <div style="font-family:Georgia,serif;font-size:190px;letter-spacing:40px;margin-right:-40px;color:${c.ink}">SALAM</div>
      <div style="width:260px;height:8px;background:${c.gold}"></div></div>
    <div style="font-family:Georgia,serif;font-style:italic;font-size:130px;margin-top:40px;color:${c.gold}">paz</div>` },
];
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 4200, height: 4200 } });
  for (const ink of [{ k: 'dark', ink: '#1b1b1b', gold: '#a8812f' }, { k: 'light', ink: '#f7f2e8', gold: '#d9b66a' }])
    for (const d of designs) {
      fs.writeFileSync(OUT + '/../_t2.html', `<html><head><style>${fonts}html,body{margin:0;background:transparent}
        .w{width:4200px;height:4200px;display:flex;align-items:center;justify-content:center}
        .in{display:flex;flex-direction:column;align-items:center;padding:80px;direction:ltr;text-align:center}
        .in > div:first-child{direction:rtl}</style></head><body><div class="w"><div class="in">${d.html(ink)}</div></div></body></html>`);
      await p.goto('file://' + OUT + '/../_t2.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
      await p.locator('.in').screenshot({ path: path.join(OUT, `${d.id}-${ink.k}.png`), omitBackground: true });
    }
  await b.close();
})();
