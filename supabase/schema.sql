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
