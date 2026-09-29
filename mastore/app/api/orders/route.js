import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { getSite, normalizePhone } from '@/lib/countries';

const clean = (v, max) => String(v ?? '').replace(/[<>]/g, '').trim().slice(0, max);

export async function POST(req) {
  const site = getSite();
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: 'Requête invalide' }, { status: 400 }); }

  // Robot 3mer l champ lmkhbi: kanrj3o "ok" bla ma nkhznou walou
  if (body.website) return NextResponse.json({ ok: true });

  const name = clean(body.name, 80);
  const city = site.cities.includes(body.city) ? body.city : site.cities.at(-1);
  const address = clean(body.address, 200);
  const phone = normalizePhone(site, body.phone);
  const qty = Number(body.qty) === 2 ? 2 : 1;

  if (name.length < 2) return NextResponse.json({ ok: false, field: 'name', error: 'Entrez votre nom.' }, { status: 400 });
  if (!phone) return NextResponse.json({ ok: false, field: 'phone', error: `Numéro invalide. Exemple : ${site.phoneExample}` }, { status: 400 });
  if (address.length < 3) return NextResponse.json({ ok: false, field: 'address', error: 'Entrez votre quartier.' }, { status: 400 });

  // L prix kayjiw men l base de données, machi men l client
  const { data: p } = await db().from('products').select('id,title,price_1,price_2,country,active')
    .eq('id', String(body.productId)).maybeSingle();
  if (!p || !p.active || p.country !== site.code) return NextResponse.json({ ok: false, error: 'Produit introuvable' }, { status: 404 });
  const total = qty === 2 && p.price_2 ? p.price_2 : p.price_1;
  const finalQty = qty === 2 && p.price_2 ? 2 : 1;

  // Anti-doublon: nfs l numéro + nfs l produit f 10 d9ay9 lkhra
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { data: dup } = await db().from('orders').select('id')
    .eq('phone', phone).eq('product_id', p.id).gte('created_at', since).limit(1);
  if (dup?.length) return NextResponse.json({ ok: true, duplicate: true });

  const { error } = await db().from('orders').insert({
    country: site.code, product_id: p.id, product_title: p.title,
    qty: finalQty, total, name, phone, city, address,
  });
  if (error) {
    console.error('Order insert failed', error);
    return NextResponse.json({ ok: false, error: 'Erreur serveur' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
