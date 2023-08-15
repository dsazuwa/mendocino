import { Role, User, UserAccount, UserRole } from '@user/models';
import { ROLES } from '@user/utils/constants';

import 'tests/db-setup';

const raw = true;

describe('User Role Model', () => {
  describe('CRUD operations', () => {
    let userId: number;
    let roleId: number;

    beforeAll(async () => {
      const user = await User.create({ firstName: 'J', lastName: 'Doe' });
      userId = user.userId;

      await UserAccount.create({
        userId,
        email: 'jdoe@gmail.com',
        password: 'JD0ePa$$',
        status: 'active',
      });

      const role = await Role.create({ name: 'client' });
      roleId = role.roleId;
    });

    it('should create user role', async () => {
      const userRole = await UserRole.create({ userId, roleId });

      expect(userRole.userId).toBe(userId);
      expect(userRole.roleId).toBe(roleId);
    });

    it('should fail to create user role on duplicate user and role id', async () => {
      expect(UserRole.create({ userId, roleId })).rejects.toThrow();
    });

    it('deleting user role should delete neither user nor role', async () => {
      const userRole = await UserRole.findOne({
        where: { userId, roleId },
        raw,
      });
      expect(userRole).not.toBeNull();

      await UserRole.destroy({ where: { userId, roleId } });

      const uR = await UserRole.findOne({ where: { userId, roleId }, raw });
      expect(uR).toBeNull();

      const u = await User.findByPk(userId, { raw });
      expect(u).not.toBeNull();

      const r = await Role.findByPk(roleId, { raw });
      expect(r).not.toBeNull();
    });

    it('deleting role should delete user role', async () => {
      await Role.destroy({ where: { roleId } });

      const r = await Role.findByPk(roleId, { raw });
      expect(r).toBeNull();

      const u = await User.findByPk(userId, { raw });
      expect(u).not.toBeNull();

      const uR = await UserRole.findOne({ where: { userId, roleId }, raw });
      expect(uR).toBeNull();
    });

    it('deleting user should delete user role', async () => {
      const role = await Role.create({ name: 'client' });
      await UserRole.create({ userId, roleId: role.roleId });

      await User.destroy({ where: { userId } });

      const u = await User.findByPk(userId, { raw });
      expect(u).toBeNull();

      const r = await Role.findByPk(role.roleId, { raw });
      expect(r).not.toBeNull();

      const uR = await UserRole.findOne({ where: { userId, roleId }, raw });
      expect(uR).toBeNull();
    });
  });

  describe('prevent multiple roles with customer hook', () => {
    let userId: number;

    beforeAll(async () => {
      const user = await User.create({ firstName: 'J', lastName: 'Doe' });
      userId = user.userId;

      await UserAccount.create({
        userId,
        email: 'jd@gmail.com',
        password: 'jD0ePa$$',
        status: 'active',
      });
    });

    beforeEach(async () => {
      await UserRole.destroy({ where: { userId } });
      await Role.destroy({ where: {} });

      await Role.bulkCreate([
        ROLES.CUSTOMER,
        ROLES.DELIVERY_DRIVER,
        ROLES.CUSTOMER_SUPPORT,
        ROLES.MANAGER,
        ROLES.ADMIN,
        ROLES.ROOT,
      ]);
    });

    it('should throw error on adding new role to user with customer role', async () => {
      await UserRole.create({
        userId,
        roleId: ROLES.CUSTOMER.roleId,
      });

      expect(
        UserRole.create({ userId, roleId: ROLES.ADMIN.roleId }),
      ).rejects.toThrow();
    });

    it('should throw error on adding customer role to user with some other role ', async () => {
      await UserRole.create({ userId, roleId: ROLES.ADMIN.roleId });

      expect(
        UserRole.create({ userId, roleId: ROLES.CUSTOMER.roleId }),
      ).rejects.toThrow();
    });

    it('should throw error on update that could cause customer to have multiple roles', async () => {
      const userRole = await UserRole.create({
        userId,
        roleId: ROLES.ADMIN.roleId,
      });
      await UserRole.create({ userId, roleId: ROLES.MANAGER.roleId });

      expect(
        UserRole.update(
          { roleId: ROLES.CUSTOMER.roleId },
          {
            where: { roleId: ROLES.MANAGER.roleId },
            individualHooks: true,
          },
        ),
      ).rejects.toThrow();

      await userRole.update({ roleId: ROLES.CUSTOMER.roleId });

      const i = await UserRole.findOne({
        where: { userId, roleId: ROLES.CUSTOMER.roleId },
      });
      expect(i).toBeNull();
    });
  });
});
