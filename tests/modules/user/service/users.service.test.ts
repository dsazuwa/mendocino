import { Request } from 'express';

import userService from '@user/services/user.service';
import { ROLES } from '@user/utils/constants';

import {
  createAdmin,
  createCustomer,
  createCustomerAndIdentity,
  createRoles,
} from 'tests/modules/user/helper-functions';

import 'tests/db-setup';

beforeAll(async () => {
  await createRoles();
});

describe('get user', () => {
  it('pending user account', async () => {
    const firstName = 'Joan';
    const lastName = 'Doe';
    const email = 'joandoe@gmail.com';
    const password = 'joanD0epa$$';
    const status = 'pending';
    const roles = ['customer'];

    const req = {
      user: { firstName, lastName, email, password, status, roles },
    } as unknown as Request;

    const data = await userService.getUserDataFromReq(req);
    expect(data).toMatchObject({ firstName, lastName, email, status, roles });
  });

  it('active user account', async () => {
    const firstName = 'Jeronimo';
    const lastName = 'Doe';
    const email = 'jeronimodoe@gmail.com';
    const password = 'jeroD0ePa$$';
    const status = 'active';
    const roles = ['ceo', 'manager'];

    const req = {
      user: { firstName, lastName, email, password, status, roles },
    } as unknown as Request;

    const data = await userService.getUserDataFromReq(req);
    expect(data).toMatchObject({ firstName, lastName, email, status, roles });
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

    const result = await userService.getUserData(customerId, 'customer');

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
      await createCustomerAndIdentity(
        'Juana',
        'Doe',
        'juanadoe@gmail.com',
        null,
        'active',
        [{ identityId: '9043859372838624', provider: 'google' }],
      );

    const result = await userService.getUserData(customerId, 'customer');

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

    const result = await userService.getUserData(adminId, 'admin');

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
    let result = await userService.getUserData(1000, 'customer');
    expect(result).not.toBeDefined();

    result = await userService.getUserData(1000, 'admin');
    expect(result).not.toBeDefined();
  });
});

describe('get user data for social authentication', () => {
  it('account and identity exist for user', async () => {
    const identityId = '97427987429868742642';
    const provider = 'facebook';

    const { customerId, customer, email, account } =
      await createCustomerAndIdentity(
        'Juni',
        'Doe',
        'junidoe@gmail.com',
        null,
        'active',
        [{ identityId, provider }],
      );

    const { user, isAdmin, identityExists } =
      await userService.getUserForSocialAuthentication(
        identityId,
        provider,
        email.email,
      );

    expect(user).toMatchObject({
      userId: customerId,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: email.email,
      status: account.status,
      roles: ['customer'],
    });
    expect(isAdmin).toBe(false);
    expect(identityExists).toBe(true);
  });

  it('account exists, but identity does not', async () => {
    const identityId = '85930847728963982469';
    const provider = 'facebook';

    const { customerId, customer, email, account } = await createCustomer(
      'June',
      'Doe',
      'junedoe@gmail.com',
      'juneD0epa$$',
      'active',
    );

    const { user, isAdmin, identityExists } =
      await userService.getUserForSocialAuthentication(
        identityId,
        provider,
        email.email,
      );

    expect(user).toMatchObject({
      userId: customerId,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: email.email,
      status: account.status,
      roles: ['customer'],
    });
    expect(isAdmin).toBe(false);
    expect(identityExists).toBe(false);
  });

  it('admin account exists', async () => {
    const { email } = await createAdmin(
      'Jane',
      'Doe',
      'janedoe@gmail.com',
      'juneD0epa$$',
      'active',
      [ROLES.MANAGER.roleId],
    );

    const { user, isAdmin, identityExists } =
      await userService.getUserForSocialAuthentication(
        '859308786728963982469',
        'facebook',
        email.email,
      );

    expect(user).toBeNull();
    expect(isAdmin).toBe(true);
    expect(identityExists).toBe(false);
  });

  it('identity exists but not for user with provided email', async () => {
    const identityId = '85930847728963982469';
    const provider = 'facebook';

    await createCustomerAndIdentity(
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

    const { user, isAdmin, identityExists } =
      await userService.getUserForSocialAuthentication(
        identityId,
        provider,
        juanEmail.email,
      );

    expect(user).toBeNull();
    expect(isAdmin).toBe(false);
    expect(identityExists).toBe(true);
  });

  it('should return undefined if user does not exists', async () => {
    const { user, isAdmin, identityExists } =
      await userService.getUserForSocialAuthentication(
        '693904397428648349',
        'facebook',
        'someemail@gmail.com',
      );

    expect(user).toBeNull();
    expect(isAdmin).toBe(false);
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

    const result = await userService.getUserIdForUser(email);

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

    const result = await userService.getUserIdForUser(email);

    expect(result).toMatchObject({
      userId: adminId,
      isAdmin: true,
    });
  });

  it('should return null for non-existent user', async () => {
    const result = await userService.getUserIdForUser('false@gmail.com');
    expect(result).toBeNull();
  });
});
