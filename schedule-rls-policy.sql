-- Enable RLS on schedule table
alter table public.schedule enable row level security;

-- Public read access (anon key can read schedule)
create policy "public read"
  on public.schedule for select
  using (true);

-- Editor write access (only authenticated users with specific emails)
-- Replace with your actual editor emails
create policy "editors insert"
  on public.schedule for insert to authenticated
  with check (
    (auth.jwt() ->> 'email') in ('editor1@example.com', 'editor2@example.com')
  );

create policy "editors update"
  on public.schedule for update to authenticated
  using (
    (auth.jwt() ->> 'email') in ('editor1@example.com', 'editor2@example.com')
  )
  with check (
    (auth.jwt() ->> 'email') in ('editor1@example.com', 'editor2@example.com')
  );
