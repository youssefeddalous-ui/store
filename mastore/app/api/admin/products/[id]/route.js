import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { isAdmin } from '@/lib/auth';
import { getSite } from '@/lib/countries';
import { productFields } from '@/lib/product';

export async function PATCH(req, { params }) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await params;
  const { data: fields, error: vErr } = productFields(await req.json().catch(() => ({})));
  if (vErr) return NextResponse.json({ ok: false, error: vErr }, { status: 400 });
  const { error } = await db().from('products').update(fields).eq('id', id).eq('country', getSite().code);
  if (error) return NextResponse.json({ ok: false, error: error.code === '23505' ? 'Ce lien (slug) existe déjà.' : error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req, { params }) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await params;
  const { error } = await db().from('products').delete().eq('id', id).eq('country', getSite().code);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
