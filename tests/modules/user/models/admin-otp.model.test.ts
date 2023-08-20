import { Admin, AdminOTP, Email } from '@user/models';
import { ROLES } from '@user/utils/constants';

import { createAdmin, createRoles } from '../helper-functions';

import 'tests/db-setup';

const raw = true;

beforeAll(async () => {
  await createRoles();
});

describe('AdminOTP Model', () => {
  let adminId: number;

  beforeAll(async () => {
    await Admin.destroy({ where: {} });
    await Email.destroy({ where: {} });

    const { admin } = await createAdmin(
      'Jacque',
      'Doe',
      'jaquedoe@gmail.com',
      'jacqueD0epa$$',
      'pending',
      [ROLES.CUSTOMER_SUPPORT.roleId],
    );
    adminId = admin.adminId;
  });

  describe('create OTP', () => {
    it('should create OTP', async () => {
      await AdminOTP.create({
        adminId,
        type: 'email',
        password: '12345',
        expiresAt: new Date(),
      });

      let retrievedOTP = await AdminOTP.findOne({
        where: { adminId, type: 'email' },
        raw,
      });

      expect(retrievedOTP).not.toBeNull();

      await AdminOTP.create({
        adminId,
        type: 'password',
        password: '12345',
        expiresAt: new Date(),
      });

      retrievedOTP = await AdminOTP.findOne({
        where: { adminId, type: 'password' },
        raw,
      });

      expect(retrievedOTP).not.toBeNull();
    });

    it('should fail on invalid adminId', async () => {
      expect(
        AdminOTP.create({
          adminId: 1000,
          type: 'password',
          password: '12345',
          expiresAt: new Date(),
        }),
      ).rejects.toThrow();
    });

    it('should fail to create duplicate OTP', async () => {
      expect(
        AdminOTP.create({
          adminId,
          type: 'email',
          password: '12345',
          expiresAt: new Date(),
        }),
      ).rejects.toThrow();

      expect(
        AdminOTP.create({
          adminId,
          type: 'email',
          password: '12345',
          expiresAt: new Date(),
        }),
      ).rejects.toThrow();
    });
  });

  it('should retrieve OTP', async () => {
    let otp = await AdminOTP.findOne({
      where: { adminId, type: 'email' },
      raw,
    });
    expect(otp).not.toBeNull();

    otp = await AdminOTP.findOne({ where: { adminId, type: 'password' }, raw });
    expect(otp).not.toBeNull();
  });

  it('should delete OTP', async () => {
    const numOTPs = (await AdminOTP.findAll({ where: { adminId }, raw }))
      .length;
    const numDeleted = await AdminOTP.destroy({ where: { adminId } });

    expect(numOTPs).toBe(numDeleted);

    const passwordOTP = await AdminOTP.create({
      adminId,
      type: 'password',
      password: '12345',
      expiresAt: new Date(),
    });

    await passwordOTP.destroy();

    const otp = await AdminOTP.findOne({
      where: { adminId, type: 'password' },
      raw,
    });
    expect(otp).toBeNull();
  });

  describe('hash password', () => {
    it('should hash the password on create', async () => {
      const password = '12345';

      const otp = await AdminOTP.create({
        adminId,
        type: 'email',
        password,
        expiresAt: new Date(),
      });

      expect(otp.password).not.toEqual(password);
      expect(otp.comparePasswords(password)).toBeTruthy();

      await otp.destroy();
    });

    it('should hash the password on update', async () => {
      const password = '12345';

      const otp = await AdminOTP.create({
        adminId,
        type: 'email',
        password,
        expiresAt: new Date(),
      });

      const newPassword = '67890';

      await otp.update({ password: newPassword });

      expect(otp.comparePasswords(password)).toBeFalsy();
      expect(otp.comparePasswords(newPassword)).toBeTruthy();
    });
  });

  it('should generate a 5-digit password', async () => {
    const code = AdminOTP.generatePassword();
    expect(code.length).toBe(5);
    expect(parseInt(code, 10)).toBeDefined();
  });

  it('should generate a date 30 minutes from now', () => {
    const expiration = AdminOTP.getExpiration();
    const now = new Date();
    const thirtyMinsFromNow = new Date(now.getTime() + 30 * 60000);

    expect(expiration).toBeInstanceOf(Date);
    expect(expiration.getTime()).toBeGreaterThan(now.getTime());
    expect(expiration.getTime()).toBeLessThanOrEqual(
      thirtyMinsFromNow.getTime(),
    );
  });
});

describe('AdminOTP and Admin Relationship', () => {
  it('deleting AdminOTP should not delete Admin', async () => {
    const { adminId } = await createAdmin(
      'Jasmine',
      'Doe',
      'jasminedoe@gmail.com',
      'jasmineD0epa$$',
      'active',
      [ROLES.CUSTOMER_SUPPORT.roleId],
    );

    await AdminOTP.create({
      adminId,
      type: 'password',
      password: '12345',
      expiresAt: new Date(),
    });

    await AdminOTP.destroy({ where: { adminId, type: 'password' } });

    const otp = await AdminOTP.findOne({
      where: { adminId, type: 'password' },
      raw,
    });
    expect(otp).toBeNull();

    const retrievedAdmin = await Admin.findByPk(adminId, { raw });
    expect(retrievedAdmin).not.toBeNull();
  });

  it('deleting Admin should delete AdminOTP', async () => {
    const { adminId } = await createAdmin(
      'Jessica',
      'Doe',
      'jessicadoe@gmail.com',
      'JessicaD0ePa$$',
      'active',
      [ROLES.CUSTOMER_SUPPORT.roleId],
    );

    await AdminOTP.create({
      adminId,
      type: 'password',
      password: '12345',
      expiresAt: AdminOTP.getExpiration(),
    });

    await Admin.destroy({ where: { adminId } });

    const retrievedAdmin = await Admin.findByPk(adminId, { raw });
    expect(retrievedAdmin).toBeNull();

    const otp = await AdminOTP.findOne({
      where: { adminId, type: 'password' },
      raw,
    });
    expect(otp).toBeNull();
  });
});
