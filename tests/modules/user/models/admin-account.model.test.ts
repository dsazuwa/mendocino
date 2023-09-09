import { Admin, AdminAccount, Email } from '@user/models';

import 'tests/db-setup';

const raw = true;

describe('AdminAccount Model', () => {
  describe('create', () => {
    it('should create admin account with provided values', async () => {
      const { adminId } = await Admin.create({
        firstName: 'John',
        lastName: 'Doe',
        status: 'active',
      });

      const { emailId } = await Email.create({ email: 'johndoe@gmail.com' });

      const data = {
        adminId,
        emailId,
        password: 'johnD0ePa$$',
      };

      const account = await AdminAccount.create(data);
      expect(account.adminId).toBe(adminId);
      expect(account.emailId).toBe(emailId);
    });

    it('should fail on duplicate adminId', async () => {
      const { adminId } = await Admin.create({
        firstName: 'Jae',
        lastName: 'Doe',
        status: 'active',
      });

      await Admin.create({
        firstName: 'Julius',
        lastName: 'Doe',
        status: 'active',
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
      });

      expect(
        AdminAccount.create({
          adminId,
          emailId: id2,
          password: 'juliusD0ePa$$',
        }),
      ).rejects.toThrow();
    });

    it('should fail on duplicate emailId', async () => {
      const admin1 = await Admin.create({
        firstName: 'Jake',
        lastName: 'Doe',
        status: 'active',
      });

      const admin2 = await Admin.create({
        firstName: 'Jac',
        lastName: 'Doe',
        status: 'active',
      });

      const { emailId } = await Email.create({ email: 'jakedoe@gmail.com' });

      const data = {
        emailId,
        password: 'jakeD0ePa$$',
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
      };

      expect(AdminAccount.create(data)).rejects.toThrow();
    });

    it('should fail on invalid emailId', async () => {
      const { adminId } = await Admin.create({
        firstName: 'Jay',
        lastName: 'Doe',
        status: 'active',
      });

      const data = {
        adminId,
        emailId: 12324535,
        password: 'jayD0ePa$$',
      };

      expect(AdminAccount.create(data)).rejects.toThrow();
    });
  });

  it('should retrieve admin account', async () => {
    const { adminId } = await Admin.create({
      firstName: 'Jane',
      lastName: 'Doe',
      status: 'active',
    });

    const { emailId } = await Email.create({ email: 'janedoe@gmail.com' });

    await AdminAccount.create({
      adminId,
      emailId,
      password: 'janeD0ePa$$',
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
      status: 'active',
    });

    const { emailId } = await Email.create({ email: 'joydoe@gmail.com' });

    await AdminAccount.create({
      adminId,
      emailId,
      password: 'joyD0ePa$$',
    });

    const password = 'joyousDoe@gmail.com';

    await AdminAccount.update(
      { password },
      { where: { adminId }, individualHooks: true },
    );

    const updatedAccount = await AdminAccount.findByPk(adminId);
    expect(
      AdminAccount.comparePasswords(password, updatedAccount?.password ?? ''),
    ).toBe(true);
  });

  it('should delete admin account', async () => {
    const { adminId } = await Admin.create({
      firstName: 'Joel',
      lastName: 'Doe',
      status: 'active',
    });

    const { emailId } = await Email.create({ email: 'joeldoe@gmail.com' });

    await AdminAccount.create({
      adminId,
      emailId,
      password: 'joelD0ePa$$',
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
        status: 'active',
      });

      const { emailId } = await Email.create({ email: 'jendoe@gmail.com' });

      const data = {
        adminId,
        emailId,
        password: 'janeD0ePa$$',
      };

      const account = await AdminAccount.create(data);
      expect(account.password).not.toEqual(data.password);
      expect(
        AdminAccount.comparePasswords(data.password, account.password),
      ).toBeTruthy();
    });

    it('should hash the password on update', async () => {
      const { adminId } = await Admin.create({
        firstName: 'Jules',
        lastName: 'Doe',
        status: 'active',
      });

      const { emailId } = await Email.create({ email: 'julesdoe@gmail.com' });

      const data = {
        adminId,
        emailId,
        password: 'julesD0ePa$$',
      };
      const newPassword = 'newJulesPa$$';

      await AdminAccount.create(data);
      await AdminAccount.update(
        { password: newPassword },
        { where: { adminId }, individualHooks: true },
      );

      const account = (await AdminAccount.findByPk(adminId, {
        raw: true,
      })) as AdminAccount;

      expect(
        AdminAccount.comparePasswords(data.password, account.password),
      ).toBeFalsy();
      expect(
        AdminAccount.comparePasswords(newPassword, account.password),
      ).toBeTruthy();

      const a = await AdminAccount.findByPk(adminId, { raw });
      expect(a?.password).not.toBe(newPassword);
    });
  });

  describe('compare password', () => {
    const password = 'jeromeD0e@gmail.com';
    let hashed: string;

    beforeAll(async () => {
      const { adminId } = await Admin.create({
        firstName: 'Jerome',
        lastName: 'Doe',
        status: 'active',
      });

      const { emailId } = await Email.create({ email: 'jeromedoe@gmail.com' });

      const a = await AdminAccount.create({
        adminId,
        emailId,
        password,
      });

      hashed = a.password;
    });

    it('should return true for equal passwords', () => {
      expect(AdminAccount.comparePasswords(password, hashed)).toBe(true);
    });

    it('should return false for non equal passwords', () => {
      expect(AdminAccount.comparePasswords('falsePassword', hashed)).toBe(
        false,
      );
    });
  });
});

describe('AdminAccount and Admin Relationship', () => {
  it('deleting AdminAccount should not delete Admin', async () => {
    const { adminId } = await Admin.create({
      firstName: 'Jun',
      lastName: 'Doe',
      status: 'active',
    });

    const { emailId } = await Email.create({ email: 'jundoe@gmail.com' });

    await AdminAccount.create({
      adminId,
      emailId,
      password: 'JuneD0ePa$$',
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
      status: 'active',
    });

    const { emailId } = await Email.create({ email: 'jennidoe@gmail.com' });

    await AdminAccount.create({
      adminId,
      emailId,
      password: 'JenD0ePa$$',
    });

    await Admin.destroy({ where: { adminId } });

    const retrievedAdmin = await Admin.findByPk(adminId, { raw });
    expect(retrievedAdmin).toBeNull();

    const retrievedAccount = await AdminAccount.findByPk(adminId, { raw });
    expect(retrievedAccount).toBeNull();
  });
});
