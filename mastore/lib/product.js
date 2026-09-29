// Kat2kd mn l champs dyal produit 9bel ma nkhznouh
export function productFields(b) {
  const int = v => (v === '' || v == null ? null : Math.round(Number(v)));
  const slug = String(b.slug || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
  const data = {
    slug,
    title: String(b.title || '').trim().slice(0, 200),
    subtitle: String(b.subtitle || '').trim().slice(0, 300) || null,
    description: String(b.description || '').trim().slice(0, 5000) || null,
    images: Array.isArray(b.images) ? b.images.filter(u => /^https:\/\//.test(u)).slice(0, 20) : [],
    price_1: int(b.price_1), old_price_1: int(b.old_price_1),
    price_2: int(b.price_2), old_price_2: int(b.old_price_2),
    active: b.active !== false,
  };
  if (!data.slug) return { error: 'Lien (slug) obligatoire.' };
  if (!data.title) return { error: 'Titre obligatoire.' };
  if (!(data.price_1 > 0)) return { error: 'Prix pour 1 obligatoire.' };
  if (data.price_2 !== null && !(data.price_2 > 0)) return { error: 'Prix pour 2 invalide.' };
  return { data };
}
