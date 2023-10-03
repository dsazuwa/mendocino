import { QueryTypes } from 'sequelize';

import sequelize from '@App/db';

const formatMenu = (result: CategoryItems<PublicMenuItem>[]) => {
  const categorizedItems: Record<string, CategoryItems<PublicMenuItem>> = {};

  result.forEach(({ category, notes, items }) => {
    let categoryName = category;

    switch (category) {
      case "chef's creations":
        categoryName = 'creations';
        break;
      case 'soulful salads':
        categoryName = 'salads';
        break;
      case 'bowls':
        categoryName = 'bowls';
        break;
      case 'foodie favorites':
        categoryName = 'foodie';
        break;
      case 'craveable classics':
        categoryName = 'classics';
        break;
      case '1/2 sandwich combos':
        categoryName = 'combos';
        break;
      case 'kids':
        categoryName = 'kids';
        break;
      case 'deli sides':
      case 'soups':
        categoryName = 'sides';
        break;
      default:
        break;
    }

    if (!categorizedItems[categoryName]) {
      categorizedItems[categoryName] = {
        category,
        notes: '',
        items: [],
      };
    }

    categorizedItems[categoryName].notes = notes;
    categorizedItems[categoryName].items.push(...items);
  });

  categorizedItems.sides.category = 'deli sides & soups';

  return categorizedItems;
};

const menuService = {
  getMenu: async () => {
    const query = `
      SELECT 
        "itemId", name, description, category, tags, prices, status, "photoUrl"
      FROM menu.menu_view
      WHERE status IN ('active', 'sold out');`;

    const result = await sequelize.query(query, { type: QueryTypes.SELECT });

    return result.length === 0 ? null : (result as MenuItem[]);
  },

  getGroupedMenu: async () => {
    const query = `
      SELECT
        category,
        (SELECT notes FROM menu.categories WHERE name = category) AS notes,
        json_agg(
          json_build_object(
            'name', name,
            'description', description,
            'prices', prices,
            'tags', tags,
            'photoUrl', "photoUrl",
            'notes', "notes"
          ) ORDER BY "itemId"
        ) AS items
      FROM menu.menu_view
      WHERE status IN ('active', 'sold out')
      GROUP BY category;`;

    const result = (await sequelize.query(query, {
      type: QueryTypes.SELECT,
    })) as CategoryItems<PublicMenuItem>[];

    return result === null ? null : formatMenu(result);
  },
} as const;

export default menuService;
