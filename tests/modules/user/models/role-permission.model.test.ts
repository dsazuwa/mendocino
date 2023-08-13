import { Role, Permission, RolePermission } from '@user/models';

import 'tests/db-setup';

describe('Role Permission Model', () => {
  it('should create role permission', async () => {
    const role = await Role.create({ name: 'customer' });
    const permission = await Permission.create({ name: 'CREATE_ORDER' });

    const rolePermission = await RolePermission.create({
      roleId: role.roleId,
      permissionId: permission.permissionId,
    });

    expect(rolePermission).toBeInstanceOf(RolePermission);
  });

  it('should fail to create role permission on duplicate role and permission id', async () => {
    const role = await Role.create({ name: 'client' });
    const permission = await Permission.create({ name: 'EDIT_ORDER' });

    await RolePermission.create({
      roleId: role.roleId,
      permissionId: permission.permissionId,
    });

    expect(
      RolePermission.create({
        roleId: role.roleId,
        permissionId: permission.permissionId,
      }),
    ).rejects.toThrow();
  });

  it('deleting role permission should delete neither role nor permission', async () => {
    const { roleId } = await Role.create({ name: 'admin' });
    const { permissionId } = await Permission.create({ name: 'CANCEL_ORDER' });

    const rolePermission = await RolePermission.create({
      roleId,
      permissionId,
    });

    await rolePermission.destroy();

    const retrievedRolePermission = await RolePermission.findOne({
      where: { roleId, permissionId },
    });
    expect(retrievedRolePermission).toBeNull();

    const retrievedRole = await Role.findByPk(roleId);
    expect(retrievedRole).not.toBeNull();

    const retrievedPermission = await Permission.findByPk(permissionId);
    expect(retrievedPermission).not.toBeNull();
  });

  it('deleting role should delete role permission', async () => {
    const { roleId } = await Role.create({ name: 'driver' });
    const { permissionId } = await Permission.create({ name: 'DELIVER_ORDER' });

    await RolePermission.create({
      roleId,
      permissionId,
    });

    await Role.destroy({ where: { roleId } });

    const retrievedRole = await Role.findOne({ where: { roleId } });
    expect(retrievedRole).toBeNull();

    const retrievedPermission = await Permission.findOne({
      where: { permissionId },
    });
    expect(retrievedPermission).not.toBeNull();

    const retrievedRolePermission = await RolePermission.findOne({
      where: { roleId, permissionId },
    });
    expect(retrievedRolePermission).toBeNull();
  });

  it('deleting permission should delete role permission', async () => {
    const { roleId } = await Role.create({ name: 'delivery driver' });
    const { permissionId } = await Permission.create({ name: 'CHANGE_STATUS' });

    await RolePermission.create({
      roleId,
      permissionId,
    });

    await Permission.destroy({ where: { permissionId } });

    const retrievedRole = await Role.findOne({ where: { roleId } });
    expect(retrievedRole).not.toBeNull();

    const retrievedPermission = await Permission.findOne({
      where: { permissionId },
    });
    expect(retrievedPermission).toBeNull();

    const retrievedRolePermission = await RolePermission.findOne({
      where: { roleId, permissionId },
    });
    expect(retrievedRolePermission).toBeNull();
  });
});
