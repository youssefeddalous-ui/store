'use client';
import { useState } from 'react';

export default function Login() {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr('');
    const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) });
    if (res.ok) location.href = '/admin';
    else { setErr('Mot de passe incorrect.'); setBusy(false); }
  }
  return (
    <form className="card login" onSubmit={submit}>
      <h2>Espace admin</h2>
      <label className="f" htmlFor="pw">Mot de passe
        <input type="password" id="pw" value={pw} onChange={e => setPw(e.target.value)} autoFocus />
      </label>
      {err && <span className="err">{err}</span>}
      <button className="btn" disabled={busy}>{busy ? '…' : 'SE CONNECTER'}</button>
    </form>
  );
}
