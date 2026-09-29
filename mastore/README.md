# Malgache Shop — Guide d'installation

Store COD (paiement à la livraison) b **Next.js** + **Supabase** + **Vercel**.
Code wa7d l ga3 l bldan: kol blad kattdir liha deploy b7dha b `SITE_COUNTRY` mokhtalif.

---

## 1. Wjjed l'outils (mra wa7da)

1. Tléchargi w installi **Node.js** (version LTS): https://nodejs.org
2. Tléchargi **VS Code**: https://code.visualstudio.com
3. Sawb comptes f: **GitHub**, **Supabase**, **Vercel** (dkhel l Vercel b compte GitHub).

## 2. 7el l projet 3la PC dyalk

1. Fok l ZIP f dossier (ex: `Documents/mastore`).
2. 7el l dossier f VS Code: **File → Open Folder**.
3. 7el Terminal: **Terminal → New Terminal**, w kteb:
   ```
   npm install
   ```

## 3. Sawb l base de données f Supabase

1. F supabase.com: **New project**. Smih `malgache-shop`, khtar mot de passe (7tafd bih), région **Frankfurt** (qrib l Afrique).
2. Tsenna 2 d9ay9 7ta ykml.
3. Men l menu 3la lissr: **SQL Editor → New query**.
4. 7el l fichier `supabase/schema.sql`, nsakh kolchi, lsa9o, w brk **Run**. Khassk tchouf "Success".
5. Men **Project Settings → API**, nsakh:
   - **Project URL**
   - **service_role** key (brk "Reveal"). ⚠️ Had l key sirriya: ma t3tihach l 7ta wa7d, w ma t7tohach f chi blasa public.

## 4. 3mer l'fichier `.env.local`

1. F VS Code, nsakh `.env.example` w smi l copie `.env.local`.
2. 3mer l valeurs:
   ```
   SITE_COUNTRY=mg
   SITE_NAME=Malgache Shop
   SITE_WHATSAPP=2613XXXXXXXX
   SUPABASE_URL=(Project URL)
   SUPABASE_SERVICE_ROLE_KEY=(service_role key)
   ADMIN_PASSWORD=(mot de passe twil w s3ib)
   NEXT_PUBLIC_FB_PIXEL_ID=(ila 3ndk)
   ```

## 5. Jrreb 3la PC dyalk

```
npm run dev
```
- Site: http://localhost:3000
- Produit test: http://localhost:3000/products/ecran-carplay
- Admin: http://localhost:3000/admin

Dir commande test, w chouf wach tl3at f **Admin → Commandes**.
Bach twe9fo: `Ctrl + C` f Terminal.

## 6. Zid l produits dyalk

F **/admin → Produits → + Nouveau produit**:
- **Titre** w **Sous-titre**
- **Lien**: kaytsawb bo7do men l titre (ex: `/products/ecran-carplay`). Hada li kat7ot f l pub.
- **Description**: kol ster = paragraphe.
- **Prix**: prix ×1, w prix ×2 ila bghiti offre duo. "Ancien prix" kayban mchtob.
- **Images**: rfe3hom men PC (JPG/PNG/WEBP, max 4 Mo). L 4 lwlin kaybano lfo9, w lba9i ta7t l page (tswer dyal description b7al BouDrop).
  Nsi7a: dir tswer b format **WEBP** w 9ell men 300 Ko, bach l page t7el bzrba f 4G.

## 7. Hot l code f GitHub

1. F github.com: **New repository**, smih `malgache-shop`, khtar **Private**.
2. F Terminal dyal VS Code (bdl `USERNAME`):
   ```
   git init
   git add .
   git commit -m "premiere version"
   git branch -M main
   git remote add origin https://github.com/USERNAME/malgache-shop.git
   git push -u origin main
   ```
   L fichier `.env.local` ma kaytl3ch l GitHub (m7mi f `.gitignore`). Hakka khass.

## 8. Nchr l site f Vercel

1. F vercel.com: **Add New → Project**, khtar repo `malgache-shop`, brk **Import**.
2. Fte7 **Environment Variables** w zid **nfs l variables** li f `.env.local` (wa7d b wa7d).
3. Brk **Deploy**. F 2 d9ay9 kay3tik lien b7al `malgache-shop.vercel.app`.

## 9. Rbet l domain malgache.shop

1. F Vercel: **Project → Settings → Domains**, zid `malgache.shop` w `www.malgache.shop`.
2. Vercel kay3tik l DNS records (ghaliban):
   - `A` → `@` → `76.76.21.21`
   - `CNAME` → `www` → `cname.vercel-dns.com`
3. Dkhl l site fin chriti l domain (Namecheap, Hostinger…) → **DNS**, w zid had records. Ms7 ay record `A` 9dim 3la `@`.
4. Tsenna men 10 d9ay9 l chi swaye3. Vercel kaydir HTTPS bo7do.

Mn b3d, lien dyal l produit: `https://www.malgache.shop/products/ecran-carplay`

## 10. Facebook Pixel

1. F Meta **Events Manager** sawb Pixel, w nsakh l ID (ra9m).
2. Zido f Vercel: `NEXT_PUBLIC_FB_PIXEL_ID`, w dir **Redeploy**.
3. L site kaysift bo7do: `PageView`, `InitiateCheckout` (mli l client kaybda y3mer), `Purchase` (mli katdouz l commande).
4. Jrreb b l extension Chrome **Meta Pixel Helper**.

## 11. L khedma dyal kol nhar

1. Dkhl `malgache.shop/admin`.
2. Filtre **Nouveau** = l clients li khasshom yt3aytou.
3. 3ayet (brk 3la numéro) wla sift WhatsApp, w bdl l statut: Confirmé / Pas de réponse / Annulé.
4. Filtre **Confirmé** → **⬇ Export Excel** → sift l fichier l société dyal livraison → bdlhom l **Expédié**.
5. Mli kaywslo: **Livré** wla **Retour**.

## 12. Blad jdida (ex: Maroc)

1. F Vercel: **Add New → Project**, khtar **nfs l repo** mra khra.
2. Nfs l variables, ghir bdl `SITE_COUNTRY=ma` w `SITE_NAME`.
3. Zid domain wla subdomain (ex: `ma.malgache.shop` wla domain jdid).
4. Tgder tkhdem b nfs Supabase: kol site kaychouf ghir l produits w l commandes dyal blado.

Bldan wajdin: `mg` Madagascar, `ma` Maroc, `ci` Côte d'Ivoire, `sn` Sénégal, `cm` Cameroun.
Bach tzid blad, zidha f `lib/countries.js` (3omla, mdon, format téléphone).

## Bach tbdl chi haja men b3d

Bdl l code f VS Code, mn b3d:
```
git add .
git commit -m "changement"
git push
```
Vercel kaydir mise à jour dyal l site bo7do f d9i9tin.

---

### Structure dyal l projet
```
app/
  page.js                  Accueil (liste dyal l produits)
  products/[slug]/page.js  Page dyal produit
  admin/                   Panel admin (commandes, produits, login)
  api/orders/              Backend: kaytl9a l commandes
  api/admin/               Backend dyal l admin
components/                OrderForm, Gallery, ProductForm…
lib/countries.js           Bldan, 3omlat, mdon, téléphones
supabase/schema.sql        Base de données
```
