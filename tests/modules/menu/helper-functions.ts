import { QueryTypes } from 'sequelize';

import sequelize from '@App/db';

import {
  Category,
  Item,
  ItemCategory,
  ItemPrice,
  ItemStatusType,
  ItemTag,
  Size,
  Tag,
} from '@menu/models';

export const getItem = async (itemId: number) => {
  const query = `
      SELECT 
        "itemId", name, description, category, tags, prices, status, "photoUrl"
      FROM menu.menu_view
      WHERE "itemId" = ${itemId};`;

  const result = await sequelize.query(query, { type: QueryTypes.SELECT });

  return result.length === 0 ? null : (result[0] as MenuItem);
};

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
    { name: "chef's creations" },
    { name: 'foodie favorites' },
    { name: 'deli sides' },
    { name: 'bowls' },
    { name: 'kids' },
  ]);

  const chefCreations = categories[0].categoryId;
  const foodieFavs = categories[1].categoryId;
  const bowls = categories[3].categoryId;
  const kids = categories[4].categoryId;

  const tags = await Tag.bulkCreate([
    { name: 'V', description: 'Vegan' },
    { name: 'VG', description: 'Vegeterian' },
    { name: 'GF', description: 'Gluten Free' },
    { name: 'RGF', description: 'Request Gluten Free' },
    { name: 'N', description: 'Nuts' },
  ]);

  const v = tags[0].tagId;
  const gf = tags[2].tagId;
  const rgf = tags[3].tagId;
  const n = tags[4].tagId;

  await Size.bulkCreate([
    { name: 'small' },
    { name: 'medium' },
    { name: 'large' },
  ]);

  await createItem(
    'Hot Honey Peach & Prosciutto',
    'italian prosciutto & sliced peaches with fresh mozzarella, crushed honey roasted almonds, Calabrian chili aioli, hot peach honey, arugula on a toasted sesame roll',
    chefCreations,
    [rgf, n],
    [{ sizeId: null, price: '13.25' }],
    'coming soon',
    'PeachProsciutto.jpg',
  );

  await createItem(
    'Strawberry Fields Salad with Chicken',
    'shaved, roasted chicken breast, strawberries, watermelon radish, shaved fennel, fresh mint, red onions, goat gouda, toasted pistachios, mixed greens, romaine with greek yogurt poppyseed dressing',
    chefCreations,
    [gf, n],
    [{ sizeId: null, price: '13.25' }],
    'coming soon',
    'StrawberryFields.jpg',
  );

  await createItem(
    'Vegan Banh Mi',
    'organic marinated, baked tofu with vegan aioli, sweet chili sauce, pickled daikon & carrots, cucumbers, jalapeños, Thai basil, cilantro on panini-pressed ciabatta',
    foodieFavs,
    [v],
    [{ sizeId: null, price: '11.5' }],
    'discountinued',
    'VeganBahnMi.jpg',
  );

  await createItem(
    'Chimichurri Steak & Shishito Bowl',
    'roasted carved steak over ancient grains tossed with caramelized onion jam & chimichurri, baby spinach, roasted shishito peppers with broccolini, tomatoes & red onions, grilled lemon',
    bowls,
    null,
    [{ sizeId: null, price: '14.55' }],
    'active',
    'ChimichurriSteakBowl.jpg',
  );

  await createItem(
    'Mediterranean Chicken Bowl',
    'sliced, roasted chicken over cracked whole-grain bulgar tossed with lemon-dill vinaigrette & tahini yogurt sauce, baby spinach, romanesco brocolli, tomatoes, yellow peppers & red onions, topped with pickled golden raisins and sumac',
    bowls,
    null,
    [{ sizeId: null, price: '14.55' }],
    'active',
    'ChimichurriSteakBowl.jpg',
  );

  await createItem(
    'Grilled Turkey & Cheddar Sandwich',
    'add herb mayo, yellow mustard, or tomato by request',
    kids,
    null,
    [{ sizeId: null, price: '7.5' }],
    'active',
    'TurkeyCheddar.jpg',
  );
};
