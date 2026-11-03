// Catálogo de HARF. Cada producto existe en Printify (shop 29594313).
// LINKS: enlaces de pago de Stripe (Payment Links) por "diseño|tipo|color". Aceptan códigos de descuento; la talla se elige en el pago.
const STORE = {
  name: "HARF",
  email: "franse026@gmail.com",
  currency: "€",
  shipping: 4.95,
};

const MOCK = (id, variant, slug) =>
  `https://images-api.printify.com/mockup/${id}/${variant}/102044/${slug}.jpg?camera_label=front-2&v=2`;


const PRODUCTS = [
  { key: "sabr", ar: "صبر", name: "Sabr", meaning: "paciencia", printify: "6aea1f9a1fffd0f62b04a2a8", slug: "camiseta-sabr-sbr-paciencia",
    text: "La paciencia es belleza. Una sola palabra en caligrafía Ruqaa que recuerda lo esencial." },
  { key: "alhamdulillah", ar: "الحمد لله", name: "Alhamdulillah", meaning: "gracias a Dios", printify: "6aea1fa5261e6eac8806f103", slug: "camiseta-alhamdulillah-alhmd-llh",
    text: "Gratitud en cada día. La frase más bonita para llevar puesta." },
  { key: "ramadan", ar: "رمضان كريم", name: "Ramadán Karim", meaning: "un Ramadán generoso", printify: "6aea1fa5befd9774f109f04d", slug: "camiseta-ramadan-karim-rmdan-krym",
    text: "Para celebrar el mes sagrado en familia. El regalo perfecto antes de Ramadán." },
  { key: "hubb", ar: "حب", name: "Hubb", meaning: "amor", printify: "6aea1fa5519fa728560ec8fb", slug: "camiseta-hubb-hb-amor",
    text: "El amor en una sola palabra. Para regalar a quien más quieres." },
  { key: "umi", ar: "أمي", name: "Umi", meaning: "mi madre", printify: "6aea1fa51fffd0f62b04a2b8", slug: "camiseta-umi-amy-mi-madre",
    text: "Porque madre solo hay una. El regalo para el Día de la Madre y para siempre." },
  { key: "baraka", ar: "بركة", name: "Baraka", meaning: "bendición", printify: "6aea1fa5261e6eac8806f104", slug: "camiseta-baraka-brk-bendicion",
    text: "Que la bendición te acompañe. Caligrafía Kufi, moderna y geométrica." },
].map((p) => ({
  ...p,
  id: p.key,
  type: "Camiseta",
  price: 29.95,
  sizes: ["S", "M", "L", "XL", "2XL"],
  colors: {
    negro: { label: "Negro", img: MOCK(p.printify, 18102, p.slug) },
    blanco: { label: "Blanco", img: MOCK(p.printify, 18542, p.slug) },
  },
}));

