DO $$
BEGIN
  PERFORM menu.insert_restaurant_and_hours(
    'Eik1Mjk0IEJlbHQgTGluZSBSb2FkIHN1aXRlIDEwNSwgRGFsbGFzLCBUWCIlGiMKFgoUChIJkdedXjwhTIYRgj2ohiR6ZNUSCXN1aXRlIDEwNQ',
    'Addison',
    '9723543924',
    '5294 Belt Line Road, Suite 105',
    'Dallas',
    'TX',
    '75254',
    '{
      "Monday": {"open": "11:00", "close": "21:00"},
      "Tuesday": {"open": "11:00", "close": "21:00"},
      "Wednesday": {"open": "11:00", "close": "21:00"},
      "Thursday": {"open": "11:00", "close": "21:00"},
      "Friday": {"open": "11:00", "close": "21:00"},
      "Saturday": {"open": "11:00", "close": "21:00"},
      "Sunday": {"open": "11:00", "close": "21:00"}
    }'
  );

  PERFORM menu.insert_restaurant_and_hours(
    'ChIJyVuB7SOZToYRdrNSExLgAQc',
    'Downtown Dallas',
    '2143791490',
    '2000 Ross Ave',
    'Dallas',
    'TX',
    '75201',
    '{
      "Monday": {"open": "10:00", "close": "19:30"},
      "Tuesday": {"open": "10:00", "close": "19:30"},
      "Wednesday": {"open": "10:00", "close": "19:30"},
      "Thursday": {"open": "10:00", "close": "19:30"},
      "Friday": {"open": "10:00", "close": "19:30"}
    }'
  );

  PERFORM menu.insert_restaurant_and_hours(
    'ChIJkXooua88TIYRPzm0F5AvSs4',
    'Plano',
    '2144405788',
    '7700 Windrose Avenue',
    'Plano',
    'TX',
    '75024',
    '{
      "Monday": {"open": "11:00", "close": "21:00"},
      "Tuesday": {"open": "11:00", "close": "21:00"},
      "Wednesday": {"open": "11:00", "close": "21:00"},
      "Thursday": {"open": "11:00", "close": "21:00"},
      "Friday": {"open": "11:00", "close": "21:00"},
      "Saturday": {"open": "11:00", "close": "21:00"},
      "Sunday": {"open": "11:00", "close": "21:00"}
    }'
  );

  PERFORM menu.insert_restaurant_and_hours(
    'ChIJ-8cuV50gTIYRhrGIzNlrxWU',
    'Preston Hollow',
    '9723549386',
    '10720 Preston Road',
    'Dallas',
    'TX',
    '75230',
    '{
      "Monday": {"open": "11:00", "close": "21:00"},
      "Tuesday": {"open": "11:00", "close": "21:00"},
      "Wednesday": {"open": "11:00", "close": "21:00"},
      "Thursday": {"open": "11:00", "close": "21:00"},
      "Friday": {"open": "11:00", "close": "21:00"},
      "Saturday": {"open": "11:00", "close": "21:00"},
      "Sunday": {"open": "11:00", "close": "21:00"}
    }'
  );

  PERFORM menu.insert_restaurant_and_hours(
    'ChIJdZ0EXtSeToYRt1ePNBG-Odw',
    'West Village',
    '9729932792',
    '3700 McKinney Avenue',
    'Dallas',
    'TX',
    '75204',
    '{
      "Monday": {"open": "11:00", "close": "21:00"},
      "Tuesday": {"open": "11:00", "close": "21:00"},
      "Wednesday": {"open": "11:00", "close": "21:00"},
      "Thursday": {"open": "11:00", "close": "21:00"},
      "Friday": {"open": "11:00", "close": "21:00"},
      "Saturday": {"open": "11:00", "close": "21:00"},
      "Sunday": {"open": "11:00", "close": "21:00"}
    }'
  );

  PERFORM menu.insert_restaurant_and_hours(
    'ChIJ3Rc39bNqkFQRY1u-FyfO2uA',
    'Downtown (Rainier Square)',
    '2067411329',
    '1350 4th Ave',
    'Seattle',
    'WA',
    '98101',
    '{
      "Monday": {"open": "11:00", "close": "19:30"},
      "Tuesday": {"open": "11:00", "close": "19:30"},
      "Wednesday": {"open": "11:00", "close": "19:30"},
      "Thursday": {"open": "11:00", "close": "19:30"},
      "Friday": {"open": "11:00", "close": "19:30"},
      "Saturday": {"open": "11:00", "close": "19:30"},
      "Sunday": {"open": "11:00", "close": "19:30"}
    }'
  );

  PERFORM menu.insert_restaurant_and_hours(
    'ChIJDVwrH0oVkFQRjVs7ZPR5AcU',
    'South Lake Union',
    '2065082374',
    '2118 Westlake Ave',
    'Seattle',
    'WA',
    '98121',
    '{
      "Monday": {"open": "11:00", "close": "21:00"},
      "Tuesday": {"open": "11:00", "close": "21:00"},
      "Wednesday": {"open": "11:00", "close": "21:00"},
      "Thursday": {"open": "11:00", "close": "21:00"},
      "Friday": {"open": "11:00", "close": "21:00"},
      "Saturday": {"open": "11:00", "close": "21:00"},
      "Sunday": {"open": "11:00", "close": "21:00"}
    }'
  );

  REFRESH MATERIALIZED VIEW menu.location_view;
END $$;

-- #region CATEGORIES
INSERT INTO menu.categories
  (
    "category_id",
    "sort_order",
    "name",
    "menu_description",
    "order_description",
    "created_at",
    "updated_at"
  ) 
VALUES
  (
    DEFAULT,
    0,
    'chef''s creations',
    '{"We''re committed to continuously evolving our menu so that we''re always WOW-ing our guests with new unexpected flavor combinations. Be sure to check back to discover our Chef''s latest innovations."}',
    null,
    NOW(),
    NOW()
  ),
  (
    DEFAULT,
    1,
    'cheffy sandwiches',
    '{"Sandwiches with the “RGF” symbol can be requested Gluten Free by substituting GF bread."}',
    '{"Sandwiches with the “RGF” symbol can be requested Gluten Free by substituting GF bread."}',
    NOW(),
    NOW()
  ),
  (
    DEFAULT,
    2,
    'bowls',
    null,
    null,
    NOW(),
    NOW()
  ),
  (
    DEFAULT,
    3,
    'soulful salads',
    null,
    '{"In order to keep your salad fresh, all dressings will be provided on the side."}',
    NOW(),
    NOW()
  ),
  (
    DEFAULT,
    4,
    '1/2 sandwich combos',
    '{"Half sandwich paired with a deli side or cup of soup.", "Pick from two sizes: Small Deli Side | Medium Deli Side or Soup.", "Items with the “RGF” symbol can be requested Gluten Free by substituting GF bread."}',
    '{"Half sandwich paired with a deli side or cup of soup.", "Pick from two sizes: Small Deli Side | Medium Deli Side or Soup.", "Items with the “RGF” symbol can be requested Gluten Free by substituting GF bread."}',
    NOW(),
    NOW()
  ),
  (
    DEFAULT,
    5,
    'kids',
    '{"RECOMMENDED FOR KIDS 8 & UNDER.", "Served with a kids beverage and sliced apples (organic milk add 2.45)."}',
    '{"Served with a kids beverage and sliced apples (organic milk add 2.45)."}',
    NOW(),
    NOW()
  ),
  (DEFAULT, 6, 'deli sides & soups', null, null, NOW(), NOW()),
  (DEFAULT, 7, 'cookies', null, null, NOW(), NOW()),
  (DEFAULT, 8, 'chips', null, null, NOW(), NOW()),
  (DEFAULT, 9, 'beverages', null, null, NOW(), NOW()),
  (DEFAULT, 10, 'marketplace', null, null, NOW(), NOW());
-- #endregion

-- #region TAGS
INSERT INTO menu.tags
  (
    "tag_id",
    "name",
    "description",
    "created_at",
    "updated_at"
  )
VALUES
  (DEFAULT, 'V', 'Vegan', NOW(), NOW()),
  (DEFAULT, 'VG', 'Vegeterian', NOW(), NOW()),
  (DEFAULT, 'GF', 'Gluten-Free', NOW(), NOW()),
  (DEFAULT, 'RGF', 'Can be Requested Gluten-Free', NOW(), NOW()),
  (DEFAULT, 'N', 'Contains Nuts', NOW(), NOW());
-- #endregion

-- #region SANDWICHES
DO $$ 
DECLARE
  creations_id INTEGER := 1;
  sandwiches_id INTEGER := 2;
  combos_id INTEGER := 5;
  foodie VARCHAR := 'foodie favorites';
  classics VARCHAR := 'craveable classics';
  v_id INTEGER := 1;
  vg_id INTEGER := 2;
  gf_id INTEGER := 3;
  rgf_id INTEGER := 4;
  n_id INTEGER := 5;
  id INTEGER;
  item_id INTEGER;
  base_id INTEGER;
  dressing_id INTEGER;
  salad_style_id INTEGER;
  gluten_free_option_id INTEGER;
  gluten_free_bread_id INTEGER;
  side_id INTEGER;
  sm_side_id INTEGER;
  md_side_id INTEGER;
  soup_id INTEGER;
  side_option_id INTEGER;
  soup_option_id INTEGER;
  bread_prep_id INTEGER;
  bread_id INTEGER;
  change_bread_id INTEGER;
  bread_option_id INTEGER;
  customize_id INTEGER;
  sauce_option_id INTEGER;
  protein_id INTEGER;
  cheese_id INTEGER;
  accent_id INTEGER;
  produce_id INTEGER;
  premium_id INTEGER;
