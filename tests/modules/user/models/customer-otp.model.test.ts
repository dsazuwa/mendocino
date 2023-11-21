import { Customer, CustomerOTP } from '@app/modules/user/models';

import { createCustomer } from '../helper-functions';

import 'tests/db-setup';

const raw = true;

describe('CustomerOTP Model', () => {
  let customerId: number;

  beforeAll(async () => {
    const { customer } = await createCustomer(
      'Jacque',
      'Doe',
      'jaquedoe@gmail.com',
      'jacqueD0epa$$',
      'pending',
    );
    customerId = customer.customerId;
  });

  describe('create OTP', () => {
    it('should create OTP', async () => {
      await CustomerOTP.create({
        customerId,
        type: 'email',
        password: '12345',
        expiresAt: new Date(),
      });

      let retrievedOTP = await CustomerOTP.findOne({
        where: { customerId, type: 'email' },
        raw,
      });

      expect(retrievedOTP).not.toBeNull();

      await CustomerOTP.create({
        customerId,
        type: 'password',
        password: '12345',
        expiresAt: new Date(),
      });

      retrievedOTP = await CustomerOTP.findOne({
        where: { customerId, type: 'password' },
        raw,
      });

      expect(retrievedOTP).not.toBeNull();
    });

    it('should fail on invalid customerId', async () => {
      expect(
        CustomerOTP.create({
          customerId: 1000,
          type: 'password',
          password: '12345',
          expiresAt: new Date(),
        }),
      ).rejects.toThrow();
    });

    it('should fail to create duplicate OTP', async () => {
      expect(
        CustomerOTP.create({
          customerId,
          type: 'email',
          password: '12345',
          expiresAt: new Date(),
        }),
      ).rejects.toThrow();

      expect(
        CustomerOTP.create({
          customerId,
          type: 'email',
          password: '12345',
          expiresAt: new Date(),
        }),
      ).rejects.toThrow();
    });
  });

  it('should retrieve OTP', async () => {
    let otp = await CustomerOTP.findOne({
      where: { customerId, type: 'email' },
      raw,
    });
    expect(otp).not.toBeNull();

    otp = await CustomerOTP.findOne({
      where: { customerId, type: 'password' },
      raw,
    });
    expect(otp).not.toBeNull();
  });

  it('should delete OTP', async () => {
    const numOTPs = (await CustomerOTP.findAll({ where: { customerId }, raw }))
      .length;
    const numDeleted = await CustomerOTP.destroy({ where: { customerId } });

    expect(numOTPs).toBe(numDeleted);

    const passwordOTP = await CustomerOTP.create({
      customerId,
      type: 'password',
      password: '12345',
      expiresAt: new Date(),
    });

    await passwordOTP.destroy();

    const otp = await CustomerOTP.findOne({
      where: { customerId, type: 'password' },
      raw,
    });
    expect(otp).toBeNull();
  });

  describe('hash password', () => {
    it('should hash the password on create', async () => {
      const password = '12345';

      const otp = await CustomerOTP.create({
        customerId,
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

      const otp = await CustomerOTP.create({
        customerId,
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

  describe('compare password', () => {
    const password = '07492';
    let otp: CustomerOTP;

    beforeAll(async () => {
      otp = await CustomerOTP.create({
        customerId,
        type: 'phone',
        password,
        expiresAt: CustomerOTP.getExpiration(),
      });
    });

    it('should return true for equal passwords', () => {
      expect(otp.comparePasswords(password)).toBe(true);
    });

    it('should return false for non equal passwords', () => {
      expect(otp.comparePasswords('00000')).toBe(false);
    });
  });

  it('should generate a 5-digit password', async () => {
    const code = CustomerOTP.generatePassword();
    expect(code.length).toBe(5);
    expect(parseInt(code, 10)).toBeDefined();
  });

  it('should generate a date 30 minutes from now', () => {
    const expiration = CustomerOTP.getExpiration();
    const now = new Date();
    const thirtyMinsFromNow = new Date(now.getTime() + 30 * 60000);

    expect(expiration).toBeInstanceOf(Date);
    expect(expiration.getTime()).toBeGreaterThan(now.getTime());
    expect(expiration.getTime()).toBeLessThanOrEqual(
      thirtyMinsFromNow.getTime(),
    );
  });
});

describe('CustomerOTP and Customer Relationship', () => {
  it('deleting OTP should not delete Customer', async () => {
    const { customerId } = await createCustomer(
      'Jasmine',
      'Doe',
      'jasminedoe@gmail.com',
      'jasmineD0epa$$',
      'active',
    );

    await CustomerOTP.create({
      customerId,
      type: 'password',
      password: '12345',
      expiresAt: new Date(),
    });

    await CustomerOTP.destroy({ where: { customerId, type: 'password' } });

    const otp = await CustomerOTP.findOne({
      where: { customerId, type: 'password' },
      raw,
    });
    expect(otp).toBeNull();

    const retrievedCustomer = await Customer.findByPk(customerId, {
      raw,
    });
    expect(retrievedCustomer).not.toBeNull();
  });

  it('deleting Customer should delete OTP', async () => {
    const { customerId } = await createCustomer(
      'Jessica',
      'Doe',
      'jessicadoe@gmail.com',
      'JessicaD0ePa$$',
      'active',
    );

    await CustomerOTP.create({
      customerId,
      type: 'password',
      password: '12345',
      expiresAt: CustomerOTP.getExpiration(),
    });

    await Customer.destroy({ where: { customerId } });

    const retrievedCustomer = await Customer.findByPk(customerId, {
      raw,
    });
    expect(retrievedCustomer).toBeNull();

    const otp = await CustomerOTP.findOne({
      where: { customerId, type: 'password' },
      raw,
    });
    expect(otp).toBeNull();
  });
});
