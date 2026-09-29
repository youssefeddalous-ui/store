-- ============================================================
--  Lsa9 had l code kaml f Supabase > SQL Editor > Run
--  Momkin tkhdem b projet Supabase wa7d l ga3 l bldan:
--  kol site kaychouf ghir l produits w l commandes dyal blado.
-- ============================================================

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  country text not null,                 -- mg, ma, ci, sn, cm
  slug text not null,                    -- ex: ecran-carplay (kayban f lien)
  title text not null,
  subtitle text,
  description text,                      -- kol ster = paragraphe
  images text[] default '{}',
  price_1 int not null,                  -- prix dyal 1
  old_price_1 int,                       -- prix mchtob (optionnel)
  price_2 int,                           -- prix dyal 2 (khlih khawi ila ma kaynch)
  old_price_2 int,
  active boolean default true,
  unique (country, slug)
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  country text not null,
  product_id uuid references products(id) on delete set null,
  product_title text,
  qty int not null,
  total int not null,
  name text not null,
  phone text not null,
  city text,
  address text,
  status text not null default 'Nouveau',
  note text
);

create index if not exists orders_country_date on orders (country, created_at desc);
create index if not exists orders_phone on orders (phone, created_at desc);

-- Securite: 7ta wa7d ma y9der y9ra wla ykteb men l'extérieur.
-- Ghir l serveur dyalk (b service_role key) li 3ndo l7a9.
alter table products enable row level security;
alter table orders enable row level security;

-- Bucket l tswer dyal l produits (public bach yban f site)
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

-- Produit dyal test (Madagascar)
insert into products (country, slug, title, subtitle, description, images, price_1, old_price_1, price_2, old_price_2)
values (
  'mg', 'ecran-carplay',
  'Écran intelligent 7 pouces pour votre voiture',
  'Ataovy maoderina ny fiaranao ao anatin''ny 5 minitra.',
  'CarPlay et Android Auto : GPS, musique et appels sur un grand écran tactile.
Installation en 5 minutes : ventouse sur le pare-brise et prise allume-cigare.
Appels mains libres avec micro intégré.',
  '{}', 189000, 249000, 339000, 498000
) on conflict do nothing;
