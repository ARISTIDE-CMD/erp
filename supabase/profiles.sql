-- Auto-creer un profil a l'inscription
-- Adaptez les colonnes si votre table `profils` est differente.

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profils (id, email, role)
  values (new.id, new.email, 'gestionnaire');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
