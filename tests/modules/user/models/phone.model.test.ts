import {
  Phone,
  Admin,
  AdminPhone,
  Customer,
  CustomerPhone,
} from 'modules/user/models';

import '../../../db-setup';

describe('Phone Model', () => {
  const phoneNumber = '1234567890';

  beforeEach(async () => {
    await Phone.destroy({ where: {} });
  });

  it('should create phone number', async () => {
    const data = { phoneId: 1, phoneNumber };

    const phone = await Phone.create(data);
    expect(phone).toMatchObject(data);
  });

  it('should fail to create on invalid phone number', async () => {
    expect(Phone.create({ phoneNumber: '12345678909' })).rejects.toThrow();
  });

  it('should fail to create duplicate phone number', async () => {
    const data = { phoneNumber };

    await Phone.create(data);
    expect(Phone.create(data)).rejects.toThrow();
  });

  it('should retrieve phone number', async () => {
    const { phoneId } = await Phone.create({ phoneNumber });

    let retrievedPhone = await Phone.findByPk(phoneId, { raw: true });
    expect(retrievedPhone).not.toBeNull();

    retrievedPhone = await Phone.findOne({ where: { phoneNumber }, raw: true });
    expect(retrievedPhone).not.toBeNull();
  });

  it('should fail to update phone number', async () => {
    const oldPhone = '1234567890';
    const newPhone = '0987654321';

    await Phone.create({ phoneNumber: oldPhone });

    try {
      await Phone.update(
        { phoneNumber: newPhone },
        { where: { phoneNumber: oldPhone } },
      );

      expect(true).toBe(false);
    } catch (e) {
      const retrievedPhone = await Phone.findOne({
        where: { phoneNumber: newPhone },
        raw: true,
      });
      expect(retrievedPhone).toBeNull();
    }
  });

  it('should delete phone number', async () => {
    const data = { phoneNumber };

    let phone = await Phone.create(data);

    await phone.destroy();

    let retrievedPhone = await Phone.findByPk(phone.phoneId, { raw: true });
    expect(retrievedPhone).toBeNull();

    phone = await Phone.create(data);

    await Phone.destroy({ where: { phoneId: phone.phoneId } });

    retrievedPhone = await Phone.findByPk(phone.phoneId, { raw: true });
    expect(retrievedPhone).toBeNull();
  });
});

describe('Phone and CustomerPhone Assciation', () => {
  const phoneNumber = '1234560987';

  beforeEach(async () => {
    await Phone.destroy({ where: {} });
    await Customer.destroy({ where: {} });
  });

  it('should delete CustomerPhone on Phone delete', async () => {
    const { phoneId } = await Phone.create({ phoneNumber });
    const { customerId } = await Customer.create({
      firstName: 'John',
      lastName: 'Doe',
      status: 'active',
    });
    await CustomerPhone.create({
      customerId,
      phoneId,
      status: 'active',
    });

    await Phone.destroy({ where: { phoneNumber } });

    const retrievedPhone = await Phone.findOne({
      where: { phoneId, phoneNumber },
      raw: true,
    });
    const retrievedCustomerPhone = await CustomerPhone.findByPk(customerId, {
      raw: true,
    });

    expect(retrievedPhone).toBeNull();
    expect(retrievedCustomerPhone).toBeNull();
  });

  it('should not delete Customer and Phone on CustomerPhone delete', async () => {
    const { phoneId } = await Phone.create({ phoneNumber });
    const { customerId } = await Customer.create({
      firstName: 'Johns',
      lastName: 'Doe',
      status: 'active',
    });
    await CustomerPhone.create({
      customerId,
      phoneId,
      status: 'active',
    });

    await CustomerPhone.destroy({ where: { customerId, phoneId } });

    const retrievedCustomerPhone = await CustomerPhone.findByPk(customerId, {
      raw: true,
    });
    const retrievedPhone = await Phone.findOne({
      where: { phoneId },
      raw: true,
    });

    expect(retrievedCustomerPhone).toBeNull();
    expect(retrievedPhone).not.toBeNull();
  });
});

describe('Phone and AdminPhone Assciation', () => {
  const phoneNumber = '1234560987';

  beforeEach(async () => {
    await Phone.destroy({ where: {} });
    await Admin.destroy({ where: {} });
  });

  it('should delete AdminPhone on Phone delete', async () => {
    const { phoneId } = await Phone.create({ phoneNumber });
    const { adminId } = await Admin.create({
      firstName: 'John',
      lastName: 'Doe',
      status: 'active',
    });
    await AdminPhone.create({ adminId, phoneId, status: 'active' });

    await Phone.destroy({ where: { phoneId, phoneNumber } });

    const retrievedPhone = await Phone.findOne({
      where: { phoneId, phoneNumber },
      raw: true,
    });
    const retrievedAdminPhone = await AdminPhone.findByPk(adminId, {
      raw: true,
    });

    expect(retrievedPhone).toBeNull();
    expect(retrievedAdminPhone).toBeNull();
  });

  it('should not delete Phone on AdminPhone delete', async () => {
    const { phoneId } = await Phone.create({ phoneNumber });
    const { adminId } = await Admin.create({
      firstName: 'Johns',
      lastName: 'Doe',
      status: 'active',
    });
    await AdminPhone.create({ adminId, phoneId, status: 'active' });

    await AdminPhone.destroy({ where: { adminId, phoneId } });

    const retrievedAdminPhone = await AdminPhone.findByPk(adminId, {
      raw: true,
    });
    const retrievedPhone = await Phone.findOne({
      where: { phoneId, phoneNumber },
      raw: true,
    });

    expect(retrievedAdminPhone).toBeNull();
    expect(retrievedPhone).not.toBeNull();
  });
});
