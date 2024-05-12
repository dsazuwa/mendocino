import { QueryTypes } from 'sequelize';

import sequelize from '../../../db';

const menuService = {
  getMenu: async () => {
    const query = `SELECT * FROM menu.get_menu();`;

    const result = await sequelize.query(query, { type: QueryTypes.SELECT });

    return result.length === 0 ? null : (result as MenuItem[]);
  },

  getGroupedMenu: async () => {
    const query = `SELECT * FROM menu.get_active_public_menu();`;

    const result = (await sequelize.query(query, {
      type: QueryTypes.SELECT,
    })) as {
      category: string;
      notes: string;
      subCategories: {
        name: string | null;
        items: MenuItem[];
      }[];
    }[];

    const categories = result.map((x) => x.category);

    return { menu: result, categories };
  },

  getOrderMenu: async () => {
    const query = `SELECT * FROM menu.get_order_menu('Plano');`;

    const result = (await sequelize.query(query, {
      type: QueryTypes.SELECT,
    })) as CategoryItems<MenuItem>[];

    return result;
  },
} as const;

export default menuService;
