import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { db } from '@/lib/supabase';
import { isAdmin } from '@/lib/auth';

const TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };

// Kayrfe3 tswira l Supabase Storage (bucket "products") w kayrje3 l lien dyalha
export async function POST(req) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const file = (await req.formData()).get('file');
  if (!file || typeof file === 'string') return NextResponse.json({ ok: false, error: 'Aucun fichier' }, { status: 400 });
  const ext = TYPES[file.type];
  if (!ext) return NextResponse.json({ ok: false, error: 'Format accepté : JPG, PNG, WEBP, GIF' }, { status: 400 });
  if (file.size > 4 * 1024 * 1024) return NextResponse.json({ ok: false, error: 'Image trop lourde (max 4 Mo)' }, { status: 400 });

  const path = `${randomUUID()}.${ext}`;
  const { error } = await db().storage.from('products').upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  const { data } = db().storage.from('products').getPublicUrl(path);
  return NextResponse.json({ ok: true, url: data.publicUrl });
}
