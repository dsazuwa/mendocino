CREATE VIEW menu.menu_view AS
SELECT
  m.item_id AS "itemId",
  m.name AS name,
  m.description AS description,
  c.name AS category,
  (
    SELECT
      array_agg(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL)
    FROM
      menu.items_tags mt
    JOIN
      menu.tags t ON t.tag_id = mt.tag_id
    WHERE
      mt.item_id = m.item_id
  ) AS tags,
  (
    SELECT
      array_agg(
        CASE
          WHEN p.size_id IS NULL THEN
            jsonb_build_object(
              'size', 'default',
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
      menu.items_prices p
    LEFT JOIN
      menu.sizes s ON s.size_id = p.size_id
    WHERE
      p.item_id = m.item_id
  ) AS prices,
  m.status AS status,
  m.photo_url AS "photoUrl"
FROM
  menu.items m
JOIN
  menu.items_categories mc ON mc.item_id = m.item_id
JOIN
  menu.categories c ON c.category_id = mc.category_id;