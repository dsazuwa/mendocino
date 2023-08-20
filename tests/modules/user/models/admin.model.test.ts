import { Admin } from '@user/models';

import 'tests/db-setup';

const raw = true;

beforeAll(async () => {
  await Admin.destroy({ where: {} });
});

describe('Admin Model', () => {
  it('should create admin', async () => {
    const data = {
      firstName: 'Jolene',
      lastName: 'Doe',
    };
    const admin = await Admin.create(data);

    expect(admin).toMatchObject(data);
  });

  it('should retrieve admin', async () => {
    const data = { firstName: 'Janice', lastName: 'Doe' };
    const { adminId } = await Admin.create(data);

    const retrievedAdmin = await Admin.findByPk(adminId, { raw });
    expect(retrievedAdmin).toMatchObject(data);
  });

  it('should update admin', async () => {
    const admin = await Admin.create({ firstName: 'Joy', lastName: 'Doe' });
    const firstName = 'Joyous';

    await admin.update({ firstName });

    const uodatedAdmin = await Admin.findByPk(admin.adminId, { raw });
    expect(uodatedAdmin?.firstName).toEqual(firstName);
  });

  it('should delete admin', async () => {
    const { adminId } = await Admin.create({
      firstName: 'Joel',
      lastName: 'Doe',
    });

    await Admin.destroy({ where: { adminId } });

    const deletedAdmin = await Admin.findByPk(adminId, { raw });
    expect(deletedAdmin).toBeNull();
  });
});
