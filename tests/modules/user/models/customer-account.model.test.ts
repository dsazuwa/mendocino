import {
  Customer,
  CustomerAccount,
  CustomerAccountStatusType,
  Email,
} from '@user/models';

import 'tests/db-setup';

const raw = true;

describe('CustomerAccount Model', () => {
  describe('create', () => {
    it('should create customer account with provided values', async () => {
      const { customerId } = await Customer.create({
        firstName: 'John',
        lastName: 'Doe',
      });

      const { emailId } = await Email.create({ email: 'johndoe@gmail.com' });

      const data = {
        customerId,
        emailId,
        password: 'johnD0ePa$$',
        status: 'active' as CustomerAccountStatusType,
      };

      const account = await CustomerAccount.create(data);
      expect(account.customerId).toBe(customerId);
      expect(account.emailId).toBe(emailId);
      expect(account.status).toBe(data.status);
    });

    it('should fail on duplicate customerId', async () => {
      const { customerId } = await Customer.create({
        firstName: 'Jae',
        lastName: 'Doe',
      });

      await Customer.create({
        firstName: 'Julius',
        lastName: 'Doe',
      });

      const { emailId: id1 } = await Email.create({
        email: 'juliusdoe@gmail.com',
      });
      const { emailId: id2 } = await Email.create({
        email: 'jaedoe@gmail.com',
      });

      await CustomerAccount.create({
        customerId,
        emailId: id1,
        password: 'jaeD0ePa$$',
        status: 'active',
      });

      expect(
        CustomerAccount.create({
          customerId,
          emailId: id2,
          password: 'juliusD0ePa$$',
          status: 'active',
        }),
      ).rejects.toThrow();
    });

    it('should fail on duplicate emailId', async () => {
      const customer1 = await Customer.create({
        firstName: 'Jake',
        lastName: 'Doe',
      });

      const customer2 = await Customer.create({
        firstName: 'Jac',
        lastName: 'Doe',
      });

      const { emailId } = await Email.create({ email: 'jakedoe@gmail.com' });

      await CustomerAccount.create({
        customerId: customer1.customerId,
        emailId,
        password: 'jakeD0ePa$$',
        status: 'active',
      });

      expect(
        CustomerAccount.create({
          customerId: customer2.customerId,
          emailId,
          password: 'jacD0ePa$$',
          status: 'active',
        }),
      ).rejects.toThrow();
    });

    it('should fail on invalid customerId', async () => {
      const { emailId } = await Email.create({ email: 'janicedoe@gmail.com' });

      const data = {
        customerId: 1000,
        emailId,
        password: 'jayD0ePa$$',
        status: 'active' as CustomerAccountStatusType,
      };

      expect(CustomerAccount.create(data)).rejects.toThrow();
    });

    it('should fail on invalid emailId', async () => {
      const { customerId } = await Customer.create({
        firstName: 'Jay',
        lastName: 'Doe',
      });

      const data = {
        customerId,
        emailId: 12324535,
        password: 'jayD0ePa$$',
        status: 'active' as CustomerAccountStatusType,
      };

      expect(CustomerAccount.create(data)).rejects.toThrow();
    });
  });

  it('should retrieve Customer account', async () => {
    const { customerId } = await Customer.create({
      firstName: 'Jane',
      lastName: 'Doe',
    });

    const { emailId } = await Email.create({ email: 'janedoe@gmail.com' });

    await CustomerAccount.create({
      customerId,
      emailId,
      password: 'janeD0ePa$$',
      status: 'active' as CustomerAccountStatusType,
    });

    let retrievedAccount = await CustomerAccount.findByPk(customerId, { raw });
    expect(retrievedAccount).not.toBeNull();

    retrievedAccount = await CustomerAccount.findOne({
      where: { emailId },
      raw,
    });
    expect(retrievedAccount).not.toBeNull();
  });

  it('should update Customer account', async () => {
    const { customerId } = await Customer.create({
      firstName: 'Joy',
      lastName: 'Doe',
    });

    const { emailId } = await Email.create({ email: 'joydoe@gmail.com' });

    await CustomerAccount.create({
      customerId,
      emailId,
      password: 'joyD0ePa$$',
      status: 'active' as CustomerAccountStatusType,
    });

    const password = 'joyousDoe@gmail.com';

    await CustomerAccount.update(
      { password },
      { where: { customerId }, individualHooks: true },
    );

    const updatedAccount = await CustomerAccount.findByPk(customerId);
    expect(updatedAccount?.comparePasswords(password)).toBe(true);
  });

  it('should delete Customer account', async () => {
    const { customerId } = await Customer.create({
      firstName: 'Joel',
      lastName: 'Doe',
    });

    const { emailId } = await Email.create({ email: 'joeldoe@gmail.com' });

    await CustomerAccount.create({
      customerId,
      emailId,
      password: 'joelD0ePa$$',
      status: 'active' as CustomerAccountStatusType,
    });

    await CustomerAccount.destroy({ where: { customerId } });

    const deletedAccount = await CustomerAccount.findByPk(customerId, { raw });
    expect(deletedAccount).toBeNull();
  });

  describe('hash password', () => {
    it('should hash the password on create', async () => {
      const { customerId } = await Customer.create({
        firstName: 'Jen',
        lastName: 'Doe',
      });

      const { emailId } = await Email.create({ email: 'jendoe@gmail.com' });

      const data = {
        customerId,
        emailId,
        password: 'janeD0ePa$$',
        status: 'active' as CustomerAccountStatusType,
      };

      const account = await CustomerAccount.create(data);
      expect(account.password).not.toEqual(data.password);
      expect(account.comparePasswords(data.password)).toBeTruthy();
    });

    it('should hash the password on update', async () => {
      const { customerId } = await Customer.create({
        firstName: 'Jules',
        lastName: 'Doe',
      });

      const { emailId } = await Email.create({ email: 'julesdoe@gmail.com' });

      const data = {
        customerId,
        emailId,
        password: 'julesD0ePa$$',
        status: 'active' as CustomerAccountStatusType,
      };
      const newPassword = 'newJulesPa$$';

      const account = await CustomerAccount.create(data);
      await account.update({ password: newPassword });

      expect(account.comparePasswords(data.password)).toBeFalsy();
      expect(account.comparePasswords(newPassword)).toBeTruthy();

      const a = await CustomerAccount.findByPk(customerId, { raw });
      expect(a?.password).not.toBe(newPassword);
    });
  });

  describe('compare password', () => {
    let a: CustomerAccount;

    const password = 'jeromeD0e@gmail.com';

    beforeAll(async () => {
      const { customerId } = await Customer.create({
        firstName: 'Jerome',
        lastName: 'Doe',
      });

      const { emailId } = await Email.create({ email: 'jeromedoe@gmail.com' });

      a = await CustomerAccount.create({
        customerId,
        emailId,
        password,
        status: 'active' as CustomerAccountStatusType,
      });
    });

    it('should return true for equal passwords', () => {
      expect(a.comparePasswords(password)).toBe(true);
    });

    it('should return false for non equal passwords', () => {
      expect(a.comparePasswords('falsePassword')).toBe(false);
    });
  });
});