BEGIN
  base_id := menu.insert_modifiers_and_options(
    'Choose your salad base',
    NULL,
    NULL,
    TRUE,
    1,
    1,
    0,
    ARRAY[
      '{"name": "Kale & Chopped Romaine", "price": null}',
      '{"name": "Mixed Greens & Chopped Romaine", "price": null}',
      '{"name": "Chopped Romaine", "price": null}',
      '{"name": "Spinach", "price": null}',
      '{"name": "Mixed Greens", "price": null}'
    ]::JSONB[]
  );

  dressing_id := menu.insert_modifiers_and_options(
    'Dressing Options (on the side)',
    NULL,
    NULL,
    TRUE,
    1,
    1,
    0,
    ARRAY[
      '{"name": "Caesar Dressing", "price": null}',
      '{"name": "Chipotle Vinaigrette", "price": null}',
      '{"name": "Citrus Vinaigrette", "price": null}',
      '{"name": "Miso Mustard Sesame (G)", "price": null}',
      '{"name": "Vegan Ranch Dressing", "price": null}',
      '{"name": "Vegan Chipotle Ranch", "price": null}',
      '{"name": "Oil", "price": null}',
      '{"name": "Vinegar", "price": null}',
      '{"name": "Oil & Vinegar", "price": null}',
      '{"name": "No Dressing", "price": null}'
    ]::JSONB[]
  );

  salad_style_id := menu.insert_modifier_group('Salad Style', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_group_parent(salad_style_id, base_id, NULL);
  PERFORM menu.insert_modifier_group_parent(salad_style_id, dressing_id, NULL);

  gluten_free_option_id := menu.insert_modifiers_and_options(
    'Do you have a gluten allergy?',
    NULL,
    NULL,
    TRUE,
    1,
    1,
    0,
    ARRAY[
      '{"name": "Yes, I do", "price": null}',
      '{"name": "No. Gluten-free is just a preference", "price": null}'
    ]::JSONB[]
  );

  gluten_free_bread_id := menu.insert_modifier_group('Gluten Free Bread (Toasted)', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_group_parent(gluten_free_bread_id, gluten_free_option_id, NULL);

  side_id := menu.insert_modifier_group('Choose your side', TRUE, 1, 1, 0);

  sm_side_id := menu.insert_modifier_group('Small Deli Side', TRUE, 1, 1, 0);
  md_side_id := menu.insert_modifier_group('Medium Deli Side', TRUE, 1, 1, 0);
  soup_id := menu.insert_modifier_group('Cup of Soup', TRUE, 1, 1, 0);

  PERFORM menu.insert_modifier_group_parent(side_id, sm_side_id, 13.05);
  PERFORM menu.insert_modifier_group_parent(side_id, md_side_id, 14.40);
  PERFORM menu.insert_modifier_group_parent(side_id, soup_id, 14.40);

  side_option_id := menu.insert_modifiers_and_options(
    'Choose your deli side',
    NULL,
    NULL,
    TRUE,
    1,
    1,
    0,
    ARRAY[
      '{"name": "Kale & Apple Rainbow Salad", "price": null}',
      '{"name": "Spicy Curried Couscous", "price": null}',
      '{"name": "Pickles & Dill Potato Salad", "price": null}',
      '{"name": "Dan Dan Noodle Salad", "price": null}',
      '{"name": "Basil Pesto Shells", "price": null}'
    ]::JSONB[]
  );

  soup_option_id := menu.insert_modifiers_and_options(
    'Choose your soup',
    NULL,
    NULL,
    TRUE,
    1,
    1,
    0,
    ARRAY[
      '{"name": "Tomato Basil Soup", "price": null}',
      '{"name": "Greek Lemon Chicken & Farro Soup", "price": null}'
    ]::JSONB[]
  );

  PERFORM menu.insert_modifier_group_parent(sm_side_id, side_option_id, NULL);
  PERFORM menu.insert_modifier_group_parent(md_side_id, side_option_id, NULL);
  PERFORM menu.insert_modifier_group_parent(soup_id, soup_option_id, NULL);

  bread_prep_id := menu.insert_modifiers_and_options(
    'Choose Bread Prep',
    NULL,
    NULL,
    TRUE,
    1,
    1,
    0,
    ARRAY[
      '{"name": "Fresh (Not Toasted)", "price": null}',
      '{"name": "Panini", "price": null}',
      '{"name": "Toasted", "price": null}'
    ]::JSONB[]
  );

  bread_id := menu.insert_modifier_group('Bread Choices', TRUE, 1, 1, 0);

  id := menu.insert_modifier_group('Ciabatta (V)', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_group_parent(id, bread_prep_id, NULL);
  PERFORM menu.insert_modifier_group_parent(bread_id, id, NULL);

  id := menu.insert_modifier_group('Mom''s Seeded Honey Whole Wheat', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_group_parent(id, bread_prep_id, NULL);
  PERFORM menu.insert_modifier_group_parent(bread_id, id, NULL);

  id := menu.insert_modifier_group('Sourdough', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_group_parent(id, bread_prep_id, NULL);
  PERFORM menu.insert_modifier_group_parent(bread_id, id, NULL);

  bread_prep_id := menu.insert_modifiers_and_options(
    'Choose Bread Prep',
    NULL,
    NULL,
    TRUE,
    1,
    1,
    0,
    ARRAY[
      '{"name": "Fresh (Not Toasted)", "price": null}',
      '{"name": "Toasted", "price": null}'
    ]::JSONB[]
  );

  id := menu.insert_modifier_group('Potato Roll', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_group_parent(id, bread_prep_id, NULL);
  PERFORM menu.insert_modifier_group_parent(bread_id, id, NULL);

  id := menu.insert_modifier_group('Sesame Roll (V)', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_group_parent(id, bread_prep_id, NULL);
  PERFORM menu.insert_modifier_group_parent(bread_id, id, NULL);

  PERFORM menu.insert_modifier_group_parent(bread_id, gluten_free_bread_id, NULL);
  PERFORM menu.insert_modifier_option(bread_id, 'Tortilla (V)', NULL, 'available', FALSE);

  PERFORM menu.insert_modifier_group_parent(bread_id, salad_style_id, 2.30);

  change_bread_id := menu.insert_modifier_group('Change Chef''s Recommended Bread', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_group_parent(change_bread_id, bread_id, NULL);

  item_id := menu.insert_item(
    0,
    TRUE,
    'Hot Honey Peach & Prosciutto',
    'Italian prosciutto & sliced peaches with fresh mozzarella, crushed honey roasted almonds, Calabrian chili aioli, hot peach honey, arugula (700 cal) on a toasted sesame roll (300 cal)',
    'PeachProsciutto',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, creations_id, NULL);
  PERFORM menu.insert_item_price(item_id, 15.96);
  PERFORM menu.insert_item_tag(item_id, rgf_id);
  PERFORM menu.insert_item_tag(item_id, n_id);

  customize_id := menu.insert_modifiers_and_options(
    'Change It Up',
    NULL,
    NULL,
    FALSE,
    0,
    9,
    0,
    ARRAY[
      '{"name": "Extra Italian Prosciutto", "price": 2.50}',
      '{"name": "No Italian Prosciutto", "price": null}',
      '{"name": "No Mozzorella", "price": null}',
      '{"name": "No Arugula", "price": null}',
      '{"name": "No Honey Roasted Almonds", "price": null}',
      '{"name": "Honey Roasted Almonds (on the side)", "price": null}',
      '{"name": "No Peaches", "price": null}',
      '{"name": "No Calabrian Chili Aioli", "price": null}',
      '{"name": "No Hot Peach Honey", "price": null}'
    ]::JSONB[]
  );

  bread_option_id := menu.insert_modifier_group('Chef''s Recommended Bread', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_option(bread_option_id, 'Toasted Sesame Roll', NULL, 'available', TRUE);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, gluten_free_bread_id, 2.36);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, change_bread_id, NULL);

  PERFORM menu.insert_item_modifier(item_id, bread_option_id, 0);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 1);

  item_id := menu.insert_item(
    2,
    TRUE,
    'The Happy Hippie',
    'Avocado, cucumber, carrots, Kumato tomatoes, beet caviar, sprouts, hummus, white cheddar, cucumber dill ranch (620 cal) on toasted Mom''s seeded honey whole wheat (320 cal)',
    'HappyHippie',
    'want to make it vegan? Remove the white cheddar and request ciabatta bread'
  );

  PERFORM menu.insert_items_categories(item_id, creations_id, NULL);
  PERFORM menu.insert_item_price(item_id, 14.89);
  PERFORM menu.insert_item_tag(item_id, vg_id);
  PERFORM menu.insert_item_tag(item_id, rgf_id);

  customize_id := menu.insert_modifiers_and_options(
    'Change It Up',
    NULL,
    NULL,
    FALSE,
    0,
    11,
    0,
    ARRAY[
      '{"name": "Extra Avocado", "price": 1.00}',
      '{"name": "No Avocado", "price": null}',
      '{"name": "No Beet Caviar", "price": null}',
      '{"name": "No Sprouts", "price": null}',
      '{"name": "No Carrots", "price": null}',
      '{"name": "No Cucumber Dill Ranch", "price": null}',
      '{"name": "No Hummus", "price": null}',
      '{"name": "No Julienne Cucumbers", "price": null}',
      '{"name": "No Kumato Tomatoes ", "price": null}',
      '{"name": "No Vegan Aioli", "price": null}',
      '{"name": "No White Cheddar Cheese", "price": null}'
    ]::JSONB[]
  );

  bread_option_id := menu.insert_modifier_group('Chef''s Recommended Bread', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_option(bread_option_id, 'Toasted Mom''s Seeded Honey Whole Wheat', NULL, 'available', TRUE);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, gluten_free_bread_id, 2.36);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, change_bread_id, NULL);

  PERFORM menu.insert_item_modifier(item_id, bread_option_id, 0);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 1);

  item_id := menu.insert_item(
    7,
    TRUE,
    'November to Remember',
    'Warm carved turkey, mushroom-turkey sausage stuffing, spicy cranberry chutney, mozzarella cheese, herb aioli, shredded romaine (870 cal) on toasted cranberry walnut wheat (320 cal)',
    'Nov2Remember',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, creations_id, NULL);
  PERFORM menu.insert_item_price(item_id, 16.04);
  PERFORM menu.insert_item_tag(item_id, n_id);

  customize_id := menu.insert_modifiers_and_options(
    'Change It Up',
    NULL,
    NULL,
    FALSE,
    0,
    12,
    0,
    ARRAY[
      '{"name": "Extra Turkey", "price": 2.27}',
      '{"name": "No Turkey", "price": null}',
      '{"name": "Extra Stuffing", "price": 1.15}',
      '{"name": "No Stuffing", "price": null}',
      '{"name": "No Herb Aioli", "price": null}',
      '{"name": "Lite Herb Aioli", "price": null}',
      '{"name": "Herb Aioli (on the side)", "price": null}',
      '{"name": "No Cranberry Chutney", "price": null}',
      '{"name": "Lite Cranberry Chutney", "price": null}',
      '{"name": "Cranberry Chutney (on the side)", "price": null}',
      '{"name": "No Romaine", "price": null}',
      '{"name": "No Mozzarella", "price": null}'
    ]::JSONB[]
  );

  bread_option_id := menu.insert_modifier_group('Chef''s Recommended Bread', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_option(bread_option_id, 'Toasted Cranberry Walnut Bread', NULL, 'available', TRUE);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, gluten_free_bread_id, 2.36);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, change_bread_id, NULL);

  PERFORM menu.insert_item_modifier(item_id, bread_option_id, 0);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 1);

  item_id := menu.insert_item(
    5,
    TRUE,
    'Philly Shroomsteak',
    'Naturally meaty Fable shiitake steak, roasted red peppers & sweet onions, choice of hot or mild giardiniera, plant-based American cheese, green peppercorn aioli (817 cal) on a toasted sesame roll (300 cal)',
    'Shroomsteak',
    '*available at select locations*'
  );

  PERFORM menu.insert_items_categories(item_id, creations_id, NULL);
  PERFORM menu.insert_item_price(item_id, 18.34);
  PERFORM menu.insert_item_tag(item_id, v_id);

  customize_id := menu.insert_modifiers_and_options(
    'Choose Giardiniera',
    NULL,
    NULL,
    TRUE,
    1,
    1,
    0,
    ARRAY[
      '{"name": "Hot Giardiniera", "price": null}',
      '{"name": "Mild Giardiniera", "price": null}',
      '{"name": "No Giardiniera", "price": null}'
    ]::JSONB[]
  );

  bread_option_id := menu.insert_modifier_group('Chef''s Recommended Bread', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_option(bread_option_id, 'Toasted Sesame Roll (Vegan)', NULL, 'available', TRUE);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, gluten_free_bread_id, 2.36);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, change_bread_id, NULL);

  PERFORM menu.insert_item_modifier(item_id, bread_option_id, 0);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 1);

  item_id := menu.insert_item(
    0,
    TRUE,
    '“Not So Fried” Chicken',
    'Shaved, roasted chicken breast topped with Mendo''s krispies, herb aioli, mustard pickle slaw, tomatoes, pickled red onions (640 cal) on toasted ciabatta (260 cal) with a side of tangy mustard barbeque sauce (80 cal) or mustard pickle remoulade (120 cal)',
    'NotSoFriedChicken',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, sandwiches_id, foodie);
  PERFORM menu.insert_item_price(item_id, 15.35);
  PERFORM menu.insert_item_tag(item_id, gf_id);

  customize_id := menu.insert_modifiers_and_options(
    'Change It Up',
    NULL,
    NULL,
    FALSE,
    0,
    12,
    0,
    ARRAY[
      '{"name": "Extra Chicken", "price": 2.27}',
      '{"name": "Add Avocado", "price": 2.42}',
      '{"name": "Add Bacon", "price": 3.05}',
      '{"name": "No Mendo''s Krispies (G)", "price": null}',
      '{"name": "No Tomatoes", "price": null}',
      '{"name": "No Pickled Red Onions", "price": null}',
      '{"name": "Pickled Red Onions (on the side)", "price": null}',
      '{"name": "No Pickle Slaw (G)", "price": null}',
      '{"name": "Pickled Slaw (G) (on the side)", "price": null}',
      '{"name": "Lite Herb Aioli", "price": null}',
      '{"name": "No Herb Aioli", "price": null}',
      '{"name": "Herb Aioli (on the side)", "price": null}'
    ]::JSONB[]
  );

  sauce_option_id := menu.insert_modifiers_and_options(
    'Chef''s Recommended Sauces',
    NULL,
    NULL,
    TRUE,
    1,
    2,
    0,
    ARRAY[
      '{"name": "Tangy Mustard BBQ Sauce", "price": null}',
      '{"name": "Mustard Remoulade (G)", "price": null}'
    ]::JSONB[]
  );

  bread_option_id := menu.insert_modifier_group('Chef''s Recommended Bread', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_option(bread_option_id, 'Toasted Ciabatta (V)', NULL, 'available', TRUE);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, gluten_free_bread_id, 2.36);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, change_bread_id, NULL);

  PERFORM menu.insert_item_modifier(item_id, bread_option_id, 0);
  PERFORM menu.insert_item_modifier(item_id, sauce_option_id, 1);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 2);

  item_id := menu.insert_item(
    0,
    TRUE,
    '1/2 “Not So Fried” Chicken',
    'Shaved, roasted chicken breast topped with Mendo''s krispies, herb aioli, mustard pickle slaw, tomatoes, pickled red onions on toasted ciabatta (450 cal) with a side of tangy mustard barbecue sauce (80 cal) or mustard pickle remoulade (120 cal)',
    'BPNotSoFriedChicken',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, combos_id, NULL);

  bread_option_id := menu.insert_modifier_group('Chef''s Recommended Bread', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_option(bread_option_id, 'Toasted Ciabatta (V)', NULL, 'available', TRUE);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, gluten_free_bread_id, 1.15);

  PERFORM menu.insert_item_modifier(item_id, bread_option_id, 0);
  PERFORM menu.insert_item_modifier(item_id, side_id, 1);
  PERFORM menu.insert_item_modifier(item_id, sauce_option_id, 2);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 3);

  item_id := menu.insert_item(
    3,
    TRUE,
    'Chicken Pesto Caprese',
    'Shaved, roasted chicken breast, fresh mozzarella, marinated red peppers, basil pesto, mixed greens, balsamic glaze drizzle (600 cal) on panini-pressed ciabatta (260 cal)',
    'ChickenPestoCaprese',
    'Want to make it vegetarian? Swap the chicken for extra mozzarella'
  );

  PERFORM menu.insert_items_categories(item_id, sandwiches_id, classics);
  PERFORM menu.insert_item_price(item_id, 14.20);
  PERFORM menu.insert_item_tag(item_id, rgf_id);

  customize_id := menu.insert_modifiers_and_options(
    'Change It Up',
    NULL,
    NULL,
    FALSE,
    0,
    8,
    0,
    ARRAY[
      '{"name": "Extra Chicken", "price": 2.27}',
      '{"name": "No Balsamic Glaze", "price": null}',
      '{"name": "Basil Pesto (on the side)", "price": null}',
      '{"name": "Lite Basil Pesto", "price": null}',
      '{"name": "No Basic Pesto", "price": null}',
      '{"name": "No Mixed Greens", "price": null}',
      '{"name": "No Mozzarella", "price": null}',
      '{"name": "No Red Peppers", "price": null}'
    ]::JSONB[]
  );

  bread_option_id := menu.insert_modifier_group('Chef''s Recommended Bread', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_option(bread_option_id, 'Panini Pressed Ciabatta (V)', NULL, 'available', TRUE);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, gluten_free_bread_id, 2.36);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, change_bread_id, NULL);

  PERFORM menu.insert_item_modifier(item_id, bread_option_id, 0);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 1);

  item_id := menu.insert_item(
    3,
    TRUE,
    '1/2 Chicken Pesto Caprese',
    'Shaved, roasted chicken breast, fresh mozzarella, marinated red peppers, basil pesto, mixed greens, balsamic glaze drizzle on panini-pressed ciabatta (430 cal)',
    'BPChickenPestoCaprese',
    'Want to make it vegetarian? Swap the chicken for extra mozzarella'
  );

  PERFORM menu.insert_items_categories(item_id, combos_id, NULL);
  PERFORM menu.insert_item_tag(item_id, rgf_id);

  bread_option_id := menu.insert_modifier_group('Chef''s Recommended Bread', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_option(bread_option_id, 'Panini Pressed Ciabatta (V)', NULL, 'available', TRUE);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, gluten_free_bread_id, 1.15);

  PERFORM menu.insert_item_modifier(item_id, bread_option_id, 0);
  PERFORM menu.insert_item_modifier(item_id, side_id, 1);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 2);

  item_id := menu.insert_item(
    2,
    TRUE,
    'The Farm Club',
    'Shaved, roasted turkey breast, smashed avocado, applewood smoked bacon, herb aioli, tomatoes, mixed greens, pickled red onions (440 cal) on Mom''s seeded honey whole wheat (320 cal)',
    'FarmClub',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, sandwiches_id, classics);
  PERFORM menu.insert_item_price(item_id, 15.24);
  PERFORM menu.insert_item_tag(item_id, rgf_id);

  customize_id := menu.insert_modifiers_and_options(
    'Change It Up',
    NULL,
    NULL,
    FALSE,
    0,
    10,
    0,
    ARRAY[
      '{"name": "Extra Turkey", "price": 2.27}',
      '{"name": "Herb Aioli (on the side)", "price": null}',
      '{"name": "Lite Herb Aioli", "price": null}',
      '{"name": "No Herb Aioli", "price": null}',
      '{"name": "No Avocado", "price": null}',
      '{"name": "No Bacon", "price": null}',
      '{"name": "No Farm Greens", "price": null}',
      '{"name": "No Pickled Onions", "price": null}',
      '{"name": "No Tomato", "price": null}',
      '{"name": "No Turkey", "price": null}'
    ]::JSONB[]
  );

  bread_option_id := menu.insert_modifier_group('Chef''s Recommended Bread', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_option(bread_option_id, 'Original Mom''s Seeded Honey Whole Wheat', NULL, 'available', TRUE);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, gluten_free_bread_id, 2.36);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, change_bread_id, NULL);

  PERFORM menu.insert_item_modifier(item_id, bread_option_id, 0);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 1);

  item_id := menu.insert_item(
    2,
    TRUE,
    '1/2 The Farm Club',
    'Shaved, roasted turkey breast, smashed avocado, applewood smoked bacon, herb aioli, tomatoes, mixed greens, pickled red onions (440 cal) on Mom''s seeded honey whole wheat (320 cal)',
    'BPFarmClub',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, combos_id, NULL);
  PERFORM menu.insert_item_tag(item_id, rgf_id);

  bread_option_id := menu.insert_modifier_group('Chef''s Recommended Bread', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_option(bread_option_id, 'Original Mom''s Seeded Honey Whole Wheat', NULL, 'available', TRUE);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, gluten_free_bread_id, 1.15);

  PERFORM menu.insert_item_modifier(item_id, bread_option_id, 0);
  PERFORM menu.insert_item_modifier(item_id, side_id, 1);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 2);

  item_id := menu.insert_item(
    6,
    TRUE,
    'Vegan Banh Mi',
    'Organic marinated, baked tofu with vegan aioli, sweet chili sauce, pickled daikon & carrots, cucumbers, jalapeños, Thai basil, cilantro (390 cal) on panini-pressed ciabatta (260 cal)',
    'VeganBahnMi',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, sandwiches_id, foodie);
  PERFORM menu.insert_item_price(item_id, 13.92);
  PERFORM menu.insert_item_tag(item_id, v_id);
  PERFORM menu.insert_item_tag(item_id, rgf_id);

  customize_id := menu.insert_modifiers_and_options(
    'Change It Up',
    NULL,
    NULL,
    FALSE,
    0,
    11,
    0,
    ARRAY[
      '{"name": "Add Avocado", "price": 2.42}',
      '{"name": "No Cilantro", "price": null}',
      '{"name": "No Cucumbers", "price": null}',
      '{"name": "Jalapenos (on the side)", "price": null}',
      '{"name": "Extra Jalapenos", "price": null}',
      '{"name": "No Jalapenos", "price": null}',
      '{"name": "Vegan Aioli (on the side)", "price": null}',
      '{"name": "Lite Vegan Aioli", "price": null}',
      '{"name": "No Vegan Aioli", "price": null}',
      '{"name": "Sweet Chili Sauce (on the side)", "price": null}',
      '{"name": "No Sweet Chili Sauce", "price": null}'
    ]::JSONB[]
  );

  bread_option_id := menu.insert_modifier_group('Chef''s Recommended Bread', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_option(bread_option_id, 'Panini Pressed Ciabatta (V)', NULL, 'available', TRUE);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, gluten_free_bread_id, 2.36);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, change_bread_id, NULL);

  PERFORM menu.insert_item_modifier(item_id, bread_option_id, 0);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 1);

  item_id := menu.insert_item(
    6,
    TRUE,
    '1/2 Vegan Banh Mi',
    'Organic marinated, baked tofu with vegan aioli, sweet chili sauce, pickled daikon & carrots, cucumbers, jalapeños, Thai basil, cilantro (390 cal) on panini-pressed ciabatta (260 cal)',
    'BPVeganBanhMi',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, combos_id, NULL);
  PERFORM menu.insert_item_tag(item_id, v_id);
  PERFORM menu.insert_item_tag(item_id, rgf_id);

  bread_option_id := menu.insert_modifier_group('Chef''s Recommended Bread', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_option(bread_option_id, 'Panini Pressed Ciabatta (V)', NULL, 'available', TRUE);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, gluten_free_bread_id, 1.15);

  PERFORM menu.insert_item_modifier(item_id, bread_option_id, 0);
  PERFORM menu.insert_item_modifier(item_id, side_id, 1);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 2);

  item_id := menu.insert_item(
    4,
    FALSE,
    'Vegetarian Pesto Caprese',
    'Fresh mozzarella, marinated red peppers, basil pesto, mixed greens, balsamic glaze drizzle (600 cal) on panini-pressed ciabatta (260 cal)',
    'VegetarianCapreseSandwich',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, sandwiches_id, classics);
  PERFORM menu.insert_item_price(item_id, 14.20);
  PERFORM menu.insert_item_tag(item_id, vg_id);
  PERFORM menu.insert_item_tag(item_id, rgf_id);

  customize_id := menu.insert_modifiers_and_options(
    'Change It Up',
    NULL,
    NULL,
    FALSE,
    0,
    6,
    0,
    ARRAY[
      '{"name": "No Balsamic Glaze", "price": null}',
      '{"name": "Basil Pesto (on the side)", "price": null}',
      '{"name": "Lite Basil Pesto", "price": null}',
      '{"name": "No Basic Pesto", "price": null}',
      '{"name": "No Mixed Greens", "price": null}',
      '{"name": "No Red Peppers", "price": null}'
    ]::JSONB[]
  );

  bread_option_id := menu.insert_modifier_group('Chef''s Recommended Bread', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_option(bread_option_id, 'Panini Pressed Ciabatta (V)', NULL, 'available', TRUE);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, gluten_free_bread_id, 2.36);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, change_bread_id, NULL);

  PERFORM menu.insert_item_modifier(item_id, bread_option_id, 0);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 1);

  item_id := menu.insert_item(
    4,
    FALSE,
    '1/2 Vegetarian Pesto Caprese Sandwich',
    'Fresh mozzarella, marinated red peppers, basil pesto, mixed greens, balsamic glaze drizzle (600 cal) on panini-pressed ciabatta (260 cal)',
    'BPVegetarianCapreseSandwich',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, combos_id, NULL);
  PERFORM menu.insert_item_tag(item_id, vg_id);
  PERFORM menu.insert_item_tag(item_id, rgf_id);

  bread_option_id := menu.insert_modifier_group('Chef''s Recommended Bread', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_option(bread_option_id, 'Panini Pressed Ciabatta (V)', NULL, 'available', TRUE);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, gluten_free_bread_id, 1.15);

  PERFORM menu.insert_item_modifier(item_id, bread_option_id, 0);
  PERFORM menu.insert_item_modifier(item_id, side_id, 1);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 2);

  item_id := menu.insert_item(
    5,
    TRUE,
    'Turkey Avo Salsa Verde',
    'Shaved, roasted turkey breast, smashed avocado, smoked gouda, cotija cheese, Mama Lil''s sweet hot peppers, jalapeño salsa aioli, tomatoes, shredded romaine, red onions (580 cal) on panini-pressed sourdough (300 cal) served with a side of jalapeño salsa verde (20 cal)',
    'TurkeyAvoSalsaVerde',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, sandwiches_id, classics);
  PERFORM menu.insert_item_price(item_id, 15.01);
  PERFORM menu.insert_item_tag(item_id, rgf_id);

  customize_id := menu.insert_modifiers_and_options(
    'Change It Up',
    NULL,
    NULL,
    FALSE,
    0,
    11,
    0,
    ARRAY[
      '{"name": "Extra Turkey", "price": 2.27}',
      '{"name": "No Avocado", "price": null}',
      '{"name": "No Cotija Cheese", "price": null}',
      '{"name": "No Jalapeno Salsa Aioli", "price": null}',
      '{"name": "No Mama Lil''s Peppers", "price": null}',
      '{"name": "No Shredded Romaine", "price": null}',
      '{"name": "No Smoked Gouda", "price": null}',
      '{"name": "No Tomato", "price": null}',
      '{"name": "No Side Salsa Verde", "price": null}',
      '{"name": "No Red Onions", "price": null}',
      '{"name": "No Turkey", "price": null}',
      '{"name": "Add Jalapenos", "price": null}'
    ]::JSONB[]
  );

  bread_option_id := menu.insert_modifier_group('Chef''s Recommended Bread', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_option(bread_option_id, 'Panini Pressed Sourdough', NULL, 'available', TRUE);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, gluten_free_bread_id, 2.36);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, change_bread_id, NULL);

  PERFORM menu.insert_item_modifier(item_id, bread_option_id, 0);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 1);

  item_id := menu.insert_item(
    5,
    TRUE,
    '1/2 Turkey Avo Salsa Verde',
    'Shaved, roasted turkey breast, smashed avocado, smoked gouda, cotija cheese, Mama Lil''s sweet hot peppers, jalapeño salsa aioli, tomatoes, shredded romaine, red onions on on panini-pressed sourdough (420 cal)',
    'BPTurkeyAvo',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, combos_id, NULL);
  PERFORM menu.insert_item_tag(item_id, rgf_id);

  bread_option_id := menu.insert_modifier_group('Chef''s Recommended Bread', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_option(bread_option_id, 'Panini Pressed Sourdough', NULL, 'available', TRUE);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, gluten_free_bread_id, 1.15);

  PERFORM menu.insert_item_modifier(item_id, bread_option_id, 0);
  PERFORM menu.insert_item_modifier(item_id, side_id, 1);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 2);

  item_id := menu.insert_item(
    1,
    TRUE,
    'Italian Roast Beef',
    'Shaved roast beef, sliced mozzarella, Chicago-style mild giardiniera, tomatoes, sweet onion, shredded romaine, Italian herb & cheese aioli (620 cal) on a toasted sesame roll (300 cal)',
    'ItalianRoastBeef',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, sandwiches_id, classics);
  PERFORM menu.insert_item_price(item_id, 16.96);
  PERFORM menu.insert_item_tag(item_id, rgf_id);

  customize_id := menu.insert_modifiers_and_options(
    'Change It Up',
    NULL,
    NULL,
    FALSE,
    0,
    8,
    0,
    ARRAY[
      '{"name": "Extra Roast Beef", "price": 3.42}',
      '{"name": "No Mozzarella", "price": null}',
      '{"name": "No Chicago-Style Giadiniera", "price": null}',
      '{"name": "No Tomatoes", "price": null}',
      '{"name": "No Vidalia Onion", "price": null}',
      '{"name": "No Shredded Romaine", "price": null}',
      '{"name": "No Italian Herb & Cheese Aioli", "price": null}',
      '{"name": "No Roast Beef", "price": null}'
    ]::JSONB[]
  );

  bread_option_id := menu.insert_modifier_group('Chef''s Recommended Bread', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_option(bread_option_id, 'Toasted Sesame Roll (V)', NULL, 'available', TRUE);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, gluten_free_bread_id, 2.36);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, change_bread_id, NULL);

  PERFORM menu.insert_item_modifier(item_id, bread_option_id, 0);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 1);

  item_id := menu.insert_item(
    1,
    TRUE,
    '1/2 Italian Roast Beef',
    'Shaved roast beef, sliced mozzarella, Chicago-style mild giardiniera, tomatoes, sweet onion, shredded romaine, Italian herb & cheese aioli (on a toasted sesame roll (460 cal)',
    'BPItalianRoastBeef',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, combos_id, NULL);
  PERFORM menu.insert_item_tag(item_id, rgf_id);

  bread_option_id := menu.insert_modifier_group('Chef''s Recommended Bread', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_option(bread_option_id, 'Toasted Sesame Roll (V)', NULL, 'available', TRUE);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, gluten_free_bread_id, 1.15);

  PERFORM menu.insert_item_modifier(item_id, bread_option_id, 0);
  PERFORM menu.insert_item_modifier(item_id, side_id, 1);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 2);

  item_id := menu.insert_item(
    1,
    TRUE,
    'Sweet Heat Crispy Thai Chicken',
    'Air-fried crispy chicken tenders, Thai basil slaw, pickled daikon & carrots, sweet chili sauce, sriracha mayo, and fried shallots (860 cal) on a toasted sesame brioche bun (240 cal)',
    'ThaiChickenSandwich',
    '*available at select locations*'
  );

  PERFORM menu.insert_items_categories(item_id, sandwiches_id, foodie);
  PERFORM menu.insert_item_price(item_id, 15.70);

  customize_id := menu.insert_modifiers_and_options(
    'Change It Up',
    NULL,
    NULL,
    FALSE,
    0,
    4,
    0,
    ARRAY[
      '{"name": "No Fried Shallots", "price": null}',
      '{"name": "No Pickled Daikon & Carrots ", "price": null}',
      '{"name": "No Sriracha Mayo", "price": null}',
      '{"name": "No Thai Basil Slaw", "price": null}'
    ]::JSONB[]
  );

  bread_option_id := menu.insert_modifier_group('Chef''s Recommended Bread', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_option(bread_option_id, 'Toasted Sesame Brioche Bun', NULL, 'available', TRUE);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, gluten_free_bread_id, 2.36);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, change_bread_id, NULL);

  PERFORM menu.insert_item_modifier(item_id, bread_option_id, 0);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 1);

  item_id := menu.insert_item(
    2,
    TRUE,
    'Peruvian Steak',
    'Spicy aji amarillo marinated steak with Oaxacan cheese, herb aioli, red onions, tomatoes, shredded romaine (520 cal) on a toasted potato roll (240 cal)',
    'PeruvianSteak',
    'Add avocado (80 cal) +$2+'
  );

  PERFORM menu.insert_items_categories(item_id, sandwiches_id, foodie);
  PERFORM menu.insert_item_price(item_id, 17.48);
  PERFORM menu.insert_item_tag(item_id, rgf_id);

  customize_id := menu.insert_modifiers_and_options(
    'Change It Up',
    NULL,
    NULL,
    FALSE,
    0,
    9,
    0,
    ARRAY[
      '{"name": "Add Avocado", "price": null}',
      '{"name": "No Red Onions ", "price": null}',
      '{"name": "No Tomatoes", "price": null}',
      '{"name": "No Oaxacan Cheese", "price": null}',
      '{"name": "No Shredded Romaine", "price": null}',
      '{"name": "Aji Amarillo Sauce (on the side)", "price": null}',
      '{"name": "Lite Herb Aioli", "price": null}',
      '{"name": "No Herb Aioli", "price": null}',
      '{"name": "Herb Aioli (on the side)", "price": null}'
    ]::JSONB[]
  );

  bread_option_id := menu.insert_modifier_group('Chef''s Recommended Bread', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_option(bread_option_id, 'Toasted Potato Roll', NULL, 'available', TRUE);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, gluten_free_bread_id, 2.36);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, change_bread_id, NULL);

  PERFORM menu.insert_item_modifier(item_id, bread_option_id, 0);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 1);

  item_id := menu.insert_item(
    3,
    TRUE,
    'Prosciutto & Chicken',
    'Italian prosciutto & shaved, roasted chicken breast with fresh mozzarella, crushed honey roasted almonds, basil pesto, balsamic glaze drizzle, tomatoes (590 cal) on panini-pressed ciabatta (260 cal)',
    'ProsciuttoChicken',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, sandwiches_id, foodie);
  PERFORM menu.insert_item_price(item_id, 15.53);
  PERFORM menu.insert_item_tag(item_id, rgf_id);
  PERFORM menu.insert_item_tag(item_id, n_id);

  customize_id := menu.insert_modifiers_and_options(
    'Change It Up',
    NULL,
    NULL,
    FALSE,
    0,
    12,
    0,
    ARRAY[
      '{"name": "Extra Chicken", "price": 2.27}',
      '{"name": "Add Avocado", "price": 2.42}',
      '{"name": "No Mozzarella", "price": null}',
      '{"name": "No Prosciutto", "price": null}',
      '{"name": "No Tomatoes", "price": null}',
      '{"name": "No Balsamic Glaze", "price": null}',
      '{"name": "Balsamic Glaze (on the side)", "price": null}',
      '{"name": "Lite Basil Pesto", "price": null}',
      '{"name": "No Basil Pesto", "price": null}',
      '{"name": "Basil Pesto (on the side)", "price": null}',
      '{"name": "No Honey Roasted Almonds", "price": null}',
      '{"name": "Honey Roasted Almonds (on the side)", "price": null}'
    ]::JSONB[]
  );

  bread_option_id := menu.insert_modifier_group('Chef''s Recommended Bread', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_option(bread_option_id, 'Panini Pressed Ciabatta (V)', NULL, 'available', TRUE);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, gluten_free_bread_id, 2.36);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, change_bread_id, NULL);

  PERFORM menu.insert_item_modifier(item_id, bread_option_id, 0);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 1);

  item_id := menu.insert_item(
    4,
    TRUE,
    'Chimichurri Steak & Bacon',
    'Roasted, carved steak and applewood smoked bacon topped with marinated red peppers, caramelized onion jam, chimichurri, shredded romaine, herb aioli (640 cal) on a toasted sesame roll (300 cal)',
    'ChimichurriSteakSandwich',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, sandwiches_id, foodie);
  PERFORM menu.insert_item_price(item_id, 17.48);
  PERFORM menu.insert_item_tag(item_id, rgf_id);

  customize_id := menu.insert_modifiers_and_options(
    'Change It Up',
    NULL,
    NULL,
    FALSE,
    0,
    6,
    0,
    ARRAY[
      '{"name": "Lite Herb Aioli", "price": null}',
      '{"name": "No Herb Aioli", "price": null}',
      '{"name": "No Marinated Red Peppers", "price": null}',
      '{"name": "No Shredded Romaine", "price": null}',
      '{"name": "No Caramelized Onion Jam", "price": null}',
      '{"name": "No Chimichurri", "price": null}'
    ]::JSONB[]
  );

  bread_option_id := menu.insert_modifier_group('Chef''s Recommended Bread', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_option(bread_option_id, 'Toasted Sesame Roll (V)', NULL, 'available', TRUE);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, gluten_free_bread_id, 2.36);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, change_bread_id, NULL);

  PERFORM menu.insert_item_modifier(item_id, bread_option_id, 0);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 1);

  item_id := menu.insert_item(
    5,
    TRUE,
    'Mendo''s Original Pork Belly Banh Mi',
    'Our Chef''s playful take on the popular Vietnamese sandwich with braised, caramelized pork belly, pickled daikon & carrots, cilantro, cucumbers, jalapeños, Thai basil, sriracha mayo (540 cal) on panini-pressed ciabatta (260 cal)',
    'BanhMi',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, sandwiches_id, foodie);
  PERFORM menu.insert_item_price(item_id, 15.81);

  customize_id := menu.insert_modifiers_and_options(
    'Change It Up',
    NULL,
    NULL,
    FALSE,
    0,
    9,
    0,
    ARRAY[
      '{"name": "Sub Steak", "price": 6.84}',
      '{"name": "No Cilantro", "price": null}',
      '{"name": "No Cucumbers", "price": null}',
      '{"name": "No Pickled Daikon & Carrots", "price": null}',
      '{"name": "No No Jalapenos", "price": null}',
      '{"name": "No Jalapenos (on the side)", "price": null}',
      '{"name": "Lite Sriracha Mayo", "price": null}',
      '{"name": "No Sriracha Mayo", "price": null}',
      '{"name": "Sriracha Mayo (on the side)", "price": null}'
    ]::JSONB[]
  );

  bread_option_id := menu.insert_modifier_group('Chef''s Recommended Bread', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_option(bread_option_id, 'Panini Pressed Ciabatta (V)', NULL, 'available', TRUE);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, gluten_free_bread_id, 2.36);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, change_bread_id, NULL);

  PERFORM menu.insert_item_modifier(item_id, bread_option_id, 0);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 1);

  item_id := menu.insert_item(
    0,
    TRUE,
    'Chicken Parm Dip',
    'Shaved, roasted chicken breast, Mendo''s krispies, melted mozzarella and Grana Padano cheeses, pomodoro sauce, Italian basil, Calabrian chili aioli (630 cal) on a toasted sesame roll (300 cal) served with an extra side of pomodoro sauce for dipping (40 cal)',
    'ChickenParmDip',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, sandwiches_id, classics);
  PERFORM menu.insert_item_price(item_id, 16.22);

  customize_id := menu.insert_modifiers_and_options(
    'Change It Up',
    NULL,
    NULL,
    FALSE,
    0,
    8,
    0,
    ARRAY[
      '{"name": "Extra Chicken ", "price": 2.27}',
      '{"name": "No Chicken", "price": null}',
      '{"name": "No Basil", "price": null}',
      '{"name": "No Calabrian Chili Aioli", "price": null}',
      '{"name": "No Grana Padano", "price": null}',
      '{"name": "No Mozzorella", "price": null}',
      '{"name": "No Pomodoro Side", "price": null}',
      '{"name": "No Pomodoro Sauce", "price": null}'
    ]::JSONB[]
  );

  bread_option_id := menu.insert_modifier_group('Chef''s Recommended Bread', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_option(bread_option_id, 'Toasted Sesame Roll (V)', NULL, 'available', TRUE);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, gluten_free_bread_id, 2.36);
  PERFORM menu.insert_modifier_group_parent(bread_option_id, change_bread_id, NULL);

  PERFORM menu.insert_item_modifier(item_id, bread_option_id, 0);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 1);

  item_id := menu.insert_item(
    0,
    FALSE,
    'Build Your Own Sandwich',
    'When you build your own sandwich, the item price includes one cheese, two accents, and three fruits or veggies',
    'BuildSandwich',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, sandwiches_id, NULL);

  cheese_id := menu.insert_modifiers_and_options(
    'Would you like cheese?',
    NULL,
    NULL,
    FALSE,
    0,
    2,
    0,
    ARRAY[
      '{"name": "Cheddar", "price": 1.15}',
      '{"name": "Goat Cheese", "price": 1.15}',
      '{"name": "Oaxacan Cheese", "price": 1.15}',
      '{"name": "Cotija Cheese", "price": 1.15}',
      '{"name": "Grana Padano", "price": 1.15}',
      '{"name": "Mozzarella", "price": 1.15}',
      '{"name": "Smoked Gouda", "price": 1.15}'    
    ]::JSONB[]
  );

  accent_id := menu.insert_modifiers_and_options(
    'Would you like to add any accents?',
    NULL,
    NULL,
    FALSE,
    0,
    2,
    0,
    ARRAY[
      '{"name": "Aji Amarillo Sauce", "price": 0.58}',
      '{"name": "Tangy Mustard BBQ Sauce", "price": 0.58}',
      '{"name": "Balsamic Glaze", "price": 0.58}',
      '{"name": "Herb Aioli", "price": 0.58}',
      '{"name": "Basil Pesto", "price": 0.58}',
      '{"name": "Sriracha Mayo", "price": 0.58}',
      '{"name": "Lemon", "price": 0.58}',
      '{"name": "Vegan Aioli", "price": 0.58}',
      '{"name": "Mustard Pickle Remoulade", "price": 0.58}',
      '{"name": "Yellow Mustard", "price": 0.58}',
      '{"name": "Sweet Chili Sauce", "price": 0.58}'
    ]::JSONB[]
  );

  produce_id := menu.insert_modifiers_and_options(
    'Would you like to add any fruits or veggies?',
    NULL,
    NULL,
    FALSE,
    0,
    3,
    0,
    ARRAY[
      '{"name": "Avocado", "price": 2.30}',
      '{"name": "Apple", "price": null}',
      '{"name": "Beets", "price": null}',
      '{"name": "Black Bean, Roasted Corn & Jicama Succotash", "price": null}',
      '{"name": "Cashews", "price": null}',
      '{"name": "Chopped Romaine", "price": null}',
      '{"name": "Cilantro", "price": null}',
      '{"name": "Dried Cranberries", "price": null}',
      '{"name": "Daikon & Carrots", "price": null}',
      '{"name": "Honey Roasted Almonds", "price": 0.58}',
      '{"name": "Jalapenos", "price": 0.58}',
      '{"name": "Julienne Cucumber", "price": 0.58}',
      '{"name": "Krispies", "price": null}',
      '{"name": "Mixed Greens", "price": null}',
      '{"name": "Pickled Onions", "price": null}',
      '{"name": "Quinoa & Millet Blend", "price": null}',
      '{"name": "Red Onions", "price": null}',
      '{"name": "Scallions", "price": null}',
      '{"name": "Shredded Romaine", "price": null}',
      '{"name": "Spinach", "price": 0.58}',
      '{"name": "Superfood Krunchies", "price": 0.58}',
      '{"name": "Tomato", "price": 0.58}',
      '{"name": "Wontons", "price": null}'
    ]::JSONB[]
  );

  premium_id := menu.insert_modifiers_and_options(
    'Would you like to add any premium add-ons?',
    NULL,
    NULL,
    FALSE,
    0,
    4,
    0,
    ARRAY[
      '{"name": "Aji Amarillo Steak", "price": 6.84}',
      '{"name": "Bacon", "price": 3.05}',
      '{"name": "Prosciutto", "price": 4.54}',
      '{"name": "Turkey", "price": 4.54}'
    ]::JSONB[]
  );

  protein_id := menu.insert_modifier_group('Choose your protein', TRUE, 1, 1, 0);
  
  id := menu.insert_modifier_group('No Meat', FALSE, 1, 1, 0);
  PERFORM menu.insert_modifier_group_parent(protein_id, id, 12.94);

  PERFORM menu.insert_modifier_group_parent(id, bread_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, cheese_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, accent_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, produce_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, premium_id, NULL);


  id := menu.insert_modifier_group('Applewood Smoked Bacon', FALSE, 1, 1, 0);
  PERFORM menu.insert_modifier_group_parent(protein_id, id, 14.09);

  PERFORM menu.insert_modifier_group_parent(id, bread_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, cheese_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, accent_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, produce_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, premium_id, NULL);

  id := menu.insert_modifier_group('Shaved, Roasted Chicken Breast', FALSE, 1, 1, 0);
  PERFORM menu.insert_modifier_group_parent(protein_id, id, 14.38);

  PERFORM menu.insert_modifier_group_parent(id, bread_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, cheese_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, accent_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, produce_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, premium_id, NULL);

  id := menu.insert_modifier_group('Shaved, Roasted Turkey Breast', FALSE, 1, 1, 0);
  PERFORM menu.insert_modifier_group_parent(protein_id, id, 14.38);

  PERFORM menu.insert_modifier_group_parent(id, bread_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, cheese_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, accent_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, produce_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, premium_id, NULL);
  
  id := menu.insert_modifier_group('Organic Marinated, Baked Tofu', FALSE, 1, 1, 0);
  PERFORM menu.insert_modifier_group_parent(protein_id, id, 14.09);

  PERFORM menu.insert_modifier_group_parent(id, bread_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, cheese_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, accent_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, produce_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, premium_id, NULL);
  
  id := menu.insert_modifier_group('Braised, Caramelized Pork Belly', FALSE, 1, 1, 0);
  PERFORM menu.insert_modifier_group_parent(protein_id, id, 15.24);

  PERFORM menu.insert_modifier_group_parent(id, bread_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, cheese_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, accent_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, produce_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, premium_id, NULL);
  
  id := menu.insert_modifier_group('Hand Carved Steak', FALSE, 1, 1, 0);
  PERFORM menu.insert_modifier_group_parent(protein_id, id, 15.87);

  PERFORM menu.insert_modifier_group_parent(id, bread_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, cheese_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, accent_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, produce_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, premium_id, NULL);
  
  id := menu.insert_modifier_group('Roast Beef', FALSE, 1, 1, 0);
  PERFORM menu.insert_modifier_group_parent(protein_id, id, 16.33);

  PERFORM menu.insert_modifier_group_parent(id, bread_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, cheese_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, accent_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, produce_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, premium_id, NULL);

  PERFORM menu.insert_item_modifier(item_id, protein_id, 0);
