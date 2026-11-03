// HARF · Panel de administración (Cloudflare Worker).
// Secrets (Settings → Variables and Secrets, type "Secret"):
//   STRIPE_KEY      restricted key rk_live_… (Coupons: write, Promotion codes: write,
//                   Checkout Sessions: read, Balance: read)
//   ADMIN_PASSWORD  the only password that opens the panel
//   SESSION_SECRET  any long random string (signs the login cookie)
// Nothing secret lives in this file; it is safe to keep it in a public repo.

const COOKIE = "harf_admin";
const SESSION_HOURS = 12;
const enc = new TextEncoder();

async function hmac(secret, data) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/[+/=]/g, (c) => ({ "+": "-", "/": "_", "=": "" }[c]));
}
function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
async function makeToken(env) {
  const exp = Date.now() + SESSION_HOURS * 3600e3;
  return `${exp}.${await hmac(env.SESSION_SECRET, String(exp))}`;
}
async function validToken(env, token) {
  const [exp, sig] = (token || "").split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return safeEqual(sig, await hmac(env.SESSION_SECRET, exp));
}
function cookieOf(req) {
  const m = (req.headers.get("Cookie") || "").match(new RegExp(`${COOKIE}=([^;]+)`));
  return m ? m[1] : "";
}
const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...headers } });

async function stripe(env, method, path, params) {
  const body = params ? new URLSearchParams(params) : undefined;
  const url = `https://api.stripe.com/v1${path}${method === "GET" && body ? "?" + body : ""}`;
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${env.STRIPE_KEY}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: method === "GET" ? undefined : body,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `Stripe ${res.status}`);
  return data;
}

async function summary(env) {
  const since = Math.floor(Date.now() / 1000) - 30 * 86400;
  const [bal, sessions] = await Promise.all([
    stripe(env, "GET", "/balance"),
    stripe(env, "GET", "/checkout/sessions", { limit: "50", "created[gte]": String(since), status: "complete", "expand[]": "data.line_items" }),
  ]);
  const orders = sessions.data.filter((s) => s.payment_status === "paid").map((s) => ({
    date: s.created,
    total: s.amount_total / 100,
    discount: (s.total_details?.amount_discount || 0) / 100,
    items: (s.line_items?.data || []).map((li) => `${li.quantity}× ${li.description}`),
    size: (s.custom_fields || []).find((f) => f.key === "talla")?.dropdown?.value || "",
    city: s.shipping_details?.address?.city || s.customer_details?.address?.city || "",
  }));
  const eur = (arr) => (arr.find((b) => b.currency === "eur")?.amount || 0) / 100;
  return {
    available: eur(bal.available),
    pending: eur(bal.pending),
    orders,
    revenue30: orders.reduce((a, o) => a + o.total, 0),
  };
}

async function listCodes(env) {
  const r = await stripe(env, "GET", "/promotion_codes", { limit: "100", "expand[]": "data.coupon" });
  return r.data.map((p) => ({
    id: p.id,
    code: p.code,
    active: p.active,
    percent: p.coupon.percent_off,
    amount: p.coupon.amount_off ? p.coupon.amount_off / 100 : null,
    used: p.times_redeemed,
    max: p.max_redemptions,
    expires: p.expires_at,
    firstOrder: !!p.restrictions?.first_time_transaction,
  }));
}

