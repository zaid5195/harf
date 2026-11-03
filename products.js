// Catálogo de HARF. Cada producto existe en Printify (shop 29594313).
// stripe: enlaces de pago de Stripe (Payment Links) por color. Vacíos hasta activar Stripe.
const STORE = {
  name: "HARF",
  email: "franse026@gmail.com",
  currency: "€",
  shipping: 4.95,
  freeShippingFrom: 60,
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
  price: 29.95,
  sizes: ["S", "M", "L", "XL", "2XL"],
  colors: {
    blanco: { label: "Blanco", img: MOCK(p.printify, 18542, p.slug), stripe: "" },
    negro: { label: "Negro", img: MOCK(p.printify, 18102, p.slug), stripe: "" },
  },
}));
