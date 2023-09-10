import { Admin, Email } from '@user/models';
import tokenService from '@user/services/token.service';
import { ROLES } from '@user/utils/constants';

import { createAdmin, createRoles } from 'tests/modules/user/helper-functions';
import { request } from 'tests/supertest.helper';

import 'tests/db-setup';

const BASE_URL = '/api/admins/me';

const raw = true;

beforeAll(async () => {
  await createRoles();
});

describe(`PATCH ${BASE_URL}/name`, () => {
  let adminId: number;
  let jwt: string;

  const firstName = 'Janet';
  const lastName = 'Doe';

  const newFirst = 'Janette';
  const newLast = 'Dough';

  beforeEach(async () => {
    await Email.destroy({ where: {} });
    await Admin.destroy({ where: {} });

    const { admin, email } = await createAdmin(
      firstName,
      lastName,
      'janetdoe@gmail.com',
      'JanetD0ePa$$',
      'active',
      [ROLES.DELIVERY_DRIVER.roleId],
    );

    adminId = admin.adminId;
    jwt = tokenService.generateAccessToken(email.email, 'email');
  });

  const testUpdatecustomer = async (
    fName: string | undefined,
    lName: string | undefined,
    expectedFirst: string,
    expectedLast: string,
    status: 200 | 400,
  ) => {
    await request
      .patch(`${BASE_URL}/name`)
      .send({ firstName: fName, lastName: lName })
      .auth(jwt, { type: 'bearer' })
      .expect(status);

    const admin = await Admin.findOne({
      where: { adminId, firstName: expectedFirst, lastName: expectedLast },
      raw,
    });
    expect(admin).not.toBeNull();
  };

  it('should update admin if both firstName and lastName are provided', async () => {
    await testUpdatecustomer(newFirst, newLast, newFirst, newLast, 200);
  });

  describe('should update admin if firstName is provided', () => {
    it('but lastName is an empty string', async () => {
      await testUpdatecustomer(newFirst, '', newFirst, lastName, 200);
    });

    it('but lastName is undefined', async () => {
      await testUpdatecustomer(newFirst, undefined, newFirst, lastName, 200);
    });
  });

  describe('should update admin if lastName is provided', () => {
    it('but firstName is an empty string', async () => {
      await testUpdatecustomer('', newLast, firstName, newLast, 200);
    });

    it('but firstName is undefined', async () => {
      await testUpdatecustomer(undefined, newLast, firstName, newLast, 200);
    });
  });

  describe('should not update admin', () => {
    it('if both firstName and lastName are empty strings', async () => {
      await testUpdatecustomer('', ' ', firstName, lastName, 400);
    });

    it('if both firstName and lastName are undefined', async () => {
      await testUpdatecustomer(undefined, undefined, firstName, lastName, 400);
    });
  });
});

describe(`PATCH ${BASE_URL}/password`, () => {
  const password = 'jeanD0ePa$$';
  let jwt: string;

  beforeAll(async () => {
    const { email } = await createAdmin(
      'Jeanette',
      'Doe',
      'jeanettedoe@gmail.com',
      password,
      'active',
      [ROLES.ROOT.roleId],
    );

    jwt = tokenService.generateAccessToken(email.email, 'email');
  });

  it('should update password', async () => {
    const newPassword = 'newjeanD0ePa$$';

    await request
      .patch(`${BASE_URL}/password`)
      .auth(jwt, { type: 'bearer' })
      .send({ currentPassword: password, newPassword })
      .expect(200);
  });

  it('should fail to update password on invalid new password', async () => {
    const newPassword = 'newjeanD0ePa$$2';

    await request
      .patch(`${BASE_URL}/password`)
      .auth(jwt, { type: 'bearer' })
      .send({
        currentPassword: 'wrongCurrentPassword',
        password: newPassword,
      })
      .expect(400);

    await request
      .patch(`${BASE_URL}/password`)
      .auth(jwt, { type: 'bearer' })
      .send({ currentPassword: password, password: 'invalidPassword' })
      .expect(400);

    await request
      .patch(`${BASE_URL}/password`)
      .auth(jwt, { type: 'bearer' })
      .expect(400);
  });

  it('should fail if current and new password are the same', async () => {
    const newPassword = 'D0ePa$$w0rd';

    await request
      .patch(`${BASE_URL}/password`)
      .auth(jwt, { type: 'bearer' })
      .send({ currentPassword: password, password: newPassword })
      .expect(400);
  });
});