// Colección Invierno (noviembre 2026): camisetas y sudaderas.
const TEE_NOTE = "Bella+Canvas 3001 unisex, 100% algodón.";
const HOODIE_NOTE = "Sudadera con capucha unisex Gildan 18500, interior afelpado.";
const WINTER_TEXT = {
  ojala: { ar: "إن شاء الله", name: "Ojalá", meaning: "del árabe andalusí «law šá lláh»", text: "¿Sabías que «ojalá» viene del árabe? Una palabra que llevamos más de mil años diciendo en español." },
  habibi: { ar: "حبيبي", name: "Habibi", meaning: "mi amor (él)", text: "La palabra árabe más querida: cariño, amor, amigo del alma. Combínala con Habibti." },
  habibti: { ar: "حبيبتي", name: "Habibti", meaning: "mi amor (ella)", text: "«Mi amor» en femenino. El regalo de pareja perfecto junto a Habibi." },
  yalla: { ar: "يلا", name: "Yalla", meaning: "¡vamos!", text: "La palabra con más energía del árabe, en caligrafía Rakkas. Para los que nunca se quedan quietos." },
  andalus: { ar: "الأندلس", name: "Al-Ándalus", meaning: "Córdoba · Granada · Sevilla", text: "El arco de la Mezquita de Córdoba y «الأندلس» en caligrafía. Nuestra historia compartida." },
  salam: { ar: "سلام", name: "Salam", meaning: "paz", text: "Un mensaje sencillo y universal. El regalo ideal para estas fiestas." },
};
const WINTER = [
 {
  "key": "ojala",
  "type": "Sudadera",
  "colors": {
   "negro": {
    "img": "https://images-api.printify.com/mockup/6aea4490d08071d85809a9c6/32920/98424/sudadera-ojala-an-shaaa-allh.jpg?camera_label=front",
    "stripe": "https://buy.stripe.com/9B63cv46Z3Hx59KcUTdnW0f"
   },
   "arena": {
    "img": "https://images-api.printify.com/mockup/6aea4490d08071d85809a9c6/42166/98424/sudadera-ojala-an-shaaa-allh.jpg?camera_label=front",
    "stripe": "https://buy.stripe.com/eVq28r9rjdi7eKk9IHdnW0c"
   }
  }
 },
 {
  "key": "habibi",
  "type": "Sudadera",
  "colors": {
   "negro": {
    "img": "https://images-api.printify.com/mockup/6aea4491eba4cf9b840bc19a/32920/98424/sudadera-habibi-hbyby.jpg?camera_label=front",
    "stripe": "https://buy.stripe.com/8x2dR99rj3Hx45Gg75dnW0h"
   },
   "arena": {
    "img": "https://images-api.printify.com/mockup/6aea4491eba4cf9b840bc19a/42166/98424/sudadera-habibi-hbyby.jpg?camera_label=front",
    "stripe": "https://buy.stripe.com/9B66oH6f7b9ZeKk6wvdnW0j"
   }
  }
 },
 {
  "key": "habibti",
  "type": "Sudadera",
  "colors": {
   "negro": {
    "img": "https://images-api.printify.com/mockup/6aea4495eba4cf9b840bc1a0/32920/98424/sudadera-habibti-hbybty.jpg?camera_label=front",
    "stripe": "https://buy.stripe.com/00wfZh32V0vleKk2gfdnW0k"
   },
   "arena": {
    "img": "https://images-api.printify.com/mockup/6aea4495eba4cf9b840bc1a0/42166/98424/sudadera-habibti-hbybty.jpg?camera_label=front",
    "stripe": "https://buy.stripe.com/cNicN532V1zpfOo8EDdnW0o"
   }
  }
 },
 {
  "key": "andalus",
  "type": "Sudadera",
  "colors": {
   "negro": {
    "img": "https://images-api.printify.com/mockup/6aea449940a6113740070e66/32920/98424/sudadera-al-andalus-alandls.jpg?camera_label=front",
    "stripe": "https://buy.stripe.com/7sY5kDfPHb9Zau4aMLdnW0u"
   },
   "arena": {
    "img": "https://images-api.printify.com/mockup/6aea449940a6113740070e66/42166/98424/sudadera-al-andalus-alandls.jpg?camera_label=front",
    "stripe": "https://buy.stripe.com/aFa6oHdHzgujfOof31dnW0v"
   }
  }
 },
 {
  "key": "yalla",
  "type": "Sudadera",
  "colors": {
   "negro": {
    "img": "https://images-api.printify.com/mockup/6aea449661691e4afb0ea8e9/32920/98424/sudadera-yalla-yla.jpg?camera_label=front",
    "stripe": "https://buy.stripe.com/5kQfZheLDfqf59K6wvdnW0q"
   },
   "arena": {
    "img": "https://images-api.printify.com/mockup/6aea449661691e4afb0ea8e9/42166/98424/sudadera-yalla-yla.jpg?camera_label=front",
    "stripe": "https://buy.stripe.com/dRm4gz9rj7XN9q03kjdnW0p"
   }
  }
 },
 {
  "key": "salam",
  "type": "Sudadera",
  "colors": {
   "negro": {
    "img": "https://images-api.printify.com/mockup/6aea449a7002cd705002bd45/32920/98424/sudadera-salam-slam-paz.jpg?camera_label=front",
    "stripe": "https://buy.stripe.com/eVq28r32V5PF6dOg75dnW0y"
   },
   "arena": {
    "img": "https://images-api.printify.com/mockup/6aea449a7002cd705002bd45/42166/98424/sudadera-salam-slam-paz.jpg?camera_label=front",
    "stripe": "https://buy.stripe.com/3cI00jbzr91R59K6wvdnW0z"
   }
  }
 },
 {
  "key": "ojala",
  "type": "Camiseta",
  "colors": {
   "negro": {
    "img": "https://images-api.printify.com/mockup/6aea449195144eca570ac6f0/18102/102044/camiseta-ojala-an-shaaa-allh.jpg?camera_label=front-2",
    "stripe": "https://buy.stripe.com/14AaEXcDvdi7dGg6wvdnW0d"
   },
   "blanco": {
    "img": "https://images-api.printify.com/mockup/6aea449195144eca570ac6f0/18542/102044/camiseta-ojala-an-shaaa-allh.jpg?camera_label=front-2",
    "stripe": "https://buy.stripe.com/8x228rdHzguj6dO2gfdnW0e"
   }
  }
 },
 {
  "key": "habibi",
  "type": "Camiseta",
  "colors": {
   "negro": {
    "img": "https://images-api.printify.com/mockup/6aea449115984cb0cd0b813f/18102/102044/camiseta-habibi-hbyby.jpg?camera_label=front-2",
    "stripe": "https://buy.stripe.com/6oUcN5dHz3Hx59K8EDdnW0g"
   },
   "blanco": {
    "img": "https://images-api.printify.com/mockup/6aea449115984cb0cd0b813f/18542/102044/camiseta-habibi-hbyby.jpg?camera_label=front-2",
    "stripe": "https://buy.stripe.com/4gM3cv8nffqf0TudYXdnW0i"
   }
  }
 },
 {
  "key": "habibti",
  "type": "Camiseta",
  "colors": {
   "negro": {
    "img": "https://images-api.printify.com/mockup/6aea44947a0b432491024df5/18102/102044/camiseta-habibti-hbybty.jpg?camera_label=front-2",
    "stripe": "https://buy.stripe.com/5kQ5kD8nf7XNcCc3kjdnW0m"
   },
   "blanco": {
    "img": "https://images-api.printify.com/mockup/6aea44947a0b432491024df5/18542/102044/camiseta-habibti-hbybty.jpg?camera_label=front-2",
    "stripe": "https://buy.stripe.com/5kQ6oH32Vb9ZcCc3kjdnW0n"
   }
  }
 },
 {
  "key": "andalus",
  "type": "Camiseta",
  "colors": {
   "negro": {
    "img": "https://images-api.printify.com/mockup/6aea4499d08071d85809a9d0/18102/102044/camiseta-al-andalus-alandls.jpg?camera_label=front-2",
    "stripe": "https://buy.stripe.com/4gM00jeLD7XNeKkcUTdnW0r"
   },
   "blanco": {
    "img": "https://images-api.printify.com/mockup/6aea4499d08071d85809a9d0/18542/102044/camiseta-al-andalus-alandls.jpg?camera_label=front-2",
    "stripe": "https://buy.stripe.com/fZu00jeLD4LB59K6wvdnW0t"
   }
  }
 },
 {
  "key": "yalla",
  "type": "Camiseta",
  "colors": {
   "negro": {
    "img": "https://images-api.printify.com/mockup/6aea44955a2fa4efad07f179/18102/102044/camiseta-yalla-yla.jpg?camera_label=front-2",
    "stripe": "https://buy.stripe.com/8x24gzavngujgSsbQPdnW0l"
   },
   "blanco": {
    "img": "https://images-api.printify.com/mockup/6aea44955a2fa4efad07f179/18542/102044/camiseta-yalla-yla.jpg?camera_label=front-2",
    "stripe": "https://buy.stripe.com/eVqdR9bzr4LBgSsdYXdnW0s"
   }
  }
 },
 {
  "key": "salam",
  "type": "Camiseta",
  "colors": {
   "negro": {
    "img": "https://images-api.printify.com/mockup/6aea449915984cb0cd0b814d/18102/102044/camiseta-salam-slam-paz.jpg?camera_label=front-2",
    "stripe": "https://buy.stripe.com/7sY00j6f74LBfOo087dnW0w"
   },
   "blanco": {
    "img": "https://images-api.printify.com/mockup/6aea449915984cb0cd0b814d/18542/102044/camiseta-salam-slam-paz.jpg?camera_label=front-2",
    "stripe": "https://buy.stripe.com/9B628r0UN5PF59KaMLdnW0x"
   }
  }
 }
];
const LABELS = { negro: "Negro", blanco: "Blanco", arena: "Arena" };
PRODUCTS.unshift(...WINTER.map((w) => ({
  ...WINTER_TEXT[w.key],
  key: w.key,
  id: w.key + "-" + w.type.toLowerCase(),
  type: w.type,
  isNew: true,
  price: w.type === "Sudadera" ? 49.95 : 29.95,
  sizes: ["S", "M", "L", "XL", "2XL"],
  colors: Object.fromEntries(Object.entries(w.colors).map(([c, v]) => [c, { label: LABELS[c], img: v.img + "&v=1" }])),
})));
PRODUCTS.forEach((p) => { p.note = p.type === "Sudadera" ? HOODIE_NOTE : TEE_NOTE; });

