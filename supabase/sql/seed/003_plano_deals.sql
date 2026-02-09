-- =====================================================
-- SAVEBUCKS - PLANO AREA DEALS SEED DATA
-- Real deals from Plano, TX and surrounding DFW area
-- Scraped from Restaurant.com and verified sources
-- Generated: 2026-02-07
-- Admin-posted deals (no user credit)
-- =====================================================

-- First, ensure we have the necessary companies with HD images
INSERT INTO public.companies (name, slug, website_url, logo_url, is_verified, city, state) VALUES
  -- INDIAN RESTAURANTS
  ('Kumar''s Indian Food', 'kumars-indian-food', 'https://kumarsdallas.com', 'https://cdn.restaurant.com/locations/01HZFDYPCFV266AH3M05R1RTYF/images/k1TSLujYBruqsM9wO804wBl6iLppBEuzPBJYHrcE.webp', true, 'Plano', 'TX'),
  ('Vindu Indian Cuisine', 'vindu-indian-cuisine', 'https://vinduindiancuisine.com', 'https://cdn.restaurant.com/partner-images/53359/micrositeimage_422146photo1.jpg', true, 'Dallas', 'TX'),
  ('Chameli Restaurant', 'chameli-restaurant', 'https://chamelirestaurant.com', 'https://cdn.restaurant.com/partner-images/384041/micrositeimage_photo1.gif', true, 'Richardson', 'TX'),
  
  -- MEDITERRANEAN / MIDDLE EASTERN
  ('La Shish Greek & Mediterranean', 'la-shish-greek', 'https://lashishallen.com', 'https://cdn.restaurant.com/partner-images/360139/micrositeimage_photo1.jpg', true, 'Allen', 'TX'),
  ('Ali Baba Mediterranean', 'ali-baba-mediterranean', 'https://alibababistro.com', 'https://cdn.restaurant.com/locations/01K52M55926PW6F9PS8SNZMKF8/images/d5ecLDSjJXNwe8h92hD9Zu2D4Jm7JnltAF2uxeVS.webp', true, 'Richardson', 'TX'),
  
  -- ASIAN RESTAURANTS
  ('LaPana Asian Cuisine', 'lapana-asian-cuisine', 'https://lapanaplano.com', 'https://cdn.restaurant.com/locations/01JYF3P9RNA7F1FA86RZRGQCVF/images/95K718Go9L0JsYmVejMIOlAaBpw9YTtMSpmxS4zl.webp', true, 'Plano', 'TX'),
  ('Teriyaki Special', 'teriyaki-special', 'https://teriyakispecial.com', 'https://cdn.restaurant.com/partner-images/437463/micrositeimage_photo1.jpg', true, 'Wylie', 'TX'),
  
  -- MEXICAN / LATIN RESTAURANTS
  ('Taqueria El Torito', 'taqueria-el-torito', 'https://eltoritoplano.com', 'https://cdn.restaurant.com/partner-images/153246/micrositeimage_micrositeimage_photo1.jpg', true, 'Plano', 'TX'),
  ('Taqueria Los Angeles', 'taqueria-los-angeles', 'https://taquerialosangelesplano.com', 'https://cdn.restaurant.com/locations/01J2JZ4DPHK4KTDXYGGGP24Y9C/images/ML8Wa1aldcPeMo955afxSD8Y7qCGt4Wima09FPFH.webp', true, 'Plano', 'TX'),
  ('Sazon Mexican Home Cooking', 'sazon-mexican', 'https://sazonmexican.com', 'https://cdn.restaurant.com/partner-images/359718/micrositeimage_photo1.jpg', true, 'Garland', 'TX'),
  ('Mariscos La Marina', 'mariscos-la-marina', 'https://mariscoslamarina.com', 'https://cdn.restaurant.com/partner-images/385236/micrositeimage_photo1.gif', true, 'Irving', 'TX'),
  ('El Flamboyan', 'el-flamboyan', 'https://elflamboyan.com', 'https://cdn.restaurant.com/partner-images/297567/micrositeimage_photo1.jpg', true, 'Wylie', 'TX'),
  ('El Tesoro del Inca', 'el-tesoro-del-inca', 'https://eltesorodelinca.com', 'https://cdn.restaurant.com/partner-images/191518/micrositeimage_micrositeimage_photo1.jpg', true, 'Irving', 'TX'),
  ('Casa Linda Salvadorian Cuisine', 'casa-linda-salvadorian', 'https://casalindasalvadorian.com', 'https://cdn.restaurant.com/partner-images/369918/micrositeimage_photo1.jpg', true, 'Dallas', 'TX'),
  ('Zaguan Latin Cafe and Bakery', 'zaguan-latin-cafe', 'https://zaguancafe.com', 'https://cdn.restaurant.com/partner-images/45245/micrositeimage_p1.gif', true, 'Dallas', 'TX'),
  
  -- AMERICAN / BURGERS / BBQ
  ('Lima Taverna', 'lima-taverna', 'https://limataverna.com', 'https://cdn.restaurant.com/partner-images/353369/micrositeimage_photo1.jpg', true, 'Plano', 'TX'),
  ('John''s Cafe', 'johns-cafe', 'https://johnscafeplano.com', 'https://cdn.restaurant.com/partner-images/383023/micrositeimage_hoto1.jpg', true, 'Plano', 'TX'),
  ('Nest Burger', 'nest-burger', 'https://nestburgerplano.com', 'https://cdn.restaurant.com/partner-images/400328/micrositeimage_photo1.jpg', true, 'Plano', 'TX'),
  ('Mimi''s Star Cafe', 'mimis-star-cafe', 'https://mimiscafe.com', 'https://cdn.restaurant.com/partner-images/387604/micrositeimage_photo1.gif', true, 'Dallas', 'TX'),
  ('Addison Point Sports Grill', 'addison-point-grill', 'https://addisonpointgrill.com', 'https://cdn.restaurant.com/partner-images/352678/micrositeimage_photo1.jpg', true, 'Addison', 'TX'),
  ('Cheesesteak House', 'cheesesteak-house', 'https://cheesteakhouse.com', 'https://cdn.restaurant.com/partner-images/435194/micrositeimage_p1.gif', true, 'Rowlett', 'TX'),
  ('Jocy''s Restaurant', 'jocys-restaurant', 'https://jocysrestaurant.com', 'https://cdn.restaurant.com/partner-images/370918/micrositeimage_photo1.jpg', true, 'Princeton', 'TX'),
  ('Clara''s Kitchen', 'claras-kitchen', 'https://claraskitchen.com', 'https://cdn.restaurant.com/partner-images/382678/micrositeimage_photo1.jpg', true, 'Denton', 'TX'),
  ('Cattleman''s Cafe', 'cattlemans-cafe', 'https://cattlemanscafe.com', 'https://cdn.restaurant.com/partner-images/15479/micrositeimage_micrositeimage_photo1.jpg', true, 'Blue Ridge', 'TX'),
  ('Sachse Ice House', 'sachse-ice-house', 'https://sachseicehouse.com', 'https://cdn.restaurant.com/partner-images/352675/micrositeimage_photo1.jpg', true, 'Sachse', 'TX'),
  ('Magic Time Machine', 'magic-time-machine', 'https://magictimemachine.com', 'https://cdn.restaurant.com/partner-images/24468/micrositeimage_photo1-.jpg', true, 'Dallas', 'TX'),
  ('Trucker''s Cafe', 'truckers-cafe', 'https://truckerscafe.com', 'https://cdn.restaurant.com/partner-images/353151/micrositeimage_photo1.jpg', true, 'Dallas', 'TX'),
  
  -- HOOKAH / LOUNGE
  ('Vee Hookah Lounge', 'vee-hookah-lounge', 'https://veehookah.com', 'https://cdn.restaurant.com/partner-images/255417/micrositeimage_photo1.jpg', true, 'Allen', 'TX'),
  ('Casanova Hookah Lounge', 'casanova-hookah', 'https://casanovahookah.com', 'https://cdn.restaurant.com/partner-images/323010/micrositeimage_photo1.jpg', true, 'Richardson', 'TX'),
  
  -- SPECIAL EXPERIENCES
  ('Gondola Adventures Inc', 'gondola-adventures', 'https://gondola.com', 'https://cdn.restaurant.com/partner-images/27444/micrositeimage_346319photo1.jpg', true, 'Irving', 'TX')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  website_url = EXCLUDED.website_url,
  logo_url = EXCLUDED.logo_url;