describe('CustomerAccount and Customer Relationship', () => {
  it('deleting CustomerAccount should not delete Customer', async () => {
    const { customerId } = await Customer.create({
      firstName: 'Jun',
      lastName: 'Doe',
    });

    const { emailId } = await Email.create({ email: 'jundoe@gmail.com' });

    await CustomerAccount.create({
      customerId,
      emailId,
      password: 'JuneD0ePa$$',
      status: 'active' as CustomerAccountStatusType,
    });

    await CustomerAccount.destroy({ where: { customerId } });

    const retrievedCustomer = await Customer.findByPk(customerId, { raw });
    expect(retrievedCustomer).not.toBeNull();

    const retrievedAccount = await CustomerAccount.findByPk(customerId, {
      raw,
    });
    expect(retrievedAccount).toBeNull();
  });

  it('deleting Customer should delete CustomerAccount', async () => {
    const { customerId } = await Customer.create({
      firstName: 'Jenni',
      lastName: 'Doe',
    });

    const { emailId } = await Email.create({ email: 'jennidoe@gmail.com' });

    await CustomerAccount.create({
      customerId,
      emailId,
      password: 'JenD0ePa$$',
      status: 'active' as CustomerAccountStatusType,
    });

    await Customer.destroy({ where: { customerId } });

    const retrievedCustomer = await Customer.findByPk(customerId, { raw });
    expect(retrievedCustomer).toBeNull();

    const retrievedAccount = await CustomerAccount.findByPk(customerId, {
      raw,
    });
    expect(retrievedAccount).toBeNull();
  });
});
