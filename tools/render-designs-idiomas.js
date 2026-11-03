// HARF – Colección «Un idioma»: each design uses a single language (Arabic, Spanish or English).
// Usage: node render-designs-idiomas.js <fonts dir> <out dir>
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const F = process.argv[2], OUT = process.argv[3];
const ff = (fam, dir, file, style = 'normal') => `@font-face{font-family:'${fam}';font-style:${style};src:url('file://${F}/${dir}/package/files/${file}')}`;
const fonts = [
  ff('Aref Ruqaa', 'aref-ruqaa', 'aref-ruqaa-arabic-700-normal.woff2'),
  ff('Lalezar', 'lalezar', 'lalezar-arabic-400-normal.woff2'),
  ff('Katibeh', 'katibeh', 'katibeh-arabic-400-normal.woff2'),
  ff('Anton', 'anton', 'anton-latin-400-normal.woff2'),
  ff('Cormorant', 'cormorant-garamond', 'cormorant-garamond-latin-700-normal.woff2'),
  ff('Cormorant', 'cormorant-garamond', 'cormorant-garamond-latin-600-italic.woff2', 'italic'),
  ff('Playfair', 'playfair-display', 'playfair-display-latin-900-italic.woff2', 'italic'),
].join('');

const cup = (g) => `<svg width="420" height="300" viewBox="0 0 140 100"><path d="M20 30h72v30a30 30 0 0 1-30 30h-12a30 30 0 0 1-30-30z" fill="none" stroke="${g}" stroke-width="7" stroke-linejoin="round"/><path d="M92 40h10a14 14 0 0 1 0 28h-12" fill="none" stroke="${g}" stroke-width="7"/><path d="M42 6c-6 8 6 10 0 18M60 6c-6 8 6 10 0 18" fill="none" stroke="${g}" stroke-width="5" stroke-linecap="round"/></svg>`;
const star = (g) => `<svg width="300" height="300" viewBox="0 0 100 100"><path d="M50 4l9 30 30-9-21 23 21 23-30-9-9 30-9-30-30 9 21-23-21-23 30 9z" fill="${g}"/></svg>`;
const blossom = (g) => `<svg width="360" height="360" viewBox="0 0 100 100">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="50" cy="26" rx="13" ry="22" fill="none" stroke="${g}" stroke-width="3.5" transform="rotate(${a} 50 50)"/>`).join('')}<circle cx="50" cy="50" r="7" fill="${g}"/></svg>`;

const designs = [
  // ——— Árabe ———
  { id: 'yusra', lang: 'ar', html: (c) => `
    <div dir="rtl" style="font-family:'Aref Ruqaa';font-size:560px;line-height:1.35;color:${c.ink}">إنّ مع العسر</div>
    <div dir="rtl" style="font-family:'Aref Ruqaa';font-size:900px;line-height:1.2;margin-top:-80px;color:${c.gold}">يُسرا</div>` },
  { id: 'qahwa', lang: 'ar', html: (c) => `
    ${cup(c.gold)}
    <div dir="rtl" style="font-family:'Lalezar';font-size:1150px;line-height:1.15;margin-top:-40px;color:${c.ink}">قهوة</div>` },
  { id: 'nur', lang: 'ar', html: (c) => `
    ${star(c.gold)}
    <div dir="rtl" style="font-family:'Katibeh';font-size:1500px;line-height:1;margin-top:-30px;color:${c.ink}">نور</div>` },
  // ——— Español ———
  { id: 'azahar', lang: 'es', html: (c) => `
    ${blossom(c.gold)}
    <div style="font-family:'Cormorant';font-weight:700;font-size:420px;letter-spacing:70px;margin:40px -70px 0 0;line-height:1;color:${c.ink}">AZAHAR</div>
    <div style="width:1300px;height:9px;background:${c.gold};margin:70px 0 60px"></div>
    <div style="font-family:'Cormorant';font-style:italic;font-weight:600;font-size:150px;color:${c.ink}">la flor del naranjo</div>
    <div style="font-family:'Cormorant';font-style:italic;font-weight:600;font-size:110px;margin-top:20px;color:${c.gold}">palabra de origen andalusí</div>` },
  { id: 'azucar', lang: 'es', html: (c) => `
    <div style="font-family:Anton;font-size:720px;letter-spacing:20px;line-height:1;color:${c.ink}">AZÚCAR</div>
    <div style="font-family:'Playfair';font-style:italic;font-weight:900;font-size:190px;margin-top:60px;color:${c.gold}">(sí, también viene del árabe)</div>` },
  { id: 'almohada', lang: 'es', html: (c) => `
    <div style="font-family:'Cormorant';font-style:italic;font-weight:600;font-size:170px;color:${c.gold}">mi palabra favorita:</div>
    <div style="font-family:'Cormorant';font-weight:700;font-size:440px;letter-spacing:40px;margin:30px -40px 0 0;line-height:1;color:${c.ink}">ALMOHADA</div>
    <div style="width:1500px;height:9px;background:${c.gold};margin:70px 0 60px"></div>
    <div style="font-family:'Cormorant';font-style:italic;font-weight:600;font-size:130px;color:${c.ink}">de origen árabe, como las mejores cosas</div>` },
  // ——— English ———
  { id: 'patience', lang: 'en', html: (c) => `
    <div style="font-family:'Cormorant';font-weight:700;font-size:330px;letter-spacing:50px;margin-right:-50px;line-height:1.05;color:${c.ink}">PATIENCE</div>
    <div style="font-family:'Cormorant';font-style:italic;font-weight:600;font-size:200px;margin:20px 0;color:${c.gold}">is</div>
    <div style="font-family:'Cormorant';font-weight:700;font-size:330px;letter-spacing:50px;margin-right:-50px;line-height:1.05;color:${c.ink}">BEAUTIFUL</div>` },
  { id: 'peace', lang: 'en', html: (c) => `
    <div style="font-family:Anton;font-size:520px;line-height:.95;letter-spacing:14px;color:${c.ink}">PEACE</div>
    <div style="font-family:'Playfair';font-style:italic;font-weight:900;font-size:260px;line-height:1.1;margin:10px 0;color:${c.gold}">be with</div>
    <div style="font-family:Anton;font-size:520px;line-height:.95;letter-spacing:14px;color:${c.ink}">YOU</div>` },
  { id: 'everyletter', lang: 'en', html: (c) => `
    <div style="font-family:'Cormorant';font-style:italic;font-weight:600;font-size:250px;line-height:1.05;color:${c.ink}">Every letter</div>
    <div style="font-family:'Cormorant';font-style:italic;font-weight:600;font-size:250px;line-height:1.05;color:${c.ink}">has a <span style="color:${c.gold}">story.</span></div>
    <div style="width:900px;height:9px;background:${c.gold};margin:80px 0 50px"></div>
    <div style="font-family:'Cormorant';font-weight:700;font-size:120px;letter-spacing:60px;margin-right:-60px;color:${c.ink}">HARF</div>` },
];

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 4400, height: 4400 } });
  for (const ink of [{ k: 'dark', ink: '#1b1b1b', gold: '#a8812f' }, { k: 'light', ink: '#f7f2e8', gold: '#d9b66a' }])
    for (const d of designs) {
      fs.writeFileSync(OUT + '/_t.html', `<html><head><style>${fonts}html,body{margin:0;background:transparent}
        .w{width:4400px;height:4400px;display:flex;align-items:center;justify-content:center}
        .in{display:flex;flex-direction:column;align-items:center;padding:80px;text-align:center;white-space:nowrap}</style></head>
        <body><div class="w"><div class="in">${d.html(ink)}</div></div></body></html>`);
      await p.goto('file://' + OUT + '/_t.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
      await p.locator('.in').screenshot({ path: path.join(OUT, `${d.id}-${ink.k}.png`), omitBackground: true });
    }
  fs.unlinkSync(OUT + '/_t.html'); await b.close();
})();
