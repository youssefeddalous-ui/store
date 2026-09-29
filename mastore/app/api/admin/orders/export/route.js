import { db } from '@/lib/supabase';
import { isAdmin } from '@/lib/auth';
import { getSite } from '@/lib/countries';

// Katsawb fichier CSV (kay7el f Excel) bach tsiftou l société dyal livraison
export async function GET(req) {
  if (!(await isAdmin())) return new Response('Non autorisé', { status: 401 });
  const site = getSite();
  const status = new URL(req.url).searchParams.get('status');
  let q = db().from('orders').select('*').eq('country', site.code).order('created_at', { ascending: false }).limit(5000);
  if (status) q = q.eq('status', status);
  const { data, error } = await q;
  if (error) return new Response(error.message, { status: 500 });

  const cols = ['created_at', 'product_title', 'qty', 'total', 'name', 'phone', 'city', 'address', 'status', 'note'];
  const head = ['Date', 'Produit', 'Quantité', `Total (${site.currency})`, 'Nom', 'Téléphone', 'Ville', 'Adresse', 'Statut', 'Note'];
  const esc = v => {
    let s = String(v ?? '');
    if (/^[=+\-@]/.test(s)) s = "'" + s; // bach Excel ma y3tabrouch formule
    return '"' + s.replace(/"/g, '""') + '"';
  };
  const rows = data.map(o => cols.map(c => c === 'created_at' ? new Date(o[c]).toLocaleString('fr-FR') : o[c]).map(esc).join(';'));
  const csv = '﻿' + [head.map(esc).join(';'), ...rows].join('\r\n');
  const day = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="commandes-${site.code}-${day}.csv"` },
  });
}
