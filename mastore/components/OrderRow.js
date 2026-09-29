'use client';
import { useState } from 'react';
import { STATUSES } from '@/lib/statuses';

const fmt = (n, c) => Number(n).toLocaleString('fr-FR').replace(/[\s  ]/g, ' ') + ' ' + c;

export default function OrderRow({ o, currency, dial }) {
  const [status, setStatus] = useState(o.status);
  const [note, setNote] = useState(o.note || '');
  const [saving, setSaving] = useState(false);

  async function save(patch) {
    setSaving(true);
    const res = await fetch(`/api/admin/orders/${o.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) });
    setSaving(false);
    if (!res.ok) window.location.reload();
  }
  const intl = dial + o.phone.replace(/^0/, '');
  const d = new Date(o.created_at);

  return (
    <tr style={{ opacity: saving ? 0.6 : 1 }}>
      <td className="num">{d.toLocaleDateString('fr-FR')}<br /><small>{d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</small></td>
      <td>{o.name}</td>
      <td className="num"><a href={`tel:+${intl}`}>{o.phone}</a><br /><a href={`https://wa.me/${intl}`} target="_blank" rel="noopener"><small>WhatsApp</small></a></td>
      <td className="wrap">{o.city}<br /><small>{o.address}</small></td>
      <td className="wrap">{o.product_title}<br /><small>× {o.qty}</small></td>
      <td className="num">{fmt(o.total, currency)}</td>
      <td>
        <select value={status} onChange={e => { setStatus(e.target.value); save({ status: e.target.value }); }} aria-label="Statut">
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
      </td>
      <td><input type="text" value={note} onChange={e => setNote(e.target.value)} onBlur={() => note !== (o.note || '') && save({ note })} placeholder="Note…" style={{ padding: '6px 8px', fontSize: 13, minWidth: 140 }} aria-label="Note" /></td>
    </tr>
  );
}