END $$;
-- #endregion

-- #region SALADS
DO $$ 
DECLARE
  creations_id INTEGER := 1;
  salad_id INTEGER := 4;
  v_id INTEGER := 1;
  vg_id INTEGER := 2;
  gf_id INTEGER := 3;
  rgf_id INTEGER := 4;
  n_id INTEGER := 5;
  item_id INTEGER;
  salad_style_id INTEGER;
  dressing_id INTEGER;
  protein_id INTEGER;
  base_id INTEGER;
  cheese_id INTEGER;
  accent_id INTEGER;
  produce_id INTEGER;
  premium_id INTEGER;
  item_dressing_id INTEGER;
  change_dressing_id INTEGER;
  customize_id INTEGER;
  id INTEGER;
BEGIN
  SELECT group_id FROM menu.modifier_groups WHERE name = 'Salad Style' INTO salad_style_id;
  SELECT group_id FROM menu.modifier_groups WHERE name = 'Dressing Options (on the side)' INTO dressing_id;
  SELECT group_id FROM menu.modifier_groups WHERE name = 'Would you like cheese?' INTO cheese_id;
  SELECT group_id FROM menu.modifier_groups WHERE name = 'Would you like to add any accents?' INTO accent_id;
  SELECT group_id FROM menu.modifier_groups WHERE name = 'Would you like to add any fruits or veggies?' INTO produce_id;
  SELECT group_id FROM menu.modifier_groups WHERE name = 'Would you like to add any premium add-ons?' INTO premium_id;
 
  base_id := menu.insert_modifier_group('Choose your base', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_group_parent(base_id, salad_style_id, NULL);

  item_id := menu.insert_item(
    8,
    FALSE,
    'Build Your Own Salad',
    'When you build your own salad, the item price includes one cheese, two accents, and three fruits or veggies.',
    'BuildSalad',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, salad_id, NULL);

  protein_id := menu.insert_modifier_group('Choose your protein', TRUE, 1, 1, 0);
  
  id := menu.insert_modifier_group('No Meat', FALSE, 1, 1, 0);
  PERFORM menu.insert_modifier_group_parent(protein_id, id, 12.94);

  PERFORM menu.insert_modifier_group_parent(id, base_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, cheese_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, accent_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, produce_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, premium_id, NULL);


  id := menu.insert_modifier_group('Applewood Smoked Bacon', FALSE, 1, 1, 0);
  PERFORM menu.insert_modifier_group_parent(protein_id, id, 14.09);

  PERFORM menu.insert_modifier_group_parent(id, base_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, cheese_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, accent_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, produce_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, premium_id, NULL);

  id := menu.insert_modifier_group('Shaved, Roasted Chicken Breast', FALSE, 1, 1, 0);
  PERFORM menu.insert_modifier_group_parent(protein_id, id, 14.38);

  PERFORM menu.insert_modifier_group_parent(id, base_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, cheese_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, accent_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, produce_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, premium_id, NULL);

  id := menu.insert_modifier_group('Shaved, Roasted Turkey Breast', FALSE, 1, 1, 0);
  PERFORM menu.insert_modifier_group_parent(protein_id, id, 14.38);

  PERFORM menu.insert_modifier_group_parent(id, base_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, cheese_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, accent_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, produce_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, premium_id, NULL);
  
  id := menu.insert_modifier_group('Organic Marinated, Baked Tofu', FALSE, 1, 1, 0);
  PERFORM menu.insert_modifier_group_parent(protein_id, id, 14.38);

  PERFORM menu.insert_modifier_group_parent(id, base_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, cheese_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, accent_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, produce_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, premium_id, NULL);
  
  id := menu.insert_modifier_group('Braised, Caramelized Pork Belly', FALSE, 1, 1, 0);
  PERFORM menu.insert_modifier_group_parent(protein_id, id, 15.24);

  PERFORM menu.insert_modifier_group_parent(id, base_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, cheese_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, accent_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, produce_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, premium_id, NULL);
  
  id := menu.insert_modifier_group('Hand Carved Steak', FALSE, 1, 1, 0);
  PERFORM menu.insert_modifier_group_parent(protein_id, id, 16.33);

  PERFORM menu.insert_modifier_group_parent(id, base_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, cheese_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, accent_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, produce_id, NULL);
  PERFORM menu.insert_modifier_group_parent(id, premium_id, NULL);

  PERFORM menu.insert_item_modifier(item_id, protein_id, 0);

  item_id := menu.insert_item(
    0,
    TRUE,
    'Thai Mango Salad',
    'Shaved, roasted chicken breast, ramen noodles, napa cabbage & kale slaw with carrots & bean sprouts, baby spinach, sliced mango, honey roasted almonds, pickled daikon & carrots, Thai basil, fresh mint, cilantro, lime, and fried shallots (640 cal) with Thai almond dressing (200 cal)',
    'ThaiMango',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, salad_id, NULL);
  PERFORM menu.insert_item_price(item_id, 17.54);
  PERFORM menu.insert_item_tag(item_id, n_id);

  protein_id := menu.insert_modifiers_and_options(
    'Would you like to add protein?',
    NULL,
    NULL,
    FALSE,
    0,
    5,
    0,
    ARRAY[
      '{"name": "Add Bacon", "price": 3.05}',
      '{"name": "Add Chicken", "price": 4.54}',
      '{"name": "Add Impossible Chorizo", "price": 5.69}',
      '{"name": "Add Steak", "price": 6.84}',
      '{"name": "Add Tofu", "price": 4.54}'
    ]::JSONB[]
  );

  customize_id := menu.insert_modifiers_and_options(
    'Change It Up',
    NULL,
    NULL,
    FALSE,
    0,
    10,
    0,
    ARRAY[
      '{"name": "Add Avocado", "price": 2.42}',
      '{"name": "Sub Tofu", "price": null}',
      '{"name": "No Cilantro", "price": null}',
      '{"name": "No Honey Roasted Almonds", "price": null}',
      '{"name": "No Mint", "price": null}',
      '{"name": "No Mango", "price": null}',
      '{"name": "No Thai Basil", "price": null}',
      '{"name": "No Shallots", "price": null}',
      '{"name": "No Daikon & Carrots (Note: Carrots are still in the kale slaw)", "price": null}',
      '{"name": "No Ramen Noodles", "price": null}'
    ]::JSONB[]
  );

  item_dressing_id := menu.insert_modifiers_and_options(
    'Chef''s Recommended Dressing',
    NULL,
    NULL,
    TRUE,
    1,
    1,
    0,
    ARRAY[
      '{"name": "Thai Almond Dressing (on the side)", "price": null, "is_default": true}',
      '{"name": "Extra Thai Almond Dressing (on the side)", "price": null}',
      '{"name": "No Dressing", "price": null}'
    ]::JSONB[]
  );

  change_dressing_id := menu.insert_modifier_group('Change Chef''s Recommended Dressing (on the side)', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_group_parent(change_dressing_id, dressing_id, NULL);
  PERFORM menu.insert_modifier_group_parent(item_dressing_id, change_dressing_id, NULL);

  PERFORM menu.insert_item_modifier(item_id, item_dressing_id, 0);
  PERFORM menu.insert_item_modifier(item_id, protein_id, 1);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 2);

  item_id := menu.insert_item(
    1,
    TRUE,
    'Avocado & Quinoa Superfood Ensalada',
    'Chopped romaine, curly kale, quinoa & millet, housemade superfood krunchies, succotash with roasted corn, black beans & jicama, red onions, cilantro, cotija cheese, grape tomatoes, avocado (400 cal) with chipotle vinaigrette (250 cal)',
    'AvoQuinoa',
    'Add shaved, roasted chicken breast (110 cal) +$3.75+'
  );

  PERFORM menu.insert_items_categories(item_id, salad_id, NULL);
  PERFORM menu.insert_item_price(item_id, 15.35);
  PERFORM menu.insert_item_tag(item_id, vg_id);
  PERFORM menu.insert_item_tag(item_id, gf_id);

  customize_id := menu.insert_modifiers_and_options(
    'Change It Up',
    NULL,
    NULL,
    FALSE,
    0,
    11,
    0,
    ARRAY[
      '{"name": "No Cotija Cheese", "price": null}',
      '{"name": "No Red Onions", "price": null}',
      '{"name": "No Grape Tomatoes", "price": null}',
      '{"name": "No Cilantro", "price": null}',
      '{"name": "No Succotash", "price": null}',
      '{"name": "Succotash (on the side)", "price": null}',
      '{"name": "No Superfood Krunchies", "price": null}',
      '{"name": "Superfood Krunchies (on the side)", "price": null}',
      '{"name": "No Kale", "price": null}',
      '{"name": "No Romaine", "price": null}',
      '{"name": "No Avocado", "price": null}'
    ]::JSONB[]
  );

  item_dressing_id := menu.insert_modifiers_and_options(
    'Chef''s Recommended Dressing',
    NULL,
    NULL,
    TRUE,
    1,
    1,
    0,
    ARRAY[
      '{"name": "Chipotle Vinaigrette (on the side)", "price": null, "is_default": true}',
      '{"name": "Extra Chipotle Vinaigrette (on the side)", "price": null}',
      '{"name": "No Dressing", "price": null}'
    ]::JSONB[]
  );

  change_dressing_id := menu.insert_modifier_group('Change Chef''s Recommended Dressing (on the side)', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_group_parent(change_dressing_id, dressing_id, NULL);
  PERFORM menu.insert_modifier_group_parent(item_dressing_id, change_dressing_id, NULL);

  PERFORM menu.insert_item_modifier(item_id, item_dressing_id, 0);
  PERFORM menu.insert_item_modifier(item_id, protein_id, 1);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 2);

  item_id := menu.insert_item(
    2,
    TRUE,
    'The Impossible Taco Salad',
    'Plant-based Impossible chorizo, housemade superfood krunchies, chopped romaine, curly kale, succotash with roasted corn, black beans & jicama, red onions, cilantro, grape tomatoes, avocado (400 cal) with house vegan chipotle ranch (240 cal)',
    'ImpossibleTaco',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, salad_id, NULL);
  PERFORM menu.insert_item_price(item_id, 16.68);
  PERFORM menu.insert_item_tag(item_id, v_id);
  PERFORM menu.insert_item_tag(item_id, gf_id);

  id := menu.insert_modifiers_and_options(
    'Would you like to add protein',
    NULL,
    NULL,
    FALSE,
    0,
    4,
    0,
    ARRAY[
      '{"name": "Add Bacon", "price": 3.05}',
      '{"name": "Add Chicken", "price": 4.54}',
      '{"name": "Add Steak", "price": 6.84}',
      '{"name": "Add Tofu", "price": 4.54}'
    ]::JSONB[]
  );

 customize_id := menu.insert_modifiers_and_options(
    'Change It Up',
    NULL,
    NULL,
    FALSE,
    0,
    12,
    0,
    ARRAY[
      '{"name": "Extra Impossible Chorizo", "price": 2.84}',
      '{"name": "No Impossible Chorizo", "price": null}',
      '{"name": "No Red Onions", "price": null}',
      '{"name": "No Grape Tomatoes", "price": null}',
      '{"name": "No Cilantro", "price": null}',
      '{"name": "No Succotash", "price": null}',
      '{"name": "Succotash (on the side)", "price": null}',
      '{"name": "No Superfood Krunchies", "price": null}',
      '{"name": "Superfood Krunchies (on the side)", "price": null}',
      '{"name": "No Kale", "price": null}',
      '{"name": "No Romaine", "price": null}',
      '{"name": "No Avocado", "price": null}'
    ]::JSONB[]
  );

  item_dressing_id := menu.insert_modifiers_and_options(
    'Chef''s Recommended Dressing',
    NULL,
    NULL,
    TRUE,
    1,
    1,
    0,
    ARRAY[
      '{"name": "Vagan Chipotle Ranch (on the side)", "price": null, "is_default": true}',
      '{"name": "Extra Vagan Chipotle Ranch (on the side)", "price": null}',
      '{"name": "No Dressing", "price": null}'
    ]::JSONB[]
  );

  change_dressing_id := menu.insert_modifier_group('Change Chef''s Recommended Dressing (on the side)', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_group_parent(change_dressing_id, dressing_id, NULL);
  PERFORM menu.insert_modifier_group_parent(item_dressing_id, change_dressing_id, NULL);

  PERFORM menu.insert_item_modifier(item_id, item_dressing_id, 0);
  PERFORM menu.insert_item_modifier(item_id, id, 1);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 2);

  item_id := menu.insert_item(
    3,
    TRUE,
    'Pink Lady Beets & Goat Cheese Salad',
    'Shaved, roasted chicken breast, honey and herb marinated goat cheese, pink lady beets, green apples, dried cranberries, crushed honey roasted almonds, red onions, mixed greens, chopped romaine (620 cal) with citrus vinaigrette (220 cal)',
    'PinkLady',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, salad_id, NULL);
  PERFORM menu.insert_item_price(item_id, 16.96);
  PERFORM menu.insert_item_tag(item_id, gf_id);
  PERFORM menu.insert_item_tag(item_id, n_id);

  id := menu.insert_modifiers_and_options(
    'Would you like to modify your protein',
    NULL,
    NULL,
    FALSE,
    0,
    4,
    0,
    ARRAY[
      '{"name": "Add Bacon", "price": 3.05}',
      '{"name": "Add Tofu", "price": 4.54}',
      '{"name": "Extra Chicken", "price": 2.27}',
      '{"name": "No Chicken", "price": null}'
    ]::JSONB[]
  );

  customize_id := menu.insert_modifiers_and_options(
    'Change It Up',
    NULL,
    NULL,
    FALSE,
    0,
    13,
    0,
    ARRAY[
      '{"name": "Add Avocado", "price": 2.42}',
      '{"name": "No Red Onions", "price": null}',
      '{"name": "No Goat Cheese", "price": null}',
      '{"name": "No Beets", "price": null}',
      '{"name": "Extra Beets", "price": null}',
      '{"name": "Beets (on the side)", "price": null}',
      '{"name": "No Dried Cranberries", "price": null}',
      '{"name": "Dried Cranberries (on the side)", "price": null}',
      '{"name": "No Honey Roasted Almonds", "price": null}',
      '{"name": "Honey Roasted Almonds (on the side)", "price": null}',
      '{"name": "No Apples", "price": null}',
      '{"name": "No Romaine", "price": null}',
      '{"name": "No Mixed Greens", "price": null}'
    ]::JSONB[]
  );

  item_dressing_id := menu.insert_modifiers_and_options(
    'Chef''s Recommended Dressing',
    NULL,
    NULL,
    TRUE,
    1,
    1,
    0,
    ARRAY[
      '{"name": "Citrus Vinaigrette (on the side)", "price": null, "is_default": true}',
      '{"name": "Extra Citrus Vinaigrette (on the side)", "price": null}',
      '{"name": "No Dressing", "price": null}'
    ]::JSONB[]
  );

  change_dressing_id := menu.insert_modifier_group('Change Chef''s Recommended Dressing (on the side)', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_group_parent(change_dressing_id, dressing_id, NULL);
  PERFORM menu.insert_modifier_group_parent(item_dressing_id, change_dressing_id, NULL);

  PERFORM menu.insert_item_modifier(item_id, item_dressing_id, 0);
  PERFORM menu.insert_item_modifier(item_id, id, 1);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 2);

  item_id := menu.insert_item(
    4,
    TRUE,
    'The Modern Caesar',
    'Curly kale, chopped romaine, housemade superfood krunchies, shaved Grana Padano cheese, red onions, grape tomatoes, avocado, lemon squeeze (290 cal) with classic Caesar dressing (340 cal)',
    'ModernCesear',
    'Add shaved, roasted chicken breast (110 cal) +$3.75'
  );

  PERFORM menu.insert_items_categories(item_id, salad_id, NULL);
  PERFORM menu.insert_item_price(item_id, 13.23);
  PERFORM menu.insert_item_tag(item_id, gf_id);

  id := menu.insert_modifiers_and_options(
    'Would you like to add protein',
    NULL,
    NULL,
    FALSE,
    0,
    2,
    0,
    ARRAY[
      '{"name": "Add Chicken", "price": 4.54}',
      '{"name": "Add Bacon", "price": 3.05}'
    ]::JSONB[]
  );

  customize_id := menu.insert_modifiers_and_options(
    'Change It Up',
    NULL,
    NULL,
    FALSE,
    0,
    8,
    0,
    ARRAY[
      '{"name": "No Red Onions", "price": null}',
      '{"name": "No Grape Tomatoes", "price": null}',
      '{"name": "No Grana Padano", "price": null}',
      '{"name": "No Superfood Krunchies", "price": null}',
      '{"name": "Superfood Krunchies (on the side)", "price": null}',
      '{"name": "No Avocado", "price": null}',
      '{"name": "No Kale", "price": null}',
      '{"name": "No Romaine", "price": null}'
    ]::JSONB[]
  );

  item_dressing_id := menu.insert_modifiers_and_options(
    'Chef''s Recommended Dressing',
    NULL,
    NULL,
    TRUE,
    1,
    1,
    0,
    ARRAY[
      '{"name": "Ceasar Dressing (on the side)", "price": null, "is_default": true}',
      '{"name": "Extra Ceasar Dressing (on the side)", "price": null}',
      '{"name": "No Dressing", "price": null}'
    ]::JSONB[]
  );

  change_dressing_id := menu.insert_modifier_group('Change Chef''s Recommended Dressing (on the side)', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_group_parent(change_dressing_id, dressing_id, NULL);
  PERFORM menu.insert_modifier_group_parent(item_dressing_id, change_dressing_id, NULL);

  PERFORM menu.insert_item_modifier(item_id, item_dressing_id, 0);
  PERFORM menu.insert_item_modifier(item_id, id, 1);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 2);

  item_id := menu.insert_item(
    5,
    TRUE,
    'Mama Chen''s Chinese Chicken Salad',
    'Shaved, roasted chicken breast, napa cabbage & kale slaw, carrots, bean sprouts, baby spinach, chopped romaine, scallions, cilantro, toasted cashews, crispy wontons (420 cal) with miso mustard sesame dressing (230 cal)',
    'MamaChensChicken',
    'Want to make it vegan? Swap the chicken for marinated, baked tofu'
  );

  PERFORM menu.insert_items_categories(item_id, salad_id, NULL);
  PERFORM menu.insert_item_price(item_id, 16.96);
  PERFORM menu.insert_item_tag(item_id, n_id);

  id := menu.insert_modifiers_and_options(
    'Would you like to modify your protein',
    NULL,
    NULL,
    FALSE,
    0,
    4,
    0,
    ARRAY[
      '{"name": "Add Steak", "price": 6.84}',
      '{"name": "Extra Chicken", "price": 2.27}',
      '{"name": "No Chicken", "price": null}',
      '{"name": "Sub Tofu", "price": null}'
    ]::JSONB[]
  );

  customize_id := menu.insert_modifiers_and_options(
    'Change It Up',
    NULL,
    NULL,
    FALSE,
    0,
    9,
    0,
    ARRAY[
      '{"name": "Add Avocado", "price": 2.42}',
      '{"name": "No Wontons (G)", "price": null}',
      '{"name": "Wontons (G) (on the side)", "price": null}',
      '{"name": "No Cabbage & Kale Slaw", "price": null}',
      '{"name": "No Cilantro", "price": null}',
      '{"name": "No Cashews", "price": null}',
      '{"name": "No Scallions", "price": null}',
      '{"name": "No Romaine", "price": null}',
      '{"name": "No Spinach", "price": null}'
    ]::JSONB[]
  );

  item_dressing_id := menu.insert_modifiers_and_options(
    'Chef''s Recommended Dressing',
    NULL,
    NULL,
    TRUE,
    1,
    1,
    0,
    ARRAY[
      '{"name": "Miso Mustard Sesame Dressing (G) (on the side)", "price": null, "is_default": true}',
      '{"name": "Extra Miso Mustard Sesame Dressing (G) (on the side)", "price": null}',
      '{"name": "No Dressing", "price": null}'
    ]::JSONB[]
  );

  change_dressing_id := menu.insert_modifier_group('Change Chef''s Recommended Dressing (on the side)', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_group_parent(change_dressing_id, dressing_id, NULL);
  PERFORM menu.insert_modifier_group_parent(item_dressing_id, change_dressing_id, NULL);

  PERFORM menu.insert_item_modifier(item_id, item_dressing_id, 0);
  PERFORM menu.insert_item_modifier(item_id, id, 1);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 2);

  item_id := menu.insert_item(
    6,
    FALSE,
    '"Not So Fried" Chicken Sandwich - Salad Style!',
    'Our chef''s special "salad style" recipe for the "Not So Fried" Chicken Sandwich - shaved, roasted chicken breast, mustard pickle slaw, grape tomatoes, pickled red onions, chopped romaine, mixed greens, and Mendo''s krispies, (470 cal) with citrus vinaigrette and a barbeque sauce drizzle (280 cal)',
    'NotSoFriedSalad',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, salad_id, NULL);
  PERFORM menu.insert_item_price(item_id, 16.50);

  id := menu.insert_modifiers_and_options(
    'Would you like to modify your protein',
    NULL,
    NULL,
    FALSE,
    0,
    3,
    0,
    ARRAY[
      '{"name": "Add Bacon", "price": 3.05}',
      '{"name": "Extra Chicken", "price": 2.27}',
      '{"name": "No Chicken", "price": null}'
    ]::JSONB[]
  );

  customize_id := menu.insert_modifiers_and_options(
    'Change It Up',
    NULL,
    NULL,
    FALSE,
    0,
    5,
    0,
    ARRAY[
      '{"name": "Add Avocado", "price": 2.42}',
      '{"name": "No Chipotle BBQ", "price": null}',
      '{"name": "No Mendo''s Krispies (G)", "price": null}',
      '{"name": "No Mustard Pickle Slaw", "price": null}',
      '{"name": "No Tomatoes", "price": null}'
    ]::JSONB[]
  );

  item_dressing_id := menu.insert_modifiers_and_options(
    'Chef''s Recommended Dressing',
    NULL,
    NULL,
    TRUE,
    1,
    1,
    0,
    ARRAY[
      '{"name": "Citrus Vinaigrette (on the side)", "price": null, "is_default": true}',
      '{"name": "Extra Citrus Vinaigrette (G) (on the side)", "price": null}',
      '{"name": "No Dressing", "price": null}'
    ]::JSONB[]
  );

  change_dressing_id := menu.insert_modifier_group('Change Chef''s Recommended Dressing (on the side)', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_group_parent(change_dressing_id, dressing_id, NULL);
  PERFORM menu.insert_modifier_group_parent(item_dressing_id, change_dressing_id, NULL);

  PERFORM menu.insert_item_modifier(item_id, item_dressing_id, 0);
  PERFORM menu.insert_item_modifier(item_id, id, 1);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 2);

  item_id := menu.insert_item(
    7,
    FALSE,
    'Mendo''s Original Pork Belly Banh Mi - Salad Style!',
    'Our chef''s special "salad style" recipe for our Mendo''s Original Pork Belly Banh Mi sandwich - braised, caramelized pork belly, housemade pickled daikon & carrots, cucumbers, jalapenos, chopped romaine, napa cabbage & kale slaw mix, and cilantro, (340 cal) with miso vinaigrette (230 cal)',
    'BanhMiSalad',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, salad_id, NULL);
  PERFORM menu.insert_item_price(item_id, 16.96);

  id := menu.insert_modifiers_and_options(
    'Would you like to modify your protein',
    NULL,
    NULL,
    FALSE,
    0,
    3,
    0,
    ARRAY[
      '{"name": "Sub Tofu", "price": 4.54}',
      '{"name": "Extra Pork Belly", "price": 3.16}',
      '{"name": "No Pork Belly", "price": null}'
    ]::JSONB[]
  );

  customize_id := menu.insert_modifiers_and_options(
    'Change It Up',
    NULL,
    NULL,
    FALSE,
    0,
    5,
    0,
    ARRAY[
      '{"name": "No Cilantro", "price": null}',
      '{"name": "No Cucumbers", "price": null}',
      '{"name": "No Pickled Daikon & Carrots", "price": null}',
      '{"name": "No Jalapenos", "price": null}',
      '{"name": "Jalapenos (on the side)", "price": null}'
    ]::JSONB[]
  );

  item_dressing_id := menu.insert_modifiers_and_options(
    'Chef''s Recommended Dressing',
    NULL,
    NULL,
    TRUE,
    1,
    1,
    0,
    ARRAY[
      '{"name": "Miso Mustard Sesame Dressing (G) (on the side)", "price": null, "is_default": true}',
      '{"name": "Extra Miso Mustard Sesame Dressing (G) (on the side)", "price": null}',
      '{"name": "No Dressing", "price": null}'
    ]::JSONB[]
  );

  change_dressing_id := menu.insert_modifier_group('Change Chef''s Recommended Dressing (on the side)', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_group_parent(change_dressing_id, dressing_id, NULL);
  PERFORM menu.insert_modifier_group_parent(item_dressing_id, change_dressing_id, NULL);

  PERFORM menu.insert_item_modifier(item_id, item_dressing_id, 0);
  PERFORM menu.insert_item_modifier(item_id, id, 1);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 2);

  item_id := menu.insert_item(
    1,
    TRUE,
    'Strawberry Fields Salad with Chicken',
    'Shaved, roasted chicken breast, strawberries, watermelon radish, shaved fennel, fresh mint, red onions, goat gouda, toasted pistachios, mixed greens, romaine (380 cal) with greek yogurt poppyseed dressing (280 cal)',
    'StrawberryFields',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, creations_id, NULL);
  PERFORM menu.insert_item_price(item_id, 17.54);
  PERFORM menu.insert_item_tag(item_id, gf_id);
  PERFORM menu.insert_item_tag(item_id, n_id);

  id := menu.insert_modifiers_and_options(
    'Would you like to modify your protein',
    NULL,
    NULL,
    FALSE,
    0,
    1,
    0,
    ARRAY[
      '{"name": "Extra Chicken", "price": 2.15}',
      '{"name": "No Chicken", "price": null}'
    ]::JSONB[]
  );

  customize_id := menu.insert_modifiers_and_options(
    'Change It Up',
    NULL,
    NULL,
    FALSE,
    0,
    11,
    0,
    ARRAY[
      '{"name": "Add Avocado", "price": 2.42}',
      '{"name": "No Goat Gouda", "price": null}',
      '{"name": "No Fennel", "price": null}',
      '{"name": "No Mint", "price": null}',
      '{"name": "No Mixed Greens", "price": null}',
      '{"name": "No Red Onions", "price": null}',
      '{"name": "No Romaine", "price": null}',
      '{"name": "No Strawberries", "price": null}',
      '{"name": "No Toasted Pistachios", "price": null}',
      '{"name": "Toasted Pistachios (on the side)", "price": null}',
      '{"name": "No Watermelon Radish", "price": null}'
    ]::JSONB[]
  );

  item_dressing_id := menu.insert_modifiers_and_options(
    'Chef''s Recommended Dressing',
    NULL,
    NULL,
    TRUE,
    1,
    1,
    0,
    ARRAY[
      '{"name": "Greek Yogurt Poppyseed Dressing (on the side)", "price": null, "is_default": true}',
      '{"name": "Extra Greek Yogurt Poppyseed Dressing (on the side)", "price": null}',
      '{"name": "No Dressing", "price": null}'
    ]::JSONB[]
  );

  change_dressing_id := menu.insert_modifier_group('Change Chef''s Recommended Dressing (on the side)', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_group_parent(change_dressing_id, dressing_id, NULL);
  PERFORM menu.insert_modifier_group_parent(item_dressing_id, change_dressing_id, NULL);

  PERFORM menu.insert_item_modifier(item_id, item_dressing_id, 0);
  PERFORM menu.insert_item_modifier(item_id, id, 1);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 2);

  item_id := menu.insert_item(
    3,
    TRUE,
    'Mediterranean Crunch Salad',
    'Shaved, roasted chicken breast, Persian cucumbers, apricot, red pepper, radish, feta cheese, pita chips, fresh mint, parsley, scallions, chopped romaine, curly kale (450 cal) with creamy pomegranate dressing (210 cal)',
    'CrunchSalad',
    'can be requested GF by removing pita chips'
  );

  PERFORM menu.insert_items_categories(item_id, creations_id, NULL);
  PERFORM menu.insert_item_price(item_id, 17.54);
  PERFORM menu.insert_item_tag(item_id, rgf_id);

  id := menu.insert_modifiers_and_options(
    'Would you like to modify your protein',
    NULL,
    NULL,
    FALSE,
    0,
    2,
    0,
    ARRAY[
      '{"name": "Extra Chicken", "price": 2.15}',
      '{"name": "No Chicken", "price": null}'
    ]::JSONB[]
  );

  customize_id := menu.insert_modifiers_and_options(
    'Change It Up',
    NULL,
    NULL,
    FALSE,
    0,
    9,
    0,
    ARRAY[
      '{"name": "Add Avocado", "price": 2.42}',
      '{"name": "No Apricot", "price": null}',
      '{"name": "No Feta Cheese", "price": null}',
      '{"name": "No Scallions", "price": null}',
      '{"name": "No Kale", "price": null}',
      '{"name": "No Mint", "price": null}',
      '{"name": "No Pita Chips", "price": null}',
      '{"name": "No Veggie Mix", "price": null}',
      '{"name": "No Chopped Romaine", "price": null}'
    ]::JSONB[]
  );

  item_dressing_id := menu.insert_modifiers_and_options(
    'Chef''s Recommended Dressing',
    NULL,
    NULL,
    TRUE,
    1,
    1,
    0,
    ARRAY[
      '{"name": "Creamy Pomegranate Dressing (on the side)", "price": null, "is_default": true}',
      '{"name": "Extra Creamy Pomegranate Dressing (on the side)", "price": null}',
      '{"name": "No Dressing", "price": null}'
    ]::JSONB[]
  );

  change_dressing_id := menu.insert_modifier_group('Change Chef''s Recommended Dressing (on the side)', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_group_parent(change_dressing_id, dressing_id, NULL);
  PERFORM menu.insert_modifier_group_parent(item_dressing_id, change_dressing_id, NULL);

  PERFORM menu.insert_item_modifier(item_id, item_dressing_id, 0);
  PERFORM menu.insert_item_modifier(item_id, id, 1);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 2);



  item_id := menu.insert_item(
    6,
    TRUE,
    'Farmer''s Market Pesto Salad',
    'Fresh mozzarella, marinated peppers, Kumato tomatoes, carrots, red onions, honey roasted almonds, chopped romaine, mixed greens (340 cal) with basil pesto vinaigrette (250 cal)',
    'FarmersMarketPesto',
    'Craveable as is or add shaved chicken breast (110 cal) $3.95+ or Italian prosciutto (90 cal) $3.95+'
  );

  PERFORM menu.insert_items_categories(item_id, creations_id, NULL);
  PERFORM menu.insert_item_price(item_id, 13.97);
  PERFORM menu.insert_item_tag(item_id, vg_id);
  PERFORM menu.insert_item_tag(item_id, gf_id);
  PERFORM menu.insert_item_tag(item_id, n_id);

  id := menu.insert_modifiers_and_options(
    'Craveable as is, orrr',
    NULL,
    NULL,
    FALSE,
    0,
    3,
    0,
    ARRAY[
      '{"name": "Add Chicken", "price": 4.60}',
      '{"name": "Add Italian Prosciutto", "price": 4.89}',
      '{"name": "Add Avocado", "price": 2.59}'
    ]::JSONB[]
  );

  customize_id := menu.insert_modifiers_and_options(
    'Change It Up',
    NULL,
    NULL,
    FALSE,
    0,
    7,
    0,
    ARRAY[
      '{"name": "No Mixed Greens and Chopped Romaine", "price": null}',
      '{"name": "No Kumato Tomatoes", "price": null}',
      '{"name": "No Carrots", "price": null}',
      '{"name": "No Fresh Mozzarella", "price": null}',
      '{"name": "No Red Onions", "price": null}',
      '{"name": "No Honey Roasted Almonds", "price": null}',
      '{"name": "No Marinated Peppers", "price": null}'
    ]::JSONB[]
  );

  item_dressing_id := menu.insert_modifiers_and_options(
    'Chef''s Recommended Dressing',
    NULL,
    NULL,
    TRUE,
    1,
    1,
    0,
    ARRAY[
      '{"name": "Basil Pesto Vinaigrette (on the side)", "price": null, "is_default": true}',
      '{"name": "Extra Basil Pesto Vinaigrette (on the side)", "price": null}',
      '{"name": "No Dressing", "price": null}'
    ]::JSONB[]
  );

  change_dressing_id := menu.insert_modifier_group('Change Chef''s Recommended Dressing (on the side)', TRUE, 1, 1, 0);
  PERFORM menu.insert_modifier_group_parent(change_dressing_id, dressing_id, NULL);
  PERFORM menu.insert_modifier_group_parent(item_dressing_id, change_dressing_id, NULL);

  PERFORM menu.insert_item_modifier(item_id, item_dressing_id, 0);
  PERFORM menu.insert_item_modifier(item_id, id, 1);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 2);
