import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Op,
} from 'sequelize';

import sequelize from '@App/db';
import { ApiError } from '@App/utils';

import { ROLES, TABLENAMES } from '@user/utils/constants';

class UserRole extends Model<
  InferAttributes<UserRole>,
  InferCreationAttributes<UserRole>
> {
  declare userId: number;

  declare roleId: number;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;

  public static async preventCustomerMultipleRoles(userRole: UserRole) {
    const { roleId: customerRoleId } = ROLES.CUSTOMER;

    if (userRole.roleId === customerRoleId) {
      const otherRoles = await UserRole.findOne({
        where: {
          userId: userRole.userId,
          roleId: { [Op.ne]: customerRoleId },
        },
        raw: true,
      });

      if (otherRoles)
        throw ApiError.internal('A customer cannot have other roles');
    }

    if (userRole.roleId !== customerRoleId) {
      const customerRole = await UserRole.findOne({
        where: {
          userId: userRole.userId,
          roleId: customerRoleId,
        },
        raw: true,
      });

      if (customerRole)
        throw ApiError.internal('A customer cannot have other roles');
    }
  }
}

UserRole.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      unique: 'compositeIndex',
    },
    roleId: {
      type: DataTypes.INTEGER,
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
    tableName: TABLENAMES.USER_ROLE,
    hooks: {
      beforeSave: UserRole.preventCustomerMultipleRoles,
    },
  },
);

export default UserRole;
