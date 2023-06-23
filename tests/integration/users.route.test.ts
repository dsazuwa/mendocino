import { Token, User } from '../../src/models';
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

describe('Password Reset', () => {
  const data = {
    firstName: 'Janet',
    lastName: 'Doe',
    email: 'janetdoe@gmail.com',
    password: 'janetD0epa$$',
  };

  let user: User;
  let token: string;

  beforeAll(async () => {
    user = await User.create(data);
    token = user.generateJWT();
  });

  it('POST /me/reset/ should create a new reset token', async () => {
    await request.post(`${BASE_URL}/me/reset`).auth(token, { type: 'bearer' }).expect(200);

    const code = await Token.findOne({ where: { userId: user.id, type: 'password' } });
    expect(code).not.toBeNull();

    await request.post(`${BASE_URL}/me/reset`).auth(token, { type: 'bearer' }).expect(200);
    const newCode = await Token.findOne({ where: { userId: user.id, type: 'password' } });
    expect(newCode).not.toBeNull();
    expect(newCode!.code).not.toEqual(code!.code);
  });

  it('PUT /me/reset/:code should fail on invalid password', async () => {
    await request
      .put(`${BASE_URL}/me/reset/:code`)
      .auth(token, { type: 'bearer' })
      .send({ password: 'newpassword' })
      .expect(400);
  });

  it('PUT /me/reset/:code should fail on invalid code', async () => {
    await request
      .put(`${BASE_URL}/me/reset/0111`)
      .auth(token, { type: 'bearer' })
      .send({ password: 'janetsNewD0epa$$' })
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual('Invalid code');
      });
  });

  it('PUT /me/reset/:code should fail on expired code', async () => {
    await Token.destroy({ where: { userId: user.id, type: 'password' } });

    const code = await Token.create({
      userId: user.id,
      type: 'password',
      code: Token.generateCode(),
      expiresAt: new Date(),
    });

    await request
      .put(`${BASE_URL}/me/reset/${code.code}`)
      .auth(token, { type: 'bearer' })
      .send({ password: 'janetsNewD0epa$$' })
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual('Invalid code');
      });
  });

  it('PUT /me/reset/:code should reset password ', async () => {
    await Token.destroy({ where: { userId: user.id, type: 'password' } });

    const code = await user.createToken({
      type: 'password',
      code: Token.generateCode(),
      expiresAt: Token.getExpiration(),
    });

    // Reset passoword
    await request
      .put(`${BASE_URL}/me/reset/${code.code}`)
      .auth(token, { type: 'bearer' })
      .send({ password: 'janetsNewD0epa$$' })
      .expect(200);

    // User should be able to login with new credentials
    await request.post(`/api/auth/login`).send({ email: user.email, password: 'janetsNewD0epa$$' }).expect(200);

    // Reset code should now be invalid i.e. deleted
    const usedCode = await Token.findOne({ where: { userId: user.id, type: 'password' } });
    expect(usedCode).toBeNull();
  });
});
