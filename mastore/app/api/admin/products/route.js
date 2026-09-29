import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { isAdmin } from '@/lib/auth';
import { getSite } from '@/lib/countries';
import { productFields } from '@/lib/product';

export async function POST(req) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const { data: fields, error: vErr } = productFields(await req.json().catch(() => ({})));
  if (vErr) return NextResponse.json({ ok: false, error: vErr }, { status: 400 });
  const { data, error } = await db().from('products').insert({ ...fields, country: getSite().code }).select('id').single();
  if (error) return NextResponse.json({ ok: false, error: error.code === '23505' ? 'Ce lien (slug) existe déjà.' : error.message }, { status: 400 });
  return NextResponse.json({ ok: true, id: data.id });
}
