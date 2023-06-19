import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import sequelize from '../db';

class Cart extends Model<InferAttributes<Cart>, InferCreationAttributes<Cart>> {
  declare userId: CreationOptional<number>;
  declare menuId: number;
  declare quantity: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Cart.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    menuId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    underscored: true,
  },
);

export default Cart;
