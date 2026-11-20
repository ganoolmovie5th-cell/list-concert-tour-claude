-- ============================================================
-- ConcertID — Supabase Hardening (jalankan SETELAH supabase_schema.sql)
-- Jalankan di: https://supabase.com/dashboard/project/crtqxgsruywurdlcsjfp/sql
-- Aman dijalankan ulang (idempotent). Deploy supabase.js terbaru (header x-device-uid) DULU.
--
-- BATAS: app ini tidak punya login. device_uid hanyalah string acak di localStorage,
-- dan kolomnya bisa dibaca publik. Scoping lewat header di bawah mencegah hapus/ubah massal
-- lewat satu request, tapi bukan autentikasi. Perlindungan penuh butuh Supabase Anonymous Auth
-- (policy memakai auth.uid()).
-- ============================================================

-- 0. DIAGNOSTIK — lihat policy yang aktif sekarang (termasuk gb_chat yang tidak ada di schema)
-- select tablename, policyname, cmd, qual, with_check from pg_policies where schemaname = 'public' order by 1, 2;

-- 1. Ambil device uid dari header request
create or replace function public.req_device_uid() returns text
language sql stable as $$
  select nullif(current_setting('request.headers', true)::json ->> 'x-device-uid', '')
$$;

-- 2. discussions & reviews: anon hanya boleh menambah likes tepat +1, kolom lain tidak boleh berubah
create or replace function public.only_like_increment() returns trigger
language plpgsql as $$
begin
  if current_user not in ('anon', 'authenticated') then
    return new;   -- dashboard / service role bebas
  end if;
  if new.likes is distinct from old.likes + 1
     or (to_jsonb(new) - 'likes') is distinct from (to_jsonb(old) - 'likes') then
    raise exception 'Hanya boleh menambah likes sebanyak 1';
  end if;
  return new;
end $$;

drop trigger if exists discussions_only_like on public.discussions;
create trigger discussions_only_like before update on public.discussions
  for each row execute function public.only_like_increment();

drop trigger if exists reviews_only_like on public.reviews;
create trigger reviews_only_like before update on public.reviews
  for each row execute function public.only_like_increment();

-- 3. concert_votes, ticket_market, group_buying: update/delete hanya untuk pemilik (sesuai header)
drop policy if exists "votes_delete" on public.concert_votes;
create policy "votes_delete" on public.concert_votes
  for delete using (device_uid = public.req_device_uid());

drop policy if exists "tm_update" on public.ticket_market;
create policy "tm_update" on public.ticket_market
  for update using (owner_uid = public.req_device_uid())
  with check (owner_uid = public.req_device_uid());
drop policy if exists "tm_delete" on public.ticket_market;
create policy "tm_delete" on public.ticket_market
  for delete using (owner_uid = public.req_device_uid());

drop policy if exists "gb_update" on public.group_buying;
create policy "gb_update" on public.group_buying
  for update using (owner_uid = public.req_device_uid())
  with check (owner_uid = public.req_device_uid());
drop policy if exists "gb_delete" on public.group_buying;
create policy "gb_delete" on public.group_buying
  for delete using (owner_uid = public.req_device_uid());

-- 4. Batas panjang teks (client memotong 30–300 karakter, lalu meng-escape "<" jadi "&lt;" = hingga 4x)
alter table public.discussions   drop constraint if exists discussions_len;
alter table public.discussions   add  constraint discussions_len   check (char_length(text) <= 1000 and char_length(author) <= 100) not valid;
alter table public.reviews       drop constraint if exists reviews_len;
alter table public.reviews       add  constraint reviews_len       check (char_length(comment) <= 1000 and char_length(author) <= 100) not valid;
alter table public.ticket_market drop constraint if exists ticket_market_len;
alter table public.ticket_market add  constraint ticket_market_len check (char_length(name) <= 200 and char_length(coalesce(category, '')) <= 200 and char_length(contact) <= 300 and char_length(coalesce(note, '')) <= 800 and char_length(coalesce(price, '')) <= 40 and qty between 1 and 20) not valid;
alter table public.group_buying  drop constraint if exists group_buying_len;
alter table public.group_buying  add  constraint group_buying_len  check (char_length(name) <= 200 and char_length(coalesce(category, '')) <= 200 and char_length(contact) <= 300 and char_length(coalesce(ig, '')) <= 200 and char_length(coalesce(note, '')) <= 800) not valid;
alter table public.fan_photos    drop constraint if exists fan_photos_len;
alter table public.fan_photos    add  constraint fan_photos_len    check (char_length(coalesce(caption, '')) <= 500 and char_length(coalesce(author, '')) <= 200) not valid;
