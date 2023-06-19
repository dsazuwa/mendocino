import {
  CreationOptional,
  DataTypes,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import sequelize from '../db';

type OrderStatusType = 'pending' | 'processing' | 'confirmed' | 'delivered';

class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
  declare id: CreationOptional<number>;
  declare uuid: CreationOptional<string>;
  declare userId: CreationOptional<number>;
  declare total: number;
  declare orderStatus: CreationOptional<OrderStatusType>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare getOrderItems: HasManyGetAssociationsMixin<OrderItem>;
  declare createOrderItem: HasManyCreateAssociationMixin<OrderItem>;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
    },
    userId: DataTypes.INTEGER,
    total: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: false,
    },
    orderStatus: {
      type: DataTypes.ENUM('pending', 'processing', 'confirmed', 'delivered'),
      defaultValue: 'pending',
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    underscored: true,
  },
);

class OrderItem extends Model<InferAttributes<OrderItem>, InferCreationAttributes<OrderItem>> {
  declare id: CreationOptional<number>;
  declare orderId: CreationOptional<number>;
  declare menuId: number;
  declare quantity: number;
  declare price: number;
}

OrderItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      unique: 'compositeIndex',
      references: {
        model: Order,
        key: 'id',
      },
    },
    menuId: {
      type: DataTypes.INTEGER,
      unique: 'compositeIndex',
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'Price must be a positive value.',
        },
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    underscored: true,
  },
);

Order.hasMany(OrderItem, { onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { onDelete: 'CASCADE' });

export { Order, OrderItem, OrderStatusType };
