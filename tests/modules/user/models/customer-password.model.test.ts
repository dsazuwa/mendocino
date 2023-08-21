import {
  Customer,
  CustomerAccount,
  CustomerPassword,
  Email,
} from '@user/models';

import 'tests/db-setup';

const raw = true;

describe('CustomerPassword Model', () => {
  describe('create', () => {
    it('should create customer password password with provided values', async () => {
      const { customerId } = await Customer.create({
        firstName: 'John',
        lastName: 'Doe',
      });

      const { emailId } = await Email.create({ email: 'johndoe@gmail.com' });

      await CustomerAccount.create({
        customerId,
        emailId,
        status: 'active',
      });

      const password = 'johnD0ePa$$';

      const customerPassword = await CustomerPassword.create({
        customerId,
        password,
      });
      expect(customerPassword.customerId).toBe(customerId);
      expect(customerPassword.comparePasswords(password)).toBe(true);
    });

    it('should fail on duplicate customerId', async () => {
      const { customerId } = await Customer.create({
        firstName: 'Jae',
        lastName: 'Doe',
      });

      const { emailId } = await Email.create({ email: 'jaedoe@gmail.com' });

      await CustomerAccount.create({
        customerId,
        emailId,
        status: 'active',
      });

      const data = { customerId, password: 'juliusD0ePa$$' };
      await CustomerPassword.create(data);
      expect(CustomerPassword.create(data)).rejects.toThrow();
    });

    it('should fail on invalid customerId', async () => {
      const { customerId } = await Customer.create({
        firstName: 'Janice',
        lastName: 'Doe',
      });

      const { emailId } = await Email.create({ email: 'janicedoe@gmail.com' });

      await CustomerAccount.create({
        customerId,
        emailId,
        status: 'active',
      });

      expect(
        CustomerPassword.create({
          customerId: 1000,
          password: 'janiceD0ePa$$',
        }),
      ).rejects.toThrow();
    });
  });

  it('should retrieve customer password', async () => {
    const { customerId } = await Customer.create({
      firstName: 'Jane',
      lastName: 'Doe',
    });

    const { emailId } = await Email.create({ email: 'janedoe@gmail.com' });

    await CustomerAccount.create({
      customerId,
      emailId,
      status: 'active',
    });

    await CustomerPassword.create({
      customerId,
      password: 'janeD0ePa$$',
    });

    let retrievedPassword = await CustomerPassword.findByPk(customerId, {
      raw,
    });
    expect(retrievedPassword).not.toBeNull();

    retrievedPassword = await CustomerPassword.findOne({
      where: { customerId },
      raw,
    });
    expect(retrievedPassword).not.toBeNull();
  });

  it('should update customer password', async () => {
    const { customerId } = await Customer.create({
      firstName: 'Joy',
      lastName: 'Doe',
    });

    const { emailId } = await Email.create({ email: 'joydoe@gmail.com' });

    await CustomerAccount.create({
      customerId,
      emailId,
      status: 'active',
    });

    await CustomerPassword.create({ customerId, password: 'joyD0ePa$$' });

    const newPassword = 'newJoyD0ePa$$';

    await CustomerPassword.update(
      { password: newPassword },
      { where: { customerId }, individualHooks: true },
    );

    const updatedPassword = await CustomerPassword.findByPk(customerId);
    expect(updatedPassword?.comparePasswords(newPassword)).toBe(true);
  });

  it('should delete customer pasword', async () => {
    const { customerId } = await Customer.create({
      firstName: 'Joel',
      lastName: 'Doe',
    });

    const { emailId } = await Email.create({ email: 'joeldoe@gmail.com' });

    await CustomerAccount.create({
      customerId,
      emailId,
      status: 'active',
    });

    await CustomerPassword.create({ customerId, password: 'joelD0ePa$$' });

    await CustomerPassword.destroy({ where: { customerId } });

    const deletedPassword = await CustomerPassword.findByPk(customerId, {
      raw,
    });
    expect(deletedPassword).toBeNull();
  });

  describe('hash password', () => {
    it('should hash the password on create', async () => {
      const { customerId } = await Customer.create({
        firstName: 'Jen',
        lastName: 'Doe',
      });

      const { emailId } = await Email.create({ email: 'jendoe@gmail.com' });

      await CustomerAccount.create({
        customerId,
        emailId,
        status: 'active',
      });

      const password = 'janeD0ePa$$';

      const customerPassword = await CustomerPassword.create({
        customerId,
        password,
      });
      expect(customerPassword.password).not.toEqual(password);
      expect(customerPassword.comparePasswords(password)).toBeTruthy();
    });

    it('should hash the password on update', async () => {
      const { customerId } = await Customer.create({
        firstName: 'Jules',
        lastName: 'Doe',
      });

      const { emailId } = await Email.create({ email: 'julesdoe@gmail.com' });

      await CustomerAccount.create({
        customerId,
        emailId,
        status: 'active',
      });

      const oldPassword = 'julesD0ePa$$';
      const newPassword = 'newJulesPa$$';

      const customerPassword = await CustomerPassword.create({
        customerId,
        password: oldPassword,
      });

      await customerPassword.update({ password: newPassword });

      expect(customerPassword.comparePasswords(oldPassword)).toBeFalsy();
      expect(customerPassword.comparePasswords(newPassword)).toBeTruthy();

      const retrievedCustomerPassword = await CustomerPassword.findByPk(
        customerId,
        { raw },
      );
      expect(retrievedCustomerPassword?.password).not.toBe(newPassword);
    });
  });

  describe('compare password', () => {
    let customerPassword: CustomerPassword;

    const password = 'jeromeD0e@gmail.com';

    beforeAll(async () => {
      const { customerId } = await Customer.create({
        firstName: 'Jerome',
        lastName: 'Doe',
      });

      const { emailId } = await Email.create({ email: 'jeromedoe@gmail.com' });

      await CustomerAccount.create({
        customerId,
        emailId,
        status: 'active',
      });

      customerPassword = await CustomerPassword.create({
        customerId,
        password,
      });
    });

    it('should return true for equal passwords', () => {
      expect(customerPassword.comparePasswords(password)).toBe(true);
    });

    it('should return false for non equal passwords', () => {
      expect(customerPassword.comparePasswords('falsePassword')).toBe(false);
    });
  });
});

