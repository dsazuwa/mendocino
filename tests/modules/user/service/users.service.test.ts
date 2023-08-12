import { AuthOTP, User, UserAccount, UserIdentity } from '@user/models';
import usersService from '@user/services/users.service';

import 'tests/db-setup';

describe('User Service', () => {
  describe('get user data', () => {
    it('pending user account', async () => {
      const firstName = 'Joan';
      const lastName = 'Doe';
      const email = 'joandoe@gmail.com';
      const password = 'joanD0epa$$';
      const status = 'pending';

      const { userId } = await User.create({ firstName, lastName });
      await UserAccount.create({ userId, email, password, status });

      const data = await usersService.getUserData(userId);
      expect(data).toMatchObject({ firstName, lastName, email, status });
    });

    it('active user account', async () => {
      const firstName = 'Jeronimo';
      const lastName = 'Doe';
      const email = 'jeronimodoe@gmail.com';
      const password = 'jeroD0ePa$$';
      const status = 'active';

      const { userId } = await User.create({ firstName, lastName });
      await UserAccount.create({ userId, email, password, status });

      const data = await usersService.getUserData(userId);
      expect(data).toMatchObject({ firstName, lastName, email, status });
    });

    it('active user account and user identity', async () => {
      const firstName = 'Jonah';
      const lastName = 'Doe';
      const email = 'jonahdoe@gmail.com';
      const password = 'jonahD0ePa$$';
      const status = 'active';
      const id = '49248923240536542';
      const providerType = 'google';

      const { userId } = await User.create({ firstName, lastName });
      await UserAccount.create({ userId, email, password, status });
      await UserIdentity.create({ id, userId, providerType });

      const data = await usersService.getUserData(userId);
      expect(data).toMatchObject({ firstName, lastName, email, status });
    });
  });

  describe('verify email', () => {
    let userId: number;

    beforeAll(async () => {
      const u = await User.create({ firstName: 'Jo', lastName: 'Doe' });
      userId = u.userId;

      await UserAccount.create({
        userId,
        email: 'jodoe@gmail.com',
        password: 'joD0epa$$',
      });
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
      const { id } = await AuthOTP.create({
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
        const otp = await AuthOTP.findByPk(id);
        expect(otp).not.toBeNull();
      }

      UserAccount.update = update;
    });
  });
});
