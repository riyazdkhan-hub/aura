create table if not exists public.enquiries (
  id text primary key,
  name text not null,
  phone text not null,
  locality text not null,
  interest text not null,
  budget text not null default '',
  details text not null default '',
  consent boolean not null default true,
  created_at bigint not null
);

create index if not exists enquiries_phone_created_at_idx
  on public.enquiries (phone, created_at desc);

create index if not exists enquiries_created_at_idx
  on public.enquiries (created_at desc);

alter table public.enquiries enable row level security;

-- No anonymous browser policies are created. Only the server-side service-role
-- key can read or write enquiries. Never expose that key in client-side code.
