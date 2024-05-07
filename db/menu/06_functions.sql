-- #region get_menu
CREATE OR REPLACE FUNCTION menu.get_menu()
RETURNS TABLE (
  "itemId" INTEGER,
  name VARCHAR,
  description VARCHAR,
  category VARCHAR,
  "subCategory" VARCHAR,
  price DECIMAL(10, 4),
  tags VARCHAR[],
  "photoUrl" VARCHAR,
  notes VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    item_id AS "itemId",
    v.name,
    v.description,
    c.name AS category,
    sub_category AS "subCategory",
    v.price,
    v.tags,
    photo_url AS "photoUrl",
    v.notes
  FROM menu.menu_view v
  JOIN menu.categories c ON c.name = v.category
  ORDER BY item_id;
END;
$$ LANGUAGE plpgsql;
-- #endregion

-- #region get_active_public_menu
CREATE OR REPLACE FUNCTION menu.get_active_public_menu()
RETURNS TABLE (
  category VARCHAR,
  notes TEXT[],
  "subCategories" JSONB[]
) AS $$
BEGIN
  RETURN QUERY
  WITH aggregated_menu AS (
    SELECT 
      v.category,
      sub_category,
      ARRAY_AGG(
        JSONB_BUILD_OBJECT(
          'itemId', item_id,
          'name', v.name,
          'description', description,
          'price', price,
          'tags', tags,
          'photoUrl', photo_url,
          'notes', v.notes
        ) ORDER BY v.item_sort_order
      ) AS items
    FROM menu.menu_view v
    WHERE is_public IS TRUE AND status = 'active'
    GROUP BY v.category, sub_category
  )
  SELECT 
    c.name AS category,
    menu_description AS notes,
    ARRAY_AGG(
      JSONB_BUILD_OBJECT(
        'name', sub_category,
        'items', m.items
      ) ORDER BY sub_category
    ) AS "subCategories"
  FROM aggregated_menu m
  JOIN menu.categories c ON c.name = m.category
  GROUP BY c.name, c.menu_description, c.category_id
  ORDER BY sort_order;
END;
$$ LANGUAGE plpgsql;
-- #endregion

-- #region get_order_menu
CREATE OR REPLACE FUNCTION menu.get_order_menu(p_name VARCHAR(255))
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
        'itemId', v.item_id,
        'name', v.name,
        'description', description,
        'subCategory', sub_category,
        'price', COALESCE(price, 0),
        'tags', tags,
        'photoUrl', photo_url,
        'notes', v.notes
      ) ORDER BY sub_category, v.item_sort_order
    ) AS items
  FROM menu.menu_view v
  JOIN menu.categories c ON c.name = v.category
  JOIN menu.order_menu_items o ON o.item_id = v.item_id
  JOIN menu.locations l ON l.location_id = o.location_id
  WHERE v.status = 'active' AND o.status = 'available' AND l.name = p_name
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
        'price', o.price,
        'isDefault', o.is_default
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
        'price', o.price,
        'isDefault', o.is_default
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
        'price', o.price,
        'isDefault', o.is_default
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