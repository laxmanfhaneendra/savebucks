-- =====================================================
-- SAVEBUCKS RESTAURANT DEALS PLATFORM
-- Complete Database Schema v1.0
-- =====================================================
-- 
-- Run this entire file in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/lukuvbeyprigewicdkhf/sql
--
-- This creates all tables, indexes, functions, and security policies
-- for a production-ready restaurant deals platform.
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- =====================================================
-- PART 1: USER PROFILES
-- =====================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Info
  email TEXT,
  handle TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  
  -- Role & Status
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'restaurant_owner', 'moderator', 'admin')),
  is_verified BOOLEAN DEFAULT FALSE,
  is_banned BOOLEAN DEFAULT FALSE,
  
  -- Location (for personalized deals)
  city TEXT,
  state TEXT,
  zip_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Preferences
  preferred_cuisines TEXT[],
  notification_settings JSONB DEFAULT '{"email": true, "push": true, "deals": true}',
  
  -- Gamification
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  badges TEXT[] DEFAULT '{}',
  
  -- Stats
  deals_submitted INTEGER DEFAULT 0,
  deals_claimed INTEGER DEFAULT 0,
  helpful_votes INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  last_seen_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_handle ON profiles(handle);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(city, state);

-- RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- =====================================================
-- PART 2: COMPANIES (RESTAURANTS)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.companies (
  id BIGSERIAL PRIMARY KEY,
  
  -- Basic Info
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  website TEXT,
  
  -- Contact
  phone TEXT,
  email TEXT,
  
  -- Location
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'USA',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Restaurant-specific
  is_restaurant BOOLEAN DEFAULT TRUE,
  cuisine_types TEXT[],
  price_range TEXT CHECK (price_range IN ('$', '$$', '$$$', '$$$$')),
  restaurant_hours JSONB, -- {"monday": {"open": "09:00", "close": "21:00"}, ...}
  photos TEXT[],
  menu_url TEXT,
  
  -- Ownership
  owner_id UUID REFERENCES auth.users(id),
  is_claimed BOOLEAN DEFAULT FALSE,
  claimed_at TIMESTAMPTZ,
  
  -- Ratings
  avg_rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  
  -- Status
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Stats
  deal_count INTEGER DEFAULT 0,
  follower_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for companies
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);
CREATE INDEX IF NOT EXISTS idx_companies_location ON companies(latitude, longitude) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_companies_city_state ON companies(city, state);
CREATE INDEX IF NOT EXISTS idx_companies_cuisine ON companies USING GIN(cuisine_types);
CREATE INDEX IF NOT EXISTS idx_companies_owner ON companies(owner_id) WHERE owner_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_companies_name_search ON companies USING GIN(name gin_trgm_ops);

-- RLS for companies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active companies" ON companies
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Owners can update their companies" ON companies
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Admins can do anything" ON companies
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- PART 3: CATEGORIES
-- =====================================================

