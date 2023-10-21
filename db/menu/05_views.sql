CREATE VIEW menu.menu_view AS
SELECT
  m.item_id,
  m.sort_order AS item_sort_order,
  m.name,
  m.is_on_public_menu AS is_public,
  m.description,
  c.name AS category,
  mc.sub_category,
  (
    WITH cte AS (
      SELECT DISTINCT t.name, t.tag_id
      FROM menu.items_tags mt
      JOIN menu.tags t ON t.tag_id = mt.tag_id
      WHERE mt.item_id = m.item_id AND t.name IS NOT NULL
    )
    SELECT array_agg(cte.name ORDER BY cte.tag_id) 
    FROM cte
  ) AS tags,
  p.base_price AS price,
  m.menu_status,
  m.order_status,
  m.photo_url,
  m.notes
FROM menu.items m
JOIN menu.items_categories mc ON mc.item_id = m.item_id
JOIN menu.categories c ON c.category_id = mc.category_id
LEFT JOIN menu.items_prices p ON p.item_id = m.item_id
ORDER BY c.sort_order, mc.sub_category, m.sort_order;

CREATE VIEW menu.modifier_groups_options_view AS
SELECT
  m.group_id,
  m.name,
  m.is_required,
  m.allow_multiple_selections,
  m.min_selection,
  m.max_selection,
  m.max_free_selection,
  array_agg(jsonb_build_object(
    'name', o.name,
    'price', o.price,
    'status', o.status
  )) AS modifier_options
FROM menu.modifier_groups m
JOIN menu.modifier_options o ON  m.group_id = o.group_id
GROUP BY m.group_id
ORDER BY m.group_id;

CREATE VIEW menu.item_modifier_groups_options_view AS
SELECT
  m.group_id,
  m.name,
  m.is_required,
  m.allow_multiple_selections,
  m.min_selection,
  m.max_selection,
  m.max_free_selection,
  array_agg(jsonb_build_object(
    'name', o.name,
    'price', o.price,
    'status', o.status
  )) AS modifier_options
FROM menu.modifier_groups m
JOIN menu.items_modifier_groups im ON m.group_id = im.group_id
JOIN menu.modifier_options o ON  m.group_id = o.group_id
GROUP BY m.group_id
ORDER BY m.group_id;

CREATE VIEW menu.nested_modifier_options_view AS
SELECT
  pm.group_id,
  pm.name,
  pm.is_required,
  pm.allow_multiple_selections,
  pm.min_selection,
  pm.max_selection,
  pm.max_free_selection,
  CASE
    WHEN o.group_id IS NULL THEN array_agg(jsonb_build_object(
      'name', cm.name,
      'isNested', true,
      'price', mp.price,
      'status', 'available'
    ))
    ELSE array_agg(jsonb_build_object(
      'name', o.name,
      'isNested', false,
      'price', o.price,
      'status', o.status
    ))
  END AS options
FROM menu.modifier_group_parents mp
JOIN menu.modifier_groups pm ON pm.group_id = mp.parent_group_id
JOIN menu.modifier_groups cm ON cm.group_id = mp.child_group_id
LEFT JOIN menu.modifier_options o ON o.group_id = cm.group_id
GROUP BY pm.group_id, o.group_id
ORDER BY pm.group_id;
