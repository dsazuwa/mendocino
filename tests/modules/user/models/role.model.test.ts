import { Role } from '@user/models';

import 'tests/db-setup';

const raw = true;

describe('Role Model', () => {
  it('should create role', async () => {
    const name = 'customer';

    const role = await Role.create({ name });
    expect(role.name).toBe(name);
  });

  it('should fail to create role on duplicate name', async () => {
    const name = 'client';

    await Role.create({ name });
    expect(Role.create({ name })).rejects.toThrow();
  });

  it('should retrieve role', async () => {
    const name = 'root';

    const { roleId } = await Role.create({ name });

    let retrievedRole = await Role.findByPk(roleId, { raw });
    expect(retrievedRole).not.toBeNull();
    expect(retrievedRole?.name).toBe(name);

    retrievedRole = await Role.findOne({ where: { name }, raw });
    expect(retrievedRole).not.toBeNull();
  });

  it('should update role', async () => {
    const oldName = 'super user';
    const newName = 'super user';

    const role = await Role.create({ name: oldName });

    await role.update({ name: newName });

    let retrievedRole = await Role.findOne({
      where: { roleId: role.roleId, name: newName },
      raw,
    });
    expect(retrievedRole).not.toBeNull();

    await Role.update({ name: oldName }, { where: { name: newName } });

    retrievedRole = await Role.findOne({
      where: { roleId: role.roleId, name: oldName },
      raw,
    });
    expect(retrievedRole).not.toBeNull();
  });

  it('should delete role', async () => {
    let name = 'manager';
    let role = await Role.create({ name });

    await role.destroy();

    let retrievedRole = await Role.findOne({ where: { name }, raw });
    expect(retrievedRole).toBeNull();

    name = 'delivery driver';
    role = await Role.create({ name });

    await Role.destroy({ where: { name } });

    retrievedRole = await Role.findOne({ where: { name }, raw });
    expect(retrievedRole).toBeNull();
  });
});
