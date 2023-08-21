import { sign } from 'jsonwebtoken';

import {
  Customer,
  CustomerAccount,
  CustomerIdentity,
  CustomerOTP,
  CustomerPassword,
  Email,
} from '@user/models';
import authService from '@user/services/auth.service';
import { ROLES } from '@user/utils/constants';

import {
  createAdmin,
  createCustomer,
  createRoles,
  createUserAccountAndIdentity,
} from 'tests/modules/user/helper-functions';

import 'tests/db-setup';

const raw = true;

beforeAll(async () => {
  await createRoles();
});

describe('generate JWT token', () => {
  const email = 'janicedoe@gmail.com';

  it('should generate a token for email', async () => {
    const token = authService.generateJWT(email, 'email');
    const decoded = sign(
      { email, provider: 'email' },
      `${process.env.JWT_SECRET}`,
      { expiresIn: '1 day' },
    );

    expect(token).toEqual(decoded);
  });

  it('should generate a token for google', async () => {
    const token = authService.generateJWT(email, 'google');
    const decoded = sign(
      { email, provider: 'google' },
      `${process.env.JWT_SECRET}`,
      { expiresIn: '1 day' },
    );

    expect(token).toEqual(decoded);
  });

  it('should generate a token for facebook', async () => {
    const token = authService.generateJWT(email, 'facebook');
    const decoded = sign(
      { email, provider: 'facebook' },
      `${process.env.JWT_SECRET}`,
      { expiresIn: '1 day' },
    );

    expect(token).toEqual(decoded);
  });
});

describe('get user data', () => {
  it('should return user data for customer', async () => {
    const { customerId, customer, email, account } = await createCustomer(
      'Jacinto',
      'Doe',
      'jacintodoe@gmail.com',
      'jacD0epa$$',
      'active',
    );

    const result = await authService.getUserData(customerId, 'customer');

    expect(result).toMatchObject({
      userId: customerId,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: email.email,
      status: account.status,
      roles: ['customer'],
    });
  });

  it('should return user data when for customer with identity', async () => {
    const { customerId, customer, email, account } =
      await createUserAccountAndIdentity(
        'Juana',
        'Doe',
        'juanadoe@gmail.com',
        null,
        'active',
        [{ identityId: '9043859372838624', provider: 'google' }],
      );

    const result = await authService.getUserData(customerId, 'customer');

    expect(result).toMatchObject({
      userId: customerId,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: email.email,
      status: account.status,
      roles: ['customer'],
    });
  });

  it('should return user data for admin', async () => {
    const { CUSTOMER_SUPPORT, MANAGER } = ROLES;

    const { adminId, admin, email, account } = await createAdmin(
      'Jamie',
      'Doe',
      'jaime@gmail.com',
      'jacD0epa$$',
      'active',
      [CUSTOMER_SUPPORT.roleId, MANAGER.roleId],
    );

    const result = await authService.getUserData(adminId, 'admin');

    expect(result).toMatchObject({
      userId: adminId,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: email.email,
      status: account.status,
      roles: [CUSTOMER_SUPPORT.name, MANAGER.name],
    });
  });

  it('should return undefined if user does not exist', async () => {
    let result = await authService.getUserData(1000, 'customer');
    expect(result).not.toBeDefined();

    result = await authService.getUserData(1000, 'admin');
    expect(result).not.toBeDefined();
  });
});

describe('get user data for social authentication', () => {
  it('account and identity exist for user', async () => {
    const identityId = '97427987429868742642';
    const provider = 'facebook';

    const { customerId, customer, email, account } =
      await createUserAccountAndIdentity(
        'Juni',
        'Doe',
        'junidoe@gmail.com',
        null,
        'active',
        [{ identityId, provider }],
      );

    const { user, identityExists } =
      await authService.getUserForSocialAuthentication(
        identityId,
        provider,
        email.email,
      );

    expect(identityExists).toBe(true);
    expect(user).toMatchObject({
      userId: customerId,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: email.email,
      status: account.status,
      roles: ['customer'],
    });
  });

  it('account exists, but identity does not', async () => {
    const identityId = '85930847728963982469';
    const provider = 'facebook';

    const { customerId, customer, email, account } = await createCustomer(
      'June',
      'Die',
      'junedoe@gmail.com',
      'juneD0epa$$',
      'active',
    );

    const { user, identityExists } =
      await authService.getUserForSocialAuthentication(
        identityId,
        provider,
        email.email,
      );

    expect(identityExists).toBe(false);
    expect(user).toMatchObject({
      userId: customerId,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: email.email,
      status: account.status,
      identityId: null,
      roles: ['customer'],
    });
  });

  it('identity exists but not for user with provided email', async () => {
    const identityId = '85930847728963982469';
    const provider = 'facebook';

    await createUserAccountAndIdentity(
      'Juniper',
      'Doe',
      'juniperdoe@gmail.com',
      'junipeD0ePa$$',
      'active',
      [{ identityId, provider }],
    );

    const { email: juanEmail } = await createCustomer(
      'Juan',
      'Doe',
      'juandoe@gmail.com',
      'juaneD0ePa$$',
      'active',
    );

    const { user, identityExists } =
      await authService.getUserForSocialAuthentication(
        identityId,
        provider,
        juanEmail.email,
      );

    expect(identityExists).toBe(true);
    expect(user).toBe(undefined);
  });

  it('neither account nor identity exist', async () => {
    const identityId = '4675698097564453534636';
    const provider = 'facebook';
    const email = 'jelenadoe@gmail.com';

    const { user, identityExists } =
      await authService.getUserForSocialAuthentication(
        identityId,
        provider,
        email,
      );

    expect(identityExists).toBe(false);
    expect(user).not.toBeDefined();
  });

  it('should return undefined if user does not exists', async () => {
    const { user, identityExists } =
      await authService.getUserForSocialAuthentication(
        '693904397428648349',
        'facebook',
        'someemail@gmail.com',
      );

    expect(user).not.toBeDefined();
    expect(identityExists).toBe(false);
  });
});

