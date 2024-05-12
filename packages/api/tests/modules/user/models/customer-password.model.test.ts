import {
  Customer,
  CustomerEmail,
  CustomerPassword,
  Email,
} from '@app/modules/user/models';

import 'tests/db-setup';

const raw = true;

describe('CustomerPassword Model', () => {
  describe('create', () => {
    it('should create customer password password with provided values', async () => {
      const { customerId } = await Customer.create({
        firstName: 'John',
        lastName: 'Doe',
        status: 'active',
      });

      const { emailId } = await Email.create({ email: 'johndoe@gmail.com' });

      await CustomerEmail.create({ customerId, emailId });

      const password = 'johnD0ePa$$';

      const customerPassword = await CustomerPassword.create({
        customerId,
        password,
      });
      expect(customerPassword.customerId).toBe(customerId);
      expect(
        CustomerPassword.comparePasswords(password, customerPassword.password),
      ).toBe(true);
    });

    it('should fail on duplicate customerId', async () => {
      const { customerId } = await Customer.create({
        firstName: 'Jae',
        lastName: 'Doe',
        status: 'active',
      });

      const { emailId } = await Email.create({ email: 'jaedoe@gmail.com' });

      await CustomerEmail.create({ customerId, emailId });

      const data = { customerId, password: 'juliusD0ePa$$' };
      await CustomerPassword.create(data);
      expect(CustomerPassword.create(data)).rejects.toThrow();
    });

    it('should fail on invalid customerId', async () => {
      const { customerId } = await Customer.create({
        firstName: 'Janice',
        lastName: 'Doe',
        status: 'active',
      });

      const { emailId } = await Email.create({ email: 'janicedoe@gmail.com' });

      await CustomerEmail.create({ customerId, emailId });

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
      status: 'active',
    });

    const { emailId } = await Email.create({ email: 'janedoe@gmail.com' });

    await CustomerEmail.create({ customerId, emailId });

    await CustomerPassword.create({ customerId, password: 'janeD0ePa$$' });

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
      status: 'active',
    });

    const { emailId } = await Email.create({ email: 'joydoe@gmail.com' });

    await CustomerEmail.create({ customerId, emailId });

    await CustomerPassword.create({ customerId, password: 'joyD0ePa$$' });

    const newPassword = 'newJoyD0ePa$$';

    await CustomerPassword.update(
      { password: newPassword },
      { where: { customerId }, individualHooks: true },
    );

    const updatedPassword = await CustomerPassword.findByPk(customerId);
    expect(
      CustomerPassword.comparePasswords(
        newPassword,
        updatedPassword?.password || '',
      ),
    ).toBe(true);
  });

  it('should delete customer pasword', async () => {
    const { customerId } = await Customer.create({
      firstName: 'Joel',
      lastName: 'Doe',
      status: 'active',
    });

    const { emailId } = await Email.create({ email: 'joeldoe@gmail.com' });

    await CustomerEmail.create({ customerId, emailId });

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
        status: 'active',
      });

      const { emailId } = await Email.create({ email: 'jendoe@gmail.com' });

      await CustomerEmail.create({ customerId, emailId });

      const password = 'janeD0ePa$$';

      const customerPassword = await CustomerPassword.create({
        customerId,
        password,
      });
      expect(customerPassword.password).not.toEqual(password);
      expect(
        CustomerPassword.comparePasswords(password, customerPassword.password),
      ).toBeTruthy();
    });

    it('should hash the password on update', async () => {
      const { customerId } = await Customer.create({
        firstName: 'Jules',
        lastName: 'Doe',
        status: 'active',
      });

      const { emailId } = await Email.create({ email: 'julesdoe@gmail.com' });

      await CustomerEmail.create({ customerId, emailId });

      const oldPassword = 'julesD0ePa$$';
      const newPassword = 'newJulesPa$$';

      await CustomerPassword.create({
        customerId,
        password: oldPassword,
      });

      await CustomerPassword.update(
        { password: newPassword },
        { where: { customerId }, individualHooks: true },
      );

      const { password } = (await CustomerPassword.findByPk(customerId, {
        raw: true,
      })) as CustomerPassword;

      expect(
        CustomerPassword.comparePasswords(oldPassword, password),
      ).toBeFalsy();
      expect(
        CustomerPassword.comparePasswords(newPassword, password),
      ).toBeTruthy();

      const retrievedCustomerPassword = await CustomerPassword.findByPk(
        customerId,
        { raw },
      );
      expect(retrievedCustomerPassword?.password).not.toBe(newPassword);
    });
  });

  describe('compare password', () => {
    let hashed: string;

    const password = 'jeromeD0e@gmail.com';

    beforeAll(async () => {
      const { customerId } = await Customer.create({
        firstName: 'Jerome',
        lastName: 'Doe',
        status: 'active',
      });

      const { emailId } = await Email.create({ email: 'jeromedoe@gmail.com' });

      await CustomerEmail.create({ customerId, emailId });

      const cp = await CustomerPassword.create({
        customerId,
        password,
      });
      hashed = cp.password;
    });

    it('should return true for equal passwords', () => {
      expect(CustomerPassword.comparePasswords(password, hashed)).toBe(true);
    });

    it('should return false for non equal passwords', () => {
      expect(CustomerPassword.comparePasswords('falsePassword', hashed)).toBe(
        false,
      );
    });
  });
});

describe('CustomerEmail and CustomerPassword Relationship', () => {
  it('deleting CustomerPassword should not delete Customer', async () => {
    const { customerId } = await Customer.create({
      firstName: 'Jun',
      lastName: 'Doe',
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

    const retrievedCustomer = await Customer.findByPk(customerId, { raw });
    expect(retrievedCustomer).not.toBeNull();
  });

  it('deleting Customer should delete CustomerPassword', async () => {
    const { customerId } = await Customer.create({
      firstName: 'Jenni',
      lastName: 'Doe',
      status: 'active',
    });

    await CustomerPassword.create({ customerId, password: 'JenD0ePa$$' });

    await Customer.destroy({ where: { customerId } });

    const retrievedCustomer = await Customer.findByPk(customerId, { raw });
    expect(retrievedCustomer).toBeNull();

    const retrievedPassword = await CustomerPassword.findByPk(customerId, {
      raw,
    });
    expect(retrievedPassword).toBeNull();
  });
});
