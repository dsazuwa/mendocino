import { Op, QueryTypes } from 'sequelize';

import sequelize from '@App/db';
import { ApiError } from '@App/utils';

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
import { MenuItem, PriceType } from '@menu/types';

const getCategoryId = async (name: string) => {
  const retrievedCategory = await Category.findOne({
    where: { name: { [Op.like]: name } },
  });

  if (!retrievedCategory)
    throw ApiError.badRequest(`Category - ${name} - does not exist`);

  return retrievedCategory.categoryId;
};

const getTagIds = async (tags: string[] | null) => {
  if (!tags) return null;

  const tagIds: number[] = [];

  const promises = tags.map(async (t) => {
    const tag = await Tag.findOne({
      where: { name: { [Op.iLike]: t } },
      raw: true,
    });

    if (!tag) throw ApiError.badRequest(`Size - ${t} - does not exist`);

    tagIds.push(tag.tagId);
  });

  await Promise.all(promises);

  return tagIds;
};

const getSizeIds = async (prices: PriceType[]) => {
  if (prices.length === 1) return [{ sizeId: null, price: prices[0].price }];

  const a: { sizeId: number; price: number }[] = [];

  const promises = prices.map(async (p) => {
    const retrievedSize = await Size.findOne({
      where: { name: { [Op.iLike]: p.size } },
      raw: true,
    });

    if (!retrievedSize)
      throw ApiError.badRequest(`Size - ${p.size} does not exist`);

    a.push({ sizeId: retrievedSize.sizeId, price: p.price });
  });

  await Promise.all(promises);

  return a;
};

const itemsService = {
  getMenuItems: async () => {
    const query = `
      SELECT 
        "itemId", name, description, category, tags, prices, status, "photoUrl"
      FROM menu.menu_view;`;

    const result = await sequelize.query(query, { type: QueryTypes.SELECT });

    return result.length === 0 ? null : (result as MenuItem[]);
  },

  createItem: async (
    name: string,
    description: string,
    category: string,
    tags: string[] | null,
    prices: PriceType[],
    photoUrl: string,
    status: ItemStatusType,
  ) => {
    const retrievedItem = await Item.findOne({
      where: { name: { [Op.like]: name } },
      raw: true,
    });
    if (retrievedItem) throw ApiError.badRequest('Item already exists');

    const categoryId = await getCategoryId(category);
    const tagIds = await getTagIds(tags);
    const pricesWithId = await getSizeIds(prices);

    return sequelize.transaction(async (transaction) => {
      const item = await Item.create(
        { name, description, status, photoUrl },
        { transaction },
      );

      const { itemId } = item;

      await ItemCategory.create({ itemId, categoryId }, { transaction });

      if (tagIds)
        await ItemTag.bulkCreate(
          tagIds.map((tagId) => ({ itemId, tagId })),
          { transaction },
        );

      const itemPrices = pricesWithId.map(({ sizeId, price }) => ({
        itemId,
        sizeId,
        basePrice: `${price}`,
      }));
      await ItemPrice.bulkCreate(itemPrices, { transaction });

      return itemId;
    });
  },
};

export default itemsService;
