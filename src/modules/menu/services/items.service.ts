import { QueryTypes } from 'sequelize';

import sequelize from '@App/db';

import { MenuItem } from '@menu/types';

const itemsService = {
  getMenuItems: async () => {
    const query = `
      SELECT 
        "itemId", name, description, category, tags, prices, status, "photoUrl"
      FROM menu.menu_view;`;

    const result = await sequelize.query(query, { type: QueryTypes.SELECT });

    return result.length === 0 ? null : (result as MenuItem[]);
  },
};

export default itemsService;
