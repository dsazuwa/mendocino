CREATE VIEW menu.menu_view AS
SELECT
  m.menu_item_id AS "menuItemId",
  m.name AS name,
  m.description AS description,
  c.name AS category,
  (
    SELECT
      array_agg(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL)
    FROM
      menu.menu_items_menu_tags mt
    JOIN
      menu.menu_tags t ON t.tag_id = mt.tag_id
    WHERE
      mt.menu_item_id = m.menu_item_id
  ) AS tags,
  (
    SELECT
      array_agg(
        CASE
          WHEN p.size_id IS NULL THEN
            jsonb_build_object(
              'size', 'base',
              'price', p.base_price
            )
          ELSE
            jsonb_build_object(
              'size', s.name,
              'price', p.base_price
            )
        END
      )
    FROM
      menu.menu_item_prices p
    LEFT JOIN
      menu.menu_sizes s ON s.size_id = p.size_id
    WHERE
      p.menu_item_id = m.menu_item_id
  ) AS prices,
  m.status AS status,
  m.photo_url AS "photoUrl"
FROM
  menu.menu_items m
JOIN
  menu.menu_items_menu_categories mc ON mc.menu_item_id = m.menu_item_id
JOIN
  menu.menu_categories c ON c.category_id = mc.category_id;