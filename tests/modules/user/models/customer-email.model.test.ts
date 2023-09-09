import { Customer, CustomerEmail, Email } from '@user/models';

import 'tests/db-setup';

const raw = true;

describe('CustomerEmail Model', () => {
  describe('create', () => {
    it('should create customer account with provided values', async () => {
      const { customerId } = await Customer.create({
        firstName: 'John',
        lastName: 'Doe',
        status: 'active',
      });

      const { emailId } = await Email.create({ email: 'johndoe@gmail.com' });

      const data = { customerId, emailId };

      const account = await CustomerEmail.create(data);
      expect(account.customerId).toBe(customerId);
      expect(account.emailId).toBe(emailId);
    });

    it('should fail on duplicate customerId', async () => {
      const { customerId } = await Customer.create({
        firstName: 'Jae',
        lastName: 'Doe',
        status: 'active',
      });

      await Customer.create({
        firstName: 'Julius',
        lastName: 'Doe',
        status: 'active',
      });

      const { emailId: id1 } = await Email.create({
        email: 'juliusdoe@gmail.com',
      });
      const { emailId: id2 } = await Email.create({
        email: 'jaedoe@gmail.com',
      });

      await CustomerEmail.create({ customerId, emailId: id1 });

      expect(
        CustomerEmail.create({
          customerId,
          emailId: id2,
        }),
      ).rejects.toThrow();
    });

    it('should fail on duplicate emailId', async () => {
      const customer1 = await Customer.create({
        firstName: 'Jake',
        lastName: 'Doe',
        status: 'active',
      });

      const customer2 = await Customer.create({
        firstName: 'Jac',
        lastName: 'Doe',
        status: 'active',
      });

      const { emailId } = await Email.create({ email: 'jakedoe@gmail.com' });

      await CustomerEmail.create({
        customerId: customer1.customerId,
        emailId,
      });

      expect(
        CustomerEmail.create({
          customerId: customer2.customerId,
          emailId,
        }),
      ).rejects.toThrow();
    });

    it('should fail on invalid customerId', async () => {
      const { emailId } = await Email.create({ email: 'janicedoe@gmail.com' });

      const data = { customerId: 1000, emailId };

      expect(CustomerEmail.create(data)).rejects.toThrow();
    });

    it('should fail on invalid emailId', async () => {
      const { customerId } = await Customer.create({
        firstName: 'Jay',
        lastName: 'Doe',
        status: 'active',
      });

      const data = { customerId, emailId: 12324535 };

      expect(CustomerEmail.create(data)).rejects.toThrow();
    });
  });

  it('should retrieve Customer account', async () => {
    const { customerId } = await Customer.create({
      firstName: 'Jane',
      lastName: 'Doe',
      status: 'active',
    });

    const { emailId } = await Email.create({ email: 'janedoe@gmail.com' });

    await CustomerEmail.create({ customerId, emailId });

    let retrievedAccount = await CustomerEmail.findByPk(customerId, { raw });
    expect(retrievedAccount).not.toBeNull();

    retrievedAccount = await CustomerEmail.findOne({
      where: { emailId },
      raw,
    });
    expect(retrievedAccount).not.toBeNull();
  });

  it('should update Customer account', async () => {
    const { customerId } = await Customer.create({
      firstName: 'Joy',
      lastName: 'Doe',
      status: 'active',
    });

    const { emailId } = await Email.create({ email: 'joydoe@gmail.com' });

    const { emailId: newEmailId } = await Email.create({
      email: 'notjoydoe@gmail.com',
    });

    await CustomerEmail.create({ customerId, emailId });

    await CustomerEmail.update(
      { emailId: newEmailId },
      { where: { customerId }, individualHooks: true },
    );

    const updatedAccount = await CustomerEmail.findOne({
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
      status: 'active',
    });

    const { emailId } = await Email.create({ email: 'joeldoe@gmail.com' });

    await CustomerEmail.create({ customerId, emailId });

    await CustomerEmail.destroy({ where: { customerId } });

    const deletedAccount = await CustomerEmail.findByPk(customerId, { raw });
    expect(deletedAccount).toBeNull();
  });
});

describe('CustomerEmail and Customer Relationship', () => {
  it('deleting CustomerEmail should not delete Customer', async () => {
    const { customerId } = await Customer.create({
      firstName: 'Jun',
      lastName: 'Doe',
      status: 'active',
    });

    const { emailId } = await Email.create({ email: 'jundoe@gmail.com' });

    await CustomerEmail.create({ customerId, emailId });

    await CustomerEmail.destroy({ where: { customerId } });

    const retrievedCustomer = await Customer.findByPk(customerId, { raw });
    expect(retrievedCustomer).not.toBeNull();

    const retrievedAccount = await CustomerEmail.findByPk(customerId, {
      raw,
    });
    expect(retrievedAccount).toBeNull();
  });

  it('deleting Customer should delete CustomerEmail', async () => {
    const { customerId } = await Customer.create({
      firstName: 'Jenni',
      lastName: 'Doe',
      status: 'active',
    });

    const { emailId } = await Email.create({ email: 'jennidoe@gmail.com' });

    await CustomerEmail.create({ customerId, emailId });

    await Customer.destroy({ where: { customerId } });

    const retrievedCustomer = await Customer.findByPk(customerId, { raw });
    expect(retrievedCustomer).toBeNull();

    const retrievedAccount = await CustomerEmail.findByPk(customerId, {
      raw,
    });
    expect(retrievedAccount).toBeNull();
  });
});
