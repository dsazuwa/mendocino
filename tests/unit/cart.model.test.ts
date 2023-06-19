import { Cart, Menu, MenuCategoryType, MenuStatusType, User } from '../../src/models';
import '../utils/db-setup';

const userData = {
  firstName: 'Jeff',
  lastName: 'Doe',
  email: 'jeffDoe@gmail.com',
  password: 'jeffD0ePa$$',
};

const menuData = [
  {
    name: 'Avocado & Quinoa Superfood Ensalada',
    description:
      'chopped romaine, curly kale, quinoa & millet, housemade superfood krunchies, succotash with roasted corn, black beans & jicama, red onions, cilantro, cotija cheese, grape tomatoes, avocado with chipotle vinaigrette',
    category: 'salads' as MenuCategoryType,
    status: 'available' as MenuStatusType,
    photoUrl: 'avocado-quinoa-superfood-ensalada.png',
    price: 13,
  },
  {
    name: 'The Farm Club',
    description:
      'shaved, roasted turkey breast, smashed avocado, nitrate-free Applewood smoked bacon, herb aioli, tomatoes, mixed greens, pickled red onions on Mom’s seeded whole wheat',
    category: 'craveable classics' as MenuCategoryType,
    status: 'available' as MenuStatusType,
    photoUrl: 'the-farm-club.png',
    price: 12,
  },
  {
    name: 'Crispy Chicken Tenders',
    description: 'with a side of ketchup or vegan ranch',
    category: 'kids' as MenuCategoryType,
    status: 'available' as MenuStatusType,
    photoUrl: 'crispy-chicken-tenders.png',
    price: 6,
  },
];

let user: User;
let menu: Menu[];

beforeAll(async () => {
  user = await User.create(userData);
  menu = await Menu.bulkCreate(menuData);
});

describe('Cart Model', () => {
  it('should add an item to cart', async () => {
    const data = {
      userId: user.id,
      menuId: menu[0].id,
      quantity: 1,
    };

    let item = await Cart.create(data);
    expect(item.userId).toEqual(user.id);
    expect(item.menuId).toEqual(data.menuId);

    const data1 = {
      menuId: menu[1].id,
      quantity: 10,
    };

    item = await user.createCart(data1);
    expect(item.userId).toEqual(user.id);
    expect(item.menuId).toEqual(data1.menuId);
  });

  it('should retrieve cart', async () => {
    const userCart = await user.getCarts();
    expect(userCart.length).toBe(2);

    const retrievedItem = await Cart.findOne({
      where: {
        userId: user.id,
        menuId: menu[0].id,
      },
    });
    expect(retrievedItem).not.toBeNull();
  });

  it('should update cart', async () => {
    const data = {
      userId: user.id,
      menuId: menu[2].id,
      quantity: 3,
    };

    const cartItem = await Cart.create(data);
    await cartItem.update({ quantity: 4 });

    const retrievedItem = await Cart.findByPk(cartItem.id);
    expect(retrievedItem).not.toBeNull();
    expect(retrievedItem?.quantity).toBe(4);
  });

  it('should delete cart', async () => {
    const cartItem = await Cart.findOne({
      where: {
        userId: user.id,
        menuId: menu[2].id,
      },
    });

    await cartItem!.destroy();

    const deletedItem = await Cart.findByPk(cartItem!.id);

    expect(deletedItem).toBeNull();
  });

  describe('Cascade Deletion', () => {
    beforeAll(async () => {
      await Cart.sync({ force: true });

      const data = [
        {
          userId: user.id,
          menuId: menu[0].id,
          quantity: 1,
        },
        {
          userId: user.id,
          menuId: menu[1].id,
          quantity: 2,
        },
        {
          userId: user.id,
          menuId: menu[2].id,
          quantity: 3,
        },
      ];

      await Cart.bulkCreate(data);
    });

    it('should not delete Menu on Cart delete', async () => {
      const cartItem = await Cart.findOne({
        where: {
          menuId: menu[0].id,
          userId: user.id,
        },
      });

      await cartItem!.destroy();

      expect(Menu.findByPk(cartItem!.menuId)).resolves.toBeDefined();
    });

    it('should not delete User on Cart delete', async () => {
      const cartItem = await Cart.findOne({
        where: {
          menuId: menu[1].id,
          userId: user.id,
        },
      });

      await cartItem!.destroy();

      expect(User.findByPk(user.id)).resolves.toBeDefined();
    });

    it('should delete Cart on Menu delete', async () => {
      await menu[2].destroy();

      const carts = await Cart.findAll({ where: { menuId: menu[2].id } });

      expect(carts.length).toBe(0);
    });

    it('should delete Cart on User delete', async () => {
      const data = [
        {
          userId: user.id,
          menuId: menu[0].id,
          quantity: 1,
        },
        {
          userId: user.id,
          menuId: menu[1].id,
          quantity: 2,
        },
      ];

      await Cart.bulkCreate(data);

      await user.destroy();

      const cartItems = await Cart.findAll({ where: { userId: user.id } });

      expect(cartItems.length).toBe(0);
    });
  });
});
