import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '@App/db';

import { MENU_SCHEMA, TABLENAMES } from '@menu/utils.ts/constants';

class ItemTag extends Model<
  InferAttributes<ItemTag>,
  InferCreationAttributes<ItemTag>
> {
  declare itemId: number;

  declare tagId: number;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
}

ItemTag.init(
  {
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'compositeIndex',
    },
    tagId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'compositeIndex',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    schema: MENU_SCHEMA,
    tableName: TABLENAMES.MENU_ITEM_TAG,
  },
);

export default ItemTag;
