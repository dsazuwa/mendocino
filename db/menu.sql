DROP TYPE IF EXISTS "enum_menu_category" CASCADE;

DROP TYPE IF EXISTS "enum_menu_status" CASCADE;

DROP TABLE IF EXISTS "menu" CASCADE;

DROP TABLE IF EXISTS "menu_tags" CASCADE;

DROP TABLE IF EXISTS "menu_menu_tags" CASCADE;

CREATE TYPE enum_menu_category AS ENUM (
  'chef''s creations',
  'cheffy sandwiches',
  'craveable classics',
  'soulful salads',
  '1/2 sandwich combos',
  'kids',
  'bowls',
  'deli sides & soups'
);

CREATE TYPE enum_menu_status AS ENUM (
  'available',
  'out of stock',
  'discontinued',
  'special',
  'coming soon'
);

CREATE TABLE IF NOT EXISTS menu (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL UNIQUE,
  "description" VARCHAR(255) NOT NULL,
  "category" enum_menu_category NOT NULL,
  "status" enum_menu_status NOT NULL,
  "photo_url" VARCHAR(50) NOT NULL,
  "price" DECIMAL(10, 4) NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE,
  "updated_at" TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS menu_tags (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(10) NOT NULL UNIQUE,
  "description" VARCHAR(50) NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE,
  "updated_at" TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS menu_menu_tags (
  "menu_id" INTEGER REFERENCES menu (id) ON DELETE CASCADE ON UPDATE CASCADE,
  "menu_tag_id" INTEGER REFERENCES menu_tags (id) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY ("menu_id", "menu_tag_id")
);

INSERT INTO
  menu (
    "id",
    "name",
    "description",
    "category",
    "status",
    "photo_url",
    "price",
    "created_at",
    "updated_at"
  )
VALUES
  -- chef's creations (1)
  (
    DEFAULT,
    'Hot Honey Peach & Prosciutto',
    'italian prosciutto & sliced peaches with fresh mozzarella, crushed honey roasted almonds, Calabrian chili aioli, hot peach honey, arugula on a toasted sesame roll',
    'chef''s creations',
    'available',
    'PeachProsciutto.jpg',
    13.25,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Strawberry Fields Salad with Chicken',
    'shaved, roasted chicken breast, strawberries, watermelon radish, shaved fennel, fresh mint, red onions, goat gouda, toasted pistachios, mixed greens, romaine with greek yogurt poppyseed dressing',
    'chef''s creations',
    'available',
    'StrawberryFields.jpg',
    13.95,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  -- cheffy sandwiches (3)
  (
    DEFAULT,
    '“Not So Fried” Chicken',
    'shaved, roasted chicken breast topped with Mendo''s krispies, herb aioli, mustard pickle slaw, tomatoes, pickled red onions on toasted ciabatta with a side of tangy mustard barbeque sauce or mustard pickle remoulade',
    'cheffy sandwiches',
    'available',
    'NotSoFriedChicken.jpg',
    12.1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Sweet Heat Crispy Thai Chicken',
    'air-fried crispy chicken tenders, Thai basil slaw, pickled daikon & carrots, sweet chili sauce, sriracha mayo, and fried shallots on a toasted sesame brioche bun',
    'cheffy sandwiches',
    'available',
    'ThaiChickenSandwich.jpg',
    13.35,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Peruvian Steak',
    'spicy aji amarillo marinated steak with Oaxacan cheese, herb aioli, red onions, tomatoes, shredded romaine on a toasted potato roll',
    'cheffy sandwiches',
    'available',
    'PeruvianSteak.jpg',
    14.35,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Prosciutto & Chicken',
    'italian prosciutto & shaved, roasted chicken breast with fresh mozzarella, crushed honey roasted almonds, basil pesto, balsamic glaze drizzle, tomatoes on panini-pressed ciabatta',
    'cheffy sandwiches',
    'available',
    'ProsciuttoChicken.jpg',
    12.65,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Chimichurri Steak & Bacon',
    'roasted, carved steak and applewood smoked bacon topped with marinated red peppers, caramelized onion jam, chimichurri, shredded romaine, herb aioli on a toasted sesame roll',
    'cheffy sandwiches',
    'available',
    'ChimichurriSteakSandwich.jpg',
    14.35,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Mendo''s Original Pork Belly Banh Mi',
    'our Chef''s playful take on the popular Vietnamese sandwich with braised, caramelized pork belly, pickled daikon & carrots, cilantro, cucumbers, jalapeños, Thai basil, sriracha mayo on panini-pressed ciabatta',
    'cheffy sandwiches',
    'available',
    'BanhMi.jpg',
    13.05,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Vegan Banh Mi',
    'organic marinated, baked tofu with vegan aioli, sweet chili sauce, pickled daikon & carrots, cucumbers, jalapeños, Thai basil, cilantro on panini-pressed ciabatta',
    'cheffy sandwiches',
    'available',
    'VeganBahnMi.jpg',
    11.5,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  -- craveable classics (10)
  (
    DEFAULT,
    'Chicken Parm Dip',
    'shaved, roasted chicken breast, Mendo''s krispies, melted mozzarella and Grana Padano cheeses, pomodoro sauce, Italian basil, Calabrian chili aioli on a toasted sesame roll served with an extra side of pomodoro sauce for dipping',
    'craveable classics',
    'available',
    'ChickenParmDip.jpg',
    13.1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Italian Roast Beef',
    'shaved roast beef, mozzarella, Chicago-style mild giardiniera, tomatoes, Vidalia onion, shredded romaine, Italian herb & cheese aioli on a toasted sesame roll',
    'craveable classics',
    'available',
    'ItalianRoastBeef.jpg',
    13.75,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'The Farm Club',
    'shaved, roasted turkey breast, smashed avocado, applewood smoked bacon, herb aioli, tomatoes, mixed greens, pickled red onions on Mom''s seeded whole wheat',
    'craveable classics',
    'available',
    'FarmClub.jpg',
    11.95,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Chicken Pesto Caprese',
    'shaved, roasted chicken breast, fresh mozzarella, marinated red peppers, basil pesto, mixed greens, balsamic glaze drizzle on panini-pressed ciabatta',
    'craveable classics',
    'available',
    'ChickenPestoCaprese.jpg',
    11.25,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Turkey Avo Salsa Verde',
    'shaved, roasted turkey breast, smashed avocado, smoked gouda, cotija cheese, Mama Lil''s sweet hot peppers, jalapeño salsa aioli, tomatoes, shredded romaine, red onions on toasted ciabatta served with a side of jalapeño salsa verde',
    'craveable classics',
    'available',
    'TurkeyAvoSalsaVerde.jpg',
    11.75,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  -- soulful salads (15)
  (
    DEFAULT,
    'Thai Mango Salad',
    'shaved, roasted chicken breast, ramen noodles, napa cabbage & kale slaw with carrots & bean sprouts, baby spinach, sliced mango, honey roasted almonds, pickled daikon & carrots, Thai basil mint, cilantro, lime, and fried shallots with Thai almond dressing',
    'soulful salads',
    'available',
    'ThaiMango.jpg',
    14.75,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Avocado & Quinoa Superfood Ensalada',
    'chopped romaine, curly kale, quinoa & millet, housemade superfood krunchies, succotash with roasted corn, black beans & jicama, red onions, cilantro, cotija cheese, grape tomatoes, avocado with chipotle vinaigrette',
    'soulful salads',
    'available',
    'AvoQuinoa.jpg',
    12.35,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'The Impossible Taco Salad',
    'plant-based Impossible chorizo, housemade superfood krunchies, chopped romaine, curly kale, succotash with roasted corn, black beans & jicama, red onions, cilantro, grape tomatoes, avocado with house vegan chipotle ranch',
    'soulful salads',
    'available',
    'ImpossibleTaco.jpg',
    12.95,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Pink Lady Beets & Goat Cheese Salad',
    'shaved, roasted chicken breast, honey and herb marinated goat cheese, pink lady beets, green apples, dried cranberries, crushed honey roasted almonds, red onions, mixed greens, chopped romaine with citrus vinaigrette',
    'soulful salads',
    'available',
    'PinkLady.jpg',
    13.75,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'The Modern Caesar',
    'curly kale, chopped romaine, housemade superfood krunchies, shaved Grana Padano cheese, red onions, grape tomatoes, avocado, lemon squeeze with classic Caesar dressing',
    'soulful salads',
    'available',
    'ModernCesear.jpg',
    11.15,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Mama Chen''s Chinese Chicken Salad',
    'shaved, roasted chicken breast, napa cabbage & kale slaw, carrots, bean sprouts, baby spinach, chopped romaine, scallions, cilantro, toasted cashews, crispy wontons with miso mustard sesame dressing',
    'soulful salads',
    'available',
    'MamaChensChicken.jpg',
    13.25,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  -- 1/2 sandwich combos (21)
  (
    DEFAULT,
    '1/2 “Not So Fried” Chicken',
    'shaved, roasted chicken breast topped with Mendo''s krispies, herb aioli, mustard pickle slaw, tomatoes, pickled red onions on toasted ciabatta with a side of tangy mustard barbecue sauce or mustard pickle remoulade',
    '1/2 sandwich combos',
    'available',
    'BPNotSoFriedChicken.jpg',
    10.95,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    '1/2 Vegan Banh Mi',
    'organic marinated, baked tofu with vegan aioli, sweet chili sauce, pickled daikon & carrots, cucumbers, jalapeños, Thai basil, cilantro on panini-pressed ciabatta',
    '1/2 sandwich combos',
    'available',
    'BPVeganBanhMi.jpg',
    10.95,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    '1/2 Italian Roast Beef',
    'shaved roast beef, mozzarella, Chicago-style mild giardiniera, tomatoes, Vidalia onion, shredded romaine, Italian herb & cheese aioli on a toasted sesame roll',
    '1/2 sandwich combos',
    'available',
    'BPItalianRoastBeef.jpg',
    10.95,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    '1/2 The Farm Club',
    'shaved, roasted turkey breast, smashed avocado, applewood smoked bacon, herb aioli, tomatoes, mixed greens, pickled red onions on Mom''s seeded whole wheat',
    '1/2 sandwich combos',
    'available',
    'BPFarmClub.jpg',
    10.95,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    '1/2 Chicken Pesto Caprese',
    'shaved, roasted chicken breast, fresh mozzarella, marinated red peppers, basil pesto, mixed greens, balsamic glaze drizzle on panini-pressed ciabatta',
    '1/2 sandwich combos',
    'available',
    'BPChickenPestoCaprese.jpg',
    10.95,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    '1/2 Turkey Avo Salsa Verde',
    'shaved, roasted turkey breast, smashed avocado, smoked gouda, cotija cheese, Mama Lil''s sweet hot peppers, jalapeño salsa aioli, tomatoes, shredded romaine, red onions on toasted ciabatta',
    '1/2 sandwich combos',
    'available',
    'BPTurkeyAvo.jpg',
    10.95,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  -- kids (27)
  (
    DEFAULT,
    'Crispy Chicken Tenders',
    'with a side of ketchup or vegan ranch',
    'kids',
    'available',
    'CrispyChickenTenders.jpg',
    7.5,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Grilled Turkey & Cheddar Sandwich',
    'add herb mayo, yellow mustard, or tomato by request',
    'kids',
    'available',
    'TurkeyCheddar.jpg',
    6.1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Grilled Cheddar Cheese Sandwich',
    'add tomato by request',
    'kids',
    'available',
    'GrilledCheese.jpg',
    6.1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Peanut Butter & Jelly',
    'creamy, natural peanut butter & strawberry jam',
    'kids',
    'available',
    'PBJ.jpg',
    6.1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Cheddar Cheese Quesadilla',
    'melted cheddar cheese on a whole wheat tortilla',
    'kids',
    'available',
    'Quesadilla.jpg',
    6.1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  -- deli sides & soups (32)
  (
    DEFAULT,
    'Watermelon Street Cart Salad',
    'watermelon, cucumber, jicama, fresh mint, green onion, chile-lime vinaigrette',
    'deli sides & soups',
    'available',
    'WatermelonStreetCart.jpg',
    3.1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Oaxacan Potato Salad',
    'creamy potato salad with roasted corn, cotija cheese, cilantro, green onion, and a hint of jalapeño',
    'deli sides & soups',
    'available',
    'OaxacanPotatoSalad.jpg',
    3.1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Southern Macaroni Salad',
    'creamy macaroni with pickled peppadew peppers, roasted red peppers, smoked gouda, spinach, celery, green onion, with a little kick of sriracha',
    'deli sides & soups',
    'available',
    'SouthernMacSalad.jpg',
    3.1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Spicy Curried Couscous',
    'with roasted cauliflower & carrots with Mendo''s signature spice mix',
    'deli sides & soups',
    'available',
    'Couscous.jpg',
    3.1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Kale & Apple Rainbow Salad',
    'kale, granny smith apples, rainbow carrots, candied pecans, dried cranberries, toasted coconut, Thai basil vinaigrette',
    'deli sides & soups',
    'available',
    'KaleAppleRainbow.jpg',
    3.1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'Chicken Tortilla Soup',
    'smooth puree of roasted tomato, tomatillo, poblano, jalapeño, garlic, cumin, and corn tortillas, with shredded chicken',
    'deli sides & soups',
    'available',
    'ChickenTortilla.jpg',
    5.2,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'French Lentil & Kale Soup',
    'french lentils, kale, carrot, celery, onion, herbs, and garlic in a savory vegetable broth',
    'deli sides & soups',
    'available',
    'FrenchLentilKale.jpg',
    5.2,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  );

INSERT INTO
  menu_tags (
    "id",
    "name",
    "description",
    "created_at",
    "updated_at"
  )
VALUES
  (
    DEFAULT,
    'V',
    'Vegan',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'VG',
    'Vegeterian',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'GF',
    'Gluten-Free',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'RGF',
    'Can be Requested Gluten-Free',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    'N',
    'Contains Nuts',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  );

INSERT INTO
  menu_menu_tags ("menu_id", "menu_tag_id")
VALUES
  (1, 4),
  (1, 5),
  (2, 3),
  (2, 5),
  (5, 4),
  (6, 4),
  (6, 5),
  (7, 4),
  (9, 5),
  (11, 4),
  (12, 4),
  (13, 4),
  (14, 4),
  (15, 5),
  (16, 2),
  (16, 3),
  (17, 1),
  (17, 3),
  (18, 3),
  (18, 5),
  (19, 3),
  (20, 5),
  (22, 1),
  (22, 4),
  (23, 4),
  (24, 4),
  (25, 4),
  (26, 4),
  (29, 2),
  (30, 2),
  (30, 5),
  (31, 2),
  (32, 1),
  (32, 3),
  (33, 2),
  (33, 3),
  (34, 2),
  (35, 1),
  (36, 2),
  (36, 3),
  (36, 5),
  (37, 3),
  (38, 1),
  (38, 3);