-- Drop triggers
DROP TRIGGER IF EXISTS modifier_group_check ON menu.modifier_groups;

-- Drop trigger functions
DROP FUNCTION IF EXISTS menu.enforce_selection_constraint();

-- Drop population functions
DROP FUNCTION IF EXISTS menu.insert_item(INTEGER, BOOLEAN, VARCHAR(100), VARCHAR(355), VARCHAR(100), VARCHAR(255));
DROP FUNCTION IF EXISTS menu.insert_items_categories(INTEGER, INTEGER, VARCHAR(50));
DROP FUNCTION IF EXISTS menu.insert_item_price(INTEGER, DECIMAL(10, 4));
DROP FUNCTION IF EXISTS menu.insert_item_tag(INTEGER, INTEGER);
DROP FUNCTION IF EXISTS menu.insert_modifier_group_parent(INTEGER, INTEGER, DECIMAL(10, 4));
DROP FUNCTION IF EXISTS menu.insert_modifier_group(vARCHAR(100), BOOLEAN, INTEGER, INTEGER, INTEGER);
DROP FUNCTION IF EXISTS menu.insert_modifier_option(INTEGER, VARCHAR(50), DECIMAL(10, 2), menu.enum_modifier_status);
DROP FUNCTION IF EXISTS menu.insert_modifier_options(INTEGER, JSONB[]);
DROP FUNCTION IF EXISTS menu.insert_modifiers_and_options(VARCHAR(100), INTEGER, DECIMAL(10, 2), BOOLEAN, INTEGER, INTEGER, INTEGER, JSONB[]);
DROP FUNCTION IF EXISTS menu.insert_item_modifier(INTEGER, INTEGER, INTEGER);

-- Drop functions
DROP FUNCTION IF EXISTS menu.get_menu();
DROP FUNCTION IF EXISTS menu.get_active_public_menu();
DROP FUNCTION IF EXISTS menu.get_order_menu();
DROP FUNCTION IF EXISTS menu.get_item_modifiers(INTEGER);
DROP FUNCTION IF EXISTS menu.get_child_modifiers(INTEGER);
DROP FUNCTION IF EXISTS menu.get_modifier(INTEGER);

-- Drop views
DROP VIEW IF EXISTS menu.menu_view;
DROP VIEW IF EXISTS menu.modifier_groups_options_view;
DROP VIEW IF EXISTS menu.item_modifier_groups_options_view;
DROP VIEW IF EXISTS menu.nested_modifier_options_view;

-- Drop indexes
DROP INDEX IF EXISTS menu.idx_item_name_unique;
DROP INDEX IF EXISTS menu.idx_category_name_unique;
DROP INDEX IF EXISTS menu.idx_tag_name_unique;

-- Drop constrants
ALTER TABLE IF EXISTS menu.category_discounts DROP CONSTRAINT fk_category_id;
ALTER TABLE IF EXISTS menu.category_discounts DROP CONSTRAINT fk_discount_id;
ALTER TABLE IF EXISTS menu.item_discounts DROP CONSTRAINT fk_item_id;
ALTER TABLE IF EXISTS menu.item_discounts DROP CONSTRAINT fk_discount_id;
ALTER TABLE IF EXISTS menu.items_modifier_groups DROP CONSTRAINT fk_item_id;
ALTER TABLE IF EXISTS menu.items_modifier_groups DROP CONSTRAINT fk_group_id;
ALTER TABLE IF EXISTS menu.modifier_options DROP CONSTRAINT fk_group_id;
ALTER TABLE IF EXISTS menu.modifier_group_parents DROP CONSTRAINT IF EXISTS fk_parent_group_id;
ALTER TABLE IF EXISTS menu.modifier_group_parents DROP CONSTRAINT IF EXISTS fk_child_group_id;
ALTER TABLE IF EXISTS menu.items_prices DROP CONSTRAINT fk_item_id;
ALTER TABLE IF EXISTS menu.items_tags DROP CONSTRAINT fk_item_id;
ALTER TABLE IF EXISTS menu.items_tags DROP CONSTRAINT fk_tag_id;
ALTER TABLE IF EXISTS menu.items_categories DROP CONSTRAINT fk_item_id;
ALTER TABLE IF EXISTS menu.items_categories DROP CONSTRAINT fk_category_id;

-- Drop tables
DROP TABLE IF EXISTS menu.category_discounts;
DROP TABLE IF EXISTS menu.item_discounts;
DROP TABLE IF EXISTS menu.discounts;
DROP TABLE IF EXISTS menu.items_modifier_groups;
DROP TABLE IF EXISTS menu.modifier_options;
DROP TABLE IF EXISTS menu.modifier_group_parents;
DROP TABLE IF EXISTS menu.modifier_groups;
DROP TABLE IF EXISTS menu.items_prices;
DROP TABLE IF EXISTS menu.items_tags;
DROP TABLE IF EXISTS menu.tags;
DROP TABLE IF EXISTS menu.items_categories;
DROP TABLE IF EXISTS menu.categories;
DROP TABLE IF EXISTS menu.items;

-- Drop enums
DROP TYPE IF EXISTS menu.enum_modifier_status;
DROP TYPE IF EXISTS menu.enum_discount_unit;
DROP TYPE IF EXISTS menu.enum_order_status;
DROP TYPE IF EXISTS menu.enum_menu_status;

-- Drop schema
DROP SCHEMA IF EXISTS menu cascade;