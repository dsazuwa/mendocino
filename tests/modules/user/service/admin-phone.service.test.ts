import { AdminOTP, AdminPhone, Phone } from 'modules/user/models';
import adminPhoneService from 'modules/user/services/admin-phone.service';
import { ROLES } from 'modules/user/utils/constants';

import { createAdmin, createRoles } from '../helper-functions';

import '../../../db-setup';

beforeAll(async () => {
  await createRoles();
});

describe('admin phone number management', () => {
  const oldPhoneNumber = '1234567890';
  const newPhoneNumber = '0987654321';

  let adminId: number;

  beforeAll(async () => {
    const { admin } = await createAdmin(
      'Jimmy',
      'Doe',
      'jimmydoe@gmail.com',
      'jimmyD0ePa$$',
      'active',
      [ROLES.DELIVERY_DRIVER.roleId],
    );
    adminId = admin.adminId;
  });

  beforeEach(async () => {
    await Phone.destroy({ where: {} });
    await AdminPhone.destroy({ where: {} });
    await AdminOTP.destroy({ where: {} });
  });

  it('should create a new phone number', async () => {
    const phoneNumber = oldPhoneNumber;

    const password = await adminPhoneService.createPhone(adminId, phoneNumber);

    const phone = await Phone.findOne({ where: { phoneNumber }, raw: true });
    expect(phone).not.toBeNull();

    const adminPhone = await AdminPhone.findOne({
      where: { adminId, phoneId: phone?.phoneId, status: 'pending' },
      raw: true,
    });
    expect(adminPhone).not.toBeNull();

    const otp = await AdminOTP.findOne({ where: { adminId, type: 'phone' } });
    expect(otp).not.toBeNull();
    expect(otp?.comparePasswords(password)).toBe(true);
  });

  it('should destroy previous phone number and create a new one', async () => {
    const oldPhone = await Phone.create({ phoneNumber: oldPhoneNumber });
    await AdminPhone.create({
      adminId,
      phoneId: oldPhone.phoneId,
      status: 'active',
    });

    let previousPhone = await AdminPhone.findOne({
      where: { adminId, phoneId: oldPhone.phoneId },
      raw: true,
    });
    expect(previousPhone).not.toBeNull();

    const password = await adminPhoneService.createPhone(
      adminId,
      newPhoneNumber,
    );

    previousPhone = await AdminPhone.findOne({
      where: { adminId, phoneId: oldPhone.phoneId },
      raw: true,
    });
    expect(previousPhone).toBeNull();

    const newPhone = await Phone.findOne({
      where: { phoneNumber: newPhoneNumber },
      raw: true,
    });
    expect(newPhone).not.toBeNull();

    const newAdminPhone = await AdminPhone.findOne({
      where: { adminId, phoneId: newPhone?.phoneId, status: 'pending' },
      raw: true,
    });
    expect(newAdminPhone).not.toBeNull();

    const otp = await AdminOTP.findOne({ where: { adminId, type: 'phone' } });
    expect(otp).not.toBeNull();
    expect(otp?.comparePasswords(password)).toBe(true);
  });

  it('should update phone number status to active', async () => {
    const phone = await Phone.create({ phoneNumber: oldPhoneNumber });
    await AdminPhone.create({
      adminId,
      phoneId: phone.phoneId,
      status: 'pending',
    });
    await AdminOTP.create({
      adminId,
      type: 'phone',
      password: '12345',
      expiresAt: AdminOTP.getExpiration(),
    });

    await adminPhoneService.verifyPhone(adminId);

    const retrievedPhone = await AdminPhone.findOne({
      where: { adminId, status: 'active' },
      raw: true,
    });
    expect(retrievedPhone).not.toBeNull();

    const retrievedOTP = await AdminOTP.findOne({
      where: { adminId, type: 'phone' },
      raw: true,
    });
    expect(retrievedOTP).toBeNull();
  });

  it('should delete phone number', async () => {
    const { phoneId } = await Phone.create({ phoneNumber: oldPhoneNumber });
    await AdminPhone.create({
      adminId,
      phoneId,
      status: 'active',
    });

    await adminPhoneService.deletePhone(adminId);

    const phone = await AdminPhone.findOne({ where: { adminId }, raw: true });
    expect(phone).toBeNull();
  });
});
