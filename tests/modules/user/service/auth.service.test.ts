import { sign } from 'jsonwebtoken';

import {
  AuthOTP,
  ProviderType,
  User,
  UserAccount,
  UserIdentity,
} from '@user/models';
import authService, {
  createUserAndUserIdentity,
  createUserIdentityForUser,
} from '@user/services/auth.service';

import {
  createUserAccount,
  createUserAccountAndIdentity,
} from 'tests/modules/user/helper-functions';

import 'tests/modules/user/user.mock.db';

describe('Auth service', () => {
  describe('generate JWT token', () => {
    let userId: number;

    beforeAll(async () => {
      const { user } = await createUserAccount(
        'Janice',
        'Doe',
        'janicedoe@gmail.com',
        'janiceD0epas$$',
        'active',
        [1],
      );
      userId = user.userId;
    });

    it('should generate a token for email', async () => {
      const token = authService.generateJWT(userId, 'email');
      expect(token).toBeDefined();

      const decoded = sign(
        { userId, provider: 'email' },
        `${process.env.JWT_SECRET}`,
        { expiresIn: '1 day' },
      );

      expect(token).toEqual(decoded);
    });

    it('should generate a token for google', async () => {
      const token = authService.generateJWT(userId, 'google');
      expect(token).toBeDefined();

      const decoded = sign(
        { userId, provider: 'google' },
        `${process.env.JWT_SECRET}`,
        { expiresIn: '1 day' },
      );

      expect(token).toEqual(decoded);
    });

    it('should generate a token for facebook', async () => {
      const token = authService.generateJWT(userId, 'facebook');
      expect(token).toBeDefined();

      const decoded = sign(
        { userId, provider: 'facebook' },
        `${process.env.JWT_SECRET}`,
        { expiresIn: '1 day' },
      );

      expect(token).toEqual(decoded);
    });
  });

  describe('get user data', () => {
    it('should return user data when provider is email', async () => {
      const { userId, user, account } = await createUserAccount(
        'Jacinto',
        'Doe',
        'jacintodoe@gmail.com',
        'jacD0epa$$',
        'active',
        [1],
      );

      const result = await authService.getUserData(userId, 'email');

      expect(result?.userId).toBe(userId);
      expect(result?.firstName).toBe(user.firstName);
      expect(result?.lastName).toBe(user.lastName);
      expect(result?.email).toBe(account.email);
      expect(result?.roles.length).toBe(1);
      expect(result?.roles).toMatchObject(['customer']);
    });

    it('should return user data when provider is google', async () => {
      const { userId, user, account } = await createUserAccountAndIdentity(
        'Juana',
        'Doe',
        'juanadoe@gmail.com',
        null,
        'active',
        [{ identityId: '9043859372838624', provider: 'google' }],
        [2, 3],
      );

      const result = await authService.getUserData(userId, 'google');

      expect(result?.userId).toBe(userId);
      expect(result?.firstName).toBe(user.firstName);
      expect(result?.lastName).toBe(user.lastName);
      expect(result?.email).toBe(account.email);
      expect(result?.roles.length).toBe(2);
      expect(result?.roles).toMatchObject([
        'delivery driver',
        'customer service representative',
      ]);
    });

    it('should return undefined if user does not exist', async () => {
      let result = await authService.getUserData(1000, 'email');
      expect(result).not.toBeDefined();

      result = await authService.getUserData(1000, 'google');
      expect(result).not.toBeDefined();
    });
  });

  describe('get user data from identity', () => {
    it('should return user data if user with identity id and provider type exists', async () => {
      const identityId = '5732021949727250724';
      const provider = 'facebook';

      const { userId, user, account } = await createUserAccountAndIdentity(
        'Juan',
        'Doe',
        'juandoe@gmail.com',
        null,
        'active',
        [{ identityId, provider }],
        [4, 5],
      );

      const result = await authService.getUserDataFromIdentity(
        identityId,
        provider,
      );

      expect(result?.userId).toBe(userId);
      expect(result?.firstName).toBe(user.firstName);
      expect(result?.lastName).toBe(user.lastName);
      expect(result?.email).toBe(account.email);
      expect(result?.roles.length).toBe(2);
      expect(result?.roles).toMatchObject(['manager', 'super admin']);
    });

    it('should return undefined if user with identity id and provider type does not exists', async () => {
      const result = await authService.getUserDataFromIdentity(
        '100032049298741',
        'facebook',
      );
      expect(result).not.toBeDefined();
    });
  });

  describe('get account', () => {
    it('should return account', async () => {
      const email = 'jazzdoe@gmail.com';
      const password = 'jazzD0ePa$$';

      await createUserAccount('Jazz', 'Doe', email, password, 'active', [1]);

      const account = await authService.getAccount(email);
      expect(account).not.toBeNull();
      expect(account?.comparePasswords(password)).toBe(true);
    });

    it('should return null for non-existent account', async () => {
      const account = await authService.getAccount('false@gmail.com');
      expect(account).toBeNull();
    });
  });

  describe('get identity', () => {
    it('should return identity', async () => {
      const identityId = '93248271642884';
      const provider = 'google';

      const { userId } = await createUserAccountAndIdentity(
        'Juanita',
        'Doe',
        'juanitadoe@gmail.com',
        null,
        'active',
        [{ identityId, provider }],
        [1],
      );

      const identity = await authService.getIdentity(identityId, provider);

      expect(identity).not.toBeNull();
      expect(identity?.identityId).toBe(identityId);
      expect(identity?.provider).toBe(provider);
      expect(identity?.userId).toBe(userId);
    });

    it('should return null for non-existent identity', async () => {
      const i = await authService.getIdentity('1000424242424', 'google');
      expect(i).toBeNull();
    });
  });

  describe('create new identity', () => {
    it('should create user identity for an existing user account', async () => {
      const identityId = '12324534675';
      const provider = 'google';

      const { userId, user, account } = await createUserAccount(
        'Jasmine',
        'Doe',
        'jasminedoe@gmail.com',
        'jasD0epa$$',
        'active',
        [1],
      );

      const identity = await authService.createNewIdentity(
        identityId,
        account,
        user.firstName,
        user.lastName,
        account.email,
        provider,
      );

      expect(identity.identityId).toBe(identityId);
      expect(identity.userId).toBe(userId);
      expect(identity.provider).toBe(provider);

      const i = await UserIdentity.findOne({
        where: { identityId, provider, userId },
      });
      expect(i).not.toBeNull();
    });

    it('should create a new user and user identity for new user', async () => {
      const identityId = '4309372642830289974';
      const email = 'jerichodoe@gmail.com';
      const firstName = 'Jericho';
      const lastName = 'Doe';
      const provider = 'google' as ProviderType;

      let u = await User.findOne({ where: { firstName, lastName } });
      expect(u).toBeNull();

      const identity = await authService.createNewIdentity(
        identityId,
        null,
        firstName,
        lastName,
        email,
        provider,
      );

      expect(identity.identityId).toBe(identityId);
      expect(identity.provider).toBe(provider);

      u = await User.findOne({ where: { firstName, lastName } });
      expect(u).not.toBeNull();

      const i = await UserIdentity.findOne({
        where: { identityId, provider, userId: u?.userId },
      });
      expect(i).not.toBeNull();
    });
  });

  describe('create user identity for user', () => {
    it('should create user identity for user and change account status to active', async () => {
      const status = 'pending';

      const { userId } = await createUserAccount(
        'James',
        'Doe',
        'jamesdoe@gmail.com',
        'jamesD0epa$$',
        status,
        [1],
      );

      const identityId = '923849719836872649';
      const provider = 'google';

      const result = await createUserIdentityForUser(
        identityId,
        userId,
        status,
        provider,
      );
      expect(result.identityId).toBe(identityId);

      const i = UserIdentity.findOne({ where: { userId, provider } });
      expect(i).not.toBeNull();

      const a = await UserAccount.findOne({
        where: { userId, status: 'active' },
      });
      expect(a).not.toBeNull();
    });

    it('should roll back transaction on error', async () => {
      const status = 'pending';

      const { userId } = await createUserAccount(
        'Jameson',
        'Doe',
        'jamesondoe@gmail.com',
        'JamesonD0epa$$',
        status,
        [1],
      );

      const identityId = '98979675654556756687';

      const { create } = UserIdentity;
      UserIdentity.create = jest.fn().mockRejectedValue(new Error('Error'));

      try {
        await createUserIdentityForUser(identityId, userId, status, 'google');

        expect(false).toBe(true);
      } catch (e) {
        const a = await UserAccount.findOne({ where: { userId, status } });
        expect(a).not.toBeNull();
      }

      UserIdentity.create = create;
    });
  });

  describe('create user and user identity', () => {
    it('should create user, user account, and user identity', async () => {
      const identityId = '98098976576567';
      const firstName = 'Jamal';
      const lastName = 'Doe';
      const email = 'jamaldoe@gmail.com';

      let u = await User.findOne({ where: { firstName, lastName } });
      expect(u).toBeNull();

      let a = await UserAccount.findOne({ where: { email } });
      expect(a).toBeNull();

      const result = await createUserAndUserIdentity(
        identityId,
        firstName,
        lastName,
        email,
        'google',
      );

      expect(result.identityId).toBe(identityId);

      u = await User.findOne({ where: { firstName, lastName } });
      expect(u).not.toBeNull();

      a = await UserAccount.findOne({
        where: { userId: u?.userId, email, status: 'active' },
      });
      expect(a).not.toBeNull();

      const i = await UserIdentity.findOne({ where: { identityId } });
      expect(i).not.toBeNull();
    });

    it('should roll back transaction on error', async () => {
      const identityId = '98098976576567';

      const firstName = 'Jones';
      const lastName = 'Doe';

      const { create } = UserIdentity;
      UserIdentity.create = jest.fn().mockRejectedValue(new Error('Error'));

      try {
        await createUserAndUserIdentity(
          identityId,
          firstName,
          lastName,
          'jonesdoe@gmail.com',
          'google',
        );

        expect(false).toBe(true);
      } catch (e) {
        const u = await User.findOne({ where: { firstName, lastName } });
        expect(u).toBeNull();
      }

      UserIdentity.create = create;
    });
  });

  describe('create user', () => {
    it('should successfully create a user, user account, and verify otp', async () => {
      const result = await authService.createUser(
        'Jacqueline',
        'Doe',
        'jacquelinedoe@gmail.com',
        'jacqueD0epas$$',
      );

      expect(result.user).toBeDefined();
      expect(result.account).toBeDefined();

      const user = await User.findByPk(result.user.userId);
      const account = await UserAccount.findByPk(result.account.userId);

      expect(user).not.toBeNull();
      expect(account).not.toBeNull();
      expect(user?.userId).toBe(account?.userId);

      const otp = await AuthOTP.findOne({
        where: { userId: user?.userId, type: 'verify' },
      });

      expect(otp).not.toBeNull();
    });

    it('should rollback the transaction on error', async () => {
      const firstName = 'Jackie';
      const lastName = 'Doe';
      const email = 'jackiedoe@gmail.com';
      const password = 'jackieD0epas$$';

      const { create } = UserAccount;
      UserAccount.create = jest.fn().mockRejectedValue(new Error('Mock Error'));

      try {
        await authService.createUser(firstName, lastName, email, password);

        expect(true).toBe(false);
      } catch (e) {
        const user = await User.findOne({ where: { firstName, lastName } });
        const account = await UserAccount.findOne({ where: { email } });

        expect(user).toBeNull();
        expect(account).toBeNull();
      }

      UserAccount.create = create;
    });
  });

  describe('login', () => {
    it('should login user on valid data', async () => {
      const email = 'jandoe@gmail.com';
      const password = 'janD0epas$$';

      const { userId } = await createUserAccount(
        'Jan',
        'Doe',
        email,
        password,
        'active',
        [1],
      );

      const { account, isUser } = await authService.loginUser(email, password);

      expect(account).not.toBeNull();
      expect(account?.userId).toBe(userId);
      expect(isUser).toBe(true);
    });

    it('should fail login with wrong password', async () => {
      const email = 'jandoe@gmail.com';
      const { account, isUser } = await authService.loginUser(email, '123');

      expect(isUser).toBe(false);
      expect(account).toBe(null);
    });

    it('should fail login if user account password is null', async () => {
      const email = 'jaffdoe@gmail.com';

      const { account: a } = await createUserAccount(
        'Jeff',
        'Doe',
        email,
        null,
        'active',
        [1],
      );

      expect(a.password).toBeNull();

      const { account, isUser } = await authService.loginUser(
        email,
        'jazzd0ePa$$',
      );

      expect(account).toBe(null);
      expect(isUser).toBe(false);
    });
  });

  describe('recover password otp', () => {
    let userId: number;

    beforeAll(async () => {
      const user = await createUserAccount(
        'Jack',
        'Doe',
        'jackdoe@gmail.com',
        'jackD0epas$$',
        'active',
        [1],
      );

      userId = user.userId;
    });

    it('should recover the password successfully', async () => {
      const newPassword = 'newD0epa$$word';

      await authService.recoverPassword(userId, newPassword);

      const account = await UserAccount.findOne({ where: { userId } });

      expect(account?.comparePasswords(newPassword)).toBe(true);
    });

    it('should rollback the transaction on error', async () => {
      await AuthOTP.create({
        userId,
        type: 'recover',
        password: AuthOTP.generatePassword(),
        expiresAt: AuthOTP.getExpiration(),
      });

      const { update } = UserAccount;
      UserAccount.update = jest.fn().mockRejectedValue(new Error('Mock Error'));

      try {
        await authService.recoverPassword(userId, 'newPassword123');

        expect(false).toBe(true);
      } catch (e) {
        const otp = await AuthOTP.findOne({
          where: { userId, type: 'recover' },
        });

        expect(otp).not.toBeNull();
      }

      UserAccount.update = update;
    });
  });

  describe('reactivate', () => {
    let userId: number;

    beforeAll(async () => {
      const { user } = await createUserAccount(
        'Jery',
        'Doe',
        'jerydoe@gmail.com',
        'jerryD0ePa$$',
        'inactive',
        [1],
      );

      userId = user.userId;
    });

    it('should update status', async () => {
      let account = await UserAccount.findByPk(userId);
      expect(account?.status).toBe('inactive');

      const result = await authService.reactivate(userId);
      expect(result[0]).toBe(1);

      account = await UserAccount.findByPk(userId);
      expect(account?.status).toBe('active');
    });
  });
});
