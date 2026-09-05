-- =========================================================
-- This schema contains the authentication and RLS (Row Level Security) policies for the application. 
-- It includes the necessary tables, functions, and policies to manage user authentication and access control.
-- =========================================================

--Enable row level security for all tables
alter table public.bicycles enable row level security;
alter table public.expenses enable row level security;
alter table public.inventory_items enable row level security;
alter table public.inventory_purchases enable row level security;
alter table public.bike_parts_used enable row level security;
alter table public.work_logs enable row level security;
alter table public.sales enable row level security;

--Authenticated users can only access their own data
--means any authenticated user can access every row in bicycles
create policy  "Authenticated users can manage bicycles" 
on public.bicycles
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated users can manage expenses"
on public.expenses
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated users can manage inventory items"
on public.inventory_items
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated users can manage inventory purchases"
on public.inventory_purchases
for all
to authenticated
using (true)
with check (true);


create policy "Authenticated users can manage bike parts used"
on public.bike_parts_used
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated users can manage work logs"
on public.work_logs
for all
to authenticated
using (true)
with check (true);


create policy "Authenticated users can manage sales"
on public.sales
for all
to authenticated
using (true)
with check (true);
