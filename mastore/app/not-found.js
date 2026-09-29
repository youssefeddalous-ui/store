import Link from 'next/link';
export default function NotFound() {
  return <div className="wrap" style={{ textAlign: 'center', paddingTop: '15vh' }}><h1>Page introuvable</h1><p><Link href="/">Retour à l'accueil</Link></p></div>;
}
