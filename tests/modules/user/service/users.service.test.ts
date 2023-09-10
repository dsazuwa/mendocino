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

describe('get user from req', () => {
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

    const data = await userService.getUserFromReq(req);
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

    const data = await userService.getUserFromReq(req);
    expect(data).toMatchObject({ firstName, lastName, email, status, roles });
  });
});

describe('get user by id', () => {
  it('should return user data for customer', async () => {
    const { customerId, customer, email } = await createCustomer(
      'Jacinto',
      'Doe',
      'jacintodoe@gmail.com',
      'jacD0epa$$',
      'active',
    );

    const result = await userService.getUserById(customerId, false);

    expect(result).toMatchObject({
      userId: customerId,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: email.email,
      status: customer.status,
      roles: ['customer'],
    });
  });

  it('should return user data for customer with identity', async () => {
    const { customerId, customer, email } = await createCustomerAndIdentity(
      'Juana',
      'Doe',
      'juanadoe@gmail.com',
      null,
      'active',
      [{ identityId: '9043859372838624', provider: 'google' }],
    );

    const result = await userService.getUserById(customerId, false);

    expect(result).toMatchObject({
      userId: customerId,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: email.email,
      status: customer.status,
      roles: ['customer'],
    });
  });

  it('should return user data for admin', async () => {
    const { CUSTOMER_SUPPORT, MANAGER } = ROLES;

    const { adminId, admin, email } = await createAdmin(
      'Jamie',
      'Doe',
      'jaime@gmail.com',
      'jacD0epa$$',
      'active',
      [CUSTOMER_SUPPORT.roleId, MANAGER.roleId],
    );

    const result = await userService.getUserById(adminId, true);

    expect(result).toMatchObject({
      userId: adminId,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: email.email,
      status: admin.status,
      roles: [CUSTOMER_SUPPORT.name, MANAGER.name],
    });
  });

  it('should return undefined if user does not exist', async () => {
    let result = await userService.getUserById(0, false);
    expect(result).not.toBeDefined();

    result = await userService.getUserById(1, true);
    expect(result).not.toBeDefined();
  });
});

describe('get user by email', () => {
  it('should return customerId', async () => {
    const firstName = 'Jazz';
    const lastName = 'Doe';
    const email = 'jazzdoe@gmail.com';
    const status = 'active';

    const { customerId } = await createCustomer(
      firstName,
      lastName,
      email,
      'jazzD0ePa$$',
      status,
    );

    const result = await userService.getUserByEmail(email);

    expect(result).toMatchObject({
      isAdmin: false,
      userId: customerId,
      firstName,
      lastName,
      email,
      status,
      roles: ['customer'],
    });
  });

  it('should return adminId', async () => {
    const firstName = 'Jak';
    const lastName = 'Doe';
    const email = 'jakdoe@gmail.com';
    const status = 'active';
    const { roleId, name } = ROLES.MANAGER;

    const { adminId } = await createAdmin(
      firstName,
      lastName,
      email,
      'jakD0ePa$$',
      status,
      [roleId],
    );

    const result = await userService.getUserByEmail(email);

    expect(result).toMatchObject({
      isAdmin: true,
      userId: adminId,
      firstName,
      lastName,
      email,
      status,
      roles: [name],
    });
  });

  it('should return null for non-existent user', async () => {
    const result = await userService.getUserByEmail('false@gmail.com');
    expect(result).toBeNull();
  });
});

describe('get user from payload', () => {
  it('should return data for admin', async () => {
    const { ROOT } = ROLES;

    const { adminId, admin, email } = await createAdmin(
      'Jess',
      'Doe',
      'jessdoe@gmail.com',
      'jessD0ePa$$',
      'active',
      [ROOT.roleId],
    );

    const result = await userService.getUserFromPayload(email.email, 'email');
    expect(result).toMatchObject({
      userId: adminId,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: email.email,
      status: admin.status,
      roles: [ROOT.name],
    });
  });

  it('should return data for customer', async () => {
    const { customerId, customer, email } = await createCustomer(
      'Jess',
      'Doe',
      'not.jessdoe@gmail.com',
      'jessD0ePa$$',
      'active',
    );

    const result = await userService.getUserFromPayload(email.email, 'email');
    expect(result).toMatchObject({
      userId: customerId,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: email.email,
      status: customer.status,
      roles: ['customer'],
    });
  });

  it('should return data for active customer using third party auth', async () => {
    const provider = 'google';

    const { customerId, customer, email } = await createCustomerAndIdentity(
      'Jessica',
      'Doe',
      'notjessicadoe@gmail.com',
      'jessD0ePa$$',
      'active',
      [{ identityId: '234w756532435674', provider }],
    );

    const result = await userService.getUserFromPayload(email.email, provider);
    expect(result).toMatchObject({
      userId: customerId,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: email.email,
      status: customer.status,
      roles: ['customer'],
    });
  });
});

describe('get user data for social authentication', () => {
  it('account and identity exist for user', async () => {
    const identityId = '97427987429868742642';
    const provider = 'facebook';

    const { customerId, customer, email } = await createCustomerAndIdentity(
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
      status: customer.status,
      roles: ['customer'],
    });
    expect(isAdmin).toBe(false);
    expect(identityExists).toBe(true);
  });

  it('account exists, but identity does not', async () => {
    const identityId = '85930847728963982469';
    const provider = 'facebook';

    const { customerId, customer, email } = await createCustomer(
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
      status: customer.status,
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

describe('getUserForRecovery', () => {
  it('for admin with password', async () => {
    const { adminId, admin, email } = await createAdmin(
      'Jim',
      'Doe',
      'jimdoe@gmail.com',
      'jimD0ePa$$',
      'active',
      [ROLES.ROOT.roleId],
    );

    const result = await userService.getUserForRecovery(email.email);
    expect(result).toMatchObject({
      isAdmin: true,
      userId: adminId,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: email.email,
      hasPassword: true,
      status: admin.status,
      roles: [ROLES.ROOT.name],
    });
  });

  it('for customer with password', async () => {
    const { customerId, customer, email } = await createCustomer(
      'Jimmy',
      'Doe',
      'jimmydoe@gmail.com',
      'jimD0ePa$$',
      'active',
    );

    const result = await userService.getUserForRecovery(email.email);
    expect(result).toMatchObject({
      isAdmin: false,
      userId: customerId,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: email.email,
      hasPassword: true,
      status: customer.status,
      roles: ['customer'],
    });
  });

  it('for customer with out password', async () => {
    const { customerId, customer, email } = await createCustomerAndIdentity(
      'Jim Bob',
      'Doe',
      'jimmbobdoe@gmail.com',
      null,
      'active',
      [{ identityId: '0837418974832197432987432', provider: 'google' }],
    );

    const result = await userService.getUserForRecovery(email.email);
    expect(result).toMatchObject({
      isAdmin: false,
      userId: customerId,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: email.email,
      hasPassword: false,
      status: customer.status,
      roles: ['customer'],
    });
  });
});
