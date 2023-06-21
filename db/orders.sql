-- Populate users table first
\i db/users.sql;

DROP TYPE IF EXISTS "enum_orders_status" CASCADE;

DROP TABLE IF EXISTS "orders" CASCADE;

DROP TABLE IF EXISTS "order_items" CASCADE;

CREATE TYPE enum_orders_status AS ENUM (
  'pending',
  'processing',
  'confirmed',
  'delivered'
);

CREATE TABLE IF NOT EXISTS orders (
  "id" SERIAL PRIMARY KEY,
  "uuid" UUID NOT NULL UNIQUE,
  "user_id" INTEGER REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE,
  "total" DECIMAL(19, 2) NOT NULL,
  "status" enum_orders_status NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS order_items (
  "id" SERIAL PRIMARY KEY,
  "order_id" INTEGER REFERENCES orders (id) ON DELETE CASCADE ON UPDATE CASCADE,
  "menu_id" INTEGER REFERENCES menu (id) ON DELETE SET NULL ON UPDATE CASCADE,
  "quantity" INTEGER NOT NULL CHECK ("quantity" >= 1),
  "price" DECIMAL(10, 2) NOT NULL CHECK ("price" >= 0),
  UNIQUE ("order_id", "menu_id")
);

-- 
-- helper function to generate a random date with timestamp
-- 
CREATE OR REPLACE FUNCTION generate_random_datetime()
  RETURNS TIMESTAMP AS $$
DECLARE
  start_date CONSTANT TIMESTAMP := '2023-01-01 10:00:00';
  end_date CONSTANT TIMESTAMP := '2023-07-01 20:00:00';
  random_diff INTERVAL := end_date - start_date;
  random_time INTERVAL;
BEGIN
  PERFORM setseed(random());

  random_time := random() * random_diff;

  RETURN start_date + random_time;
END;
$$ LANGUAGE plpgsql;


-- 
-- helper function to generate random unique menu id numbers
-- returns an array of unique menu IDs
-- 
CREATE OR REPLACE FUNCTION generate_random_unique_numbers(range_start INT, range_end INT, num_numbers INT)
  RETURNS INT[] AS $$
DECLARE
  numbers INT[] := '{}';
  generated_count INT := 0;
  random_number INT;
BEGIN
  WHILE generated_count < num_numbers LOOP
    random_number := range_start + floor(random() * (range_end - range_start + 1));

    IF random_number = ANY(numbers) THEN
      CONTINUE;
    END IF;

    numbers := numbers || random_number;
    generated_count := generated_count + 1;
  END LOOP;

  RETURN numbers;
END;
$$ LANGUAGE plpgsql;

-- 
-- function to create random order items for the given order
-- returns the order total
-- 
CREATE OR REPLACE FUNCTION create_order_items(order_id INTEGER)
  RETURNS NUMERIC AS $$
DECLARE
  menu_ids INT[];
  num_numbers INT;
  menu_id INT;
  total NUMERIC := 0;
  i INTEGER := 0;
  quantity INTEGER;
  menu_price NUMERIC;
  order_item_price NUMERIC;
BEGIN
  num_numbers := 1 + floor(random() * 5);
  menu_ids :=  generate_random_unique_numbers(1, 38, num_numbers);
  FOREACH menu_id IN ARRAY menu_ids LOOP
    quantity := 1 + floor(random() * 3);

    SELECT price INTO menu_price FROM menu WHERE id = menu_id;

    INSERT INTO
      order_items (
        "id",
        "order_id",
        "menu_id",
        "quantity",
        "price"
      )
    VALUES 
      (
        DEFAULT,
        order_id,
        menu_id,
        quantity,
        menu_price
      )
    RETURNING price INTO order_item_price;

    total := total + order_item_price * quantity;
  END LOOP;

  RETURN total;
END;
$$ LANGUAGE plpgsql;

-- 
-- function to populate the orders table
-- first, creates random orders for the registered users
-- then creates random guest orders i.e. user_id = NULL
-- 
CREATE OR REPLACE FUNCTION populate_orders()
  RETURNS VOID as $$
DECLARE
  u_id INTEGER;
  i INTEGER;
  order_date DATE;
  order_id INTEGER;
  order_total NUMERIC;
BEGIN
  FOR u_id IN 1..11 LOOP
    FOR i IN 0..19 LOOP
      order_date = generate_random_datetime();
      INSERT INTO 
        orders (
          "id",
          "uuid",
          "user_id",
          "total",
          "status",
          "created_at",
          "updated_at"
        )
      VALUES 
        (
          DEFAULT,
          uuid_generate_v4(),
          u_id,
          0,
          'delivered',
          order_date,
          order_date
        )
      RETURNING id INTO order_id;

      order_total := create_order_items(order_id);

      UPDATE orders SET total = order_total WHERE id = order_id;
    END LOOP;
  END LOOP;

  FOR i IN 0..999 LOOP
    order_date = generate_random_datetime();
    INSERT INTO
      orders (
        "id",
        "uuid",
        "user_id",
        "total",
        "status",
        "created_at",
        "updated_at"
      )
    VALUES 
      (
        DEFAULT,
        uuid_generate_v4(),
        NULL,
        0,
        'delivered',
        order_date,
        order_date
      )
    RETURNING id INTO order_id;

    order_total := create_order_items(order_id);

    UPDATE orders SET total = order_total WHERE id = order_id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

SELECT populate_orders();
