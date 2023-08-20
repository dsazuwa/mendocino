import {
  Admin,
  AdminAccount,
  AdminAccountStatusType,
  Email,
} from '@user/models';

import 'tests/db-setup';

const raw = true;

describe('AdminAccount Model', () => {
  describe('create', () => {
    it('should create admin account with provided values', async () => {
      const { adminId } = await Admin.create({
        firstName: 'John',
        lastName: 'Doe',
      });

      const { emailId } = await Email.create({ email: 'johndoe@gmail.com' });

      const data = {
        adminId,
        emailId,
        password: 'johnD0ePa$$',
        status: 'active' as AdminAccountStatusType,
      };

      const account = await AdminAccount.create(data);
      expect(account.adminId).toBe(adminId);
      expect(account.emailId).toBe(emailId);
      expect(account.status).toBe(data.status);
    });

    it('should fail on duplicate adminId', async () => {
      const { adminId } = await Admin.create({
        firstName: 'Jae',
        lastName: 'Doe',
      });

      await Admin.create({
        firstName: 'Julius',
        lastName: 'Doe',
      });

      const { emailId: id1 } = await Email.create({
        email: 'juliusdoe@gmail.com',
      });
      const { emailId: id2 } = await Email.create({
        email: 'jaedoe@gmail.com',
      });

      await AdminAccount.create({
        adminId,
        emailId: id1,
        password: 'jaeD0ePa$$',
        status: 'active',
      });

      expect(
        AdminAccount.create({
          adminId,
          emailId: id2,
          password: 'juliusD0ePa$$',
          status: 'active',
        }),
      ).rejects.toThrow();
    });

    it('should fail on duplicate emailId', async () => {
      const admin1 = await Admin.create({
        firstName: 'Jake',
        lastName: 'Doe',
      });

      const admin2 = await Admin.create({
        firstName: 'Jac',
        lastName: 'Doe',
      });

      const { emailId } = await Email.create({ email: 'jakedoe@gmail.com' });

      const data = {
        emailId,
        password: 'jakeD0ePa$$',
        status: 'active' as AdminAccountStatusType,
      };

      await AdminAccount.create({ adminId: admin1.adminId, ...data });

      expect(
        AdminAccount.create({ adminId: admin2.adminId, ...data }),
      ).rejects.toThrow();
    });

    it('should fail on invalid adminId', async () => {
      const { emailId } = await Email.create({ email: 'janicedoe@gmail.com' });

      const data = {
        adminId: 1000,
        emailId,
        password: 'jayD0ePa$$',
        status: 'active' as AdminAccountStatusType,
      };

      expect(AdminAccount.create(data)).rejects.toThrow();
    });

    it('should fail on invalid emailId', async () => {
      const { adminId } = await Admin.create({
        firstName: 'Jay',
        lastName: 'Doe',
      });

      const data = {
        adminId,
        emailId: 12324535,
        password: 'jayD0ePa$$',
        status: 'active' as AdminAccountStatusType,
      };

      expect(AdminAccount.create(data)).rejects.toThrow();
    });
  });

  it('should retrieve admin account', async () => {
    const { adminId } = await Admin.create({
      firstName: 'Jane',
      lastName: 'Doe',
    });

    const { emailId } = await Email.create({ email: 'janedoe@gmail.com' });

    await AdminAccount.create({
      adminId,
      emailId,
      password: 'janeD0ePa$$',
      status: 'active' as AdminAccountStatusType,
    });

    let retrievedAccount = await AdminAccount.findByPk(adminId, { raw });
    expect(retrievedAccount).not.toBeNull();

    retrievedAccount = await AdminAccount.findOne({ where: { emailId }, raw });
    expect(retrievedAccount).not.toBeNull();
  });

  it('should update admin account', async () => {
    const { adminId } = await Admin.create({
      firstName: 'Joy',
      lastName: 'Doe',
    });

    const { emailId } = await Email.create({ email: 'joydoe@gmail.com' });

    await AdminAccount.create({
      adminId,
      emailId,
      password: 'joyD0ePa$$',
      status: 'active' as AdminAccountStatusType,
    });

    const password = 'joyousDoe@gmail.com';

    await AdminAccount.update(
      { password },
      { where: { adminId }, individualHooks: true },
    );

    const updatedAccount = await AdminAccount.findByPk(adminId);
    expect(updatedAccount?.comparePasswords(password)).toBe(true);
  });

  it('should delete admin account', async () => {
    const { adminId } = await Admin.create({
      firstName: 'Joel',
      lastName: 'Doe',
    });

    const { emailId } = await Email.create({ email: 'joeldoe@gmail.com' });

    await AdminAccount.create({
      adminId,
      emailId,
      password: 'joelD0ePa$$',
      status: 'active' as AdminAccountStatusType,
    });

    await AdminAccount.destroy({ where: { adminId } });

    const deletedAccount = await AdminAccount.findByPk(adminId, { raw });
    expect(deletedAccount).toBeNull();
  });

  describe('hash password', () => {
    it('should hash the password on create', async () => {
      const { adminId } = await Admin.create({
        firstName: 'Jen',
        lastName: 'Doe',
      });

      const { emailId } = await Email.create({ email: 'jendoe@gmail.com' });

      const data = {
        adminId,
        emailId,
        password: 'janeD0ePa$$',
        status: 'active' as AdminAccountStatusType,
      };

      const account = await AdminAccount.create(data);
      expect(account.password).not.toEqual(data.password);
      expect(account.comparePasswords(data.password)).toBeTruthy();
    });

    it('should hash the password on update', async () => {
      const { adminId } = await Admin.create({
        firstName: 'Jules',
        lastName: 'Doe',
      });

      const { emailId } = await Email.create({ email: 'julesdoe@gmail.com' });

      const data = {
        adminId,
        emailId,
        password: 'julesD0ePa$$',
        status: 'active' as AdminAccountStatusType,
      };
      const newPassword = 'newJulesPa$$';

      const account = await AdminAccount.create(data);
      await account.update({ password: newPassword });

      expect(account.comparePasswords(data.password)).toBeFalsy();
      expect(account.comparePasswords(newPassword)).toBeTruthy();

      const a = await AdminAccount.findByPk(adminId, { raw });
      expect(a?.password).not.toBe(newPassword);
    });
  });

  describe('compare password', () => {
    let a: AdminAccount;

    const password = 'jeromeD0e@gmail.com';

    beforeAll(async () => {
      const { adminId } = await Admin.create({
        firstName: 'Jerome',
        lastName: 'Doe',
      });

      const { emailId } = await Email.create({ email: 'jeromedoe@gmail.com' });

      a = await AdminAccount.create({
        adminId,
        emailId,
        password,
        status: 'active' as AdminAccountStatusType,
      });
    });

    it('should return true for equal passwords', () => {
      expect(a.comparePasswords(password)).toBe(true);
    });

    it('should return false for non equal passwords', () => {
      expect(a.comparePasswords('falsePassword')).toBe(false);
    });
  });
});