END $$;
-- #endregion

-- #region BOWLS
DO $$ 
DECLARE
  bowl_id INTEGER := 3;
  item_id INTEGER;
  side_id INTEGER;
  drink_id INTEGER;
  bread_id INTEGER;
  sauce_id INTEGER;
  customize_id INTEGER;
BEGIN
  item_id := menu.insert_item(
    0,
    TRUE,
    'Chimichurri Steak & Shishito Bowl',
    'Roasted, carved steak over ancient grains tossed with caramelized onion jam & chimichurri, baby spinach, roasted shishito peppers with broccolini, tomatoes & red onions, grilled lemon (740 cal)',
    'ChimichurriSteakBowl',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, bowl_id, NULL);
  PERFORM menu.insert_item_price(item_id, 19.55);

  customize_id := menu.insert_modifiers_and_options(
    'Change It Up',
    NULL,
    NULL,
    FALSE,
    0,
    8,
    0,
    ARRAY[
      '{"name": "No Ancient Grains", "price": null}',
      '{"name": "No Baby Spinach", "price": null}',
      '{"name": "No Red Onions", "price": null}',
      '{"name": "No Shishito Peppers with Broccolini", "price": null}',
      '{"name": "No Tomatoes", "price": null}',
      '{"name": "No Caramelized Onion Jam", "price": null}',
      '{"name": "No Chimichurri", "price": null}',
      '{"name": "No Grilled Lemon", "price": null}'
    ]::JSONB[]
  );

  PERFORM menu.insert_item_modifier(item_id, customize_id, 0);

  item_id := menu.insert_item(
    1,
    TRUE,
    'Smoky Chicken Elote Bowl',
    'Al pastor chicken, smoky corn & guajillo broth, zucchini, ancient grains, shredded cabbage, topped with tortilla strips, crema, cotija, pico de gallo, cilantro, and fresh lime (700 cal)',
    'SmokyChickenEloteBowl',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, bowl_id, NULL);
  PERFORM menu.insert_item_price(item_id, 17.95);

  customize_id := menu.insert_modifiers_and_options(
    'Change It Up',
    NULL,
    NULL,
    FALSE,
    0,
    10,
    0,
    ARRAY[
      '{"name": "No Ancient Grains", "price": null}',
      '{"name": "No Cilantro", "price": null}',
      '{"name": "No Crema", "price": null}',
      '{"name": "No Cotija Cheese", "price": null}',
      '{"name": "No Shredded Cabbage", "price": null}',
      '{"name": "No Tortilla Strips (G)", "price": null}',
      '{"name": "No Zucchini", "price": null}',
      '{"name": "No Pico De Gallo", "price": null}',
      '{"name": "Pico De Gallo (on the side)", "price": null}',
      '{"name": "No Fresh Lime", "price": null}'
    ]::JSONB[]
  );

  PERFORM menu.insert_item_modifier(item_id, customize_id, 0);

  item_id := menu.insert_item(
    2,
    TRUE,
    'Mediterranean Chicken Bowl',
    'Sliced, roasted chicken over cracked whole-grain bulgur tossed with lemon-dill vinaigrette & tahini yogurt sauce, baby spinach, roasted romanesco broccoli with tomatoes, yellow peppers & red onions, topped with pickled golden raisins, sumac (800 cal)',
    'MediterraneanChickenBowl',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, bowl_id, NULL);
  PERFORM menu.insert_item_price(item_id, 17.95);

  customize_id := menu.insert_modifiers_and_options(
    'Change It Up',
    NULL,
    NULL,
    FALSE,
    0,
    14,
    0,
    ARRAY[
      '{"name": "No Whole Grain Bulgur", "price": null}',
      '{"name": "No Baby Spinach", "price": null}',
      '{"name": "No Roasted Romanesco Broccoli with Tomatoes", "price": null}',
      '{"name": "No Yellow Peppers", "price": null}',
      '{"name": "No Red Onions", "price": null}',
      '{"name": "No Sumac", "price": null}',
      '{"name": "No Pickled Golden Raisins", "price": null}',
      '{"name": "Pickled Golden Raisins (on the side)", "price": null}',
      '{"name": "No Lemon Dill Vinaigrette", "price": null}',
      '{"name": "Lite Lemon Dill Vinaigrette", "price": null}',
      '{"name": "Lemon Dill Vinaigrette (on the side)", "price": null}',
      '{"name": "No Tahini Yogurt Sauce", "price": null}',
      '{"name": "Lite Tahini Yogurt Sauce", "price": null}',
      '{"name": "Tahini Yogurt Sauce (on the side)", "price": null}'
    ]::JSONB[]
  );

  PERFORM menu.insert_item_modifier(item_id, customize_id, 0);
