import { AuthOTP, PhoneNumber } from '@user/models';
import phonesService from '@user/services/phones.service';
import { ROLES } from '@user/utils/constants';

import { createUserAccount } from 'tests/modules/user/helper-functions';

import 'tests/user.db-setup';

describe('phone number management', () => {
  const oldPhoneNumber = '1234567890';
  const newPhoneNumber = '0987654321';

  let userId: number;

  beforeAll(async () => {
    const { user } = await createUserAccount(
      'Jimmy',
      'Doe',
      'jimmydoe@gmail.com',
      'jimmyD0ePa$$',
      'active',
      [ROLES.CUSTOMER.roleId],
    );
    userId = user.userId;
  });

  it('should create a new phone number', async () => {
    const phoneNumber = oldPhoneNumber;

    const password = await phonesService.createPhone(userId, phoneNumber);

    const phone = await PhoneNumber.findOne({
      where: { userId, phoneNumber, status: 'pending' },
      raw: true,
    });
    expect(phone).not.toBeNull();

    const otp = await AuthOTP.findOne({ where: { userId, type: 'phone' } });
    expect(otp).not.toBeNull();
    expect(otp?.comparePasswords(password)).toBe(true);
  });

  it('should destroy previous phone number and create a new one', async () => {
    let previousPhone = await PhoneNumber.findOne({
      where: { userId, phoneNumber: oldPhoneNumber },
    });
    expect(previousPhone).not.toBeNull();

    const password = await phonesService.createPhone(userId, newPhoneNumber);

    previousPhone = await PhoneNumber.findOne({
      where: { userId, phoneNumber: oldPhoneNumber },
    });
    expect(previousPhone).toBeNull();

    const newPhone = await PhoneNumber.findOne({
      where: { userId, phoneNumber: newPhoneNumber, status: 'pending' },
      raw: true,
    });
    expect(newPhone).not.toBeNull();

    const otp = await AuthOTP.findOne({ where: { userId, type: 'phone' } });
    expect(otp).not.toBeNull();
    expect(otp?.comparePasswords(password)).toBe(true);
  });

  it('should update phone number status to active', async () => {
    let phone = await PhoneNumber.findOne({
      where: { userId, status: 'pending' },
      raw: true,
    });
    expect(phone).not.toBeNull();

    let otp = await AuthOTP.findOne({
      where: { userId, type: 'phone' },
      raw: true,
    });
    expect(otp).not.toBeNull();

    await phonesService.verifyPhone(userId);

    phone = await PhoneNumber.findOne({
      where: { userId, status: 'active' },
      raw: true,
    });
    expect(phone).not.toBeNull();

    otp = await AuthOTP.findOne({
      where: { userId, type: 'phone' },
      raw: true,
    });
    expect(otp).toBeNull();
  });

  it('should delete phone number', async () => {
    let phone = await PhoneNumber.findOne({ where: { userId }, raw: true });
    expect(phone).not.toBeNull();

    await phonesService.deletePhone(userId);

    phone = await PhoneNumber.findOne({ where: { userId }, raw: true });
    expect(phone).toBeNull();
  });
});
