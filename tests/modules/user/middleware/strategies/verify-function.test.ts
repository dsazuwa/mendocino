import { Profile } from 'passport';

import ApiError from '@utils/api-error';

import verifyFunction from '@user/middleware/strategies/verify-function';
import { ProviderType, User, UserAccount, UserIdentity } from '@user/models';
import authService from '@user/services/auth.service';
import messages from '@user/utils/messages';

import 'tests/db-setup';

describe('Verify Function', () => {
  const done = jest.fn();

  const callVerify = async (
    id: string,
    firsName: string,
    lastName: string,
    email: string,
    providerType: ProviderType,
  ) => {
    const profile = {
      id,
      emails: [{ value: email }],
      name: { givenName: firsName, familyName: lastName },
    } as unknown as Profile;

    await verifyFunction(profile, done, providerType);
  };

  it('should create user if user does not exists', async () => {
    const id = '213254657845231';
    const firstName = 'Joseph';
    const lastName = 'Doe';
    const email = 'josephdoe@gmail.com';

    expect(
      User.findOne({ where: { firstName, lastName } }),
    ).resolves.toBeNull();
    expect(UserAccount.findOne({ where: { email } })).resolves.toBeNull();
    expect(UserIdentity.findOne({ where: { id } })).resolves.toBeNull();

    await callVerify(id, firstName, lastName, email, 'google');

    const u = await User.findOne({ where: { firstName, lastName } });
    expect(u).not.toBeNull();

    const a = await UserAccount.findOne({ where: { email } });
    expect(a).not.toBeNull();
    expect(a?.password).toBe(null);

    expect(
      UserIdentity.findOne({
        where: { id, userId: u?.userId, providerType: 'google' },
      }),
    ).resolves.not.toBeNull();
  });

  it('should create new identity if User Account exists (active) but User Identity does not', async () => {
    const id = '242739758613728489';
    const firstName = 'Jacquelin';
    const lastName = 'Doe';
    const email = 'jacquelindoe@gmail.com';
    const password = 'jacqD0ePa$$';

    const { userId } = await User.create({ firstName, lastName });
    await UserAccount.create({ userId, email, password, status: 'active' });

    expect(UserIdentity.findOne({ where: { id, userId } })).resolves.toBeNull();

    await callVerify(id, firstName, lastName, email, 'facebook');

    expect(
      UserIdentity.findOne({ where: { id, userId, providerType: 'facebook' } }),
    ).resolves.not.toBeNull();
  });

  it('should create new identity if User Account exists (pending) but User Identity does not', async () => {
    const id = '53849274264293027498';
    const firstName = 'Jean';
    const lastName = 'Doe';
    const email = 'jeandoe@gmail.com';
    const password = 'jeanD0ePa$$';

    const { userId } = await User.create({ firstName, lastName });
    await UserAccount.create({ userId, email, password, status: 'pending' });

    expect(UserIdentity.findOne({ where: { id, userId } })).resolves.toBeNull();

    await callVerify(id, firstName, lastName, email, 'facebook');

    expect(
      UserIdentity.findOne({ where: { id, userId, providerType: 'facebook' } }),
    ).resolves.not.toBeNull();

    const a = await UserAccount.findByPk(userId);
    expect(a?.status).toBe('active');
  });

  it('should "login" user if both User Account and User Identity exists', async () => {
    const id = '583683462429535730';
    const firstName = 'Jules';
    const lastName = 'Doe';
    const email = 'julesdoe@gmail.com';
    const password = 'julesD0ePa$$';

    const { userId } = await User.create({ firstName, lastName });
    await UserAccount.create({ userId, email, password });
    await UserIdentity.create({ userId, id, providerType: 'google' });

    const { createNewIdentity } = authService;
    const c = jest.fn();
    authService.createNewIdentity = c;

    await callVerify(id, firstName, lastName, email, 'google');

    expect(c).not.toHaveBeenCalled();
    authService.createNewIdentity = createNewIdentity;
  });

  it('should return an error if User Account exists (inactive)', async () => {
    const id = '6988232978752892';
    const firstName = 'Jacquet';
    const lastName = 'Doe';
    const email = 'jacquetdoe@gmail.com';
    const password = 'jacquetD0ePa$$';

    const { userId } = await User.create({ firstName, lastName });
    await UserAccount.create({ userId, email, password, status: 'inactive' });

    expect(UserIdentity.findOne({ where: { id, userId } })).resolves.toBeNull();

    await callVerify(id, firstName, lastName, email, 'google');

    expect(done).toHaveBeenLastCalledWith(
      ApiError.unauthorized(messages.ERR_DEACTIVATED_ACCOUNT),
      undefined,
    );
  });
});
