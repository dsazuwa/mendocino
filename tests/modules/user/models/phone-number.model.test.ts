import { PhoneNumber, PhoneNumberStatusype, User } from '@user/models';
import { ROLES } from '@user/utils/constants';

import { createUserAccount } from '../helper-functions';

import 'tests/user.db-setup';

const raw = true;

describe('Phone Number Model', () => {
  const phoneNumber = '1234569012';

  let userId: number;

  beforeAll(async () => {
    const { user } = await createUserAccount(
      'James',
      'Doe',
      'jamesdoe@gmail.com',
      'jamesD0ePa$$',
      'active',
      [ROLES.CUSTOMER.roleId],
    );
    userId = user.userId;
  });

  beforeEach(async () => {
    await PhoneNumber.destroy({ where: {} });
  });

  it('should create phone number', async () => {
    const data = {
      userId,
      phoneNumber,
      status: 'active' as PhoneNumberStatusype,
    };

    const phone = await PhoneNumber.create(data);
    expect(phone).toMatchObject(data);
  });

  it('should fail on duplicate phone number', async () => {
    const { user } = await createUserAccount(
      'Jamal',
      'Doe',
      'jamaldoe@gmail.com',
      'jamalD0ePa$$',
      'active',
      [ROLES.CUSTOMER.roleId],
    );

    await PhoneNumber.create({ userId, phoneNumber, status: 'pending' });

    let count = await PhoneNumber.count({ where: { userId: user.userId } });
    expect(count).toBe(0);

    try {
      await PhoneNumber.create({
        userId: user.userId,
        phoneNumber,
        status: 'pending',
      });

      expect(true).toBe(false);
    } catch (e) {
      count = await PhoneNumber.count({ where: { userId: user.userId } });
      expect(count).toBe(0);
    }
  });

  it('should retrieve phone number', async () => {
    await PhoneNumber.create({ userId, phoneNumber, status: 'active' });

    const phoneNumbers = await PhoneNumber.findAll({
      where: { userId },
      raw,
    });
    expect(phoneNumbers.length).toEqual(1);
    expect(phoneNumbers[0]).toBeDefined();
  });

  it('should update phone number status', async () => {
    const oldStatus = 'active';
    const newStatus = 'pending';

    const phone = await PhoneNumber.create({
      userId,
      phoneNumber,
      status: oldStatus,
    });

    await phone.update({ status: newStatus });

    let retrievedPhone = await PhoneNumber.findOne({
      where: { phoneNumberId: phone.phoneNumberId },
    });
    expect(retrievedPhone).not.toBeNull();

    await PhoneNumber.update(
      { status: oldStatus },
      { where: { phoneNumberId: phone.phoneNumberId } },
    );

    retrievedPhone = await PhoneNumber.findOne({
      where: { phoneNumberId: phone.phoneNumberId },
    });
    expect(retrievedPhone).not.toBeNull();
  });

  it('should fail to update phone number directly', async () => {
    await PhoneNumber.create({
      userId,
      phoneNumber,
      status: 'active',
    });

    const newNumber = '0987656789';

    try {
      await PhoneNumber.update(
        { phoneNumber: newNumber },
        { where: { phoneNumber }, individualHooks: true },
      );

      expect(true).toBe(false);
    } catch (e) {
      const phone = await PhoneNumber.findOne({
        where: { userId, phoneNumber: newNumber },
        raw,
      });
      expect(phone).toBeNull();
    }
  });

  it('should delete phone number', async () => {
    const data = {
      userId,
      phoneNumber: '1256789012',
      status: 'active' as PhoneNumberStatusype,
    };

    let phone = await PhoneNumber.create(data);

    await phone.destroy();

    let retrievedPhone = await PhoneNumber.findOne({
      where: { phoneNumberId: phone.phoneNumberId },
      raw,
    });
    expect(retrievedPhone).toBeNull();

    phone = await PhoneNumber.create(data);

    await PhoneNumber.destroy({
      where: { phoneNumberId: phone.phoneNumberId },
    });

    retrievedPhone = await PhoneNumber.findOne({
      where: { phoneNumberId: phone.phoneNumberId },
      raw,
    });
    expect(retrievedPhone).toBeNull();
  });

  it('should not delete User on Phone Number delete', async () => {
    const phone = await PhoneNumber.create({
      userId,
      phoneNumber,
      status: 'active',
    });

    await phone.destroy();

    const user = await User.findByPk(userId, { raw });
    expect(user).not.toBeNull();
  });

  it('should delete Phone Number on User delete', async () => {
    const phone = await PhoneNumber.create({
      userId,
      phoneNumber,
      status: 'active',
    });

    await User.destroy({ where: { userId } });

    const retrievedPhone = await PhoneNumber.findByPk(phone.phoneNumberId, {
      raw: true,
    });
    expect(retrievedPhone).toBeNull();
  });
});
