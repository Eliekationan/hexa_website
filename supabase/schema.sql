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
