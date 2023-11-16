import { AdminOTP, CustomerOTP } from 'modules/user/models';
import otpService from 'modules/user/services/otp.service';
import { ROLES } from 'modules/user/utils/constants';

import { createAdmin, createCustomer, createRoles } from '../helper-functions';

import '../../../db-setup';

beforeAll(async () => {
  await createRoles();
});

describe('get admin otp', () => {
  const isAdmin = true;
  let adminId: number;

  beforeAll(async () => {
    const { admin } = await createAdmin(
      'Ja',
      'Doe',
      'notjadoe@gmail.com',
      'jaD0ePa$$',
      'active',
      [ROLES.SUPER_ADMIN.roleId],
    );

    adminId = admin.adminId;
  });

  beforeEach(async () => {
    await AdminOTP.destroy({ where: {} });
  });

  it('otp exists and password is valid', async () => {
    const otpType = 'phone';
    const password = '45623';

    await AdminOTP.create({
      adminId,
      type: otpType,
      password,
      expiresAt: AdminOTP.getExpiration(),
    });

    const result = await otpService.getOTP(adminId, password, {
      isAdmin,
      otpType,
    });

    expect(result.otp).not.toBeNull();
    expect(result.isValid).toBe(true);
  });

  it('otp exists and password is not valid', async () => {
    const otpType = 'phone';

    await AdminOTP.create({
      adminId,
      type: otpType,
      password: '90876',
      expiresAt: AdminOTP.getExpiration(),
    });

    const result = await otpService.getOTP(adminId, '12345', {
      isAdmin,
      otpType,
    });

    expect(result.otp).toBeNull();
    expect(result.isValid).toBe(false);
  });

  it('otp does not exist', async () => {
    const otpType = 'email';

    const otp = await AdminOTP.findOne({
      where: { adminId, type: otpType },
      raw: true,
    });
    expect(otp).toBeNull();

    const result = await otpService.getOTP(adminId, '12345', {
      isAdmin,
      otpType,
    });

    expect(result.otp).toBeNull();
    expect(result.isValid).toBe(false);
  });
});

describe('get customer otp', () => {
  const isAdmin = false;
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
    const otpType = 'phone';
    const password = '45623';

    await CustomerOTP.create({
      customerId,
      type: otpType,
      password,
      expiresAt: CustomerOTP.getExpiration(),
    });

    const result = await otpService.getOTP(customerId, password, {
      isAdmin,
      otpType,
    });

    expect(result.otp).not.toBeNull();
    expect(result.isValid).toBe(true);
  });

  it('otp exists and password is not valid', async () => {
    const otpType = 'phone';

    await CustomerOTP.create({
      customerId,
      type: otpType,
      password: '90876',
      expiresAt: CustomerOTP.getExpiration(),
    });

    const result = await otpService.getOTP(customerId, '12345', {
      isAdmin,
      otpType,
    });

    expect(result.otp).toBeNull();
    expect(result.isValid).toBe(false);
  });

  it('otp does not exist', async () => {
    const otpType = 'email';

    const otp = await CustomerOTP.findOne({
      where: { customerId, type: otpType },
      raw: true,
    });
    expect(otp).toBeNull();

    const result = await otpService.getOTP(customerId, '54321', {
      isAdmin,
      otpType,
    });

    expect(result.otp).toBeNull();
    expect(result.isValid).toBe(false);
  });
});

describe('create admin otp', () => {
  const isAdmin = true;
  let adminId: number;

  beforeAll(async () => {
    const { admin } = await createAdmin(
      'Jessica',
      'Doe',
      'jessica@gmail.com',
      'jaD0ePa$$',
      'active',
      [ROLES.SUPER_ADMIN.roleId],
    );

    adminId = admin.adminId;
  });

  beforeEach(async () => {
    await AdminOTP.destroy({ where: {} });
  });

  it('should create new otp', async () => {
    const otpType = 'phone';

    const password = await otpService.createOTP(adminId, { isAdmin, otpType });

    const otp = await AdminOTP.findOne({
      where: { adminId, type: otpType },
    });
    expect(otp).not.toBeNull();
    expect(otp?.comparePasswords(password)).toBe(true);
  });

  it('should delete previous otp and create a new one', async () => {
    const otpType = 'email';

    const { otpId: previousId } = await AdminOTP.create({
      adminId,
      type: otpType,
      password: '12670',
      expiresAt: AdminOTP.getExpiration(),
    });

    await otpService.createOTP(adminId, { isAdmin, otpType });

    const previousOTP = await AdminOTP.findByPk(previousId, { raw: true });
    expect(previousOTP).toBeNull();
  });
});

describe('create customer otp', () => {
  const isAdmin = false;
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
    const otpType = 'phone';

    const password = await otpService.createOTP(customerId, {
      isAdmin,
      otpType,
    });

    const otp = await CustomerOTP.findOne({
      where: { customerId, type: otpType },
    });
    expect(otp).not.toBeNull();
    expect(otp?.comparePasswords(password)).toBe(true);
  });

  it('should delete previous otp and create a new one', async () => {
    const otpType = 'email';

    const { otpId: previousId } = await CustomerOTP.create({
      customerId,
      type: otpType,
      password: '12670',
      expiresAt: CustomerOTP.getExpiration(),
    });

    await otpService.createOTP(customerId, { isAdmin, otpType });

    const previousOTP = await CustomerOTP.findByPk(previousId, { raw: true });
    expect(previousOTP).toBeNull();
  });
});
