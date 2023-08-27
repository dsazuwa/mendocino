import { Size } from '@menu/models';

import 'tests/db-setup';

describe('Size Model', () => {
  it('should create size', async () => {
    const data = { name: 'large' };
    const size = await Size.create(data);
    expect(size).toMatchObject(data);
  });

  it('should fail to create on duplicate name', async () => {
    const data = { name: 'medium' };

    await Size.create(data);
    expect(Size.create(data)).rejects.toThrow();
  });

  it('should retrieve size', async () => {
    const { sizeId } = await Size.create({ name: 'regular' });

    let retrievedSize = await Size.findByPk(sizeId, { raw: true });
    expect(retrievedSize).not.toBeNull();

    retrievedSize = await Size.findOne({ where: { sizeId }, raw: true });
    expect(retrievedSize).not.toBeNull();
  });

  it('should update size', async () => {
    const oldName = 'x large';
    const newName = 'extra large';

    const size = await Size.create({ name: oldName });

    await size.update({ name: newName });

    let retrievedSize = await Size.findOne({
      where: { name: newName },
      raw: true,
    });
    expect(retrievedSize).not.toBeNull();

    await Size.update({ name: oldName }, { where: { sizeId: size.sizeId } });

    retrievedSize = await Size.findOne({
      where: { name: oldName },
      raw: true,
    });
    expect(retrievedSize).not.toBeNull();
  });

  it('should delete size', async () => {
    const data = { name: 'extra small' };

    let size = await Size.create(data);

    await size.destroy();

    let retrievedSize = await Size.findByPk(size.sizeId, { raw: true });
    expect(retrievedSize).toBeNull();

    size = await Size.create(data);

    await Size.destroy({ where: { sizeId: size.sizeId } });

    retrievedSize = await Size.findByPk(size.sizeId, { raw: true });
    expect(retrievedSize).toBeNull();
  });
});
