-- ========================================================
-- MIGRATION: TWIBBON CAMPAIGNS SCHEMA UPDATE V2
-- Run this in the Supabase SQL Editor
-- ========================================================

-- 1. Alter twibbon_campaigns table to add missing features
ALTER TABLE public.twibbon_campaigns
ADD COLUMN IF NOT EXISTS frame_width integer DEFAULT 1080,
ADD COLUMN IF NOT EXISTS frame_height integer DEFAULT 1080,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
ADD COLUMN IF NOT EXISTS download_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now());

-- 2. Update existing records to match the defaults
UPDATE public.twibbon_campaigns
SET 
  frame_width = COALESCE(frame_width, 1080),
  frame_height = COALESCE(frame_height, 1080),
  status = COALESCE(status, 'active'),
  download_count = COALESCE(download_count, 0),
  updated_at = COALESCE(updated_at, NOW());

-- 3. Create a secure RPC function to increment download counts
CREATE OR REPLACE FUNCTION public.increment_twibbon_download(campaign_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.twibbon_campaigns
  SET download_count = download_count + 1
  WHERE id = campaign_id;
END;
$$;

-- 4. Replace execute_secure_write function to support the new columns
CREATE OR REPLACE FUNCTION public.execute_secure_write(
  target_table text,
  action_type text,
  row_data jsonb,
  row_id text DEFAULT NULL,
  op_username text DEFAULT NULL,
  op_password text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  op_record record;
  has_access boolean := false;
  row_uuid uuid;
  row_int integer;
  result_json jsonb;
  clean_slug text;
BEGIN
  -- 1. Authenticate operator
  SELECT * INTO op_record FROM public.operators WHERE username = op_username;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Operator not found';
  END IF;
  
  IF op_record.password_hash != crypt(op_password, op_record.password_hash) THEN
    RAISE EXCEPTION 'Invalid credentials';
  END IF;

  -- 2. Verify authorization
  IF op_record.role = 'admin' THEN
    has_access := true;
  ELSIF op_record.role = 'prodi' THEN
    IF target_table = 'links' THEN
      IF action_type = 'insert' THEN
        IF (row_data->>'profile_key') = op_record.profile_key THEN
          has_access := true;
        END IF;
      ELSE
        row_uuid := row_id::uuid;
        IF EXISTS (SELECT 1 FROM public.links WHERE id = row_uuid AND profile_key = op_record.profile_key) THEN
          has_access := true;
        END IF;
      END IF;
    ELSIF target_table = 'static_pages' THEN
      IF action_type = 'insert' THEN
        IF (row_data->>'profile_key') = op_record.profile_key THEN
          has_access := true;
        END IF;
      ELSE
        row_uuid := row_id::uuid;
        IF EXISTS (SELECT 1 FROM public.static_pages WHERE id = row_uuid AND profile_key = op_record.profile_key) THEN
          has_access := true;
        END IF;
      END IF;
    ELSIF target_table = 'twibbon_campaigns' THEN
      IF action_type = 'insert' THEN
        IF (row_data->>'profile_key') = op_record.profile_key THEN
          has_access := true;
        END IF;
      ELSE
        row_uuid := row_id::uuid;
        IF EXISTS (SELECT 1 FROM public.twibbon_campaigns WHERE id = row_uuid AND profile_key = op_record.profile_key) THEN
          has_access := true;
        END IF;
      END IF;
    ELSIF target_table = 'profiles' THEN
      IF (row_data->>'key') = op_record.profile_key OR (row_id = op_record.profile_key) THEN
        has_access := true;
      END IF;
    ELSIF target_table = 'directory_hmj' THEN
      IF action_type = 'insert' THEN
        IF (row_data->>'name') ILIKE 'HMJ - %' AND lower(substring(row_data->>'name' from 7)) = lower(op_record.profile_key) THEN
          has_access := true;
        END IF;
      ELSE
        row_int := row_id::int;
        IF EXISTS (
          SELECT 1 FROM public.directory_hmj 
          WHERE id = row_int 
            AND name ILIKE 'HMJ - %' 
            AND (
              (op_record.profile_key = 'hk' AND name = 'HMJ - Hukum Keluarga') OR
              (op_record.profile_key = 'hes' AND name = 'HMJ - Hukum Ekonomi Syariah') OR
              (op_record.profile_key = 'pm' AND name = 'HMJ - Perbandingan Madzhab') OR
              (op_record.profile_key = 'hpi' AND name = 'HMJ - Hukum Pidana Islam') OR
              (op_record.profile_key = 'htn' AND name = 'HMJ - Hukum Tata Negara') OR
              (op_record.profile_key = 'ih' AND name = 'HMJ - Ilmu Hukum')
            )
        ) THEN
          has_access := true;
        END IF;
      END IF;
    END IF;
  END IF;

  IF NOT has_access THEN
    RAISE EXCEPTION 'Unauthorized write operation for this operator';
  END IF;

  -- 3. Execute write operation
  IF target_table = 'links' THEN
    IF action_type = 'insert' THEN
      INSERT INTO public.links (profile_key, title, url, category, description, sort_order)
      VALUES (
        row_data->>'profile_key',
        row_data->>'title',
        row_data->>'url',
        row_data->>'category',
        row_data->>'description',
        COALESCE((row_data->>'sort_order')::int, 0)
      ) RETURNING to_jsonb(links.*) INTO result_json;
    ELSIF action_type = 'update' THEN
      row_uuid := row_id::uuid;
      UPDATE public.links
      SET 
        title = COALESCE(row_data->>'title', title),
        url = COALESCE(row_data->>'url', url),
        category = COALESCE(row_data->>'category', category),
        description = row_data->>'description',
        sort_order = COALESCE((row_data->>'sort_order')::int, sort_order)
      WHERE id = row_uuid
      RETURNING to_jsonb(links.*) INTO result_json;
    ELSIF action_type = 'delete' THEN
      row_uuid := row_id::uuid;
      DELETE FROM public.links WHERE id = row_uuid RETURNING to_jsonb(links.*) INTO result_json;
    END IF;

  ELSIF target_table = 'static_pages' THEN
    IF action_type = 'insert' THEN
      INSERT INTO public.static_pages (slug, title, content, profile_key)
      VALUES (
        row_data->>'slug',
        row_data->>'title',
        row_data->>'content',
        row_data->>'profile_key'
      ) RETURNING to_jsonb(static_pages.*) INTO result_json;
    ELSIF action_type = 'update' THEN
      row_uuid := row_id::uuid;
      UPDATE public.static_pages
      SET
        slug = COALESCE(row_data->>'slug', slug),
        title = COALESCE(row_data->>'title', title),
        content = COALESCE(row_data->>'content', content)
      WHERE id = row_uuid
      RETURNING to_jsonb(static_pages.*) INTO result_json;
    ELSIF action_type = 'delete' THEN
      row_uuid := row_id::uuid;
      DELETE FROM public.static_pages WHERE id = row_uuid RETURNING to_jsonb(static_pages.*) INTO result_json;
    END IF;

  ELSIF target_table = 'twibbon_campaigns' THEN
    clean_slug := NULL;
    IF row_data ? 'slug' THEN
      clean_slug := public.normalize_slug(row_data->>'slug');
      IF clean_slug IS NULL THEN
        RAISE EXCEPTION 'Slug cannot be empty after normalization';
      END IF;
    ELSIF action_type = 'insert' THEN
      RAISE EXCEPTION 'Slug is required';
    END IF;

    IF action_type = 'insert' THEN
      INSERT INTO public.twibbon_campaigns (slug, title, description, frame_url, profile_key, frame_width, frame_height, status)
      VALUES (
        clean_slug,
        row_data->>'title',
        row_data->>'description',
        row_data->>'frame_url',
        row_data->>'profile_key',
        COALESCE((row_data->>'frame_width')::int, 1080),
        COALESCE((row_data->>'frame_height')::int, 1080),
        COALESCE(row_data->>'status', 'draft')
      ) RETURNING to_jsonb(twibbon_campaigns.*) INTO result_json;
    ELSIF action_type = 'update' THEN
      row_uuid := row_id::uuid;
      UPDATE public.twibbon_campaigns
      SET
        slug = COALESCE(clean_slug, slug),
        title = COALESCE(row_data->>'title', title),
        description = row_data->>'description',
        frame_url = COALESCE(row_data->>'frame_url', frame_url),
        frame_width = COALESCE((row_data->>'frame_width')::int, frame_width),
        frame_height = COALESCE((row_data->>'frame_height')::int, frame_height),
        status = COALESCE(row_data->>'status', status),
        updated_at = timezone('utc'::text, now())
      WHERE id = row_uuid
      RETURNING to_jsonb(twibbon_campaigns.*) INTO result_json;
    ELSIF action_type = 'delete' THEN
      row_uuid := row_id::uuid;
      DELETE FROM public.twibbon_campaigns WHERE id = row_uuid RETURNING to_jsonb(twibbon_campaigns.*) INTO result_json;
    END IF;

  ELSIF target_table = 'profiles' THEN
    IF action_type = 'insert' THEN
      INSERT INTO public.profiles (key, title, bio, photo, bg_color, url_banner, social_facebook, social_instagram, social_web, social_email)
      VALUES (
        row_data->>'key',
        row_data->>'title',
        row_data->>'bio',
        row_data->>'photo',
        row_data->>'bg_color',
        row_data->>'url_banner',
        row_data->>'social_facebook',
        row_data->>'social_instagram',
        row_data->>'social_web',
        row_data->>'social_email'
      ) RETURNING to_jsonb(profiles.*) INTO result_json;
    ELSIF action_type = 'update' THEN
      UPDATE public.profiles
      SET
        title = COALESCE(row_data->>'title', title),
        bio = COALESCE(row_data->>'bio', bio),
        photo = row_data->>'photo',
        bg_color = COALESCE(row_data->>'bg_color', bg_color),
        url_banner = row_data->>'url_banner',
        social_facebook = row_data->>'social_facebook',
        social_instagram = row_data->>'social_instagram',
        social_web = row_data->>'social_web',
        social_email = row_data->>'social_email'
      WHERE key = COALESCE(row_data->>'key', row_id)
      RETURNING to_jsonb(profiles.*) INTO result_json;
    ELSIF action_type = 'delete' THEN
      DELETE FROM public.profiles WHERE key = row_id RETURNING to_jsonb(profiles.*) INTO result_json;
    END IF;

  ELSIF target_table = 'directory_fakultas' THEN
    IF action_type = 'insert' THEN
      INSERT INTO public.directory_fakultas (name, description, photo, whatsapp, instagram, web, group_wa)
      VALUES (
        row_data->>'name',
        row_data->>'description',
        row_data->>'photo',
        row_data->>'whatsapp',
        row_data->>'instagram',
        row_data->>'web',
        row_data->>'group_wa'
      ) RETURNING to_jsonb(directory_fakultas.*) INTO result_json;
    ELSIF action_type = 'update' THEN
      row_uuid := row_id::uuid;
      UPDATE public.directory_fakultas
      SET
        name = COALESCE(row_data->>'name', name),
        description = row_data->>'description',
        photo = row_data->>'photo',
        whatsapp = row_data->>'whatsapp',
        instagram = row_data->>'instagram',
        web = row_data->>'web',
        group_wa = row_data->>'group_wa'
      WHERE id = row_uuid
      RETURNING to_jsonb(directory_fakultas.*) INTO result_json;
    ELSIF action_type = 'delete' THEN
      row_uuid := row_id::uuid;
      DELETE FROM public.directory_fakultas WHERE id = row_uuid RETURNING to_jsonb(directory_fakultas.*) INTO result_json;
    END IF;

  ELSIF target_table = 'directory_prodi' THEN
    IF action_type = 'insert' THEN
      INSERT INTO public.directory_prodi (name, status, link, instagram, web)
      VALUES (
        row_data->>'name',
        row_data->>'status',
        row_data->>'link',
        row_data->>'instagram',
        row_data->>'web'
      ) RETURNING to_jsonb(directory_prodi.*) INTO result_json;
    ELSIF action_type = 'update' THEN
      row_uuid := row_id::uuid;
      UPDATE public.directory_prodi
      SET
        name = COALESCE(row_data->>'name', name),
        status = row_data->>'status',
        link = row_data->>'link',
        instagram = row_data->>'instagram',
        web = row_data->>'web'
      WHERE id = row_uuid
      RETURNING to_jsonb(directory_prodi.*) INTO result_json;
    ELSIF action_type = 'delete' THEN
      row_uuid := row_id::uuid;
      DELETE FROM public.directory_prodi WHERE id = row_uuid RETURNING to_jsonb(directory_prodi.*) INTO result_json;
    END IF;

  ELSIF target_table = 'directory_hmj' THEN
    IF action_type = 'insert' THEN
      INSERT INTO public.directory_hmj (name, contact_person, whatsapp, instagram, group_link, sort_order)
      VALUES (
        row_data->>'name',
        row_data->>'contact_person',
        row_data->>'whatsapp',
        row_data->>'instagram',
        row_data->>'group_link',
        COALESCE((row_data->>'sort_order')::int, 0)
      ) RETURNING to_jsonb(directory_hmj.*) INTO result_json;
    ELSIF action_type = 'update' THEN
      row_int := row_id::int;
      UPDATE public.directory_hmj
      SET
        name = COALESCE(row_data->>'name', name),
        contact_person = row_data->>'contact_person',
        whatsapp = row_data->>'whatsapp',
        instagram = row_data->>'instagram',
        group_link = row_data->>'group_link',
        sort_order = COALESCE((row_data->>'sort_order')::int, sort_order)
      WHERE id = row_int
      RETURNING to_jsonb(directory_hmj.*) INTO result_json;
    ELSIF action_type = 'delete' THEN
      row_int := row_id::int;
      DELETE FROM public.directory_hmj WHERE id = row_int RETURNING to_jsonb(directory_hmj.*) INTO result_json;
    END IF;
  END IF;

  RETURN result_json;
END;
$$;

-- 5. Set up Supabase Storage buckets and public write policies for twibbon-frames
INSERT INTO storage.buckets (id, name, public)
VALUES ('twibbon-frames', 'twibbon-frames', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Read twibbon-frames" ON storage.objects;
CREATE POLICY "Public Read twibbon-frames" ON storage.objects
FOR SELECT USING (bucket_id = 'twibbon-frames');

DROP POLICY IF EXISTS "Public Insert twibbon-frames" ON storage.objects;
CREATE POLICY "Public Insert twibbon-frames" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'twibbon-frames');
