import { Token, User } from '../../src/models';
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

describe('Password Recover', () => {
  const data = {
    firstName: 'Janet',
    lastName: 'Doe',
    email: 'janetdoe@gmail.com',
    password: 'janetD0epa$$',
  };

  let user: User;

  beforeAll(async () => {
    user = await User.create(data);
  });

  it('POST /me/recover should create a new recover token', async () => {
    await request.post(`${BASE_URL}/recover`).send({ email: user.email }).expect(200);

    const code = await Token.findOne({ where: { userId: user.id, type: 'password' } });
    expect(code).not.toBeNull();

    await request.post(`${BASE_URL}/recover`).send({ email: user.email }).expect(200);

    const newCode = await Token.findOne({ where: { userId: user.id, type: 'password' } });
    expect(newCode).not.toBeNull();
    expect(newCode?.id).not.toEqual(code?.id);
  });

  it('PUT /recover/:code should fail on invalid password', async () => {
    await request
      .put(`${BASE_URL}/recover/:code`)
      .send({ email: user.email, password: 'newpassword' })
      .expect(400);
  });

  it('PUT /recover/:code should fail on invalid code', async () => {
    await request
      .put(`${BASE_URL}/recover/0111`)
      .send({ email: user.email, password: 'janetsNewD0epa$$' })
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual('Invalid code');
      });
  });

  it('PUT /recover/:code should fail on expired code', async () => {
    await Token.destroy({ where: { userId: user.id, type: 'password' } });

    const code = await Token.create({
      userId: user.id,
      type: 'password',
      code: Token.generateCode(),
      expiresAt: new Date(),
    });

    await request
      .put(`${BASE_URL}/recover/${code.code}`)
      .send({ email: user.email, password: 'janetsNewD0epa$$' })
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual('Invalid code');
      });
  });

  it('PUT /recover/:code should reset password ', async () => {
    await Token.destroy({ where: { userId: user.id, type: 'password' } });

    const code = await user.createToken({
      type: 'password',
      code: Token.generateCode(),
      expiresAt: Token.getExpiration(),
    });

    // Reset passoword
    await request
      .put(`${BASE_URL}/recover/${code.code}`)
      .send({ email: user.email, password: 'janetsNewD0epa$$' })
      .expect(200);

    // User should be able to login with new credentials
    await request
      .post(`/api/auth/login`)
      .send({ email: user.email, password: 'janetsNewD0epa$$' })
      .expect(200);

    // Recover code should now be invalid i.e. deleted
    const usedCode = await Token.findOne({ where: { userId: user.id, type: 'password' } });
    expect(usedCode).toBeNull();
  });
});
