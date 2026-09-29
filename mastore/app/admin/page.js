import Link from 'next/link';
import { redirect } from 'next/navigation';
import { db } from '@/lib/supabase';
import { isAdmin } from '@/lib/auth';
import { getSite, formatPrice, STATUSES } from '@/lib/countries';
import AdminNav from '@/components/AdminNav';
import OrderRow from '@/components/OrderRow';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Commandes', robots: { index: false } };

export default async function AdminOrders({ searchParams }) {
  if (!(await isAdmin())) redirect('/admin/login');
  const site = getSite();
  const { status } = await searchParams;

  let q = db().from('orders').select('*').eq('country', site.code).order('created_at', { ascending: false }).limit(300);
  if (status) q = q.eq('status', status);
  const { data: orders } = await q;

  // Statistiques dyal lyoum
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const { data: todays } = await db().from('orders').select('total,status').eq('country', site.code).gte('created_at', today.toISOString());
  const t = todays || [];
  const confirmed = t.filter(o => ['Confirmé', 'Expédié', 'Livré'].includes(o.status));

  return (
    <div className="admin">
      <AdminNav site={site} />
      <h1>Commandes</h1>
      <div className="stats">
        <div className="stat"><b className="num">{t.length}</b><span>Commandes aujourd'hui</span></div>
        <div className="stat"><b className="num">{t.filter(o => o.status === 'Nouveau').length}</b><span>À appeler</span></div>
        <div className="stat"><b className="num">{confirmed.length}</b><span>Confirmées aujourd'hui</span></div>
        <div className="stat"><b className="num">{formatPrice(confirmed.reduce((s, o) => s + o.total, 0), site.currency)}</b><span>Montant confirmé</span></div>
      </div>
      <div className="filters">
        <Link className={'chip' + (!status ? ' on' : '')} href="/admin">Toutes</Link>
        {STATUSES.map(s => <Link key={s} className={'chip' + (status === s ? ' on' : '')} href={`/admin?status=${encodeURIComponent(s)}`}>{s}</Link>)}
        <a className="chip" href={`/api/admin/orders/export${status ? `?status=${encodeURIComponent(status)}` : ''}`} style={{ marginLeft: 'auto' }}>⬇ Export Excel</a>
      </div>
      <div className="tablewrap">
        <table className="t">
          <thead><tr><th>Date</th><th>Client</th><th>Téléphone</th><th>Adresse</th><th>Produit</th><th>Total</th><th>Statut</th><th>Note</th></tr></thead>
          <tbody>
            {(orders || []).map(o => <OrderRow key={o.id} o={o} currency={site.currency} dial={site.dial} />)}
            {!orders?.length && <tr><td colSpan={8}>Aucune commande.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
