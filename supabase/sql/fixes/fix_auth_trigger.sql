-- =====================================================
-- SAVEBUCKS - FIX AUTH TRIGGER
-- =====================================================
-- This script creates the missing trigger to automatically 
-- create a public.profiles row when a new user signs up.

-- 1. Create the function
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, handle, created_at, updated_at)
  VALUES (
    new.id, 
    -- Use metadata handle/name or email prefix or NULL
    COALESCE(
      new.raw_user_meta_data->>'handle', 
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    NOW(), 
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Backfill for existing users who might be missing a profile
INSERT INTO public.profiles (id, handle, created_at, updated_at)
SELECT 
  id, 
  COALESCE(raw_user_meta_data->>'handle', split_part(email, '@', 1)),
  created_at, 
  updated_at
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT DO NOTHING;

SELECT 'AUTH TRIGGER FIXED AND BACKFILLED' as status;
