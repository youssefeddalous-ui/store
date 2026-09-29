import Link from 'next/link';
import { redirect } from 'next/navigation';
import { db } from '@/lib/supabase';
import { isAdmin } from '@/lib/auth';
import { getSite, formatPrice } from '@/lib/countries';
import AdminNav from '@/components/AdminNav';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Produits', robots: { index: false } };

export default async function AdminProducts() {
  if (!(await isAdmin())) redirect('/admin/login');
  const site = getSite();
  const { data: products } = await db().from('products').select('id,slug,title,images,price_1,price_2,active')
    .eq('country', site.code).order('created_at', { ascending: false });

  return (
    <div className="admin">
      <AdminNav site={site} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <h1>Produits</h1>
        <Link className="btn sm" href="/admin/products/new">+ Nouveau produit</Link>
      </div>
      <div className="tablewrap">
        <table className="t">
          <thead><tr><th></th><th>Produit</th><th>Lien</th><th>Prix ×1</th><th>Prix ×2</th><th>Statut</th><th></th></tr></thead>
          <tbody>
            {(products || []).map(p => (
              <tr key={p.id}>
                <td>{p.images?.[0] && <img src={p.images[0]} alt="" width="48" height="48" style={{ objectFit: 'cover', borderRadius: 6 }} />}</td>
                <td className="wrap">{p.title}</td>
                <td><a href={`/products/${p.slug}`} target="_blank">/products/{p.slug}</a></td>
                <td className="num">{formatPrice(p.price_1, site.currency)}</td>
                <td className="num">{p.price_2 ? formatPrice(p.price_2, site.currency) : '—'}</td>
                <td>{p.active ? 'En ligne' : 'Masqué'}</td>
                <td><Link className="chip" href={`/admin/products/${p.id}`}>Modifier</Link></td>
              </tr>
            ))}
            {!products?.length && <tr><td colSpan={7}>Aucun produit.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
