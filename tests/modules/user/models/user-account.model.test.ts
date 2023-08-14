import { User, UserAccount, UserAccountStatusType } from '@user/models';

import 'tests/db-setup';

const raw = true;

describe('User Account Model', () => {
  describe('create', () => {
    it('should create user account with provided values', async () => {
      const { userId } = await User.create({
        firstName: 'John',
        lastName: 'Doe',
      });

      const data = {
        userId,
        email: 'johndoe@gmail.com',
        password: 'johnD0ePa$$',
        status: 'active' as UserAccountStatusType,
      };

      const account = await UserAccount.create(data);
      expect(account.userId).toBe(userId);
      expect(account.email).toBe(data.email);
      expect(account.status).toBe(data.status);
    });

    it('should create user account with default values', async () => {
      const { userId } = await User.create({
        firstName: 'Jinny',
        lastName: 'Doe',
      });

      const data = {
        userId,
        email: 'jinnydoe@gmail.com',
        password: 'jinnyD0ePa$$',
      };

      const account = await UserAccount.create(data);
      expect(account.userId).toBe(userId);
      expect(account.email).toBe(data.email);
      expect(account.status).toBe('pending');
    });

    it('should fail on duplicate userId', async () => {
      const { userId } = await User.create({
        firstName: 'Jae',
        lastName: 'Doe',
      });

      await User.create({
        firstName: 'Julius',
        lastName: 'Doe',
      });

      await UserAccount.create({
        userId,
        email: 'jaedoe@gmail.com',
        password: 'jaeD0ePa$$',
      });

      expect(
        UserAccount.create({
          userId,
          email: 'juliusdoe@gmail.com',
          password: 'juliusD0ePa$$',
        }),
      ).rejects.toThrow();
    });

    it('should fail on duplicate email', async () => {
      const user1 = await User.create({
        firstName: 'Jake',
        lastName: 'Doe',
      });

      const user2 = await User.create({
        firstName: 'Jac',
        lastName: 'Doe',
      });

      const data = {
        email: 'jakedoe@gmail.com',
        password: 'jakeD0ePa$$',
      };

      await UserAccount.create({ userId: user1.userId, ...data });

      expect(
        UserAccount.create({ userId: user2.userId, ...data }),
      ).rejects.toThrow();
    });

    it('should fail on invalid userId', async () => {
      const data = {
        userId: 1000,
        email: 'janicedoeemail',
        password: 'jayD0ePa$$',
      };

      expect(UserAccount.create(data)).rejects.toThrow();
    });

    it('should fail on invalid email', async () => {
      const { userId } = await User.create({
        firstName: 'Jay',
        lastName: 'Doe',
      });

      const data = {
        userId,
        email: 'jaydoeemail',
        password: 'jayD0ePa$$',
      };

      expect(UserAccount.create(data)).rejects.toThrow();
    });
  });

  it('should retrieve user account', async () => {
    const { userId } = await User.create({
      firstName: 'Jane',
      lastName: 'Doe',
    });

    const { email } = await UserAccount.create({
      userId,
      email: 'janedoe@gmail.com',
      password: 'janeD0ePa$$',
    });

    let retrievedAccount = await UserAccount.findByPk(userId, { raw });
    expect(retrievedAccount).not.toBeNull();

    retrievedAccount = await UserAccount.findOne({ where: { email }, raw });
    expect(retrievedAccount).not.toBeNull();
  });

  it('should update user account', async () => {
    const { userId } = await User.create({
      firstName: 'Joy',
      lastName: 'Doe',
    });

    await UserAccount.create({
      userId,
      email: 'joydoe@gmail.com',
      password: 'joyD0ePa$$',
    });

    const email = 'joyousDoe@gmail.com';

    await UserAccount.update({ email }, { where: { userId } });

    const updatedAccount = await UserAccount.findByPk(userId, { raw });
    expect(updatedAccount?.email).toEqual(email);
  });

  it('should delete user account', async () => {
    const { userId } = await User.create({
      firstName: 'Joel',
      lastName: 'Doe',
    });

    await UserAccount.create({
      userId,
      email: 'joeldoe@gmail.com',
      password: 'joelD0ePa$$',
    });

    await UserAccount.destroy({ where: { userId } });

    const deletedAccount = await UserAccount.findByPk(userId, { raw });
    expect(deletedAccount).toBeNull();
  });

  describe('hash password', () => {
    it('should hash the password on create', async () => {
      const { userId } = await User.create({
        firstName: 'Jen',
        lastName: 'Doe',
      });

      const data = {
        userId,
        email: 'jendoe@gmail.com',
        password: 'janeD0ePa$$',
      };

      const account = await UserAccount.create(data);
      expect(account.password).not.toEqual(data.password);
      expect(account.comparePasswords(data.password)).toBeTruthy();
    });

    it('should hash the password on update', async () => {
      const { userId } = await User.create({
        firstName: 'Julius',
        lastName: 'Doe',
      });

      const data = {
        userId,
        email: 'juliusdoe@gmail.com',
        password: 'juliusD0ePa$$',
      };
      const newPassword = 'newJul1usPa$$';

      const account = await UserAccount.create(data);
      await account.update({ password: newPassword });

      expect(account.comparePasswords(data.password)).toBeFalsy();
      expect(account.comparePasswords(newPassword)).toBeTruthy();

      const a = await UserAccount.findByPk(userId, { raw });
      expect(a?.password).not.toBe(newPassword);
    });
  });

  describe('compare password', () => {
    let a: UserAccount;

    const password = 'jeromeD0e@gmail.com';

    beforeAll(async () => {
      const { userId } = await User.create({
        firstName: 'Jerome',
        lastName: 'Doe',
      });

      a = await UserAccount.create({
        userId,
        email: 'jeromedoe@gmail.com',
        password,
      });
    });

    it('should return true for equal passwords', () => {
      expect(a.comparePasswords(password)).toBe(true);
    });

    it('should return false for non equal passwords', () => {
      expect(a.comparePasswords('falsePassword')).toBe(false);
    });

    it('should return false for null password', async () => {
      const { userId } = await User.create({
        firstName: 'Joelle',
        lastName: 'Doe',
      });

      const account = await UserAccount.create({
        userId,
        email: 'joelledoe@gmail.com',
      });

      expect(account.comparePasswords('joelleD0ePa$$')).toBe(false);
    });
  });
});

describe('User Account and User Relationship', () => {
  it('deleting User Account should delete User', async () => {
    const { userId } = await User.create({
      firstName: 'Jun',
      lastName: 'Doe',
    });

    await UserAccount.create({
      userId,
      email: 'jundoe@gmail.com',
      password: 'JuneD0ePa$$',
    });

    await UserAccount.destroy({ where: { userId } });

    const retrievedUser = await User.findByPk(userId, { raw });
    expect(retrievedUser).not.toBeNull();

    const retrievedAccount = await UserAccount.findByPk(userId, { raw });
    expect(retrievedAccount).toBeNull();
  });

  it('deleting User should delete User Account', async () => {
    const { userId } = await User.create({
      firstName: 'Jenni',
      lastName: 'Doe',
    });

    await UserAccount.create({
      userId,
      email: 'jennidoe@gmail.com',
      password: 'JenD0ePa$$',
    });

    await User.destroy({ where: { userId } });

    const retrievedUser = await User.findByPk(userId, { raw });
    expect(retrievedUser).toBeNull();

    const retrievedAccount = await UserAccount.findByPk(userId, { raw });
    expect(retrievedAccount).toBeNull();
  });
});
