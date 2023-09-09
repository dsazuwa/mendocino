import { JwtPayload, verify } from 'jsonwebtoken';

import {
  CustomerOTP,
  Customer,
  CustomerEmail,
  CustomerIdentity,
  CustomerPassword,
  Email,
} from '@user/models';
import authService from '@user/services/auth.service';

import {
  createCustomer,
  createCustomerAndIdentity,
} from 'tests/modules/user/helper-functions';
import { getTokenFrom, request } from 'tests/supertest.helper';

import 'tests/db-setup';

const BASE_URL = '/api/customers/me';

const raw = true;

describe(`GET ${BASE_URL}/profile`, () => {
  it('return profile for customer', async () => {
    const firstName = 'Joy';
    const lastName = 'Doe';
    const email = 'joydoe@gmail.com';
    const password = 'joyD0epa$$';
    const status = 'pending';

    await createCustomer(firstName, lastName, email, password, status);

    const jwt = authService.generateJwt(email, 'email');

    const response = await request
      .get(`${BASE_URL}/profile`)
      .auth(jwt, { type: 'bearer' });

    expect(response.status).toBe(200);
    expect(response.body.profile).toMatchObject({
      firstName,
      lastName,
      email: { address: email, isVerified: false },
      hasPassword: true,
      authProviders: [],
      roles: ['customer'],
      phoneNumber: { phone: null, isVerified: false },
      addresses: null,
    });
  });
});

describe(`POST ${BASE_URL}/verify`, () => {
  let customerId: number;
  let jwt: string;

  beforeAll(async () => {
    const { customer, email } = await createCustomer(
      'Jaz',
      'Doe',
      'jazdoe@gmail.com',
      'jazD0ePa$$',
      'pending',
    );

    customerId = customer.customerId;
    jwt = authService.generateJwt(email.email, 'email');
  });

  it('should create a new email verification token', async () => {
    let otp = await CustomerOTP.findOne({
      where: { customerId, type: 'email' },
      raw,
    });
    expect(otp).toBeNull();

    await request
      .post(`${BASE_URL}/verify`)
      .auth(jwt, { type: 'bearer' })
      .expect(200);

    otp = await CustomerOTP.findOne({
      where: { customerId, type: 'email' },
      raw,
    });
    expect(otp).not.toBeNull();
  });

  it('should destroy previous email verification token', async () => {
    const otp = await CustomerOTP.findOne({
      where: { customerId, type: 'email' },
      raw,
    });
    const { otpId } = otp as CustomerOTP;

    await request
      .post(`${BASE_URL}/verify`)
      .auth(jwt, { type: 'bearer' })
      .expect(200);

    const otps = await CustomerOTP.findAll({
      where: { customerId, type: 'email' },
      raw,
    });
    expect(otps.length).toBe(1);

    const [newOTP] = otps;
    expect(newOTP).not.toBeNull();
    expect(newOTP?.otpId).not.toBe(otpId);
  });

  it('should fail for active customer', async () => {
    const email = 'jeffdoe@gmail.com';

    await createCustomer('Jeff', 'Doe', email, 'jeffD0ePa$$', 'active');

    const token = authService.generateJwt(email, 'email');

    await request
      .post(`${BASE_URL}/verify`)
      .auth(token, { type: 'bearer' })
      .expect(401);
  });
});

