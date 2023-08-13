import { Permission } from '@user/models';

import 'tests/db-setup';

describe('Permission Model', () => {
  it('should create permission', async () => {
    const name = 'VIEW_ORDERS';

    const permission = await Permission.create({ name });
    expect(permission.name).toBe(name);
  });

  it('should fail to create permission on duplicate name', async () => {
    const name = 'CREATE_ORDER';

    await Permission.create({ name });
    expect(Permission.create({ name })).rejects.toThrow();
  });

  it('should retrieve permission', async () => {
    const name = 'GET_ORDER';

    const { permissionId } = await Permission.create({ name });

    let retrievedPermission = await Permission.findByPk(permissionId);
    expect(retrievedPermission).not.toBeNull();
    expect(retrievedPermission?.name).toBe(name);

    retrievedPermission = await Permission.findOne({ where: { name } });
    expect(retrievedPermission).not.toBeNull();
  });

  it('should update permission', async () => {
    const oldName = 'UPDATE_ORDER';
    const newName = 'EDIT_ORDER';

    const permission = await Permission.create({ name: oldName });

    await permission.update({ name: newName });

    let retrievedPermission = await Permission.findOne({
      where: { permissionId: permission.permissionId, name: newName },
    });
    expect(retrievedPermission).not.toBeNull();

    await Permission.update({ name: oldName }, { where: { name: newName } });

    retrievedPermission = await Permission.findOne({
      where: { permissionId: permission.permissionId, name: oldName },
    });
    expect(retrievedPermission).not.toBeNull();
  });

  it('should delete permission', async () => {
    let name = 'CANCEL_ORDER';
    let permission = await Permission.create({ name });

    await permission.destroy();

    let retrievedPermission = await Permission.findOne({ where: { name } });
    expect(retrievedPermission).toBeNull();

    name = 'DELETE_ORDER';
    permission = await Permission.create({ name });

    await Permission.destroy({ where: { name } });

    retrievedPermission = await Permission.findOne({ where: { name } });
    expect(retrievedPermission).toBeNull();
  });
});
