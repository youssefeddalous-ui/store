import Link from 'next/link';
export default function Header({ site }) {
  return (
    <header className="top">
      <Link href="/" className="logo">{site.siteName}</Link>
      <div className="cod">Paiement à la livraison</div>
    </header>
  );
}
