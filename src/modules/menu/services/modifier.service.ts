import { QueryTypes } from 'sequelize';

import sequelize from '@App/db';

const modifierService = {
  getModifier: async (groupId: number) => {
    const query = 'SELECT * FROM menu.get_modifier($groupId);';

    const result = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      bind: { groupId },
    });

    return result.length === 0 ? null : result[0];
  },

  getChildModifiers: async (groupId: number) => {
    const query = 'SELECT * FROM menu.get_child_modifiers($groupId);';

    const result = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      bind: { groupId },
    });

    return result.length === 0 ? null : result[0];
  },

  getItemModifiers: async (itemId: number) => {
    const query = 'SELECT * FROM menu.get_item_modifiers($itemId);';

    const result = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      bind: { itemId },
    });

    return result.length === 0 ? null : result[0];
  },
};

export default modifierService;
