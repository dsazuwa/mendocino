import { Admin, AdminAccount, Email } from 'modules/user/models';
import adminService from 'modules/user/services/admin.service';
import { ROLES } from 'modules/user/utils/constants';

import { createAdmin, createRoles } from '../helper-functions';

import '../../../db-setup';

beforeAll(async () => {
  await createRoles();
});

describe('update user name ', () => {
  const firstName = 'Jazz';
  const lastName = 'Doe';

  const newFirst = 'Jasmine';
  const newLast = 'Dough';

  let adminId: number;

  beforeEach(async () => {
    await Admin.destroy({ where: {} });
    await Email.destroy({ where: {} });

    const { admin } = await createAdmin(
      firstName,
      lastName,
      'jazzdoe@gmail.com',
      'JazzD0ePa$$',
      'active',
      [ROLES.CUSTOMER_SUPPORT.roleId],
    );
    adminId = admin.adminId;
  });

  const testUpdateUser = async (
    fName: string | undefined,
    lName: string | undefined,
    expectedFirst: string,
    expectedLast: string,
    expectedResult: boolean,
  ) => {
    const result = await adminService.updateName(adminId, fName, lName);
    expect(result).toBe(expectedResult);

    const user = await Admin.findOne({
      where: { adminId, firstName: expectedFirst, lastName: expectedLast },
      raw: true,
    });
    expect(user).not.toBeNull();
  };

  it('should update user if both firstName and lastName are provided', async () => {
    await testUpdateUser(newFirst, newLast, newFirst, newLast, true);
  });

  describe('should update user if firstName is provided', () => {
    it('but lastName is an empty string', async () => {
      await testUpdateUser(newFirst, '', newFirst, lastName, true);
    });

    it('but lastName is undefined', async () => {
      await testUpdateUser(newFirst, undefined, newFirst, lastName, true);
    });
  });

  describe('should update user if lastName is provided', () => {
    it('but firstName is an empty string', async () => {
      await testUpdateUser('', newLast, firstName, newLast, true);
    });

    it('but firstName is undefined', async () => {
      await testUpdateUser(undefined, newLast, firstName, newLast, true);
    });
  });

  describe('should not update user', () => {
    it('if both firstName and lastName are empty strings', async () => {
      await testUpdateUser('', ' ', firstName, lastName, false);
    });

    it('if both firstName and lastName are undefined', async () => {
      await testUpdateUser(undefined, undefined, firstName, lastName, false);
    });
  });
});

describe('change password', () => {
  it('should change password and return true for valid adminId', async () => {
    const password = 'jeanD0epa$$';
    const newPassword = 'newjeanD0epa$$';

    const { adminId } = await createAdmin(
      'Jean Paul',
      'Doe',
      'jeanpauldoe@gmail.com',
      password,
      'active',
      [ROLES.ROOT.roleId],
    );

    const result = await adminService.changePassword(
      adminId,
      password,
      newPassword,
    );
    expect(result).toBe(true);

    const retrievedAccount = await AdminAccount.findOne({
      where: { adminId },
    });
    expect(
      AdminAccount?.comparePasswords(
        newPassword,
        retrievedAccount?.password || '',
      ),
    ).toBe(true);
  });

  it('should return false for wrong current password', async () => {
    const password = 'julietteD0epa$$';
    const newPassword = 'newjeanD0epa$$';

    const { adminId } = await createAdmin(
      'Juliette',
      'Doe',
      'juliettepauldoe@gmail.com',
      password,
      'active',
      [ROLES.MANAGER.roleId],
    );

    const result = await adminService.changePassword(
      adminId,
      newPassword,
      newPassword,
    );

    expect(result).toBe(false);

    const retrievedAccount = await AdminAccount.findOne({
      where: { adminId },
    });
    const hashed = retrievedAccount?.password || '';
    expect(AdminAccount.comparePasswords(newPassword, hashed)).toBe(false);
    expect(AdminAccount.comparePasswords(password, hashed)).toBe(true);
  });

  it('should return false for invalid adminId', async () => {
    const result = await adminService.changePassword(
      10000,
      'wrongOldPassword',
      'newpassword',
    );

    expect(result).toBe(false);
  });
});
