import { User, UserAccount, UserIdentity } from '@user/models';
import userService from '@user/services/user.service';

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

      const data = await userService.getUserData(userId);
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

      const data = await userService.getUserData(userId);
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

      const data = await userService.getUserData(userId);
      expect(data).toMatchObject({ firstName, lastName, email, status });
    });
  });
});
