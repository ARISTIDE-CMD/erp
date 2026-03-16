-- Molige ERP - Bootstrap schema compatible PostgreSQL/Supabase
-- Safe to run in Supabase SQL Editor (idempotent for most objects).

create extension if not exists pgcrypto;

-- =========================================
-- TABLES
-- =========================================

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  reference varchar not null unique,
  designation varchar not null,
  prix_unitaire numeric not null,
  quantite_stock integer not null default 0,
  created_at timestamp without time zone default now(),
  image_url text
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  nom varchar not null,
  telephone varchar,
  adresse text,
  created_at timestamp without time zone default now()
);

create table if not exists public.commandes (
  id uuid primary key default gen_random_uuid(),
  numero_commande varchar not null unique,
  statut varchar default 'en_attente' check (statut in ('en_attente', 'validee', 'livree')),
  montant_total numeric default 0,
  client_id uuid references public.clients(id),
  created_by uuid references auth.users(id),
  created_at timestamp without time zone default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  type_document varchar check (type_document in ('facture', 'proforma', 'bon_livraison')),
  fichier_url text,
  commande_id uuid references public.commandes(id),
  created_at timestamp without time zone default now()
);

create table if not exists public.ligne_commandes (
  id uuid primary key default gen_random_uuid(),
  commande_id uuid references public.commandes(id),
  article_id uuid references public.articles(id),
  quantite integer not null,
  prix_unitaire numeric not null,
  sous_total numeric generated always as ((quantite::numeric) * prix_unitaire) stored
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id),
  full_name text,
  role text not null check (role in ('ADMIN', 'GESTIONNAIRE')),
  created_at timestamp with time zone default now(),
  avatar_url text
);

create table if not exists public.profils (
  id uuid primary key references auth.users(id),
  nom varchar not null,
  role varchar not null check (role in ('admin', 'gestionnaire')),
  created_at timestamp without time zone default now(),
  avatar_url text
);

create index if not exists idx_commandes_client_id on public.commandes(client_id);
create index if not exists idx_commandes_created_at on public.commandes(created_at);
create index if not exists idx_ligne_commandes_commande_id on public.ligne_commandes(commande_id);
create index if not exists idx_ligne_commandes_article_id on public.ligne_commandes(article_id);
create index if not exists idx_documents_commande_id on public.documents(commande_id);

-- =========================================
-- RLS
-- =========================================

alter table public.articles enable row level security;
alter table public.clients enable row level security;
alter table public.commandes enable row level security;
alter table public.ligne_commandes enable row level security;
alter table public.documents enable row level security;
alter table public.profiles enable row level security;
alter table public.profils enable row level security;

do $$
begin
  -- Core ERP tables: authenticated users can read/write (adapt if needed)
  begin
    create policy "articles_auth_all" on public.articles for all to authenticated using (true) with check (true);
  exception when duplicate_object then null;
  end;
  begin
    create policy "clients_auth_all" on public.clients for all to authenticated using (true) with check (true);
  exception when duplicate_object then null;
  end;
  begin
    create policy "commandes_auth_all" on public.commandes for all to authenticated using (true) with check (true);
  exception when duplicate_object then null;
  end;
  begin
    create policy "ligne_commandes_auth_all" on public.ligne_commandes for all to authenticated using (true) with check (true);
  exception when duplicate_object then null;
  end;
  begin
    create policy "documents_auth_all" on public.documents for all to authenticated using (true) with check (true);
  exception when duplicate_object then null;
  end;

  -- Profiles: each user can read/update own profile
  begin
    create policy "profiles_select_own" on public.profiles for select to authenticated using (id = auth.uid());
  exception when duplicate_object then null;
  end;
  begin
    create policy "profiles_update_own" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
  exception when duplicate_object then null;
  end;

  begin
    create policy "profils_select_own" on public.profils for select to authenticated using (id = auth.uid());
  exception when duplicate_object then null;
  end;
  begin
    create policy "profils_update_own" on public.profils for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
  exception when duplicate_object then null;
  end;
end
$$;

-- =========================================
-- STORAGE BUCKETS + POLICIES
-- =========================================

insert into storage.buckets (id, name, public)
values
  ('documents', 'documents', true),
  ('article-images', 'article-images', true),
  ('avatars', 'avatars', true)
on conflict (id) do nothing;

do $$
begin
  -- documents
  begin
    create policy "documents_read_auth" on storage.objects for select to authenticated using (bucket_id = 'documents');
  exception when duplicate_object then null;
  end;
  begin
    create policy "documents_insert_auth" on storage.objects for insert to authenticated with check (bucket_id = 'documents');
  exception when duplicate_object then null;
  end;
  begin
    create policy "documents_update_auth" on storage.objects for update to authenticated using (bucket_id = 'documents') with check (bucket_id = 'documents');
  exception when duplicate_object then null;
  end;
  begin
    create policy "documents_delete_auth" on storage.objects for delete to authenticated using (bucket_id = 'documents');
  exception when duplicate_object then null;
  end;

  -- article-images
  begin
    create policy "article_images_read_auth" on storage.objects for select to authenticated using (bucket_id = 'article-images');
  exception when duplicate_object then null;
  end;
  begin
    create policy "article_images_insert_auth" on storage.objects for insert to authenticated with check (bucket_id = 'article-images');
  exception when duplicate_object then null;
  end;
  begin
    create policy "article_images_update_auth" on storage.objects for update to authenticated using (bucket_id = 'article-images') with check (bucket_id = 'article-images');
  exception when duplicate_object then null;
  end;
  begin
    create policy "article_images_delete_auth" on storage.objects for delete to authenticated using (bucket_id = 'article-images');
  exception when duplicate_object then null;
  end;

  -- avatars (each user only in own folder: <uid>/...)
  begin
    create policy "avatars_read_auth" on storage.objects for select to authenticated using (bucket_id = 'avatars');
  exception when duplicate_object then null;
  end;
  begin
    create policy "avatars_insert_own" on storage.objects for insert to authenticated
      with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
  exception when duplicate_object then null;
  end;
  begin
    create policy "avatars_update_own" on storage.objects for update to authenticated
      using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
      with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
  exception when duplicate_object then null;
  end;
  begin
    create policy "avatars_delete_own" on storage.objects for delete to authenticated
      using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
  exception when duplicate_object then null;
  end;
end
$$;

-- =========================================
-- AUTO PROFILE CREATION ON AUTH SIGNUP
-- =========================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), 'GESTIONNAIRE')
  on conflict (id) do nothing;

  insert into public.profils (id, nom, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), 'gestionnaire')
  on conflict (id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

notify pgrst, 'reload schema';
