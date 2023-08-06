import { sign } from 'jsonwebtoken';

import { ProviderType, User, UserAccount, UserIdentity } from '@user/models';
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
        {
          expiresIn: '1 day',
        },
      );

      expect(token).toEqual(decoded);
    });

    it('should generate a token for google', async () => {
      const token = authService.generateJWT(userId, 'google');
      expect(token).toBeDefined();

      const decoded = sign(
        { userId, providerType: 'google' },
        `${process.env.JWT_SECRET}`,
        {
          expiresIn: '1 day',
        },
      );

      expect(token).toEqual(decoded);
    });

    it('should generate a token for facebook', async () => {
      const token = authService.generateJWT(userId, 'facebook');
      expect(token).toBeDefined();

      const decoded = sign(
        { userId, providerType: 'facebook' },
        `${process.env.JWT_SECRET}`,
        {
          expiresIn: '1 day',
        },
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

      expect(result?.userId).toBe(userId);
      expect((result as UserAccount).email).toBe(email);
      expect((result as UserAccount).password).toBe(password);
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
      const u = await User.create({ firstName: 'Jasmine', lastName: 'Doe' });

      const a = await UserAccount.create({
        userId: u.userId,
        email: 'jasminedoe@gmail.com',
        password: 'jasD0epa$$',
        status: 'active',
      });

      const id = '12324534675';
      const providerType = 'google';

      const identity = await authService.createNewIdentity(
        id,
        a,
        u.firstName,
        u.lastName,
        a.email,
        providerType,
      );

      expect(identity.id).toBe(id);
      expect(identity.userId).toBe(u.userId);
      expect(identity.providerType).toBe(providerType);

      const retrievedIdentity = await UserIdentity.findOne({
        where: { id, providerType, userId: u.userId },
      });

      expect(retrievedIdentity).not.toBeNull();
    });

    it('should create a new user and user identity for new user', async () => {
      const data = {
        id: '4309372642830289974',
        email: 'jerichodoe@gmail.com',
        firstName: 'Jericho',
        lastName: 'Doe',
        providerType: 'google' as ProviderType,
      };

      let u = await User.findOne({
        where: { firstName: data.firstName, lastName: data.lastName },
      });

      expect(u).toBeNull();

      const identity = await authService.createNewIdentity(
        data.id,
        null,
        data.firstName,
        data.lastName,
        data.email,
        data.providerType,
      );

      expect(identity.id).toBe(data.id);
      expect(identity.providerType).toBe(data.providerType);

      u = await User.findOne({
        where: { firstName: data.firstName, lastName: data.lastName },
      });

      expect(u).not.toBeNull();

      const i = await UserIdentity.findOne({
        where: {
          id: data.id,
          providerType: data.providerType,
          userId: u?.userId,
        },
      });

      expect(i).not.toBeNull();
    });
  });

  describe('create user identity for user', () => {
    it('should create user for user identity and change account status to active', async () => {
      const u = await User.create({
        firstName: 'James',
        lastName: 'Doe',
      });

      const a = await UserAccount.create({
        userId: u.userId,
        email: 'jamesdoe@gmail.com',
        password: 'JamesD0epa$$',
        status: 'pending',
      });

      const id = '923849719836872649';

      const i = await createUserIdentityForUser(
        id,
        u.userId,
        a.status,
        'google',
      );

      expect(i.id).toBe(id);

      expect(
        UserIdentity.findOne({
          where: { userId: u.userId, providerType: 'google' },
        }),
      ).resolves.not.toBeNull();

      const retrievedAccount = await UserAccount.findOne({
        where: { userId: u.userId },
      });

      expect(retrievedAccount?.status).toBe('active');
    });

    it('should roll back transaction on error', async () => {
      const u = await User.create({
        firstName: 'Jameson',
        lastName: 'Doe',
      });

      const a = await UserAccount.create({
        userId: u.userId,
        email: 'jamesondoe@gmail.com',
        password: 'JamesonD0epa$$',
        status: 'pending',
      });

      const id = '98979675654556756687';

      const { create } = UserIdentity;
      UserIdentity.create = jest
        .fn()
        .mockRejectedValue(new Error('Mock Error'));

      try {
        await createUserIdentityForUser(id, u.userId, a.status, 'google');

        expect(false).toBe(true);
      } catch (e) {
        const newA = await UserAccount.findByPk(u.userId);
        expect(newA?.status).toBe('pending');
      }

      UserIdentity.create = create;
    });
  });

  describe('create user and user identity', () => {
    it('should create user, user account, and user identity', async () => {
      const id = '98098976576567';

      const data = {
        firstName: 'Jamal',
        lastName: 'Doe',
        email: 'jamaldoe@gmail.com',
      };

      expect(
        User.findOne({
          where: { firstName: data.firstName, lastName: data.lastName },
        }),
      ).resolves.toBeNull();

      expect(
        UserAccount.findOne({ where: { email: data.email } }),
      ).resolves.toBeNull();

      const i = await createUserAndUserIdentity(
        id,
        data.firstName,
        data.lastName,
        data.email,
        'google',
      );

      expect(i.id).toBe(id);

      expect(
        UserIdentity.findOne({
          where: { id, providerType: 'google' },
        }),
      ).resolves.not.toBeNull();

      const u = await User.findOne({
        where: { firstName: data.firstName, lastName: data.lastName },
      });

      expect(u).not.toBeNull();

      const a = await UserAccount.findOne({ where: { userId: u?.userId } });
      expect(a).not.toBeNull();
      expect(a?.email).toBe(data.email);
      expect(a?.status).toBe('active');
    });

    it('should roll back transaction on error', async () => {
      const id = '98098976576567';

      const data = { firstName: 'Jones', lastName: 'Doe' };

      const { create } = UserIdentity;
      UserIdentity.create = jest
        .fn()
        .mockRejectedValue(new Error('Mock Error'));

      try {
        await createUserAndUserIdentity(
          id,
          data.firstName,
          data.lastName,
          'jonesdoe@gmail.com',
          'google',
        );

        expect(false).toBe(true);
      } catch (e) {
        const u = await User.findOne({ where: data });
        expect(u).toBeNull();
      }

      UserIdentity.create = create;
    });
  });
});
