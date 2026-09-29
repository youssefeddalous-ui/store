import Link from 'next/link';
import { db } from '@/lib/supabase';
import { getSite, formatPrice } from '@/lib/countries';
import Header from '@/components/Header';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const site = getSite();
  const { data: products } = await db().from('products')
    .select('slug,title,images,price_1,old_price_1')
    .eq('country', site.code).eq('active', true)
    .order('created_at', { ascending: false });

  return (
    <div className="wrap">
      <Header site={site} />
      <div className="grid">
        {(products || []).map(p => (
          <Link key={p.slug} href={`/products/${p.slug}`} className="pcard">
            <div className="img">{p.images?.[0] && <img src={p.images[0]} alt={p.title} loading="lazy" />}</div>
            <div className="b">
              <span>{p.title}</span>
              <span className="pr">{formatPrice(p.price_1, site.currency)}</span>
            </div>
          </Link>
        ))}
        {!products?.length && <p>Aucun produit pour le moment.</p>}
      </div>
      <footer>© {site.siteName} — Livraison partout à {site.name}</footer>
    </div>
  );
}
