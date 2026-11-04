// Renders HARF Instagram Reels (1080x1920, 30 fps) frame by frame with Playwright, then encodes with ffmpeg.
// Usage: node render-reels.js <fonts dir> <repo dir> <out dir>
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs'), path = require('path');
const [F, R, OUT] = process.argv.slice(2);
const FPS = 30;
const ff = (fam, dir, file, style = 'normal') => `@font-face{font-family:'${fam}';font-style:${style};src:url('file://${F}/${dir}/package/files/${file}')}`;
const CSS = [
  ff('Aref Ruqaa', 'aref-ruqaa', 'aref-ruqaa-arabic-700-normal.woff2'),
  ff('Anton', 'anton', 'anton-latin-400-normal.woff2'),
  ff('Cormorant', 'cormorant-garamond', 'cormorant-garamond-latin-700-normal.woff2'),
  ff('Cormorant', 'cormorant-garamond', 'cormorant-garamond-latin-600-italic.woff2', 'italic'),
].join('') + `
html,body{margin:0;background:#111}*{box-sizing:border-box}
#s{position:relative;width:1080px;height:1920px;overflow:hidden;background:#141210;color:#f7f2e8;font-family:Cormorant,Georgia,serif}
.l{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:90px;opacity:0}
.ar{font-family:'Aref Ruqaa';color:#e3c27a;line-height:1.25}
.big{font-family:Anton;letter-spacing:8px;line-height:1}
.it{font-style:italic;font-weight:600}
.k{font-size:40px;letter-spacing:14px;text-transform:uppercase;color:#e3c27a;font-weight:700}
.photo{position:absolute;inset:0;background-size:cover;background-position:center}
.shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.05) 40%,rgba(0,0,0,.75))}
.brand{position:absolute;left:0;right:0;bottom:120px;text-align:center;font-size:34px;letter-spacing:14px;font-weight:700}
.brand span{font-family:'Aref Ruqaa';color:#e3c27a;font-size:46px;letter-spacing:0;margin-left:14px}
.cap{position:absolute;left:60px;right:60px;bottom:230px;text-align:center}
.pill{display:inline-block;border:3px solid #e3c27a;border-radius:999px;padding:18px 44px;font-family:Anton;font-size:52px;letter-spacing:4px;margin-top:40px}`;

// Scene helpers: each scene = [start, end, html, {enter:'fade'|'up'|'zoom'}]
const brand = `<div class="brand">HARF<span>حرف</span></div>`;
const reels = {
  'reel1-palabras': {
    dur: 12,
    scenes: [
      [0, 2.4, `<div class="k">¿Lo sabías?</div><div class="big" style="font-size:150px;margin-top:40px">ESTAS PALABRAS</div><div class="it" style="font-size:90px;margin-top:20px">vienen del <span style="color:#e3c27a">árabe</span></div>`, 'up'],
      [2.4, 4.4, `<div class="big" style="font-size:190px">OJALÁ</div><div class="it" style="font-size:70px;margin:40px 0 20px">← law šá lláh</div><div class="ar" style="font-size:150px">إن شاء الله</div>`, 'zoom'],
      [4.4, 6.4, `<div class="big" style="font-size:190px">AZÚCAR</div><div class="it" style="font-size:70px;margin:40px 0 20px">← as-sukkar</div><div class="ar" style="font-size:170px">السكّر</div>`, 'zoom'],
      [6.4, 8.4, `<div class="big" style="font-size:170px">ALMOHADA</div><div class="it" style="font-size:70px;margin:40px 0 20px">← al-mujadda</div><div class="ar" style="font-size:170px">المخدّة</div>`, 'zoom'],
      [8.4, 10.0, `<div class="big" style="font-size:190px">AZAHAR</div><div class="it" style="font-size:70px;margin:40px 0 20px">← az-zahr</div><div class="ar" style="font-size:170px">الزهر</div>`, 'zoom'],
      [10.0, 12, `<div class="it" style="font-size:80px">y más de 4.000…</div><div class="ar" style="font-size:260px;margin:30px 0">حرف</div><div class="k">Llévalas puestas</div><div class="pill">TIENDA EN LA BIO</div>`, 'up'],
    ],
  },
  'reel2-lookbook': {
    dur: 11,
    scenes: [
      [0, 2.2, `<div class="photo" style="background-image:url('file://${R}/social/modelos/qahwa.jpg')"></div><div class="shade"></div><div class="cap"><div class="ar" style="font-size:120px">قهوة</div><div class="it" style="font-size:60px">café</div></div>`, 'kb'],
      [2.2, 4.4, `<div class="photo" style="background-image:url('file://${R}/social/modelos/habibti.jpg')"></div><div class="shade"></div><div class="cap"><div class="ar" style="font-size:120px">حبيبتي</div><div class="it" style="font-size:60px">mi amor</div></div>`, 'kb'],
      [4.4, 6.6, `<div class="photo" style="background-image:url('file://${R}/social/modelos/yusra.jpg')"></div><div class="shade"></div><div class="cap"><div class="ar" style="font-size:96px">إنّ مع العسر يُسرا</div><div class="it" style="font-size:56px">con la dificultad llega la facilidad</div></div>`, 'kb'],
      [6.6, 8.8, `<div class="photo" style="background-image:url('file://${R}/social/modelos/peace.jpg')"></div><div class="shade"></div><div class="cap"><div class="big" style="font-size:110px">PEACE</div><div class="it" style="font-size:60px">be with you</div></div>`, 'kb'],
      [8.8, 11, `<div class="ar" style="font-size:280px">حرف</div><div class="it" style="font-size:76px;margin-top:10px">Caligrafía árabe para llevar puesta</div><div class="pill">DESDE 24,95 €</div>`, 'up'],
    ],
  },
  'reel3-tupalabra': {
    dur: 11,
    scenes: [
      [0, 2.0, `<div class="k">Una palabra</div><div class="big" style="font-size:170px;margin:30px 0">¿CUÁL ES</div><div class="big" style="font-size:170px;color:#e3c27a">LA TUYA?</div>`, 'up'],
      [2.0, 3.6, `<div class="ar" style="font-size:420px">حب</div><div class="it" style="font-size:90px">amor</div>`, 'zoom'],
      [3.6, 5.2, `<div class="ar" style="font-size:380px">سلام</div><div class="it" style="font-size:90px">paz</div>`, 'zoom'],
      [5.2, 6.8, `<div class="ar" style="font-size:420px">صبر</div><div class="it" style="font-size:90px">paciencia</div>`, 'zoom'],
      [6.8, 8.4, `<div class="ar" style="font-size:420px">نور</div><div class="it" style="font-size:90px">luz</div>`, 'zoom'],
      [8.4, 11, `<div class="it" style="font-size:80px">Escríbela en comentarios 👇</div><div class="ar" style="font-size:260px;margin:30px 0">حرف</div><div class="pill">TIENDA EN LA BIO</div>`, 'up'],
    ],
  },
};

