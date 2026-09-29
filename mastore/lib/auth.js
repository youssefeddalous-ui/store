import 'server-only';
import { cookies } from 'next/headers';
import { createHash, timingSafeEqual } from 'crypto';

const COOKIE = 'admin_session';

function token() {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw || pw.length < 8) throw new Error('ADMIN_PASSWORD khasso ykon fih 8 7rouf 3la l a9al');
  return createHash('sha256').update('admin:' + pw).digest('hex');
}

function same(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
}

export function checkPassword(pw) {
  return same(createHash('sha256').update('admin:' + pw).digest('hex'), token());
}

export async function isAdmin() {
  const c = (await cookies()).get(COOKIE);
  return !!c && same(c.value, token());
}

export async function login() {
  (await cookies()).set(COOKIE, token(), {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30,
  });
}

export async function logout() {
  (await cookies()).delete(COOKIE);
}