describe(`PATCH ${BASE_URL}/verify/:otp`, () => {
  const mockOTP = '123456';

  let customerId: number;
  let jwt: string;

  beforeAll(async () => {
    const { customer, email } = await createCustomer(
      'Jax',
      'Doe',
      'jaxdoe@gmail.com',
      'jaxD0ePa$$',
      'pending',
    );

    customerId = customer.customerId;
    jwt = authService.generateJwt(email.email, 'email');
  });

  it('should fail for active customer', async () => {
    const { email } = await createCustomer(
      'Jess',
      'Doe',
      'jessdoe@gmail.com',
      'jessD0ePa$$',
      'active',
    );

    const token = authService.generateJwt(email.email, 'email');

    await request
      .post(`${BASE_URL}/verify`)
      .auth(token, { type: 'bearer' })
      .expect(401);
  });

  it('should fail on wrong otp', async () => {
    await request
      .patch(`${BASE_URL}/verify/111111`)
      .auth(jwt, { type: 'bearer' })
      .expect(401);
  });

  it('should fail on non-numeric otp', async () => {
    await request
      .patch(`${BASE_URL}/verify/nonnumeric`)
      .auth(jwt, { type: 'bearer' })
      .expect(400);
  });

  it('should fail on expired otp', async () => {
    await CustomerOTP.destroy({ where: { customerId, type: 'email' } });

    await CustomerOTP.create({
      customerId,
      type: 'email',
      password: mockOTP,
      expiresAt: new Date(),
    });

    await request
      .patch(`${BASE_URL}/verify/${mockOTP}`)
      .auth(jwt, { type: 'bearer' })
      .expect(401);
  });

  it('should verify email', async () => {
    await CustomerOTP.destroy({ where: { customerId, type: 'email' } });

    await CustomerOTP.create({
      customerId,
      type: 'email',
      password: mockOTP,
      expiresAt: CustomerOTP.getExpiration(),
    });

    await request
      .patch(`${BASE_URL}/verify/${mockOTP}`)
      .auth(jwt, { type: 'bearer' })
      .expect(200);

    const customer = await Customer.findByPk(customerId, { raw });
    expect(customer?.status).toEqual('active');
  });
});

describe(`PATCH ${BASE_URL}/name`, () => {
  let customerId: number;
  let jwt: string;

  const firstName = 'Janet';
  const lastName = 'Doe';

  const newFirst = 'Janette';
  const newLast = 'Dough';

  beforeEach(async () => {
    await Email.destroy({ where: {} });
    await Customer.destroy({ where: {} });

    const { customer, email } = await createCustomer(
      firstName,
      lastName,
      'janetdoe@gmail.com',
      'JanetD0ePa$$',
      'active',
    );

    customerId = customer.customerId;
    jwt = authService.generateJwt(email.email, 'email');
  });

  const testUpdatecustomer = async (
    fName: string | undefined,
    lName: string | undefined,
    expectedFirst: string,
    expectedLast: string,
    status: 200 | 400,
  ) => {
    await request
      .patch(`${BASE_URL}/name`)
      .send({ firstName: fName, lastName: lName })
      .auth(jwt, { type: 'bearer' })
      .expect(status);

    const customer = await Customer.findOne({
      where: { customerId, firstName: expectedFirst, lastName: expectedLast },
      raw,
    });
    expect(customer).not.toBeNull();
  };

  it('should update customer if both firstName and lastName are provided', async () => {
    await testUpdatecustomer(newFirst, newLast, newFirst, newLast, 200);
  });

  describe('should update customer if firstName is provided', () => {
    it('but lastName is an empty string', async () => {
      await testUpdatecustomer(newFirst, '', newFirst, lastName, 200);
    });

    it('but lastName is undefined', async () => {
      await testUpdatecustomer(newFirst, undefined, newFirst, lastName, 200);
    });
  });

  describe('should update customer if lastName is provided', () => {
    it('but firstName is an empty string', async () => {
      await testUpdatecustomer('', newLast, firstName, newLast, 200);
    });

    it('but firstName is undefined', async () => {
      await testUpdatecustomer(undefined, newLast, firstName, newLast, 200);
    });
  });

  describe('should not update customer', () => {
    it('if both firstName and lastName are empty strings', async () => {
      await testUpdatecustomer('', ' ', firstName, lastName, 400);
    });

    it('if both firstName and lastName are undefined', async () => {
      await testUpdatecustomer(undefined, undefined, firstName, lastName, 400);
    });
  });
});

