import { CustomerOTP, CustomerPhone, Phone } from '@app/modules/user/models';
import customerPhoneService from '@app/modules/user/services/customer-phone.service';

import { createCustomer } from '../helper-functions';

import 'tests/db-setup';

describe('customer phone number management', () => {
  const oldPhoneNumber = '1234567890';
  const newPhoneNumber = '0987654321';

  let customerId: number;

  beforeAll(async () => {
    const { customer } = await createCustomer(
      'Jimmy',
      'Doe',
      'jimmydoe@gmail.com',
      'jimmyD0ePa$$',
      'active',
    );
    customerId = customer.customerId;
  });

  beforeEach(async () => {
    await Phone.destroy({ where: {} });
    await CustomerPhone.destroy({ where: {} });
    await CustomerOTP.destroy({ where: {} });
  });

  it('should create a new phone number', async () => {
    const phoneNumber = oldPhoneNumber;

    const result = await customerPhoneService.createPhone(
      customerId,
      phoneNumber,
    );

    const phone = await Phone.findOne({ where: { phoneNumber }, raw: true });
    expect(phone).not.toBeNull();

    const customerPhone = await CustomerPhone.findOne({
      where: { customerId, phoneId: phone?.phoneId, status: 'pending' },
      raw: true,
    });
    expect(customerPhone).not.toBeNull();

    const otp = await CustomerOTP.findOne({
      where: { customerId, type: 'phone' },
    });
    expect(otp).not.toBeNull();
    expect(otp?.comparePasswords(result.otp || '')).toBe(true);
  });

  it('should destroy previous phone number and create a new one', async () => {
    const oldPhone = await Phone.create({ phoneNumber: oldPhoneNumber });
    await CustomerPhone.create({
      customerId,
      phoneId: oldPhone.phoneId,
      status: 'active',
    });

    let previousPhone = await CustomerPhone.findOne({
      where: { customerId, phoneId: oldPhone.phoneId },
      raw: true,
    });
    expect(previousPhone).not.toBeNull();

    const result = await customerPhoneService.createPhone(
      customerId,
      newPhoneNumber,
    );

    previousPhone = await CustomerPhone.findOne({
      where: { customerId, phoneId: oldPhone.phoneId },
      raw: true,
    });
    expect(previousPhone).toBeNull();

    const newPhone = await Phone.findOne({
      where: { phoneNumber: newPhoneNumber },
      raw: true,
    });
    expect(newPhone).not.toBeNull();

    const newCPhone = await CustomerPhone.findOne({
      where: { customerId, phoneId: newPhone?.phoneId, status: 'pending' },
      raw: true,
    });
    expect(newCPhone).not.toBeNull();

    const otp = await CustomerOTP.findOne({
      where: { customerId, type: 'phone' },
    });
    expect(otp).not.toBeNull();
    expect(otp?.comparePasswords(result.otp || '')).toBe(true);
  });

  it('should update phone number status to active', async () => {
    const phone = await Phone.create({ phoneNumber: oldPhoneNumber });
    await CustomerPhone.create({
      customerId,
      phoneId: phone.phoneId,
      status: 'pending',
    });
    await CustomerOTP.create({
      customerId,
      type: 'phone',
      password: '12345',
      expiresAt: CustomerOTP.getExpiration(),
    });

    await customerPhoneService.verifyPhone(customerId);

    const retrievedPhone = await CustomerPhone.findOne({
      where: { customerId, status: 'active' },
      raw: true,
    });
    expect(retrievedPhone).not.toBeNull();

    const retrievedOTP = await CustomerOTP.findOne({
      where: { customerId, type: 'phone' },
      raw: true,
    });
    expect(retrievedOTP).toBeNull();
  });

  it('should delete phone number', async () => {
    const { phoneId } = await Phone.create({ phoneNumber: oldPhoneNumber });
    await CustomerPhone.create({
      customerId,
      phoneId,
      status: 'active',
    });

    await customerPhoneService.deletePhone(customerId);

    const phone = await CustomerPhone.findOne({
      where: { customerId },
      raw: true,
    });
    expect(phone).toBeNull();
  });
});
