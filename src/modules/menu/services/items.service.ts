// import { Op, QueryTypes, Transaction } from 'sequelize';

// import sequelize from '@App/db';
// import { ApiError } from '@App/utils';

// import {
//   Category,
//   Item,
//   ItemCategory,
//   ItemPrice,
//   ItemMenuStatusType,
//   ItemTag,
//   Tag,
// } from '@menu/models';

// const getCategoryId = async (name: string, transaction?: Transaction) => {
//   const retrievedCategory = await Category.findOne({
//     where: { name: { [Op.like]: name } },
//     transaction,
//   });

//   if (!retrievedCategory)
//     throw ApiError.badRequest(`Category - ${name} - does not exist`);

//   return retrievedCategory.categoryId;
// };

// const getTagIds = async (
//   tags: string[] | undefined,
//   transaction?: Transaction,
// ) => {
//   if (!tags) return null;

//   const tagIds: number[] = [];

//   const promises = tags.map(async (t) => {
//     const tag = await Tag.findOne({
//       where: { name: { [Op.iLike]: t } },
//       transaction,
//       raw: true,
//     });

//     if (!tag) throw ApiError.badRequest(`Tag - ${t} - does not exist`);

//     tagIds.push(tag.tagId);
//   });

//   await Promise.all(promises);

//   return tagIds;
// };

const itemsService = {
  // getMenuItems: async () => {
  //   const query = `
  //     SELECT
  //       "itemId", name, description, category, tags, prices, status, "photoUrl"
  //     FROM menu.menu_view;`;
  //   const result = await sequelize.query(query, { type: QueryTypes.SELECT });
  //   return result.length === 0 ? null : (result as MenuItem[]);
  // },
  // createItem: async (
  //   name: string,
  //   description: string,
  //   category: string,
  //   tags: string[] | undefined,
  //   price: string | undefined,
  //   photoUrl: string,
  //   status: ItemMenuStatusType,
  // ) => {
  //   const retrievedItem = await Item.findOne({
  //     where: { name: { [Op.like]: name } },
  //     raw: true,
  //   });
  //   if (retrievedItem) throw ApiError.badRequest('Item already exists');
  //   const categoryId = await getCategoryId(category);
  //   const tagIds = await getTagIds(tags);
  //   return sequelize.transaction(async (transaction) => {
  //     const item = await Item.create(
  //       { name, description, status, photoUrl },
  //       { transaction },
  //     );
  //     const { itemId } = item;
  //     await ItemCategory.create({ itemId, categoryId }, { transaction });
  //     if (tagIds)
  //       await ItemTag.bulkCreate(
  //         tagIds.map((tagId) => ({ itemId, tagId })),
  //         { transaction },
  //       );
  //     if (price)
  //       await ItemPrice.create({ itemId, basePrice: price }, { transaction });
  //     return itemId;
  //   });
  // },
  // updateItem: (
  //   itemId: number,
  //   name: string | undefined,
  //   description: string | undefined,
  //   category: string | undefined,
  //   photoUrl: string | undefined,
  //   status: ItemMenuStatusType | undefined,
  // ) =>
  //   sequelize.transaction(async (transaction) => {
  //     const itemValues: Partial<Item> = {};
  //     if (name && name.trim().length > 0) itemValues.name = name;
  //     if (description && description.trim().length > 0)
  //       itemValues.description = description;
  //     if (photoUrl && photoUrl.trim().length > 0)
  //       itemValues.photoUrl = photoUrl;
  //     if (status && status.trim().length > 0) itemValues.status = status;
  //     await Item.update(itemValues, { where: { itemId }, transaction });
  //     if (category) {
  //       const categoryId = await getCategoryId(category, transaction);
  //       await ItemCategory.update(
  //         { categoryId },
  //         { where: { itemId }, transaction },
  //       );
  //     }
  //   }),
  // updateItemStatus: async (itemId: number, status: 'active' | 'sold out') => {
  //   const result =
  //     status === 'active'
  //       ? await Item.update(
  //           { status },
  //           { where: { itemId, status: 'sold out' } },
  //         )
  //       : await Item.update(
  //           { status },
  //           { where: { itemId, status: 'active' } },
  //         );
  //   return result[0] === 1;
  // },
  // deleteItem: async (itemId: number) => {
  //   const result = await Item.destroy({ where: { itemId } });
  //   return result === 1;
  // },
};

export default itemsService;