END $$;
-- #endregion

-- #region KIDS
DO $$ 
DECLARE
  kids_id INTEGER := 6;
  vg_id INTEGER := 2;
  n_id INTEGER := 5;
  item_id INTEGER;
  side_id INTEGER;
  drink_id INTEGER;
  bread_id INTEGER;
  sauce_id INTEGER;
  customize_id INTEGER;
BEGIN
  side_id := menu.insert_modifiers_and_options(
    'Choice of side',
    NULL,
    NULL,
    TRUE,
    1,
    1,
    0,
    ARRAY[
      '{"name": "Sliced Apples", "price": null}',
      '{"name": "No Side", "price": null}'
    ]::JSONB[]
  );

  drink_id := menu.insert_modifiers_and_options(
    'Choice of beverage',
    NULL,
    NULL,
    TRUE,
    1,
    1,
    0,
    ARRAY[
      '{"name": "Organic Valley MIlk", "price": 2.76}',
      '{"name": "Bottled Water", "price": null}',
      '{"name": "No Drink", "price": null}'
    ]::JSONB[]
  );

  sauce_id := menu.insert_modifiers_and_options(
    'Choice of dipping sauces',
    NULL,
    NULL,
    TRUE,
    1,
    2,
    0,
    ARRAY[
      '{"name": "Ketchup (on the side)", "price": null}',
      '{"name": "Vegan Ranch (on the side)", "price": null}',
      '{"name": "No Sauce", "price": null}'
    ]::JSONB[]
  );

  item_id := menu.insert_item(
    0,
    TRUE,
    'Crispy Chicken Tenders',
    'with a side of ketchup or vegan ranch (320 cal)',
    'CrispyChickenTenders',
    '*available at select locations*'
  );

  PERFORM menu.insert_items_categories(item_id, kids_id, NULL);
  PERFORM menu.insert_item_price(item_id, 9.14);

  PERFORM menu.insert_item_modifier(item_id, side_id, 0);
  PERFORM menu.insert_item_modifier(item_id, drink_id, 1);
  PERFORM menu.insert_item_modifier(item_id, sauce_id, 2);
  
  bread_id := menu.insert_modifiers_and_options(
    'Toasted bread?',
    NULL,
    NULL,
    TRUE,
    1,
    1,
    0,
    ARRAY[
      '{"name": "Toasted", "price": null}',
      '{"name": "Fresh (Not Toasted)", "price": null}'
    ]::JSONB[]
  );

  sauce_id := menu.insert_modifiers_and_options(
    'Choice of dipping sauces',
    NULL,
    NULL,
    FALSE,
    0,
    2,
    0,
    ARRAY[
      '{"name": "Herb Mayo (on the side)", "price": null}',
      '{"name": "Yellow Mustard (on the side)", "price": null}'
    ]::JSONB[]
  );

  customize_id := menu.insert_modifiers_and_options(
    'Change it up',
    NULL,
    NULL,
    FALSE,
    0,
    2,
    0,
    ARRAY[
      '{"name": "Add Avocado", "price": 2.42}',
      '{"name": "Add Tomato", "price": null}'
    ]::JSONB[]
  );

  item_id := menu.insert_item(
    1,
    TRUE,
    'Grilled Turkey & Cheddar Sandwich',
    'add herb mayo, yellow mustard, or tomato by request (540 cal)',
    'TurkeyCheddar',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, kids_id, NULL);
  PERFORM menu.insert_item_price(item_id, 7.42);

  PERFORM menu.insert_item_modifier(item_id, side_id, 0);
  PERFORM menu.insert_item_modifier(item_id, drink_id, 1);
  PERFORM menu.insert_item_modifier(item_id, bread_id, 2);
  PERFORM menu.insert_item_modifier(item_id, sauce_id, 3);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 4);

  item_id := menu.insert_item(
    2,
    TRUE,
    'Grilled Cheddar Cheese Sandwich',
    'add tomato by request (610 cal)',
    'GrilledCheese',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, kids_id, NULL);
  PERFORM menu.insert_item_price(item_id, 7.42);
  PERFORM menu.insert_item_tag(item_id, vg_id);

  PERFORM menu.insert_item_modifier(item_id, side_id, 0);
  PERFORM menu.insert_item_modifier(item_id, drink_id, 1);
  PERFORM menu.insert_item_modifier(item_id, bread_id, 2);
  PERFORM menu.insert_item_modifier(item_id, customize_id, 3);

  item_id := menu.insert_item(
    3,
    TRUE,
    'Peanut Butter & Jelly',
    'creamy, natural peanut butter & strawberry jam (520 cal)',
    'PBJ',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, kids_id, NULL);
  PERFORM menu.insert_item_price(item_id, 7.42);
  PERFORM menu.insert_item_tag(item_id, vg_id);
  PERFORM menu.insert_item_tag(item_id, n_id);

  PERFORM menu.insert_item_modifier(item_id, side_id, 0);
  PERFORM menu.insert_item_modifier(item_id, drink_id, 1);
  PERFORM menu.insert_item_modifier(item_id, bread_id, 2);

  item_id := menu.insert_item(
    4,
    TRUE,
    'Cheddar Cheese Quesadilla',
    'melted cheddar cheese on a whole wheat tortilla (410 cal)',
    'Quesadilla',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, kids_id, NULL);
  PERFORM menu.insert_item_price(item_id, 6.10);
  PERFORM menu.insert_item_tag(item_id, vg_id);

  PERFORM menu.insert_item_modifier(item_id, side_id, 0);
  PERFORM menu.insert_item_modifier(item_id, drink_id, 1);
  PERFORM menu.insert_item_modifier(item_id, bread_id, 2);
