import { Address } from '@user/models';
import addressService from '@user/services/address.service';
import authService from '@user/services/auth.service';
import { ROLES } from '@user/utils/constants';

import { createUserAccount } from 'tests/modules/user/helper-functions';
import { request } from 'tests/supertest.helper';

import 'tests/user.db-setup';

const BASE_URL = '/api/address';

describe('Address management', () => {
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

  beforeEach(async () => {
    await Address.destroy({ where: { userId } });
  });

  it(`GET ${BASE_URL} should get user's addresses`, async () => {
    const addressData = [
      {
        addressLine1: '123 Main St',
        addressLine2: null,
        city: 'Exampleville',
        state: 'CA',
        postalCode: '12345',
      },
      {
        addressLine1: '456 Elm Rd',
        addressLine2: 'Suite 789',
        city: 'Townsville',
        state: 'NY',
        postalCode: '67890',
      },
      {
        addressLine1: '789 Pine Ave',
        addressLine2: null,
        city: 'Cityburg',
        state: 'TX',
        postalCode: '54321',
      },
      {
        addressLine1: '101 Maple St',
        addressLine2: 'Unit 202',
        city: 'Villageville',
        state: 'FL',
        postalCode: '45678',
      },
      {
        addressLine1: '222 Oak Ln',
        addressLine2: null,
        city: 'Ruralville',
        state: 'KS',
        postalCode: '98765',
      },
    ];

    await Address.bulkCreate(addressData.map((data) => ({ userId, ...data })));

    const response = await request.get(BASE_URL).auth(jwt, { type: 'bearer' });

    expect(response.status).toBe(200);
    expect(response.body.addresses).toMatchObject(
      expect.arrayContaining(addressData),
    );
  });

  /* eslint-disable @typescript-eslint/no-unused-vars */

  it(`POST ${BASE_URL} should create a new address`, async () => {
    const data = {
      addressLine1: '222 Oak Ln',
      addressLine2: undefined,
      city: 'Ruralville',
      state: 'KS',
      postalCode: '98765',
    };

    await request
      .post(BASE_URL)
      .auth(jwt, { type: 'bearer' })
      .send(data)
      .expect(200);

    const { addressLine2, ...rest } = data;

    const address = await Address.findOne({
      where: { userId, ...rest },
      raw: true,
    });
    expect(address).not.toBeNull();
  });

  it(`POST ${BASE_URL} should fail to create address after reaching limit`, async () => {
    await Address.bulkCreate([
      {
        userId,
        addressLine1: '123 Main St',
        addressLine2: null,
        city: 'Exampleville',
        state: 'CA',
        postalCode: '12345',
      },
      {
        userId,
        addressLine1: '456 Elm Rd',
        addressLine2: 'Suite 789',
        city: 'Townsville',
        state: 'NY',
        postalCode: '67890',
      },
      {
        userId,
        addressLine1: '789 Pine Ave',
        addressLine2: null,
        city: 'Cityburg',
        state: 'TX',
        postalCode: '54321',
      },
      {
        userId,
        addressLine1: '101 Maple St',
        addressLine2: 'Unit 202',
        city: 'Villageville',
        state: 'FL',
        postalCode: '45678',
      },
      {
        userId,
        addressLine1: '222 Oak Ln',
        addressLine2: null,
        city: 'Ruralville',
        state: 'KS',
        postalCode: '98765',
      },
    ]);

    const data = {
      addressLine1: '64 Oak Ln',
      addressLine2: undefined,
      city: 'Rock Island',
      state: 'KS',
      postalCode: '98765',
    };

    const result = await addressService.createAddress(userId, data);
    expect(result).toBe(false);

    const { addressLine2, ...rest } = data;

    const address = await Address.findOne({
      where: { userId, ...rest },
      raw: true,
    });
    expect(address).toBeNull();
  });

  /* eslint-enable @typescript-eslint/no-unused-vars */

  it(`PATCH ${BASE_URL}/id should update address`, async () => {
    const { addressId } = await Address.create({
      userId,
      addressLine1: '222 Oak Ln',
      addressLine2: undefined,
      city: 'Ruralville',
      state: 'KS',
      postalCode: '98765',
    });

    const state = 'CA';

    await request
      .patch(`${BASE_URL}/${addressId}`)
      .auth(jwt, { type: 'bearer' })
      .send({ state })
      .expect(200);

    const address = await Address.findOne({
      where: { userId, addressId, state },
      raw: true,
    });
    expect(address).not.toBeNull();
  });

  it(`DELETE ${BASE_URL}/id should delete address`, async () => {
    const { addressId } = await Address.create({
      userId,
      addressLine1: '222 Oak Ln',
      addressLine2: undefined,
      city: 'Ruralville',
      state: 'KS',
      postalCode: '98765',
    });

    await request
      .delete(`${BASE_URL}/${addressId}`)
      .auth(jwt, { type: 'bearer' })
      .expect(200);

    const address = await Address.findByPk(addressId, { raw: true });
    expect(address).toBeNull();
  });
});
