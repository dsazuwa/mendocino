CREATE UNIQUE INDEX idx_item_name_unique ON menu.items (LOWER(name));
CREATE UNIQUE INDEX idx_category_name_unique ON menu.categories (LOWER(name));
CREATE UNIQUE INDEX idx_tag_name_unique ON menu.tags (LOWER(name));