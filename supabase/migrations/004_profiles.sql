--=======================================================================
--This migration adds the profiles table to the database.
--The profiles table is used to store additional information about users, such as their username
--=======================================================================

--User profiles
create table public.profiles(
    id uuid primary key
        references auth.users(id)
        on delete cascade,
        display_name text not null,
        created_at timestamptz not null default now(),
);

--Row level security for profiles table
alter table public.profiles
enable row level security;


--both authenticated workshop users can read the profile names
create policy "Authenticated users can read profiles"
on public.profiles
for select
to authenticated
using (true);