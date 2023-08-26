INSERT INTO
  menu.menu_categories
  (
    "category_id",
    "name",
    "created_at",
    "updated_at"
  ) 
VALUES
  (DEFAULT, 'chef''s creations', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 'cheffy sandwiches', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 'craveable classics', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 'soulful salads', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, '1/2 sandwich combos', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 'kids', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 'bowls', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 'deli sides', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 'soups', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO
  menu.menu_tags
  (
    "tag_id",
    "name",
    "description",
    "created_at",
    "updated_at"
  )
VALUES
  (DEFAULT, 'V', 'Vegan', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 'VG', 'Vegeterian', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 'GF', 'Gluten-Free', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 'RGF', 'Can be Requested Gluten-Free', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 'N', 'Contains Nuts', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO
  menu.menu_sizes
  (
    "size_id",
    "name",
    "created_at",
    "updated_at"
  )
VALUES
  (DEFAULT, 'small', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 'medium', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 'large', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 'cup', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 'bowl', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 'small deli side', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 'medium deli side', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO
  menu.menu_items
  (
    "menu_item_id",
    "name",
    "description",
    "status",
    "photo_url",
    "created_at",
    "updated_at"
  )
VALUES
  (
    DEFAULT,
    'Hot Honey Peach & Prosciutto', 'italian prosciutto & sliced peaches with fresh mozzarella, crushed honey roasted almonds, Calabrian chili aioli, hot peach honey, arugula on a toasted sesame roll',
    'active',
    'PeachProsciutto.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Strawberry Fields Salad with Chicken',
    'shaved, roasted chicken breast, strawberries, watermelon radish, shaved fennel, fresh mint, red onions, goat gouda, toasted pistachios, mixed greens, romaine with greek yogurt poppyseed dressing',
    'active',
    'StrawberryFields.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    '“Not So Fried” Chicken',
    'shaved, roasted chicken breast topped with Mendo''s krispies, herb aioli, mustard pickle slaw, tomatoes, pickled red onions on toasted ciabatta with a side of tangy mustard barbeque sauce or mustard pickle remoulade',
    'active',
    'NotSoFriedChicken.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Sweet Heat Crispy Thai Chicken',
    'air-fried crispy chicken tenders, Thai basil slaw, pickled daikon & carrots, sweet chili sauce, sriracha mayo, and fried shallots on a toasted sesame brioche bun',
    'active',
    'ThaiChickenSandwich.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Peruvian Steak',
    'spicy aji amarillo marinated steak with Oaxacan cheese, herb aioli, red onions, tomatoes, shredded romaine on a toasted potato roll',
    'active',
    'PeruvianSteak.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Prosciutto & Chicken',
    'italian prosciutto & shaved, roasted chicken breast with fresh mozzarella, crushed honey roasted almonds, basil pesto, balsamic glaze drizzle, tomatoes on panini-pressed ciabatta',
    'active',
    'ProsciuttoChicken.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Chimichurri Steak & Bacon',
    'roasted, carved steak and applewood smoked bacon topped with marinated red peppers, caramelized onion jam, chimichurri, shredded romaine, herb aioli on a toasted sesame roll',
    'active',
    'ChimichurriSteakSandwich.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Mendo''s Original Pork Belly Banh Mi', 'our Chef''s playful take on the popular Vietnamese sandwich with braised, caramelized pork belly, pickled daikon & carrots, cilantro, cucumbers, jalapeños, Thai basil, sriracha mayo on panini-pressed ciabatta',
    'active',
    'BanhMi.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Vegan Banh Mi',
    'organic marinated, baked tofu with vegan aioli, sweet chili sauce, pickled daikon & carrots, cucumbers, jalapeños, Thai basil, cilantro on panini-pressed ciabatta',
    'active',
    'VeganBahnMi.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Chicken Parm Dip',
    'shaved, roasted chicken breast, Mendo''s krispies, melted mozzarella and Grana Padano cheeses, pomodoro sauce, Italian basil, Calabrian chili aioli on a toasted sesame roll served with an extra side of pomodoro sauce for dipping',
    'active',
    'ChickenParmDip.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Italian Roast Beef',
    'shaved roast beef, mozzarella, Chicago-style mild giardiniera, tomatoes, Vidalia onion, shredded romaine, Italian herb & cheese aioli on a toasted sesame roll',
    'active',
    'ItalianRoastBeef.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'The Farm Club',
    'shaved, roasted turkey breast, smashed avocado, applewood smoked bacon, herb aioli, tomatoes, mixed greens, pickled red onions on Mom''s seeded whole wheat',
    'active',
    'FarmClub.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Chicken Pesto Caprese',
    'shaved, roasted chicken breast, fresh mozzarella, marinated red peppers, basil pesto, mixed greens, balsamic glaze drizzle on panini-pressed ciabatta',
    'active',
    'ChickenPestoCaprese.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Turkey Avo Salsa Verde',
    'shaved, roasted turkey breast, smashed avocado, smoked gouda, cotija cheese, Mama Lil''s sweet hot peppers, jalapeño salsa aioli, tomatoes, shredded romaine, red onions on toasted ciabatta served with a side of jalapeño salsa verde',
    'active',
    'TurkeyAvoSalsaVerde.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Thai Mango Salad',
    'shaved, roasted chicken breast, ramen noodles, napa cabbage & kale slaw with carrots & bean sprouts, baby spinach, sliced mango, honey roasted almonds, pickled daikon & carrots, Thai basil mint, cilantro, lime, and fried shallots with Thai almond dressing',
    'active',
    'ThaiMango.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Avocado & Quinoa Superfood Ensalada',
    'chopped romaine, curly kale, quinoa & millet, housemade superfood krunchies, succotash with roasted corn, black beans & jicama, red onions, cilantro, cotija cheese, grape tomatoes, avocado with chipotle vinaigrette',
    'active',
    'AvoQuinoa.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'The Impossible Taco Salad',
    'plant-based Impossible chorizo, housemade superfood krunchies, chopped romaine, curly kale, succotash with roasted corn, black beans & jicama, red onions, cilantro, grape tomatoes, avocado with house vegan chipotle ranch',
    'active',
    'ImpossibleTaco.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Pink Lady Beets & Goat Cheese Salad',
    'shaved, roasted chicken breast, honey and herb marinated goat cheese, pink lady beets, green apples, dried cranberries, crushed honey roasted almonds, red onions, mixed greens, chopped romaine with citrus vinaigrette',
    'active',
    'PinkLady.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'The Modern Caesar',
    'curly kale, chopped romaine, housemade superfood krunchies, shaved Grana Padano cheese, red onions, grape tomatoes, avocado, lemon squeeze with classic Caesar dressing',
    'active',
    'ModernCesear.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Mama Chen''s Chinese Chicken Salad',
    'shaved, roasted chicken breast, napa cabbage & kale slaw, carrots, bean sprouts, baby spinach, chopped romaine, scallions, cilantro, toasted cashews, crispy wontons with miso mustard sesame dressing',
    'active',
    'MamaChensChicken.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    '1/2 “Not So Fried” Chicken',
    'shaved, roasted chicken breast topped with Mendo''s krispies, herb aioli, mustard pickle slaw, tomatoes, pickled red onions on toasted ciabatta with a side of tangy mustard barbecue sauce or mustard pickle remoulade',
    'active',
    'BPNotSoFriedChicken.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    '1/2 Vegan Banh Mi',
    'organic marinated, baked tofu with vegan aioli, sweet chili sauce, pickled daikon & carrots, cucumbers, jalapeños, Thai basil, cilantro on panini-pressed ciabatta',
    'active',
    'BPVeganBanhMi.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    '1/2 Italian Roast Beef',
    'shaved roast beef, mozzarella, Chicago-style mild giardiniera, tomatoes, Vidalia onion, shredded romaine, Italian herb & cheese aioli on a toasted sesame roll',
    'active',
    'BPItalianRoastBeef.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    '1/2 The Farm Club',
    'shaved, roasted turkey breast, smashed avocado, applewood smoked bacon, herb aioli, tomatoes, mixed greens, pickled red onions on Mom''s seeded whole wheat',
    'active',
    'BPFarmClub.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    '1/2 Chicken Pesto Caprese',
    'shaved, roasted chicken breast, fresh mozzarella, marinated red peppers, basil pesto, mixed greens, balsamic glaze drizzle on panini-pressed ciabatta',
    'active',
    'BPChickenPestoCaprese.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    '1/2 Turkey Avo Salsa Verde',
    'shaved, roasted turkey breast, smashed avocado, smoked gouda, cotija cheese, Mama Lil''s sweet hot peppers, jalapeño salsa aioli, tomatoes, shredded romaine, red onions on toasted ciabatta',
    'active',
    'BPTurkeyAvo.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Crispy Chicken Tenders',
    'with a side of ketchup or vegan ranch',
    'active',
    'CrispyChickenTenders.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Grilled Turkey & Cheddar Sandwich',
    'add herb mayo, yellow mustard, or tomato by request',
    'active',
    'TurkeyCheddar.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Grilled Cheddar Cheese Sandwich',
    'add tomato by request',
    'active',
    'GrilledCheese.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Peanut Butter & Jelly',
    'creamy, natural peanut butter & strawberry jam',
    'active',
    'PBJ.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Cheddar Cheese Quesadilla',
    'melted cheddar cheese on a whole wheat tortilla',
    'active',
    'Quesadilla.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Watermelon Street Cart Salad',
    'watermelon, cucumber, jicama, fresh mint, green onion, chile-lime vinaigrette',
    'active',
    'WatermelonStreetCart.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Oaxacan Potato Salad',
    'creamy potato salad with roasted corn, cotija cheese, cilantro, green onion, and a hint of jalapeño',
    'active',
    'OaxacanPotatoSalad.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Southern Macaroni Salad',
    'creamy macaroni with pickled peppadew peppers, roasted red peppers, smoked gouda, spinach, celery, green onion, with a little kick of sriracha',
    'active',
    'SouthernMacSalad.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Spicy Curried Couscous',
    'with roasted cauliflower & carrots with Mendo''s signature spice mix',
    'active',
    'Couscous.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Kale & Apple Rainbow Salad',
    'kale, granny smith apples, rainbow carrots, candied pecans, dried cranberries, toasted coconut, Thai basil vinaigrette',
    'active',
    'KaleAppleRainbow.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Chicken Tortilla Soup',
    'smooth puree of roasted tomato, tomatillo, poblano, jalapeño, garlic, cumin, and corn tortillas, with shredded chicken',
    'active',
    'ChickenTortilla.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'French Lentil & Kale Soup',
    'french lentils, kale, carrot, celery, onion, herbs, and garlic in a savory vegetable broth',
    'active',
    'FrenchLentilKale.jpg',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  );

INSERT INTO
  menu.menu_items_menu_categories
  (
    "menu_item_id",
    "category_id",
    "created_at",
    "updated_at"
  )
VALUES
  (1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (4, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (5, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (6, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (7, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (8, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (9, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (10, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (11, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (12, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (13, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (14, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (15, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (16, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (17, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (18, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (19, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (20, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (21, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (22, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (23, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (24, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (25, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (26, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (27, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (28, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (29, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (30, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (31, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (32, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (33, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (34, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (35, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (36, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (37, 9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (38, 9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO
  menu.menu_item_prices
  (
    "price_id",
    "menu_item_id",
    "size_id",
    "base_price",
    "created_at",
    "updated_at"
  )
VALUES
  (DEFAULT, 1, NULL, 13.25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 2, NULL, 13.25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 3, NULL, 12.1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 4, NULL, 13.35, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 5, NULL, 14.35, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 6, NULL, 12.65, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 7, NULL, 14.35, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 8, NULL, 13.05, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 9, NULL, 11.5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 10, NULL, 13.1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 11, NULL, 13.75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 12, NULL, 11.95, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 13, NULL, 11.25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 14, NULL, 11.75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 15, NULL, 11.75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 16, NULL, 11.75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 17, NULL, 11.75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 18, NULL, 11.75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 19, NULL, 11.75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 20, NULL, 11.75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 21, 6, 10.95, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 22, 6, 10.95, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 23, 6, 10.95, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 24, 6, 10.95, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 25, 6, 10.95, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 26, 6, 10.95, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 21, 7, 11.45, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 22, 7, 11.45, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 23, 7, 11.45, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 24, 7, 11.45, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 25, 7, 11.45, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 26, 7, 11.45, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 27, NULL, 7.5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 28, NULL, 6.1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 29, NULL, 6.1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 30, NULL, 6.1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 31, NULL, 6.1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 32, 1, 2.85, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 33, 1, 2.85, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 34, 1, 2.85, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 35, 1, 2.85, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 36, 1, 2.85, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 32, 2, 4.95, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 33, 2, 4.95, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 34, 2, 4.95, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 35, 2, 4.95, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 36, 2, 4.95, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 32, 3, 8.95, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 33, 3, 8.95, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 34, 3, 8.95, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 35, 3, 8.95, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 36, 3, 8.95, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 37, 4, 4.50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 38, 4, 4.50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 37, 5, 7.50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (DEFAULT, 38, 5, 7.50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO
  menu.menu_items_menu_tags
  (
    "menu_item_id",
    "tag_id",
    "created_at",
    "updated_at"
  )
VALUES
  (1, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (1, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (5, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (6, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (6, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (7, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (9, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (11, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (12, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (13, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (14, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (15, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (16, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (16, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (17, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (17, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (18, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (18, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (19, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (20, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (22, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (22, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (23, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (24, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (25, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (26, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (29, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (30, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (30, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (31, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (32, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (32, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (33, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (33, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (34, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (35, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (36, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (36, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (36, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (37, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (38, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (38, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);