import { AdminOTP, CustomerOTP } from '@user/models';
import otpService from '@user/services/otp.service';
import { ROLES } from '@user/utils/constants';

import {
  createAdmin,
  createCustomer,
  createRoles,
} from 'tests/modules/user/helper-functions';

import 'tests/db-setup';

beforeAll(async () => {
  await createRoles();
});

describe('get admin otp', () => {
  let adminId: number;

  beforeAll(async () => {
    const { admin } = await createAdmin(
      'Ja',
      'Doe',
      'notjadoe@gmail.com',
      'jaD0ePa$$',
      'active',
      [ROLES.SUPER_USER.roleId],
    );

    adminId = admin.adminId;
  });

  beforeEach(async () => {
    await AdminOTP.destroy({ where: {} });
  });

  it('otp exists and password is valid', async () => {
    const password = '45623';

    await AdminOTP.create({
      adminId,
      type: 'phone',
      password,
      expiresAt: AdminOTP.getExpiration(),
    });

    const result = await otpService.getAdminOTP(adminId, 'phone', password);

    expect(result.otp).not.toBeNull();
    expect(result.isValid).toBe(true);
  });

  it('otp exists and password is not valid', async () => {
    await AdminOTP.create({
      adminId,
      type: 'phone',
      password: '90876',
      expiresAt: AdminOTP.getExpiration(),
    });

    const result = await otpService.getAdminOTP(adminId, 'phone', '12345');

    expect(result.otp).toBeNull();
    expect(result.isValid).toBe(false);
  });

  it('otp does not exist', async () => {
    const result = await otpService.getAdminOTP(adminId, 'phone', '54321');

    expect(result.otp).toBeNull();
    expect(result.isValid).toBe(false);
  });
});

describe('get customer otp', () => {
  let customerId: number;

  beforeAll(async () => {
    const { customer } = await createCustomer(
      'Jay',
      'Doe',
      'notjaydoe@gmail.com',
      'jaD0ePa$$',
      'active',
    );

    customerId = customer.customerId;
  });

  beforeEach(async () => {
    await CustomerOTP.destroy({ where: {} });
  });

  it('otp exists and password is valid', async () => {
    const password = '45623';

    await CustomerOTP.create({
      customerId,
      type: 'phone',
      password,
      expiresAt: CustomerOTP.getExpiration(),
    });

    const result = await otpService.getCustomerOTP(
      customerId,
      'phone',
      password,
    );

    expect(result.otp).not.toBeNull();
    expect(result.isValid).toBe(true);
  });

  it('otp exists and password is not valid', async () => {
    await CustomerOTP.create({
      customerId,
      type: 'phone',
      password: '90876',
      expiresAt: CustomerOTP.getExpiration(),
    });

    const result = await otpService.getCustomerOTP(
      customerId,
      'phone',
      '12345',
    );

    expect(result.otp).toBeNull();
    expect(result.isValid).toBe(false);
  });

  it('otp does not exist', async () => {
    const result = await otpService.getCustomerOTP(
      customerId,
      'phone',
      '54321',
    );

    expect(result.otp).toBeNull();
    expect(result.isValid).toBe(false);
  });
});

describe('create admin otp', () => {
  let adminId: number;

  beforeAll(async () => {
    const { admin } = await createAdmin(
      'Jessica',
      'Doe',
      'jessica@gmail.com',
      'jaD0ePa$$',
      'active',
      [ROLES.SUPER_USER.roleId],
    );

    adminId = admin.adminId;
  });

  beforeEach(async () => {
    await AdminOTP.destroy({ where: {} });
  });

  it('should create new otp', async () => {
    const password = await otpService.createAdminOTP(adminId, 'phone');

    const otp = await AdminOTP.findOne({
      where: { adminId, type: 'phone' },
    });
    expect(otp).not.toBeNull();
    expect(otp?.comparePasswords(password)).toBe(true);
  });

  it('should delete previous otp and create a new one', async () => {
    const { otpId: previousId } = await AdminOTP.create({
      adminId,
      type: 'email',
      password: '12670',
      expiresAt: AdminOTP.getExpiration(),
    });

    await otpService.createAdminOTP(adminId, 'email');

    const previousOTP = await AdminOTP.findByPk(previousId, { raw: true });
    expect(previousOTP).toBeNull();
  });
});

describe('create customer otp', () => {
  let customerId: number;

  beforeAll(async () => {
    const { customer } = await createCustomer(
      'Jessica',
      'Doe',
      'jessie@gmail.com',
      'jaD0ePa$$',
      'active',
    );

    customerId = customer.customerId;
  });

  beforeEach(async () => {
    await CustomerOTP.destroy({ where: {} });
  });

  it('should create new otp', async () => {
    const password = await otpService.createCustomerOTP(customerId, 'phone');

    const otp = await CustomerOTP.findOne({
      where: { customerId, type: 'phone' },
    });
    expect(otp).not.toBeNull();
    expect(otp?.comparePasswords(password)).toBe(true);
  });

  it('should delete previous otp and create a new one', async () => {
    const { otpId: previousId } = await CustomerOTP.create({
      customerId,
      type: 'email',
      password: '12670',
      expiresAt: CustomerOTP.getExpiration(),
    });

    await otpService.createCustomerOTP(customerId, 'email');

    const previousOTP = await CustomerOTP.findByPk(previousId, { raw: true });
    expect(previousOTP).toBeNull();
  });
});
