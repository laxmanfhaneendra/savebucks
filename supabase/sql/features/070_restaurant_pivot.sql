-- SAVEBUCKS RESTAURANT PIVOT MIGRATION
-- This migration enhances the existing schema for restaurant-focused deals
-- Run this after reviewing and backing up your database

-- =============================================
-- PART 1: ENHANCE COMPANIES TABLE FOR RESTAURANTS
-- =============================================

-- Add owner relationship (restaurant can claim their profile)
ALTER TABLE companies ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id);
ALTER TABLE companies ADD COLUMN IF NOT EXISTS is_claimed BOOLEAN DEFAULT FALSE;

-- Add cuisine as array for multiple types
ALTER TABLE companies ADD COLUMN IF NOT EXISTS cuisine_types TEXT[];

-- Add cover image and photos
ALTER TABLE companies ADD COLUMN IF NOT EXISTS cover_image_url TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS photos TEXT[];

-- Add ratings
ALTER TABLE companies ADD COLUMN IF NOT EXISTS avg_rating DECIMAL(2,1) DEFAULT 0;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

-- Update index to use new cuisine_types array
CREATE INDEX IF NOT EXISTS idx_companies_cuisine ON companies USING GIN(cuisine_types);

-- =============================================
-- PART 2: ENHANCE DEALS TABLE FOR RESTAURANT DEALS
-- =============================================

-- Add restaurant-specific deal fields
ALTER TABLE deals ADD COLUMN IF NOT EXISTS deal_type_enum TEXT DEFAULT 'discount'; -- 'percentage', 'fixed', 'bogo', 'freebie'
ALTER TABLE deals ADD COLUMN IF NOT EXISTS discount_value DECIMAL;
ALTER TABLE deals ADD COLUMN IF NOT EXISTS valid_days TEXT[]; -- ['monday', 'tuesday'] for recurring
ALTER TABLE deals ADD COLUMN IF NOT EXISTS valid_hours JSONB; -- {"start": "17:00", "end": "21:00"}
ALTER TABLE deals ADD COLUMN IF NOT EXISTS redemption_type TEXT DEFAULT 'show_screen'; -- 'code', 'show_screen', 'print'
ALTER TABLE deals ADD COLUMN IF NOT EXISTS promo_code TEXT;
ALTER TABLE deals ADD COLUMN IF NOT EXISTS max_redemptions INTEGER;
ALTER TABLE deals ADD COLUMN IF NOT EXISTS current_redemptions INTEGER DEFAULT 0;

-- Add source tracking
ALTER TABLE deals ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'user'; -- 'restaurant', 'user', 'scraper'
ALTER TABLE deals ADD COLUMN IF NOT EXISTS source_url TEXT;

-- Add location fields (denormalized for faster geo queries)
ALTER TABLE deals ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE deals ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE deals ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE deals ADD COLUMN IF NOT EXISTS state TEXT;

-- Add stats
ALTER TABLE deals ADD COLUMN IF NOT EXISTS save_count INTEGER DEFAULT 0;
ALTER TABLE deals ADD COLUMN IF NOT EXISTS claim_count INTEGER DEFAULT 0;

-- Indexes for geo and time-based queries
CREATE INDEX IF NOT EXISTS idx_deals_location ON deals(latitude, longitude) WHERE status = 'approved';
CREATE INDEX IF NOT EXISTS idx_deals_city_state ON deals(city, state) WHERE status = 'approved';
CREATE INDEX IF NOT EXISTS idx_deals_expires ON deals(expires_at) WHERE status = 'approved';
CREATE INDEX IF NOT EXISTS idx_deals_source ON deals(source);

-- =============================================
-- PART 3: DEAL CLAIMS (USER GETS A DEAL)
-- =============================================

