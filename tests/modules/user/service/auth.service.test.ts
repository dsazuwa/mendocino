import { sign } from 'jsonwebtoken';

import { AuthOTP, User, UserAccount, UserIdentity } from '@user/models';
import authService from '@user/services/auth.service';
import { roleConstants } from '@user/utils/constants';

import {
  createUserAccount,
  createUserAccountAndIdentity,
} from 'tests/modules/user/helper-functions';

import 'tests/modules/user/user.mock.db';

const raw = true;

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
        [roleConstants.CUSTOMER.roleId],
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
      const { CUSTOMER } = roleConstants;

      const { userId, user, account } = await createUserAccount(
        'Jacinto',
        'Doe',
        'jacintodoe@gmail.com',
        'jacD0epa$$',
        'active',
        [CUSTOMER.roleId],
      );

      const result = await authService.getUserData(userId, 'email');
      expect(result).toMatchObject({
        userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: account.email,
        status: account.status,
        roles: [CUSTOMER.name],
      });
    });

    it('should return user data when provider is google', async () => {
      const { MANAGER, DELIVERY_DRIVER } = roleConstants;

      const { userId, user, account } = await createUserAccountAndIdentity(
        'Juana',
        'Doe',
        'juanadoe@gmail.com',
        null,
        'active',
        [{ identityId: '9043859372838624', provider: 'google' }],
        [DELIVERY_DRIVER.roleId, MANAGER.roleId],
      );

      const result = await authService.getUserData(userId, 'google');
      expect(result).toMatchObject({
        userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: account.email,
        status: account.status,
        roles: [DELIVERY_DRIVER.name, MANAGER.name],
      });
    });

    it('should return undefined if user does not exist', async () => {
      let result = await authService.getUserData(1000, 'email');
      expect(result).not.toBeDefined();

      result = await authService.getUserData(1000, 'google');
      expect(result).not.toBeDefined();
    });
  });

  describe('get user data for social authentication', () => {
    it('should return user data if user with identity id and provider type exists', async () => {
      const identityId = '97427987429868742642';
      const provider = 'facebook';

      const { user: u, account } = await createUserAccountAndIdentity(
        'Juni',
        'Doe',
        'junidoe@gmail.com',
        null,
        'active',
        [{ identityId, provider }],
        [roleConstants.CUSTOMER.roleId],
      );

      const { user, userExists, identityExists } =
        await authService.getUserForSocialAuthentication(
          identityId,
          provider,
          account.email,
        );

      expect(userExists).toBe(true);
      expect(identityExists).toBe(true);
      expect(user).toMatchObject({
        userId: u.userId,
        firstName: u.firstName,
        lastName: u.lastName,
        email: account.email,
        status: account.status,
        roles: [roleConstants.CUSTOMER.name],
      });
    });

    it('should return user data if user with email exists but identity does not', async () => {
      const identityId = '85930847728963982469';
      const provider = 'facebook';

      const { user: u, account } = await createUserAccount(
        'June',
        'Die',
        'junedoe@gmail.com',
        null,
        'active',
        [roleConstants.CUSTOMER.roleId],
      );

      const { user, userExists, identityExists } =
        await authService.getUserForSocialAuthentication(
          identityId,
          provider,
          account.email,
        );

      expect(userExists).toBe(true);
      expect(identityExists).toBe(false);
      expect(user).toMatchObject({
        userId: u.userId,
        firstName: u.firstName,
        lastName: u.lastName,
        email: account.email,
        status: account.status,
        roles: [roleConstants.CUSTOMER.name],
      });
    });

    it('should return undefined if user does not exists', async () => {
      const { user, userExists, identityExists } =
        await authService.getUserForSocialAuthentication(
          '693904397428648349',
          'facebook',
          'someemail@gmail.com',
        );

      expect(user).not.toBeDefined();
      expect(userExists).toBe(false);
      expect(identityExists).toBe(false);
    });
  });

  describe('get account', () => {
    it('should return account', async () => {
      const email = 'jazzdoe@gmail.com';
      const password = 'jazzD0ePa$$';

      await createUserAccount('Jazz', 'Doe', email, password, 'active', [
        roleConstants.CUSTOMER.roleId,
      ]);

      let account = await authService.getAccount(email);
      expect(account).not.toBeNull();
      expect(account?.comparePasswords(password)).toBe(true);

      account = await authService.getAccount(email, true);
      expect(account).not.toBeNull();
      expect(account?.comparePasswords).not.toBeDefined();
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
        [roleConstants.CUSTOMER.roleId],
      );

      let identity = await authService.getIdentity(identityId, provider);

      expect(identity).not.toBeNull();
      expect(identity?.identityId).toBe(identityId);
      expect(identity?.provider).toBe(provider);
      expect(identity?.userId).toBe(userId);
      expect(identity?.hasHooks).toBeDefined();

      identity = await authService.getIdentity(identityId, provider, true);

      expect(identity).not.toBeNull();
      expect(identity?.identityId).toBe(identityId);
      expect(identity?.provider).toBe(provider);
      expect(identity?.userId).toBe(userId);
      expect(identity?.hasHooks).not.toBeDefined();
    });

    it('should return null for non-existent identity', async () => {
      const i = await authService.getIdentity('1000424242424', 'google');
      expect(i).toBeNull();
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
        [roleConstants.CUSTOMER.roleId],
      );

      const identityId = '923849719836872649';
      const provider = 'google';

      const result = await authService.createUserIdentityForUser(
        identityId,
        userId,
        status,
        provider,
      );
      expect(result.identityId).toBe(identityId);

      const i = UserIdentity.findOne({ where: { userId, provider }, raw });
      expect(i).not.toBeNull();

      const a = await UserAccount.findOne({
        where: { userId, status: 'active' },
        raw,
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
        [roleConstants.CUSTOMER.roleId],
      );

      const identityId = '98979675654556756687';

      const { create } = UserIdentity;
      UserIdentity.create = jest.fn().mockRejectedValue(new Error('Error'));

      try {
        await authService.createUserIdentityForUser(
          identityId,
          userId,
          status,
          'google',
        );

        expect(false).toBe(true);
      } catch (e) {
        const a = await UserAccount.findOne({ where: { userId, status }, raw });
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

      let u = await User.findOne({ where: { firstName, lastName }, raw });
      expect(u).toBeNull();

      let a = await UserAccount.findOne({ where: { email }, raw });
      expect(a).toBeNull();

      const result = await authService.createUserAndUserIdentity(
        identityId,
        firstName,
        lastName,
        email,
        'google',
      );

      expect(result.identityId).toBe(identityId);

      u = await User.findOne({ where: { firstName, lastName }, raw });
      expect(u).not.toBeNull();

      a = await UserAccount.findOne({
        where: { userId: u?.userId, email, status: 'active' },
        raw,
      });
      expect(a).not.toBeNull();

      const i = await UserIdentity.findOne({ where: { identityId }, raw });
      expect(i).not.toBeNull();
    });

    it('should roll back transaction on error', async () => {
      const identityId = '98098976576567';

      const firstName = 'Jones';
      const lastName = 'Doe';

      const { create } = UserIdentity;
      UserIdentity.create = jest.fn().mockRejectedValue(new Error('Error'));

      try {
        await authService.createUserAndUserIdentity(
          identityId,
          firstName,
          lastName,
          'jonesdoe@gmail.com',
          'google',
        );

        expect(false).toBe(true);
      } catch (e) {
        const u = await User.findOne({ where: { firstName, lastName }, raw });
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

      const user = await User.findByPk(result.user.userId, { raw });
      const account = await UserAccount.findByPk(result.account.userId, {
        raw,
      });

      expect(user).not.toBeNull();
      expect(account).not.toBeNull();
      expect(user?.userId).toBe(account?.userId);

      const otp = await AuthOTP.findOne({
        where: { userId: user?.userId, type: 'verify' },
        raw,
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
        const user = await User.findOne({
          where: { firstName, lastName },
          raw,
        });
        const account = await UserAccount.findOne({ where: { email }, raw });

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
        [roleConstants.CUSTOMER.roleId],
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
        [roleConstants.CUSTOMER.roleId],
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
        [roleConstants.CUSTOMER.roleId],
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
          raw,
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
        [roleConstants.CUSTOMER.roleId],
      );

      userId = user.userId;
    });

    it('should update status', async () => {
      let account = await UserAccount.findByPk(userId, { raw });
      expect(account?.status).toBe('inactive');

      const result = await authService.reactivate(userId);
      expect(result[0]).toBe(1);

      account = await UserAccount.findByPk(userId, { raw });
      expect(account?.status).toBe('active');
    });
  });
});
