import sequelize from '@App/db';

import {
  Category,
  Item,
  ItemCategory,
  ItemPrice,
  ItemStatusType,
  ItemTag,
  Tag,
} from '@menu/models';

export const createItem = (
  name: string,
  description: string,
  categoryId: number,
  tagIds: number[] | null,
  prices: { sizeId: number | null; price: string }[],
  status: ItemStatusType,
  photoUrl: string,
) =>
  sequelize.transaction(async (transaction) => {
    const { itemId } = await Item.create(
      { name, description, photoUrl, status },
      { transaction },
    );

    await ItemCategory.create({ itemId, categoryId }, { transaction });

    if (tagIds)
      await ItemTag.bulkCreate(
        tagIds.map((tagId) => ({ itemId, tagId })),
        { transaction },
      );

    const itemPrices = prices.map(({ sizeId, price }) => ({
      itemId,
      sizeId,
      basePrice: price,
    }));
    await ItemPrice.bulkCreate(itemPrices, { transaction });

    return { itemId };
  });

export const createMenu = async () => {
  const categories = await Category.bulkCreate([
    { name: 'bowls' },
    { name: 'kids' },
  ]);

  await Tag.bulkCreate([{ name: 'VG', description: 'Vegeterian' }]);

  await createItem(
    'Chimichurri Steak & Shishito Bowl',
    'roasted carved steak over ancient grains tossed with caramelized onion jam & chimichurri, baby spinach, roasted shishito peppers with broccolini, tomatoes & red onions, grilled lemon',
    categories[0].categoryId,
    null,
    [{ sizeId: null, price: '14.55' }],
    'active',
    'ChimichurriSteakBowl.jpg',
  );

  await createItem(
    'Mediterranean Chicken Bowl',
    'sliced, roasted chicken over cracked whole-grain bulgar tossed with lemon-dill vinaigrette & tahini yogurt sauce, baby spinach, romanesco brocolli, tomatoes, yellow peppers & red onions, topped with pickled golden raisins and sumac',
    categories[0].categoryId,
    null,
    [{ sizeId: null, price: '14.55' }],
    'coming soon',
    'ChimichurriSteakBowl.jpg',
  );

  await createItem(
    'Grilled Turkey & Cheddar Sandwich',
    'add herb mayo, yellow mustard, or tomato by request',
    categories[1].categoryId,
    null,
    [{ sizeId: null, price: '7.5' }],
    'sold out',
    'TurkeyCheddar.jpg',
  );
};
