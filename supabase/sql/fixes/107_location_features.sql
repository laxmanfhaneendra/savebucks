-- =====================================================
-- LOCATION FEATURES FOR SAVEBUCKS
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Ensure deals table has location columns
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'US';

-- 2. Ensure profiles table has location columns for user preferences
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'US';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS zip_code TEXT;

-- 3. Create spatial index for faster location queries on deals
DROP INDEX IF EXISTS idx_deals_location;
CREATE INDEX idx_deals_location ON public.deals (latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- 4. Create spatial index for profiles
DROP INDEX IF EXISTS idx_profiles_location_coords;
CREATE INDEX idx_profiles_location_coords ON public.profiles (latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- 5. Create index for city/state searches
CREATE INDEX IF NOT EXISTS idx_deals_city_state ON public.deals (city, state);
CREATE INDEX IF NOT EXISTS idx_profiles_city_state ON public.profiles (city, state);

-- 6. Function to calculate distance between two points (Haversine formula)
-- Returns distance in kilometers
CREATE OR REPLACE FUNCTION calculate_distance_km(
  lat1 DOUBLE PRECISION,
  lon1 DOUBLE PRECISION,
  lat2 DOUBLE PRECISION,
  lon2 DOUBLE PRECISION
) RETURNS DOUBLE PRECISION AS $$
DECLARE
  R CONSTANT DOUBLE PRECISION := 6371; -- Earth's radius in km
  dLat DOUBLE PRECISION;
  dLon DOUBLE PRECISION;
  a DOUBLE PRECISION;
  c DOUBLE PRECISION;
BEGIN
  IF lat1 IS NULL OR lon1 IS NULL OR lat2 IS NULL OR lon2 IS NULL THEN
    RETURN NULL;
  END IF;
  
  dLat := radians(lat2 - lat1);
  dLon := radians(lon2 - lon1);
  
  a := sin(dLat / 2) * sin(dLat / 2) +
       cos(radians(lat1)) * cos(radians(lat2)) *
       sin(dLon / 2) * sin(dLon / 2);
  
  c := 2 * atan2(sqrt(a), sqrt(1 - a));
  
  RETURN R * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 7. Function to get nearby deals
CREATE OR REPLACE FUNCTION get_nearby_deals(
  user_lat DOUBLE PRECISION,
  user_lon DOUBLE PRECISION,
  radius_km DOUBLE PRECISION DEFAULT 50,
  max_results INTEGER DEFAULT 50
) RETURNS TABLE (
  id BIGINT,
  title TEXT,
  distance_km DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.title,
    calculate_distance_km(user_lat, user_lon, d.latitude, d.longitude) AS distance_km
  FROM public.deals d
  WHERE 
    d.status = 'approved'
    AND d.latitude IS NOT NULL 
    AND d.longitude IS NOT NULL
    AND calculate_distance_km(user_lat, user_lon, d.latitude, d.longitude) <= radius_km
  ORDER BY distance_km ASC
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql STABLE;

-- 8. Grant permissions
GRANT EXECUTE ON FUNCTION calculate_distance_km TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_nearby_deals TO authenticated, anon;

-- 9. Add comment for documentation
COMMENT ON FUNCTION calculate_distance_km IS 'Calculates distance between two lat/lon points using Haversine formula. Returns kilometers.';
COMMENT ON FUNCTION get_nearby_deals IS 'Returns deals within specified radius of user location, sorted by distance.';

-- =====================================================
-- VERIFICATION QUERIES (run these to verify)
-- =====================================================

-- Check if columns exist:
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'deals' AND column_name IN ('latitude', 'longitude', 'city', 'state');

-- Check indexes:
-- SELECT indexname, indexdef 
-- FROM pg_indexes 
-- WHERE tablename = 'deals' AND indexname LIKE '%location%';

-- Test distance function (New York to Los Angeles):
-- SELECT calculate_distance_km(40.7128, -74.0060, 34.0522, -118.2437); -- Should be ~3935 km

-- Test nearby deals (replace with real coordinates):
-- SELECT * FROM get_nearby_deals(40.7128, -74.0060, 100, 10);
