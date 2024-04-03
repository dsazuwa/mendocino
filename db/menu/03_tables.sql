CREATE TABLE menu.locations (
  location_id SERIAL,
  name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(10) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  zip_code VARCHAR(5) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  PRIMARY KEY (location_id)
);

CREATE TABLE menu.location_hours (
  location_id INTEGER,
  day_of_week menu.enum_days_of_week NOT NULL,
  open_time TIME,
  close_time TIME,
  PRIMARY KEY (location_id, day_of_week),
  CONSTRAINT fk_location_id FOREIGN KEY (location_id) REFERENCES menu.locations (location_id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE menu.items (
  item_id SERIAL,
  sort_order INTEGER NOT NULL,
  is_on_public_menu BOOLEAN NOT NULL,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(355),
  status menu.enum_menu_status NOT NULL,
  photo_url VARCHAR(100) NOT NULL,
  notes VARCHAR(255),
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  PRIMARY KEY (item_id)
);

CREATE TABLE menu.order_menu_items (
  location_id INTEGER,
  item_id INTEGER,
  status menu.enum_order_status NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  PRIMARY KEY (location_id, item_id),
  CONSTRAINT fk_location_id FOREIGN KEY (location_id) REFERENCES menu.locations (location_id) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT fk_item_id FOREIGN KEY (item_id) REFERENCES menu.items (item_id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE menu.categories (
  category_id SERIAL,
  sort_order INTEGER NOT NULL,
  name VARCHAR(50) NOT NULL,
  menu_description TEXT[],
  order_description TEXT[],
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  PRIMARY KEY (category_id)
);

CREATE TABLE menu.items_categories (
  item_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  sub_category VARCHAR(50),
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  UNIQUE (item_id),
  CONSTRAINT fk_item_id FOREIGN KEY (item_id) REFERENCES menu.items (item_id) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT fk_category_id FOREIGN KEY (category_id) REFERENCES menu.categories (category_id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE menu.tags (
  tag_id SERIAL,
  name VARCHAR(5) NOT NULL,
  description VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  PRIMARY KEY (tag_id)
);

CREATE TABLE menu.items_tags (
  item_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  UNIQUE (item_id, tag_id),
  CONSTRAINT fk_item_id FOREIGN KEY (item_id) REFERENCES menu.items (item_id) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT fk_tag_id FOREIGN KEY (tag_id) REFERENCES menu.tags (tag_id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE menu.items_prices (
  price_id SERIAL,
  item_id INTEGER NOT NULL,
  base_price DECIMAL(10, 4) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  PRIMARY KEY (price_id),
  UNIQUE (item_id),
  CONSTRAINT fk_item_id FOREIGN KEY (item_id) REFERENCES menu.items (item_id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE menu.modifier_groups (
  group_id SERIAL,
  name VARCHAR(100) NOT NULL,
  is_required BOOLEAN NOT NULL,
  min_selection INTEGER NOT NULL,
  max_selection INTEGER NOT NULL,
  max_free_selection INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  PRIMARY KEY (group_id)
);

CREATE TABLE menu.modifier_group_parents (
  parent_group_id INTEGER NOT NULL,
  child_group_id INTEGER NOT NULL,
  price DECIMAL(10, 4),
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  PRIMARY KEY (parent_group_id, child_group_id),
  CONSTRAINT fk_parent_group_id FOREIGN KEY (parent_group_id) REFERENCES menu.modifier_groups (group_id) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT fk_child_group_id FOREIGN KEY (child_group_id) REFERENCES menu.modifier_groups (group_id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE menu.modifier_options (
  option_id SERIAL,
  group_id INTEGER NOT NULL,
  name VARCHAR(75) NOT NULL,
  price DECIMAL(10, 4),
  status menu.enum_modifier_status NOT NULL,
  is_default BOOLEAN NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  PRIMARY KEY (option_id),
  CONSTRAINT fk_group_id FOREIGN KEY (group_id) REFERENCES menu.modifier_groups (group_id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE menu.items_modifier_groups (
  item_id INTEGER NOT NULL,
  group_id INTEGER NOT NULL,
  sort_order INTEGER,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  UNIQUE (item_id, group_id),
  CONSTRAINT fk_item_id FOREIGN KEY (item_id) REFERENCES menu.items (item_id) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT fk_group_id FOREIGN KEY (group_id) REFERENCES menu.modifier_groups (group_id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE menu.discounts (
  discount_id SERIAL,
  value DECIMAL(10, 4) NOT NULL,
  unit menu.enum_discount_unit NOT NULL,
  min_order_value DECIMAL(10, 4) NOT NULL,
  max_discount_amount DECIMAL(10, 4) NOT NULL,
  valid_from TIMESTAMP NOT NULL,
  valid_until TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  PRIMARY KEY (discount_id)
);

CREATE TABLE menu.item_discounts (
  item_id INTEGER NOT NULL,
  discount_id INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL,
  UNIQUE (item_id),
  CONSTRAINT fk_item_id FOREIGN KEY (item_id) REFERENCES menu.items (item_id) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT fk_discount_id FOREIGN KEY (discount_id) REFERENCES menu.discounts (discount_id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE menu.category_discounts (
  category_id INTEGER NOT NULL,
  discount_id INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL,
  UNIQUE (category_id),
  CONSTRAINT fk_category_id FOREIGN KEY (category_id) REFERENCES menu.categories (category_id) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT fk_discount_id FOREIGN KEY (discount_id) REFERENCES menu.discounts (discount_id) ON DELETE CASCADE ON UPDATE NO ACTION
);