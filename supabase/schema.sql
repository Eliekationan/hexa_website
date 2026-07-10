-- À exécuter une fois dans l'éditeur SQL de votre projet Supabase
-- (Supabase Dashboard > SQL Editor > New query).

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  email text not null,
  sujet text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- RLS activé par défaut sur les nouveaux projets Supabase : cette table
-- n'est écrite que depuis le serveur via la clé service_role (qui contourne
-- les policies RLS), donc aucune policy publique n'est nécessaire.
alter table contact_messages enable row level security;

-- Blog : articles rédigés depuis l'interface d'administration (/admin/blog),
-- éventuellement assistée par IA, mais toujours publiés manuellement.
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content text not null,
  cover_image_url text,
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table blog_posts enable row level security;

-- Les pages publiques et l'interface d'administration lisent/écrivent toutes
-- deux depuis le serveur via la clé service_role (qui contourne RLS). Cette
-- policy est un filet de sécurité si une clé anon venait un jour à interroger
-- la table directement : elle ne peut voir que les articles publiés.
create policy "Lecture publique des articles publiés" on blog_posts
  for select
  using (status = 'published');

-- Bucket de stockage pour les images de couverture uploadées depuis
-- l'éditeur d'articles (/admin/blog). Bucket public : les images sont
-- servies directement via leur URL publique, sans policy RLS de lecture
-- nécessaire. Écriture uniquement depuis le serveur via service_role.
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

-- Demandes de devis qualifiées par l'agent IA (bulle de chat du site public).
-- Écriture uniquement depuis le serveur via service_role ; pas de policy
-- publique nécessaire (jamais affiché côté client, uniquement consulté par
-- l'équipe HEXA via Supabase ou l'email de notification).
create table if not exists quote_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  project_type text not null,
  need_summary text not null,
  budget_range_min integer,
  budget_range_max integer,
  timeline text,
  conversation jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table quote_requests enable row level security;

-- Abonnés à la newsletter du blog (email uniquement, pas de compte/mot de
-- passe). Écriture uniquement depuis le serveur via service_role ; pas de
-- policy publique nécessaire.
create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table newsletter_subscribers enable row level security;

-- Notes des articles de blog (1 à 5 étoiles). Un vote par navigateur est
-- appliqué côté client (localStorage) ; pas de compte lecteur, donc pas de
-- déduplication forte côté serveur au-delà de la limitation de débit par IP
-- de la route. Écriture uniquement depuis le serveur via service_role.
-- La moyenne/le nombre de votes sont calculés à la volée (peu de volume
-- attendu), pas de colonnes d'agrégat sur blog_posts.
create table if not exists blog_post_ratings (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references blog_posts (id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  created_at timestamptz not null default now()
);

create index if not exists blog_post_ratings_post_id_idx on blog_post_ratings (post_id);

alter table blog_post_ratings enable row level security;
