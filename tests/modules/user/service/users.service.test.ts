import { AuthOTP, User, UserAccount, UserIdentity } from '@user/models';
import usersService from '@user/services/users.service';
import { Request } from 'express';

import {
  createUserAccount,
  createUserAccountAndIdentity,
} from 'tests/modules/user/helper-functions';

import 'tests/modules/user/user.mock.db';

describe('Users Service', () => {
  describe('get user', () => {
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

      const data = await usersService.getUserData(req);
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

      const data = await usersService.getUserData(req);
      expect(data).toMatchObject({ firstName, lastName, email, status, roles });
    });
  });

  describe('verify email', () => {
    let userId: number;

    beforeAll(async () => {
      const { user } = await createUserAccount(
        'Jo',
        'Doe',
        'jodoe@gmail.com',
        'joD0ePa$$',
        'pending',
        [1],
      );
      userId = user.userId;
    });

    it('should verify the email', async () => {
      await usersService.verifyEmail(userId);

      const otp = await AuthOTP.findOne({ where: { userId, type: 'verify' } });
      expect(otp).toBeNull();

      const account = await UserAccount.findOne({
        where: { userId, status: 'active' },
      });
      expect(account).not.toBeNull();
    });

    it('should roll back transaction when an error occurs', async () => {
      const { otpId } = await AuthOTP.create({
        userId,
        type: 'verify',
        password: '123456',
        expiresAt: AuthOTP.getExpiration(),
      });

      const { update } = UserAccount;
      UserAccount.update = jest.fn().mockRejectedValue(new Error('Mock Error'));

      try {
        await usersService.verifyEmail(userId);

        expect(false).toBe(true);
      } catch (e) {
        const otp = await AuthOTP.findByPk(otpId);
        expect(otp).not.toBeNull();
      }

      UserAccount.update = update;
    });
  });

  describe('create password', () => {
    it('should create password if user password is null', async () => {
      const { userId, account } = await createUserAccountAndIdentity(
        'Josephine',
        'Doe',
        'josephinedoe@gmail.com',
        null,
        'active',
        [{ identityId: '923042892739426871638', providerType: 'google' }],
        [1],
      );
      const password = 'josephineD0ePa$$';
      expect(account.comparePasswords(password)).toBe(false);

      const result = await usersService.createPassword(userId, password);
      expect(result[0]).toBe(1);

      const retrievedAcct = await UserAccount.findByPk(userId);
      expect(retrievedAcct?.comparePasswords(password)).toBe(true);
    });

    it('should not create password if user password is null', async () => {
      const { userId, account } = await createUserAccount(
        'Julie',
        'Doe',
        'juliedoe@gmail.com',
        'julieD0ePa$$',
        'active',
        [1],
      );
      const newPassword = 'newjulieD0ePa$$';
      expect(account.comparePasswords(newPassword)).toBe(false);

      const result = await usersService.createPassword(userId, newPassword);
      expect(result[0]).toBe(0);

      const retrievedAcct = await UserAccount.findByPk(userId);
      expect(retrievedAcct?.comparePasswords(newPassword)).toBe(false);
    });
  });

  describe('change password', () => {
    it('should change password and return true for valid userId', async () => {
      const password = 'jeanD0epa$$';
      const newPassword = 'newjeanD0epa$$';

      const { userId } = await createUserAccount(
        'Jean Paul',
        'Doe',
        'jeanpauldoe@gmail.com',
        password,
        'active',
        [1],
      );

      const result = await usersService.changePassword(
        userId,
        password,
        newPassword,
      );
      expect(result).toBe(true);

      const a = await UserAccount.findOne({ where: { userId } });
      expect(a?.comparePasswords(newPassword)).toBe(true);
    });

    it('should return false for wrong current password', async () => {
      const password = 'julietteD0epa$$';
      const newPassword = 'newjeanD0epa$$';

      const { userId } = await createUserAccount(
        'Juliette',
        'Doe',
        'juliettepauldoe@gmail.com',
        password,
        'active',
        [1],
      );

      const result = await usersService.changePassword(
        userId,
        newPassword,
        newPassword,
      );

      expect(result).toBe(false);

      const a = await UserAccount.findOne({ where: { userId } });
      expect(a?.comparePasswords(newPassword)).toBe(false);
      expect(a?.comparePasswords(password)).toBe(true);
    });

    it('should return false if user_account password is null', async () => {
      const newPassword = 'newjolieD0epa$$';

      const { userId, account } = await createUserAccount(
        'Jolie',
        'Doe',
        'joliepauldoe@gmail.com',
        null,
        'active',
        [1],
      );

      expect(account.password).toBeNull();

      const result = await usersService.changePassword(
        userId,
        'somePassword',
        newPassword,
      );

      expect(result).toBe(false);

      const a = await UserAccount.findByPk(userId);
      expect(a?.password).toBeNull();
    });

    it('should return false for invalid userId', async () => {
      const result = await usersService.changePassword(
        10000,
        'wrongOldPassword',
        'newpassword',
      );

      expect(result).toBe(false);
    });
  });

  describe('revoke social authentication', () => {
    it('should delete identity if user has an account with a password', async () => {
      const providerType = 'google';

      const { userId, account } = await createUserAccountAndIdentity(
        'Jessica',
        'Doe',
        'jessicadoe@gmail.com',
        'jessicaD0ePa$$',
        'active',
        [{ identityId: '3654755345356474363', providerType }],
        [1],
      );

      expect(account.password).not.toBeNull();

      const result = await usersService.revokeSocialAuthentication(
        userId,
        providerType,
      );

      expect(result.account).toBe(true);
      expect(result.user).toBeUndefined();
      expect(result.identity).toBeUndefined();
      expect(result.otherIdentity).toBeUndefined();

      const i = await UserIdentity.findOne({ where: { userId, providerType } });
      expect(i).toBeNull();

      const a = await UserAccount.findByPk(userId);
      expect(a).not.toBeNull();

      const u = await User.findByPk(userId);
      expect(u).not.toBeNull();
    });

    it('should delete identity if user has no account with password but other identities', async () => {
      const { userId, account } = await createUserAccountAndIdentity(
        'Jack',
        'Doe',
        'jackdoe@gmail.com',
        null,
        'active',
        [
          { identityId: '52429584297428924', providerType: 'google' },
          { identityId: '58991388923428739', providerType: 'facebook' },
        ],
        [1],
      );

      expect(account.password).toBeNull();

      const result = await usersService.revokeSocialAuthentication(
        userId,
        'facebook',
      );

      expect(result.account).toBeUndefined();
      expect(result.user).toBeUndefined();
      expect(result.identity).toBe(true);
      expect(result.otherIdentity).toBe('google');

      let i = await UserIdentity.findOne({
        where: { userId, providerType: 'facebook' },
      });
      expect(i).toBeNull();

      i = await UserIdentity.findOne({
        where: { userId, providerType: 'google' },
      });
      expect(i).not.toBeNull();

      const a = await UserAccount.findByPk(userId);
      expect(a).not.toBeNull();
      expect(a?.password).toBeNull();

      const u = await User.findByPk(userId);
      expect(u).not.toBeNull();
    });

    it('should delete user if user has neither an account with a password nor anothor identitiy', async () => {
      const providerType = 'google';

      const { userId, account } = await createUserAccountAndIdentity(
        'Jess',
        'Doe',
        'jessdoe@gmail.com',
        null,
        'active',
        [{ identityId: '94044248328749827', providerType }],
        [1],
      );

      expect(account.password).toBeNull();

      const result = await usersService.revokeSocialAuthentication(
        userId,
        providerType,
      );

      expect(result.account).toBeUndefined();
      expect(result.user).toBe(true);
      expect(result.identity).toBeUndefined();
      expect(result.otherIdentity).toBeUndefined();

      const i = await UserIdentity.findOne({ where: { userId, providerType } });
      expect(i).toBeNull();

      const a = await UserAccount.findByPk(userId);
      expect(a).toBeNull();

      const u = await User.findByPk(userId);
      expect(u).toBeNull();
    });
  });

  describe('close account', () => {
    it('should deactivate account if user has an account password', async () => {
      const { userId, account } = await createUserAccountAndIdentity(
        'Jeff',
        'Doe',
        'jeffdoe@gmail.com',
        'jeffD0ePa$$',
        'active',
        [{ identityId: '2435674867433235', providerType: 'google' }],
        [1],
      );

      expect(account.password).not.toBeNull();

      await usersService.closeAccount(userId);

      const i = await UserIdentity.findOne({ where: { userId } });
      expect(i).toBeNull();

      const a = await UserAccount.findByPk(userId);
      expect(a).not.toBeNull();

      const u = await User.findByPk(userId);
      expect(u).not.toBeNull();
    });

    it('should delete user if user does not have an account password', async () => {
      const { userId, account } = await createUserAccountAndIdentity(
        'James',
        'Doe',
        'jamesdoe@gmail.com',
        null,
        'active',
        [{ identityId: '23274274781623876298', providerType: 'google' }],
        [1],
      );

      expect(account.password).toBeNull();

      await usersService.closeAccount(userId);

      const i = await UserIdentity.findOne({ where: { userId } });
      expect(i).toBeNull();

      const a = await UserAccount.findByPk(userId);
      expect(a).toBeNull();

      const u = await User.findByPk(userId);
      expect(u).toBeNull();
    });
  });
});