CREATE TABLE IF NOT EXISTS public.deal_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id BIGINT NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  claimed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  redeemed_at TIMESTAMPTZ,
  
  -- Prevent double claims
  UNIQUE(deal_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_deal_claims_user ON deal_claims(user_id);
CREATE INDEX IF NOT EXISTS idx_deal_claims_deal ON deal_claims(deal_id);

-- RLS for deal_claims
ALTER TABLE deal_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own claims" ON deal_claims
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own claims" ON deal_claims
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own claims" ON deal_claims
  FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- PART 4: SAVED DEALS (BOOKMARKS)
-- =============================================

CREATE TABLE IF NOT EXISTS public.saved_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id BIGINT NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(deal_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_deals_user ON saved_deals(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_deals_deal ON saved_deals(deal_id);

-- RLS for saved_deals
ALTER TABLE saved_deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved deals" ON saved_deals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can save deals" ON saved_deals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave deals" ON saved_deals
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- PART 5: USER LOCATIONS
-- =============================================

CREATE TABLE IF NOT EXISTS public.user_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  city TEXT,
  state TEXT,
  zip_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  is_primary BOOLEAN DEFAULT TRUE,
  source TEXT DEFAULT 'manual', -- 'manual', 'gps', 'ip'
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_locations_user ON user_locations(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_locations_primary ON user_locations(user_id) WHERE is_primary = TRUE;

-- RLS for user_locations
ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own locations" ON user_locations
  FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- PART 6: SCRAPING SYSTEM
-- =============================================

CREATE TABLE IF NOT EXISTS public.scrape_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  scrape_type TEXT, -- 'groupon', 'restaurant_website', 'yelp', 'google', 'custom'
  
  city TEXT,
  state TEXT,
  
  is_active BOOLEAN DEFAULT TRUE,
  last_scraped_at TIMESTAMPTZ,
  scrape_frequency TEXT DEFAULT 'daily', -- 'hourly', 'daily', 'weekly'
  
  config JSONB, -- Source-specific configuration
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.scrape_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES scrape_sources(id) ON DELETE CASCADE,
  
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  status TEXT DEFAULT 'running', -- 'running', 'success', 'failed'
  deals_found INTEGER DEFAULT 0,
  deals_added INTEGER DEFAULT 0,
  deals_updated INTEGER DEFAULT 0,
  errors JSONB,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scrape_sources_active ON scrape_sources(is_active);
CREATE INDEX IF NOT EXISTS idx_scrape_logs_source ON scrape_logs(source_id);
CREATE INDEX IF NOT EXISTS idx_scrape_logs_status ON scrape_logs(status);

-- =============================================
-- PART 7: FOOD CATEGORIES
-- =============================================

-- Insert food-specific categories (if they don't exist)
INSERT INTO categories (name, slug, description, icon, sort_order, is_active) VALUES
  ('Pizza', 'pizza', 'Pizza deals and discounts', '🍕', 10, TRUE),
  ('Mexican', 'mexican', 'Mexican restaurant deals', '🌮', 20, TRUE),
  ('Asian', 'asian', 'Asian cuisine deals', '🍜', 30, TRUE),
  ('Italian', 'italian', 'Italian restaurant deals', '🍝', 40, TRUE),
  ('American', 'american', 'American food deals', '🍔', 50, TRUE),
  ('Fast Food', 'fast-food', 'Fast food deals', '🍟', 60, TRUE),
  ('Seafood', 'seafood', 'Seafood restaurant deals', '🦐', 70, TRUE),
  ('Sushi', 'sushi', 'Sushi and Japanese deals', '🍣', 80, TRUE),
  ('Indian', 'indian', 'Indian restaurant deals', '🍛', 90, TRUE),
  ('Thai', 'thai', 'Thai restaurant deals', '🥘', 100, TRUE),
  ('Mediterranean', 'mediterranean', 'Mediterranean food deals', '🥙', 110, TRUE),
  ('BBQ', 'bbq', 'BBQ and grill deals', '🍖', 120, TRUE),
  ('Breakfast', 'breakfast', 'Breakfast and brunch deals', '🥞', 130, TRUE),
  ('Coffee & Bakery', 'coffee-bakery', 'Coffee and bakery deals', '☕', 140, TRUE),
  ('Desserts', 'desserts', 'Dessert deals', '🍰', 150, TRUE),
  ('Vegan', 'vegan', 'Vegan and vegetarian deals', '🥗', 160, TRUE),
  ('Fine Dining', 'fine-dining', 'Fine dining deals', '🍽️', 170, TRUE),
  ('Food Trucks', 'food-trucks', 'Food truck deals', '🚚', 180, TRUE)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order;

-- =============================================
-- PART 8: ENHANCED SEARCH FUNCTIONS
-- =============================================

-- Function to get deals near a location
CREATE OR REPLACE FUNCTION get_deals_near_location(
  user_lat DECIMAL(10, 8),
  user_lon DECIMAL(11, 8),
  radius_miles DECIMAL DEFAULT 10,
  category_slug TEXT DEFAULT NULL,
  cuisine_type TEXT DEFAULT NULL,
  limit_count INTEGER DEFAULT 20,
  offset_count INTEGER DEFAULT 0
) RETURNS TABLE (
  id BIGINT,
  title TEXT,
  description TEXT,
  image_url TEXT,
  price NUMERIC,
  list_price NUMERIC,
  discount_value DECIMAL,
  deal_type_enum TEXT,
  promo_code TEXT,
  expires_at TIMESTAMPTZ,
  is_featured BOOLEAN,
  restaurant_id BIGINT,
  restaurant_name TEXT,
  restaurant_slug TEXT,
  restaurant_logo TEXT,
  restaurant_cuisine TEXT[],
  restaurant_price_range TEXT,
  restaurant_rating DECIMAL,
  distance_miles DECIMAL,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.title,
    d.description,
    d.image_url,
    d.price,
    d.list_price,
    d.discount_value,
    d.deal_type_enum,
    d.promo_code,
    d.expires_at,
    d.is_featured,
    c.id as restaurant_id,
    c.name as restaurant_name,
    c.slug as restaurant_slug,
    c.logo_url as restaurant_logo,
    c.cuisine_types as restaurant_cuisine,
    c.price_range as restaurant_price_range,
    c.avg_rating as restaurant_rating,
    calculate_distance(user_lat, user_lon, 
      COALESCE(d.latitude, c.latitude), 
      COALESCE(d.longitude, c.longitude)
    ) as distance_miles,
    d.created_at
  FROM deals d
  LEFT JOIN companies c ON d.company_id = c.id
  LEFT JOIN categories cat ON d.category_id = cat.id
  WHERE d.status = 'approved'
    AND (d.expires_at IS NULL OR d.expires_at > NOW())
    AND (
      (d.latitude IS NOT NULL AND d.longitude IS NOT NULL) OR
      (c.latitude IS NOT NULL AND c.longitude IS NOT NULL)
    )
    AND calculate_distance(user_lat, user_lon, 
        COALESCE(d.latitude, c.latitude), 
        COALESCE(d.longitude, c.longitude)
    ) <= radius_miles
    AND (category_slug IS NULL OR cat.slug = category_slug)
    AND (cuisine_type IS NULL OR cuisine_type = ANY(c.cuisine_types))
  ORDER BY d.is_featured DESC, distance_miles ASC, d.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- Function to increment deal claim count
CREATE OR REPLACE FUNCTION claim_deal(deal_id_param BIGINT, user_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
  max_claims INTEGER;
  current_claims INTEGER;
BEGIN
  -- Get deal limits
  SELECT max_redemptions, current_redemptions 
  INTO max_claims, current_claims
  FROM deals WHERE id = deal_id_param;
  
  -- Check if max claims reached
  IF max_claims IS NOT NULL AND current_claims >= max_claims THEN
    RETURN FALSE;
  END IF;
  
  -- Insert claim
  INSERT INTO deal_claims (deal_id, user_id)
  VALUES (deal_id_param, user_id_param)
  ON CONFLICT (deal_id, user_id) DO NOTHING;
  
  -- Update deal stats
  UPDATE deals 
  SET claim_count = claim_count + 1,
      current_redemptions = current_redemptions + 1
  WHERE id = deal_id_param;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to save/unsave a deal
CREATE OR REPLACE FUNCTION toggle_save_deal(deal_id_param BIGINT, user_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_saved BOOLEAN;
BEGIN
  -- Check if already saved
  SELECT EXISTS(
    SELECT 1 FROM saved_deals 
    WHERE deal_id = deal_id_param AND user_id = user_id_param
  ) INTO is_saved;
  
  IF is_saved THEN
    -- Unsave
    DELETE FROM saved_deals 
    WHERE deal_id = deal_id_param AND user_id = user_id_param;
    
    UPDATE deals SET save_count = save_count - 1 WHERE id = deal_id_param;
    RETURN FALSE;
  ELSE
    -- Save
    INSERT INTO saved_deals (deal_id, user_id) VALUES (deal_id_param, user_id_param);
    UPDATE deals SET save_count = save_count + 1 WHERE id = deal_id_param;
    RETURN TRUE;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- PART 9: UPDATE TRIGGER FOR DEAL LOCATION SYNC
-- =============================================

-- Sync deal location from company when deal is created/updated
CREATE OR REPLACE FUNCTION sync_deal_location()
RETURNS TRIGGER AS $$
BEGIN
  -- If deal doesn't have location but company does, copy it
  IF NEW.latitude IS NULL AND NEW.company_id IS NOT NULL THEN
    SELECT latitude, longitude, city, state
    INTO NEW.latitude, NEW.longitude, NEW.city, NEW.state
    FROM companies WHERE id = NEW.company_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_deals_sync_location ON deals;
CREATE TRIGGER trg_deals_sync_location
  BEFORE INSERT OR UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION sync_deal_location();

-- =============================================
-- DONE!
-- =============================================
SELECT 'Restaurant pivot migration completed successfully!' as status;