END $$;
-- #endregion

-- #region DELI SIDES & SOUPS
DO $$ 
DECLARE
  deli_id INTEGER := 7;
  v_id INTEGER := 1;
  vg_id INTEGER := 2;
  gf_id INTEGER := 3;
  rgf_id INTEGER := 4;
  n_id INTEGER := 5;
  group_id INTEGER;
  item_id INTEGER;
BEGIN
  group_id := menu.insert_modifiers_and_options(
    'Select size',
    NULL,
    NULL,
    TRUE,
    1,
    1,
    0,
    ARRAY[
      '{"name": "Small (serves 1)", "price": 4.03}',
      '{"name": "Medium (serves 2)", "price": 6.84}',
      '{"name": "Large (serves 3-4)", "price": 12.13}'
    ]::JSONB[]
  );

  item_id := menu.insert_item(
    0,
    TRUE,
    'Dan Dan Noodle Salad',
    'ramen noodles, cucumber, sugar snap peas, rainbow carrots, scallions, cilantro, toasted cashews, sesame seeds, dan dan sauce',
    'DanDanNoodle',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, deli_id, 'deli sides');
  PERFORM menu.insert_item_tag(item_id, n_id);
  PERFORM menu.insert_item_modifier(item_id, group_id, NULL);

  item_id := menu.insert_item(
    1,
    TRUE,
    'Pickles & Dill Potato Salad',
    'classic creamy potato salad with a little kick from sweet-hot mustard, chopped pickles, fresh dill',
    'PickleDillPotatoSalad',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, deli_id, 'deli sides');
  PERFORM menu.insert_item_tag(item_id, v_id);
  PERFORM menu.insert_item_modifier(item_id, group_id, NULL);

  item_id := menu.insert_item(
    2,
    TRUE,
    'Basil Pesto Shells',
    'pasta shells, basil pesto, sun dried tomatoes, feta cheese, parmesan, arugula',
    'BasilPestoShells',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, deli_id, 'deli sides');
  PERFORM menu.insert_item_tag(item_id, vg_id);
  PERFORM menu.insert_item_modifier(item_id, group_id, NULL);

  item_id := menu.insert_item(
    3,
    TRUE,
    'Watermelon Street Cart Salad',
    'watermelon, cucumber, jicama, fresh mint, green onion, chile-lime vinaigrette',
    'WatermelonStreetCart',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, deli_id, 'deli sides');
  PERFORM menu.insert_item_tag(item_id, v_id);
  PERFORM menu.insert_item_tag(item_id, gf_id);
  PERFORM menu.insert_item_modifier(item_id, group_id, NULL);

  item_id := menu.insert_item(
    4,
    TRUE,
    'Oaxacan Potato Salad',
    'creamy potato salad with roasted corn, cotija cheese, cilantro, green onion, and a hint of jalapeño',
    'OaxacanPotatoSalad',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, deli_id, 'deli sides');
  PERFORM menu.insert_item_tag(item_id, vg_id);
  PERFORM menu.insert_item_tag(item_id, gf_id);
  PERFORM menu.insert_item_modifier(item_id, group_id, NULL);

  item_id := menu.insert_item(
    5,
    TRUE,
    'Southern Macaroni Salad',
    'creamy macaroni with pickled peppadew peppers, roasted red peppers, smoked gouda, spinach, celery, green onion, with a little kick of sriracha',
    'SouthernMacSalad',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, deli_id, 'deli sides');
  PERFORM menu.insert_item_tag(item_id, vg_id);
  PERFORM menu.insert_item_modifier(item_id, group_id, NULL);

  item_id := menu.insert_item(
    6,
    TRUE,
    'Spicy Curried Couscous',
    'with roasted cauliflower & carrots with Mendo''s signature spice mix',
    'Couscous',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, deli_id, 'deli sides');
  PERFORM menu.insert_item_tag(item_id, v_id);
  PERFORM menu.insert_item_modifier(item_id, group_id, NULL);

  item_id := menu.insert_item(
    7,
    TRUE,
    'Kale & Apple Rainbow Salad',
    'kale, granny smith apples, rainbow carrots, candied pecans, dried cranberries, toasted coconut, Thai basil vinaigrette',
    'KaleAppleRainbow',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, deli_id, 'deli sides');
  PERFORM menu.insert_item_tag(item_id, vg_id);
  PERFORM menu.insert_item_tag(item_id, gf_id);
  PERFORM menu.insert_item_tag(item_id, n_id);
  PERFORM menu.insert_item_modifier(item_id, group_id, NULL);

  item_id := menu.insert_item(
    8,
    TRUE,
    'Chopped Italian Chickpea Salad',
    'marinated artichokes, pepperoni, Mama Lil''s sweet hot peppers, grape tomatoes, chickpeas, kale, radicchio, red onion, parmesan, Italian dressing',
    'ItalianChickpeaSalad',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, deli_id, 'deli sides');
  PERFORM menu.insert_item_tag(item_id, gf_id);
  PERFORM menu.insert_item_modifier(item_id, group_id, NULL);

  item_id := menu.insert_item(
    9,
    TRUE,
    'Spicy Dijon Potato Salad',
    'uniquely creamy smashed potato salad with a kick!',
    'SpicyDijonPotato',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, deli_id, 'deli sides');
  PERFORM menu.insert_item_tag(item_id, v_id);
  PERFORM menu.insert_item_tag(item_id, gf_id);
  PERFORM menu.insert_item_modifier(item_id, group_id, NULL);

  item_id := menu.insert_item(
    10,
    TRUE,
    'Roasted Tomato Basil Soup',
    'a creamy puree of roasted tomatoes, garlic, and fresh basil',
    'RoastedTomatoSoup',
    NULL
  );

  group_id := menu.insert_modifiers_and_options(
    'Select size',
    NULL,
    NULL,
    TRUE,
    1,
    1,
    0,
    ARRAY[
      '{"name": "Cup", "price": 6.84}',
      '{"name": "Bowl", "price": 10.64}'
    ]::JSONB[]
  );

  PERFORM menu.insert_items_categories(item_id, deli_id, 'soups');
  PERFORM menu.insert_item_tag(item_id, vg_id);
  PERFORM menu.insert_item_modifier(item_id, group_id, NULL);

  item_id := menu.insert_item(
    11,
    TRUE,
    'Greek Lemon Chicken & Farro Soup',
    'a hearty chicken soup with whole-grain farro, carrot, celery, onion, baby spinach, and lemon',
    'GreekLemonChickenSoup',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, deli_id, 'soups');
  PERFORM menu.insert_item_modifier(item_id, group_id, NULL);

  item_id := menu.insert_item(
    12,
    TRUE,
    'Chicken Tortilla Soup',
    'smooth puree of roasted tomato, tomatillo, poblano, jalapeño, garlic, cumin, and corn tortillas, with shredded chicken',
    'ChickenTortilla',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, deli_id, 'soups');
  PERFORM menu.insert_item_tag(item_id, gf_id);
  PERFORM menu.insert_item_modifier(item_id, group_id, NULL);

  item_id := menu.insert_item(
    13,
    TRUE,
    'French Lentil & Kale Soup',
    'french lentils, kale, carrot, celery, onion, herbs, and garlic in a savory vegetable broth',
    'FrenchLentilKale',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, deli_id, 'soups');
  PERFORM menu.insert_item_tag(item_id, v_id);
  PERFORM menu.insert_item_tag(item_id, gf_id);
  PERFORM menu.insert_item_modifier(item_id, group_id, NULL);

  item_id := menu.insert_item(
    14,
    TRUE,
    'Turkey Sausage & Kale Soup',
    'a hearty blend of turkey sausage, kale, vegetables, brown rice, beans, & Parmesan cheese',
    'TurkeyKaleSoup',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, deli_id, 'soups');
  PERFORM menu.insert_item_modifier(item_id, group_id, NULL);

  item_id := menu.insert_item(
    15,
    TRUE,
    'Thai Sweet Potato Soup',
    'a puree of sweet potatoes, red bell peppers, shallots, coconut milk, lime, Thai red curry, ginger, lemongrass, almond butter',
    'ThaiSweetPotatoSoup',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, deli_id, 'soups');
  PERFORM menu.insert_item_tag(item_id, v_id);
  PERFORM menu.insert_item_tag(item_id, gf_id);
  PERFORM menu.insert_item_tag(item_id, n_id);
  PERFORM menu.insert_item_modifier(item_id, group_id, NULL);
