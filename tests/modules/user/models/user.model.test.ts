import { User } from '@user/models';

import 'tests/db-setup';

describe('User Model', () => {
  it('should create user', async () => {
    const data = {
      firstName: 'Jolene',
      lastName: 'Doe',
    };
    const user = await User.create(data);

    expect(user.firstName).toBe(data.firstName);
    expect(user.lastName).toBe(data.lastName);
  });

  it('should retrieve user', async () => {
    const { userId, firstName, lastName } = await User.create({
      firstName: 'Janice',
      lastName: 'Doe',
    });

    const retrievedUser = await User.findByPk(userId);
    expect(retrievedUser).not.toBeNull();
    expect(retrievedUser?.firstName).toBe(firstName);
    expect(retrievedUser?.lastName).toBe(lastName);
  });

  it('should update user', async () => {
    const user = await User.create({ firstName: 'Joy', lastName: 'Doe' });

    const newData = {
      firstName: 'Joyous',
    };

    await user.update(newData);

    const updatedUser = await User.findByPk(user.userId);
    expect(updatedUser?.firstName).toEqual(newData.firstName);
  });

  it('should delete user', async () => {
    const { userId } = await User.create({
      firstName: 'Joel',
      lastName: 'Doe',
    });

    await User.destroy({ where: { userId } });

    const deletedUser = await User.findByPk(userId);
    expect(deletedUser).toBeNull();
  });
});