CREATE TABLE IF NOT EXISTS public.categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  parent_id BIGINT REFERENCES categories(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed food categories
INSERT INTO categories (name, slug, icon, color, sort_order) VALUES
  ('Pizza', 'pizza', '🍕', '#FF6B35', 1),
  ('Mexican', 'mexican', '🌮', '#FF9F1C', 2),
  ('Chinese', 'chinese', '🥡', '#E63946', 3),
  ('Italian', 'italian', '🍝', '#2A9D8F', 4),
  ('Japanese', 'japanese', '🍱', '#E9C46A', 5),
  ('Indian', 'indian', '🍛', '#F4A261', 6),
  ('American', 'american', '🍔', '#264653', 7),
  ('Fast Food', 'fast-food', '🍟', '#E76F51', 8),
  ('Coffee & Bakery', 'coffee-bakery', '☕', '#6D4C41', 9),
  ('Seafood', 'seafood', '🦐', '#0077B6', 10),
  ('Thai', 'thai', '🍜', '#8338EC', 11),
  ('Mediterranean', 'mediterranean', '🥙', '#06D6A0', 12),
  ('Korean', 'korean', '🍲', '#FF006E', 13),
  ('Desserts', 'desserts', '🍰', '#FB5607', 14),
  ('Healthy', 'healthy', '🥗', '#80B918', 15)
ON CONFLICT (slug) DO NOTHING;

-- RLS for categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT USING (true);

-- =====================================================
-- PART 4: DEALS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.deals (
  id BIGSERIAL PRIMARY KEY,
  
  -- Basic Info
  title TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  image_url TEXT,
  
  -- Source
  source TEXT DEFAULT 'user' CHECK (source IN ('user', 'restaurant', 'scraper', 'admin')),
  source_url TEXT,
  submitter_id UUID REFERENCES auth.users(id),
  
  -- Company/Restaurant
  company_id BIGINT REFERENCES companies(id) ON DELETE SET NULL,
  merchant TEXT, -- Fallback if no company linked
  
  -- Category
  category_id BIGINT REFERENCES categories(id),
  tags TEXT[],
  
  -- Deal Details
  deal_type TEXT DEFAULT 'percentage' CHECK (deal_type IN ('percentage', 'fixed', 'bogo', 'freebie', 'special')),
  discount_value DECIMAL,
  discount_text TEXT, -- "50% off", "Buy 1 Get 1 Free", etc.
  original_price DECIMAL,
  sale_price DECIMAL,
  currency TEXT DEFAULT 'USD',
  
  -- Redemption
  promo_code TEXT,
  redemption_type TEXT DEFAULT 'show_screen' CHECK (redemption_type IN ('code', 'show_screen', 'print', 'link', 'in_store')),
  redemption_instructions TEXT,
  deal_url TEXT,
  
  -- Validity
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  valid_days TEXT[], -- ['monday', 'tuesday'] for recurring deals
  valid_hours JSONB, -- {"start": "17:00", "end": "21:00"}
  
  -- Limits
  max_redemptions INTEGER,
  current_redemptions INTEGER DEFAULT 0,
  max_per_user INTEGER DEFAULT 1,
  
  -- Location (denormalized for geo queries)
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  city TEXT,
  state TEXT,
  
  -- Status & Moderation
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired', 'deleted')),
  rejection_reason TEXT,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  
  -- Quality & Scoring
  quality_score DECIMAL DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  
  -- Stats
  view_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  save_count INTEGER DEFAULT 0,
  claim_count INTEGER DEFAULT 0,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Indexes for deals
CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);
CREATE INDEX IF NOT EXISTS idx_deals_company ON deals(company_id);
CREATE INDEX IF NOT EXISTS idx_deals_category ON deals(category_id);
CREATE INDEX IF NOT EXISTS idx_deals_submitter ON deals(submitter_id);
CREATE INDEX IF NOT EXISTS idx_deals_location ON deals(latitude, longitude) WHERE status = 'approved';
CREATE INDEX IF NOT EXISTS idx_deals_city_state ON deals(city, state) WHERE status = 'approved';
CREATE INDEX IF NOT EXISTS idx_deals_expires ON deals(expires_at) WHERE status = 'approved';
CREATE INDEX IF NOT EXISTS idx_deals_created ON deals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_deals_featured ON deals(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_deals_title_search ON deals USING GIN(title gin_trgm_ops);

-- RLS for deals
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved deals" ON deals
  FOR SELECT USING (status = 'approved' OR submitter_id = auth.uid());

CREATE POLICY "Authenticated users can submit deals" ON deals
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own pending deals" ON deals
  FOR UPDATE USING (submitter_id = auth.uid() AND status = 'pending');

CREATE POLICY "Admins can manage all deals" ON deals
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
  );

-- =====================================================
-- PART 5: DEAL CLAIMS & SAVES
-- =====================================================

-- Deal Claims (when user redeems a deal)
CREATE TABLE IF NOT EXISTS public.deal_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id BIGINT NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  claimed_at TIMESTAMPTZ DEFAULT NOW(),
  redeemed_at TIMESTAMPTZ,
  
  -- Unique claim per user per deal
  UNIQUE(deal_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_deal_claims_user ON deal_claims(user_id);
CREATE INDEX IF NOT EXISTS idx_deal_claims_deal ON deal_claims(deal_id);

-- Saved Deals (bookmarks)
CREATE TABLE IF NOT EXISTS public.saved_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id BIGINT NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(deal_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_deals_user ON saved_deals(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_deals_deal ON saved_deals(deal_id);

-- RLS for claims and saves
ALTER TABLE deal_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own claims" ON deal_claims
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own saves" ON saved_deals
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- PART 6: VOTES & REACTIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  deal_id BIGINT REFERENCES deals(id) ON DELETE CASCADE,
  
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, deal_id)
);

CREATE INDEX IF NOT EXISTS idx_votes_deal ON votes(deal_id);
CREATE INDEX IF NOT EXISTS idx_votes_user ON votes(user_id);

ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own votes" ON votes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view vote counts" ON votes
  FOR SELECT USING (true);

-- =====================================================
-- PART 7: COMMENTS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.comments (
  id BIGSERIAL PRIMARY KEY,
  deal_id BIGINT REFERENCES deals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  parent_id BIGINT REFERENCES comments(id) ON DELETE CASCADE,
  
  content TEXT NOT NULL,
  
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_deal ON comments(deal_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comments" ON comments
  FOR SELECT USING (NOT is_deleted);

CREATE POLICY "Authenticated users can comment" ON comments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own comments" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- PART 8: TAGS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.tags (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT, -- 'cuisine', 'dietary', 'deal_type', etc.
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed common tags
INSERT INTO tags (name, slug, category) VALUES
  ('Vegetarian', 'vegetarian', 'dietary'),
  ('Vegan', 'vegan', 'dietary'),
  ('Gluten-Free', 'gluten-free', 'dietary'),
  ('Halal', 'halal', 'dietary'),
  ('Kosher', 'kosher', 'dietary'),
  ('Lunch Special', 'lunch-special', 'deal_type'),
  ('Happy Hour', 'happy-hour', 'deal_type'),
  ('Early Bird', 'early-bird', 'deal_type'),
  ('Weekend Only', 'weekend-only', 'deal_type'),
  ('New Customer', 'new-customer', 'deal_type'),
  ('Family Deal', 'family-deal', 'deal_type'),
  ('Student Discount', 'student-discount', 'deal_type')
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tags" ON tags
  FOR SELECT USING (true);

-- =====================================================
-- PART 9: USER LOCATIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.user_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  city TEXT,
  state TEXT,
  zip_code TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  
  is_primary BOOLEAN DEFAULT TRUE,
  name TEXT, -- "Home", "Work", etc.
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_locations_user ON user_locations(user_id);

ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own locations" ON user_locations
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- PART 10: HELPER FUNCTIONS
-- =====================================================

-- Calculate distance between two points (Haversine formula)
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 DECIMAL, lon1 DECIMAL,
  lat2 DECIMAL, lon2 DECIMAL
) RETURNS DECIMAL AS $$
DECLARE
  R DECIMAL := 3959; -- Earth radius in miles
  dLat DECIMAL;
  dLon DECIMAL;
  a DECIMAL;
  c DECIMAL;
BEGIN
  dLat := RADIANS(lat2 - lat1);
  dLon := RADIANS(lon2 - lon1);
  
  a := SIN(dLat/2) * SIN(dLat/2) +
       COS(RADIANS(lat1)) * COS(RADIANS(lat2)) *
       SIN(dLon/2) * SIN(dLon/2);
  
  c := 2 * ATAN2(SQRT(a), SQRT(1-a));
  
  RETURN R * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Get nearby deals
CREATE OR REPLACE FUNCTION get_nearby_deals(
  user_lat DECIMAL,
  user_lng DECIMAL,
  radius_miles DECIMAL DEFAULT 10,
  category_slug TEXT DEFAULT NULL,
  cuisine_type TEXT DEFAULT NULL,
  result_limit INTEGER DEFAULT 20,
  result_offset INTEGER DEFAULT 0
) RETURNS TABLE (
  deal_id BIGINT,
  title TEXT,
  description TEXT,
  image_url TEXT,
  discount_text TEXT,
  promo_code TEXT,
  valid_until TIMESTAMPTZ,
  company_name TEXT,
  company_logo TEXT,
  cuisine_types TEXT[],
  price_range TEXT,
  avg_rating DECIMAL,
  distance DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id AS deal_id,
    d.title,
    d.description,
    d.image_url,
    d.discount_text,
    d.promo_code,
    d.valid_until,
    c.name AS company_name,
    c.logo_url AS company_logo,
    c.cuisine_types,
    c.price_range,
    c.avg_rating,
    calculate_distance(user_lat, user_lng, 
      COALESCE(d.latitude, c.latitude), 
      COALESCE(d.longitude, c.longitude)
    ) AS distance
  FROM deals d
  LEFT JOIN companies c ON d.company_id = c.id
  LEFT JOIN categories cat ON d.category_id = cat.id
  WHERE d.status = 'approved'
    AND (d.valid_until IS NULL OR d.valid_until > NOW())
    AND (d.latitude IS NOT NULL OR c.latitude IS NOT NULL)
    AND calculate_distance(user_lat, user_lng, 
          COALESCE(d.latitude, c.latitude), 
          COALESCE(d.longitude, c.longitude)
        ) <= radius_miles
    AND (category_slug IS NULL OR cat.slug = category_slug)
    AND (cuisine_type IS NULL OR cuisine_type = ANY(c.cuisine_types))
  ORDER BY distance ASC, d.created_at DESC
  LIMIT result_limit
  OFFSET result_offset;
END;
$$ LANGUAGE plpgsql STABLE;

-- Claim a deal
CREATE OR REPLACE FUNCTION claim_deal(p_deal_id BIGINT, p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_deal RECORD;
  v_existing RECORD;
BEGIN
  -- Get deal info
  SELECT * INTO v_deal FROM deals WHERE id = p_deal_id;
  
  IF v_deal IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Deal not found');
  END IF;
  
  IF v_deal.status != 'approved' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Deal is not available');
  END IF;
  
  IF v_deal.valid_until IS NOT NULL AND v_deal.valid_until < NOW() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Deal has expired');
  END IF;
  
  IF v_deal.max_redemptions IS NOT NULL AND v_deal.current_redemptions >= v_deal.max_redemptions THEN
    RETURN jsonb_build_object('success', false, 'error', 'Deal redemption limit reached');
  END IF;
  
  -- Check if already claimed
  SELECT * INTO v_existing FROM deal_claims WHERE deal_id = p_deal_id AND user_id = p_user_id;
  
  IF v_existing IS NOT NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'You have already claimed this deal');
  END IF;
  
  -- Create claim
  INSERT INTO deal_claims (deal_id, user_id) VALUES (p_deal_id, p_user_id);
  
  -- Update deal stats
  UPDATE deals SET current_redemptions = current_redemptions + 1, claim_count = claim_count + 1 WHERE id = p_deal_id;
  
  -- Update user stats
  UPDATE profiles SET deals_claimed = deals_claimed + 1 WHERE id = p_user_id;
  
  RETURN jsonb_build_object(
    'success', true, 
    'promo_code', v_deal.promo_code,
    'instructions', v_deal.redemption_instructions
  );
END;
$$ LANGUAGE plpgsql;

-- Toggle save deal
CREATE OR REPLACE FUNCTION toggle_save_deal(p_deal_id BIGINT, p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_existing RECORD;
BEGIN
  SELECT * INTO v_existing FROM saved_deals WHERE deal_id = p_deal_id AND user_id = p_user_id;
  
  IF v_existing IS NOT NULL THEN
    -- Remove save
    DELETE FROM saved_deals WHERE id = v_existing.id;
    UPDATE deals SET save_count = save_count - 1 WHERE id = p_deal_id AND save_count > 0;
    RETURN jsonb_build_object('saved', false);
  ELSE
    -- Add save
    INSERT INTO saved_deals (deal_id, user_id) VALUES (p_deal_id, p_user_id);
    UPDATE deals SET save_count = save_count + 1 WHERE id = p_deal_id;
    RETURN jsonb_build_object('saved', true);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PART 11: AUTO-UPDATE TIMESTAMPS
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER deals_updated_at BEFORE UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- PART 12: AUTO-CREATE PROFILE ON SIGNUP
-- =====================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, handle, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- DONE! Database is ready.
-- =====================================================