END $$;
-- #endregion

-- #region COOKIES
DO $$ 
DECLARE
  cookies_id INTEGER := 8;
  item_id INTEGER;
BEGIN
  item_id := menu.insert_item(
    0,
    FALSE,
    'Lemon Cheesecake Cookie',
    NULL,
    'LemonCheesecakeCookie',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, cookies_id, NULL);
  PERFORM menu.insert_item_price(item_id, 3.57);
  PERFORM menu.insert_item_tag(item_id, 2);

  item_id := menu.insert_item(
    1,
    FALSE,
    'Chocolate Chunk Cookie',
    NULL,
    'ChocolateChunkCookie',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, cookies_id, NULL);
  PERFORM menu.insert_item_price(item_id, 3.57);
  PERFORM menu.insert_item_tag(item_id, 2);

  item_id := menu.insert_item(
    2,
    FALSE,
    'Ginger Molasses Cookie',
    NULL,
    'GingerMolassesCookie',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, cookies_id, NULL);
  PERFORM menu.insert_item_price(item_id, 3.57);
  PERFORM menu.insert_item_tag(item_id, 2);

  item_id := menu.insert_item(
    3,
    FALSE,
    'Plant-Based Oat Hemp Date Cookie',
    NULL,
    'OatHempDateCookie',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, cookies_id, NULL);
  PERFORM menu.insert_item_price(item_id, 3.57);
  PERFORM menu.insert_item_tag(item_id, 1);