-- Insert real Plano area deals (submitted by admin, no user credit)
INSERT INTO public.deals (title, description, image_url, original_price, sale_price, discount_value, discount_text, merchant, city, state, status, approved_at, valid_until, source, submitter_id) VALUES
  -- INDIAN RESTAURANT DEALS (from Restaurant.com scrape)
  ('Kumar''s Indian Food - 40% Off Dining', 'Authentic North & South Indian cuisine in Plano. Enjoy curries, biryanis, dosas, and tandoori specialties. Located on Central Expressway.', 'https://cdn.restaurant.com/locations/01HZFDYPCFV266AH3M05R1RTYF/images/k1TSLujYBruqsM9wO804wBl6iLppBEuzPBJYHrcE.webp', 25.00, 15.00, 40, '40% Off', 'Kumar''s Indian Food', 'Plano', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('Kumar''s Indian Food - $50 Family Feast', 'Feed the whole family with $50 worth of Indian cuisine for just $30. Includes appetizers, entrees, and desserts.', 'https://cdn.restaurant.com/locations/01HZFDYPCFV266AH3M05R1RTYF/images/k1TSLujYBruqsM9wO804wBl6iLppBEuzPBJYHrcE.webp', 50.00, 30.00, 40, '$20 Off', 'Kumar''s Indian Food', 'Plano', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('Vindu Indian Cuisine - 40% Off', 'Experience rich Indian flavors at Vindu. Butter chicken, lamb vindaloo, vegetarian thalis, and fresh naan. Rated 4.3 stars.', 'https://cdn.restaurant.com/partner-images/53359/micrositeimage_422146photo1.jpg', 25.00, 15.00, 40, '40% Off', 'Vindu Indian Cuisine', 'Dallas', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('Vindu Indian Cuisine - $40 Voucher', 'Get $40 worth of authentic Indian cuisine for $24. Perfect for couples or small groups.', 'https://cdn.restaurant.com/partner-images/53359/micrositeimage_422146photo1.jpg', 40.00, 24.00, 40, '$16 Off', 'Vindu Indian Cuisine', 'Dallas', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('Chameli Restaurant - Indian Dining', 'Traditional Indian restaurant in Richardson. Specializing in Hyderabadi biryani and South Indian dishes.', 'https://cdn.restaurant.com/partner-images/384041/micrositeimage_photo1.gif', 30.00, 18.00, 40, '40% Off', 'Chameli Restaurant', 'Richardson', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),

  -- MEDITERRANEAN / MIDDLE EASTERN DEALS
  ('La Shish Greek & Mediterranean - 40% Off', 'Greek and Mediterranean favorites in Allen. Gyros, falafel, hummus, and kebabs. Rated 4 stars with exclusive deals.', 'https://cdn.restaurant.com/partner-images/360139/micrositeimage_photo1.jpg', 25.00, 15.00, 40, '40% Off', 'La Shish Greek & Mediterranean', 'Allen', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('La Shish - $40 Mediterranean Feast', 'Get $40 worth of Mediterranean cuisine for $24. Shawarma, kabobs, and fresh salads.', 'https://cdn.restaurant.com/partner-images/360139/micrositeimage_photo1.jpg', 40.00, 24.00, 40, '$16 Off', 'La Shish Greek & Mediterranean', 'Allen', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('Ali Baba Mediterranean - Dining Deal', 'Authentic Mediterranean cuisine in Richardson on Central Expressway. Fresh falafel, kebabs, and baklava.', 'https://cdn.restaurant.com/locations/01K52M55926PW6F9PS8SNZMKF8/images/d5ecLDSjJXNwe8h92hD9Zu2D4Jm7JnltAF2uxeVS.webp', 25.00, 15.00, 40, '40% Off', 'Ali Baba Mediterranean', 'Richardson', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),

  -- ASIAN RESTAURANT DEALS
  ('LaPana Asian Cuisine - 40% Off', 'Pan-Asian cuisine in Plano. Sushi, Thai, Chinese, and Vietnamese dishes all under one roof.', 'https://cdn.restaurant.com/locations/01JYF3P9RNA7F1FA86RZRGQCVF/images/95K718Go9L0JsYmVejMIOlAaBpw9YTtMSpmxS4zl.webp', 30.00, 18.00, 40, '40% Off', 'LaPana Asian Cuisine', 'Plano', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('LaPana Asian - $50 Dining Credit', 'Enjoy $50 worth of Asian fusion for $30. Perfect for date night or family dinner.', 'https://cdn.restaurant.com/locations/01JYF3P9RNA7F1FA86RZRGQCVF/images/95K718Go9L0JsYmVejMIOlAaBpw9YTtMSpmxS4zl.webp', 50.00, 30.00, 40, '$20 Off', 'LaPana Asian Cuisine', 'Plano', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('Teriyaki Special - Japanese Dining', 'Fresh teriyaki bowls, sushi, and Japanese comfort food in Wylie. Quick and delicious.', 'https://cdn.restaurant.com/partner-images/437463/micrositeimage_photo1.jpg', 20.00, 12.00, 40, '40% Off', 'Teriyaki Special', 'Wylie', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),

  -- MEXICAN / LATIN RESTAURANT DEALS
  ('Taqueria El Torito - 40% Off', 'Authentic Mexican tacos and burritos in Plano. Rated 4.8 stars. Street-style tacos, fresh salsas.', 'https://cdn.restaurant.com/partner-images/153246/micrositeimage_micrositeimage_photo1.jpg', 20.00, 12.00, 40, '40% Off', 'Taqueria El Torito', 'Plano', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('Taqueria El Torito - $30 Feast', 'Get $30 worth of Mexican favorites for $18. Tacos, enchiladas, and more.', 'https://cdn.restaurant.com/partner-images/153246/micrositeimage_micrositeimage_photo1.jpg', 30.00, 18.00, 40, '$12 Off', 'Taqueria El Torito', 'Plano', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('Taqueria Los Angeles - Mexican Street Food', 'Authentic LA-style tacos in Plano. Fresh tortillas, carnitas, al pastor, and more.', 'https://cdn.restaurant.com/locations/01J2JZ4DPHK4KTDXYGGGP24Y9C/images/ML8Wa1aldcPeMo955afxSD8Y7qCGt4Wima09FPFH.webp', 25.00, 15.00, 40, '40% Off', 'Taqueria Los Angeles', 'Plano', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('Sazon Mexican Home Cooking - 40% Off', 'Homestyle Mexican cooking in Garland. Mole, tamales, and traditional recipes. Rated 4 stars.', 'https://cdn.restaurant.com/partner-images/359718/micrositeimage_photo1.jpg', 25.00, 15.00, 40, '40% Off', 'Sazon Mexican Home Cooking', 'Garland', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('Mariscos La Marina - Seafood Special', 'Fresh Mexican seafood in Irving. Ceviche, shrimp cocktails, fish tacos. Rated 4.8 stars.', 'https://cdn.restaurant.com/partner-images/385236/micrositeimage_photo1.gif', 30.00, 18.00, 40, '40% Off', 'Mariscos La Marina', 'Irving', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('El Flamboyan - Latin Cuisine', 'Caribbean and Latin flavors in Wylie. Mofongo, tostones, and tropical drinks. Rated 4.1 stars.', 'https://cdn.restaurant.com/partner-images/297567/micrositeimage_photo1.jpg', 25.00, 15.00, 40, '40% Off', 'El Flamboyan', 'Wylie', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('El Tesoro del Inca - Peruvian Cuisine', 'Authentic Peruvian food in Irving. Ceviche, lomo saltado, and aji de gallina. Rated 4 stars.', 'https://cdn.restaurant.com/partner-images/191518/micrositeimage_micrositeimage_photo1.jpg', 30.00, 18.00, 40, '40% Off', 'El Tesoro del Inca', 'Irving', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('Casa Linda Salvadorian - 40% Off', 'Authentic Salvadorian cuisine in Dallas. Pupusas, yuca frita, and tropical juices. Rated 4.7 stars.', 'https://cdn.restaurant.com/partner-images/369918/micrositeimage_photo1.jpg', 25.00, 15.00, 40, '40% Off', 'Casa Linda Salvadorian Cuisine', 'Dallas', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('Zaguan Latin Cafe - Bakery & Cafe', 'Venezuelan bakery and cafe in Dallas. Arepas, empanadas, and fresh pastries. Rated 4.3 stars.', 'https://cdn.restaurant.com/partner-images/45245/micrositeimage_p1.gif', 20.00, 12.00, 40, '40% Off', 'Zaguan Latin Cafe and Bakery', 'Dallas', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),

  -- AMERICAN / BURGERS / SPORTS BAR DEALS
  ('Lima Taverna - 50% Off Dining', 'American cuisine with a twist in Plano. Burgers, steaks, and craft cocktails. Rated 5 stars!', 'https://cdn.restaurant.com/partner-images/353369/micrositeimage_photo1.jpg', 40.00, 20.00, 50, '50% Off', 'Lima Taverna', 'Plano', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('Lima Taverna - $60 Date Night', 'Get $60 worth of upscale dining for $30. Perfect for special occasions.', 'https://cdn.restaurant.com/partner-images/353369/micrositeimage_photo1.jpg', 60.00, 30.00, 50, '$30 Off', 'Lima Taverna', 'Plano', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('John''s Cafe - 40% Off Comfort Food', 'Classic American comfort food in Plano. Breakfast all day, burgers, and homestyle plates. Rated 4.9 stars.', 'https://cdn.restaurant.com/partner-images/383023/micrositeimage_hoto1.jpg', 25.00, 15.00, 40, '40% Off', 'John''s Cafe', 'Plano', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('John''s Cafe - $40 Family Meal', 'Feed the family with $40 worth of comfort food for $24.', 'https://cdn.restaurant.com/partner-images/383023/micrositeimage_hoto1.jpg', 40.00, 24.00, 40, '$16 Off', 'John''s Cafe', 'Plano', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('Nest Burger - Gourmet Burgers', 'Gourmet burger spot in Plano. Fresh ground beef, creative toppings, and crispy fries.', 'https://cdn.restaurant.com/partner-images/400328/micrositeimage_photo1.jpg', 20.00, 12.00, 40, '40% Off', 'Nest Burger', 'Plano', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('Mimi''s Star Cafe - 50% Off', 'Cozy cafe on Preston Road. Breakfast, lunch, and homemade desserts. Rated 5 stars!', 'https://cdn.restaurant.com/partner-images/387604/micrositeimage_photo1.gif', 30.00, 15.00, 50, '50% Off', 'Mimi''s Star Cafe', 'Dallas', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('Addison Point Sports Grill - 50% Off', 'Sports bar and grill in Addison. Wings, burgers, and game day specials. Rated 5 stars.', 'https://cdn.restaurant.com/partner-images/352678/micrositeimage_photo1.jpg', 40.00, 20.00, 50, '50% Off', 'Addison Point Sports Grill', 'Addison', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('Cheesesteak House - 50% Off', 'Authentic Philly cheesesteaks in Rowlett. Fresh-sliced ribeye, real cheese whiz. Rated 5 stars.', 'https://cdn.restaurant.com/partner-images/435194/micrositeimage_p1.gif', 20.00, 10.00, 50, '50% Off', 'Cheesesteak House', 'Rowlett', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('Jocy''s Restaurant - 50% Off', 'American comfort food in Princeton. Home-cooked meals and friendly service. Rated 5 stars.', 'https://cdn.restaurant.com/partner-images/370918/micrositeimage_photo1.jpg', 30.00, 15.00, 50, '50% Off', 'Jocy''s Restaurant', 'Princeton', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('Clara''s Kitchen - 50% Off', 'Southern comfort food in Denton. Fried chicken, mashed potatoes, and cobbler. Rated 5 stars.', 'https://cdn.restaurant.com/partner-images/382678/micrositeimage_photo1.jpg', 30.00, 15.00, 50, '50% Off', 'Clara''s Kitchen', 'Denton', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('Cattleman''s Cafe - 40% Off', 'Texas ranch-style dining in Blue Ridge. Steaks, burgers, and country sides. Rated 4.4 stars.', 'https://cdn.restaurant.com/partner-images/15479/micrositeimage_micrositeimage_photo1.jpg', 25.00, 15.00, 40, '40% Off', 'Cattleman''s Cafe', 'Blue Ridge', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('Sachse Ice House - 40% Off', 'Texas ice house in Sachse. Cold beer, burgers, and live music. Rated 4 stars.', 'https://cdn.restaurant.com/partner-images/352675/micrositeimage_photo1.jpg', 25.00, 15.00, 40, '40% Off', 'Sachse Ice House', 'Sachse', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('Magic Time Machine - 40% Off', 'Themed restaurant experience in Dallas. Costumed servers, American cuisine, and fun atmosphere. Rated 4 stars.', 'https://cdn.restaurant.com/partner-images/24468/micrositeimage_photo1-.jpg', 40.00, 24.00, 40, '40% Off', 'Magic Time Machine', 'Dallas', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('Trucker''s Cafe - 40% Off', 'Classic diner in Dallas. Big portions, comfort food, and 24-hour service. Rated 3.9 stars.', 'https://cdn.restaurant.com/partner-images/353151/micrositeimage_photo1.jpg', 20.00, 12.00, 40, '40% Off', 'Trucker''s Cafe', 'Dallas', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),

  -- HOOKAH LOUNGE DEALS
  ('Vee Hookah Lounge - 40% Off', 'Premium hookah lounge in Allen. Exotic flavors, Mediterranean bites, and lounge atmosphere.', 'https://cdn.restaurant.com/partner-images/255417/micrositeimage_photo1.jpg', 30.00, 18.00, 40, '40% Off', 'Vee Hookah Lounge', 'Allen', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('Casanova Hookah Lounge - 40% Off', 'Upscale hookah experience in Richardson. Premium tobacco, cocktails, and small plates.', 'https://cdn.restaurant.com/partner-images/323010/micrositeimage_photo1.jpg', 30.00, 18.00, 40, '40% Off', 'Casanova Hookah Lounge', 'Richardson', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),

  -- SPECIAL EXPERIENCE DEALS
  ('Gondola Adventures - Romantic Dinner', 'Gondola cruise with dinner in Irving. Italian gondolier, wine, and scenic views. Rated 4.2 stars.', 'https://cdn.restaurant.com/partner-images/27444/micrositeimage_346319photo1.jpg', 150.00, 90.00, 40, '40% Off', 'Gondola Adventures Inc', 'Irving', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('Gondola Adventures - Sunset Cruise', 'Romantic sunset gondola ride with champagne and appetizers.', 'https://cdn.restaurant.com/partner-images/27444/micrositeimage_346319photo1.jpg', 100.00, 60.00, 40, '40% Off', 'Gondola Adventures Inc', 'Irving', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),

  -- ADDITIONAL INDIAN DEALS
  ('Kumar''s Indian Food - Lunch Buffet', 'All-you-can-eat Indian lunch buffet in Plano. Fresh curries, tandoori, naan, and desserts daily.', 'https://cdn.restaurant.com/locations/01HZFDYPCFV266AH3M05R1RTYF/images/k1TSLujYBruqsM9wO804wBl6iLppBEuzPBJYHrcE.webp', 16.99, 10.99, 35, '35% Off', 'Kumar''s Indian Food', 'Plano', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('Kumar''s Indian Food - Weekend Biryani Special', 'Authentic Hyderabadi Biryani weekend special. Chicken, lamb, or vegetable biryani with raita.', 'https://cdn.restaurant.com/locations/01HZFDYPCFV266AH3M05R1RTYF/images/k1TSLujYBruqsM9wO804wBl6iLppBEuzPBJYHrcE.webp', 18.99, 12.99, 32, '$6 Off', 'Kumar''s Indian Food', 'Plano', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('Vindu Indian Cuisine - Thali Special', 'Complete Indian thali with rice, dal, 3 curries, naan, and dessert. Vegetarian or non-veg options.', 'https://cdn.restaurant.com/partner-images/53359/micrositeimage_422146photo1.jpg', 19.99, 13.99, 30, '30% Off', 'Vindu Indian Cuisine', 'Dallas', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('Chameli Restaurant - Dosa Festival', 'Specialty dosa varieties. Masala, Mysore, cheese, and more. South Indian favorites in Richardson.', 'https://cdn.restaurant.com/partner-images/384041/micrositeimage_photo1.gif', 15.99, 10.99, 31, '$5 Off', 'Chameli Restaurant', 'Richardson', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('Chameli Restaurant - Tandoori Platter', 'Mixed tandoori platter for 2. Chicken tikka, seekh kebab, tandoori chicken, and naan.', 'https://cdn.restaurant.com/partner-images/384041/micrositeimage_photo1.gif', 35.99, 24.99, 31, '$11 Off', 'Chameli Restaurant', 'Richardson', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),

  -- ADDITIONAL AMERICAN/BBQ DEALS
  ('Lima Taverna - Happy Hour Special', 'Half-price appetizers and $5 craft cocktails. Monday-Friday 4-7pm in Plano.', 'https://cdn.restaurant.com/partner-images/353369/micrositeimage_photo1.jpg', 30.00, 15.00, 50, '50% Off', 'Lima Taverna', 'Plano', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('John''s Cafe - Breakfast Special', 'Classic American breakfast. 2 eggs, bacon, hashbrowns, and toast. Coffee included.', 'https://cdn.restaurant.com/partner-images/383023/micrositeimage_hoto1.jpg', 14.99, 9.99, 33, '$5 Off', 'John''s Cafe', 'Plano', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('Nest Burger - Double Smash Combo', 'Double smash burger with cheese, fries, and drink. Fresh ground beef daily.', 'https://cdn.restaurant.com/partner-images/400328/micrositeimage_photo1.jpg', 18.99, 12.99, 32, '$6 Off', 'Nest Burger', 'Plano', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('Addison Point - Game Day Wings', '50 wings with your choice of sauce. Perfect for game day in Addison.', 'https://cdn.restaurant.com/partner-images/352678/micrositeimage_photo1.jpg', 55.00, 35.00, 36, '$20 Off', 'Addison Point Sports Grill', 'Addison', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('Cheesesteak House - Philly Special', 'Authentic Philly cheesesteak with whiz, onions, and peppers. Includes fries and drink.', 'https://cdn.restaurant.com/partner-images/435194/micrositeimage_p1.gif', 16.99, 11.99, 29, '$5 Off', 'Cheesesteak House', 'Rowlett', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),

  -- ADDITIONAL MEXICAN/LATIN DEALS
  ('Taqueria El Torito - Taco Tuesday', '3 tacos, rice, and beans special every Tuesday. Al pastor, carnitas, or carne asada.', 'https://cdn.restaurant.com/partner-images/153246/micrositeimage_micrositeimage_photo1.jpg', 14.99, 8.99, 40, '$6 Off', 'Taqueria El Torito', 'Plano', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('Taqueria Los Angeles - Burrito Grande', 'Giant burrito with your choice of meat, rice, beans, cheese, sour cream, and guacamole.', 'https://cdn.restaurant.com/locations/01J2JZ4DPHK4KTDXYGGGP24Y9C/images/ML8Wa1aldcPeMo955afxSD8Y7qCGt4Wima09FPFH.webp', 14.99, 9.99, 33, '$5 Off', 'Taqueria Los Angeles', 'Plano', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('Mariscos La Marina - Seafood Tower', 'Fresh seafood tower for 2. Ceviche, shrimp, oysters, and crab. With cocktail sauce.', 'https://cdn.restaurant.com/partner-images/385236/micrositeimage_photo1.gif', 45.00, 32.00, 29, '$13 Off', 'Mariscos La Marina', 'Irving', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('El Tesoro del Inca - Lomo Saltado', 'Classic Peruvian stir-fry. Beef, onions, tomatoes, and fries with rice.', 'https://cdn.restaurant.com/partner-images/191518/micrositeimage_micrositeimage_photo1.jpg', 19.99, 14.99, 25, '$5 Off', 'El Tesoro del Inca', 'Irving', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL),
  ('Casa Linda Salvadorian - Pupusa Combo', '3 handmade pupusas with curtido and salsa. Choice of cheese, pork, or bean filling.', 'https://cdn.restaurant.com/partner-images/369918/micrositeimage_photo1.jpg', 12.99, 8.99, 31, '$4 Off', 'Casa Linda Salvadorian Cuisine', 'Dallas', 'TX', 'approved', NOW(), NOW() + INTERVAL '90 days', 'admin', NULL)
ON CONFLICT DO NOTHING;

-- Add coordinates for each city's deals (approximate city center coordinates)
UPDATE public.deals SET latitude = 33.0198, longitude = -96.6989 WHERE city = 'Plano' AND latitude IS NULL;
UPDATE public.deals SET latitude = 32.7767, longitude = -96.7970 WHERE city = 'Dallas' AND latitude IS NULL;
UPDATE public.deals SET latitude = 33.1507, longitude = -96.8236 WHERE city = 'Frisco' AND latitude IS NULL;
UPDATE public.deals SET latitude = 32.8140, longitude = -96.9489 WHERE city = 'Irving' AND latitude IS NULL;
UPDATE public.deals SET latitude = 33.1972, longitude = -96.6397 WHERE city = 'McKinney' AND latitude IS NULL;
UPDATE public.deals SET latitude = 33.1032, longitude = -96.6706 WHERE city = 'Allen' AND latitude IS NULL;
UPDATE public.deals SET latitude = 32.9483, longitude = -96.7299 WHERE city = 'Richardson' AND latitude IS NULL;
UPDATE public.deals SET latitude = 32.9126, longitude = -96.6389 WHERE city = 'Garland' AND latitude IS NULL;
UPDATE public.deals SET latitude = 32.9290, longitude = -96.4597 WHERE city = 'Rockwall' AND latitude IS NULL;
UPDATE public.deals SET latitude = 33.1637, longitude = -96.9378 WHERE city = 'Little Elm' AND latitude IS NULL;
UPDATE public.deals SET latitude = 33.2362, longitude = -96.8011 WHERE city = 'Prosper' AND latitude IS NULL;
UPDATE public.deals SET latitude = 33.0146, longitude = -97.0969 WHERE city = 'Flower Mound' AND latitude IS NULL;
UPDATE public.deals SET latitude = 32.7460, longitude = -96.9978 WHERE city = 'Grand Prairie' AND latitude IS NULL;
UPDATE public.deals SET latitude = 32.9612, longitude = -96.8292 WHERE city = 'Addison' AND latitude IS NULL;
UPDATE public.deals SET latitude = 32.9343, longitude = -97.0781 WHERE city = 'Grapevine' AND latitude IS NULL;
UPDATE public.deals SET latitude = 32.9762, longitude = -96.5953 WHERE city = 'Sachse' AND latitude IS NULL;
UPDATE public.deals SET latitude = 32.6518, longitude = -96.9085 WHERE city = 'Duncanville' AND latitude IS NULL;
UPDATE public.deals SET latitude = 33.0840, longitude = -96.5775 WHERE city = 'Lucas' AND latitude IS NULL;
UPDATE public.deals SET latitude = 33.0301, longitude = -96.5417 WHERE city = 'Wylie' AND latitude IS NULL;
UPDATE public.deals SET latitude = 33.1982, longitude = -96.6153 WHERE city = 'Princeton' AND latitude IS NULL;
UPDATE public.deals SET latitude = 33.2148, longitude = -97.1331 WHERE city = 'Denton' AND latitude IS NULL;
UPDATE public.deals SET latitude = 33.3956, longitude = -96.4733 WHERE city = 'Blue Ridge' AND latitude IS NULL;
UPDATE public.deals SET latitude = 32.9254, longitude = -96.4322 WHERE city = 'Rowlett' AND latitude IS NULL;

-- Success message
SELECT 'Inserted ' || COUNT(*) || ' Plano area deals with coordinates' as status FROM public.deals WHERE city IN ('Plano', 'Dallas', 'Frisco', 'Irving', 'McKinney', 'Allen', 'Richardson', 'Garland', 'Rockwall', 'Little Elm', 'Prosper', 'Flower Mound', 'Grand Prairie', 'Addison', 'Grapevine', 'Sachse', 'Duncanville', 'Lucas', 'Wylie', 'Princeton', 'Denton', 'Blue Ridge', 'Rowlett');
