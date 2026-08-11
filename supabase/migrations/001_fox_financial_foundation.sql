create extension if not exists pgcrypto;

create type public.category_type as enum ('income', 'expense', 'both');
create type public.account_type as enum ('checking', 'savings', 'cash', 'digital_wallet', 'investment', 'other');
create type public.transaction_type as enum ('income', 'expense', 'transfer', 'adjustment');
create type public.transaction_status as enum ('pending', 'completed', 'cancelled');
create type public.frequency_type as enum ('daily', 'weekly', 'monthly', 'yearly', 'custom');
create type public.invoice_status as enum ('open', 'closed', 'paid', 'overdue');
create type public.goal_status as enum ('active', 'completed', 'paused', 'cancelled');
create type public.investment_type as enum ('stocks', 'etf', 'fund', 'fixed_income', 'crypto', 'other');

create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;

create table public.profiles (
  id uuid primary key default gen_random_uuid(), user_id uuid not null unique references auth.users(id) on delete cascade,
  name text, avatar_url text, currency text not null default 'BRL', timezone text not null default 'America/Sao_Paulo', preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.accounts (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, name text not null,
  type public.account_type not null, institution text, initial_balance numeric(14,2) not null default 0 check (initial_balance >= 0), currency text not null default 'BRL', is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.categories (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, name text not null,
  type public.category_type not null, icon text, parent_id uuid references public.categories(id) on delete set null, is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(user_id, name, parent_id)
);
create table public.people (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, name text not null, email text, phone text, notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.transactions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, account_id uuid not null references public.accounts(id), category_id uuid references public.categories(id),
  type public.transaction_type not null, amount numeric(14,2) not null check (amount > 0), description text not null, transaction_date date not null, status public.transaction_status not null default 'pending', notes text,
  person_id uuid references public.people(id) on delete set null, card_id uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.transaction_transfers (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, transaction_id uuid not null unique references public.transactions(id) on delete cascade,
  destination_account_id uuid not null references public.accounts(id), amount numeric(14,2) not null check (amount > 0), created_at timestamptz not null default now()
);
create table public.recurring_transactions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, account_id uuid not null references public.accounts(id), category_id uuid references public.categories(id), type public.transaction_type not null,
  amount numeric(14,2) not null check (amount > 0), description text not null, frequency public.frequency_type not null, start_date date not null, end_date date, next_occurrence date not null, is_active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), check (end_date is null or end_date >= start_date)
);
create table public.installments (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, transaction_id uuid not null references public.transactions(id) on delete cascade, installment_number integer not null check (installment_number > 0), total_installments integer not null check (total_installments > 0), amount numeric(14,2) not null check (amount > 0), due_date date not null, status public.transaction_status not null default 'pending', unique(transaction_id, installment_number), check (installment_number <= total_installments)
);
create table public.cards (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, account_id uuid references public.accounts(id), name text not null, brand text, last_four char(4), credit_limit numeric(14,2) not null check (credit_limit >= 0), closing_day smallint not null check (closing_day between 1 and 31), due_day smallint not null check (due_day between 1 and 31), color text, is_active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), check (last_four is null or last_four ~ '^[0-9]{4}$')
);
alter table public.transactions add constraint transactions_card_fk foreign key (card_id) references public.cards(id) on delete set null;
create table public.card_invoices (
  id uuid primary key default gen_random_uuid(), card_id uuid not null references public.cards(id) on delete cascade, reference_month date not null, closing_date date not null, due_date date not null, status public.invoice_status not null default 'open', total_amount numeric(14,2) not null default 0 check (total_amount >= 0), paid_amount numeric(14,2) not null default 0 check (paid_amount >= 0), created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(card_id, reference_month)
);
create table public.card_transactions (
  id uuid primary key default gen_random_uuid(), card_id uuid not null references public.cards(id) on delete cascade, invoice_id uuid references public.card_invoices(id) on delete set null, transaction_id uuid not null references public.transactions(id) on delete cascade, amount numeric(14,2) not null check (amount > 0), created_at timestamptz not null default now()
);
create table public.goals (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, name text not null, description text, target_amount numeric(14,2) not null check (target_amount > 0), current_amount numeric(14,2) not null default 0 check (current_amount >= 0), deadline date, status public.goal_status not null default 'active', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.goal_contributions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, goal_id uuid not null references public.goals(id) on delete cascade, amount numeric(14,2) not null check (amount > 0), contribution_date date not null default current_date, notes text, created_at timestamptz not null default now()
);
create table public.investments (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, name text not null, ticker text, type public.investment_type not null, institution text, quantity numeric(20,8) not null default 0 check (quantity >= 0), average_price numeric(14,2) not null default 0 check (average_price >= 0), current_price numeric(14,2) not null default 0 check (current_price >= 0), current_value numeric(14,2) not null default 0 check (current_value >= 0), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.investment_transactions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, investment_id uuid not null references public.investments(id) on delete cascade, type text not null check (type in ('buy', 'sell', 'dividend', 'adjustment')), quantity numeric(20,8) not null default 0, price numeric(14,2) not null default 0, amount numeric(14,2) not null check (amount > 0), transaction_date date not null, created_at timestamptz not null default now()
);
create table public.tags (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, name text not null, created_at timestamptz not null default now(), unique(user_id, name));
create table public.transaction_tags (transaction_id uuid not null references public.transactions(id) on delete cascade, tag_id uuid not null references public.tags(id) on delete cascade, primary key(transaction_id, tag_id));
create index transactions_user_date_idx on public.transactions(user_id, transaction_date desc); create index transactions_account_idx on public.transactions(account_id); create index transactions_category_idx on public.transactions(category_id); create index transactions_status_idx on public.transactions(status); create index transactions_person_idx on public.transactions(person_id); create index transactions_card_idx on public.transactions(card_id); create index cards_user_idx on public.cards(user_id); create index goals_user_idx on public.goals(user_id); create index investments_user_idx on public.investments(user_id);

do $$ declare table_name text; begin foreach table_name in array array['profiles','accounts','categories','people','transactions','transaction_transfers','recurring_transactions','installments','cards','goals','goal_contributions','investments','investment_transactions','tags'] loop execute format('alter table public.%I enable row level security', table_name); execute format('create policy %I on public.%I for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid())', table_name || '_owner_policy', table_name); end loop; end $$;
alter table public.card_invoices enable row level security;
alter table public.card_transactions enable row level security;
alter table public.transaction_tags enable row level security;
create policy card_invoices_owner_policy on public.card_invoices for all to authenticated using (exists (select 1 from public.cards c where c.id = card_id and c.user_id = auth.uid())) with check (exists (select 1 from public.cards c where c.id = card_id and c.user_id = auth.uid()));
create policy card_transactions_owner_policy on public.card_transactions for all to authenticated using (exists (select 1 from public.cards c where c.id = card_id and c.user_id = auth.uid())) with check (exists (select 1 from public.cards c where c.id = card_id and c.user_id = auth.uid()));
create policy transaction_tags_owner_policy on public.transaction_tags for all to authenticated using (exists (select 1 from public.transactions t where t.id = transaction_id and t.user_id = auth.uid())) with check (exists (select 1 from public.transactions t where t.id = transaction_id and t.user_id = auth.uid()));
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$ begin insert into public.profiles(user_id, name) values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))) on conflict (user_id) do nothing; return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
do $$ declare table_name text; begin foreach table_name in array array['profiles','accounts','categories','people','transactions','recurring_transactions','cards','card_invoices','goals','investments'] loop execute format('create trigger %I before update on public.%I for each row execute procedure public.set_updated_at()', table_name || '_updated_at', table_name); end loop; end $$;