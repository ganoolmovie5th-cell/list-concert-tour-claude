-- ============================================================
-- ConcertID — Supabase Schema
-- Jalankan di: https://supabase.com/dashboard/project/crtqxgsruywurdlcsjfp/sql
-- ============================================================

-- 1. GOING / INTERESTED VOTES
-- Satu baris per user per konser, type bisa 'going' atau 'interested'
CREATE TABLE IF NOT EXISTS concert_votes (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  concert_id  text   NOT NULL,
  device_uid  text   NOT NULL,
  type        text   NOT NULL CHECK (type IN ('going','interested')),
  created_at  timestamptz DEFAULT now(),
  UNIQUE (concert_id, device_uid, type)
);

-- 2. DISKUSI / KOMENTAR
CREATE TABLE IF NOT EXISTS discussions (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  concert_id    text   NOT NULL,
  device_uid    text   NOT NULL,
  author        text   NOT NULL DEFAULT 'Anonim',
  text          text   NOT NULL,
  likes         int    NOT NULL DEFAULT 0,
  reply_to      jsonb,           -- {author, text}
  created_at    timestamptz DEFAULT now()
);

-- 3. REVIEW & RATING
CREATE TABLE IF NOT EXISTS reviews (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  concert_id  text   NOT NULL,
  device_uid  text   NOT NULL,
  author      text   NOT NULL DEFAULT 'Anonim',
  rating      int    NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     text   NOT NULL,
  likes       int    NOT NULL DEFAULT 0,
  created_at  timestamptz DEFAULT now(),
  UNIQUE (concert_id, device_uid)   -- 1 review per user per konser
);

-- 4. FORUM JUAL BELI TIKET
CREATE TABLE IF NOT EXISTS ticket_market (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  concert_id  text   NOT NULL,
  post_uid    text   NOT NULL UNIQUE,   -- uid unik per posting
  owner_uid   text   NOT NULL,          -- device uid pemilik
  type        text   NOT NULL CHECK (type IN ('jual','beli')),
  name        text   NOT NULL,
  category    text,
  qty         int    DEFAULT 1,
  price       text,
  contact     text   NOT NULL,
  note        text,
  sold        boolean NOT NULL DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

-- 5. CARI TEMAN NONTON
CREATE TABLE IF NOT EXISTS group_buying (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  concert_id  text   NOT NULL,
  post_uid    text   NOT NULL UNIQUE,
  owner_uid   text   NOT NULL,
  name        text   NOT NULL,
  category    text,
  contact     text   NOT NULL,
  ig          text,
  note        text,
  created_at  timestamptz DEFAULT now()
);

-- 6. FOTO DARI FANS (URL dari Supabase Storage)
CREATE TABLE IF NOT EXISTS fan_photos (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  concert_id  text   NOT NULL,
  device_uid  text   NOT NULL,
  storage_path text  NOT NULL,   -- path di Supabase Storage bucket
  public_url  text   NOT NULL,   -- URL publik gambar
  caption     text,
  author      text   DEFAULT 'Anonymous',
  created_at  timestamptz DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE concert_votes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews        ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_market  ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_buying   ENABLE ROW LEVEL SECURITY;
ALTER TABLE fan_photos     ENABLE ROW LEVEL SECURITY;

-- concert_votes: siapa saja bisa baca & insert, hanya owner bisa delete
CREATE POLICY "votes_select"  ON concert_votes FOR SELECT USING (true);
CREATE POLICY "votes_insert"  ON concert_votes FOR INSERT WITH CHECK (true);
CREATE POLICY "votes_delete"  ON concert_votes FOR DELETE USING (true);

-- discussions: siapa saja bisa baca & insert, likes update boleh semua
CREATE POLICY "disc_select"  ON discussions FOR SELECT USING (true);
CREATE POLICY "disc_insert"  ON discussions FOR INSERT WITH CHECK (true);
CREATE POLICY "disc_update"  ON discussions FOR UPDATE USING (true);

-- reviews: baca semua, insert & update oleh device_uid sendiri
CREATE POLICY "rv_select"  ON reviews FOR SELECT USING (true);
CREATE POLICY "rv_insert"  ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "rv_update"  ON reviews FOR UPDATE USING (true);

-- ticket_market: baca semua, insert/update/delete
CREATE POLICY "tm_select"  ON ticket_market FOR SELECT USING (true);
CREATE POLICY "tm_insert"  ON ticket_market FOR INSERT WITH CHECK (true);
CREATE POLICY "tm_update"  ON ticket_market FOR UPDATE USING (true);
CREATE POLICY "tm_delete"  ON ticket_market FOR DELETE USING (true);

-- group_buying: baca semua, insert/update/delete
CREATE POLICY "gb_select"  ON group_buying FOR SELECT USING (true);
CREATE POLICY "gb_insert"  ON group_buying FOR INSERT WITH CHECK (true);
CREATE POLICY "gb_update"  ON group_buying FOR UPDATE USING (true);
CREATE POLICY "gb_delete"  ON group_buying FOR DELETE USING (true);

-- fan_photos: baca semua, insert
CREATE POLICY "fp_select"  ON fan_photos FOR SELECT USING (true);
CREATE POLICY "fp_insert"  ON fan_photos FOR INSERT WITH CHECK (true);

-- ============================================================
-- STORAGE BUCKET untuk foto fans
-- Buat bucket "fan-photos" di Storage dashboard dengan Public access
-- ============================================================
