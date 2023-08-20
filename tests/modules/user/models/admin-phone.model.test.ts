import { Admin, AdminPhone, AdminPhoneStatusType, Phone } from '@user/models';
import { ROLES } from '@user/utils/constants';

import { createAdmin, createRoles } from '../helper-functions';

import 'tests/db-setup';

const raw = true;

describe('AdminPhone Model', () => {
  const phoneNumber = '1234569012';

  let adminId: number;
  let phoneId: number;

  beforeAll(async () => {
    await createRoles();

    const { admin } = await createAdmin(
      'James',
      'Doe',
      'jamesdoe@gmail.com',
      'jamesD0ePa$$',
      'active',
      [ROLES.DELIVERY_DRIVER.roleId],
    );
    adminId = admin.adminId;

    const p = await Phone.create({ phoneNumber });
    phoneId = p.phoneId;
  });

  beforeEach(async () => {
    await AdminPhone.destroy({ where: {} });
  });

  it('should create phone number', async () => {
    const data = {
      adminId,
      phoneId,
      status: 'active' as AdminPhoneStatusType,
    };

    const phone = await AdminPhone.create(data);

    expect(phone).toMatchObject(data);
  });

  it('should fail on duplicate phone number', async () => {
    const { admin } = await createAdmin(
      'Jamal',
      'Doe',
      'jamaldoe@gmail.com',
      'jamalD0ePa$$',
      'active',
      [ROLES.DELIVERY_DRIVER.roleId],
    );

    await AdminPhone.create({ adminId, phoneId, status: 'pending' });

    let count = await AdminPhone.count({ where: { adminId: admin.adminId } });
    expect(count).toBe(0);

    try {
      await AdminPhone.create({
        adminId: admin.adminId,
        phoneId,
        status: 'pending',
      });

      expect(true).toBe(false);
    } catch (e) {
      count = await AdminPhone.count({ where: { adminId: admin.adminId } });
      expect(count).toBe(0);
    }
  });

  it('should retrieve phone number', async () => {
    await AdminPhone.create({ adminId, phoneId, status: 'active' });

    const phoneNumbers = await AdminPhone.findAll({
      where: { adminId },
      raw,
    });
    expect(phoneNumbers.length).toEqual(1);
    expect(phoneNumbers[0]).toBeDefined();
  });

  it('should update phone number status', async () => {
    const oldStatus = 'active';
    const newStatus = 'pending';

    const phone = await AdminPhone.create({
      adminId,
      phoneId,
      status: oldStatus,
    });

    await phone.update({ status: newStatus });

    let retrievedPhone = await AdminPhone.findOne({
      where: { phoneId: phone.phoneId },
    });
    expect(retrievedPhone).not.toBeNull();

    await AdminPhone.update(
      { status: oldStatus },
      { where: { phoneId: phone.phoneId } },
    );

    retrievedPhone = await AdminPhone.findOne({
      where: { phoneId: phone.phoneId },
    });
    expect(retrievedPhone).not.toBeNull();
  });

  it('should delete phone number', async () => {
    const data = {
      adminId,
      phoneId,
      status: 'active' as AdminPhoneStatusType,
    };

    let phone = await AdminPhone.create(data);

    await phone.destroy();

    let retrievedPhone = await AdminPhone.findOne({
      where: { phoneId: phone.phoneId },
      raw,
    });
    expect(retrievedPhone).toBeNull();

    phone = await AdminPhone.create(data);

    await AdminPhone.destroy({
      where: { phoneId: phone.phoneId },
    });

    retrievedPhone = await AdminPhone.findOne({
      where: { phoneId: phone.phoneId },
      raw,
    });
    expect(retrievedPhone).toBeNull();
  });

  it('should not delete Phone on AdminPhone delete', async () => {
    const adminPhone = await AdminPhone.create({
      adminId,
      phoneId,
      status: 'active',
    });

    await adminPhone.destroy();

    const phone = await Phone.findOne({ where: { phoneNumber } });
    expect(phone).not.toBeNull();
  });

  it('should not delete Admin on AdminPhone delete', async () => {
    const phone = await AdminPhone.create({
      adminId,
      phoneId,
      status: 'active',
    });

    await phone.destroy();

    const admin = await Admin.findByPk(adminId, { raw });
    expect(admin).not.toBeNull();
  });

  it('should delete AdminPhone on Phone delete', async () => {
    const phone = await AdminPhone.create({
      adminId,
      phoneId,
      status: 'active',
    });

    await Phone.destroy({ where: { phoneId } });

    const retrievedPhone = await AdminPhone.findByPk(phone.phoneId, {
      raw: true,
    });
    expect(retrievedPhone).toBeNull();
  });

  it('should delete AdminPhone on Admin delete', async () => {
    const p = await Phone.create({ phoneNumber });
    const phone = await AdminPhone.create({
      adminId,
      phoneId: p.phoneId,
      status: 'active',
    });

    await Admin.destroy({ where: { adminId } });

    const retrievedPhone = await AdminPhone.findByPk(phone.phoneId, {
      raw: true,
    });
    expect(retrievedPhone).toBeNull();
  });
});
