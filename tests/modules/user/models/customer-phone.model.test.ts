import {
  Customer,
  CustomerPhone,
  CustomerPhoneStatusType,
  Phone,
} from '@user/models';

import { createCustomer } from '../helper-functions';

import 'tests/db-setup';

const raw = true;

describe('CustomerPhone Model', () => {
  const phoneNumber = '1234569012';

  let customerId: number;
  let phoneId: number;

  beforeAll(async () => {
    const { customer } = await createCustomer(
      'James',
      'Doe',
      'jamesdoe@gmail.com',
      'jamesD0ePa$$',
      'active',
    );
    customerId = customer.customerId;

    const p = await Phone.create({ phoneNumber });
    phoneId = p.phoneId;
  });

  beforeEach(async () => {
    await CustomerPhone.destroy({ where: {} });
  });

  it('should create phone number', async () => {
    const data = {
      customerId,
      phoneId,
      status: 'active' as CustomerPhoneStatusType,
    };

    const phone = await CustomerPhone.create(data);

    expect(phone).toMatchObject(data);
  });

  it('should fail on duplicate phone number', async () => {
    const { customer } = await createCustomer(
      'Jamal',
      'Doe',
      'jamaldoe@gmail.com',
      'jamalD0ePa$$',
      'active',
    );

    await CustomerPhone.create({ customerId, phoneId, status: 'pending' });

    let count = await CustomerPhone.count({
      where: { customerId: customer.customerId },
    });
    expect(count).toBe(0);

    try {
      await CustomerPhone.create({
        customerId: customer.customerId,
        phoneId,
        status: 'pending',
      });

      expect(true).toBe(false);
    } catch (e) {
      count = await CustomerPhone.count({
        where: { customerId: customer.customerId },
      });
      expect(count).toBe(0);
    }
  });

  it('should retrieve phone number', async () => {
    await CustomerPhone.create({ customerId, phoneId, status: 'active' });

    const phoneNumbers = await CustomerPhone.findAll({
      where: { customerId },
      raw,
    });
    expect(phoneNumbers.length).toEqual(1);
    expect(phoneNumbers[0]).toBeDefined();
  });

  it('should update phone number status', async () => {
    const oldStatus = 'active';
    const newStatus = 'pending';

    const phone = await CustomerPhone.create({
      customerId,
      phoneId,
      status: oldStatus,
    });

    await phone.update({ status: newStatus });

    let retrievedPhone = await CustomerPhone.findOne({
      where: { phoneId: phone.phoneId },
    });
    expect(retrievedPhone).not.toBeNull();

    await CustomerPhone.update(
      { status: oldStatus },
      { where: { phoneId: phone.phoneId } },
    );

    retrievedPhone = await CustomerPhone.findOne({
      where: { phoneId: phone.phoneId },
    });
    expect(retrievedPhone).not.toBeNull();
  });

  it('should delete phone number', async () => {
    const data = {
      customerId,
      phoneId,
      status: 'active' as CustomerPhoneStatusType,
    };

    let phone = await CustomerPhone.create(data);

    await phone.destroy();

    let retrievedPhone = await CustomerPhone.findOne({
      where: { phoneId: phone.phoneId },
      raw,
    });
    expect(retrievedPhone).toBeNull();

    phone = await CustomerPhone.create(data);

    await CustomerPhone.destroy({
      where: { phoneId: phone.phoneId },
    });

    retrievedPhone = await CustomerPhone.findOne({
      where: { phoneId: phone.phoneId },
      raw,
    });
    expect(retrievedPhone).toBeNull();
  });

  it('should not delete Phone on CustomerPhone delete', async () => {
    const customerPhone = await CustomerPhone.create({
      customerId,
      phoneId,
      status: 'active',
    });

    await customerPhone.destroy();

    const phone = await Phone.findOne({ where: { phoneNumber } });
    expect(phone).not.toBeNull();
  });

  it('should not delete Customer on CustomerPhone delete', async () => {
    const phone = await CustomerPhone.create({
      customerId,
      phoneId,
      status: 'active',
    });

    await phone.destroy();

    const customer = await Customer.findByPk(customerId, { raw });
    expect(customer).not.toBeNull();
  });

  it('should delete CustomerPhone on Phone delete', async () => {
    const phone = await CustomerPhone.create({
      customerId,
      phoneId,
      status: 'active',
    });

    await Phone.destroy({ where: { phoneId } });

    const retrievedPhone = await CustomerPhone.findByPk(phone.phoneId, {
      raw: true,
    });
    expect(retrievedPhone).toBeNull();
  });

  it('should delete CustomerPhone on Customer delete', async () => {
    const p = await Phone.create({ phoneNumber });
    const phone = await CustomerPhone.create({
      customerId,
      phoneId: p.phoneId,
      status: 'active',
    });

    await Customer.destroy({ where: { customerId } });

    const retrievedPhone = await CustomerPhone.findByPk(phone.phoneId, {
      raw: true,
    });
    expect(retrievedPhone).toBeNull();
  });
});