describe('get userId for user', () => {
  it('should return customerId', async () => {
    const email = 'jazzdoe@gmail.com';

    const { customerId } = await createCustomer(
      'Jazz',
      'Doe',
      email,
      'jazzD0ePa$$',
      'active',
    );

    const result = await authService.getUserIdForUser(email);

    expect(result).toMatchObject({
      userId: customerId,
      isAdmin: false,
    });
  });

  it('should return adminId', async () => {
    const email = 'jakdoe@gmail.com';

    const { adminId } = await createAdmin(
      'Jak',
      'Doe',
      email,
      'jakD0ePa$$',
      'active',
      [ROLES.MANAGER.roleId],
    );

    const result = await authService.getUserIdForUser(email);

    expect(result).toMatchObject({
      userId: adminId,
      isAdmin: true,
    });
  });

  it('should return null for non-existent user', async () => {
    const result = await authService.getUserIdForUser('false@gmail.com');
    expect(result).toBeNull();
  });
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

    const a = await CustomerAccount.findOne({
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
      where: { firstName, lastName },
      raw,
    });
    expect(createdCustomer).not.toBeNull();

    const createdEmail = await Email.findOne({ where: { email } });
    expect(createdEmail).not.toBeNull();

    const createdAccount = await CustomerAccount.findOne({
      where: {
        customerId: createdCustomer?.customerId,
        emailId: createdEmail?.emailId,
        status: 'active',
      },
      raw,
    });
    expect(createdAccount).not.toBeNull();

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

    const customer = await Customer.findByPk(customerId, { raw });
    const account = await CustomerAccount.findByPk(customerId, { raw });
    const password = await CustomerPassword.findByPk(customerId);

    expect(customer).not.toBeNull();
    expect(account).not.toBeNull();
    expect(password).not.toBeNull();
    expect(password?.comparePasswords(jacquePassword)).toBe(true);

    const emailOTP = await CustomerOTP.findOne({
      where: { customerId, type: 'email' },
    });

    expect(emailOTP).not.toBeNull();
    expect(emailOTP?.comparePasswords(otp)).toBe(true);
  });
});

describe('login', () => {
  it('should login admin on valid data', async () => {
    const email = 'january@gmail.com';
    const password = 'janD0epas$$';

    const { adminId } = await createAdmin(
      'Jan',
      'Doe',
      email,
      password,
      'active',
      [ROLES.CUSTOMER_SUPPORT.roleId],
    );

    const userId = await authService.loginUser(email, password);
    expect(userId).toBe(adminId);
  });

  it('should login customer on valid data', async () => {
    const email = 'jandoe@gmail.com';
    const password = 'janD0epas$$';

    const { customerId } = await createCustomer(
      'Jan',
      'Doe',
      email,
      password,
      'active',
    );

    const userId = await authService.loginUser(email, password);
    expect(userId).toBe(customerId);
  });

  it('should fail login if customer has no password', async () => {
    const email = 'jaffdoe@gmail.com';

    const { customerId } = await createUserAccountAndIdentity(
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

    const userId = await authService.loginUser(email, 'jazzd0ePa$$');
    expect(userId).toBeNull();
  });

  it('should fail login on wrong credentials', async () => {
    let userId = await authService.loginUser('jandoe@gmail.com', '1234567890');
    expect(userId).toBe(null);

    userId = await authService.loginUser('january@gmail.com', '1234567890');
    expect(userId).toBe(null);

    userId = await authService.loginUser('notjanuary@gmail.com', '1234567890');
    expect(userId).toBe(null);
  });
});

describe('recover password otp', () => {
  it('should recover the password successfully', async () => {
    const { customerId } = await createCustomer(
      'Jack',
      'Doe',
      'jackdoe@gmail.com',
      'jackD0epas$$',
      'active',
    );

    const newPassword = 'newD0epa$$word';

    await authService.recoverCustomerPassword(customerId, newPassword);

    const password = await CustomerPassword.findOne({ where: { customerId } });
    expect(password?.comparePasswords(newPassword)).toBe(true);
  });
});

describe('reactivate customer', () => {
  it('should update status if user is deactivated', async () => {
    const { customerId } = await createCustomer(
      'Jery',
      'Doe',
      'jerydoe@gmail.com',
      'jerryD0ePa$$',
      'disabled',
    );

    const result = await authService.reactivateCustomer(customerId);
    expect(result).toBe(true);

    const account = await CustomerAccount.findByPk(customerId, { raw });
    expect(account?.status).toBe('active');
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

    const account = await CustomerAccount.findByPk(customerId, { raw });
    expect(account?.status).toBe('suspended');
  });
});
