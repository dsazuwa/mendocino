-- #region insert_restaurant_and_hours
CREATE OR REPLACE FUNCTION menu.insert_restaurant_and_hours(
  place_id VARCHAR(255),
  name VARCHAR(100),
  phone_number VARCHAR(10),
  address VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(5),
  lat DECIMAL(8,6),
  lng DECIMAL(9,6),
  p_hours JSONB
)
RETURNS VOID AS $$
DECLARE
  loc_id INTEGER;
  day TEXT;
  open_time TIME;
  close_time TIME;
BEGIN
  INSERT INTO menu.locations
    (
      "place_id",
      "name",
      "phone_number",
      "address",
      "city",
      "state",
      "zip_code",
      "lat",
      "lng",
      "created_at",
      "updated_at"
    )
  VALUES 
    (
      place_id,
      name,
      phone_number,
      address,
      city,
      state,
      zip_code,
      lat,
      lng,
      NOW(),
      NOW()
    )
  RETURNING location_id INTO loc_id;

  FOR day IN SELECT jsonb_object_keys(p_hours)
  LOOP
    open_time := (p_hours->day->>'open')::TIME;
    close_time := (p_hours->day->>'close')::TIME;

    INSERT INTO menu.location_hours (
      location_id,
      day_of_week,
      open_time,
      close_time
    ) VALUES (
      loc_id,
      day::menu.enum_days_of_week,
      open_time,
      close_time
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;
-- #endregion

-- #region insert_item
CREATE OR REPLACE FUNCTION menu.insert_item(
  p_order INTEGER,
  p_is_public BOOLEAN,
  p_name VARCHAR(100),
  p_description VARCHAR(355),
  p_photo_url VARCHAR(100),
  p_notes VARCHAR(255)
)
RETURNS INTEGER AS $$
DECLARE
  menu_item_id INTEGER;
  loc_id INTEGER;
BEGIN
  INSERT INTO menu.items
    (
      "item_id",
      "sort_order",
      "is_on_public_menu",
      "name",
      "description",
      "status",
      "photo_url",
      "notes",
      "created_at",
      "updated_at"
    )
  VALUES
    (
      DEFAULT,
      p_order,
      p_is_public,
      p_name,
      p_description,
      'active',
      p_photo_url,
      p_notes,
      NOW(),
      NOW()
    )
  RETURNING item_id INTO menu_item_id;

  FOR loc_id IN SELECT location_id FROM menu.locations
  LOOP
    INSERT INTO menu.order_menu_items
      (
        "location_id",
        "item_id",
        "status",
        "created_at",
        "updated_at"
      )
    VALUES
      (
        loc_id,
        menu_item_id,
        'available',
        NOW(),
        NOW()
      );
  END LOOP;

  RETURN menu_item_id;
END;
$$ LANGUAGE plpgsql;
-- #endregion

-- #region insert_items_categories
CREATE OR REPLACE FUNCTION menu.insert_items_categories(
  p_item_id INTEGER,
  p_category_id INTEGER,
  p_sub_category VARCHAR(50)
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO menu.items_categories
    (
      "item_id",
      "category_id",
      "sub_category",
      "created_at",
      "updated_at"
    )
  VALUES
    (
      p_item_id,
      p_category_id,
      p_sub_category,
      NOW(),
      NOW()
    );
END;
$$ LANGUAGE plpgsql;
-- #endregion

-- #region insert_item_price
CREATE OR REPLACE FUNCTION menu.insert_item_price(
  p_item_id INTEGER,
  p_base_price DECIMAL(10, 4)
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO menu.items_prices
  (
    "price_id",
    "item_id",
    "base_price",
    "created_at",
    "updated_at"
  )
  VALUES
  (
    DEFAULT,
    p_item_id,
    p_base_price,
    NOW(),
    NOW()
  );
END;
$$ LANGUAGE plpgsql;
-- #endregion

-- #region insert_item_tag
CREATE OR REPLACE FUNCTION menu.insert_item_tag(
  p_item_id INTEGER,
  p_tag_id INTEGER
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO menu.items_tags
  (
    "item_id",
    "tag_id",
    "created_at",
    "updated_at"
  )
  VALUES
  (
    p_item_id,
    p_tag_id,
    NOW(),
    NOW()
  );
END;
$$ LANGUAGE plpgsql;
-- #endregion

-- #region insert_modifier_group_parent
CREATE OR REPLACE FUNCTION menu.insert_modifier_group_parent(
  p_parent_group_id INTEGER,
  p_child_group_id INTEGER,
  p_price DECIMAL(10, 4)
) RETURNS VOID AS $$
BEGIN
  INSERT INTO menu.modifier_group_parents
    (
      "parent_group_id",
      "child_group_id",
      "price",
      "created_at",
      "updated_at"
    )
    VALUES
    (
      p_parent_group_id,
      p_child_group_id,
      p_price,
      NOW(),
      NOW()
    );
END;
$$ LANGUAGE plpgsql;
-- #endregion

-- #region insert_modifier_group
CREATE OR REPLACE FUNCTION menu.insert_modifier_group(
  p_modifier_name VARCHAR(100),
  p_is_required BOOLEAN,
  p_min_selection INTEGER,
  p_max_selection INTEGER,
  p_max_free_selection INTEGER
)
RETURNS INTEGER AS $$
DECLARE
  modifier_id INTEGER;
BEGIN
  INSERT INTO menu.modifier_groups 
    (
      "name",
      "is_required",
      "min_selection",
      "max_selection",
      "max_free_selection",
      "created_at",
      "updated_at"
    ) 
  VALUES
    (
      p_modifier_name,
      p_is_required,
      p_min_selection,
      p_max_selection,
      p_max_free_selection,
      NOW(),
      NOW()
    )
  RETURNING group_id INTO modifier_id;

  RETURN modifier_id;
END;
$$ LANGUAGE plpgsql;
-- #endregion

-- #region insert_modifier_option
CREATE OR REPLACE FUNCTION menu.insert_modifier_option(
  p_group_id INTEGER,
  p_name VARCHAR(50),
  p_price DECIMAL(10, 2),
  p_status menu.enum_modifier_status,
  p_is_default BOOLEAN
) RETURNS INTEGER AS $$
DECLARE
  modifier_option_id INTEGER;
BEGIN
  INSERT INTO menu.modifier_options 
    (
      "group_id",
      "name",
      "price",
      "status",
      "is_default",
      "created_at",
      "updated_at"
    ) 
  VALUES
    (
      p_group_id,
      p_name,
      p_price,
      p_status,
      p_is_default,
      NOW(),
      NOW()
    )
  RETURNING option_id INTO modifier_option_id;
  
  RETURN modifier_option_id;
END;
$$ LANGUAGE plpgsql;
-- #endregion

-- #region insert_modifier_options
CREATE OR REPLACE FUNCTION menu.insert_modifier_options(
  p_modifier_id INTEGER,
  p_option_data JSONB[]
) RETURNS VOID AS $$
DECLARE
  option_data_record JSONB;
BEGIN
  FOR option_data_record IN SELECT * FROM unnest(p_option_data) AS data
  LOOP
    PERFORM menu.insert_modifier_option(
      p_modifier_id,
      option_data_record->>'name',
      (option_data_record->>'price')::DECIMAL(10, 4),
      'available',
      COALESCE((option_data_record->>'is_default')::BOOLEAN, FALSE)
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;
-- #endregion

-- #region insert_modifiers_and_options
CREATE OR REPLACE FUNCTION menu.insert_modifiers_and_options(
  p_modifier_name VARCHAR(100),
  p_parent_group_id INTEGER,
  p_price DECIMAL(10, 2),
  p_is_required BOOLEAN,
  p_min_selection INTEGER,
  p_max_selection INTEGER,
  p_max_free_selection INTEGER,
  p_option_data JSONB[]
) RETURNS INTEGER AS $$
DECLARE
  option_data_record JSONB;
  modifier_id INTEGER := menu.insert_modifier_group(
    p_modifier_name,
    p_is_required,
    p_min_selection,
    p_max_selection,
    p_max_free_selection
  );
BEGIN
  PERFORM menu.insert_modifier_options(modifier_id, p_option_data);

  IF p_parent_group_id IS NOT NULL THEN
    PERFORM menu.insert_modifier_group_parent(p_parent_group_id, modifier_id, p_price);
  END IF;

  RETURN modifier_id;
END;
$$ LANGUAGE plpgsql;
-- #endregion

-- #region insert_item_modifier
CREATE OR REPLACE FUNCTION menu.insert_item_modifier(
  p_item_id INTEGER,
  p_group_id INTEGER,
  p_sort_order INTEGER
) RETURNS VOID AS $$
BEGIN
  INSERT INTO menu.items_modifier_groups
    (
      "item_id",
      "group_id",
      "sort_order",
      "created_at",
      "updated_at"
    )
  VALUES
    (
      p_item_id,
      p_group_id,
      p_sort_order,
      NOW(),
      NOW()
    );
END;
$$ LANGUAGE plpgsql;
-- #endregion
