import { User, UserAccount, UserIdentity } from '@user/models';
import userService from '@user/services/user.service';

import 'tests/db-setup';

describe('User Service', () => {
  describe('get user data', () => {
    it('pending user account', async () => {
      const user = await User.create({
        firstName: 'Joan',
        lastName: 'Doe',
      });

      const acct = await UserAccount.create({
        userId: user.userId,
        email: 'joandoe@gmail.com',
        password: 'joanD0epa$$',
      });

      const data = await userService.getUserData(user.userId);

      expect(data).toMatchObject({
        firstName: user.firstName,
        lastName: user.lastName,
        email: acct.email,
        status: acct.status,
      });
    });

    it('active user account', async () => {
      const u = await User.create({
        firstName: 'Jeronimo',
        lastName: 'Doe',
      });

      const a = await UserAccount.create({
        userId: u.userId,
        email: 'jeronimodoe@gmail.com',
        password: 'jeroD0ePa$$',
        status: 'active',
      });

      const data = await userService.getUserData(u.userId);

      expect(data).toMatchObject({
        firstName: u.firstName,
        lastName: u.lastName,
        email: a.email,
        status: a.status,
      });
    });

    it('active user account and user identity', async () => {
      const u = await User.create({
        firstName: 'Jonah',
        lastName: 'Doe',
      });

      const a = await UserAccount.create({
        userId: u.userId,
        email: 'jonahdoe@gmail.com',
        password: 'jonahD0ePa$$',
        status: 'active',
      });

      await UserIdentity.create({
        id: '49248923240536542',
        userId: u.userId,
        providerType: 'google',
      });

      const data = await userService.getUserData(u.userId);

      expect(data).toMatchObject({
        firstName: u.firstName,
        lastName: u.lastName,
        email: a.email,
        status: a.status,
      });
    });
  });
});
