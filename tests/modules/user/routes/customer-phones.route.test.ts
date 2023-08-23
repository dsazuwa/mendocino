import { CustomerOTP, CustomerPhone, Phone } from '@user/models';
import authService from '@user/services/auth.service';

import { createCustomer } from 'tests/modules/user/helper-functions';
import { request } from 'tests/supertest.helper';

import 'tests/db-setup';

const BASE_URL = '/api/customers/me/phone';
const raw = true;

describe('Phone number management', () => {
  const mockOTP = '12345';
  const phoneNumber = '1234567890';

  let customerId: number;
  let jwt: string;

  beforeAll(async () => {
    const { customer, email } = await createCustomer(
      'Jamal',
      'Doe',
      'jamaldoe@gmail.com',
      'jamalD0ePa$$',
      'active',
    );

    customerId = customer.customerId;
    jwt = authService.generateJWT(email.email, 'email');
  });

  it(`POST ${BASE_URL} should register a new phone number`, async () => {
    let phone = await Phone.findOne({ where: { phoneNumber }, raw });
    let customerPhone = await CustomerPhone.findOne({
      where: { customerId },
      raw,
    });
    let otp = await CustomerOTP.findOne({
      where: { customerId, type: 'phone' },
      raw,
    });

    expect(phone).toBeNull();
    expect(customerPhone).toBeNull();
    expect(otp).toBeNull();

    await request
      .post(BASE_URL)
      .send({ phoneNumber })
      .auth(jwt, { type: 'bearer' })
      .expect(200);

    phone = await Phone.findOne({
      where: { phoneNumber },
      raw,
    });
    customerPhone = await CustomerPhone.findOne({
      where: { customerId },
      raw,
    });
    otp = await CustomerOTP.findOne({
      where: { customerId, type: 'phone' },
      raw,
    });

    expect(phone).not.toBeNull();
    expect(customerPhone).not.toBeNull();
    expect(otp).not.toBeNull();
  });

  it(`PATCH ${BASE_URL}/resend should create a new otp`, async () => {
    const otp1 = await CustomerOTP.findOne({
      where: { customerId, type: 'phone' },
      raw,
    });

    await request
      .patch(`${BASE_URL}/resend`)
      .auth(jwt, { type: 'bearer' })
      .expect(200);

    const otp2 = await CustomerOTP.findOne({
      where: { customerId, type: 'phone' },
      raw,
    });

    expect(otp1?.otpId).not.toBe(otp2?.otpId);
  });

  it(`PATCH ${BASE_URL}/:otp should fail to verify phone number on invalid otp`, async () => {
    let phone = await CustomerPhone.findOne({
      where: { customerId, status: 'pending' },
      raw,
    });
    expect(phone).not.toBeNull();

    await request
      .patch(`${BASE_URL}/01010`)
      .auth(jwt, { type: 'bearer' })
      .expect(401);

    phone = await CustomerPhone.findOne({
      where: { customerId, status: 'pending' },
      raw,
    });
    expect(phone).not.toBeNull();
  });

  it(`PATCH ${BASE_URL}/:otp should verify phone number on valid otp`, async () => {
    let phone = await CustomerPhone.findOne({
      where: { customerId, status: 'pending' },
      raw,
    });
    expect(phone).not.toBeNull();

    let otp = await CustomerOTP.findOne({
      where: { customerId, type: 'phone' },
      raw,
    });

    expect(otp).not.toBeNull();

    await request
      .patch(`${BASE_URL}/${mockOTP}`)
      .auth(jwt, { type: 'bearer' })
      .expect(200);

    phone = await CustomerPhone.findOne({
      where: { customerId, status: 'active' },
      raw,
    });
    expect(phone).not.toBeNull();

    otp = await CustomerOTP.findOne({
      where: { customerId, type: 'phone' },
      raw,
    });
    expect(otp).toBeNull();
  });

  it(`DELETE ${BASE_URL} should delete phone number`, async () => {
    let phone = await CustomerPhone.findOne({ where: { customerId }, raw });
    expect(phone).not.toBeNull();

    await request
      .delete(`${BASE_URL}`)
      .auth(jwt, { type: 'bearer' })
      .expect(200);

    phone = await CustomerPhone.findOne({ where: { customerId }, raw });
    expect(phone).toBeNull();
  });
});