describe('CustomerAccount and CustomerPassword Relationship', () => {
  it('deleting CustomerPassword should not delete CustomerAccount', async () => {
    const { customerId } = await Customer.create({
      firstName: 'Jun',
      lastName: 'Doe',
    });

    const { emailId } = await Email.create({ email: 'jundoe@gmail.com' });

    await CustomerAccount.create({
      customerId,
      emailId,
      status: 'active',
    });

    await CustomerPassword.create({
      customerId,
      password: 'JuneD0ePa$$',
    });

    await CustomerPassword.destroy({ where: { customerId } });

    const retrievedPassword = await CustomerPassword.findByPk(customerId, {
      raw,
    });
    expect(retrievedPassword).toBeNull();

    const retrievedAccount = await CustomerAccount.findByPk(customerId, {
      raw,
    });
    expect(retrievedAccount).not.toBeNull();
  });

  it('deleting CustomerAccount should delete CustomerPassword', async () => {
    const { customerId } = await Customer.create({
      firstName: 'Jenni',
      lastName: 'Doe',
    });

    const { emailId } = await Email.create({ email: 'jennidoe@gmail.com' });

    await CustomerAccount.create({
      customerId,
      emailId,
      status: 'active',
    });

    await CustomerPassword.create({ customerId, password: 'JenD0ePa$$' });

    await CustomerAccount.destroy({ where: { customerId } });

    const retrievedAccount = await CustomerAccount.findByPk(customerId, {
      raw,
    });
    expect(retrievedAccount).toBeNull();

    const retrievedPassword = await CustomerPassword.findByPk(customerId, {
      raw,
    });
    expect(retrievedPassword).toBeNull();
  });
});
