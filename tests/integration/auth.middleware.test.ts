import { User } from '../../src/models';
import '../utils/db-setup';
import { request } from '../utils/supertest.helper';

describe('Authentication Middleware', () => {
  it('should authenticate the request with a valid access token', async () => {
    const user = await User.create({
      firstName: 'Jess',
      lastName: 'Doe',
      email: 'jessdoe@gmail.com',
      password: 'jessD0ePas$$',
    });

    const token = user.generateJWT();

    await request.get('/api/users/me').auth(token, { type: 'bearer' }).expect(200);
  });

  it('should return 401 Unauthorized for an invalid access token', async () => {
    await request.get('/api/users/me').auth('badtoken', { type: 'bearer' }).expect(401);

    await request.get('/api/users/me').expect(401);
  });

  it('should return 401 Unauthorized for a deactivated account', async () => {
    const user = await User.create({
      firstName: 'Jessica',
      lastName: 'Doe',
      email: 'jessicadoe@gmail.com',
      password: 'jessD0ePas$$',
      status: 'inactive',
    });

    const token = user.generateJWT();

    await request.get('/api/users/me').auth(token, { type: 'bearer' }).expect(401);
  });
});
