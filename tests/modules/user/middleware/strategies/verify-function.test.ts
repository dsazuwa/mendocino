import { Profile } from 'passport';

import ApiError from '@utils/api-error';

import verifyFunction from '@user/middleware/strategies/verify-function';
import { ProviderType, User, UserAccount, UserIdentity } from '@user/models';
import authService from '@user/services/auth.service';
import messages from '@user/utils/messages';

import {
  createUserAccount,
  createUserAccountAndIdentity,
} from 'tests/modules/user/helper-functions';

import 'tests/modules/user/user.mock.db';

describe('Verify Function', () => {
  const done = jest.fn();

  const callVerify = async (
    identityId: string,
    firsName: string,
    lastName: string,
    email: string,
    providerType: ProviderType,
  ) => {
    const profile = {
      id: identityId,
      emails: [{ value: email }],
      name: { givenName: firsName, familyName: lastName },
    } as unknown as Profile;

    await verifyFunction(profile, done, providerType);
  };

  it('should create user if user does not exists', async () => {
    const identityId = '213254657845231';
    const firstName = 'Joseph';
    const lastName = 'Doe';
    const email = 'josephdoe@gmail.com';

    expect(
      User.findOne({ where: { firstName, lastName } }),
    ).resolves.toBeNull();
    expect(UserAccount.findOne({ where: { email } })).resolves.toBeNull();
    expect(UserIdentity.findOne({ where: { identityId } })).resolves.toBeNull();

    await callVerify(identityId, firstName, lastName, email, 'google');

    const u = await User.findOne({ where: { firstName, lastName } });
    expect(u).not.toBeNull();

    const a = await UserAccount.findOne({ where: { email } });
    expect(a).not.toBeNull();
    expect(a?.password).toBe(null);

    expect(
      UserIdentity.findOne({
        where: { identityId, userId: u?.userId, providerType: 'google' },
      }),
    ).resolves.not.toBeNull();
  });

  it('should create new identity if User Account exists (active) but User Identity does not', async () => {
    const identityId = '242739758613728489';
    const firstName = 'Jacquelin';
    const lastName = 'Doe';
    const email = 'jacquelindoe@gmail.com';
    const password = 'jacqD0ePa$$';
    const providerType = 'facebook';

    const { userId } = await createUserAccount(
      firstName,
      lastName,
      email,
      password,
      'active',
      [1],
    );

    let i = await UserIdentity.findOne({ where: { identityId, userId } });
    expect(i).toBeNull();

    await callVerify(identityId, firstName, lastName, email, providerType);

    i = await UserIdentity.findOne({
      where: { identityId, userId, providerType },
    });
    expect(i).not.toBeNull();
  });

  it('should create new identity if User Account exists (pending) but User Identity does not', async () => {
    const identityId = '53849274264293027498';
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
      [1],
    );

    expect(
      UserIdentity.findOne({ where: { identityId, userId } }),
    ).resolves.toBeNull();

    await callVerify(identityId, firstName, lastName, email, 'facebook');

    const i = await UserIdentity.findOne({
      where: { identityId, userId, providerType: 'facebook' },
    });
    expect(i).not.toBeNull();

    const a = await UserAccount.findByPk(userId);
    expect(a?.status).toBe('active');
  });

  it('should "login" user if both User Account and User Identity exists', async () => {
    const identityId = '583683462429535730';
    const firstName = 'Jules';
    const lastName = 'Doe';
    const email = 'julesdoe@gmail.com';
    const password = 'julesD0ePa$$';

    await createUserAccountAndIdentity(
      firstName,
      lastName,
      email,
      password,
      'active',
      [{ identityId, providerType: 'google' }],
      [1],
    );

    const { createNewIdentity } = authService;
    const c = jest.fn();
    authService.createNewIdentity = c;

    await callVerify(identityId, firstName, lastName, email, 'google');

    expect(c).not.toHaveBeenCalled();
    authService.createNewIdentity = createNewIdentity;
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
      [1],
    );

    const i = await UserIdentity.findOne({ where: { identityId, userId } });
    expect(i).toBeNull();

    await callVerify(identityId, firstName, lastName, email, 'google');

    expect(done).toHaveBeenLastCalledWith(
      ApiError.unauthorized(messages.ERR_DEACTIVATED_ACCOUNT),
      undefined,
    );
  });
});
