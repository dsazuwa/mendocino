import { User } from '../../src/models';
import '../utils/db-setup';
import { request } from '../utils/supertest.helper';

const BASE_URL = '/api/users';

describe('User Verification', () => {
  const data = {
    firstName: 'Joyce',
    lastName: 'Doe',
    email: 'joycedoe@gmail.com',
    password: 'joyceD0epa$$',
  };

  let user: User;
  let token: string;

  beforeAll(async () => {
    user = await User.create(data);
    token = user.generateJWT();
  });

  it('should create a new verification token', async () => {
    await request.post(`${BASE_URL}/me/verify`).auth(token, { type: 'bearer' }).expect(200);
  });

  it('should fail on invalid code', async () => {
    await request
      .put(`${BASE_URL}/me/verify/evrecercrcode`)
      .auth(token, { type: 'bearer' })
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual('Invalid code');
      });
  });

  it('should verify user ', async () => {
    const code = (await user.getTokens())[0].code;

    await request.put(`${BASE_URL}/me/verify/${code}`).auth(token, { type: 'bearer' }).expect(200);

    const retrievedUser = await User.findOne({ where: { email: data.email } });
    expect(retrievedUser!.status).toEqual('active');
  });
});
