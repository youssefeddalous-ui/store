import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { isAdmin } from '@/lib/auth';
import { getSite, STATUSES } from '@/lib/countries';

export async function PATCH(req, { params }) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const update = {};
  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status)) return NextResponse.json({ ok: false, error: 'Statut invalide' }, { status: 400 });
    update.status = body.status;
  }
  if (body.note !== undefined) update.note = String(body.note).slice(0, 500);
  const { error } = await db().from('orders').update(update).eq('id', id).eq('country', getSite().code);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
