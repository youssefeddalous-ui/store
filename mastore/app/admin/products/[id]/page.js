import { redirect, notFound } from 'next/navigation';
import { db } from '@/lib/supabase';
import { isAdmin } from '@/lib/auth';
import { getSite } from '@/lib/countries';
import AdminNav from '@/components/AdminNav';
import ProductForm from '@/components/ProductForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Produit', robots: { index: false } };

export default async function EditProduct({ params }) {
  if (!(await isAdmin())) redirect('/admin/login');
  const site = getSite();
  const { id } = await params;
  let product = null;
  if (id !== 'new') {
    const { data } = await db().from('products').select('*').eq('id', id).eq('country', site.code).maybeSingle();
    if (!data) notFound();
    product = data;
  }
  return (
    <div className="admin">
      <AdminNav site={site} />
      <h1>{product ? 'Modifier le produit' : 'Nouveau produit'}</h1>
      <ProductForm product={product} currency={site.currency} />
    </div>
  );
}
