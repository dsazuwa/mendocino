import { Tag } from '@menu/models';

import 'tests/db-setup';

describe('Tag Model', () => {
  it('should create tag', async () => {
    const data = { name: 'sf', description: 'seafood' };

    const tag = await Tag.create(data);
    expect(tag).toMatchObject(data);
  });

  it('should fail to create on duplicate name', async () => {
    const data = { name: 'n', description: 'nuts' };

    await Tag.create(data);
    expect(Tag.create(data)).rejects.toThrow();
  });

  it('should retrieve tag', async () => {
    const { tagId } = await Tag.create({
      name: 'vg',
      description: 'vegeterian',
    });

    let retrievedTag = await Tag.findByPk(tagId, {
      raw: true,
    });
    expect(retrievedTag).not.toBeNull();

    retrievedTag = await Tag.findOne({
      where: { tagId },
      raw: true,
    });
    expect(retrievedTag).not.toBeNull();
  });

  it('should update tag', async () => {
    const oldName = 'GF';
    const newName = 'kiGds';

    const tag = await Tag.create({
      name: oldName,
      description: 'Gluten Free',
    });

    await tag.update({ name: newName });

    let retrievedTag = await Tag.findOne({
      where: { name: newName },
      raw: true,
    });
    expect(retrievedTag).not.toBeNull();

    await Tag.update({ name: oldName }, { where: { tagId: tag.tagId } });

    retrievedTag = await Tag.findOne({
      where: { name: oldName },
      raw: true,
    });
    expect(retrievedTag).not.toBeNull();
  });

  it('should delete tag', async () => {
    const data = { name: 'v', description: 'Vegan' };

    let tag = await Tag.create(data);

    await tag.destroy();

    let retrievedTag = await Tag.findByPk(tag.tagId, {
      raw: true,
    });
    expect(retrievedTag).toBeNull();

    tag = await Tag.create(data);

    await Tag.destroy({ where: { tagId: tag.tagId } });

    retrievedTag = await Tag.findByPk(tag.tagId, {
      raw: true,
    });
    expect(retrievedTag).toBeNull();
  });
});
