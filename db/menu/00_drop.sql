-- Drop views
DROP VIEW IF EXISTS menu.menu_view;

-- Drop indexes
DROP INDEX IF EXISTS menu.idx_unique_menu_item_size_null;
DROP INDEX IF EXISTS menu.idx_unique_menu_item_size_not_null;

-- Drop constrants
ALTER TABLE IF EXISTS menu.menu_category_discounts DROP CONSTRAINT fk_category_id;
ALTER TABLE IF EXISTS menu.menu_category_discounts DROP CONSTRAINT fk_discount_id;
ALTER TABLE IF EXISTS menu.menu_item_discounts DROP CONSTRAINT fk_menu_item_id;
ALTER TABLE IF EXISTS menu.menu_item_discounts DROP CONSTRAINT fk_discount_id;
ALTER TABLE IF EXISTS menu.menu_item_prices DROP CONSTRAINT fk_menu_item_id;
ALTER TABLE IF EXISTS menu.menu_item_prices DROP CONSTRAINT fk_size_id;
ALTER TABLE IF EXISTS menu.menu_items_menu_tags DROP CONSTRAINT fk_menu_item_id;
ALTER TABLE IF EXISTS menu.menu_items_menu_tags DROP CONSTRAINT fk_tag_id;
ALTER TABLE IF EXISTS menu.menu_items_menu_categories DROP CONSTRAINT fk_menu_item_id;
ALTER TABLE IF EXISTS menu.menu_items_menu_categories DROP CONSTRAINT fk_category_id;

-- Drop tables
DROP TABLE IF EXISTS menu.menu_category_discounts;
DROP TABLE IF EXISTS menu.menu_item_discounts;
DROP TABLE IF EXISTS menu.discounts;
DROP TABLE IF EXISTS menu.menu_item_prices;
DROP TABLE IF EXISTS menu.menu_sizes;
DROP TABLE IF EXISTS menu.menu_items_menu_tags;
DROP TABLE IF EXISTS menu.menu_tags;
DROP TABLE IF EXISTS menu.menu_items_menu_categories;
DROP TABLE IF EXISTS menu.menu_categories;
DROP TABLE IF EXISTS menu.menu_items;

-- Drop enums
DROP TYPE IF EXISTS menu.enum_discount_unit;
DROP TYPE IF EXISTS menu.enum_menu_items_status;

-- Drop schema
DROP SCHEMA IF EXISTS menu;