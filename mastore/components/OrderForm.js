'use client';
import { useState, useRef } from 'react';

const fmt = (n, c) => Number(n).toLocaleString('fr-FR').replace(/[\s  ]/g, ' ') + ' ' + c;
const track = (ev, data) => { try { window.fbq && window.fbq('track', ev, data); } catch {} };

export default function OrderForm({ product: p, site }) {
  const [qty, setQty] = useState(1);
  const [form, setForm] = useState({ name: '', phone: '', city: site.cities[0], address: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [msg, setMsg] = useState('');
  const started = useRef(false);

  const offers = [{ q: 1, price: p.price_1, old: p.old_price_1, label: 'ACHETER 1', sub: 'Pack de démarrage' }];
  if (p.price_2) offers.push({ q: 2, price: p.price_2, old: p.old_price_2, label: 'ACHETER 2',
    sub: p.price_1 * 2 > p.price_2 ? `Économisez ${fmt(p.price_1 * 2 - p.price_2, site.currency)}` : 'Offre duo', best: true });
  const total = qty === 2 ? p.price_2 : p.price_1;

  const set = k => e => {
    if (!started.current) { started.current = true; track('InitiateCheckout', { value: total, currency: site.currencyCode }); }
    setForm({ ...form, [k]: e.target.value });
  };

  async function submit(e) {
    e.preventDefault();
    if (status === 'sending') return;
    const errs = {};
    if (form.name.trim().length < 2) errs.name = 'Entrez votre nom.';
    if (form.phone.replace(/\D/g, '').length < 8) errs.phone = `Numéro invalide. Exemple : ${site.phoneExample}`;
    if (form.address.trim().length < 3) errs.address = 'Entrez votre quartier pour la livraison.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setStatus('sending');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: p.id, qty, ...form, website: e.target.website.value }),
      });
      const out = await res.json();
      if (!res.ok || !out.ok) {
        if (out.field) { setErrors({ [out.field]: out.error }); setStatus('idle'); return; }
        throw new Error(out.error);
      }
      track('Purchase', { value: total, currency: site.currencyCode });
      setStatus('done');
    } catch {
      setStatus('error');
      setMsg("La commande n'est pas passée. Vérifiez votre connexion et réessayez.");
    }
  }

  if (status === 'done') {
    return (
      <div className="card done" id="order">
        <div className="ok">✓</div>
        <h2>Merci, commande reçue !</h2>
        <p className="note" style={{ fontSize: 15 }}>Notre équipe vous appelle bientôt pour confirmer la livraison. Gardez votre téléphone allumé.</p>
        <div className="sum">{`${p.title}\nQuantité : ${qty}\nTotal : ${fmt(total, site.currency)}\n${form.name} — ${form.phone}\n${form.city}, ${form.address}`}</div>
        {site.whatsapp && <p className="note">Une question ? WhatsApp : <b>+{site.whatsapp}</b></p>}
      </div>
    );
  }

  return (
    <>
      <form className="card" id="order" onSubmit={submit} noValidate>
        <h2>Complétez votre commande</h2>
        <div className="offers" role="radiogroup" aria-label="Choisir une offre">
          {offers.map(o => (
            <label key={o.q} className={'offer' + (qty === o.q ? ' on' : '')}>
              {o.best && <span className="tag">Meilleure offre</span>}
              <input type="radio" name="offer" checked={qty === o.q} onChange={() => setQty(o.q)} />
              <span className="t"><b>{o.label}</b><span className="s">{o.sub}</span></span>
              <span className="p">{o.old > o.price && <del>{fmt(o.old, site.currency)}</del>}{fmt(o.price, site.currency)}</span>
            </label>
          ))}
        </div>
        <label className="f" htmlFor="name">Nom complet
          <input type="text" id="name" autoComplete="name" value={form.name} onChange={set('name')} placeholder="Ex : Rakoto Jean" />
          {errors.name && <span className="err">{errors.name}</span>}
        </label>
        <label className="f" htmlFor="phone">Téléphone
          <input type="tel" id="phone" inputMode="numeric" autoComplete="tel" value={form.phone} onChange={set('phone')} placeholder={site.phoneExample} />
          {errors.phone && <span className="err">{errors.phone}</span>}
        </label>
        <label className="f" htmlFor="city">Ville
          <select id="city" value={form.city} onChange={set('city')}>
            {site.cities.map(c => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label className="f" htmlFor="address">Adresse / Quartier
          <input type="text" id="address" autoComplete="street-address" value={form.address} onChange={set('address')} placeholder="Ex : Analakely, près de la pharmacie" />
          {errors.address && <span className="err">{errors.address}</span>}
        </label>
        {/* Piège l robots: bnadem ma kaychoufouch had l champ */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true" />
        <button className="btn" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'ENVOI EN COURS…' : `CONFIRMER LA COMMANDE — ${fmt(total, site.currency)}`}
        </button>
        {status === 'error' && <p className="err" style={{ textAlign: 'center' }}>{msg}</p>}
        <p className="note">Paiement en espèces à la livraison uniquement</p>
      </form>
      <div className="sticky">
        <div><b style={{ font: '800 18px/1 var(--display)' }}>{fmt(total, site.currency)}</b><div className="note" style={{ textAlign: 'left' }}>À la livraison</div></div>
        <a className="btn" href="#order">COMMANDER</a>
      </div>
    </>
  );
}