END $$;
-- #endregion

-- #region CHIPS
DO $$ 
DECLARE
  chips_id INTEGER := 9;
  item_id INTEGER;
BEGIN
  item_id := menu.insert_item(
    0,
    FALSE,
    'Joe''s Classic Chips',
    NULL,
    'ClassicChips',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, chips_id, NULL);
  PERFORM menu.insert_item_price(item_id, 3.57);

  item_id := menu.insert_item(
    1,
    FALSE,
    'BBQ Chips',
    NULL,
    'BBQChips',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, chips_id, NULL);
  PERFORM menu.insert_item_price(item_id, 3.57);

  item_id := menu.insert_item(
    2,
    FALSE,
    'Dill Pickle Chips',
    NULL,
    'DillPickleChips',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, chips_id, NULL);
  PERFORM menu.insert_item_price(item_id, 3.57);

  item_id := menu.insert_item(
    3,
    FALSE,
    'Mama Zuma''s Habanero Chips',
    NULL,
    'HabaneroChips',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, chips_id, NULL);
  PERFORM menu.insert_item_price(item_id, 3.57);
END $$;
-- #endregion

-- #region BEVERAGES
DO $$ 
DECLARE
  bev_id INTEGER := 10;
  item_id INTEGER;
BEGIN
  item_id := menu.insert_item(
    0,
    FALSE,
    'Coke (Can)',
    NULL,
    'CokeCan',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, bev_id, NULL);
  PERFORM menu.insert_item_price(item_id, 3.16);

  item_id := menu.insert_item(
    1,
    FALSE,
    'Diet Coke (Can)',
    NULL,
    'DietCokeCan',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, bev_id, NULL);
  PERFORM menu.insert_item_price(item_id, 3.16);

  item_id := menu.insert_item(
    2,
    FALSE,
    'Sprite (Can)',
    NULL,
    'SpriteCan',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, bev_id, NULL);
  PERFORM menu.insert_item_price(item_id, 3.16);

  item_id := menu.insert_item(
    3,
    FALSE,
    'Orange Mango Spindrift (Can)',
    NULL,
    'OrangeMangoSpindriftCan',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, bev_id, NULL);
  PERFORM menu.insert_item_price(item_id, 3.74);

  item_id := menu.insert_item(
    4,
    FALSE,
    'Raspberry Lime Spindrift (Can)',
    NULL,
    'RaspberryLimeSpindriftCan',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, bev_id, NULL);
  PERFORM menu.insert_item_price(item_id, 3.74);

  item_id := menu.insert_item(
    5,
    FALSE,
    'San Pellegrino (Can)',
    NULL,
    'SanPellegrinoCan',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, bev_id, NULL);
  PERFORM menu.insert_item_price(item_id, 3.74);

  item_id := menu.insert_item(
    6,
    FALSE,
    'Bottled Water',
    NULL,
    'BottledWater',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, bev_id, NULL);
  PERFORM menu.insert_item_price(item_id, 3.05);
END $$;
-- #endregion

-- #region MARKETPLACE
DO $$ 
DECLARE
  market_id INTEGER := 11;
  item_id INTEGER;
BEGIN
  item_id := menu.insert_item(
    0,
    FALSE,
    'Bottle of Chipotle Vinaigrette',
    'Bottle size: 12oz',
    'ChipotleVinaigrette',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, market_id, NULL);
  PERFORM menu.insert_item_price(item_id, 7.19);

  item_id := menu.insert_item(
    1,
    FALSE,
    'Bottle of Miso Mustard Vinaigrette',
    'Bottle size: 12oz',
    'MisoMustardVinaigrette',
    NULL
  );

  PERFORM menu.insert_items_categories(item_id, market_id, NULL);
  PERFORM menu.insert_item_price(item_id, 7.19);
END $$;
-- #endregion