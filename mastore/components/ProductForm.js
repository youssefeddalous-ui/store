'use client';
import { useState } from 'react';

export default function ProductForm({ product, currency }) {
  const p = product || {};
  const [f, setF] = useState({
    title: p.title || '', slug: p.slug || '', subtitle: p.subtitle || '', description: p.description || '',
    price_1: p.price_1 ?? '', old_price_1: p.old_price_1 ?? '', price_2: p.price_2 ?? '', old_price_2: p.old_price_2 ?? '',
    active: p.active ?? true,
  });
  const [images, setImages] = useState(p.images || []);
  const [url, setUrl] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const set = k => e => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const autoSlug = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

  async function upload(e) {
    const files = [...e.target.files]; e.target.value = '';
    for (const file of files) {
      setMsg(`Envoi de ${file.name}…`);
      const fd = new FormData(); fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const out = await res.json().catch(() => ({}));
      if (!out.ok) { setMsg(out.error || 'Échec de l’envoi'); return; }
      setImages(imgs => [...imgs, out.url]);
    }
    setMsg('');
  }
  function addUrl() {
    if (/^https:\/\//.test(url)) { setImages([...images, url.trim()]); setUrl(''); }
    else setMsg('Le lien doit commencer par https://');
  }
  const move = (i, d) => { const a = [...images]; const j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; setImages(a); };

  async function save(e) {
    e.preventDefault(); setBusy(true); setMsg('');
    const res = await fetch(product ? `/api/admin/products/${product.id}` : '/api/admin/products', {
      method: product ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...f, images }),
    });
    const out = await res.json().catch(() => ({}));
    setBusy(false);
    if (!out.ok) { setMsg(out.error || 'Erreur'); return; }
    location.href = '/admin/products';
  }
  async function del() {
    if (!confirmDel) { setConfirmDel(true); return; }
    await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' });
    location.href = '/admin/products';
  }

  return (
    <form className="card" onSubmit={save} style={{ maxWidth: 760 }}>
      <label className="f" htmlFor="title">Titre
        <input type="text" id="title" value={f.title} onChange={e => setF({ ...f, title: e.target.value, slug: product ? f.slug : autoSlug(e.target.value) })} required />
      </label>
      <label className="f" htmlFor="slug">Lien de la page : /products/<b>{f.slug || '…'}</b>
        <input type="text" id="slug" value={f.slug} onChange={set('slug')} />
      </label>
      <label className="f" htmlFor="subtitle">Sous-titre (phrase d'accroche)
        <input type="text" id="subtitle" value={f.subtitle} onChange={set('subtitle')} />
      </label>
      <label className="f" htmlFor="description">Description (une ligne = un paragraphe)
        <textarea id="description" rows={6} value={f.description} onChange={set('description')} />
      </label>

      <div className="row2">
        <label className="f" htmlFor="price_1">Prix pour 1 ({currency})<input type="number" id="price_1" value={f.price_1} onChange={set('price_1')} required /></label>
        <label className="f" htmlFor="old_price_1">Ancien prix pour 1 (barré)<input type="number" id="old_price_1" value={f.old_price_1} onChange={set('old_price_1')} /></label>
        <label className="f" htmlFor="price_2">Prix pour 2 (vide = pas d'offre)<input type="number" id="price_2" value={f.price_2} onChange={set('price_2')} /></label>
        <label className="f" htmlFor="old_price_2">Ancien prix pour 2 (barré)<input type="number" id="old_price_2" value={f.old_price_2} onChange={set('old_price_2')} /></label>
      </div>

      <div className="f" style={{ display: 'grid', gap: 8 }}>
        <b style={{ fontSize: 14 }}>Images (les 4 premières en haut, les autres en bas de page)</b>
        <div className="imgs">
          {images.map((src, i) => (
            <div key={src + i}>
              <img src={src} alt="" />
              <button type="button" onClick={() => setImages(images.filter((_, k) => k !== i))} aria-label="Supprimer">✕</button>
              <span style={{ position: 'absolute', bottom: 2, left: 2, display: 'flex', gap: 2 }}>
                <button type="button" style={{ position: 'static', background: 'var(--ink)' }} onClick={() => move(i, -1)} aria-label="Avant">‹</button>
                <button type="button" style={{ position: 'static', background: 'var(--ink)' }} onClick={() => move(i, 1)} aria-label="Après">›</button>
              </span>
            </div>
          ))}
        </div>
        <input type="file" id="upload" accept="image/*" multiple onChange={upload} />
        <div style={{ display: 'flex', gap: 8 }}>
          <input type="text" id="imgurl" placeholder="…ou collez un lien d'image https://" value={url} onChange={e => setUrl(e.target.value)} />
          <button type="button" className="btn sm ghost" onClick={addUrl}>Ajouter</button>
        </div>
      </div>

      <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontWeight: 600 }}>
        <input type="checkbox" id="active" checked={f.active} onChange={set('active')} /> Produit en ligne
      </label>
      {msg && <p className="err">{msg}</p>}
      <button className="btn" disabled={busy}>{busy ? '…' : 'ENREGISTRER'}</button>
      {product && (
        <button type="button" className="btn ghost" onClick={del} style={{ color: 'var(--bad)' }}>
          {confirmDel ? 'Cliquez encore pour confirmer la suppression' : 'Supprimer le produit'}
        </button>
      )}
    </form>
  );
}