describe('AdminAccount and Admin Relationship', () => {
  it('deleting AdminAccount should not delete Admin', async () => {
    const { adminId } = await Admin.create({
      firstName: 'Jun',
      lastName: 'Doe',
    });

    const { emailId } = await Email.create({ email: 'jundoe@gmail.com' });

    await AdminAccount.create({
      adminId,
      emailId,
      password: 'JuneD0ePa$$',
      status: 'active' as AdminAccountStatusType,
    });

    await AdminAccount.destroy({ where: { adminId } });

    const retrievedAdmin = await Admin.findByPk(adminId, { raw });
    expect(retrievedAdmin).not.toBeNull();

    const retrievedAccount = await AdminAccount.findByPk(adminId, { raw });
    expect(retrievedAccount).toBeNull();
  });

  it('deleting Admin should delete AdminAccount', async () => {
    const { adminId } = await Admin.create({
      firstName: 'Jenni',
      lastName: 'Doe',
    });

    const { emailId } = await Email.create({ email: 'jennidoe@gmail.com' });

    await AdminAccount.create({
      adminId,
      emailId,
      password: 'JenD0ePa$$',
      status: 'active' as AdminAccountStatusType,
    });

    await Admin.destroy({ where: { adminId } });

    const retrievedAdmin = await Admin.findByPk(adminId, { raw });
    expect(retrievedAdmin).toBeNull();

    const retrievedAccount = await AdminAccount.findByPk(adminId, { raw });
    expect(retrievedAccount).toBeNull();
  });
});
