import { notFound } from 'next/navigation';
import { db } from '@/lib/supabase';
import { getSite } from '@/lib/countries';
import Header from '@/components/Header';
import Gallery from '@/components/Gallery';
import OrderForm from '@/components/OrderForm';

export const dynamic = 'force-dynamic';

async function getProduct(slug) {
  const site = getSite();
  const { data } = await db().from('products').select('*')
    .eq('country', site.code).eq('slug', slug).eq('active', true).maybeSingle();
  return data;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.subtitle || p.title,
    openGraph: { title: p.title, images: p.images?.slice(0, 1) },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const site = getSite();
  const p = await getProduct(slug);
  if (!p) notFound();

  const images = p.images || [];
  // L tswer mn l 4 w lfo9 kayt7etto ta7t (tswer dyal l "description")
  const main = images.slice(0, 4), more = images.slice(4);

  // Ma kansiftouch l form ghir l ma3lomat li khassha (bla service keys)
  const product = { id: p.id, title: p.title, price_1: p.price_1, old_price_1: p.old_price_1, price_2: p.price_2, old_price_2: p.old_price_2 };
  const siteInfo = { currency: site.currency, currencyCode: site.currencyCode, cities: site.cities, phoneExample: site.phoneExample, whatsapp: site.whatsapp };

  return (
    <div className="wrap">
      <Header site={site} />
      <div className="hero">
        <Gallery images={main} alt={p.title} />
        <div>
          <h1>{p.title}</h1>
          {p.subtitle && <p className="sub">{p.subtitle}</p>}
          {p.description && (
            <div className="desc">{p.description.split('\n').filter(Boolean).map((l, i) => <p key={i}>{l}</p>)}</div>
          )}
          <OrderForm product={product} site={siteInfo} />
          <div className="trust"><span>Livraison rapide</span><span>Vérifiez avant de payer</span><span>Paiement en espèces</span></div>
        </div>
      </div>
      {more.length > 0 && (
        <section className="more">
          {more.map((src, i) => <img key={i} src={src} alt="" loading="lazy" />)}
        </section>
      )}
      <footer>© {site.siteName} — Livraison partout à {site.name}</footer>
    </div>
  );
}
