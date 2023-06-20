import { Menu, MenuCategoryType, MenuStatusType, Order, OrderItem, User } from '../../src/models';
import '../utils/db-setup';

const userData = {
  firstName: 'Jade',
  lastName: 'Doe',
  email: 'jadeDoe@gmail.com',
  password: 'jadeD0ePa$$',
};

const menuData = [
  {
    name: 'Avocado & Quinoa Superfood Ensalada',
    description:
      'chopped romaine, curly kale, quinoa & millet, housemade superfood krunchies, succotash with roasted corn, black beans & jicama, red onions, cilantro, cotija cheese, grape tomatoes, avocado with chipotle vinaigrette',
    category: 'soulful salads' as MenuCategoryType,
    status: 'available' as MenuStatusType,
    photoUrl: 'avocado-quinoa-superfood-ensalada.png',
    price: 13,
  },
  {
    name: 'The Farm Club',
    description:
      "shaved, roasted turkey breast, smashed avocado, nitrate-free Applewood smoked bacon, herb aioli, tomatoes, mixed greens, pickled red onions on Mom's seeded whole wheat",
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

describe('Order Model', () => {
  it('should create order', async () => {
    const order = await Order.create({
      userId: user.id,
      total: 18,
    });

    expect(order).not.toBeNull();
  });

  it('should retrieve order', async () => {
    const order = await Order.create({
      userId: user.id,
      total: 12,
    });

    const retrievedOrder = await Order.findByPk(order.id);
    expect(retrievedOrder).not.toBeNull();
  });

  it('should update order', async () => {
    const order = await Order.create({
      userId: user.id,
      total: 6,
    });

    await order.update({ total: 13 });

    const retrievedOrder = await Order.findByPk(order.id);
    expect(retrievedOrder).not.toBeNull();
  });

  it('should delete order', async () => {
    const order = await Order.create({
      userId: user.id,
      total: 6,
    });

    await order.destroy();

    const deletedOrder = await Order.findByPk(order.id);
    expect(deletedOrder).toBeNull();
  });
});

describe('Order Item Model', () => {
  let order: Order;

  beforeAll(async () => {
    order = await Order.create({
      userId: user.id,
      total: 38,
    });
  });

  it('should create order item', async () => {
    const orderItem = await OrderItem.create({
      orderId: order.id,
      menuId: menu[0].id,
      quantity: 2,
      price: 13,
    });

    expect(order).not.toBeNull();
  });

  it('should retrieve order item', async () => {
    const orderItem = await OrderItem.create({
      orderId: order.id,
      menuId: menu[1].id,
      quantity: 2,
      price: 13,
    });

    const retrievedOrderItem = await OrderItem.findOne({
      where: {
        orderId: order.id,
        menuId: menu[1].id,
      },
    });

    expect(retrievedOrderItem).not.toBeNull();
  });

  it('should update order item', async () => {
    const orderItem = await OrderItem.create({
      orderId: order.id,
      menuId: menu[2].id,
      quantity: 1,
      price: 6,
    });

    await orderItem.update({ quantity: 2 });

    const retrievedOrderItem = await OrderItem.findOne({
      where: {
        orderId: order.id,
        menuId: menu[2].id,
        quantity: 2,
      },
    });

    expect(retrievedOrderItem).not.toBeNull;
  });

  it('should delete order item', async () => {
    const data = {
      orderId: order.id,
      menuId: menu[0].id,
    };

    const orderItem = await OrderItem.findOne({ where: data });

    await orderItem!.destroy();

    const deletedOrder = await OrderItem.findOne({ where: data });

    expect(deletedOrder).toBeNull();
  });
});

describe('Order and Order Item Relationship', () => {
  let order: Order;

  beforeAll(async () => {
    order = await Order.create({
      userId: user.id,
      total: 13,
    });
  });

  it('should create Order Item with Order', async () => {
    await order.createOrderItem({
      menuId: menu[0].id,
      quantity: 1,
      price: 13,
    });

    const retrievedOrderItem = await OrderItem.findOne({
      where: {
        orderId: order.id,
        menuId: menu[0].id,
      },
    });

    expect(retrievedOrderItem).not.toBeNull();
    expect(retrievedOrderItem!.orderId).toBe(order.id);
  });

  it('should retrieve Order Item with Order', async () => {
    const orderItems = await order.getOrderItems();
    expect(orderItems.length).toBe(1);
    expect(orderItems[0].menuId).toBe(menu[0].id);
  });

  it('should not delete Order on Order Item delete', async () => {
    const orderItem = await order.createOrderItem({
      menuId: menu[1].id,
      quantity: 1,
      price: 12,
    });

    await orderItem.destroy();

    const retrievedOrder = await Order.findByPk(order.id);
    expect(retrievedOrder).not.toBeNull();
  });

  it('should delete Order Item on Order delete', async () => {
    await order.createOrderItem({
      menuId: menu[2].id,
      quantity: 1,
      price: 6,
    });

    await order.destroy();

    const retrievedOrderItem = await OrderItem.findOne({
      where: {
        orderId: order.id,
        menuId: menu[2].id,
      },
    });

    expect(retrievedOrderItem).toBeNull();
  });
});

describe('Order and User Relationship', () => {
  beforeAll(async () => {
    await Order.sync({ force: true });
  });

  it('should create Order with User', async () => {
    const order = await user.createOrder({ total: 12 });

    const retrievedOrder = await Order.findByPk(order.id);
    expect(retrievedOrder).not.toBeNull();
  });

  it('should retrieve all orders', async () => {
    const orders = await user.getOrders();
    expect(orders.length).toBe(1);
    expect(orders[0].userId).toBe(user.id);
  });

  it('should not delete User on Order delete', async () => {
    const order = await user.createOrder({ total: 6 });

    await order.destroy();

    const retrievedUser = await User.findByPk(user.id);
    expect(retrievedUser).not.toBeNull();
  });

  it('should not delete Order on User delete', async () => {
    const order = await user.createOrder({ total: 6 });

    await user.destroy();

    const retrievedOrder = await Order.findByPk(order.id);
    expect(retrievedOrder).not.toBeNull();
  });
});

describe('Order Item and Menu Relationship', () => {
  let order: Order;

  beforeAll(async () => {
    user = await User.create({
      firstName: 'Joseph',
      lastName: 'Doe',
      email: 'josephdoe@gmail.com',
      password: 'josephD0ePa$$',
    });

    order = await user.createOrder({ total: 70 });
  });

  it('should not delete Menu on Order Item delete', async () => {
    const orderItem = await order.createOrderItem({
      menuId: menu[0].id,
      price: 13,
      quantity: 6,
    });

    await orderItem.destroy();

    const menuItem = await Menu.findByPk(menu[0].id);
    expect(menuItem).not.toBeNull();
  });

  it('should not delete Order Item on Menu delete', async () => {
    const item = await order.createOrderItem({
      menuId: menu[2].id,
      price: 6,
      quantity: 5,
    });

    await menu[2].destroy();

    const retrievedItem = await OrderItem.findByPk(item.id);
    expect(retrievedItem).not.toBeNull();
  });
});
