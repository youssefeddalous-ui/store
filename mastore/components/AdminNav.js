import Link from 'next/link';
export default function AdminNav({ site }) {
  return (
    <nav>
      <span className="logo">{site.siteName} · Admin</span>
      <Link className="chip" href="/admin">Commandes</Link>
      <Link className="chip" href="/admin/products">Produits</Link>
      <Link className="chip" href="/" target="_blank">Voir le site</Link>
      <form action="/api/admin/logout" method="post"><button className="chip" style={{ cursor: 'pointer' }}>Déconnexion</button></form>
    </nav>
  );
}
