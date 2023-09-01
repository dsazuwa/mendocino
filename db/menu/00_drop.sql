-- Drop views
DROP VIEW IF EXISTS menu.menu_view;

-- Drop indexes
DROP INDEX IF EXISTS menu.idx_item_name_unique;
DROP INDEX IF EXISTS menu.idx_category_name_unique;
DROP INDEX IF EXISTS menu.idx_tag_name_unique;
DROP INDEX IF EXISTS menu.idx_unique_item_size_null;
DROP INDEX IF EXISTS menu.idx_unique_item_size_not_null;

-- Drop constrants
ALTER TABLE IF EXISTS menu.category_discounts DROP CONSTRAINT fk_category_id;
ALTER TABLE IF EXISTS menu.category_discounts DROP CONSTRAINT fk_discount_id;
ALTER TABLE IF EXISTS menu.item_discounts DROP CONSTRAINT fk_item_id;
ALTER TABLE IF EXISTS menu.item_discounts DROP CONSTRAINT fk_discount_id;
ALTER TABLE IF EXISTS menu.items_prices DROP CONSTRAINT fk_item_id;
ALTER TABLE IF EXISTS menu.items_prices DROP CONSTRAINT fk_size_id;
ALTER TABLE IF EXISTS menu.items_tags DROP CONSTRAINT fk_item_id;
ALTER TABLE IF EXISTS menu.items_tags DROP CONSTRAINT fk_tag_id;
ALTER TABLE IF EXISTS menu.items_categories DROP CONSTRAINT fk_item_id;
ALTER TABLE IF EXISTS menu.items_categories DROP CONSTRAINT fk_category_id;

-- Drop tables
DROP TABLE IF EXISTS menu.category_discounts;
DROP TABLE IF EXISTS menu.item_discounts;
DROP TABLE IF EXISTS menu.discounts;
DROP TABLE IF EXISTS menu.items_prices;
DROP TABLE IF EXISTS menu.sizes;
DROP TABLE IF EXISTS menu.items_tags;
DROP TABLE IF EXISTS menu.tags;
DROP TABLE IF EXISTS menu.items_categories;
DROP TABLE IF EXISTS menu.categories;
DROP TABLE IF EXISTS menu.items;

-- Drop enums
DROP TYPE IF EXISTS menu.enum_discount_unit;
DROP TYPE IF EXISTS menu.enum_items_status;

-- Drop schema
DROP SCHEMA IF EXISTS menu;