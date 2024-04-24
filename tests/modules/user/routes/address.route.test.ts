import { Address, CustomerAddress } from '@app/modules/user/models';
import tokenService from '@app/modules/user/services/token.service';

import { request } from 'tests/supertest.helper';
import { createCustomer } from '../helper-functions';

import 'tests/db-setup';

const BASE_URL = '/api/customers/me/addresses';

describe('Address management', () => {
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
    jwt = tokenService.generateAccessToken(email.email, 'email');
  });

  beforeEach(async () => {
    await Address.destroy({ where: {} });
  });

  it(`GET ${BASE_URL} should get user's addresses`, async () => {
    const addressData = [
      {
        placeId: '579432985',
        name: '1957 Kembery Drive',
        address: 'Roselle, IL',
      },
      {
        placeId: '9753298532',
        name: '1957 Kembery Drive',
        address: 'Roselle, IL',
      },
    ];

    const result = await Address.bulkCreate(
      addressData.map((data) => ({ customerId, ...data })),
    );

    await CustomerAddress.bulkCreate(
      result.map(({ addressId }) => ({ customerId, addressId })),
    );

    const response = await request.get(BASE_URL).auth(jwt, { type: 'bearer' });

    expect(response.status).toBe(200);
    expect(response.body.addresses.length).toBe(2);
  });

  it(`POST ${BASE_URL} should create a new address`, async () => {
    const data = {
      placeId: '57547845',
      name: '1957 Kembery Drive',
      address: 'Roselle, IL',
    };

    await request
      .post(BASE_URL)
      .auth(jwt, { type: 'bearer' })
      .send(data)
      .expect(200);

    const address = await Address.findOne({
      where: { placeId: data.placeId },
      raw: true,
    });
    expect(address).not.toBeNull();
  });

  it(`PATCH ${BASE_URL}/id should update address`, async () => {
    const { addressId } = await Address.create({
      placeId: '83047983157319',
      name: '1957 Kembery Drive',
      address: 'Roselle, IL',
    });

    await CustomerAddress.create({ customerId, addressId });

    const data = {
      placeId: '8759258223',
      name: '4829 West Drive',
      address: 'Rockford, IL',
    };

    await request
      .patch(`${BASE_URL}/${addressId}`)
      .auth(jwt, { type: 'bearer' })
      .send(data)
      .expect(200);

    const address = await Address.findOne({
      where: { addressId, placeId: data.placeId },
      raw: true,
    });
    expect(address).not.toBeNull();
  });

  it(`DELETE ${BASE_URL}/id should delete address`, async () => {
    const { addressId } = await Address.create({
      placeId: '97847183970',
      name: '1957 Kembery Drive',
      address: 'Roselle, IL',
    });

    await CustomerAddress.create({ customerId, addressId });

    await request
      .delete(`${BASE_URL}/${addressId}`)
      .auth(jwt, { type: 'bearer' })
      .expect(200);

    const address = await Address.findByPk(addressId, { raw: true });
    expect(address).toBeNull();
  });
});
