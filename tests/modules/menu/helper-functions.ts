import { QueryTypes } from 'sequelize';

import sequelize from '@app/db';
import {
  Category,
  Item,
  ItemCategory,
  ItemMenuStatusType,
  ItemOrderStatusType,
  ItemPrice,
  ItemTag,
  Location,
  OrderItem,
  Tag,
} from '@app/modules/menu/models';

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
  isOnPublicMenu: boolean,
  sortOrder: number,
  name: string,
  description: string,
  categoryId: number,
  tagIds: number[] | undefined,
  price: string | undefined,
  menuStatus: ItemMenuStatusType,
  orderStatus: ItemOrderStatusType,
  photoUrl: string,
) =>
  sequelize.transaction(async (transaction) => {
    const [location] = await Location.findOrCreate({
      where: {},
      defaults: {
        name: 'Addison',
        phoneNumber: '9723543924',
        address: '5294 Belt Line Road, Suite 105',
        city: 'Dallas',
        state: 'TX',
        zipCode: '75254',
      },
      raw: true,
      transaction,
    });

    const { itemId } = await Item.create(
      {
        isOnPublicMenu,
        sortOrder,
        name,
        description,
        photoUrl,
        status: menuStatus,
      },
      { transaction },
    );

    await OrderItem.create(
      {
        locationId: location.locationId,
        itemId,
        status: orderStatus,
      },
      { transaction },
    );

    await ItemCategory.create({ itemId, categoryId }, { transaction });

    if (tagIds)
      await ItemTag.bulkCreate(
        tagIds.map((tagId) => ({ itemId, tagId })),
        { transaction },
      );

    if (price)
      await ItemPrice.create({ itemId, basePrice: price }, { transaction });

    return { itemId };
  });

export const createMenu = async () => {
  const categories = await Category.bulkCreate([
    { name: "chef's creations", sortOrder: 0 },
    { name: 'foodie favorites', sortOrder: 1 },
    { name: 'deli sides', sortOrder: 2 },
    { name: 'bowls', sortOrder: 3 },
    { name: 'kids', sortOrder: 4 },
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

  await createItem(
    true,
    0,
    'Hot Honey Peach & Prosciutto',
    'italian prosciutto & sliced peaches with fresh mozzarella, crushed honey roasted almonds, Calabrian chili aioli, hot peach honey, arugula on a toasted sesame roll',
    chefCreations,
    [rgf, n],
    '13.25',
    'active',
    'available',
    'PeachProsciutto.jpg',
  );

  await createItem(
    true,
    1,
    'Strawberry Fields Salad with Chicken',
    'shaved, roasted chicken breast, strawberries, watermelon radish, shaved fennel, fresh mint, red onions, goat gouda, toasted pistachios, mixed greens, romaine with greek yogurt poppyseed dressing',
    chefCreations,
    [gf, n],
    '13.25',
    'active',
    'available',
    'StrawberryFields.jpg',
  );

  await createItem(
    true,
    2,
    'Vegan Banh Mi',
    'organic marinated, baked tofu with vegan aioli, sweet chili sauce, pickled daikon & carrots, cucumbers, jalapeños, Thai basil, cilantro on panini-pressed ciabatta',
    foodieFavs,
    [v],
    '11.5',
    'active',
    'available',
    'VeganBahnMi.jpg',
  );

  await createItem(
    true,
    3,
    'Chimichurri Steak & Shishito Bowl',
    'roasted carved steak over ancient grains tossed with caramelized onion jam & chimichurri, baby spinach, roasted shishito peppers with broccolini, tomatoes & red onions, grilled lemon',
    bowls,
    undefined,
    '14.55',
    'active',
    'available',
    'ChimichurriSteakBowl.jpg',
  );

  await createItem(
    true,
    4,
    'Mediterranean Chicken Bowl',
    'sliced, roasted chicken over cracked whole-grain bulgar tossed with lemon-dill vinaigrette & tahini yogurt sauce, baby spinach, romanesco brocolli, tomatoes, yellow peppers & red onions, topped with pickled golden raisins and sumac',
    bowls,
    undefined,
    '14.55',
    'active',
    'available',
    'ChimichurriSteakBowl.jpg',
  );

  await createItem(
    true,
    5,
    'Grilled Turkey & Cheddar Sandwich',
    'add herb mayo, yellow mustard, or tomato by request',
    kids,
    undefined,
    '7.5',
    'active',
    'available',
    'TurkeyCheddar.jpg',
  );
};
