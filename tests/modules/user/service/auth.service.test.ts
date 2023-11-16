import {
  AdminAccount,
  Customer,
  CustomerEmail,
  CustomerIdentity,
  CustomerOTP,
  CustomerPassword,
  Email,
} from 'modules/user/models';
import authService from 'modules/user/services/auth.service';
import { ROLES } from 'modules/user/utils/constants';

import {
  createAdmin,
  createCustomer,
  createCustomerAndIdentity,
  createRoles,
} from '../helper-functions';

import '../../../db-setup';

const raw = true;

beforeAll(async () => {
  await createRoles();
});

describe('create identity for customer', () => {
  it('should create identity for customer and change account status to active', async () => {
    const status = 'pending';

    const { customerId } = await createCustomer(
      'James',
      'Doe',
      'jamesdoe@gmail.com',
      'jamesD0epa$$',
      status,
    );

    const identityId = '923849719836872649';
    const provider = 'google';

    const result = await authService.createIdentityForCustomer(
      identityId,
      customerId,
      status,
      provider,
    );
    expect(result.identityId).toBe(identityId);

    const i = CustomerIdentity.findOne({
      where: { customerId, provider },
      raw,
    });
    expect(i).not.toBeNull();

    const a = await Customer.findOne({
      where: { customerId, status: 'active' },
      raw,
    });
    expect(a).not.toBeNull();
  });
});

describe('create customer and identity', () => {
  it('should create user, user account, and user identity', async () => {
    const identityId = '98098976576567';
    const firstName = 'Jamal';
    const lastName = 'Doe';
    const email = 'jamaldoe@gmail.com';

    const c = await Customer.findOne({
      where: { firstName, lastName },
      raw,
    });
    const e = await Email.findOne({ where: { email }, raw });
    const i = await CustomerIdentity.findOne({
      where: { identityId, provider: 'google' },
      raw,
    });

    expect(c).toBeNull();
    expect(e).toBeNull();
    expect(i).toBeNull();

    const result = await authService.createCustomerAndIdentity(
      identityId,
      firstName,
      lastName,
      email,
      'google',
    );

    expect(result.identityId).toBe(identityId);

    const createdCustomer = await Customer.findOne({
      where: { firstName, lastName, status: 'active' },
      raw,
    });
    expect(createdCustomer).not.toBeNull();

    const createdEmail = await Email.findOne({ where: { email } });
    expect(createdEmail).not.toBeNull();

    const createdCustomerEmail = await CustomerEmail.findOne({
      where: {
        customerId: createdCustomer?.customerId,
        emailId: createdEmail?.emailId,
      },
      raw,
    });
    expect(createdCustomerEmail).not.toBeNull();

    const createdPassword = await CustomerPassword.findOne({
      where: { customerId: createdCustomer?.customerId },
      raw: true,
    });
    expect(createdPassword).toBeNull();

    const createdIdentity = await CustomerIdentity.findOne({
      where: { identityId },
      raw,
    });
    expect(createdIdentity).not.toBeNull();
  });
});

describe('create customer', () => {
  it('should successfully create customer', async () => {
    const jacquePassword = 'jacqueD0epas$$';

    const { customerId, password: otp } = await authService.createCustomer(
      'Jacqueline',
      'Doe',
      'jacquelinedoe@gmail.com',
      jacquePassword,
    );

    const c = await Customer.findByPk(customerId, { raw });
    const e = await CustomerEmail.findByPk(customerId, { raw });
    const p = await CustomerPassword.findByPk(customerId);

    expect(c).not.toBeNull();
    expect(e).not.toBeNull();
    expect(p).not.toBeNull();

    expect(
      CustomerPassword.comparePasswords(jacquePassword, p?.password || ''),
    ).toBe(true);

    const emailOTP = await CustomerOTP.findOne({
      where: { customerId, type: 'email' },
    });

    expect(emailOTP).not.toBeNull();
    expect(emailOTP?.comparePasswords(otp)).toBe(true);
  });
});

