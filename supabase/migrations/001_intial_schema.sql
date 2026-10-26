-- ==========================================================================================================================================================================
-- This schema contains the initial database schema for the application. 
--It includes the necessary tables, functions, and indexes to manage bicycles, expenses, inventory items, inventory purchases, parts used on bicycles, work logs, and sales.
-- ==========================================================================================================================================================================

create extension if not exists pgcrypto;


-- BICYCLES
create table public.bicycles (
    id uuid primary key default gen_random_uuid(),

    bike_code text not null unique,
    brand text,
    model text,
    bike_type text,
    colour text,
    frame_size text,
    wheel_size text,

    purchase_date date,

    purchase_price numeric(12,2) not null default 0
        check (purchase_price >= 0),

    condition_notes text,

    status text not null default 'PURCHASED'
        check (
            status in (
                'PURCHASED',
                'INSPECTION',
                'SERVICING',
                'WAITING_FOR_PARTS',
                'READY_FOR_SALE',
                'ADVERTISED',
                'RESERVED',
                'SOLD'
            )
        ),

    advertised_date date,

    advertised_price numeric(12,2)
        check (advertised_price >= 0),

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- EXPENSES
-- bike_id NULL means general workshop expense
create table public.expenses (
    id uuid primary key default gen_random_uuid(),

    bike_id uuid
        references public.bicycles(id)
        on delete cascade,

    expense_date date not null default current_date,

    category text not null,
    description text,

    amount numeric(12,2) not null
        check (amount >= 0),

    supplier text,
    notes text,

    created_by uuid
        references auth.users(id)
        on delete set null,

    created_at timestamptz not null default now()
);

-- INVENTORY ITEMS
create table public.inventory_items (
    id uuid primary key default gen_random_uuid(),

    name text not null,
    category text,
    brand text,
    description text,

    minimum_stock integer not null default 0
        check (minimum_stock >= 0),

    active boolean not null default true,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);


-- INVENTORY PURCHASES
create table public.inventory_purchases (
    id uuid primary key default gen_random_uuid(),

    inventory_item_id uuid not null
        references public.inventory_items(id)
        on delete cascade,

    purchase_date date not null default current_date,

    supplier text,

    quantity integer not null
        check (quantity > 0),

    total_cost numeric(12,2) not null
        check (total_cost >= 0),

    unit_cost numeric(12,4)
        generated always as (
            total_cost / quantity
        ) stored,

    order_reference text,
    notes text,

    created_at timestamptz not null default now()
);


-- PARTS USED ON BICYCLES
create table public.bike_parts_used (
    id uuid primary key default gen_random_uuid(),

    bike_id uuid not null
        references public.bicycles(id)
        on delete cascade,

    inventory_item_id uuid not null
        references public.inventory_items(id)
        on delete restrict,

    quantity integer not null
        check (quantity > 0),

    unit_cost numeric(12,4) not null
        check (unit_cost >= 0),

    total_cost numeric(12,4)
        generated always as (
            quantity * unit_cost
        ) stored,

    used_date date not null default current_date,

    notes text,

    created_at timestamptz not null default now()
);

-- LABOUR / WORK LOGS
create table public.work_logs (
    id uuid primary key default gen_random_uuid(),

    bike_id uuid not null
        references public.bicycles(id)
        on delete cascade,

    work_date date not null default current_date,

    activity text not null,
    description text,

    hours numeric(6,2) not null
        check (hours > 0),

    created_by uuid
        references auth.users(id)
        on delete set null,

    created_at timestamptz not null default now()
);

-- SALES
-- One sale per bicycle
create table public.sales (
    id uuid primary key default gen_random_uuid(),

    bike_id uuid not null unique
        references public.bicycles(id)
        on delete cascade,

    sale_date date not null,

    sale_price numeric(12,2) not null
        check (sale_price >= 0),

    sale_platform text,
    notes text,

    created_at timestamptz not null default now()
);

-- UPDATED_AT FUNCTION
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

-- UPDATED_AT TRIGGERS
create trigger bicycles_set_updated_at
before update on public.bicycles
for each row
execute function public.set_updated_at();


create trigger inventory_items_set_updated_at
before update on public.inventory_items
for each row
execute function public.set_updated_at();

-- INDEXES
create index idx_bicycles_status
    on public.bicycles(status);


create index idx_expenses_bike
    on public.expenses(bike_id);


create index idx_inventory_purchases_item
    on public.inventory_purchases(inventory_item_id);


create index idx_bike_parts_used_bike
    on public.bike_parts_used(bike_id);


create index idx_bike_parts_used_item
    on public.bike_parts_used(inventory_item_id);


create index idx_work_logs_bike
    on public.work_logs(bike_id);