-- #region get_menu
CREATE OR REPLACE FUNCTION menu.get_menu()
RETURNS TABLE (
  category VARCHAR,
  notes TEXT[],
  items JSONB[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.name,
    c.menu_description AS notes,
    ARRAY_AGG(
      jsonb_build_object(
        'itemId', item_id,
        'name', v.name,
        'description', description,
        'subCategory', sub_category,
        'price', price,
        'tags', tags,
        'photoUrl', photo_url,
        'notes', v.notes
      ) ORDER BY sub_category, v.item_sort_order
    ) AS items
  FROM menu.menu_view v
  JOIN menu.categories c ON c.name = v.category
  WHERE is_public IS TRUE AND menu_status = 'active'
  GROUP BY c.name, c.category_id
  ORDER BY c.sort_order;
END;
$$ LANGUAGE plpgsql;
-- #endregion

-- #region get_order_menu
CREATE OR REPLACE FUNCTION menu.get_order_menu()
RETURNS TABLE (
  category VARCHAR,
  notes TEXT[],
  items JSONB[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.name AS category,
    c.order_description AS notes,
    ARRAY_AGG(
      jsonb_build_object(
        'itemId', item_id,
        'name', v.name,
        'description', description,
        'subCategory', sub_category,
        'price', price,
        'tags', tags,
        'photoUrl', photo_url,
        'notes', v.notes
      ) ORDER BY sub_category, v.item_sort_order
    ) AS items
  FROM menu.menu_view v
  JOIN menu.categories c ON c.name = v.category
  WHERE menu_status = 'active' AND order_status = 'available'
  GROUP BY c.name, c.category_id
  ORDER BY c.sort_order;
END;
$$ LANGUAGE plpgsql;
-- #endregion