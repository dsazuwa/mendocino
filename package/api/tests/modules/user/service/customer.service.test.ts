import {
  Customer,
  CustomerEmail,
  CustomerIdentity,
  CustomerOTP,
  CustomerPassword,
  CustomerPhone,
  Email,
  Phone,
} from '@app/modules/user/models';
import customerService from '@app/modules/user/services/customer.service';

import { createCustomer, createCustomerAndIdentity } from '../helper-functions';

import 'tests/db-setup';

describe('get customer profile', () => {
  const firstName = 'Jino';
  const lastName = 'Doe';
  const email = 'jinodoe@gmail.com';
  const password = 'JinoD0ePa$$';
  const phoneNumber = '9161710361';

  beforeEach(async () => {
    await Customer.destroy({ where: {} });
    await Email.destroy({ where: {} });
    await Phone.destroy({ where: {} });
  });

  it('customer does not exist', async () => {
    const result = await customerService.getProfile(1234);
    expect(result).toBeNull();
  });

  it('customer with account password, user identities, but no phone or address', async () => {
    const { customerId } = await createCustomerAndIdentity(
      firstName,
      lastName,
      email,
      password,
      'active',
      [
        { identityId: '4247902749786824', provider: 'google' },
        { identityId: '2487713797204', provider: 'facebook' },
      ],
    );

    const result = await customerService.getProfile(customerId);
    expect(result).toMatchObject({
      firstName,
      lastName,
      email: { address: email, isVerified: true },
      hasPassword: true,
      authProviders: ['google', 'facebook'],
      phone: { number: null, isVerified: false },
      addresses: null,
    });
  });

  it('customer with identities but no account password, phone or address', async () => {
    const { customerId } = await createCustomerAndIdentity(
      firstName,
      lastName,
      email,
      null,
      'active',
      [
        { identityId: '4247902749786824', provider: 'google' },
        { identityId: '2487713797204', provider: 'facebook' },
      ],
    );

    const result = await customerService.getProfile(customerId);
    expect(result).toMatchObject({
      firstName,
      lastName,
      email: { address: email, isVerified: true },
      hasPassword: false,
      authProviders: ['google', 'facebook'],
      phone: { number: null, isVerified: false },
      addresses: null,
    });
  });

  it('customer with phone number', async () => {
    const { customerId } = await createCustomer(
      firstName,
      lastName,
      email,
      password,
      'pending',
    );

    const { phoneId } = await Phone.create({ phoneNumber });
    await CustomerPhone.create({ customerId, phoneId, status: 'pending' });

    let result = await customerService.getProfile(customerId);
    expect(result).toMatchObject({
      firstName,
      lastName,
      email: { address: email, isVerified: false },
      hasPassword: true,
      authProviders: [],
      phone: { number: phoneNumber, isVerified: false },
      addresses: null,
    });

    await CustomerPhone.update(
      { status: 'active' },
      { where: { customerId, phoneId } },
    );

    result = await customerService.getProfile(customerId);
    expect(result).toMatchObject({
      firstName,
      lastName,
      email: { address: email, isVerified: false },
      hasPassword: true,
      authProviders: [],
      phone: { number: phoneNumber, isVerified: true },
      addresses: null,
    });
  });
});

describe('verify email', () => {
  it('should verify the email', async () => {
    const { customerId } = await createCustomer(
      'Jo',
      'Doe',
      'jodoe@gmail.com',
      'joD0ePa$$',
      'pending',
    );

    await customerService.verifyEmail(customerId);

    const otp = await CustomerOTP.findOne({
      where: { customerId, type: 'email' },
      raw: true,
    });
    expect(otp).toBeNull();

    const customer = await Customer.findOne({
      where: { customerId, status: 'active' },
      raw: true,
    });
    expect(customer).not.toBeNull();
  });
});

