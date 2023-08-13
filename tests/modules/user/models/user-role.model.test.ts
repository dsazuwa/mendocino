import { Role, User, UserAccount, UserRole } from '@user/models';

import 'tests/db-setup';

describe('User Role Model', () => {
  let userId: number;
  let roleId: number;

  beforeAll(async () => {
    const user = await User.create({ firstName: 'J', lastName: 'Doe' });
    userId = user.userId;

    await UserAccount.create({
      userId,
      email: 'jdoe@gmail.com',
      password: 'JD0ePa$$',
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
    const userRole = await UserRole.findOne({ where: { userId, roleId } });
    expect(userRole).not.toBeNull();

    await UserRole.destroy({ where: { userId, roleId } });

    const uR = await UserRole.findOne({ where: { userId, roleId } });
    expect(uR).toBeNull();

    const u = await User.findByPk(userId);
    expect(u).not.toBeNull();

    const r = await Role.findByPk(roleId);
    expect(r).not.toBeNull();
  });

  it('deleting role should delete user role', async () => {
    await Role.destroy({ where: { roleId } });

    const r = await Role.findByPk(roleId);
    expect(r).toBeNull();

    const u = await User.findByPk(userId);
    expect(u).not.toBeNull();

    const uR = await UserRole.findOne({ where: { userId, roleId } });
    expect(uR).toBeNull();
  });

  it('deleting user should delete user role', async () => {
    const role = await Role.create({ name: 'client' });
    await UserRole.create({ userId, roleId: role.roleId });

    await User.destroy({ where: { userId } });

    const u = await User.findByPk(userId);
    expect(u).toBeNull();

    const r = await Role.findByPk(role.roleId);
    expect(r).not.toBeNull();

    const uR = await UserRole.findOne({ where: { userId, roleId } });
    expect(uR).toBeNull();
  });
});
