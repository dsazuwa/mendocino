import { AuthOTP, PhoneNumber } from '@user/models';
import authService from '@user/services/auth.service';
import { ROLES } from '@user/utils/constants';

import { createUserAccount } from 'tests/modules/user/helper-functions';
import { request } from 'tests/supertest.helper';

import 'tests/user.db-setup';

const BASE_URL = '/api/phone';
const raw = true;

describe('Phone number management', () => {
  const mockOTP = '12345';
  const phoneNumber = '1234567890';

  let userId: number;
  let jwt: string;

  beforeAll(async () => {
    const { user } = await createUserAccount(
      'Jamal',
      'Doe',
      'jamaldoe@gmail.com',
      'jamalD0ePa$$',
      'active',
      [ROLES.CUSTOMER.roleId],
    );

    userId = user.userId;
    jwt = authService.generateJWT(userId, 'email');
  });

  it(`POST ${BASE_URL} should register a new phone number`, async () => {
    let phone = await PhoneNumber.findOne({
      where: { userId, phoneNumber },
      raw,
    });
    expect(phone).toBeNull();

    let otp = await AuthOTP.findOne({ where: { userId, type: 'phone' }, raw });
    expect(otp).toBeNull();

    await request
      .post(BASE_URL)
      .send({ phoneNumber })
      .auth(jwt, { type: 'bearer' })
      .expect(200);

    phone = await PhoneNumber.findOne({
      where: { userId, phoneNumber, status: 'pending' },
      raw,
    });
    expect(phone).not.toBeNull();

    otp = await AuthOTP.findOne({ where: { userId, type: 'phone' }, raw });
    expect(otp).not.toBeNull();
  });

  it(`PATCH ${BASE_URL}/resend should create a new otp`, async () => {
    const otp1 = await AuthOTP.findOne({
      where: { userId, type: 'phone' },
      raw,
    });

    await request
      .patch(`${BASE_URL}/resend`)
      .auth(jwt, { type: 'bearer' })
      .expect(200);

    const otp2 = await AuthOTP.findOne({
      where: { userId, type: 'phone' },
      raw,
    });

    expect(otp1?.otpId).not.toBe(otp2?.otpId);
  });

  it(`PATCH ${BASE_URL}/:otp should fail to verify phone number on invalid otp`, async () => {
    let phone = await PhoneNumber.findOne({
      where: { userId, phoneNumber, status: 'pending' },
      raw,
    });
    expect(phone).not.toBeNull();

    await request
      .patch(`${BASE_URL}/01010`)
      .auth(jwt, { type: 'bearer' })
      .expect(401);

    phone = await PhoneNumber.findOne({
      where: { userId, phoneNumber, status: 'pending' },
      raw,
    });
    expect(phone).not.toBeNull();
  });

  it(`PATCH ${BASE_URL}/:otp should verify phone number on valid otp`, async () => {
    let phone = await PhoneNumber.findOne({
      where: { userId, phoneNumber, status: 'pending' },
      raw,
    });
    expect(phone).not.toBeNull();

    let otp = await AuthOTP.findOne({
      where: { userId, type: 'phone' },
      raw,
    });

    expect(otp).not.toBeNull();

    await request
      .patch(`${BASE_URL}/${mockOTP}`)
      .auth(jwt, { type: 'bearer' })
      .expect(200);

    phone = await PhoneNumber.findOne({
      where: { userId, phoneNumber, status: 'active' },
      raw,
    });
    expect(phone).not.toBeNull();

    otp = await AuthOTP.findOne({
      where: { userId, type: 'phone' },
      raw,
    });
    expect(otp).toBeNull();
  });

  it(`DELETE ${BASE_URL} should delete phone number`, async () => {
    let phone = await PhoneNumber.findOne({ where: { userId }, raw });
    expect(phone).not.toBeNull();

    await request
      .delete(`${BASE_URL}`)
      .auth(jwt, { type: 'bearer' })
      .expect(200);

    phone = await PhoneNumber.findOne({ where: { userId }, raw });
    expect(phone).toBeNull();
  });
});
