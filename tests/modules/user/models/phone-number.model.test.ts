import { PhoneNumber, PhoneNumberStatusype, User } from '@user/models';
import { ROLES } from '@user/utils/constants';

import { createUserAccount } from '../helper-functions';

import 'tests/user.db-setup';

const raw = true;

describe('Phone Number Model', () => {
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

  it('should create phone number', async () => {
    const data = {
      userId,
      phoneNumber: '123456789012',
      status: 'active' as PhoneNumberStatusype,
    };

    const phoneNumber = await PhoneNumber.create(data);
    expect(phoneNumber).toMatchObject(data);
  });

  it('should retrieve phone number', async () => {
    const phoneNumbers = await PhoneNumber.findAll({ where: { userId }, raw });
    expect(phoneNumbers.length).toEqual(1);
    expect(phoneNumbers[0]).toBeDefined();
  });

  it('should update phone number', async () => {
    const oldStatus = 'active';
    const newStatus = 'pending';

    const phoneNumber = await PhoneNumber.create({
      userId,
      phoneNumber: '123456989012',
      status: oldStatus,
    });

    await phoneNumber.update({ status: newStatus });

    let retrievedPhoneNumber = await PhoneNumber.findOne({
      where: { phoneNumberId: phoneNumber.phoneNumberId },
    });
    expect(retrievedPhoneNumber).not.toBeNull();

    await PhoneNumber.update(
      { status: oldStatus },
      { where: { phoneNumberId: phoneNumber.phoneNumberId } },
    );

    retrievedPhoneNumber = await PhoneNumber.findOne({
      where: { phoneNumberId: phoneNumber.phoneNumberId },
    });
    expect(retrievedPhoneNumber).not.toBeNull();
  });

  it('should delete phone number', async () => {
    const data = {
      userId,
      phoneNumber: '128456789012',
      status: 'active' as PhoneNumberStatusype,
    };

    let phoneNumber = await PhoneNumber.create(data);

    await phoneNumber.destroy();

    let retrievedPhoneNumber = await PhoneNumber.findOne({
      where: { phoneNumberId: phoneNumber.phoneNumberId },
      raw,
    });
    expect(retrievedPhoneNumber).toBeNull();

    phoneNumber = await PhoneNumber.create(data);

    await PhoneNumber.destroy({
      where: { phoneNumberId: phoneNumber.phoneNumberId },
    });

    retrievedPhoneNumber = await PhoneNumber.findOne({
      where: { phoneNumberId: phoneNumber.phoneNumberId },
      raw,
    });
    expect(retrievedPhoneNumber).toBeNull();
  });

  it('should not delete User on Phone Number delete', async () => {
    const phoneNumber = await PhoneNumber.create({
      userId,
      phoneNumber: '123346789012',
      status: 'active',
    });

    await phoneNumber.destroy();

    const user = await User.findByPk(userId, { raw });
    expect(user).not.toBeNull();
  });

  it('should delete Phone Number on User delete', async () => {
    const phoneNumber = await PhoneNumber.create({
      userId,
      phoneNumber: '809161710361',
      status: 'active',
    });

    await User.destroy({ where: { userId } });

    const retrievedPhoneNumber = await PhoneNumber.findByPk(
      phoneNumber.phoneNumberId,
      { raw: true },
    );
    expect(retrievedPhoneNumber).toBeNull();
  });
});
