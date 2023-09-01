CREATE UNIQUE INDEX idx_item_name_unique ON menu.items (LOWER(name));
CREATE UNIQUE INDEX idx_category_name_unique ON menu.categories (LOWER(name));
CREATE UNIQUE INDEX idx_tag_name_unique ON menu.tags (LOWER(name));
CREATE UNIQUE INDEX idx_size_name_unique ON menu.sizes (LOWER(name));

CREATE UNIQUE INDEX idx_unique_item_size_null
ON menu.items_prices (item_id)
WHERE size_id IS NULL;

CREATE UNIQUE INDEX idx_unique_item_size_not_null
ON menu.items_prices (item_id, size_id)
WHERE size_id IS NOT NULL;