describe('create password', () => {
  it('should create password if user password is null', async () => {
    const { customerId } = await createCustomerAndIdentity(
      'Josephine',
      'Doe',
      'josephinedoe@gmail.com',
      null,
      'active',
      [{ identityId: '923042892739426871638', provider: 'google' }],
    );
    const password = 'josephineD0ePa$$';

    const result = await customerService.createPassword(customerId, password);
    expect(result).toBe(true);

    const retrievedPassword = await CustomerPassword.findByPk(customerId);
    expect(
      CustomerPassword.comparePasswords(
        password,
        retrievedPassword?.password || '',
      ),
    ).toBe(true);
  });

  it('should not create password if user password is not null', async () => {
    const { customerId } = await createCustomer(
      'Julie',
      'Doe',
      'juliedoe@gmail.com',
      'julieD0ePa$$',
      'active',
    );
    const newPassword = 'newjulieD0ePa$$';

    const result = await customerService.createPassword(
      customerId,
      newPassword,
    );
    expect(result).toBe(false);

    const retrievedPassword = await CustomerPassword.findByPk(customerId);
    expect(
      CustomerPassword.comparePasswords(
        newPassword,
        retrievedPassword?.password || '',
      ),
    ).toBe(false);
  });
});

describe('change password', () => {
  it('should change password and return true for valid customerId', async () => {
    const password = 'jeanD0epa$$';
    const newPassword = 'newjeanD0epa$$';

    const { customerId } = await createCustomer(
      'Jean Paul',
      'Doe',
      'jeanpauldoe@gmail.com',
      password,
      'active',
    );

    const result = await customerService.changePassword(
      customerId,
      password,
      newPassword,
    );
    expect(result).toBe(true);

    const retrievedPassword = await CustomerPassword.findOne({
      where: { customerId },
    });
    expect(
      CustomerPassword.comparePasswords(
        newPassword,
        retrievedPassword?.password || '',
      ),
    ).toBe(true);
  });

  it('should return false for wrong current password', async () => {
    const password = 'julietteD0epa$$';
    const newPassword = 'newjeanD0epa$$';

    const { customerId } = await createCustomer(
      'Juliette',
      'Doe',
      'juliettepauldoe@gmail.com',
      password,
      'active',
    );

    const result = await customerService.changePassword(
      customerId,
      newPassword,
      newPassword,
    );

    expect(result).toBe(false);

    const retrievedPassword = await CustomerPassword.findOne({
      where: { customerId },
    });
    const hashed = retrievedPassword?.password || '';

    expect(CustomerPassword.comparePasswords(newPassword, hashed)).toBe(false);
    expect(CustomerPassword.comparePasswords(password, hashed)).toBe(true);
  });

  it('should return false if user_account password is null', async () => {
    const newPassword = 'newjolieD0epa$$';

    const { customerId } = await createCustomerAndIdentity(
      'Jolie',
      'Doe',
      'joliepauldoe@gmail.com',
      null,
      'active',
      [{ identityId: '2343256478656532', provider: 'facebook' }],
    );

    const result = await customerService.changePassword(
      customerId,
      'somePassword',
      newPassword,
    );

    expect(result).toBe(false);

    const retrievedPassword = await CustomerPassword.findOne({
      where: { customerId },
    });
    expect(retrievedPassword).toBeNull();
  });

  it('should return false for invalid customerId', async () => {
    const result = await customerService.changePassword(
      10000,
      'wrongOldPassword',
      'newpassword',
    );

    expect(result).toBe(false);
  });
});

