import { Profile } from 'passport';

import ApiError from '@utils/api-error';

import verifyFunction from '@user/middleware/strategies/verify-function';
import { ProviderType, User, UserAccount, UserIdentity } from '@user/models';
import authService from '@user/services/auth.service';
import { ROLES } from '@user/utils/constants';
import messages from '@user/utils/messages';

import {
  createUserAccount,
  createUserAccountAndIdentity,
} from 'tests/modules/user/helper-functions';

import 'tests/user.db-setup';

const raw = true;

describe('Verify Function', () => {
  const done = jest.fn();

  const callVerify = async (
    identityId: string,
    firstName: string,
    lastName: string,
    email: string,
    provider: ProviderType,
  ) => {
    const profile = {
      id: identityId,
      emails: [{ value: email }],
      name: { givenName: firstName, familyName: lastName },
    } as unknown as Profile;

    await verifyFunction(profile, done, provider);
  };

  it('should create user if user does not exists', async () => {
    const identityId = '213254657845231';
    const provider = 'google';
    const firstName = 'Joseph';
    const lastName = 'Doe';
    const email = 'josephdoe@gmail.com';

    let u = await User.findOne({ where: { firstName, lastName }, raw });
    let a = await UserAccount.findOne({ where: { email }, raw });
    let i = await UserIdentity.findOne({ where: { identityId }, raw });

    expect(u).toBeNull();
    expect(a).toBeNull();
    expect(i).toBeNull();

    await callVerify(identityId, firstName, lastName, email, 'google');

    u = await User.findOne({ where: { firstName, lastName }, raw });
    a = await UserAccount.findOne({ where: { email }, raw });
    i = await UserIdentity.findOne({
      where: { identityId, userId: u?.userId, provider },
      raw,
    });

    expect(u).not.toBeNull();
    expect(a).not.toBeNull();
    expect(a?.password).toBe(null);
    expect(i).not.toBeNull();
  });

  it('should create new identity if User Account exists (active) but User Identity does not', async () => {
    const identityId = '242739758613728489';
    const firstName = 'Jacquelin';
    const lastName = 'Doe';
    const email = 'jacquelindoe@gmail.com';
    const password = 'jacqD0ePa$$';
    const provider = 'facebook';

    const { userId } = await createUserAccount(
      firstName,
      lastName,
      email,
      password,
      'active',
      [ROLES.CUSTOMER.roleId],
    );

    let i = await UserIdentity.findOne({
      where: { identityId, userId },
      raw,
    });
    expect(i).toBeNull();

    await callVerify(identityId, firstName, lastName, email, provider);

    i = await UserIdentity.findOne({
      where: { identityId, userId, provider },
      raw,
    });
    expect(i).not.toBeNull();
  });

  it('should create new identity if User Account exists (pending) but User Identity does not', async () => {
    const identityId = '53849274264293027498';
    const provider = 'facebook';
    const firstName = 'Jean';
    const lastName = 'Doe';
    const email = 'jeandoe@gmail.com';
    const password = 'jeanD0ePa$$';

    const { userId } = await createUserAccount(
      firstName,
      lastName,
      email,
      password,
      'pending',
      [ROLES.CUSTOMER.roleId],
    );

    let a = await UserAccount.findOne({
      where: { userId, status: 'pending' },
      raw,
    });
    let i = await UserIdentity.findOne({
      where: { identityId, userId },
      raw,
    });

    expect(a).not.toBeNull();
    expect(i).toBeNull();

    await callVerify(identityId, firstName, lastName, email, provider);

    a = await UserAccount.findOne({
      where: { userId, status: 'active' },
      raw,
    });
    i = await UserIdentity.findOne({
      where: { identityId, userId, provider },
      raw,
    });

    expect(a).not.toBeNull();
    expect(i).not.toBeNull();
  });

  it('should "login" user if both User Account and User Identity exists', async () => {
    const identityId = '583683462429535730';
    const firstName = 'Jules';
    const lastName = 'Doe';
    const email = 'julesdoe@gmail.com';
    const password = 'julesD0ePa$$';
    const provider = 'google';

    await createUserAccountAndIdentity(
      firstName,
      lastName,
      email,
      password,
      'active',
      [{ identityId, provider }],
    );

    const { createUserAndUserIdentity, createUserIdentityForUser } =
      authService;

    const a = jest.fn();
    const b = jest.fn();

    authService.createUserAndUserIdentity = a;
    authService.createUserIdentityForUser = b;

    await callVerify(identityId, firstName, lastName, email, provider);

    expect(a).not.toHaveBeenCalled();
    expect(b).not.toHaveBeenCalled();

    authService.createUserAndUserIdentity = createUserAndUserIdentity;
    authService.createUserIdentityForUser = createUserIdentityForUser;
  });

  it('should return an error if user exists, but is not a customer', async () => {
    const identityId = '6988232978752892';
    const firstName = 'Jerome';
    const lastName = 'Doe';
    const email = 'jeromedoe@gmail.com';
    const password = 'jeromeD0ePa$$';

    const { userId } = await createUserAccount(
      firstName,
      lastName,
      email,
      password,
      'active',
      [ROLES.SUPER_USER.roleId],
    );

    const i = await UserIdentity.findOne({
      where: { identityId, userId },
      raw,
    });
    expect(i).toBeNull();

    await callVerify(identityId, firstName, lastName, email, 'google');

    expect(done).toHaveBeenLastCalledWith(
      ApiError.unauthorized(messages.ERR_NON_CUSTOMER_THIRD_PARTY_AUTH),
      undefined,
    );
  });

  it('should return an error if User Account exists (inactive)', async () => {
    const identityId = '6988232978752892';
    const firstName = 'Jacquet';
    const lastName = 'Doe';
    const email = 'jacquetdoe@gmail.com';
    const password = 'jacquetD0ePa$$';

    const { userId } = await createUserAccount(
      firstName,
      lastName,
      email,
      password,
      'inactive',
      [ROLES.CUSTOMER.roleId],
    );

    const i = await UserIdentity.findOne({
      where: { identityId, userId },
      raw,
    });
    expect(i).toBeNull();

    await callVerify(identityId, firstName, lastName, email, 'google');

    expect(done).toHaveBeenLastCalledWith(
      ApiError.unauthorized(messages.ERR_DEACTIVATED_ACCOUNT),
      undefined,
    );
  });
});
