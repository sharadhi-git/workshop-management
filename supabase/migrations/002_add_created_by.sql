--==================================================================================
-- This tabel is for tracking which user created a record in the bicycles table.
--==================================================================================

--BICYCLES
alter table public.bicycles
add column created_by uuid
references auth.users(id)
on delete set null
default auth.uid();


-- EXPENSES
-- created_by already exists in the 001_intial_schema.sql migration, but we need to set the default value to auth.uid()
alter table public.expenses
alter column created_by
set default auth.uid();


-- INVENTORY ITEMS
alter table public.inventory_items
add column created_by uuid
references auth.users(id)
on delete set null
default auth.uid();


-- INVENTORY PURCHASES
alter table public.inventory_purchases
add column created_by uuid
references auth.users(id)
on delete set null
default auth.uid();


-- BIKE PARTS USED
alter table public.bike_parts_used
add column created_by uuid
references auth.users(id)
on delete set null
default auth.uid();


-- WORK LOGS
-- created_by already exists in the 001_intial_schema.sql migration, but we need to set the default value to auth.uid()
alter table public.work_logs
alter column created_by
set default auth.uid();


-- SALES
alter table public.sales
add column created_by uuid
references auth.users(id)
on delete set null
default auth.uid();