describe(`POST ${BASE_URL}/password`, () => {
  it('should create password for account with null password', async () => {
    const { customerId, email } = await createCustomerAndIdentity(
      'Jamie',
      'Doe',
      'jamiedoe@gmail.com',
      null,
      'active',
      [{ identityId: '24598392689426802632', provider: 'google' }],
    );

    const jwt = authService.generateJwt(email.email, 'email');

    let password = await CustomerPassword.findByPk(customerId, { raw: true });
    expect(password).toBeNull();

    await request
      .post(`${BASE_URL}/password`)
      .auth(jwt, { type: 'bearer' })
      .send({ password: 'jaimeD0ePa$$' })
      .expect(200);

    password = await CustomerPassword.findByPk(customerId, { raw: true });
    expect(password).not.toBeNull();
  });

  it('should fail to create password for account with non-null password', async () => {
    const { customerId, email } = await createCustomer(
      'Julien',
      'Doe',
      'juliendoe@gmail.com',
      'julienD0ePa$$',
      'active',
    );

    const jwt = authService.generateJwt(email.email, 'email');

    let password = await CustomerPassword.findByPk(customerId, { raw: true });
    expect(password).not.toBeNull();

    const newPassword = 'newJulienD0ePa$$';

    await request
      .post(`${BASE_URL}/password`)
      .auth(jwt, { type: 'bearer' })
      .send({ password: newPassword })
      .expect(409);

    password = await CustomerPassword.findByPk(customerId);
    expect(password).not.toBeNull();
    expect(password?.comparePasswords(newPassword)).toBe(false);
  });
});

describe(`PATCH ${BASE_URL}/password`, () => {
  const password = 'jeanD0ePa$$';

  let customerId: number;
  let jwt: string;

  beforeAll(async () => {
    const { customer, email } = await createCustomer(
      'Jeanette',
      'Doe',
      'jeanettedoe@gmail.com',
      password,
      'active',
    );

    customerId = customer.customerId;
    jwt = authService.generateJwt(email.email, 'email');
  });

  it('should update password', async () => {
    const newPassword = 'newjeanD0ePa$$';

    await request
      .patch(`${BASE_URL}/password`)
      .auth(jwt, { type: 'bearer' })
      .send({ currentPassword: password, newPassword })
      .expect(200);

    const cp = await CustomerPassword.findByPk(customerId);
    expect(cp?.comparePasswords(newPassword)).toBe(true);
  });

  it('should fail to update password on invalid new password', async () => {
    const newPassword = 'newjeanD0ePa$$2';

    await request
      .patch(`${BASE_URL}/password`)
      .auth(jwt, { type: 'bearer' })
      .send({
        currentPassword: 'wrongCurrentPassword',
        password: newPassword,
      })
      .expect(400);

    await request
      .patch(`${BASE_URL}/password`)
      .auth(jwt, { type: 'bearer' })
      .send({ currentPassword: password, password: 'invalidPassword' })
      .expect(400);

    await request
      .patch(`${BASE_URL}/password`)
      .auth(jwt, { type: 'bearer' })
      .expect(400);
  });

  it('should fail if current and new password are the same', async () => {
    const newPassword = 'D0ePa$$w0rd';

    await request
      .patch(`${BASE_URL}/password`)
      .auth(jwt, { type: 'bearer' })
      .send({ currentPassword: password, password: newPassword })
      .expect(400);
  });
});

