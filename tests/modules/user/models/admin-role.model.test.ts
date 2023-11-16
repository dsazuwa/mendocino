import {
  Admin,
  AdminAccount,
  AdminRole,
  Email,
  Role,
} from 'modules/user/models';

import '../../../db-setup';

const raw = true;

describe('User Role Model', () => {
  let adminId: number;
  let roleId: number;

  beforeAll(async () => {
    const admin = await Admin.create({
      firstName: 'J',
      lastName: 'Doe',
      status: 'active',
    });
    adminId = admin.adminId;

    const { emailId } = await Email.create({ email: 'jdoe@gmail.com' });

    await AdminAccount.create({
      adminId,
      emailId,
      password: 'JD0ePa$$',
    });

    const role = await Role.create({ name: 'client' });
    roleId = role.roleId;
  });

  it('should create user role', async () => {
    const userRole = await AdminRole.create({ adminId, roleId });

    expect(userRole.adminId).toBe(adminId);
    expect(userRole.roleId).toBe(roleId);
  });

  it('should fail to create user role on duplicate user and role id', async () => {
    expect(AdminRole.create({ adminId, roleId })).rejects.toThrow();
  });

  it('deleting user role should delete neither user nor role', async () => {
    const userRole = await AdminRole.findOne({
      where: { adminId, roleId },
      raw,
    });
    expect(userRole).not.toBeNull();

    await AdminRole.destroy({ where: { adminId, roleId } });

    const aR = await AdminRole.findOne({ where: { adminId, roleId }, raw });
    expect(aR).toBeNull();

    const admin = await Admin.findByPk(adminId, { raw });
    expect(admin).not.toBeNull();

    const role = await Role.findByPk(roleId, { raw });
    expect(role).not.toBeNull();
  });

  it('deleting role should delete user role', async () => {
    await Role.destroy({ where: { roleId } });

    const r = await Role.findByPk(roleId, { raw });
    expect(r).toBeNull();

    const admin = await Admin.findByPk(adminId, { raw });
    expect(admin).not.toBeNull();

    const aR = await AdminRole.findOne({ where: { adminId, roleId }, raw });
    expect(aR).toBeNull();
  });

  it('deleting user should delete user role', async () => {
    const r = await Role.create({ name: 'client' });
    await AdminRole.create({ adminId, roleId: r.roleId });

    await Admin.destroy({ where: { adminId } });

    const admin = await Admin.findByPk(adminId, { raw });
    expect(admin).toBeNull();

    const role = await Role.findByPk(r.roleId, { raw });
    expect(role).not.toBeNull();

    const aR = await AdminRole.findOne({
      where: { adminId, roleId: r.roleId },
      raw,
    });
    expect(aR).toBeNull();
  });
});
