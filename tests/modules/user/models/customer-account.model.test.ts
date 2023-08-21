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
        status: 'active',
      });

      expect(
        CustomerAccount.create({
          customerId,
          emailId: id2,
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
        status: 'active',
      });

      expect(
        CustomerAccount.create({
          customerId: customer2.customerId,
          emailId,
          status: 'active',
        }),
      ).rejects.toThrow();
    });

    it('should fail on invalid customerId', async () => {
      const { emailId } = await Email.create({ email: 'janicedoe@gmail.com' });

      const data = {
        customerId: 1000,
        emailId,
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
      status: 'active',
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

    const { emailId: newEmailId } = await Email.create({
      email: 'notjoydoe@gmail.com',
    });

    await CustomerAccount.create({
      customerId,
      emailId,
      status: 'active',
    });

    await CustomerAccount.update(
      { emailId: newEmailId },
      { where: { customerId }, individualHooks: true },
    );

    const updatedAccount = await CustomerAccount.findOne({
      where: {
        customerId,
        emailId: newEmailId,
      },
    });
    expect(updatedAccount).not.toBeNull();
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
      status: 'active',
    });

    await CustomerAccount.destroy({ where: { customerId } });

    const deletedAccount = await CustomerAccount.findByPk(customerId, { raw });
    expect(deletedAccount).toBeNull();
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
      status: 'active',
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
      status: 'active',
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