describe(`PATCH ${BASE_URL}/revoke-social-auth`, () => {
  it('should delete identity and swtich to email login if customer has an account with a password', async () => {
    const provider = 'google';

    const { customerId, email } = await createCustomerAndIdentity(
      'Jennifer',
      'Doe',
      'jenniferdoe@gmail.com',
      'jenniferD0ePa$$',
      'active',
      [{ identityId: '3654755345356474363', provider }],
    );

    const jwt = authService.generateJwt(email.email, provider);

    const response = await request
      .patch(`${BASE_URL}/revoke-social-auth`)
      .send({ provider })
      .auth(jwt, { type: 'bearer' });

    expect(response.status).toBe(200);

    const accessToken = getTokenFrom(
      response.headers['set-cookie'],
      'access-token',
    );
    expect(accessToken).not.toEqual('');

    const decoded = verify(accessToken, process.env.JWT_SECRET) as JwtPayload;
    expect(decoded.email).toBe(email.email);
    expect(decoded.provider).toBe('email');

    const i = await CustomerIdentity.findOne({
      where: { customerId, provider: 'google' },
      raw,
    });
    expect(i).toBeNull();
  });

  it('should delete identity if customer has no account with a password, but has some other identity', async () => {
    const { customerId, email } = await createCustomerAndIdentity(
      'Jack',
      'Doe',
      'jackdoe@gmail.com',
      null,
      'active',
      [
        { identityId: '687453534367486564', provider: 'google' },
        { identityId: '234267589676438787', provider: 'facebook' },
      ],
    );

    const jwt = authService.generateJwt(email.email, 'google');

    const response = await request
      .patch(`${BASE_URL}/revoke-social-auth`)
      .send({ provider: 'google' })
      .auth(jwt, { type: 'bearer' });

    expect(response.status).toBe(200);

    const accessToken = getTokenFrom(
      response.headers['set-cookie'],
      'access-token',
    );
    expect(accessToken).not.toEqual('');

    const decoded = verify(accessToken, process.env.JWT_SECRET) as JwtPayload;
    expect(decoded.email).toBe(email.email);
    expect(decoded.provider).toBe('facebook');

    let i = await CustomerIdentity.findOne({
      where: { customerId, provider: 'google' },
      raw,
    });
    expect(i).toBeNull();

    i = await CustomerIdentity.findOne({
      where: { customerId, provider: 'facebook' },
      raw,
    });
    expect(i).not.toBeNull();
  });

  it('should delete customer if customer has neither an account with a password, nor some other identity', async () => {
    const { customerId, email } = await createCustomerAndIdentity(
      'Jas',
      'Doe',
      'jasdoe@gmail.com',
      null,
      'active',
      [{ identityId: '7934872657237824972478', provider: 'google' }],
    );

    const jwt = authService.generateJwt(email.email, 'google');

    await request
      .patch(`${BASE_URL}/revoke-social-auth`)
      .send({ provider: 'google' })
      .auth(jwt, { type: 'bearer' })
      .expect(400);

    const c = await Customer.findByPk(customerId, { raw });
    expect(c).not.toBeNull();
  });
});

describe(`PATCH ${BASE_URL}/close`, () => {
  it('should set account status to deactivated if customer account has a password', async () => {
    const { customerId, email } = await createCustomerAndIdentity(
      'James',
      'Doe',
      'jamesdoe@gmail.com',
      'JamesD0ePa$$',
      'active',
      [{ identityId: '493285792423287429704372084', provider: 'google' }],
    );

    const jwt = authService.generateJwt(email.email, 'google');

    const response = await request
      .patch(`${BASE_URL}/close`)
      .send({ provider: 'google' })
      .auth(jwt, { type: 'bearer' });

    expect(response.status).toBe(200);

    const c = await Customer.findByPk(customerId, { raw });
    expect(c?.status).toBe('deactivated');

    const identities = await CustomerIdentity.findAll({
      where: { customerId },
      raw,
    });
    expect(identities.length).toBe(0);
  });

  it('should delete customer if account does not have a password', async () => {
    const { customerId, email } = await createCustomerAndIdentity(
      'Jairo',
      'Doe',
      'jairodoe@gmail.com',
      null,
      'active',
      [{ identityId: '84537482657274892684232', provider: 'google' }],
    );

    const jwt = authService.generateJwt(email.email, 'google');

    const response = await request
      .patch(`${BASE_URL}/close`)
      .send({ provider: 'google' })
      .auth(jwt, { type: 'bearer' });

    expect(response.status).toBe(200);

    const c = await Customer.findByPk(customerId, { raw });
    expect(c).not.toBeNull();

    const a = await CustomerEmail.findByPk(customerId, { raw });
    expect(a).toBeNull();

    const identities = await CustomerIdentity.findAll({
      where: { customerId },
      raw,
    });
    expect(identities.length).toBe(0);
  });
});
