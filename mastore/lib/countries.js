// Kol blad: 3omla, mdon, format dyal téléphone.
// Bach tzid blad jdida, zid bloc b7al hado.
export const COUNTRIES = {
  mg: {
    name: 'Madagascar', currency: 'Ar', dial: '261', trunk0: true,
    phoneRegex: /^03[2-9]\d{7}$/, phoneExample: '034 12 345 67', currencyCode: 'MGA',
    cities: ['Antananarivo', 'Toamasina', 'Antsirabe', 'Fianarantsoa', 'Mahajanga', 'Toliara', 'Antsiranana', 'Autre ville'],
  },
  ma: {
    name: 'Maroc', currency: 'DH', dial: '212', trunk0: true,
    phoneRegex: /^0[5-7]\d{8}$/, phoneExample: '06 12 34 56 78', currencyCode: 'MAD',
    cities: ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès', 'Oujda', 'Kénitra', 'Tétouan', 'Autre ville'],
  },
  ci: {
    name: "Côte d'Ivoire", currency: 'FCFA', dial: '225', trunk0: false,
    phoneRegex: /^(01|05|07)\d{8}$/, phoneExample: '07 12 34 56 78', currencyCode: 'XOF',
    cities: ['Abidjan', 'Bouaké', 'Yamoussoukro', 'San-Pédro', 'Daloa', 'Korhogo', 'Autre ville'],
  },
  sn: {
    name: 'Sénégal', currency: 'FCFA', dial: '221', trunk0: false,
    phoneRegex: /^7[05678]\d{7}$/, phoneExample: '77 123 45 67', currencyCode: 'XOF',
    cities: ['Dakar', 'Thiès', 'Touba', 'Saint-Louis', 'Kaolack', 'Ziguinchor', 'Autre ville'],
  },
  cm: {
    name: 'Cameroun', currency: 'FCFA', dial: '237', trunk0: false,
    phoneRegex: /^6\d{8}$/, phoneExample: '6 71 23 45 67', currencyCode: 'XAF',
    cities: ['Douala', 'Yaoundé', 'Bafoussam', 'Garoua', 'Bamenda', 'Autre ville'],
  },
};

export { STATUSES } from './statuses';

export function getSite() {
  const code = (process.env.SITE_COUNTRY || 'mg').toLowerCase();
  const country = COUNTRIES[code];
  if (!country) throw new Error(`SITE_COUNTRY "${code}" makaynach f lib/countries.js`);
  return {
    code,
    ...country,
    siteName: process.env.SITE_NAME || 'Ma Boutique',
    whatsapp: process.env.SITE_WHATSAPP || '',
  };
}

// Katrje3 l numéro b format local (ex: 0341234567) wla null ila ghalet.
export function normalizePhone(site, raw) {
  let d = String(raw || '').replace(/\D/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  if (d.startsWith(site.dial) && d.length > 9) d = d.slice(site.dial.length);
  if (site.trunk0 && !d.startsWith('0')) d = '0' + d;
  return site.phoneRegex.test(d) ? d : null;
}

export function formatPrice(n, currency) {
  return Number(n).toLocaleString('fr-FR').replace(/[\s  ]/g, ' ') + ' ' + currency;
}