// Precios (noviembre 2026) y enlaces de pago activos.
const PRICES = { Camiseta: 24.95, Sudadera: 42.95 };
const LINKS = {
 "alhamdulillah|Camiseta|blanco": "https://buy.stripe.com/cNi5kDavnce31Xy5srdnW15",
 "alhamdulillah|Camiseta|negro": "https://buy.stripe.com/fZu28r6f791RdGg3kjdnW17",
 "andalus|Camiseta|blanco": "https://buy.stripe.com/5kQ00jdHzb9Z1Xy4ondnW0F",
 "andalus|Camiseta|negro": "https://buy.stripe.com/fZu9AT9rj4LB8lW7AzdnW0G",
 "andalus|Sudadera|arena": "https://buy.stripe.com/5kQ28r7jb5PF0Tu087dnW0E",
 "andalus|Sudadera|negro": "https://buy.stripe.com/3cI8wP8nfa5VfOo087dnW0H",
 "baraka|Camiseta|blanco": "https://buy.stripe.com/14A28r46Z3Hx0Tu4ondnW0Z",
 "baraka|Camiseta|negro": "https://buy.stripe.com/5kQ7sL32Vguj9q0aMLdnW10",
 "habibi|Camiseta|blanco": "https://buy.stripe.com/5kQeVd7jba5V1Xy3kjdnW0S",
 "habibi|Camiseta|negro": "https://buy.stripe.com/4gM14n6f7a5VcCcaMLdnW0T",
 "habibi|Sudadera|arena": "https://buy.stripe.com/5kQ8wPavn7XN8lWbQPdnW0Q",
 "habibi|Sudadera|negro": "https://buy.stripe.com/7sY6oH46Z3Hx59Kf31dnW0R",
 "habibti|Camiseta|blanco": "https://buy.stripe.com/7sYdR95b32Dt6dOdYXdnW0P",
 "habibti|Camiseta|negro": "https://buy.stripe.com/aFa4gz32V3HxeKkbQPdnW0N",
 "habibti|Sudadera|arena": "https://buy.stripe.com/eVq6oHavna5V9q01cbdnW0L",
 "habibti|Sudadera|negro": "https://buy.stripe.com/00wcN50UN6TJ59K3kjdnW0O",
 "hubb|Camiseta|blanco": "https://buy.stripe.com/6oUaEX8nfa5VdGg087dnW12",
 "hubb|Camiseta|negro": "https://buy.stripe.com/14A7sLeLD1zp1Xy7AzdnW14",
 "ojala|Camiseta|blanco": "https://buy.stripe.com/5kQ4gzdHzembgSsbQPdnW0V",
 "ojala|Camiseta|negro": "https://buy.stripe.com/dRmeVdeLD7XNdGg087dnW0W",
 "ojala|Sudadera|arena": "https://buy.stripe.com/4gM4gzeLDfqf8lW2gfdnW0X",
 "ojala|Sudadera|negro": "https://buy.stripe.com/6oU6oH5b3emb1Xy7AzdnW0U",
 "ramadan|Camiseta|blanco": "https://buy.stripe.com/6oUbJ16f70vl9q0087dnW13",
 "ramadan|Camiseta|negro": "https://buy.stripe.com/4gMdR9gTL4LBcCc7AzdnW16",
 "sabr|Camiseta|blanco": "https://buy.stripe.com/5kQ9AT6f7fqf6dO2gfdnW19",
 "sabr|Camiseta|negro": "https://buy.stripe.com/cNicN58nf1zpeKkf31dnW18",
 "salam|Camiseta|blanco": "https://buy.stripe.com/8x29ATbzrb9ZfOocUTdnW0A",
 "salam|Camiseta|negro": "https://buy.stripe.com/5kQdR98nfgujcCc087dnW0D",
 "salam|Sudadera|arena": "https://buy.stripe.com/00weVd32V0vldGg7AzdnW0C",
 "salam|Sudadera|negro": "https://buy.stripe.com/fZu4gzavn91R8lWcUTdnW0B",
 "umi|Camiseta|blanco": "https://buy.stripe.com/14AcN5cDvb9Z1Xy8EDdnW0Y",
 "umi|Camiseta|negro": "https://buy.stripe.com/00waEX7jbce3dGgcUTdnW11",
 "yalla|Camiseta|blanco": "https://buy.stripe.com/3cI7sLeLD1zpdGg2gfdnW0J",
 "yalla|Camiseta|negro": "https://buy.stripe.com/4gM4gzdHz0vl7hS8EDdnW0K",
 "yalla|Sudadera|arena": "https://buy.stripe.com/cNi9ATavnemb7hScUTdnW0I",
 "yalla|Sudadera|negro": "https://buy.stripe.com/9B65kD1YR1zpeKk1cbdnW0M"
};
PRODUCTS.forEach((p) => {
  p.price = PRICES[p.type];
  for (const c in p.colors) p.colors[c].stripe = LINKS[`${p.key}|${p.type}|${c}`];
});
