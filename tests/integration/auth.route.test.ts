import { User } from '../../src/models';
import '../utils/db-setup';
import { request } from '../utils/supertest.helper';

const BASE_URL = '/api/auth';

describe('Authentication', () => {
  const data = {
    firstName: 'Jessica',
    lastName: 'Doe',
    email: 'jessicadoe@gmail.com',
    password: 'jessicaD0epa$$',
  };

  it(`POST ${BASE_URL}/register`, async () => {
    await request
      .post(`${BASE_URL}/register`)
      .send(data)
      .expect(200)
      .then(async () => {
        const user = await User.findOne({ where: { email: data.email } });
        expect(user).not.toBeNull();
      });

    await request.post(`${BASE_URL}/register`).send(data).expect(409);
  });

  it(`POST ${BASE_URL}/login`, async () => {
    await request
      .post(`${BASE_URL}/login`)
      .send({ email: data.email, password: data.password })
      .expect(200)
      .then((response) => {
        const cookies = response.headers['set-cookie'];
        const token = getTokenFrom(cookies);
        expect(token).not.toEqual('');
      });

    await request
      .post(`${BASE_URL}/login`)
      .send({ email: data.email, password: 'wrong-password' })
      .expect(401)
      .then((response) => {
        const cookies = response.headers['set-cookie'];
        const token = getTokenFrom(cookies);
        expect(token).toEqual('');
      });
  });

  it(`POST ${BASE_URL}/logout`, async () => {
    await request
      .post(`${BASE_URL}/logout`)
      .expect(200)
      .then((response) => {
        const cookies = response.headers['set-cookie'];
        const token = getTokenFrom(cookies);
        expect(token).toEqual('');
      });
  });
});

/********************* HELPER FUNCTION *********************/
const getTokenFrom = (cookies: string[]) => {
  if (!cookies) return '';

  const cookie = cookies.find((c) => c.includes('access-token'));

  if (!cookie) return '';

  return cookie.split(';')[0].split('=')[1];
};