const ease = (x) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3);
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const [id, reel] of Object.entries(reels)) {
    const dir = path.join(OUT, id); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
    const layers = reel.scenes.map(([, , h], i) => `<div class="l" id="l${i}">${h}</div>`).join('');
    fs.writeFileSync(path.join(OUT, '_r.html'), `<html><head><style>${CSS}</style></head><body><div id="s">${layers}${brand}</div></body></html>`);
    await p.goto('file://' + path.join(OUT, '_r.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
    const N = Math.round(reel.dur * FPS);
    for (let f = 0; f < N; f++) {
      const t = f / FPS;
      const st = reel.scenes.map(([s, e, , fx]) => {
        const fin = ease((t - s) / 0.35), fout = 1 - ease((t - (e - 0.25)) / 0.25);
        const o = t < s || t > e ? 0 : Math.min(fin, fout);
        const k = (t - s) / (e - s);
        const tr = fx === 'up' ? `translateY(${(1 - fin) * 60}px)` : fx === 'zoom' ? `scale(${0.92 + 0.08 * fin + 0.03 * k})` : '';
        return { o, tr, kb: fx === 'kb' ? 1.04 + 0.08 * k : 0 };
      });
      await p.evaluate((st) => st.forEach((v, i) => {
        const el = document.getElementById('l' + i); el.style.opacity = v.o; el.style.transform = v.tr;
        const ph = el.querySelector('.photo'); if (ph) ph.style.transform = `scale(${v.kb})`;
        if (ph) { el.style.padding = 0; }
      }), st);
      await p.screenshot({ path: path.join(dir, `f${String(f).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 92 });
    }
    // Soft original ambient pad (no third-party music).
    const out = path.join(OUT, `${id}.mp4`);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(dir, 'f%04d.jpg'),
      '-f', 'lavfi', '-i', `aevalsrc=0.05*sin(2*PI*220*t)*(0.6+0.4*sin(2*PI*0.25*t))+0.04*sin(2*PI*277.18*t)+0.035*sin(2*PI*329.63*t)+0.02*sin(2*PI*440*t)*(0.5+0.5*sin(2*PI*0.5*t)):s=44100:d=${reel.dur}`,
      '-af', `afade=t=in:d=1,afade=t=out:st=${reel.dur - 1.2}:d=1.2,lowpass=f=1800`,
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-r', String(FPS), '-b:v', '6M', '-c:a', 'aac', '-b:a', '128k', '-shortest', '-movflags', '+faststart', out]);
    fs.rmSync(dir, { recursive: true, force: true });
    console.log('ok', out);
  }
  fs.unlinkSync(path.join(OUT, '_r.html')); await b.close();
})();