describe('revoke social authentication', () => {
  it('should delete identity if user has an account with a password', async () => {
    const provider = 'google';

    const { customerId } = await createCustomerAndIdentity(
      'Jessica',
      'Doe',
      'jessicadoe@gmail.com',
      'jessicaD0ePa$$',
      'active',
      [{ identityId: '3654755345356474363', provider }],
    );

    const { result, switchTo } =
      await customerService.revokeSocialAuthentication(customerId, provider);

    expect(result).toBe(true);
    expect(switchTo).toBe('email');

    const i = await CustomerIdentity.findOne({
      where: { customerId, provider },
      raw: true,
    });
    expect(i).toBeNull();

    const a = await CustomerEmail.findByPk(customerId, { raw: true });
    expect(a).not.toBeNull();

    const c = await Customer.findByPk(customerId, { raw: true });
    expect(c).not.toBeNull();
  });

  it('should delete identity if user has no account with password but other identities', async () => {
    const { customerId } = await createCustomerAndIdentity(
      'Jack',
      'Doe',
      'jackdoe@gmail.com',
      null,
      'active',
      [
        { identityId: '52429584297428924', provider: 'google' },
        { identityId: '58991388923428739', provider: 'facebook' },
      ],
    );

    const { result, switchTo } =
      await customerService.revokeSocialAuthentication(customerId, 'facebook');
    expect(result).toBe(true);
    expect(switchTo).toBe('google');

    let i = await CustomerIdentity.findOne({
      where: { customerId, provider: 'facebook' },
      raw: true,
    });
    expect(i).toBeNull();

    i = await CustomerIdentity.findOne({
      where: { customerId, provider: 'google' },
      raw: true,
    });
    expect(i).not.toBeNull();

    const a = await CustomerEmail.findByPk(customerId, { raw: true });
    expect(a).not.toBeNull();

    const c = await Customer.findByPk(customerId, { raw: true });
    expect(c).not.toBeNull();
  });

  it('should return false if user has neither an account with a password nor anothor identitiy', async () => {
    const provider = 'google';

    const { customerId } = await createCustomerAndIdentity(
      'Jess',
      'Doe',
      'jessdoe@gmail.com',
      null,
      'active',
      [{ identityId: '94044248328749827', provider }],
    );

    const { result, switchTo } =
      await customerService.revokeSocialAuthentication(customerId, provider);

    expect(result).toBe(false);
    expect(switchTo).toBeUndefined();

    const i = await CustomerIdentity.findOne({
      where: { customerId, provider },
      raw: true,
    });
    expect(i).not.toBeNull();

    const a = await CustomerEmail.findByPk(customerId, { raw: true });
    expect(a).not.toBeNull();

    const c = await Customer.findByPk(customerId, { raw: true });
    expect(c).not.toBeNull();
  });

  it('should return false if user does not exist', async () => {
    const { result, switchTo } =
      await customerService.revokeSocialAuthentication(-1, 'google');

    expect(result).toBe(false);
    expect(switchTo).toBeUndefined();
  });
});

describe('close account', () => {
  it('should deactivate account if user has an account password', async () => {
    const { customerId } = await createCustomerAndIdentity(
      'Jeff',
      'Doe',
      'jeffdoe@gmail.com',
      'jeffD0ePa$$',
      'active',
      [{ identityId: '2435674867433235', provider: 'google' }],
    );

    await customerService.closeAccount(customerId);

    const i = await CustomerIdentity.findOne({
      where: { customerId },
      raw: true,
    });
    expect(i).toBeNull();

    const a = await CustomerEmail.findByPk(customerId, { raw: true });
    expect(a).not.toBeNull();

    const u = await Customer.findByPk(customerId, { raw: true });
    expect(u).not.toBeNull();
  });

  it('should delete most customer details if they do not have a password', async () => {
    const { customerId } = await createCustomerAndIdentity(
      'James',
      'Doe',
      'jamesdoe@gmail.com',
      null,
      'active',
      [{ identityId: '23274274781623876298', provider: 'google' }],
    );
    const phoneNumber = '1234567890';

    const { phoneId } = await Phone.create({ phoneNumber });
    await CustomerPhone.create({ customerId, phoneId, status: 'active' });

    await customerService.closeAccount(customerId);

    const p = await Phone.findOne({
      where: { phoneId, phoneNumber },
      raw: true,
    });
    expect(p).toBeNull();

    const i = await CustomerIdentity.findOne({
      where: { customerId },
      raw: true,
    });
    expect(i).toBeNull();

    const a = await CustomerEmail.findByPk(customerId, { raw: true });
    expect(a).toBeNull();

    const c = await Customer.findByPk(customerId, { raw: true });
    expect(c).not.toBeNull();
  });
});
