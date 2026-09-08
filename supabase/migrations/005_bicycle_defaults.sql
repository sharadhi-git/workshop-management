-- =========================================================
-- Here we make some fields in the bicycles table have default values, so that we don't have to specify them when inserting new rows.
--==========================================================

-- Generate sequential bike codes:
-- BIK-0001, BIK-0002, BIK-0003 ...
create sequence if not exists public.bike_code_seq
start 1;

alter table public.bicycles
alter column bike_code
set default (
    'BIK-' ||
    lpad(
        nextval('public.bike_code_seq')::text,
        4,
        '0'
    )
);


-- Automatically use today's date when a bicycle is added

update public.bicycles
set purchase_date = current_date
where purchase_date is null;

alter table public.bicycles
alter column purchase_date
set default current_date;

alter table public.bicycles
alter column purchase_date
set not null;