async function createCode(env, b) {
  const code = String(b.code || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (code.length < 3 || code.length > 20) throw new Error("El código debe tener entre 3 y 20 letras o números.");
  const coupon = { duration: "once", name: `Código ${code}` };
  const percent = Number(b.percent), amount = Number(b.amount);
  if (percent > 0 && percent <= 50) coupon.percent_off = String(percent);
  else if (amount > 0 && amount <= 20) { coupon.amount_off = String(Math.round(amount * 100)); coupon.currency = "eur"; }
  else throw new Error("Pon un % entre 1 y 50, o un importe entre 1 y 20 €.");
  const c = await stripe(env, "POST", "/coupons", coupon);
  const promo = { coupon: c.id, code };
  if (Number(b.max) > 0) promo.max_redemptions = String(Math.floor(b.max));
  if (Number(b.days) > 0) promo.expires_at = String(Math.floor(Date.now() / 1000 + b.days * 86400));
  if (b.firstOrder) promo["restrictions[first_time_transaction]"] = "true";
  return stripe(env, "POST", "/promotion_codes", promo);
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const path = url.pathname;
    if (path === "/" || path === "/index.html") return new Response(PAGE, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Frame-Options": "DENY" } });

    if (path === "/api/login" && req.method === "POST") {
      const { password } = await req.json().catch(() => ({}));
      await new Promise((r) => setTimeout(r, 600)); // slows down password guessing
      if (!env.ADMIN_PASSWORD || !safeEqual(String(password || ""), env.ADMIN_PASSWORD)) return json({ error: "Contraseña incorrecta" }, 401);
      const token = await makeToken(env);
      return json({ ok: true }, 200, { "Set-Cookie": `${COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_HOURS * 3600}` });
    }
    if (path === "/api/logout") return json({ ok: true }, 200, { "Set-Cookie": `${COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0` });

    if (path.startsWith("/api/")) {
      if (!(await validToken(env, cookieOf(req)))) return json({ error: "No autorizado" }, 401);
      try {
        if (path === "/api/summary") return json(await summary(env));
        if (path === "/api/codes" && req.method === "GET") return json(await listCodes(env));
        if (path === "/api/codes" && req.method === "POST") return json(await createCode(env, await req.json()));
        const m = path.match(/^\/api\/codes\/(promo_[A-Za-z0-9]+)$/);
        if (m && req.method === "POST") {
          const { active } = await req.json();
          return json(await stripe(env, "POST", `/promotion_codes/${m[1]}`, { active: active ? "true" : "false" }));
        }
      } catch (e) {
        return json({ error: e.message }, 400);
      }
    }
    return new Response("Not found", { status: 404 });
  },
};

const PAGE = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>HARF · Admin</title>
<style>
:root{--ink:#1b1b1b;--paper:#f7f2e8;--gold:#b08a3e;--muted:#6b645a;--line:#e4dccb;--card:#fffdf8;--ok:#2f7a3d;--bad:#b23b2e}
@media (prefers-color-scheme:dark){:root{--ink:#f2ede3;--paper:#141311;--card:#1e1c19;--line:#34302a;--muted:#a59d90}}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
.wrap{max-width:900px;margin:0 auto;padding:20px 16px 60px}h1{font-family:Georgia,serif;font-weight:400;margin:6px 0 18px}
h2{font-size:18px;margin:30px 0 10px}.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}.stat b{display:block;font-size:26px}.stat span{color:var(--muted);font-size:14px}
input,select{width:100%;padding:11px 12px;border:1px solid var(--line);border-radius:10px;background:var(--paper);color:var(--ink);font-size:16px}
label{font-size:14px;color:var(--muted);display:block;margin:10px 0 4px}.row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
button{background:var(--ink);color:var(--paper);border:0;border-radius:999px;padding:11px 20px;font-size:15px;cursor:pointer}
button.ghost{background:transparent;color:var(--ink);border:1px solid var(--line)}button.small{padding:6px 12px;font-size:13px}
table{width:100%;border-collapse:collapse;font-size:14px}td,th{text-align:left;padding:9px 6px;border-bottom:1px solid var(--line);vertical-align:top}
th{color:var(--muted);font-weight:500}.code{font-family:ui-monospace,monospace;font-weight:600}.tag{font-size:12px;padding:2px 8px;border-radius:999px;border:1px solid var(--line)}
.on{color:var(--ok)}.off{color:var(--bad)}.msg{margin-top:10px;font-size:14px}.top{display:flex;justify-content:space-between;align-items:center}
.scroll{overflow-x:auto}.check{display:flex;gap:8px;align-items:center;margin-top:12px;color:var(--ink)}.check input{width:auto}
</style></head><body><div class="wrap">
<div class="top"><h1>HARF <span style="color:var(--gold)">حرف</span> · Admin</h1><button class="ghost small" id="out" hidden>Salir</button></div>
<section id="login" class="card" hidden>
  <label for="pw">Contraseña</label><input id="pw" type="password" autocomplete="current-password">
  <div style="margin-top:12px"><button id="go">Entrar</button></div><div class="msg" id="lmsg"></div>
</section>
<section id="app" hidden>
  <div class="stats">
    <div class="card stat"><b id="sAvail">–</b><span>Disponible en Stripe</span></div>
    <div class="card stat"><b id="sPend">–</b><span>Pendiente</span></div>
    <div class="card stat"><b id="sRev">–</b><span>Ventas 30 días</span></div>
    <div class="card stat"><b id="sOrd">–</b><span>Pedidos 30 días</span></div>
  </div>
  <h2>Crear código de descuento</h2>
  <div class="card">
    <label for="cCode">Código (lo que escribe el cliente)</label><input id="cCode" placeholder="EJEMPLO: BLACKFRIDAY">
    <div class="row">
      <div><label for="cType">Tipo</label><select id="cType"><option value="percent">% de descuento</option><option value="amount">€ de descuento</option></select></div>
      <div><label for="cVal">Valor</label><input id="cVal" type="number" min="1" max="50" value="10"></div>
    </div>
    <div class="row">
      <div><label for="cDays">Caduca en (días, vacío = nunca)</label><input id="cDays" type="number" min="1"></div>
      <div><label for="cMax">Usos máximos (vacío = sin límite)</label><input id="cMax" type="number" min="1"></div>
    </div>
    <label class="check"><input id="cFirst" type="checkbox"> Solo para la primera compra de cada cliente</label>
    <div style="margin-top:14px"><button id="create">Crear código</button></div><div class="msg" id="cmsg"></div>
  </div>
  <h2>Códigos</h2>
  <div class="card scroll"><table><thead><tr><th>Código</th><th>Descuento</th><th>Usos</th><th>Caduca</th><th>Estado</th><th></th></tr></thead><tbody id="codes"></tbody></table></div>
  <h2>Últimos pedidos</h2>
  <div class="card scroll"><table><thead><tr><th>Fecha</th><th>Producto</th><th>Talla</th><th>Ciudad</th><th>Total</th></tr></thead><tbody id="orders"></tbody></table></div>
</section>
</div>
<script>
const $=(id)=>document.getElementById(id);
const eur=(n)=>n.toFixed(2).replace(".",",")+" €";
const day=(t)=>t?new Date(t*1000).toLocaleDateString("es-ES"):"—";
const esc=(s)=>String(s).replace(/[&<>"]/g,(c)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
async function api(path,opts={}){const r=await fetch(path,{credentials:"same-origin",headers:{"Content-Type":"application/json"},...opts});const d=await r.json().catch(()=>({}));if(r.status===401&&path!=="/api/login"){show(false);throw new Error("Sesión caducada");}if(!r.ok)throw new Error(d.error||"Error");return d;}
function show(logged){$("login").hidden=logged;$("app").hidden=!logged;$("out").hidden=!logged;if(logged)load();}
async function load(){
  const [s,c]=await Promise.all([api("/api/summary"),api("/api/codes")]);
  $("sAvail").textContent=eur(s.available);$("sPend").textContent=eur(s.pending);$("sRev").textContent=eur(s.revenue30);$("sOrd").textContent=s.orders.length;
  $("orders").innerHTML=s.orders.length?s.orders.map(o=>"<tr><td>"+day(o.date)+"</td><td>"+o.items.map(esc).join("<br>")+"</td><td>"+esc(o.size)+"</td><td>"+esc(o.city)+"</td><td>"+eur(o.total)+(o.discount?"<br><small>−"+eur(o.discount)+"</small>":"")+"</td></tr>").join(""):'<tr><td colspan="5">Todavía no hay pedidos.</td></tr>';
  $("codes").innerHTML=c.map(p=>"<tr><td class='code'>"+esc(p.code)+(p.firstOrder?" <span class='tag'>1ª compra</span>":"")+"</td><td>"+(p.percent?p.percent+" %":eur(p.amount))+"</td><td>"+p.used+(p.max?" / "+p.max:"")+"</td><td>"+day(p.expires)+"</td><td class='"+(p.active?"on":"off")+"'>"+(p.active?"Activo":"Desactivado")+"</td><td><button class='ghost small' data-id='"+p.id+"' data-a='"+(p.active?0:1)+"'>"+(p.active?"Desactivar":"Activar")+"</button></td></tr>").join("");
}
$("go").onclick=async()=>{$("lmsg").textContent="";try{await api("/api/login",{method:"POST",body:JSON.stringify({password:$("pw").value})});$("pw").value="";show(true);}catch(e){$("lmsg").textContent=e.message;}};
$("pw").onkeydown=(e)=>{if(e.key==="Enter")$("go").click();};
$("out").onclick=async()=>{await api("/api/logout");show(false);};
$("create").onclick=async()=>{const t=$("cType").value,v=Number($("cVal").value);$("cmsg").textContent="Creando…";
  try{await api("/api/codes",{method:"POST",body:JSON.stringify({code:$("cCode").value,percent:t==="percent"?v:0,amount:t==="amount"?v:0,days:Number($("cDays").value)||0,max:Number($("cMax").value)||0,firstOrder:$("cFirst").checked})});
  $("cmsg").textContent="✓ Código creado. Ya funciona en la página de pago.";$("cCode").value="";load();}catch(e){$("cmsg").textContent="✗ "+e.message;}};
$("codes").onclick=async(e)=>{const b=e.target.closest("button[data-id]");if(!b)return;b.disabled=true;try{await api("/api/codes/"+b.dataset.id,{method:"POST",body:JSON.stringify({active:b.dataset.a==="1"})});load();}catch(err){alert(err.message);b.disabled=false;}};
api("/api/summary").then(()=>show(true)).catch(()=>show(false));
</script></body></html>`;
