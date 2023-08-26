CREATE TABLE menu.menu_items (
  menu_item_id SERIAL,
  name VARCHAR(100) UNIQUE NOT NULL,
  description VARCHAR(255) NOT NULL,
  status menu.enum_menu_items_status NOT NULL,
  photo_url VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  PRIMARY KEY (menu_item_id)
);

CREATE TABLE menu.menu_categories (
  category_id SERIAL,
  name VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  PRIMARY KEY (category_id)
);

CREATE TABLE menu.menu_items_menu_categories (
  menu_item_id INTEGER UNIQUE NOT NULL,
  category_id INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  CONSTRAINT fk_menu_item_id FOREIGN KEY (menu_item_id) REFERENCES menu.menu_items (menu_item_id) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT fk_category_id FOREIGN KEY (category_id) REFERENCES menu.menu_categories (category_id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE menu.menu_tags (
  tag_id SERIAL,
  name VARCHAR(5) UNIQUE NOT NULL,
  description VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  PRIMARY KEY (tag_id)
);

CREATE TABLE menu.menu_items_menu_tags (
  menu_item_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  UNIQUE (menu_item_id, tag_id),
  CONSTRAINT fk_menu_item_id FOREIGN KEY (menu_item_id) REFERENCES menu.menu_items (menu_item_id) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT fk_tag_id FOREIGN KEY (tag_id) REFERENCES menu.menu_tags (tag_id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE menu.menu_sizes (
  size_id SERIAL,
  name VARCHAR(20) UNIQUE NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  PRIMARY KEY (size_id)
);

CREATE TABLE menu.menu_item_prices (
  price_id SERIAL,
  menu_item_id INTEGER NOT NULL,
  size_id INTEGER,
  base_price DECIMAL(10, 4) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  PRIMARY KEY (price_id),
  UNIQUE (menu_item_id, size_id),
  CONSTRAINT fk_menu_item_id FOREIGN KEY (menu_item_id) REFERENCES menu.menu_items (menu_item_id) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT fk_size_id FOREIGN KEY (size_id) REFERENCES menu.menu_sizes (size_id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE UNIQUE INDEX idx_unique_menu_item_size_null
ON menu.menu_item_prices (menu_item_id)
WHERE size_id IS NULL;

CREATE UNIQUE INDEX idx_unique_menu_item_size_not_null
ON menu.menu_item_prices (menu_item_id, size_id)
WHERE size_id IS NOT NULL;

CREATE TABLE menu.discounts (
  discount_id SERIAL,
  discount_value DECIMAL(10, 4) NOT NULL,
  discount_unit menu.enum_discount_unit NOT NULL,
  min_order_value INTEGER NOT NULL,
  max_discount_amount DECIMAL(10, 4) NOT NULL,
  valid_from TIMESTAMP NOT NULL,
  valid_until TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  PRIMARY KEY (discount_id)
);

CREATE TABLE menu.menu_item_discounts (
  menu_item_id INTEGER NOT NULL,
  discount_id INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL,
  UNIQUE (menu_item_id, discount_id),
  CONSTRAINT fk_menu_item_id FOREIGN KEY (menu_item_id) REFERENCES menu.menu_items (menu_item_id) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT fk_discount_id FOREIGN KEY (discount_id) REFERENCES menu.discounts (discount_id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE menu.menu_category_discounts (
  category_id INTEGER NOT NULL,
  discount_id INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL,
  UNIQUE (category_id, discount_id),
  CONSTRAINT fk_category_id FOREIGN KEY (category_id) REFERENCES menu.menu_categories (category_id) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT fk_discount_id FOREIGN KEY (discount_id) REFERENCES menu.discounts (discount_id) ON DELETE CASCADE ON UPDATE NO ACTION
);