import './globals.css';
import Script from 'next/script';
import { getSite } from '@/lib/countries';

export async function generateMetadata() {
  const site = getSite();
  return {
    title: { default: site.siteName, template: `%s | ${site.siteName}` },
    description: `${site.siteName} — Livraison partout à ${site.name}, paiement à la livraison.`,
  };
}

export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#111B2E' };

export default function RootLayout({ children }) {
  const pixel = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@112,700;112,800&family=Figtree:wght@400;500;600;700&display=swap" />
      </head>
      <body>
        {children}
        {pixel && (
          <Script id="fb-pixel" strategy="afterInteractive">{`
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${pixel.replace(/\D/g, '')}');fbq('track','PageView');`}</Script>
        )}
      </body>
    </html>
  );
}
