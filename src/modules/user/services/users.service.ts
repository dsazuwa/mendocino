import { QueryTypes } from 'sequelize';

import sequelize from '@App/db';

import { AuthOTP, User, UserAccount } from '@user/models';

const usersService = {
  getUserData: async (userId: number) => {
    const query = `
        SELECT
          u.first_name as "firstName",
          u.last_name as "lastName",
          a.email as email,
          a.status as status
        FROM
          ${User.tableName} u
        JOIN
          ${UserAccount.tableName} a ON u.user_id = a.user_id
        WHERE u.user_id = ${userId};`;

    const user = await sequelize.query(query, { type: QueryTypes.SELECT });

    return user.length === 0 ? null : user[0];
  },

  verifyEmail: async (userId: number) =>
    sequelize.transaction(async (transaction) => {
      await AuthOTP.destroy({
        where: { userId, type: 'verify' },
        transaction,
      });

      await UserAccount.update(
        { status: 'active' },
        { where: { userId }, transaction },
      );
    }),
};

export default usersService;