describe('login', () => {
  it('should login admin on valid data', async () => {
    const firstName = 'Jan';
    const lastName = 'Doe';
    const email = 'january@gmail.com';
    const password = 'janD0epas$$';
    const status = 'active';

    const { CUSTOMER_SUPPORT } = ROLES;

    const { adminId } = await createAdmin(
      firstName,
      lastName,
      email,
      password,
      status,
      [CUSTOMER_SUPPORT.roleId],
    );

    const result = await authService.loginUser(email, password);
    expect(result).toMatchObject({
      isAdmin: true,
      userId: adminId,
      user: {
        firstName,
        lastName,
        email,
        status,
        roles: [CUSTOMER_SUPPORT.name],
      },
    });
  });

  it('should login customer on valid data', async () => {
    const firstName = 'Jan';
    const lastName = 'Doe';
    const email = 'jandoe@gmail.com';
    const password = 'janD0epas$$';
    const status = 'active';

    const { customerId } = await createCustomer(
      firstName,
      lastName,
      email,
      password,
      status,
    );

    const result = await authService.loginUser(email, password);
    expect(result).toMatchObject({
      isAdmin: false,
      userId: customerId,
      user: {
        firstName,
        lastName,
        email,
        status,
        roles: ['customer'],
      },
    });
  });

  it('should fail login if customer has no password', async () => {
    const email = 'jaffdoe@gmail.com';

    const { customerId } = await createCustomerAndIdentity(
      'Jeff',
      'Doe',
      email,
      null,
      'active',
      [{ identityId: '23427678575423245', provider: 'google' }],
    );

    const password = await CustomerPassword.findOne({
      where: { customerId },
      raw,
    });
    expect(password).toBeNull();

    const result = await authService.loginUser(email, 'jazzd0ePa$$');
    expect(result).toBeNull();
  });

  it('should fail login on wrong credentials', async () => {
    let result = await authService.loginUser('jandoe@gmail.com', '1234567890');
    expect(result).toBe(null);

    result = await authService.loginUser('january@gmail.com', '1234567890');
    expect(result).toBe(null);

    result = await authService.loginUser('notjanuary@gmail.com', '1234567890');
    expect(result).toBe(null);
  });
});

describe('recover password', () => {
  it('should recover the customer password', async () => {
    const { customerId } = await createCustomer(
      'Jack',
      'Doe',
      'jackdoe@gmail.com',
      'jackD0epas$$',
      'active',
    );

    const newPassword = 'newD0epa$$word';

    await authService.recoverPassword(false, customerId, newPassword);

    const password = await CustomerPassword.findOne({ where: { customerId } });
    expect(
      CustomerPassword.comparePasswords(newPassword, password?.password || ''),
    ).toBe(true);
  });

  it('should recover the admin password', async () => {
    const { adminId } = await createAdmin(
      'Jack',
      'Doe',
      'jackdoe.admin@gmail.com',
      'jackD0epas$$',
      'active',
      [ROLES.CUSTOMER_SUPPORT.roleId],
    );

    const newPassword = 'newD0epa$$word';

    await authService.recoverPassword(true, adminId, newPassword);

    const account = await AdminAccount.findOne({ where: { adminId } });
    expect(
      AdminAccount.comparePasswords(newPassword, account?.password || ''),
    ).toBe(true);
  });
});

describe('reactivate customer', () => {
  it('should update status if user is deactivated', async () => {
    const { customerId } = await createCustomer(
      'Jery',
      'Doe',
      'jerydoe@gmail.com',
      'jerryD0ePa$$',
      'deactivated',
    );

    const result = await authService.reactivateCustomer(customerId);
    expect(result).toBe(true);

    const customer = await Customer.findByPk(customerId, { raw });
    expect(customer?.status).toBe('active');
  });

  it('should fail to update status if user is not deactivated', async () => {
    const { customerId } = await createCustomer(
      'Jery',
      'Doe',
      'jerry@gmail.com',
      'jerryD0ePa$$',
      'suspended',
    );

    const result = await authService.reactivateCustomer(customerId);
    expect(result).toBe(false);

    const customer = await Customer.findByPk(customerId, { raw });
    expect(customer?.status).toBe('suspended');
  });
});
