import {
  Email,
  Admin,
  AdminAccount,
  Customer,
  CustomerEmail,
} from 'modules/user/models';

import '../../../db-setup';

describe('Email Model', () => {
  beforeEach(async () => {
    await Email.destroy({ where: {} });
  });

  it('should create email', async () => {
    const data = { emailId: 1, email: 'joedoe@gmail.com' };

    const email = await Email.create(data);
    expect(email).toMatchObject(data);
  });

  it('should fail to create on invalid email', async () => {
    expect(Email.create({ email: 'joedoe' })).rejects.toThrow();
  });

  it('should fail to create duplicate email', async () => {
    const data = { email: 'joedoe@gmail.com' };

    await Email.create(data);
    expect(Email.create(data)).rejects.toThrow();
  });

  it('should retrieve email', async () => {
    const { emailId, email } = await Email.create({
      email: 'joedoe@gmail.com',
    });

    let retrievedEmail = await Email.findByPk(emailId, { raw: true });
    expect(retrievedEmail).not.toBeNull();

    retrievedEmail = await Email.findOne({ where: { email }, raw: true });
    expect(retrievedEmail).not.toBeNull();
  });

  it('should fail to update email', async () => {
    const oldEmail = 'jondoe@gmail.com';
    const newEmail = 'johndoe@gmail.com';

    await Email.create({ email: oldEmail });

    try {
      await Email.update({ email: newEmail }, { where: { email: oldEmail } });

      expect(true).toBe(false);
    } catch (e) {
      const retrievedEmail = await Email.findOne({
        where: { email: newEmail },
        raw: true,
      });
      expect(retrievedEmail).toBeNull();
    }
  });

  it('should delete email', async () => {
    const data = { email: 'janedoe@gmail.com' };

    let email = await Email.create(data);

    await email.destroy();

    let retrievedEmail = await Email.findByPk(email.emailId, { raw: true });
    expect(retrievedEmail).toBeNull();

    email = await Email.create(data);

    await Email.destroy({ where: { emailId: email.emailId } });

    retrievedEmail = await Email.findByPk(email.emailId, { raw: true });
    expect(retrievedEmail).toBeNull();
  });
});

describe('Email and CustomerEmail Assciation', () => {
  const email = 'johndoe@gmail.com';

  beforeEach(async () => {
    await Email.destroy({ where: {} });
    await CustomerEmail.destroy({ where: {} });
    await Customer.destroy({ where: {} });
  });

  it('should delete CustomerEmail on Email delete', async () => {
    const { emailId } = await Email.create({ email });
    const { customerId } = await Customer.create({
      firstName: 'John',
      lastName: 'Doe',
      status: 'active',
    });
    await CustomerEmail.create({
      customerId,
      emailId,
    });

    await Email.destroy({ where: { email } });

    const retrievedEmail = await Email.findOne({
      where: { email },
      raw: true,
    });
    const retrievedAccount = await CustomerEmail.findByPk(customerId, {
      raw: true,
    });

    expect(retrievedEmail).toBeNull();
    expect(retrievedAccount).toBeNull();
  });

  it('should not delete Email on CustomerEmail delete', async () => {
    const { emailId } = await Email.create({ email });
    const { customerId } = await Customer.create({
      firstName: 'Johns',
      lastName: 'Doe',
      status: 'active',
    });

    await CustomerEmail.create({
      customerId,
      emailId,
    });

    await CustomerEmail.destroy({ where: { customerId } });

    const retrievedAccount = await CustomerEmail.findByPk(customerId, {
      raw: true,
    });
    const retrievedCustomer = await Customer.findByPk(customerId, {
      raw: true,
    });
    const retrievedEmail = await Email.findOne({ where: { email }, raw: true });

    expect(retrievedAccount).toBeNull();
    expect(retrievedCustomer).not.toBeNull();
    expect(retrievedEmail).not.toBeNull();
  });
});

describe('Email and AdminAccount Assciation', () => {
  const email = 'johndoe@gmail.com';

  beforeEach(async () => {
    await Email.destroy({ where: {} });
    await AdminAccount.destroy({ where: {} });
    await Admin.destroy({ where: {} });
  });

  it('should delete AdminAccount on Email delete', async () => {
    const { emailId } = await Email.create({ email });
    const { adminId } = await Admin.create({
      firstName: 'John',
      lastName: 'Doe',
      status: 'active',
    });
    await AdminAccount.create({
      adminId,
      emailId,
      password: 'johnD0ePa$$',
    });

    await Email.destroy({ where: { email } });

    const retrievedEmail = await Email.findOne({
      where: { email },
      raw: true,
    });
    const retrievedAccount = await AdminAccount.findByPk(adminId, {
      raw: true,
    });

    expect(retrievedEmail).toBeNull();
    expect(retrievedAccount).toBeNull();
  });

  it('should not delete Email on AdminAccount delete', async () => {
    const { emailId } = await Email.create({ email });
    const { adminId } = await Admin.create({
      firstName: 'Johns',
      lastName: 'Doe',
      status: 'active',
    });
    await AdminAccount.create({
      adminId,
      emailId,
      password: 'johnD0ePa$$',
    });

    await AdminAccount.destroy({ where: { adminId } });

    const retrievedAccount = await AdminAccount.findByPk(adminId, {
      raw: true,
    });
    const retrievedEmail = await Email.findOne({ where: { email }, raw: true });

    expect(retrievedAccount).toBeNull();
    expect(retrievedEmail).not.toBeNull();
  });
});
