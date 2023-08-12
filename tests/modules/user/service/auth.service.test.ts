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

import 'tests/db-setup';

describe('Auth service', () => {
  describe('generate JWT token', () => {
    const userData = {
      firstName: 'Janice',
      lastName: 'Doe',
      email: 'janicedoe@gmail.com',
      password: 'janiceD0epas$$',
    };

    let userId: number;

    beforeAll(async () => {
      const u = await User.create(userData);
      userId = u.userId;

      await UserAccount.create({ userId, ...userData });
    });

    it('should generate a token for email', async () => {
      const token = authService.generateJWT(userId, 'email');
      expect(token).toBeDefined();

      const decoded = sign(
        { userId, providerType: 'email' },
        `${process.env.JWT_SECRET}`,
        { expiresIn: '1 day' },
      );

      expect(token).toEqual(decoded);
    });

    it('should generate a token for google', async () => {
      const token = authService.generateJWT(userId, 'google');
      expect(token).toBeDefined();

      const decoded = sign(
        { userId, providerType: 'google' },
        `${process.env.JWT_SECRET}`,
        { expiresIn: '1 day' },
      );

      expect(token).toEqual(decoded);
    });

    it('should generate a token for facebook', async () => {
      const token = authService.generateJWT(userId, 'facebook');
      expect(token).toBeDefined();

      const decoded = sign(
        { userId, providerType: 'facebook' },
        `${process.env.JWT_SECRET}`,
        { expiresIn: '1 day' },
      );

      expect(token).toEqual(decoded);
    });
  });

  describe('get user from jwt payload', () => {
    it('should return user account when provider is email', async () => {
      const { userId } = await User.create({
        firstName: 'Jacinto',
        lastName: 'Doe',
      });

      const { email, password } = await UserAccount.create({
        userId,
        email: 'jacintodoe@gmail.com',
        password: 'jacD0epa$$',
      });

      const result = await authService.getUserFromJWTPayload('email', userId);

      expect(result).toBeInstanceOf(UserAccount);

      const account = result as UserAccount;

      expect(account.userId).toBe(userId);
      expect(account.email).toBe(email);
      expect(account.password).toBe(password);
    });

    it('should return user identitiy when provider is google', async () => {
      const { userId } = await User.create({
        firstName: 'Juana',
        lastName: 'Doe',
      });

      const { id, providerType } = await UserIdentity.create({
        id: '9043859372838624',
        userId,
        providerType: 'google',
      });

      const result = await authService.getUserFromJWTPayload('google', userId);

      expect(result).toBeInstanceOf(UserIdentity);

      expect(result?.userId).toBe(userId);
      expect((result as UserIdentity).id).toBe(id);
      expect((result as UserIdentity).providerType).toBe(providerType);
    });

    it('should return undefined if user does not exist', async () => {
      let result = await authService.getUserFromJWTPayload('email', 1000);
      expect(result).toBe(undefined);

      result = await authService.getUserFromJWTPayload('google', 1000);
      expect(result).toBe(undefined);
    });
  });

  describe('get account', () => {
    it('should return account', async () => {
      const { userId } = await User.create({
        firstName: 'Jazz',
        lastName: 'Doe',
      });

      const { email } = await UserAccount.create({
        userId,
        email: 'jazzdoe@gmail.com',
        password: 'jazzD0ePa$$',
      });

      const account = await authService.getAccount(email);
      expect(account).not.toBeNull();
    });

    it('should return null for non-existent account', async () => {
      const account = await authService.getAccount('false@gmail.com');
      expect(account).toBeNull();
    });
  });

  describe('get identity', () => {
    it('should return identity', async () => {
      const { userId } = await User.create({
        firstName: 'Juanita',
        lastName: 'Doe',
      });

      const { id, providerType } = await UserIdentity.create({
        id: '93248271642884',
        userId,
        providerType: 'google',
      });

      const identity = await authService.getIdentity(id, providerType);

      expect(identity).not.toBeNull();
      expect(identity?.id).toBe(id);
      expect(identity?.providerType).toBe(providerType);
      expect(identity?.userId).toBe(userId);
    });

    it('should return null for non-existent identity', async () => {
      const i = await authService.getIdentity('1000424242424', 'google');
      expect(i).toBeNull();
    });
  });

  describe('create new identity', () => {
    it('should create user identity for an existing user account', async () => {
      const id = '12324534675';
      const providerType = 'google';
      const firstName = 'Jasmine';
      const lastName = 'Doe';
      const email = 'jasminedoe@gmail.com';

      const { userId } = await User.create({ firstName, lastName });
      const a = await UserAccount.create({
        userId,
        email,
        password: 'jasD0epa$$',
        status: 'active',
      });

      const identity = await authService.createNewIdentity(
        id,
        a,
        firstName,
        lastName,
        email,
        providerType,
      );

      expect(identity.id).toBe(id);
      expect(identity.userId).toBe(userId);
      expect(identity.providerType).toBe(providerType);

      const i = await UserIdentity.findOne({
        where: { id, providerType, userId },
      });
      expect(i).not.toBeNull();
    });

    it('should create a new user and user identity for new user', async () => {
      const id = '4309372642830289974';
      const email = 'jerichodoe@gmail.com';
      const firstName = 'Jericho';
      const lastName = 'Doe';
      const providerType = 'google' as ProviderType;

      let u = await User.findOne({ where: { firstName, lastName } });
      expect(u).toBeNull();

      const identity = await authService.createNewIdentity(
        id,
        null,
        firstName,
        lastName,
        email,
        providerType,
      );

      expect(identity.id).toBe(id);
      expect(identity.providerType).toBe(providerType);

      u = await User.findOne({ where: { firstName, lastName } });
      expect(u).not.toBeNull();

      const i = await UserIdentity.findOne({
        where: { id, providerType, userId: u?.userId },
      });
      expect(i).not.toBeNull();
    });
  });

  describe('create user identity for user', () => {
    it('should create user identity for user and change account status to active', async () => {
      const { userId } = await User.create({
        firstName: 'James',
        lastName: 'Doe',
      });

      await UserAccount.create({
        userId,
        email: 'jamesdoe@gmail.com',
        password: 'JamesD0epa$$',
        status: 'pending',
      });

      const id = '923849719836872649';
      const providerType = 'google';

      const result = await createUserIdentityForUser(
        id,
        userId,
        'pending',
        providerType,
      );
      expect(result.id).toBe(id);

      const i = UserIdentity.findOne({ where: { userId, providerType } });
      expect(i).not.toBeNull();

      const a = await UserAccount.findOne({
        where: { userId, status: 'active' },
      });
      expect(a).not.toBeNull();
    });

    it('should roll back transaction on error', async () => {
      const { userId } = await User.create({
        firstName: 'Jameson',
        lastName: 'Doe',
      });

      const { status } = await UserAccount.create({
        userId,
        email: 'jamesondoe@gmail.com',
        password: 'JamesonD0epa$$',
        status: 'pending',
      });

      const id = '98979675654556756687';

      const { create } = UserIdentity;
      UserIdentity.create = jest.fn().mockRejectedValue(new Error('Error'));

      try {
        await createUserIdentityForUser(id, userId, status, 'google');

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
      const id = '98098976576567';
      const firstName = 'Jamal';
      const lastName = 'Doe';
      const email = 'jamaldoe@gmail.com';

      let u = await User.findOne({ where: { firstName, lastName } });
      expect(u).toBeNull();

      expect(UserAccount.findOne({ where: { email } })).resolves.toBeNull();

      const result = await createUserAndUserIdentity(
        id,
        firstName,
        lastName,
        email,
        'google',
      );

      expect(result.id).toBe(id);

      u = await User.findOne({ where: { firstName, lastName } });
      expect(u).not.toBeNull();

      const a = await UserAccount.findOne({
        where: { userId: u?.userId, email, status: 'active' },
      });
      expect(a).not.toBeNull();

      const i = await UserIdentity.findOne({ where: { id } });
      expect(i).not.toBeNull();
    });

    it('should roll back transaction on error', async () => {
      const id = '98098976576567';

      const firstName = 'Jones';
      const lastName = 'Doe';

      const { create } = UserIdentity;
      UserIdentity.create = jest.fn().mockRejectedValue(new Error('Error'));

      try {
        await createUserAndUserIdentity(
          id,
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
      const firstName = 'Jan';
      const lastName = 'Doe';
      const email = 'jandoe@gmail.com';
      const password = 'janD0epas$$';

      const { userId } = await User.create({ firstName, lastName });
      await UserAccount.create({ userId, email, password });

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
      const { userId } = await User.create({
        firstName: 'Jaff',
        lastName: 'Doe',
      });

      const email = 'jaffdoe@gmail.com';

      const a = await UserAccount.create({ userId, email });
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
    const userData = {
      firstName: 'Jack',
      lastName: 'Doe',
      email: 'jackdoe@gmail.com',
      password: 'jackD0epas$$',
    };

    let userId: number;

    beforeAll(async () => {
      const u = await User.create(userData);
      userId = u.userId;

      await UserAccount.create({ userId, ...userData });
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
});
