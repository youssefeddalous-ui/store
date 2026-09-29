import { NextResponse } from 'next/server';
import { checkPassword, login } from '@/lib/auth';

export async function POST(req) {
  const { password } = await req.json().catch(() => ({}));
  await new Promise(r => setTimeout(r, 400)); // kaybta2 l robots li kayjrbo passwords
  if (!password || !checkPassword(password)) return NextResponse.json({ ok: false, error: 'Mot de passe incorrect' }, { status: 401 });
  await login();
  return NextResponse.json({ ok: true });
}
