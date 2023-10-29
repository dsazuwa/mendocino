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

-- #region get_item_modifiers
CREATE OR REPLACE FUNCTION menu.get_item_modifiers(p_item_id INTEGER)
RETURNS TABLE (
  modifiers JSONB[]
) AS $$
BEGIN
  RETURN QUERY
  WITH options AS (
    SELECT
      g.group_id,
      ARRAY_AGG(JSONB_BUILD_OBJECT(
        'optionId', o.option_id,
        'name', o.name,
        'price', o.price
      )) AS options
    FROM menu.modifier_groups g
    JOIN menu.items_modifier_groups ig ON ig.group_id = g.group_id AND ig.item_id = p_item_id
    JOIN menu.modifier_options o ON o.group_id = g.group_id
    GROUP BY g.group_id
  ),
  nested_options AS (
    SELECT
      gp.parent_group_id AS group_id,
      ARRAY_AGG(JSONB_BUILD_OBJECT(
        'groupId', cm.group_id,
        'name', cm.name,
        'price', gp.price
      )) AS options
    FROM menu.modifier_group_parents gp
    JOIN menu.items_modifier_groups ig ON ig.group_id = gp.parent_group_id AND ig.item_id = p_item_id
    JOIN menu.modifier_groups pm ON pm.group_id = gp.parent_group_id
    JOIN menu.modifier_groups cm ON cm.group_id = gp.child_group_id
    GROUP BY gp.parent_group_id
  ),
  modifiers AS (
    SELECT
      g.group_id,
      g.is_required,
      g.min_selection,
      g.max_selection,
      g.max_free_selection,
      g.name,
      -- CASE WHEN n.options IS NULL THEN o.options
      --   WHEN o.options IS NULL THEN NULL
      --   ELSE ARRAY_CAT(o.options, n.options) END AS options
      ARRAY_CAT(o.options, n.options) AS options
    FROM menu.modifier_groups g
    JOIN menu.items_modifier_groups ig ON ig.group_id = g.group_id AND ig.item_id = p_item_id
    LEFT JOIN options o ON o.group_id = g.group_id
    LEFT JOIN nested_options n ON n.group_id = g.group_id
    GROUP BY g.group_id, n.options, o.options
    ORDER BY g.group_id
  )
  SELECT
    ARRAY_AGG(
      JSONB_BUILD_OBJECT(
        'groupId', m.group_id,
        'isRequired', m.is_required,
        'minSelection', m.min_selection,
        'maxSelection', m.max_selection,
        'maxFree', m.max_free_selection, 
        'name', m.name,
        'options', m.options
      ) ORDER BY m.is_required DESC
    ) AS modifiers
  FROM menu.items_modifier_groups i
  JOIN modifiers m ON m.group_id = i.group_id
  WHERE i.item_id = p_item_id;
END;
$$ LANGUAGE plpgsql;
-- #endregion

-- #region get_child_modifiers
CREATE OR REPLACE FUNCTION menu.get_child_modifiers(p_group_id INTEGER)
RETURNS TABLE (
  name VARCHAR,
  modifiers JSONB[]
) AS $$
BEGIN
  RETURN QUERY
  WITH options AS (
    SELECT
      g.group_id,
      ARRAY_AGG(JSONB_BUILD_OBJECT(
        'optionId', o.option_id,
        'name', o.name,
        'price', o.price
      )) AS options
    FROM menu.modifier_groups g
    JOIN menu.modifier_options o ON o.group_id = g.group_id
    GROUP BY g.group_id
  ),
  nested_options AS (
    SELECT
      gp.parent_group_id AS group_id,
      ARRAY_AGG(JSONB_BUILD_OBJECT(
        'groupId', cm.group_id,
        'name', cm.name,
        'price', gp.price
      )) AS options
    FROM menu.modifier_group_parents gp
    JOIN menu.modifier_groups pm ON pm.group_id = gp.parent_group_id
    JOIN menu.modifier_groups cm ON cm.group_id = gp.child_group_id
    GROUP BY gp.parent_group_id
  ),
  modifiers AS (
    SELECT
      g.group_id,
      g.is_required,
      g.min_selection,
      g.max_selection,
      g.max_free_selection,
      g.name,
      ARRAY_CAT(o.options, n.options) AS options
    FROM menu.modifier_groups g
    LEFT JOIN options o ON o.group_id = g.group_id
    LEFT JOIN nested_options n ON n.group_id = g.group_id
    GROUP BY g.group_id, n.options, o.options
    ORDER BY g.group_id, g.is_required
  )
  SELECT
    g.name AS name,
    ARRAY_AGG(
      JSONB_BUILD_OBJECT(
        'groupId', m.group_id,
        'isRequired', m.is_required,
        'minSelection', m.min_selection,
        'maxSelection', m.max_selection,
        'maxFree', m.max_free_selection, 
        'name', m.name,
        'options', m.options
      ) ORDER BY m.is_required DESC
    ) AS modifiers
  FROM modifiers m
  JOIN menu.modifier_group_parents p ON child_group_id = m.group_id
  JOIN menu.modifier_groups g ON g.group_id = p.parent_group_id
  WHERE p.parent_group_id = p_group_id
  GROUP BY g.name;
END;
$$ LANGUAGE plpgsql;
-- #endregion

-- #region get_modifier
CREATE OR REPLACE FUNCTION menu.get_modifier(p_group_id INTEGER)
RETURNS TABLE (
  modifiers JSONB[]
) AS $$
BEGIN
  RETURN QUERY
  WITH options AS (
    SELECT
      g.group_id,
      ARRAY_AGG(JSONB_BUILD_OBJECT(
        'optionId', o.option_id,
        'name', o.name,
        'price', o.price
      )) AS options
    FROM menu.modifier_groups g
    JOIN menu.modifier_options o ON o.group_id = g.group_id
    GROUP BY g.group_id
  ),
  nested_options AS (
    SELECT
      gp.parent_group_id AS group_id,
      ARRAY_AGG(JSONB_BUILD_OBJECT(
        'groupId', cm.group_id,
        'name', cm.name,
        'price', gp.price
      )) AS options
    FROM menu.modifier_group_parents gp
    JOIN menu.modifier_groups pm ON pm.group_id = gp.parent_group_id
    JOIN menu.modifier_groups cm ON cm.group_id = gp.child_group_id
    GROUP BY gp.parent_group_id
  ),
  modifiers AS (
    SELECT
      g.group_id,
      g.is_required,
      g.min_selection,
      g.max_selection,
      g.max_free_selection,
      g.name,
      -- CASE WHEN n.options IS NULL THEN o.options
      --   WHEN o.options IS NULL THEN NULL
      --   ELSE ARRAY_CAT(o.options, n.options) END AS options
      ARRAY_CAT(o.options, n.options) AS options
    FROM menu.modifier_groups g
    LEFT JOIN options o ON o.group_id = g.group_id
    LEFT JOIN nested_options n ON n.group_id = g.group_id
    GROUP BY g.group_id, n.options, o.options
    ORDER BY g.group_id
  )
  SELECT
    ARRAY_AGG(
      JSONB_BUILD_OBJECT(
        'groupId', m.group_id,
        'isRequired', m.is_required,
        'minSelection', m.min_selection,
        'maxSelection', m.max_selection,
        'maxFree', m.max_free_selection, 
        'name', m.name,
        'options', m.options
      ) ORDER BY m.is_required DESC
    ) AS modifiers
  FROM modifiers m
  WHERE m.group_id = p_group_id
  GROUP BY m.group_id;
END;
$$ LANGUAGE plpgsql;
-- #endregion