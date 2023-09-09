import { AdminAccount, Admin } from '@user/models';

const adminService = {
  updateName: async (
    adminId: number,
    firstName: string | undefined,
    lastName: string | undefined,
  ) => {
    const values: Partial<Admin> = {};

    if (firstName && firstName.trim().length > 0) values.firstName = firstName;
    if (lastName && lastName.trim().length > 0) values.lastName = lastName;

    const result = await Admin.update(values, { where: { adminId } });

    return result[0] === 1;
  },

  changePassword: async (
    adminId: number,
    currentPassword: string,
    newPassword: string,
  ) => {
    const existingPassword = await AdminAccount.findOne({
      where: { adminId },
    });

    if (
      !existingPassword ||
      !AdminAccount.comparePasswords(currentPassword, existingPassword.password)
    )
      return false;

    const result = await AdminAccount.update(
      { password: newPassword },
      { where: { adminId }, individualHooks: true },
    );

    return result[0] === 1;
  },
};

export default adminService;
